import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useLocation, useParams } from 'react-router-dom'
import DetailCardList from '../../components/DetailCardList'
import ZoomableImage from '../../components/ZoomableImage'
import {
  getPortalSections,
  type PortalHeroData,
  type PortalPageData,
  type PortalSectionKey
} from '../../content/portal'
import { portalHeroVisuals } from '../../content/visualAssets'
import useSiteResources from '../../hooks/useSiteResources'
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
  uiNarratives?: {
    portal?: {
      referenceNoteZh?: string
      referenceNoteEn?: string
      communicationNoteZh?: string
      communicationNoteEn?: string
      asideLeadZh?: string
      asideLeadEn?: string
      sectionSummaryTitleZh?: string
      sectionSummaryTitleEn?: string
      sectionSummaryLeadZh?: string
      sectionSummaryLeadEn?: string
    }
  }
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

const getImagePreviewLabel = (locale: Locale) => {
  return locale === 'zh' ? '查看原图' : 'View Full Image'
}

const getImageCloseLabel = (locale: Locale) => {
  return locale === 'zh' ? '关闭原图' : 'Close Image'
}

const buildResourceOverviewSummary = (
  locale: Locale,
  sectionKey: 'products' | 'cases',
  categories: SiteResourceCategory[]
) => {
  const count = categories.length

  if (locale === 'zh') {
    return sectionKey === 'products'
      ? `当前页面按 ${count} 个产品分类组织，覆盖液压动力、液压紧固、管道法兰、现场机加与风电运维等方向。`
      : `当前页面按 ${count} 个应用分类组织，覆盖螺栓紧固、顶升平移、管道法兰、现场机加与风电运维等场景入口。`
  }

  return sectionKey === 'products'
    ? `This page is organized around ${count} product categories, covering hydraulic power, bolting, pipeline and flange service, on-site machining, wind O&M, and related directions.`
    : `This page is organized around ${count} application categories, covering bolting, lifting and positioning, pipeline and flange service, on-site machining, wind O&M, and related scenarios.`
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
      ? `${count} 个${labelZh}已上线，当前展示 ${publicItemCount} 条${detailZh}。`
      : `${count} 个${labelZh}已上线，更多${detailZh}可联系团队获取。`
  }

  return typeof publicItemCount === 'number' && publicItemCount > 0
    ? `${count} ${labelEn} are online, with ${publicItemCount} ${detailEn} currently shown.`
    : `${count} ${labelEn} are online, and more ${detailEn} are available on request.`
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

const sectionHeroFocusClassMap: Record<PortalSectionKey, string> = {
  about: 'hero-focus-about',
  manufacturing: 'hero-focus-manufacturing',
  products: 'hero-focus-products',
  engineering: 'hero-focus-engineering',
  cases: 'hero-focus-cases',
  support: 'hero-focus-support',
  news: 'hero-focus-news',
  hr: 'hero-focus-hr',
  contact: 'hero-focus-contact'
}

