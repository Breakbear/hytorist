import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { getPortalSections } from '../../content/portal'
import { visualAssets } from '../../content/visualAssets'
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
  const [siteResources, setSiteResources] = useState<SiteResourcesResponse | null>(null)

  const page = useMemo(() => mergeHomeCopy(copy.home, homeOverride), [copy.home, homeOverride])
  const showcase = page.featuredProducts.slice(0, 3)
  const portalSections = useMemo(() => getPortalSections(locale), [locale])
  const companySummary = getVerifiedSummary(locale, siteResources?.verifiedPages?.companyProfile)
  const engineeringSummary = getVerifiedSummary(locale, siteResources?.verifiedPages?.engineeringService)
  const messageSummary = getVerifiedSummary(locale, siteResources?.verifiedPages?.messagePage)

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
        label: page.nextMoveEyebrow,
        title: isZh ? '提交工况进入对接' : page.nextMoveTitle,
        description:
          messageSummary ||
          getHeroLeadText(
            page.nextMoveText,
            isZh
              ? '提交工况、交付时间与服务范围后，站内统一进入技术或商务对接。'
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

  useEffect(() => {
    let cancelled = false

    const fetchSiteResources = async () => {
      try {
        const response = await axios.get<SiteResourcesResponse>('/api/site-resources')
        if (!cancelled) {
          setSiteResources(response.data)
        }
      } catch {
        if (!cancelled) {
          setSiteResources(null)
        }
      }
    }

    void fetchSiteResources()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 5500)

    return () => window.clearInterval(timer)
  }, [heroSlides.length])

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
  const productCategoryText =
    productCategoryCount > 0
      ? isZh
        ? `已整理 ${productCategoryCount} 个设备分类，目录按工程方向展示。`
        : `The site currently organizes ${productCategoryCount} equipment categories by engineering direction.`
      : isZh
        ? '设备分类正在按已核实资料整理。'
        : 'Equipment categories are being organized from verified materials.'
  const caseCategoryText =
    caseCategoryCount > 0
      ? isZh
        ? `已整理 ${caseCategoryCount} 个应用分类，内容按场景入口展示。`
        : `The site currently organizes ${caseCategoryCount} application categories by scenario entry.`
      : isZh
        ? '应用分类正在按已核实资料整理。'
        : 'Application categories are being organized from verified materials.'
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
        ? '提交工况、交付时间与服务范围后，站内统一进入技术或商务对接。'
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
    ? ['项目沟通', '服务资质', '能力摘要']
    : ['Project Intake', 'Service Notes', 'Capability Summary']
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
    <div className="pb-16">
      <section className="relative -mt-24 min-h-[100svh] overflow-hidden bg-[#f6f1e8] sm:-mt-32 xl:-mt-[8.9rem]">
        {heroSlides.map((slide, index) => {
          const active = index === activeSlide
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                active ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="day-hero-image h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,248,242,0.94)_0%,rgba(251,248,242,0.78)_42%,rgba(251,248,242,0.22)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,248,242,0.22)_0%,rgba(251,248,242,0)_28%,rgba(251,248,242,0.56)_100%)]" />
            </div>
          )
        })}

        <div className="absolute inset-x-0 bottom-0 h-px bg-[#d7cfbf]" />

        <div className="relative section-wrap grid min-h-[100svh] grid-rows-[1fr_auto] gap-8 pb-12 pt-32 sm:gap-12 sm:pb-[4.5rem] sm:pt-44 xl:gap-16 xl:pb-20 xl:pt-60">
          <div className="flex items-center">
            <div className="hero-panel max-w-[54rem] py-10 sm:py-12 xl:py-16">
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#8f672b] sm:text-[14px]">
                {heroSlides[activeSlide]?.label}
              </p>
              <h1
                className={`mt-6 hero-display hero-display-home text-[#1f252d] ${
                  isZh ? 'hero-title-nowrap' : ''
                }`}
              >
                {heroSlides[activeSlide]?.title}
              </h1>
              <p className="hero-copy mt-8 max-w-[48rem] text-[1.04rem] leading-8 text-[#4e5966] sm:text-[1.16rem] sm:leading-9 xl:text-[1.2rem]">
                {heroSlides[activeSlide]?.description}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-6">
                <Link
                  to={buildLocalizedPath(locale, 'inquiry')}
                  className="inline-flex min-h-[56px] w-full items-center justify-center bg-[linear-gradient(135deg,#f0dfb0,#d7b66c_46%,#b9893d_100%)] px-8 py-4 text-[14px] font-semibold uppercase tracking-[0.1em] text-[#1a140a] shadow-[0_20px_40px_rgba(123,89,34,0.3)] transition-transform duration-300 hover:-translate-y-px sm:min-h-[60px] sm:w-auto sm:text-[15px]"
                >
                  {page.requestQuoteButton}
                </Link>
                <Link
                  to={`/${locale}/${portalSections.products.segment}`}
                  className="btn-secondary min-h-[56px] w-full px-8 text-[14px] tracking-[0.1em] sm:min-h-[60px] sm:w-auto sm:text-[15px]"
                >
                  {page.viewProductsButton}
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-8 border-t border-[#d7cfbf] pt-6 xl:grid-cols-[1fr_auto] xl:items-end">
            <div className="grid gap-6 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div key={`${metric.label}-${metric.value}`}>
                  <p className="font-display text-[3.15rem] leading-none text-[#1f252d] sm:text-[3.5rem]">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.12em] text-[#68717d] sm:text-[13px]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-5">
              {heroSlides.map((slide, index) => {
                const active = index === activeSlide
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className="group text-left"
                    aria-label={slide.title}
                  >
                    <span
                      className={`block h-[2px] w-16 transition-all duration-300 ${
                        active ? 'bg-[#c89b45]' : 'bg-[#a3acb8] group-hover:bg-[#707987]'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 xl:py-32">
        <div className="section-wrap grid gap-12 xl:grid-cols-[0.4fr_0.6fr]">
          <div>
            <p className="eyebrow">{page.brandEssenceTitle}</p>
            <h2 className="section-title-xl mt-4 max-w-[34rem]">
              {page.brandEssenceHeadline}
            </h2>
            <p className="section-copy section-copy-compact mt-7 max-w-none copy-clamp-4">
              {brandOverviewText}
            </p>
          </div>

          <div className="space-y-10">
            {page.designNotes.slice(0, 3).map((note, index) => (
              <article key={note.code} className={`${index > 0 ? 'border-t border-[#d7cfbf] pt-8' : ''}`}>
                <div className="grid gap-4 sm:grid-cols-[92px_1fr]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7b838f]">
                    {note.code}
                  </p>
                  <div>
                    <h3 className="section-title-lg">{note.title}</h3>
                    <p className="section-copy section-copy-wide mt-5 max-w-none copy-clamp-4">
                      {getHeroLeadText(note.description, note.description)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="-mx-4 mt-16 overflow-hidden bg-[#ebe4d7] sm:-mx-6 xl:-mx-8 2xl:-mx-10">
          <div className="section-wrap grid gap-10 xl:grid-cols-[1.06fr_0.94fr] xl:items-center">
            <div className="min-h-[240px] xl:min-h-[520px]">
              <img
                src={featureSpotlight}
                alt={page.brandFrameTitle}
                className="day-section-image h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="py-10 sm:py-12 xl:py-16">
              <p className="eyebrow">{page.brandFrameEyebrow}</p>
              <h3 className="section-title-xl mt-4 max-w-[34rem]">
                {page.brandFrameTitle}
              </h3>
              <p className="section-copy section-copy-compact mt-6 max-w-none">
                {brandSectionText}
              </p>
              <div className="mt-10 flex flex-wrap gap-6">
                <Link
                  to={`/${locale}/${portalSections.products.segment}`}
                  className="cta-link cta-link-primary"
                >
                  {page.viewProductsButton}
                </Link>
                <Link
                  to={buildLocalizedPath(locale, 'inquiry')}
                  className="cta-link cta-link-secondary"
                >
                  {page.requestQuoteButton}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 xl:py-32">
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
              className="inline-flex self-start border-b border-[#aeb7c1] pb-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#475260] transition-colors hover:border-[#c89b45] hover:text-[#1f252d] xl:self-auto"
            >
              {page.viewAllProductsButton}
            </Link>
          </div>

          <div className="mt-10 space-y-12 sm:mt-12 sm:space-y-[4.5rem]">
            {showcase.map((product, index) => {
              const reverse = index % 2 === 1
              return (
                <article
                  key={product.id}
                  className={`grid gap-8 border-t border-[#d7cfbf] pt-10 xl:grid-cols-[1.04fr_0.96fr] xl:items-center ${
                    reverse ? 'xl:[&>*:first-child]:order-2 xl:[&>*:last-child]:order-1' : ''
                  }`}
                >
                  <div className="art-image-frame">
                    <div className="aspect-[15/10] xl:min-h-[420px]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="day-section-image h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="max-w-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7b838f]">
                      {product.category}
                    </p>
                    <h3 className="section-title-xl mt-4 max-w-[30rem]">
                      {product.name}
                    </h3>
                    <p className="section-copy section-copy-compact mt-6 max-w-none copy-clamp-3">
                      {featuredProductNotes[index]}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-5">
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

      <section className="py-8 sm:py-10 xl:py-12">
        <div className="section-wrap">
          <div className="action-panel px-6 py-7 sm:px-8 sm:py-8 xl:px-10">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="eyebrow">{isZh ? '站内路径' : 'Site Path'}</p>
                <h2 className="section-title-lg mt-4 max-w-[34rem]">
                  {isZh ? '从查看能力到发起项目对接，用一条站内路径完成。' : 'Move from capability review to project intake in one on-site flow.'}
                </h2>
              </div>
              <p className="section-copy section-copy-compact max-w-none xl:text-right">
                {isZh
                  ? '把设备目录、应用场景和需求提交整合在同一条链路里，减少来回跳转。'
                  : 'Equipment review, application scenarios, and requirement submission are kept in one chain with fewer detours.'}
              </p>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-3">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.to} className="info-card block px-5 py-5 transition-colors hover:border-[#c89b45]/30">
                  <p className="meta-label">{action.title}</p>
                  <p className="meta-copy mt-3 copy-clamp-3">{action.text}</p>
                  <span className="cta-link cta-link-primary mt-5">
                    {isZh ? '继续进入' : 'Continue'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 xl:py-32">
        <div className="-mx-4 overflow-hidden bg-[#ece4d7] sm:-mx-6 xl:-mx-8 2xl:-mx-10">
          <div className="section-wrap grid gap-10 xl:grid-cols-[0.92fr_1.08fr] xl:items-stretch">
            <div className="py-8 sm:py-12 xl:py-16">
              <p className="eyebrow">{page.nextMoveEyebrow}</p>
              <h2 className="section-title-xl mt-4 max-w-[34rem]">
                {page.nextMoveTitle}
              </h2>
              <p className="section-copy section-copy-compact mt-6 max-w-none">
                {processSectionText}
              </p>

              <div className="mt-10 space-y-8">
                {page.processSteps.slice(0, 3).map((step, index) => (
                  <article
                    key={step.step}
                    className={`grid gap-4 sm:grid-cols-[92px_1fr] ${
                      index > 0 ? 'border-t border-[#d7cfbf] pt-8' : ''
                    }`}
                  >
                    <p className="font-display text-[2.8rem] leading-none text-[#8f672b]">{step.step}</p>
                    <div>
                      <h3 className="section-title-lg">{step.title}</h3>
                      <p className="section-copy mt-5 max-w-none">
                        {step.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="min-h-[240px] xl:min-h-[620px]">
              <img
                src={processSpotlight}
                alt={page.nextMoveTitle}
                className="day-section-image h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-20 sm:pt-24 xl:pt-32">
        <div className="relative -mx-4 overflow-hidden sm:-mx-6 xl:-mx-8 2xl:-mx-10">
          <img
            src={visualAssets.factoryFloor}
            alt={copy.header.brandName}
            className="day-hero-image-soft absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,248,242,0.94)_0%,rgba(251,248,242,0.8)_42%,rgba(251,248,242,0.42)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,248,242,0.16)_0%,rgba(251,248,242,0.08)_30%,rgba(251,248,242,0.58)_100%)]" />

          <div className="section-wrap relative py-20 sm:py-28 xl:py-32">
            <div className="max-w-3xl">
              <p className="eyebrow">{isZh ? '项目沟通' : 'Project Contact'}</p>
              <h2 className="mt-4 hero-display hero-display-compact text-[#1f252d] xl:text-[4.45rem]">
                {isZh ? '提交工况，进入技术或商务对接。' : 'Submit your operating condition for technical or commercial follow-up.'}
              </h2>
              <p className="section-copy section-copy-compact mt-7 text-[#4e5966]">
                {processSectionText}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link to={buildLocalizedPath(locale, 'inquiry')} className="btn-primary w-full sm:w-auto">
                  {page.requestQuoteButton}
                </Link>
                <Link to={buildLocalizedPath(locale, 'contact')} className="btn-secondary w-full sm:w-auto">
                  {page.contactButtonLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[4.5rem] sm:py-[5.5rem] xl:py-28">
        <div className="section-wrap grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="panel px-6 py-7 sm:px-8 sm:py-8">
            <p className="eyebrow">{isZh ? '资料摘要' : 'Resource Summary'}</p>
            <h2 className="section-title-lg mt-4">
              {isZh
                ? '围绕项目沟通、服务资质与能力信息统一整理。'
                : 'Project intake, service credentials, and capability notes organized in one place.'}
            </h2>
            <p className="section-copy section-copy-compact mt-5 max-w-none">
              {isZh
                ? '这组内容用于帮助访客快速理解沟通方式、资质说明和服务摘要，不再展示外部网站入口。'
                : 'This block helps visitors understand contact flow, qualification notes, and service highlights without exposing external site links.'}
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
            <article className="panel px-6 py-7 sm:px-8">
              <p className="eyebrow">{isZh ? '留言规则' : 'Message Rules'}</p>
              <p className="section-copy mt-5 max-w-none copy-clamp-4">
                {messageSummary || messageRuleText}
              </p>
            </article>

            <article className="panel px-6 py-7 sm:px-8">
              <p className="eyebrow">{isZh ? '设备分类' : 'Equipment Categories'}</p>
              <p className="section-copy mt-5 max-w-none copy-clamp-4">{productCategoryText}</p>
            </article>

            <article className="panel px-6 py-7 sm:px-8">
              <p className="eyebrow">{isZh ? '应用分类' : 'Application Categories'}</p>
              <p className="section-copy mt-5 max-w-none copy-clamp-4">{caseCategoryText}</p>
            </article>

            <article className="panel px-6 py-7 sm:px-8">
              <p className="eyebrow">{isZh ? '资质资料' : 'Certificate Reference'}</p>
              <p className="section-copy mt-5 max-w-none copy-clamp-4">
                {certificate
                  ? certificate.title
                  : isZh
                    ? '证书资料已纳入统一资料池，可在联系页与后台资料池中统一维护。'
                    : 'Certificate notes are included in the shared resource pool and maintained consistently across the site.'}
              </p>
            </article>

            {verifiedHighlights.length > 0 && (
              <article className="panel px-6 py-7 sm:px-8 md:col-span-2">
                <p className="eyebrow">{isZh ? '能力摘要' : 'Capability Notes'}</p>
                <div className="mt-5 grid gap-6">
                  {verifiedHighlights.map((item) => (
                    <div key={`${item.title}-${item.sourcePageUrl}`} className="border-t border-[#d7cfbf] pt-5 first:border-t-0 first:pt-0">
                      <h3 className="text-[1.12rem] font-semibold text-[#1f252d] sm:text-[1.18rem]">
                        {item.title}
                      </h3>
                      <p className="section-copy mt-3 max-w-none copy-clamp-4">
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
