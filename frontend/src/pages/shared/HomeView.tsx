import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ZoomableImage from '../../components/ZoomableImage'
import { getPortalSections } from '../../content/portal'
import { visualAssets } from '../../content/visualAssets'
import useSiteResources from '../../hooks/useSiteResources'
import { buildLocalizedPath } from '../../i18n/routes'
import type { HomeCopy, Locale, SiteCopy } from '../../i18n/types'
import { usePageSeo } from '../../i18n/usePageSeo'

interface HomeViewProps {
  locale: Locale
  copy: SiteCopy
}

interface CmsHomeOverrideResponse {
  locale: Locale
  sectionKey: string
  pageId: string
  content: Partial<HomeCopy>
  updatedAt?: string
}

interface SiteResourcesResponse {
  certificates?: Array<{
    title: string
    sourcePageUrl: string
    imageUrl: string
  }>
  productCategories?: Array<{
    key: string
    label: string
    labelEn?: string
    publicItemCount?: number
    summary?: string
    summaryEn?: string
  }>
  caseCategories?: Array<{
    key: string
    label: string
    labelEn?: string
    publicItemCount?: number
  }>
  messageForm?: {
    requiredFields?: string[]
    categoryOptions?: Array<{
      value: string
      labelZh: string
      labelEn: string
    }>
  }
  verifiedPages?: Record<
    string,
    VerifiedPageNote
  >
  uiNarratives?: {
    home?: {
      sitePathLeadZh?: string
      sitePathLeadEn?: string
      sitePathHintZh?: string
      sitePathHintEn?: string
      resourceLeadZh?: string
      resourceLeadEn?: string
      resourceHintZh?: string
      resourceHintEn?: string
    }
  }
}

interface VerifiedPageNote {
  title: string
  sourcePageUrl: string
  summary: string
  summaryEn?: string
}

const getVerifiedSummary = (locale: Locale, item: VerifiedPageNote | undefined) => {
  if (!item) {
    return ''
  }

  if (locale === 'zh') {
    return item.summary
  }

  return item.summaryEn || item.summary
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const mergeHomeCopy = (base: HomeCopy, override: Partial<HomeCopy> | null): HomeCopy => {
  if (!override) {
    return base
  }

  return {
    ...base,
    ...override,
    featuredProducts:
      Array.isArray(override.featuredProducts) && override.featuredProducts.length > 0
        ? override.featuredProducts
        : base.featuredProducts,
    heroMetrics:
      Array.isArray(override.heroMetrics) && override.heroMetrics.length > 0
        ? override.heroMetrics
        : base.heroMetrics,
    designNotes:
      Array.isArray(override.designNotes) && override.designNotes.length > 0
        ? override.designNotes
        : base.designNotes,
    processSteps:
      Array.isArray(override.processSteps) && override.processSteps.length > 0
        ? override.processSteps
        : base.processSteps,
    curatedProductNotes:
      Array.isArray(override.curatedProductNotes) && override.curatedProductNotes.length > 0
        ? override.curatedProductNotes
        : base.curatedProductNotes
  }
}

const getHeroLeadText = (text: string, fallback: string) => {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) {
    return fallback
  }

  const sentenceMatch = normalized.match(/^(.+?[。！？!?])(?=\s|$)/)
  if (sentenceMatch) {
    return sentenceMatch[1]
  }

  return normalized.length > 88 ? `${normalized.slice(0, 88).trim()}...` : normalized
}

const getCategorySummary = (
  locale: Locale,
  item:
    | {
        summary?: string
        summaryEn?: string
      }
    | undefined
) => {
  if (!item) {
    return ''
  }

  if (locale === 'zh') {
    return item.summary || ''
  }

  return item.summaryEn || item.summary || ''
}

const getFeaturedCategoryKey = (name: string) => {
  const normalized = name.toLowerCase()

  if (name.includes('螺栓') || normalized.includes('bolting')) {
    return 'bolting'
  }
  if (name.includes('管道') || normalized.includes('pipeline') || normalized.includes('flange')) {
    return 'pipeline'
  }
  if (name.includes('现场机械') || name.includes('现场机加') || normalized.includes('machining')) {
    return 'machining'
  }

  return null
}