const buildSectionThemeGuide = (
  locale: Locale,
  sectionKey: PortalSectionKey,
  pageTitle: string
) => {
  if (locale === 'zh') {
    const zhThemes: Record<PortalSectionKey, { lead: string; tags: string[] }> = {
      about: {
        lead: `本页围绕「${pageTitle}」聚焦企业背景、组织能力与资质依据。`,
        tags: ['企业背景', '组织能力', '资质依据']
      },
      manufacturing: {
        lead: `本页围绕「${pageTitle}」聚焦研发流程、制造能力与测试验证。`,
        tags: ['研发流程', '制造能力', '测试验证']
      },
      products: {
        lead: `本页围绕「${pageTitle}」聚焦设备分类、适用工况与交付边界。`,
        tags: ['设备分类', '适用工况', '交付边界']
      },
      engineering: {
        lead: `本页围绕「${pageTitle}」聚焦现场服务、项目流程与资源配置。`,
        tags: ['现场服务', '项目流程', '资源配置']
      },
      cases: {
        lead: `本页围绕「${pageTitle}」聚焦应用场景、工况目标与实施路径。`,
        tags: ['应用场景', '工况目标', '实施路径']
      },
      support: {
        lead: `本页围绕「${pageTitle}」聚焦售后响应、培训机制与维护保障。`,
        tags: ['售后响应', '培训机制', '维护保障']
      },
      news: {
        lead: `本页围绕「${pageTitle}」聚焦发布时间、信息来源与业务动态。`,
        tags: ['发布时间', '信息来源', '业务动态']
      },
      hr: {
        lead: `本页围绕「${pageTitle}」聚焦人才体系、岗位方向与成长机制。`,
        tags: ['人才体系', '岗位方向', '成长机制']
      },
      contact: {
        lead: `本页围绕「${pageTitle}」聚焦联系方式、沟通字段与隐私设置。`,
        tags: ['联系方式', '沟通字段', '隐私设置']
      }
    }

    return zhThemes[sectionKey]
  }

  const enThemes: Record<PortalSectionKey, { lead: string; tags: string[] }> = {
    about: {
      lead: `This page centers on "${pageTitle}" with company background, organization capability, and qualification evidence.`,
      tags: ['Company Profile', 'Org Capability', 'Credentials']
    },
    manufacturing: {
      lead: `This page centers on "${pageTitle}" with R&D workflow, manufacturing capability, and test verification.`,
      tags: ['R&D Workflow', 'Manufacturing', 'Verification']
    },
    products: {
      lead: `This page centers on "${pageTitle}" with equipment categories, operating scenarios, and delivery scope.`,
      tags: ['Equipment Scope', 'Operating Scenarios', 'Delivery Scope']
    },
    engineering: {
      lead: `This page centers on "${pageTitle}" with field service steps, project flow, and resource setup.`,
      tags: ['Field Service', 'Project Flow', 'Resource Setup']
    },
    cases: {
      lead: `This page centers on "${pageTitle}" with application scenarios, operating targets, and execution routes.`,
      tags: ['Application Scenarios', 'Operating Targets', 'Execution Route']
    },
    support: {
      lead: `This page centers on "${pageTitle}" with response commitments, training, and maintenance support.`,
      tags: ['Response', 'Training', 'Maintenance']
    },
    news: {
      lead: `This page centers on "${pageTitle}" with publish timing, information source, and business updates.`,
      tags: ['Publish Date', 'Source', 'Updates']
    },
    hr: {
      lead: `This page centers on "${pageTitle}" with talent framework, role direction, and growth paths.`,
      tags: ['Talent System', 'Role Direction', 'Growth Paths']
    },
    contact: {
      lead: `This page centers on "${pageTitle}" with contact channels, intake fields, and privacy settings.`,
      tags: ['Contact Channels', 'Intake Fields', 'Privacy']
    }
  }

  return enThemes[sectionKey]
}

const renderPager = (summary: string) => (
  <div className="border-t border-[#d7cfbf] pt-6">
    <p className="label-muted copy-clamp-3 text-[12px]">{summary}</p>
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
  const outlineLabel = locale === 'zh' ? '章节导读' : 'Quick Outline'
  const paragraphEntries = page.paragraphs.map((paragraph, index) => ({
    id: `article-section-${index + 1}`,
    chapterLabel: `${chapter} ${String(index + 1).padStart(2, '0')}`,
    paragraph,
    summary: getHeroLeadText(paragraph, paragraph)
  }))
  const leadEntry = paragraphEntries[0]
  const detailEntries = paragraphEntries.slice(1)

  return (
    <div className="space-y-9 sm:space-y-12">
      {page.image && (
        <div className="art-image-frame">
          <div className="aspect-[16/10] sm:aspect-[16/8] xl:aspect-[21/8]">
            <ZoomableImage
              src={page.image}
              alt={page.imageAlt || page.title}
              previewLabel={getImagePreviewLabel(locale)}
              closeLabel={getImageCloseLabel(locale)}
              wrapperClassName="h-full w-full"
              className="day-section-image mobile-content-image h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {paragraphEntries.length > 1 && (
        <nav className="art-card px-4 py-4 sm:px-6 sm:py-6" aria-label={outlineLabel}>
          <p className="eyebrow">{outlineLabel}</p>
          <div className="mt-4 grid gap-2.5 sm:mt-5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3">
            {paragraphEntries.map((entry) => (
              <a
                key={entry.id}
                href={`#${entry.id}`}
                className="block rounded-[16px] border border-[#d7cfbf] bg-[rgba(255,255,255,0.58)] px-3.5 py-3.5 transition-colors hover:border-[#c89b45]/42 hover:bg-[rgba(255,255,255,0.9)] sm:px-4 sm:py-4"
              >
                <p className="label-muted text-[11px]">
                  {entry.chapterLabel}
                </p>
                <p className="mt-2 text-[0.9rem] leading-7 text-[#4e5967] copy-clamp-2 sm:text-[0.95rem]">
                  {entry.summary}
                </p>
              </a>
            ))}
          </div>
        </nav>
      )}

      {leadEntry && (
        <article
          id={leadEntry.id}
          className="art-surface scroll-mt-[12.2rem] rounded-[24px] px-5 py-6 sm:rounded-[28px] sm:px-8 sm:py-9"
        >
          <div className="flex flex-wrap gap-3">
            {page.subtitle && <span className="pill">{page.subtitle}</span>}
            <span className="pill">
              {locale === 'zh' ? `${page.paragraphs.length} 段正文` : `${page.paragraphs.length} Paragraphs`}
            </span>
          </div>
          <p className="mt-5 max-w-5xl text-[1rem] leading-8 text-[#44505d] sm:text-[1.18rem] sm:leading-10 xl:text-[1.24rem]">
            {leadEntry.paragraph}
          </p>
        </article>
      )}

      {detailEntries.length > 0 && (
        <div className="space-y-8 sm:space-y-10">
          {detailEntries.map((entry) => (
            <article
              key={`${page.title}-${entry.id}`}
              id={entry.id}
              className="grid scroll-mt-[12.2rem] gap-4 border-t border-[#d7cfbf] pt-7 sm:gap-5 sm:pt-10 xl:grid-cols-[116px_1fr]"
            >
              <div>
                <p className="label-muted text-[11px] sm:text-[12px]">
                  {entry.chapterLabel}
                </p>
              </div>
              <p className="max-w-5xl text-[0.98rem] leading-8 text-[#58616d] sm:text-[1.08rem] sm:leading-9">
                {entry.paragraph}
              </p>
            </article>
          ))}
        </div>
      )}

      {page.bullets && page.bullets.length > 0 && (
        <div className="border-t border-[#d7cfbf] pt-7 sm:pt-8">
          <p className="eyebrow">{locale === 'zh' ? '能力要点' : 'Capability Points'}</p>
          <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {page.bullets.map((item, index) => (
              <div key={item} className="art-card px-4 py-4 text-[0.98rem] leading-7 text-[#495461] sm:px-5 sm:py-5 sm:text-base sm:leading-8">
                <p className="label-muted text-[12px]">
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
  <div className="space-y-8 sm:space-y-10">
    {page.summary && (
      <div className="section-copy section-copy-wide max-w-none copy-clamp-4 copy-unclamp-lg">
        {page.summary}
      </div>
    )}

    <div className="space-y-8 sm:space-y-10">
      {page.items.map((item, index) => {
        const leadText =
          item.description ||
          (locale === 'zh'
            ? '该条目聚焦当前业务方向，详细配置与交付范围可通过项目沟通进一步确认。'
            : 'This entry focuses on the current business direction. Detailed configuration and delivery scope can be confirmed during project coordination.')

        return (
          <article
            key={item.id}
            className={`grid gap-5 border-t border-[#d7cfbf] pt-7 sm:gap-6 sm:pt-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-center ${
              index % 2 === 1 ? 'xl:[&>*:first-child]:order-2 xl:[&>*:last-child]:order-1' : ''
            }`}
          >
            <div className="art-image-frame">
              <div className="aspect-[16/10] sm:aspect-[15/10] xl:min-h-[320px]">
                <ZoomableImage
                  src={item.image}
                  alt={item.title}
                  previewLabel={getImagePreviewLabel(locale)}
                  closeLabel={getImageCloseLabel(locale)}
                  wrapperClassName="h-full w-full"
                  className="day-section-image mobile-content-image h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="max-w-xl">
              <p className="label-muted text-[11px]">
                {locale === 'zh' ? '分类标签' : 'Category'}
              </p>
              <h3 className="subsection-title mt-3 max-w-[32rem]">
                {item.title}
              </h3>
              <p className="mt-4 max-w-[34rem] text-[0.95rem] leading-7 text-[#58616d] sm:text-[1rem] sm:leading-[1.86rem] copy-clamp-3">
                {getHeroLeadText(leadText, leadText)}
              </p>
              <div className="mt-5 flex flex-wrap gap-3 sm:mt-6 sm:gap-4">
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
  <div className="space-y-7 sm:space-y-8">
    {page.items.length > 0 ? (
      <ul className="border-y border-[#d7cfbf]">
        {page.items.map((item) => (
          <li key={item.id} className="border-t border-[#d7cfbf] first:border-t-0 transition-colors hover:bg-[rgba(255,255,255,0.26)]">
            <article className="grid gap-3 px-1 py-4 sm:grid-cols-[188px_1fr] sm:items-start sm:gap-5 sm:py-6">
              <div>
                <p className="eyebrow">{locale === 'zh' ? '发布时间' : 'Published'}</p>
                <time className="mt-2.5 block text-[0.92rem] font-semibold text-[#8f672b] sm:mt-3 sm:text-[1.02rem]">
                  {formatDisplayDate(locale, item.date)}
                </time>
              </div>
              <div className="flex items-start gap-3.5 sm:gap-4">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#d7b66c] sm:h-2.5 sm:w-2.5" aria-hidden="true" />
                <div className="flex-1">
                  {item.pageId ? (
                    <Link
                      to={buildSectionPath(locale, sectionSegment, item.pageId, defaultPageId)}
                      className="copy-clamp-2 block text-[1.02rem] font-semibold leading-8 text-[#34404d] transition-colors hover:text-[#1f252d] sm:text-[1.14rem] sm:leading-[2rem]"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <span className="copy-clamp-2 block text-[1.02rem] font-semibold leading-8 text-[#34404d] sm:text-[1.14rem] sm:leading-[2rem]">{item.title}</span>
                  )}
                  {item.pageId && (
                    <span className="cta-link cta-link-secondary mt-2.5 sm:mt-3">
                      {locale === 'zh' ? '进入详情' : 'Read Article'}
                    </span>
                  )}
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
  <div className="grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-[0.82fr_1.18fr]">
    <div className="space-y-6 sm:space-y-7">
      <article className="panel content-card">
        <p className="eyebrow">{locale === 'zh' ? '服务台账' : 'Service Contacts'}</p>
        <h3 className="subsection-title mt-4 max-w-[34rem]">{page.company}</h3>
        <p className="section-copy section-copy-compact mt-6 max-w-none copy-clamp-4 copy-unclamp-lg">
          {page.subtitle ||
            (locale === 'zh'
              ? '联系方式、邮箱与项目沟通入口集中展示，便于快速联系。'
              : 'Contact channels, mailboxes, and project communication entries are presented together for quick access.')}
        </p>
        {page.ctaLabel && (
          <div className="mt-8">
            <Link to={buildLocalizedPath(locale, 'inquiry')} className="btn-primary w-full sm:w-auto">
              {page.ctaLabel}
            </Link>
          </div>
        )}
      </article>

      {page.qrImage && (
        <article className="panel content-card">
          <p className="eyebrow">{page.qrLabel}</p>
          <p className="section-copy section-copy-compact mt-5 max-w-none copy-clamp-4 copy-unclamp-lg">
            {locale === 'zh'
              ? '如已明确工况、设备方向或交付窗口，可通过热线、邮箱或二维码继续沟通。'
              : 'If the operating condition, equipment direction, or delivery window is clear, use hotline, email, or QR contact for direct follow-up.'}
          </p>
          <div className="mt-6 max-w-[180px] sm:max-w-[220px]">
            <div className="art-image-frame">
              <ZoomableImage
                src={page.qrImage}
                alt={page.qrLabel}
                previewLabel={getImagePreviewLabel(locale)}
                closeLabel={getImageCloseLabel(locale)}
                wrapperClassName="h-full w-full"
                className="day-section-image mobile-content-image h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </article>
      )}
    </div>

    <div className="panel content-card">
      <div className="grid gap-7 lg:grid-cols-2">
        <div>
          <p className="eyebrow">{locale === 'zh' ? '联系信息' : 'Contact Details'}</p>
          <DetailCardList
            items={page.details.map((item) => ({ label: item.label, value: item.value }))}
            className="mt-6 grid gap-4"
            itemClassName="art-card content-card"
            valueClassName="meta-copy meta-copy-compact mt-3"
          />
        </div>

        <div>
          <p className="eyebrow">{locale === 'zh' ? '可直达邮箱' : 'Direct Mailbox'}</p>
          <DetailCardList
            items={page.mailboxes.map((box) => ({ label: box.label, value: box.email, href: `mailto:${box.email}` }))}
            className="mt-6 grid gap-4"
            itemClassName="art-card content-card"
            valueClassName="meta-copy meta-copy-compact mt-3"
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
  const siteResources = useSiteResources<SiteResourcesResponse>()

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
  const activeDescriptionLead = getHeroLeadText(activeDescription, activeDescription)
  const activeHeroFocusClass = sectionHeroFocusClassMap[sectionKey]
  const sectionThemeGuide = buildSectionThemeGuide(locale, sectionKey, activePage.title)
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
  const portalNarrative = siteResources?.uiNarratives?.portal
  const referenceNote =
    locale === 'zh'
      ? portalNarrative?.referenceNoteZh ||
        '栏目内容围绕企业能力、产品与服务场景梳理，帮助您快速定位所需信息。'
      : portalNarrative?.referenceNoteEn ||
        'Section content is organized around capability, products, and service scenarios so visitors can find key information quickly.'
  const communicationNote =
    locale === 'zh'
      ? portalNarrative?.communicationNoteZh ||
        '如需资质文件、服务说明或更细的项目资料，可通过询盘与联系入口与我们沟通。'
      : portalNarrative?.communicationNoteEn ||
        'If you need qualification files, service notes, or detailed project material, contact us through inquiry or direct channels.'
  const asideLeadText =
    locale === 'zh'
      ? portalNarrative?.asideLeadZh || '从当前栏目继续查看相关内容，或直接进入需求与联系。'
      : portalNarrative?.asideLeadEn || 'Continue within this section or move directly into inquiry and contact.'
  const sectionSummaryTitle =
    locale === 'zh'
      ? portalNarrative?.sectionSummaryTitleZh || '栏目资料摘要'
      : portalNarrative?.sectionSummaryTitleEn || 'Section Summary'
  const sectionSummaryLead =
    locale === 'zh'
      ? portalNarrative?.sectionSummaryLeadZh || '汇总栏目重点信息，便于快速浏览与沟通。'
      : portalNarrative?.sectionSummaryLeadEn || 'Key section information is summarized here for quick review and communication.'
  const summaryCards = (() => {
    if (sectionKey === 'products') {
      return [
        {
          title: locale === 'zh' ? '分类目录' : 'Category Index',
          text:
            productCategoryCount > 0
              ? locale === 'zh'
                ? `当前栏目已接入 ${productCategoryCount} 个设备分类，可按工况方向快速查找。`
                : `This section currently includes ${productCategoryCount} equipment categories for quick lookup by operating direction.`
              : locale === 'zh'
                ? '设备分类持续更新中，欢迎按应用方向浏览。'
                : 'Equipment categories are continuously updated. Browse by application direction.'
        },
        {
          title: locale === 'zh' ? '租赁方向' : 'Rental Scope',
          text:
            getVerifiedSummary(locale, siteResources?.verifiedPages?.rentalService) ||
            (locale === 'zh'
              ? '支持短期与长期租赁方案，可按工况配置。'
              : 'Short-term and long-term rental options are available and can be configured by operating conditions.')
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
                ? `当前栏目已接入 ${caseCategoryCount} 个应用分类，可按场景入口快速检索。`
                : `This section currently includes ${caseCategoryCount} application categories for quick scenario-based lookup.`
              : locale === 'zh'
                ? '应用分类持续更新中，欢迎按工况需求浏览。'
                : 'Application categories are continuously updated for different operating needs.'
        },
        {
          title: locale === 'zh' ? '能力说明' : 'Capability Note',
          text:
            getVerifiedSummary(locale, siteResources?.verifiedPages?.companyProfile) ||
            (locale === 'zh'
              ? '覆盖多类工业场景，可按项目需求组合方案。'
              : 'The team supports diverse industrial scenarios with solutions tailored to project needs.')
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
              ? '联系方式与联络方式集中展示，便于快速沟通。'
              : 'Contact channels are centralized here for quick communication.')
        },
        {
          title: locale === 'zh' ? '留言流程' : 'Message Flow',
          text:
            getVerifiedSummary(locale, siteResources?.verifiedPages?.messagePage) ||
            (locale === 'zh'
              ? '可按问题类别提交需求，并选择公开或保密设置。'
              : 'You can submit requirements by category and choose public or confidential settings.')
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
              ? '提供售后响应、现场支持与持续维护服务。'
              : 'After-sales response, on-site support, and continuous maintenance are available.')
        },
        {
          title: locale === 'zh' ? '培训机制' : 'Training',
          text:
            getVerifiedSummary(locale, siteResources?.verifiedPages?.training) ||
            (locale === 'zh'
              ? '提供安装、操作与维护培训，支持现场与远程方式。'
              : 'Installation, operation, and maintenance training is available both on-site and remotely.')
        }
      ]
    }

    return [
      {
        title: locale === 'zh' ? '服务说明' : 'Service Notes',
        text: referenceNote
      },
      {
        title: locale === 'zh' ? '沟通建议' : 'Contact Guidance',
        text: communicationNote
      }
    ]
  })()
  const compactSummaryCards = summaryCards.map((card) => ({
    ...card,
    text: getHeroLeadText(card.text, card.text)
  }))
  const showVerifiedHighlights =
    verifiedHighlights.length > 0 && !['products', 'cases', 'contact', 'support'].includes(sectionKey)
  const sectionSummaryTags = [section.navLabel, newsArticlePage ? activeMenuLabel : activePage.title]

  return (
    <div className="section-wrap pb-16 pt-3 sm:pt-7 sm:pb-24">
      <section className="space-y-6 sm:space-y-8">
        <div className="-mx-4 overflow-hidden bg-[#f3eee4] sm:-mx-6 xl:-mx-8 2xl:-mx-10">
          <div className="relative min-h-[360px] sm:min-h-[560px] xl:min-h-[640px]">
            <ZoomableImage
              src={activeHero.image}
              alt={activeHero.title}
              showHint={false}
              hintVisibility="always"
              previewLabel={getImagePreviewLabel(locale)}
              closeLabel={getImageCloseLabel(locale)}
              wrapperClassName="absolute inset-0 h-full w-full"
              className={`day-hero-image absolute inset-0 h-full w-full object-cover ${activeHeroFocusClass}`}
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(251,248,242,0.95)_0%,rgba(251,248,242,0.8)_40%,rgba(251,248,242,0.36)_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(251,248,242,0.18)_0%,rgba(251,248,242,0)_28%,rgba(251,248,242,0.62)_100%)]" />

            <div className="section-wrap relative grid min-h-[360px] grid-rows-[1fr_auto] gap-6 pb-8 pt-[7.75rem] text-[#1f252d] sm:min-h-[560px] sm:gap-12 sm:pb-14 sm:pt-40 lg:min-h-[600px] lg:gap-[3.25rem] lg:pb-[3.75rem] lg:pt-52 xl:min-h-[640px] xl:gap-14 xl:pb-16 xl:pt-56">
              <div className="flex items-center">
                <div className="hero-panel w-full max-w-none lg:max-w-[54rem] xl:max-w-[60rem]">
                  <p className="eyebrow">{section.navLabel}</p>
                  <h1
                    className={`mt-6 max-w-[calc(100vw-2rem)] hero-display hero-display-section text-[#1f252d] sm:max-w-none ${
                      locale === 'zh' ? 'hero-title-nowrap' : ''
                    }`}
                  >
                    {activeHero.title}
                  </h1>
                  <p className="hero-copy mt-6 max-w-[calc(100vw-2rem)] text-[0.98rem] leading-7 text-[#4f5a67] sm:mt-7 sm:max-w-[54rem] sm:text-[1.2rem] sm:leading-9 xl:text-[1.24rem]">
                    {activeHeroSubtitle}
                  </p>

                  <div className="mt-8 flex flex-col gap-2.5 sm:mt-11 sm:flex-row sm:flex-wrap sm:gap-5">
                    <Link to={buildLocalizedPath(locale, 'inquiry')} className="btn-primary w-full sm:w-auto">
                      {locale === 'zh' ? '提交项目需求' : 'Submit Requirement'}
                    </Link>
                    <Link to={buildLocalizedPath(locale, 'contact')} className="btn-secondary w-full sm:w-auto">
                      {contactActionLabel}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid max-w-3xl grid-cols-3 gap-3 border-t border-[#d7cfbf] pt-5 sm:gap-7 sm:pt-7">
                {activeHero.metrics.slice(0, 3).map((metric) => (
                  <div key={`${metric.label}-${metric.value}`}>
                    <p className="font-display text-[2.15rem] leading-none text-[#1f252d] sm:text-[3.2rem]">{metric.value}</p>
                    <p className="metric-label mt-2 text-[12px]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="-mx-4 overflow-x-auto border-y border-[#d7cfbf] px-4 py-3 sm:-mx-6 sm:px-6 sm:py-4 xl:-mx-8 xl:px-8 2xl:-mx-10 2xl:px-10">
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

        <div className="grid gap-8 sm:gap-12 xl:grid-cols-[minmax(0,1fr)_280px] 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div key={location.pathname} className="animate-fade-up">
            <div className="grid gap-5 border-b border-[#d7cfbf] pb-8 sm:gap-7 sm:pb-12 xl:grid-cols-[0.38fr_0.62fr] xl:items-start 2xl:grid-cols-[0.34fr_0.66fr]">
              <div>
                <p className="eyebrow">{section.navLabel}</p>
                <h2 className="section-title-lg mt-4">{activePage.title}</h2>
              </div>
              <div className="space-y-4">
                <p className="section-copy section-copy-wide max-w-none">
                  {activeDescriptionLead}
                </p>
                <p className="text-[0.98rem] leading-8 text-[#5a6572] sm:text-[1.04rem]">
                  {sectionThemeGuide.lead}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {sectionThemeGuide.tags.map((item) => (
                    <span key={item} className="summary-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 sm:mt-12">
              {activePage.kind === 'article' && renderArticle(locale, activePage)}
              {activePage.kind === 'grid' && renderGrid(locale, activePage)}
              {activePage.kind === 'news' && renderNews(locale, section.segment, section.defaultPageId, activePage)}
              {activePage.kind === 'contact' && renderContact(locale, activePage)}
            </div>
          </div>

          <aside className="xl:sticky xl:top-[10.1rem] 2xl:top-[10.8rem] xl:h-fit">
            <div className="space-y-4 sm:space-y-5">
              <div className="action-panel px-5 py-6 sm:px-7">
                <p className="eyebrow">{locale === 'zh' ? '快速操作' : 'Quick Actions'}</p>
                <p className="section-copy section-copy-compact mt-4 max-w-none text-[0.98rem]">
                  {asideLeadText}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 xl:gap-5">
                  <Link
                    to={primaryAsideLink.to}
                    className="info-card content-card block transition-colors hover:border-[#c89b45]/30"
                  >
                    <p className="meta-label">{primaryAsideLink.label}</p>
                    <p className="meta-copy meta-copy-compact mt-3 copy-clamp-3">
                      {locale === 'zh' ? '回到当前主题继续查看。' : 'Return to the current topic.'}
                    </p>
                  </Link>
                  <Link
                    to={contextualAsideLink.to}
                    className="info-card content-card block transition-colors hover:border-[#c89b45]/30"
                  >
                    <p className="meta-label">{contextualAsideLink.label}</p>
                    <p className="meta-copy meta-copy-compact mt-3 copy-clamp-3">
                      {locale === 'zh' ? '切换到相关栏目继续查看。' : 'Switch to the related section.'}
                    </p>
                  </Link>
                  <Link
                    to={buildLocalizedPath(locale, 'inquiry')}
                    className="info-card content-card block transition-colors hover:border-[#c89b45]/30"
                  >
                    <p className="meta-label">{locale === 'zh' ? '提交项目需求' : 'Submit Requirement'}</p>
                    <p className="meta-copy meta-copy-compact mt-3 copy-clamp-3">
                      {locale === 'zh' ? '条件明确后可直接发起项目对接。' : 'Start project intake when scope is clear.'}
                    </p>
                  </Link>
                </div>
                <Link to={buildLocalizedPath(locale, 'contact')} className="cta-link cta-link-primary mt-6">
                  {contactActionLabel}
                </Link>
              </div>

              <div className="info-card content-card hidden xl:block">
                <p className="eyebrow">{locale === 'zh' ? '当前浏览' : 'Now Viewing'}</p>
                <p className="meta-copy meta-copy-compact mt-4">
                  {locale === 'zh'
                    ? `${section.navLabel} / ${newsArticlePage ? activeMenuLabel : activePage.title}`
                    : `${section.navLabel} / ${newsArticlePage ? activeMenuLabel : activePage.title}`}
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {sectionSummaryTags.map((item, index) => (
                    <span key={`${item}-${index}`} className="summary-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="border-t border-[#d7cfbf] pt-8 sm:pt-12">
          <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr] 2xl:grid-cols-[0.92fr_1.08fr]">
            <div className="panel content-card">
              <p className="eyebrow">{sectionSummaryTitle}</p>
              <h2 className="subsection-title mt-4">
                {sectionSummaryLead}
              </h2>
              <p className="section-copy section-copy-compact mt-5 max-w-none copy-clamp-4 copy-unclamp-lg">
                {locale === 'zh'
                  ? '我们将栏目关键信息集中展示，便于快速了解与沟通。'
                  : 'Key section information is concentrated here for quick understanding and communication.'}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {sectionSummaryTags.map((item, index) => (
                  <span key={`${item}-${index}`} className="summary-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:gap-7">
              {compactSummaryCards.map((card) => (
                <article key={card.title} className="panel content-card">
                  <p className="eyebrow">{card.title}</p>
                  <p className="section-copy section-copy-compact mt-5 max-w-none copy-clamp-4 copy-unclamp-lg">{card.text}</p>
                  {card.title === (locale === 'zh' ? '服务说明' : 'Service Notes') && highlightedCertificate && (
                    <p className="mt-4 text-sm leading-7 text-[#58616d]">
                      {locale === 'zh'
                        ? `可提供资质文件：${highlightedCertificate.title}`
                        : `Available qualification document: ${highlightedCertificate.title}`}
                    </p>
                  )}
                </article>
              ))}

              {showVerifiedHighlights && (
                <article className="panel content-card md:col-span-2">
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
        </div>
      </section>
    </div>
  )
}

export default PortalSectionView
