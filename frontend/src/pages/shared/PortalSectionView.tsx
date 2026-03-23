import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useLocation, useParams } from 'react-router-dom'
import DetailCardList from '../../components/DetailCardList'
import {
  getPortalSections,
  type PortalHeroData,
  type PortalPageData,
  type PortalSectionKey
} from '../../content/portal'
import { portalHeroVisuals } from '../../content/visualAssets'
import { buildLocalizedPath } from '../../i18n/routes'
import type { Locale, SeoEntry } from '../../i18n/types'
import { usePageSeo } from '../../i18n/usePageSeo'

interface PortalSectionViewProps {
  locale: Locale
  sectionKey: PortalSectionKey
}

interface CmsPageOverride {
  sectionKey: string
  pageId: string
  content: PortalPageData
  updatedAt?: string
}

interface CmsPagesResponse {
  locale: Locale
  pages: CmsPageOverride[]
}

interface SiteResourceMailbox {
  label: string
  labelEn?: string
  email: string
}

interface SiteResourceOption {
  value: string
  labelZh: string
  labelEn: string
}

interface SiteResourceNewsItem {
  id: number
  title: string
  date: string
  pageId?: string
}

interface SiteResourceNewsArticle {
  category?: string
  title: string
  date: string
  sourcePageUrl?: string
  imageUrl?: string
  paragraphs?: string[]
}

interface SiteResourceCategory {
  key: string
  label: string
  labelEn?: string
  publicItemCount?: number
  summary?: string
  summaryEn?: string
}

interface SiteResourcesResponse {
  source?: {
    homepageUrl?: string
  }
  contacts?: {
    company?: string
    address?: string
    postcode?: string
    phone?: string
    fax?: string
    email?: string
    website?: string
    hotline?: string
    mailboxes?: SiteResourceMailbox[]
  }
  contactAssets?: {
    wechatQrTitle?: string
    wechatQrImageUrl?: string
  }
  messageForm?: {
    requiredFields?: string[]
    categoryOptions?: SiteResourceOption[]
    privacyOptions?: SiteResourceOption[]
    noteZh?: string
    noteEn?: string
  }
  certificates?: Array<{
    title: string
    sourcePageUrl: string
    imageUrl: string
  }>
  productCategories?: SiteResourceCategory[]
  caseCategories?: SiteResourceCategory[]
  newsPages?: Record<
    string,
    {
      publicItemCount?: number
      items?: SiteResourceNewsItem[]
    }
  >
  newsArticles?: Record<string, SiteResourceNewsArticle>
  verifiedPages?: Record<
    string,
    {
      title: string
      sourcePageUrl: string
      summary: string
      summaryEn?: string
    }
  >
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const isPortalPageData = (value: unknown): value is PortalPageData => {
  return isRecord(value) && typeof value.title === 'string' && typeof value.kind === 'string'
}

const mergeValue = (base: unknown, override: unknown): unknown => {
  if (override === undefined || override === null) {
    return base
  }

  if (typeof base === 'string') {
    return typeof override === 'string' && override.trim() ? override.trim() : base
  }

  if (Array.isArray(base)) {
    if (!Array.isArray(override) || override.length === 0) {
      return base
    }
    if (base.length === 0) {
      return override
    }
    const template = base[0]
    return override.map((item, index) => mergeValue(base[index] ?? template, item))
  }

  if (isRecord(base) && isRecord(override)) {
    const result: Record<string, unknown> = { ...base }
    Object.keys(override).forEach((key) => {
      result[key] = key in base ? mergeValue(base[key], override[key]) : override[key]
    })
    return result
  }

  return override
}

const mergePageData = (base: PortalPageData, override: PortalPageData): PortalPageData => {
  if (base.kind !== override.kind) {
    return base
  }
  const merged = mergeValue(base, override) as PortalPageData
  merged.kind = base.kind
  return merged
}

const buildSectionPath = (
  locale: Locale,
  segment: string,
  pageId: string,
  defaultPageId: string
) => {
  return pageId === defaultPageId ? `/${locale}/${segment}` : `/${locale}/${segment}/${pageId}`
}

const formatDisplayDate = (locale: Locale, value: string) => {
  const match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (!match) {
    return value
  }

  const [, year, month, day] = match
  const monthNumber = Number(month)
  const dayNumber = Number(day)

  if (locale === 'zh') {
    return `${year}年${monthNumber}月${dayNumber}日`
  }

  const englishMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${englishMonths[monthNumber - 1] || month} ${dayNumber}, ${year}`
}

const getCategorySummary = (locale: Locale, item: SiteResourceCategory) => {
  if (locale === 'zh') {
    return item.summary || ''
  }

  return item.summaryEn || ''
}

const getVerifiedSummary = (
  locale: Locale,
  item:
    | {
        title: string
        sourcePageUrl: string
        summary: string
        summaryEn?: string
      }
    | undefined
) => {
  if (!item) {
    return ''
  }

  if (locale === 'zh') {
    return item.summary
  }

  return item.summaryEn || item.summary
}

const getMailboxLabel = (locale: Locale, item: SiteResourceMailbox) => {
  if (locale === 'zh') {
    return item.label || item.labelEn || ''
  }

  return item.labelEn || item.label || ''
}

const buildResourceOverviewSummary = (
  locale: Locale,
  sectionKey: 'products' | 'cases',
  categories: SiteResourceCategory[]
) => {
  const count = categories.length

  if (locale === 'zh') {
    return sectionKey === 'products'
      ? `当前页面按 ${count} 个已核实公开产品分类组织，完整保留液压动力、液压紧固、管道法兰、现场机加与风电运维等方向。`
      : `当前页面按 ${count} 个已核实公开应用分类组织，完整保留螺栓紧固、顶升平移、管道法兰、现场机加与风电运维等场景入口。`
  }

  return sectionKey === 'products'
    ? `This page is organized around ${count} verified public product categories, covering hydraulic power, bolting, pipeline and flange service, on-site machining, wind O&M, and related directions.`
    : `This page is organized around ${count} verified public application categories, covering bolting, lifting and positioning, pipeline and flange service, on-site machining, wind O&M, and related scenario entries.`
}

const buildResourcePager = (
  locale: Locale,
  sectionKey: 'products' | 'cases',
  count: number,
  publicItemCount?: number
) => {
  const labelZh = sectionKey === 'products' ? '产品分类' : '应用分类'
  const detailZh = sectionKey === 'products' ? '型号条目' : '案例条目'
  const labelEn = sectionKey === 'products' ? 'product categories' : 'application categories'
  const detailEn = sectionKey === 'products' ? 'model-level entries' : 'case-level entries'

  if (locale === 'zh') {
    return typeof publicItemCount === 'number' && publicItemCount > 0
      ? `${count} 个公开${labelZh}已接入，其中当前公开 ${publicItemCount} 条${detailZh}。`
      : `${count} 个公开${labelZh}已接入，当前公开页面未显示具体${detailZh}。`
  }

  return typeof publicItemCount === 'number' && publicItemCount > 0
    ? `All ${count} public ${labelEn} are connected, with ${publicItemCount} public ${detailEn} currently shown.`
    : `All ${count} public ${labelEn} are connected, while the public pages currently do not expose ${detailEn}.`
}

const getGridCategoryKey = (sectionKey: 'products' | 'cases', pageId: string) => {
  if (pageId === 'all') {
    return null
  }

  if (sectionKey === 'products' && pageId === 'pipe') {
    return 'pipeline'
  }

  return pageId
}

const getNewsCategoryLabel = (locale: Locale, category?: string) => {
  const labels: Record<string, { zh: string; en: string }> = {
    company: { zh: '公司新闻', en: 'Company News' },
    industry: { zh: '行业新闻', en: 'Industry News' },
    notice: { zh: '信息公示', en: 'Notices' }
  }

  const matched = category ? labels[category] : undefined
  if (!matched) {
    return locale === 'zh' ? '新闻中心' : 'News Center'
  }

  return locale === 'zh' ? matched.zh : matched.en
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

  return normalized.length > 72 ? `${normalized.slice(0, 72).trim()}...` : normalized
}

const getPageDescription = (page: PortalPageData, fallback: string) => {
  if (page.kind === 'article') {
    if (
      page.subtitle &&
      !page.subtitle.startsWith('发布时间：') &&
      !page.subtitle.startsWith('Published:') &&
      !page.subtitle.includes('公司新闻 ·') &&
      !page.subtitle.includes('Company News ·')
    ) {
      return page.subtitle
    }
    return page.paragraphs[0] || fallback
  }
  if (page.subtitle) {
    return page.subtitle
  }
  if (page.kind === 'grid') {
    return page.summary || page.items[0]?.title || fallback
  }
  if (page.kind === 'news') {
    return page.items[0]?.title || fallback
  }
  return page.details[0]?.value || fallback
}

const normalizeHero = (hero: PortalHeroData | undefined, fallback: PortalHeroData): PortalHeroData => {
  if (!hero) {
    return fallback
  }
  return {
    title: hero.title || fallback.title,
    subtitle: hero.subtitle || fallback.subtitle,
    image: hero.image || fallback.image,
    badges: hero.badges?.length ? hero.badges : fallback.badges,
    metrics: hero.metrics?.length ? hero.metrics : fallback.metrics
  }
}

const buildFallbackHero = (
  locale: Locale,
  sectionKey: PortalSectionKey,
  sectionLabel: string,
  pageLabel: string,
  page: PortalPageData
): PortalHeroData => ({
  title: page.title,
  subtitle:
    page.subtitle ||
    (page.kind === 'grid' ? page.summary : '') ||
    (locale === 'zh'
      ? `围绕 ${sectionLabel} 的工程场景、设备配置与服务交付组织信息。`
      : `Information for ${sectionLabel} structured around application scenarios and delivery.`),
  image: portalHeroVisuals[sectionKey],
  badges:
    locale === 'zh'
      ? [`栏目 ${sectionLabel}`, `页面 ${pageLabel}`, '工程交付体系']
      : [`Section ${sectionLabel}`, `Page ${pageLabel}`, 'Engineering Delivery'],
  metrics:
    locale === 'zh'
      ? [
          { label: '服务热线', value: '24H' },
          { label: '质量体系', value: 'ISO9001' },
          { label: '服务基地', value: '北京' }
        ]
      : [
          { label: 'Service Hotline', value: '24H' },
          { label: 'Quality System', value: 'ISO9001' },
          { label: 'Service Base', value: 'Beijing' }
        ]
})

const renderPager = (summary: string) => (
  <div className="border-t border-[#d7cfbf] pt-6">
    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7b838f]">{summary}</p>
  </div>
)

const buildContactDetailsFromResources = (
  locale: Locale,
  siteResources: SiteResourcesResponse | null
) => {
  const contacts = siteResources?.contacts
  if (!contacts) {
    return null
  }

  if (locale === 'zh') {
    return [
      { label: '地址', value: contacts.address || '' },
      { label: '邮编', value: contacts.postcode || '' },
      { label: '电话', value: contacts.phone || '' },
      { label: '传真', value: contacts.fax || '' },
      { label: '邮箱', value: contacts.email || '' },
      { label: '网址', value: contacts.website || siteResources?.source?.homepageUrl || '' },
      { label: '24小时热线', value: contacts.hotline || '' }
    ].filter((item) => item.value)
  }

  return [
    { label: 'Address', value: contacts.address || '' },
    { label: 'Postcode', value: contacts.postcode || '' },
    { label: 'Phone', value: contacts.phone || '' },
    { label: 'Fax', value: contacts.fax || '' },
    { label: 'Email', value: contacts.email || '' },
    { label: 'Website', value: contacts.website || siteResources?.source?.homepageUrl || '' },
    { label: 'Hotline', value: contacts.hotline || '' }
  ].filter((item) => item.value)
}

const buildMessageDetailsFromResources = (
  locale: Locale,
  page: Extract<PortalPageData, { kind: 'contact' }>,
  siteResources: SiteResourcesResponse | null
) => {
  const messageForm = siteResources?.messageForm
  if (!messageForm) {
    return page.details
  }

  const requiredFields = messageForm.requiredFields?.join(', ')
  const categoryText = messageForm.categoryOptions
    ?.map((item) => (locale === 'zh' ? item.labelZh : item.labelEn))
    .join(' / ')
  const privacyText = messageForm.privacyOptions
    ?.map((item) => (locale === 'zh' ? item.labelZh : item.labelEn))
    .join(' / ')

  if (locale === 'zh') {
    return [
      { label: '必填字段', value: requiredFields || 'name, phone, email, message' },
      { label: '问题类别', value: categoryText || '产品咨询 / 技术咨询 / 投诉与建议 / 其他事项' },
      { label: '信息设置', value: privacyText || '公开 / 保密' }
    ]
  }

  return [
    { label: 'Required Fields', value: requiredFields || 'name, phone, email, message' },
    {
      label: 'Message Categories',
      value: categoryText || 'Product Inquiry / Technical Inquiry / Complaints and Suggestions / Other Topics'
    },
    { label: 'Privacy Options', value: privacyText || 'Public / Confidential' }
  ]
}

const resolveContactPage = (
  locale: Locale,
  pageId: string,
  page: Extract<PortalPageData, { kind: 'contact' }>,
  siteResources: SiteResourcesResponse | null
): Extract<PortalPageData, { kind: 'contact' }> => {
  if (!siteResources) {
    return page
  }

  const contacts = siteResources.contacts
  const qrLabel = siteResources.contactAssets?.wechatQrTitle || page.qrLabel
  const qrImage = siteResources.contactAssets?.wechatQrImageUrl || page.qrImage

  if (pageId === 'info') {
    return {
      ...page,
      company: contacts?.company || page.company,
      subtitle: getVerifiedSummary(locale, siteResources?.verifiedPages?.contactInfo) || page.subtitle,
      details: buildContactDetailsFromResources(locale, siteResources) || page.details,
      mailboxes:
        (contacts?.mailboxes?.length
          ? contacts.mailboxes.map((item) => ({ label: getMailboxLabel(locale, item), email: item.email }))
          : page.mailboxes),
      qrLabel,
      qrImage
    }
  }

  return {
    ...page,
    subtitle:
      getVerifiedSummary(locale, siteResources?.verifiedPages?.messagePage) ||
      (locale === 'zh' ? siteResources?.messageForm?.noteZh : siteResources?.messageForm?.noteEn) ||
      page.subtitle,
    details: buildMessageDetailsFromResources(locale, page, siteResources),
    mailboxes:
      (contacts?.mailboxes?.length
        ? contacts.mailboxes.slice(0, 2).map((item) => ({ label: getMailboxLabel(locale, item), email: item.email }))
        : page.mailboxes),
    qrLabel,
    qrImage
  }
}

const resolveNewsPage = (
  locale: Locale,
  pageId: string,
  page: Extract<PortalPageData, { kind: 'news' }>,
  siteResources: SiteResourcesResponse | null
): Extract<PortalPageData, { kind: 'news' }> => {
  const resourcePage = siteResources?.newsPages?.[pageId]
  if (!resourcePage) {
    return page
  }

  const items =
    resourcePage.items?.length
      ? resourcePage.items.map((item) => ({
          id: item.id,
          title: item.title,
          date: item.date,
          pageId: item.pageId
        }))
      : page.items

  const publicItemCount = resourcePage.publicItemCount
  let pager = page.pager

  if (typeof publicItemCount === 'number') {
    if (publicItemCount > 0) {
      pager =
        locale === 'zh'
          ? `当前公开 ${page.title} ${publicItemCount} 条，已同步到新版站点。`
          : `There are currently ${publicItemCount} public ${page.title} entries synced to the new site.`
    } else {
      pager =
        locale === 'zh'
          ? `当前公开 ${page.title} 未显示条目。`
          : `No public ${page.title} entries are currently shown.`
    }
  }

  return {
    ...page,
    items,
    pager
  }
}

const resolveGridPage = (
  sectionKey: 'products' | 'cases',
  locale: Locale,
  pageId: string,
  page: Extract<PortalPageData, { kind: 'grid' }>,
  siteResources: SiteResourcesResponse | null
): Extract<PortalPageData, { kind: 'grid' }> => {
  const categories =
    sectionKey === 'products' ? siteResources?.productCategories : siteResources?.caseCategories

  if (!categories?.length) {
    return page
  }

  if (pageId === 'all') {
    const publicItemCount = categories.reduce((sum, item) => sum + (item.publicItemCount || 0), 0)
    const compactItems = page.items.map((item, index) => {
      const matchedCategory = categories[index]
      const resourceSummary = matchedCategory ? getCategorySummary(locale, matchedCategory) : ''

      return {
        ...item,
        description: resourceSummary || (item.description ? getHeroLeadText(item.description, item.description) : item.description)
      }
    })

    return {
      ...page,
      items: compactItems,
      summary: buildResourceOverviewSummary(locale, sectionKey, categories),
      pager: buildResourcePager(locale, sectionKey, categories.length, publicItemCount)
    }
  }

  const categoryKey = getGridCategoryKey(sectionKey, pageId)
  const matchedCategory = categories.find((item) => item.key === categoryKey)

  if (!matchedCategory) {
    return page
  }

  const resourceSummary = getCategorySummary(locale, matchedCategory)

  return {
    ...page,
    items: page.items.map((item) => ({
      ...item,
      description: resourceSummary || (item.description ? getHeroLeadText(item.description, item.description) : item.description)
    })),
    summary: resourceSummary || page.summary,
    pager: buildResourcePager(locale, sectionKey, 1, matchedCategory.publicItemCount)
  }
}

const buildNewsArticlePage = (
  locale: Locale,
  pageId: string,
  siteResources: SiteResourcesResponse | null
): Extract<PortalPageData, { kind: 'article' }> | null => {
  const article = siteResources?.newsArticles?.[pageId]
  if (!article || !article.title || !article.paragraphs?.length) {
    return null
  }

  return {
    kind: 'article',
    title: article.title,
    subtitle:
      locale === 'zh'
        ? `${getNewsCategoryLabel(locale, article.category)} · ${formatDisplayDate(locale, article.date)}`
        : `${getNewsCategoryLabel(locale, article.category)} · ${formatDisplayDate(locale, article.date)}`,
    paragraphs: article.paragraphs,
    image: article.imageUrl,
    imageAlt: article.title,
    sourcePageUrl: article.sourcePageUrl
  }
}

const getVerifiedHighlights = (
  sectionKey: PortalSectionKey,
  siteResources: SiteResourcesResponse | null
) => {
  const verifiedPages = siteResources?.verifiedPages
  if (!verifiedPages) {
    return []
  }

  const keyMap: Record<PortalSectionKey, string[]> = {
    about: ['companyProfile', 'culture'],
    manufacturing: ['manufacturing', 'testing'],
    products: ['rentalService'],
    engineering: ['engineeringService', 'rentalService'],
    cases: ['companyProfile'],
    support: ['afterSales', 'training'],
    news: [],
    hr: ['jobs'],
    contact: ['contactInfo', 'messagePage']
  }

  return keyMap[sectionKey]
    .map((key) => verifiedPages[key])
    .filter(
      (
        item
      ): item is {
        title: string
        sourcePageUrl: string
        summary: string
      } => Boolean(item)
    )
}

const renderArticle = (locale: Locale, page: Extract<PortalPageData, { kind: 'article' }>) => {
  const chapter = locale === 'zh' ? '段落' : 'Section'
  const leadParagraph = page.paragraphs[0] || ''
  const detailParagraphs = leadParagraph ? page.paragraphs.slice(1) : page.paragraphs

  return (
    <div className="space-y-12">
      {page.image && (
        <div className="art-image-frame">
          <div className="aspect-[16/8] xl:aspect-[21/8]">
            <img
              src={page.image}
              alt={page.imageAlt || page.title}
              className="day-section-image h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}

      <div className="art-surface rounded-[28px] px-6 py-7 sm:px-8 sm:py-9">
        <div className="flex flex-wrap gap-3">
          {page.subtitle && <span className="pill">{page.subtitle}</span>}
          <span className="pill">
            {locale === 'zh' ? `${page.paragraphs.length} 段正文` : `${page.paragraphs.length} Paragraphs`}
          </span>
        </div>
        {leadParagraph && (
          <p className="mt-5 max-w-5xl text-[1.08rem] leading-9 text-[#44505d] sm:text-[1.18rem] sm:leading-10 xl:text-[1.24rem]">
            {leadParagraph}
          </p>
        )}
      </div>

      {detailParagraphs.length > 0 && (
        <div className="space-y-10">
          {detailParagraphs.map((paragraph, index) => (
            <article
              key={`${page.title}-${index + 2}`}
              className="grid gap-5 border-t border-[#d7cfbf] pt-10 xl:grid-cols-[116px_1fr]"
            >
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7b838f]">
                  {chapter} {String(index + 2).padStart(2, '0')}
                </p>
              </div>
              <p className="max-w-5xl text-base leading-9 text-[#58616d] sm:text-[1.08rem]">
                {paragraph}
              </p>
            </article>
          ))}
        </div>
      )}

      {page.bullets && page.bullets.length > 0 && (
        <div className="border-t border-[#d7cfbf] pt-8">
          <p className="eyebrow">{locale === 'zh' ? '能力要点' : 'Capability Points'}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {page.bullets.map((item, index) => (
              <div key={item} className="art-card px-5 py-5 text-base leading-8 text-[#495461]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7b838f]">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="mt-3">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const renderGrid = (locale: Locale, page: Extract<PortalPageData, { kind: 'grid' }>) => (
  <div className="space-y-12">
    {page.summary && (
      <div className="section-copy section-copy-wide max-w-none copy-clamp-4">
        {page.summary}
      </div>
    )}

    <div className="space-y-14">
      {page.items.map((item, index) => {
        const leadText =
          item.description ||
          (locale === 'zh'
            ? '该条目按已公开业务资料整理，详细配置与交付范围可通过项目沟通进一步确认。'
            : 'This entry is organized from public business materials. Detailed configuration and delivery scope can be confirmed during project coordination.')

        return (
          <article
            key={item.id}
            className={`grid gap-6 border-t border-[#d7cfbf] pt-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-center ${
              index % 2 === 1 ? 'xl:[&>*:first-child]:order-2 xl:[&>*:last-child]:order-1' : ''
            }`}
          >
            <div className="art-image-frame">
              <div className="aspect-[15/10] xl:min-h-[320px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="day-section-image h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b838f]">
                {locale === 'zh' ? '已核实分类' : 'Verified Category'}
              </p>
              <h3 className="mt-3 max-w-[32rem] font-display text-[2.2rem] leading-[0.98] text-[#1f252d] sm:text-[2.55rem] xl:text-[2.8rem]">
                {item.title}
              </h3>
              <p className="mt-4 max-w-[34rem] text-[0.96rem] leading-8 text-[#58616d] sm:text-[1rem] sm:leading-[1.95rem] copy-clamp-3">
                {getHeroLeadText(leadText, leadText)}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to={buildLocalizedPath(locale, 'inquiry')}
                  className="cta-link cta-link-primary"
                >
                  {locale === 'zh' ? '提交项目需求' : 'Submit Requirement'}
                </Link>
                <Link
                  to={buildLocalizedPath(locale, 'contact')}
                  className="cta-link cta-link-secondary"
                >
                  {locale === 'zh' ? '联系服务台' : 'Contact Service Desk'}
                </Link>
              </div>
            </div>
          </article>
        )
      })}
    </div>

    {renderPager(page.pager)}
  </div>
)

const renderNews = (
  locale: Locale,
  sectionSegment: string,
  defaultPageId: string,
  page: Extract<PortalPageData, { kind: 'news' }>
) => (
  <div className="space-y-8">
    {page.items.length > 0 ? (
      <ul className="space-y-4">
        {page.items.map((item) => (
          <li key={item.id}>
            <article className="art-card px-5 py-5 sm:px-7 sm:py-6">
              <div className="grid gap-4 sm:grid-cols-[176px_1fr] sm:items-start">
                <div>
                  <p className="eyebrow">{locale === 'zh' ? '发布时间' : 'Published'}</p>
                  <time className="mt-3 block text-[1rem] font-semibold text-[#8f672b] sm:text-[1.08rem]">
                    {formatDisplayDate(locale, item.date)}
                  </time>
                </div>
                <div className="flex items-start gap-4">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#d7b66c]" aria-hidden="true" />
                  <div className="flex-1">
                    {item.pageId ? (
                      <Link
                        to={buildSectionPath(locale, sectionSegment, item.pageId, defaultPageId)}
                        className="block text-[1.05rem] leading-9 text-[#34404d] transition-colors hover:text-[#1f252d] sm:text-[1.12rem]"
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <span className="block text-[1.05rem] leading-9 text-[#34404d] sm:text-[1.12rem]">{item.title}</span>
                    )}
                    {item.pageId && (
                      <span className="cta-link cta-link-secondary mt-3">
                        {locale === 'zh' ? '进入详情' : 'Read Article'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    ) : (
      <div className="border-t border-[#d7cfbf] py-8">
        <p className="text-base leading-9 text-[#58616d] sm:text-[1.08rem]">
          {page.pager}
        </p>
      </div>
    )}
    {page.items.length > 0 && renderPager(page.pager)}
  </div>
)

const renderContact = (locale: Locale, page: Extract<PortalPageData, { kind: 'contact' }>) => (
  <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.82fr_1.18fr]">
    <div className="space-y-6">
      <article className="panel px-6 py-7 sm:px-8 sm:py-8">
        <p className="eyebrow">{locale === 'zh' ? '服务台账' : 'Service Contacts'}</p>
        <h3 className="section-title-xl mt-4 max-w-[34rem]">{page.company}</h3>
        <p className="section-copy section-copy-compact mt-6 max-w-none copy-clamp-4">
          {page.subtitle ||
            (locale === 'zh'
              ? '联系方式、邮箱路由和项目对接入口已经在新站统一收口，便于企业客户直接进入沟通。'
              : 'Contact records, mailbox routes, and project intake entries are organized in one place for direct enterprise coordination.')}
        </p>
        {page.ctaLabel && (
          <div className="mt-8">
            <Link to={buildLocalizedPath(locale, 'inquiry')} className="btn-primary">
              {page.ctaLabel}
            </Link>
          </div>
        )}
      </article>

      <article className="panel px-6 py-7 sm:px-8 sm:py-8">
        <p className="eyebrow">{page.qrLabel}</p>
        <p className="section-copy section-copy-compact mt-5 max-w-none copy-clamp-4">
          {locale === 'zh'
            ? '如已明确工况、设备方向或交付窗口，可直接通过热线、邮箱或二维码继续沟通。'
            : 'If the operating condition, equipment direction, or delivery window is clear, use hotline, email, or QR contact for direct follow-up.'}
        </p>
        {page.qrImage && (
          <div className="mt-6 max-w-[180px] sm:max-w-[220px]">
            <div className="art-image-frame">
              <img src={page.qrImage} alt={page.qrLabel} className="day-section-image h-full w-full object-cover" loading="lazy" />
            </div>
          </div>
        )}
      </article>
    </div>

    <div className="panel px-6 py-7 sm:px-8 sm:py-8 xl:px-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="eyebrow">{locale === 'zh' ? '联系信息' : 'Contact Details'}</p>
          <DetailCardList
            items={page.details.map((item) => ({ label: item.label, value: item.value }))}
            className="mt-6 grid gap-3"
          />
        </div>

        <div>
          <p className="eyebrow">{locale === 'zh' ? '可直达邮箱' : 'Direct Mailbox'}</p>
          <DetailCardList
            items={page.mailboxes.map((box) => ({ label: box.label, value: box.email, href: `mailto:${box.email}` }))}
            className="mt-6 grid gap-3"
          />
        </div>
      </div>
    </div>
  </div>
)

const PortalSectionView = ({ locale, sectionKey }: PortalSectionViewProps) => {
  const location = useLocation()
  const params = useParams<{ '*': string }>()
  const [pageOverrides, setPageOverrides] = useState<CmsPageOverride[]>([])
  const [siteResources, setSiteResources] = useState<SiteResourcesResponse | null>(null)

  const sections = getPortalSections(locale)
  const section = sections[sectionKey]

  useEffect(() => {
    let cancelled = false

    const fetchOverrides = async () => {
      try {
        const response = await axios.get<CmsPagesResponse>(`/api/cms/pages/${locale}`)
        if (!cancelled && Array.isArray(response.data.pages)) {
          setPageOverrides(response.data.pages)
        }
      } catch {
        if (!cancelled) {
          setPageOverrides([])
        }
      }
    }

    void fetchOverrides()

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

  const mergedPages = useMemo(() => {
    const merged: Record<string, PortalPageData> = { ...section.pages }
    pageOverrides.forEach((override) => {
      if (
        override.sectionKey === sectionKey &&
        isPortalPageData(override.content) &&
        Object.prototype.hasOwnProperty.call(merged, override.pageId)
      ) {
        merged[override.pageId] = mergePageData(merged[override.pageId], override.content)
      }
    })
    return merged
  }, [pageOverrides, section.pages, sectionKey])

  const subPath = params['*']?.split('/').filter(Boolean)[0] || ''
  const newsArticlePage =
    sectionKey === 'news' && subPath ? buildNewsArticlePage(locale, subPath, siteResources) : null
  const newsArticleCategory = newsArticlePage ? siteResources?.newsArticles?.[subPath]?.category : null
  const activePageId = newsArticlePage ? subPath : mergedPages[subPath] ? subPath : section.defaultPageId
  const activePageBase = newsArticlePage ?? mergedPages[activePageId]
  const activePage =
    sectionKey === 'contact' && activePageBase.kind === 'contact'
      ? resolveContactPage(locale, activePageId, activePageBase, siteResources)
      : (sectionKey === 'products' || sectionKey === 'cases') && activePageBase.kind === 'grid'
        ? resolveGridPage(sectionKey, locale, activePageId, activePageBase, siteResources)
      : sectionKey === 'news' && activePageBase.kind === 'news'
        ? resolveNewsPage(locale, activePageId, activePageBase, siteResources)
        : activePageBase
  const activeMenuId = newsArticleCategory || activePageId
  const activeMenu = section.menu.find((item) => item.id === activeMenuId)
  const activeMenuLabel = activeMenu?.label || activePage.title
  const activeHero = normalizeHero(
    activePage.hero,
    buildFallbackHero(locale, sectionKey, section.navLabel, activeMenuLabel, activePage)
  )
  const activeHeroSubtitle = getHeroLeadText(
    activeHero.subtitle,
    locale === 'zh'
      ? '围绕工程场景、设备配置与项目沟通入口组织信息。'
      : 'Information organized around project scenarios, equipment scope, and contact flow.'
  )
  const activeDescription = getPageDescription(activePage, section.navLabel)
  const seo = useMemo<SeoEntry>(() => {
    const zhSection = getPortalSections('zh')[sectionKey]
    const enSection = getPortalSections('en')[sectionKey]
    const isNewsArticleDetail = sectionKey === 'news' && Boolean(newsArticlePage)
    const zhPageId = isNewsArticleDetail
      ? activePageId
      : zhSection.pages[activePageId]
        ? activePageId
        : zhSection.defaultPageId
    const enPageId = isNewsArticleDetail
      ? activePageId
      : enSection.pages[activePageId]
        ? activePageId
        : enSection.defaultPageId

    return {
      title: `${activePage.title} | ${section.navLabel} | Hytorist`,
      description: activeDescription,
      hreflang: {
        zh: buildSectionPath('zh', zhSection.segment, zhPageId, zhSection.defaultPageId),
        en: buildSectionPath('en', enSection.segment, enPageId, enSection.defaultPageId)
      },
      xDefault: '/'
    }
  }, [activeDescription, activePage, activePageId, newsArticlePage, section.navLabel, sectionKey])

  usePageSeo(locale, seo)

  const contactActionLabel = locale === 'zh' ? '联系服务台' : 'Contact Service Desk'
  const primaryAsideLink = newsArticlePage
    ? {
        to: buildSectionPath(locale, section.segment, activeMenuId || section.defaultPageId, section.defaultPageId),
        label: locale === 'zh' ? '返回新闻列表' : 'Back to News List'
      }
    : {
        to: buildLocalizedPath(locale, 'products'),
        label: locale === 'zh' ? '查看设备目录' : 'View Equipment'
      }
  const contextualAsideLink =
    sectionKey === 'products'
      ? {
          to: `/${locale}/${sections.cases.segment}`,
          label: locale === 'zh' ? '查看应用场景' : 'View Applications'
        }
      : sectionKey === 'cases'
        ? {
            to: buildLocalizedPath(locale, 'products'),
            label: locale === 'zh' ? '返回设备目录' : 'View Equipment'
          }
        : sectionKey === 'news'
          ? {
              to: buildSectionPath(locale, section.segment, 'company', section.defaultPageId),
              label: locale === 'zh' ? '查看公司新闻' : 'Company News'
            }
          : sectionKey === 'support'
            ? {
                to: buildLocalizedPath(locale, 'contact'),
                label: locale === 'zh' ? '查看联系方式' : 'Contact Details'
              }
            : {
                to: `/${locale}/${sections.cases.segment}`,
                label: locale === 'zh' ? '查看应用案例' : 'View Applications'
              }
  const highlightedCertificate = siteResources?.certificates?.[0] ?? null
  const verifiedHighlights = getVerifiedHighlights(sectionKey, siteResources)
  const productCategoryCount = siteResources?.productCategories?.length || 0
  const caseCategoryCount = siteResources?.caseCategories?.length || 0
  const referenceNote =
    locale === 'zh'
      ? '栏目内容按已核实业务资料整理，用于帮助访客快速理解能力范围与沟通重点。'
      : 'Section content is organized from verified business materials to clarify scope and communication priorities.'
  const summaryCards = (() => {
    if (sectionKey === 'products') {
      return [
        {
          title: locale === 'zh' ? '分类目录' : 'Category Index',
          text:
            productCategoryCount > 0
              ? locale === 'zh'
                ? `当前栏目已接入 ${productCategoryCount} 个设备分类，并按已核实工况方向组织说明。`
                : `This section currently connects ${productCategoryCount} equipment categories and organizes them by verified operating direction.`
              : locale === 'zh'
                ? '设备分类正在按已核实资料整理。'
                : 'Equipment categories are being organized from verified materials.'
        },
        {
          title: locale === 'zh' ? '租赁方向' : 'Rental Scope',
          text:
            getVerifiedSummary(locale, siteResources?.verifiedPages?.rentalService) ||
            (locale === 'zh'
              ? '租赁方向正在按已公开资料整理。'
              : 'Rental directions are being organized from public materials.')
        }
      ]
    }

    if (sectionKey === 'cases') {
      return [
        {
          title: locale === 'zh' ? '场景目录' : 'Scenario Index',
          text:
            caseCategoryCount > 0
              ? locale === 'zh'
                ? `当前栏目已接入 ${caseCategoryCount} 个应用分类，并按已核实工况保留场景入口。`
                : `This section currently connects ${caseCategoryCount} application categories and keeps them as verified scenario entries.`
              : locale === 'zh'
                ? '应用分类正在按已核实资料整理。'
                : 'Application categories are being organized from verified materials.'
        },
        {
          title: locale === 'zh' ? '能力说明' : 'Capability Note',
          text:
            getVerifiedSummary(locale, siteResources?.verifiedPages?.companyProfile) ||
            (locale === 'zh'
              ? '企业能力说明正在按已公开资料整理。'
              : 'Company capability notes are being organized from public materials.')
        }
      ]
    }

    if (sectionKey === 'contact') {
      return [
        {
          title: locale === 'zh' ? '联络资料' : 'Contact Records',
          text:
            getVerifiedSummary(locale, siteResources?.verifiedPages?.contactInfo) ||
            (locale === 'zh'
              ? '联系方式资料已纳入统一资源池。'
              : 'Contact records are maintained in the shared resource pool.')
        },
        {
          title: locale === 'zh' ? '留言流程' : 'Message Flow',
          text:
            getVerifiedSummary(locale, siteResources?.verifiedPages?.messagePage) ||
            (locale === 'zh'
              ? '留言字段和保密设置已并入站内询盘流程。'
              : 'Message fields and privacy settings are merged into the site inquiry flow.')
        }
      ]
    }

    if (sectionKey === 'support') {
      return [
        {
          title: locale === 'zh' ? '售后承诺' : 'After-sales',
          text:
            getVerifiedSummary(locale, siteResources?.verifiedPages?.afterSales) ||
            (locale === 'zh'
              ? '售后说明正在按已公开资料整理。'
              : 'After-sales notes are being organized from public materials.')
        },
        {
          title: locale === 'zh' ? '培训机制' : 'Training',
          text:
            getVerifiedSummary(locale, siteResources?.verifiedPages?.training) ||
            (locale === 'zh'
              ? '培训机制正在按已公开资料整理。'
              : 'Training notes are being organized from public materials.')
        }
      ]
    }

    return [
      {
        title: locale === 'zh' ? '资料说明' : 'Reference Note',
        text: referenceNote
      },
      {
        title: locale === 'zh' ? '沟通说明' : 'Communication Note',
        text:
          locale === 'zh'
            ? '如果需要资质文件、服务说明或更细的项目资料，建议直接通过站内询盘和联系入口统一沟通。'
            : 'If you need qualification files, service notes, or more detailed project material, use the site inquiry and contact flow directly.'
      }
    ]
  })()
  const showVerifiedHighlights =
    verifiedHighlights.length > 0 && !['products', 'cases', 'contact', 'support'].includes(sectionKey)
  const sectionSummaryTags = locale === 'zh'
    ? [section.navLabel, newsArticlePage ? activeMenuLabel : activePage.title, '项目沟通']
    : [section.navLabel, newsArticlePage ? activeMenuLabel : activePage.title, 'Project Coordination']

  return (
    <div className="section-wrap pb-16 pt-4 sm:pt-6 sm:pb-20">
      <section className="space-y-8">
        <div className="-mx-4 overflow-hidden bg-[#f3eee4] sm:-mx-6 xl:-mx-8 2xl:-mx-10">
          <div className="relative min-h-[420px] sm:min-h-[560px] xl:min-h-[640px]">
            <img
              src={activeHero.image}
              alt={activeHero.title}
              className="day-hero-image absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,248,242,0.95)_0%,rgba(251,248,242,0.8)_40%,rgba(251,248,242,0.36)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,248,242,0.18)_0%,rgba(251,248,242,0)_28%,rgba(251,248,242,0.62)_100%)]" />

            <div className="section-wrap relative grid min-h-[420px] grid-rows-[1fr_auto] gap-8 pb-10 pt-32 text-[#1f252d] sm:min-h-[560px] sm:gap-12 sm:pb-14 sm:pt-44 xl:min-h-[640px] xl:gap-14 xl:pb-16 xl:pt-52">
              <div className="flex items-center">
                <div className="hero-panel max-w-[56rem]">
                  <p className="eyebrow">{section.navLabel}</p>
                  <h1
                    className={`mt-6 hero-display hero-display-section text-[#1f252d] ${
                      locale === 'zh' ? 'hero-title-nowrap' : ''
                    }`}
                  >
                    {activeHero.title}
                  </h1>
                  <p className="hero-copy mt-7 max-w-[52rem] text-[1rem] leading-8 text-[#4f5a67] sm:text-[1.12rem] sm:leading-9 xl:text-[1.16rem]">
                    {activeHeroSubtitle}
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-5">
                    <Link to={buildLocalizedPath(locale, 'inquiry')} className="btn-primary w-full sm:w-auto">
                      {locale === 'zh' ? '提交项目需求' : 'Submit Requirement'}
                    </Link>
                    <Link to={buildLocalizedPath(locale, 'contact')} className="btn-secondary w-full sm:w-auto">
                      {contactActionLabel}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid max-w-3xl gap-5 border-t border-[#d7cfbf] pt-6 sm:grid-cols-3 sm:gap-7 sm:pt-7">
                {activeHero.metrics.slice(0, 3).map((metric) => (
                  <div key={`${metric.label}-${metric.value}`}>
                    <p className="font-display text-[2.9rem] leading-none text-[#1f252d] sm:text-[3.2rem]">{metric.value}</p>
                    <p className="mt-2 text-[12px] uppercase tracking-[0.12em] text-[#68717d]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="-mx-4 overflow-x-auto border-y border-[#d7cfbf] px-4 py-3 sm:-mx-6 sm:px-6 xl:-mx-8 xl:px-8 2xl:-mx-10 2xl:px-10">
          <nav>
            <div className="machine-nav-shell min-w-max">
              {section.menu.map((menuItem) => {
                const menuPath = buildSectionPath(locale, section.segment, menuItem.id, section.defaultPageId)
                const isActive = menuItem.id === activeMenuId
                return (
                  <Link
                    key={menuItem.id}
                    to={menuPath}
                    className={`machine-nav-item whitespace-nowrap ${isActive ? 'machine-nav-item-active' : ''}`}
                  >
                    {menuItem.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>

        <div className="grid gap-8 sm:gap-12 xl:grid-cols-[minmax(0,1fr)_280px] 2xl:grid-cols-[minmax(0,1fr)_300px]">
          <div key={location.pathname} className="animate-fade-up">
            <div className="grid gap-6 border-b border-[#d7cfbf] pb-10 sm:gap-7 sm:pb-12 xl:grid-cols-[0.34fr_0.66fr] xl:items-start">
              <div>
                <p className="eyebrow">{section.navLabel}</p>
                <h2 className="section-title-xl mt-4">{activePage.title}</h2>
              </div>
              <p className="section-copy section-copy-wide max-w-none">{activeDescription}</p>
            </div>

            <div className="mt-10 sm:mt-12">
              {activePage.kind === 'article' && renderArticle(locale, activePage)}
              {activePage.kind === 'grid' && renderGrid(locale, activePage)}
              {activePage.kind === 'news' && renderNews(locale, section.segment, section.defaultPageId, activePage)}
              {activePage.kind === 'contact' && renderContact(locale, activePage)}
            </div>
          </div>

          <aside className="xl:sticky xl:top-28 xl:h-fit">
            <div className="space-y-5">
              <div className="action-panel px-5 py-6 sm:px-6">
                <p className="eyebrow">{locale === 'zh' ? '站内流转' : 'Site Actions'}</p>
                <p className="section-copy section-copy-compact mt-4 max-w-none text-[0.98rem]">
                  {locale === 'zh'
                    ? '从当前栏目继续查看相关内容，或直接进入需求与联系。'
                    : 'Continue within this section or move directly into inquiry and contact.'}
                </p>
                <div className="mt-6 grid gap-3">
                  <Link
                    to={primaryAsideLink.to}
                    className="info-card block px-4 py-4 transition-colors hover:border-[#c89b45]/30"
                  >
                    <p className="meta-label">{primaryAsideLink.label}</p>
                    <p className="meta-copy mt-3">
                      {locale === 'zh' ? '回到当前主题继续查看。' : 'Return to the current topic.'}
                    </p>
                  </Link>
                  <Link
                    to={contextualAsideLink.to}
                    className="info-card block px-4 py-4 transition-colors hover:border-[#c89b45]/30"
                  >
                    <p className="meta-label">{contextualAsideLink.label}</p>
                    <p className="meta-copy mt-3">
                      {locale === 'zh' ? '切换到相关栏目继续查看。' : 'Switch to the related section.'}
                    </p>
                  </Link>
                  <Link
                    to={buildLocalizedPath(locale, 'inquiry')}
                    className="info-card block px-4 py-4 transition-colors hover:border-[#c89b45]/30"
                  >
                    <p className="meta-label">{locale === 'zh' ? '提交项目需求' : 'Submit Requirement'}</p>
                    <p className="meta-copy mt-3">
                      {locale === 'zh' ? '条件明确后可直接发起项目对接。' : 'Start project intake when scope is clear.'}
                    </p>
                  </Link>
                </div>
                <Link to={buildLocalizedPath(locale, 'contact')} className="cta-link cta-link-primary mt-6">
                  {contactActionLabel}
                </Link>
              </div>

              <div className="info-card px-5 py-5 sm:px-6">
                <p className="eyebrow">{locale === 'zh' ? '当前页面' : 'Current View'}</p>
                <p className="meta-copy mt-4">
                  {locale === 'zh'
                    ? `${section.navLabel} / ${newsArticlePage ? activeMenuLabel : activePage.title}`
                    : `${section.navLabel} / ${newsArticlePage ? activeMenuLabel : activePage.title}`}
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {sectionSummaryTags.map((item) => (
                    <span key={item} className="summary-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="border-t border-[#d7cfbf] pt-10 sm:pt-12">
          <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="panel px-6 py-7 sm:px-8 sm:py-8">
              <p className="eyebrow">{locale === 'zh' ? '栏目资料摘要' : 'Section Summary'}</p>
              <h2 className="section-title-lg mt-4">
                {locale === 'zh'
                  ? '栏目重点与沟通说明统一收口。'
                  : 'Section notes and communication points organized in one place.'}
              </h2>
              <p className="section-copy section-copy-compact mt-5 max-w-none copy-clamp-4">
                {locale === 'zh'
                  ? '这样可以保证栏目页在新站里保持一致的信息语气，不再暴露外部站点入口。'
                  : 'This keeps the new site consistent without exposing external-site entry points.'}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {sectionSummaryTags.map((item) => (
                  <span key={item} className="summary-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {summaryCards.map((card) => (
                <article key={card.title} className="panel px-6 py-7 sm:px-8">
                  <p className="eyebrow">{card.title}</p>
                  <p className="section-copy mt-5 max-w-none copy-clamp-4">{card.text}</p>
                  {card.title === (locale === 'zh' ? '资料说明' : 'Reference Note') && highlightedCertificate && (
                    <p className="mt-4 text-sm leading-7 text-[#58616d]">
                      {locale === 'zh'
                        ? `当前资料池包含：${highlightedCertificate.title}`
                        : `Current resource note: ${highlightedCertificate.title}`}
                    </p>
                  )}
                </article>
              ))}

              {showVerifiedHighlights && (
                <article className="panel px-6 py-7 sm:px-8 md:col-span-2">
                  <p className="eyebrow">{locale === 'zh' ? '栏目摘要' : 'Section Notes'}</p>
                  <div className="mt-5 grid gap-6">
                    {verifiedHighlights.map((item) => (
                      <div
                        key={`${item.title}-${item.sourcePageUrl}`}
                        className="border-t border-[#d7cfbf] pt-5 first:border-t-0 first:pt-0"
                      >
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
        </div>
      </section>
    </div>
  )
}

export default PortalSectionView