const HomeView = ({ locale, copy }: HomeViewProps) => {
  const isZh = locale === 'zh'
  const [homeOverride, setHomeOverride] = useState<Partial<HomeCopy> | null>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const siteResources = useSiteResources<SiteResourcesResponse>()

  const page = useMemo(() => mergeHomeCopy(copy.home, homeOverride), [copy.home, homeOverride])
  const showcase = page.featuredProducts.slice(0, 3)
  const portalSections = useMemo(() => getPortalSections(locale), [locale])
  const companySummary = getVerifiedSummary(locale, siteResources?.verifiedPages?.companyProfile)
  const engineeringSummary = getVerifiedSummary(locale, siteResources?.verifiedPages?.engineeringService)
  const messageSummary = getVerifiedSummary(locale, siteResources?.verifiedPages?.messagePage)
  const homeNarrative = siteResources?.uiNarratives?.home

  const heroMetrics =
    page.heroMetrics && page.heroMetrics.length > 0
      ? page.heroMetrics.slice(0, 3)
      : isZh
        ? [
            { value: '24H', label: '询盘响应' },
            { value: 'ISO9001', label: '质量体系' },
            { value: '北京', label: '服务基地' }
          ]
        : [
            { value: '24H', label: 'Inquiry Response' },
            { value: 'ISO9001', label: 'Quality System' },
            { value: 'Beijing', label: 'Service Base' }
          ]

  const heroSlides = useMemo(
    () => [
      {
        id: 'overview',
        image: visualAssets.digitalScene,
        focusClass: 'hero-focus-overview',
        label: isZh ? '工业装配与检修' : 'Industrial Assembly and Maintenance',
        title: isZh ? '液压紧固与工业检修' : page.heroTitle,
        description:
          companySummary ||
          getHeroLeadText(
            page.heroSubtitle,
            isZh
              ? '围绕液压紧固、现场检修与工业装配需求，组织设备能力、工程服务与项目沟通入口。'
              : 'Equipment capability, engineering service, and project intake organized around hydraulic fastening, field maintenance, and industrial assembly.'
          )
      },
      {
        id: 'capability',
        image: showcase[0]?.image ?? visualAssets.windAssembly,
        focusClass: 'hero-focus-capability',
        label: page.brandFrameEyebrow,
        title: isZh ? '液压工具与工程交付' : page.brandFrameTitle,
        description:
          engineeringSummary ||
          getHeroLeadText(
            page.brandFrameText,
            isZh
              ? '按液压工具、工业装配和检修工况梳理设备方向，便于企业客户快速判断适配范围。'
              : 'Equipment directions are organized around hydraulic tools, industrial assembly, and maintenance scenarios for faster capability review.'
          )
      },
      {
        id: 'delivery',
        image: visualAssets.factoryFloor,
        focusClass: 'hero-focus-delivery',
        label: page.nextMoveEyebrow,
        title: isZh ? '提交工况进入对接' : page.nextMoveTitle,
        description:
          messageSummary ||
          getHeroLeadText(
            page.nextMoveText,
            isZh
              ? '提交工况、交付时间与服务范围后，将快速进入技术或商务对接。'
              : 'After you submit operating conditions, timing, and service scope, the site routes the request into technical or commercial follow-up.'
          )
      }
    ],
    [
      companySummary,
      engineeringSummary,
      messageSummary,
      isZh,
      page.brandFrameEyebrow,
      page.brandFrameText,
      page.brandFrameTitle,
      page.heroSubtitle,
      page.heroTitle,
      isZh,
      page.nextMoveEyebrow,
      page.nextMoveText,
      page.nextMoveTitle,
      showcase
    ]
  )

  const featureSpotlight = showcase[1]?.image ?? visualAssets.pipeline
  const processSpotlight = showcase[2]?.image ?? visualAssets.factoryFloor

  useEffect(() => {
    let cancelled = false

    const fetchHomeOverride = async () => {
      try {
        const response = await axios.get<CmsHomeOverrideResponse>(`/api/cms/page/${locale}/home/index`)
        if (!cancelled && isRecord(response.data?.content)) {
          setHomeOverride(response.data.content)
        }
      } catch {
        if (!cancelled) {
          setHomeOverride(null)
        }
      }
    }

    void fetchHomeOverride()

    return () => {
      cancelled = true
    }
  }, [locale])

  usePageSeo(locale, copy.seo.home)

  const messageRuleText = (() => {
    const categoryLabels = siteResources?.messageForm?.categoryOptions?.map((item) =>
      isZh ? item.labelZh : item.labelEn
    )
    const categories =
      categoryLabels && categoryLabels.length > 0
        ? categoryLabels.join(isZh ? ' / ' : ' / ')
        : isZh
          ? '产品咨询 / 技术咨询 / 投诉与建议 / 其他事项'
          : 'Product Inquiry / Technical Inquiry / Complaints and Suggestions / Other Topics'

    return isZh ? `留言规则统一覆盖 ${categories}。` : `Message rules cover ${categories}.`
  })()

  const certificate = siteResources?.certificates?.[0] ?? null
  const productCategoryCount = siteResources?.productCategories?.length || 0
  const caseCategoryCount = siteResources?.caseCategories?.length || 0
  const categoryCoverageText =
    productCategoryCount > 0 || caseCategoryCount > 0
      ? isZh
        ? `已覆盖 ${productCategoryCount} 个设备分类和 ${caseCategoryCount} 个应用分类，可按工程方向与应用场景快速查找。`
        : `The site now organizes ${productCategoryCount} equipment categories and ${caseCategoryCount} application categories by engineering direction and scenario entry.`
      : isZh
        ? '设备与应用分类持续更新中，欢迎按场景浏览或直接提交需求。'
        : 'Equipment and application categories are being continuously updated. You can browse by scenario or submit a requirement directly.'
  const serviceCommitmentText =
    getVerifiedSummary(locale, siteResources?.verifiedPages?.afterSales) ||
    (isZh
      ? '售后响应、现场支持与项目沟通由专人连续跟进。'
      : 'After-sales response, on-site support, and project communication are continuously handled by our team.')
  const credentialNoteText =
    certificate
      ? certificate.title
      : isZh
        ? '相关资质文件可在项目沟通阶段提供。'
        : 'Qualification documents can be provided during project communication.'
  const verifiedHighlights = [
    siteResources?.verifiedPages?.companyProfile,
    siteResources?.verifiedPages?.engineeringService
  ].filter((item): item is VerifiedPageNote => Boolean(item))
  const brandSectionText =
    engineeringSummary ||
    getHeroLeadText(
      page.brandFrameText,
      isZh
        ? '按液压工具、工业装配和检修工况梳理设备方向，便于企业客户快速判断适配范围。'
        : 'Equipment directions are organized around hydraulic tools, industrial assembly, and maintenance scenarios for faster capability review.'
    )
  const brandOverviewText =
    companySummary ||
    getHeroLeadText(
      page.brandFrameText,
      isZh
        ? '围绕液压紧固、现场检修和设备服务组织企业能力信息。'
        : 'Company capabilities are organized around hydraulic fastening, field maintenance, and equipment service.'
    )
  const processSectionText =
    messageSummary ||
    getHeroLeadText(
      page.nextMoveText,
      isZh
        ? '提交工况、交付时间与服务范围后，将快速进入技术或商务对接。'
        : 'After you submit operating conditions, timing, and service scope, the site routes the request into technical or commercial follow-up.'
    )
  const featuredProductNotes = showcase.map((product, index) => {
    const categoryKey = getFeaturedCategoryKey(product.name)
    const categorySummary = categoryKey
      ? getCategorySummary(locale, siteResources?.productCategories?.find((item) => item.key === categoryKey))
      : ''

    const note = categorySummary || page.curatedProductNotes[index] || page.nextMoveText
    return getHeroLeadText(note, note)
  })
  const summaryTags = isZh
    ? ['项目沟通', '分类覆盖', '服务承接']
    : ['Project Intake', 'Category Coverage', 'Service Delivery']
  const imagePreviewLabel = isZh ? '查看原图' : 'View Full Image'
  const imageCloseLabel = isZh ? '关闭原图' : 'Close Image'
  const heroLabelClass = 'label-accent text-[13px] sm:text-[14px]'
  const heroPrimaryButtonClass =
    'btn-primary min-h-[56px] w-full px-6 text-[14px] leading-[1.25] sm:min-h-[60px] sm:w-auto sm:px-8 sm:text-[15px]'
  const heroSecondaryButtonClass =
    'btn-secondary min-h-[56px] w-full px-6 text-[14px] leading-[1.25] sm:min-h-[60px] sm:w-auto sm:px-8 sm:text-[15px]'
  const activeHeroGuide = (() => {
    const activeHeroId = heroSlides[activeSlide]?.id
    if (activeHeroId === 'capability') {
      return isZh
        ? '本屏重点展示设备能力与工程交付范围，便于快速判断是否匹配当前工况。'
        : 'This section highlights equipment capability and delivery scope for quick fit evaluation.'
    }
    if (activeHeroId === 'delivery') {
      return isZh
        ? '本屏重点展示需求提交流程，帮助您从工况输入快速进入技术或商务对接。'
        : 'This section highlights the intake path from requirement input to technical or commercial follow-up.'
    }

    return isZh
      ? '本屏重点展示液压紧固、现场检修和工业装配三类核心能力。'
      : 'This section highlights hydraulic fastening, field maintenance, and industrial assembly capabilities.'
  })()
  const activeHeroTags = isZh
    ? ['液压紧固', '现场检修', '项目对接']
    : ['Hydraulic Bolting', 'Field Maintenance', 'Project Intake']
  const resourceSummaryCards = [
    {
      title: isZh ? '留言规则' : 'Message Rules',
      text: messageSummary || messageRuleText
    },
    {
      title: isZh ? '分类覆盖' : 'Category Coverage',
      text: categoryCoverageText
    },
    {
      title: isZh ? '服务与资质' : 'Service and Credentials',
      text: `${serviceCommitmentText} ${credentialNoteText}`.trim()
    }
  ]
  const compactResourceSummaryCards = resourceSummaryCards.map((card) => ({
    ...card,
    text: getHeroLeadText(card.text, card.text)
  }))
  const quickActions = isZh
    ? [
        {
          title: '查看设备目录',
          text: '按设备方向快速进入分类目录。',
          to: `/${locale}/${portalSections.products.segment}`
        },
        {
          title: '查看应用案例',
          text: '按工况场景进入应用分类。',
          to: `/${locale}/${portalSections.cases.segment}`
        },
        {
          title: '提交项目需求',
          text: '条件明确后直接发起项目对接。',
          to: buildLocalizedPath(locale, 'inquiry')
        }
      ]
    : [
        {
          title: 'View Equipment',
          text: 'Enter the equipment index by engineering direction.',
          to: `/${locale}/${portalSections.products.segment}`
        },
        {
          title: 'View Applications',
          text: 'Browse application categories by operating scenario.',
          to: `/${locale}/${portalSections.cases.segment}`
        },
        {
          title: 'Submit Requirement',
          text: 'Start project intake when scope and timing are clear.',
          to: buildLocalizedPath(locale, 'inquiry')
        }
      ]

  return (
    <div className="pb-16 sm:pb-20">
      <section className="section-wrap pt-4 sm:pt-6 xl:pt-8">
        <div className="panel panel-block overflow-hidden px-5 py-6 sm:px-8 sm:py-8 xl:px-10 xl:py-10">
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
            <div className="max-w-[40rem]">
              <p className={heroLabelClass}>{heroSlides[activeSlide]?.label}</p>
              <h1
                className={`mt-5 hero-display hero-display-home text-[#1f252d] ${
                  isZh ? '' : 'max-w-[15ch]'
                }`}
              >
                {heroSlides[activeSlide]?.title}
              </h1>
              <p className="hero-copy mt-5 max-w-[44rem] text-[1rem] leading-8 text-[#4f5a67] sm:mt-6 sm:text-[1.12rem] sm:leading-9">
                {heroSlides[activeSlide]?.description}
              </p>
              <p className="mt-5 max-w-[44rem] text-[0.96rem] leading-8 text-[#616b76] sm:text-[1rem]">
                {activeHeroGuide}
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {activeHeroTags.map((item) => (
                  <span key={item} className="summary-chip">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
                <Link to={buildLocalizedPath(locale, 'inquiry')} className={heroPrimaryButtonClass}>
                  {page.requestQuoteButton}
                </Link>
                <Link
                  to={`/${locale}/${portalSections.products.segment}`}
                  className={heroSecondaryButtonClass}
                >
                  {page.viewProductsButton}
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {heroMetrics.map((metric) => (
                  <article key={`${metric.label}-${metric.value}`} className="art-stat px-4 py-4 sm:px-5 sm:py-5">
                    <p className="font-display text-[2rem] leading-none text-[#1f252d] sm:text-[2.7rem]">
                      {metric.value}
                    </p>
                    <p className="metric-label mt-3 text-[12px] sm:text-[13px]">{metric.label}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="art-image-frame">
                <div className="aspect-[11/8] min-h-[260px] sm:min-h-[360px] xl:min-h-[460px]">
                  <ZoomableImage
                    src={heroSlides[activeSlide]?.image}
                    alt={heroSlides[activeSlide]?.title}
                    showHint={false}
                    hintVisibility="always"
                    previewLabel={imagePreviewLabel}
                    closeLabel={imageCloseLabel}
                    wrapperClassName="h-full w-full"
                    className={`day-hero-image h-full w-full object-cover ${heroSlides[activeSlide]?.focusClass}`}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {heroSlides.map((slide, index) => {
                  const active = index === activeSlide
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      aria-label={slide.title}
                      className={`art-card px-4 py-4 text-left transition-all sm:px-5 ${
                        active
                          ? 'border-[#405765]/24 bg-[rgba(64,87,101,0.08)] shadow-[0_14px_30px_rgba(64,87,101,0.08)]'
                          : 'hover:border-[#405765]/18'
                      }`}
                    >
                      <p className="label-accent text-[11px]">{slide.label}</p>
                      <p className="mt-3 text-[1rem] font-semibold leading-6 text-[#1f252d] sm:text-[1.04rem]">
                        {slide.title}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d7cfbf]/75 py-16 sm:py-24 xl:py-32">
        <div className="section-wrap grid gap-12 xl:grid-cols-[0.42fr_0.58fr] 2xl:grid-cols-[0.4fr_0.6fr]">
          <div>
            <p className="eyebrow">{page.brandEssenceTitle}</p>
            <h2 className="section-title-xl mt-4 max-w-[34rem]">
              {page.brandEssenceHeadline}
            </h2>
            <p className="section-copy section-copy-compact mt-7 max-w-none copy-clamp-4 copy-unclamp-lg copy-unclamp-mobile">
              {brandOverviewText}
            </p>
          </div>

          <div className="space-y-10">
            {page.designNotes.slice(0, 3).map((note, index) => (
              <article key={note.code} className={`${index > 0 ? 'border-t border-[#d7cfbf] pt-8' : ''}`}>
                <div className="grid gap-4 sm:grid-cols-[92px_1fr]">
                  <p className="label-muted text-[11px]">
                    {note.code}
                  </p>
                  <div>
                    <h3 className="subsection-title">{note.title}</h3>
                    <p className="section-copy section-copy-wide mt-5 max-w-none copy-clamp-4 copy-unclamp-lg copy-unclamp-mobile">
                      {getHeroLeadText(note.description, note.description)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel mt-12 overflow-hidden sm:mt-16">
          <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
            <div className="art-image-frame m-4 sm:m-6 xl:m-8">
              <div className="min-h-[240px] xl:min-h-[460px]">
                <ZoomableImage
                  src={featureSpotlight}
                  alt={page.brandFrameTitle}
                  previewLabel={imagePreviewLabel}
                  closeLabel={imageCloseLabel}
                  wrapperClassName="h-full w-full"
                  className="day-section-image h-full w-full bg-[#f3f0ea] object-contain p-3 sm:bg-transparent sm:p-0 sm:object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="px-5 pb-6 sm:px-8 sm:pb-8 xl:px-10 xl:pb-10 xl:pr-12 xl:pt-10">
              <p className="eyebrow">{page.brandFrameEyebrow}</p>
              <h3 className="subsection-title mt-4 max-w-[34rem]">{page.brandFrameTitle}</h3>
              <p className="section-copy section-copy-compact mt-6 max-w-none">{brandSectionText}</p>
              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-6">
                <Link to={`/${locale}/${portalSections.products.segment}`} className="cta-link cta-link-primary">
                  {page.viewProductsButton}
                </Link>
                <Link to={buildLocalizedPath(locale, 'inquiry')} className="cta-link cta-link-secondary">
                  {page.requestQuoteButton}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d7cfbf]/75 py-16 sm:py-24 xl:py-32">
        <div className="section-wrap">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="eyebrow">{page.featuredTitle}</p>
              <h2 className="section-title-xl mt-4 max-w-[34rem]">
                {page.curatedSelectionTitle}
              </h2>
            </div>
            <Link
              to={`/${locale}/${portalSections.products.segment}`}
              className="inline-kicker-link self-start xl:self-auto"
            >
              {page.viewAllProductsButton}
            </Link>
          </div>

          <div className="mt-8 space-y-10 sm:mt-12 sm:space-y-[4.5rem]">
            {showcase.map((product, index) => {
              const reverse = index % 2 === 1
              return (
                <article
                  key={product.id}
                  className={`grid gap-6 border-t border-[#d7cfbf] pt-8 sm:gap-8 sm:pt-10 xl:grid-cols-[1.04fr_0.96fr] xl:items-center ${
                    reverse ? 'xl:[&>*:first-child]:order-2 xl:[&>*:last-child]:order-1' : ''
                  }`}
                >
                  <div className="art-image-frame">
                    <div className="aspect-[4/3] min-h-[240px] sm:aspect-[15/10] sm:min-h-[220px] xl:min-h-[420px]">
                      <ZoomableImage
                        src={product.image}
                        alt={product.name}
                        previewLabel={imagePreviewLabel}
                        closeLabel={imageCloseLabel}
                        wrapperClassName="h-full w-full"
                        className="day-section-image h-full w-full bg-[#f1e9dc] object-contain p-3 sm:bg-transparent sm:p-0 sm:object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="max-w-2xl">
                    <p className="label-muted text-[11px]">
                      {product.category}
                    </p>
                    <h3 className="subsection-title mt-4 max-w-[30rem]">
                      {product.name}
                    </h3>
                    <p className="section-copy section-copy-compact mt-5 max-w-none copy-clamp-3 copy-unclamp-mobile">
                      {featuredProductNotes[index]}
                    </p>
                    <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-5">
                      <Link
                        to={buildLocalizedPath(locale, 'inquiry')}
                        className="cta-link cta-link-primary"
                      >
                        {page.requestQuoteButton}
                      </Link>
                      <Link
                        to={`/${locale}/${portalSections.products.segment}`}
                        className="cta-link cta-link-secondary"
                      >
                        {page.viewProductsButton}
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d7cfbf]/75 py-12 sm:py-16 xl:py-20">
        <div className="section-wrap">
          <div className="action-panel px-6 py-8 sm:px-8 sm:py-9 xl:px-10">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="eyebrow">{isZh ? '服务路径' : 'Service Path'}</p>
                <h2 className="subsection-title mt-4 max-w-[34rem]">
                  {isZh
                    ? homeNarrative?.sitePathLeadZh || '从能力了解、方案判断到项目沟通，一条路径即可完成。'
                    : homeNarrative?.sitePathLeadEn || 'From capability review to project communication, everything flows in one clear path.'}
                </h2>
              </div>
              <p className="section-copy section-copy-compact max-w-none xl:text-right">
                {isZh
                  ? homeNarrative?.sitePathHintZh || '可先查看设备与应用案例，再提交需求进入对接。'
                  : homeNarrative?.sitePathHintEn || 'Review equipment and applications first, then submit requirements for follow-up.'}
              </p>
            </div>

            <div className="mt-7 grid gap-4 sm:mt-8 sm:gap-6 xl:grid-cols-3">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.to} className="info-card content-card block transition-colors hover:border-[#c89b45]/30">
                  <p className="meta-label">{action.title}</p>
                  <p className="meta-copy mt-3 copy-clamp-3 copy-unclamp-mobile">{action.text}</p>
                  <span className="cta-link cta-link-primary mt-5">
                    {isZh ? '继续进入' : 'Continue'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d7cfbf]/75 py-16 sm:py-24 xl:py-32">
        <div className="panel overflow-hidden">
          <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:items-stretch">
            <div className="px-5 py-7 sm:px-8 sm:py-10 xl:px-10 xl:py-12">
              <p className="eyebrow">{page.nextMoveEyebrow}</p>
              <h2 className="section-title-xl mt-4 max-w-[34rem]">
                {page.nextMoveTitle}
              </h2>
              <p className="section-copy section-copy-compact mt-6 max-w-none">
                {processSectionText}
              </p>

              <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
                {page.processSteps.slice(0, 3).map((step, index) => (
                  <article
                    key={step.step}
                    className={`grid gap-4 sm:grid-cols-[92px_1fr] ${
                      index > 0 ? 'border-t border-[#d7cfbf] pt-8' : ''
                    }`}
                  >
                    <p className="font-display text-[2.8rem] leading-none text-[#8f672b]">{step.step}</p>
                    <div>
                      <h3 className="subsection-title">{step.title}</h3>
                      <p className="section-copy mt-5 max-w-none copy-clamp-4 copy-unclamp-lg copy-unclamp-mobile">
                        {getHeroLeadText(step.description, step.description)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="art-image-frame m-4 sm:m-6 xl:m-8">
              <div className="min-h-[240px] xl:min-h-[540px]">
                <ZoomableImage
                  src={processSpotlight}
                  alt={page.nextMoveTitle}
                  previewLabel={imagePreviewLabel}
                  closeLabel={imageCloseLabel}
                  wrapperClassName="h-full w-full"
                  className="day-section-image h-full w-full bg-[#f3f0ea] object-contain p-3 sm:bg-transparent sm:p-0 sm:object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d7cfbf]/75 pt-16 sm:pt-24 xl:pt-32">
        <div className="section-wrap">
          <div className="panel overflow-hidden">
            <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:items-center">
              <div className="px-5 py-8 sm:px-8 sm:py-10 xl:px-10 xl:py-12">
              <p className="eyebrow">{isZh ? '项目沟通' : 'Project Contact'}</p>
              <h2 className="section-title-xl mt-4 max-w-[42rem]">
                {isZh ? '提交工况，进入技术或商务对接。' : 'Submit your operating condition for technical or commercial follow-up.'}
              </h2>
              <p className="section-copy section-copy-compact mt-7 text-[#4e5966] copy-clamp-4 copy-unclamp-lg copy-unclamp-mobile">
                {processSectionText}
              </p>

              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link to={buildLocalizedPath(locale, 'inquiry')} className="btn-primary w-full sm:w-auto">
                  {page.requestQuoteButton}
                </Link>
                <Link to={buildLocalizedPath(locale, 'contact')} className="btn-secondary w-full sm:w-auto">
                  {page.contactButtonLabel}
                </Link>
              </div>
              </div>

              <div className="art-image-frame m-4 sm:m-6 xl:m-8">
                <div className="min-h-[240px] xl:min-h-[420px]">
                  <ZoomableImage
                    src={visualAssets.factoryFloor}
                    alt={copy.header.brandName}
                    showHint={false}
                    hintVisibility="always"
                    previewLabel={imagePreviewLabel}
                    closeLabel={imageCloseLabel}
                    wrapperClassName="h-full w-full"
                    className="day-hero-image-soft hero-focus-footer h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d7cfbf]/75 py-16 sm:py-[5.5rem] xl:py-28">
        <div className="section-wrap grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="panel content-card">
            <p className="eyebrow">{isZh ? '资料摘要' : 'Resource Summary'}</p>
            <h2 className="section-title-lg mt-4">
              {isZh
                ? homeNarrative?.resourceLeadZh || '围绕项目沟通、服务资质与能力信息统一整理。'
                : homeNarrative?.resourceLeadEn || 'Project intake, service credentials, and capability notes organized in one place.'}
            </h2>
            <p className="section-copy section-copy-compact mt-5 max-w-none copy-clamp-4 copy-unclamp-lg copy-unclamp-mobile">
              {isZh
                ? homeNarrative?.resourceHintZh || '这组内容用于帮助访客快速理解沟通方式、资质说明和服务摘要。'
                : homeNarrative?.resourceHintEn || 'This block helps visitors understand contact flow, qualification notes, and service highlights.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {summaryTags.map((item) => (
                <span key={item} className="summary-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>

            <div className="grid gap-6 md:grid-cols-2">
              {compactResourceSummaryCards.map((card) => (
                <article key={card.title} className="panel content-card">
                  <p className="eyebrow">{card.title}</p>
                  <p className="section-copy mt-5 max-w-none copy-clamp-4 copy-unclamp-lg copy-unclamp-mobile">{card.text}</p>
                </article>
              ))}

              {verifiedHighlights.length > 0 && (
                <article className="panel content-card md:col-span-2">
                  <p className="eyebrow">{isZh ? '能力摘要' : 'Capability Notes'}</p>
                  <div className="mt-5 grid gap-6">
                    {verifiedHighlights.map((item) => (
                      <div key={`${item.title}-${item.sourcePageUrl}`} className="border-t border-[#d7cfbf] pt-5 first:border-t-0 first:pt-0">
                        <h3 className="text-[1.12rem] font-semibold text-[#1f252d] sm:text-[1.18rem]">
                          {item.title}
                        </h3>
                        <p className="section-copy mt-3 max-w-none copy-clamp-4 copy-unclamp-lg">
                          {getVerifiedSummary(locale, item)}
                        </p>
                      </div>
                  ))}
                </div>
              </article>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomeView
