import { useEffect, useMemo, useState, type FormEvent } from 'react'
import axios from 'axios'
import { getPortalSections, type PortalPageData, type PortalSectionKey } from '../content/portal'
import type { HomeCopy, Locale } from '../i18n/types'
import { zhCopy } from '../i18n/zh'
import { enCopy } from '../i18n/en'

type InquiryStatus = 'pending' | 'reviewed' | 'contacted' | 'completed' | 'rejected'
type InquiryPrivacy = 'public' | 'confidential'
type SiteResourceEditorTab = 'contacts' | 'message' | 'narratives' | 'verified' | 'raw'

interface Inquiry {
  id: number
  name: string
  email: string
  phone: string | null
  company: string | null
  category: string | null
  product: string | null
  quantity: string | null
  privacy: InquiryPrivacy | null
  message: string
  status: InquiryStatus
  created_at: string
}

interface CmsPageOverride {
  sectionKey: string
  pageId: string
  content: PortalPageData | Partial<HomeCopy>
  updatedAt?: string
}

interface CmsPagesResponse {
  locale: Locale
  pages: CmsPageOverride[]
}

interface SiteResourcesResponse {
  content: Record<string, unknown>
  hasOverride: boolean
  updatedAt?: string | null
}

const statusOptions: InquiryStatus[] = ['pending', 'reviewed', 'contacted', 'completed', 'rejected']

const statusLabels: Record<InquiryStatus, string> = {
  pending: '待处理',
  reviewed: '已查看',
  contacted: '已联系',
  completed: '已完成',
  rejected: '已拒绝'
}

const privacyLabels: Record<InquiryPrivacy, string> = {
  public: '公开',
  confidential: '保密'
}

const portalJsonHints = [
  'hero.title',
  'hero.subtitle',
  'hero.image',
  'hero.badges[]',
  'hero.metrics[]',
  'sourcePageUrl',
  'sections[]'
]

const homeJsonHints = [
  'heroMetrics[]',
  'featuredProducts[]',
  'designNotes[]',
  'processSteps[]',
  'curatedProductNotes[]',
  'brandFrameTitle'
]

const siteResourceJsonHints = [
  'source',
  'contacts',
  'messageForm',
  'productCategories[]',
  'caseCategories[]',
  'newsCategories[]',
  'newsPages.company.items[]',
  'newsArticles.article-80',
  'certificates[]',
  'friendLinks[]',
  'verifiedPages'
]
const siteResourceEditorTabs: Array<{ id: SiteResourceEditorTab; label: string }> = [
  { id: 'contacts', label: '联系方式' },
  { id: 'message', label: '留言规则' },
  { id: 'narratives', label: 'UI 文案' },
  { id: 'verified', label: '资料摘要' },
  { id: 'raw', label: '原始 JSON' }
]

const formLabelClass = 'block text-sm font-semibold text-[#e7dbc7]'
const formHintClass = 'mt-2 text-xs leading-6 text-[#a79b8c]'
const inputClass = 'art-form-field mt-2'
const textAreaClass = `${inputClass} min-h-[220px] font-mono text-xs sm:text-sm`
const compactTextAreaClass = `${inputClass} min-h-[120px] text-sm`

const isPortalPageData = (value: unknown): value is PortalPageData => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const data = value as { title?: unknown; kind?: unknown }
  return typeof data.title === 'string' && typeof data.kind === 'string'
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const toRecord = (value: unknown): Record<string, unknown> => (isRecord(value) ? value : {})

const cloneRecord = (value: Record<string, unknown>) => JSON.parse(JSON.stringify(value)) as Record<string, unknown>

const getTextValue = (record: Record<string, unknown>, key: string) => {
  const value = record[key]
  return typeof value === 'string' ? value : ''
}

const getStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const getOrCreateRecord = (record: Record<string, unknown>, key: string) => {
  const current = record[key]
  if (isRecord(current)) {
    return current
  }
  const next: Record<string, unknown> = {}
  record[key] = next
  return next
}

const mergeHomeContent = (base: HomeCopy, override: unknown): HomeCopy => {
  if (!isRecord(override)) {
    return base
  }

  const next = override as Partial<HomeCopy>
  return {
    ...base,
    ...next,
    featuredProducts:
      Array.isArray(next.featuredProducts) && next.featuredProducts.length > 0
        ? next.featuredProducts
        : base.featuredProducts,
    heroMetrics:
      Array.isArray(next.heroMetrics) && next.heroMetrics.length > 0
        ? next.heroMetrics
        : base.heroMetrics,
    designNotes:
      Array.isArray(next.designNotes) && next.designNotes.length > 0
        ? next.designNotes
        : base.designNotes,
    processSteps:
      Array.isArray(next.processSteps) && next.processSteps.length > 0
        ? next.processSteps
        : base.processSteps,
    curatedProductNotes:
      Array.isArray(next.curatedProductNotes) && next.curatedProductNotes.length > 0
        ? next.curatedProductNotes
        : base.curatedProductNotes
  }
}

const formatDate = (dateString?: string) =>
  dateString ? new Date(dateString).toLocaleString('zh-CN', { hour12: false }) : '-'

const getStatusBadgeClass = (status: InquiryStatus) => {
  const classes: Record<InquiryStatus, string> = {
    pending: 'border-[#d7b66c]/28 bg-[#d7b66c]/12 text-[#f0dfb0]',
    reviewed: 'border-[#7ca8ff]/28 bg-[#7ca8ff]/12 text-[#dbe8ff]',
    contacted: 'border-[#c18cff]/28 bg-[#c18cff]/12 text-[#eddcff]',
    completed: 'border-[#5acb98]/28 bg-[#5acb98]/12 text-[#d7fbe8]',
    rejected: 'border-[#ef7b7b]/28 bg-[#ef7b7b]/12 text-[#ffd6d6]'
  }

  return classes[status]
}

const getStatusActionClass = (status: InquiryStatus, active: boolean) => {
  if (active) {
    return `border ${getStatusBadgeClass(status)} shadow-[0_12px_24px_rgba(0,0,0,0.18)]`
  }

  return 'border border-white/8 bg-white/[0.03] text-[#d7ccbd] hover:border-[#e8ce8e]/20 hover:bg-white/[0.06] hover:text-white'
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'cms'>('inquiries')

  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [inquiryLoading, setInquiryLoading] = useState(false)
  const [inquiryError, setInquiryError] = useState<string | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token') || '')
  const [tokenInput, setTokenInput] = useState(localStorage.getItem('admin_token') || '')

  const [cmsLocale, setCmsLocale] = useState<Locale>('zh')
  const [cmsSectionKey, setCmsSectionKey] = useState<PortalSectionKey>('about')
  const [cmsPageId, setCmsPageId] = useState('')
  const [cmsOverrides, setCmsOverrides] = useState<CmsPageOverride[]>([])
  const [cmsLoading, setCmsLoading] = useState(false)
  const [cmsError, setCmsError] = useState<string | null>(null)
  const [cmsMessage, setCmsMessage] = useState<string | null>(null)
  const [cmsTitle, setCmsTitle] = useState('')
  const [cmsSubtitle, setCmsSubtitle] = useState('')
  const [cmsBodyJson, setCmsBodyJson] = useState('')
  const [homeCmsJson, setHomeCmsJson] = useState('')
  const [homeCmsError, setHomeCmsError] = useState<string | null>(null)
  const [homeCmsMessage, setHomeCmsMessage] = useState<string | null>(null)
  const [siteResourcesJson, setSiteResourcesJson] = useState('')
  const [siteResourcesError, setSiteResourcesError] = useState<string | null>(null)
  const [siteResourcesMessage, setSiteResourcesMessage] = useState<string | null>(null)
  const [siteResourcesUpdatedAt, setSiteResourcesUpdatedAt] = useState<string | null>(null)
  const [siteResourcesHasOverride, setSiteResourcesHasOverride] = useState(false)
  const [siteResourcesLoading, setSiteResourcesLoading] = useState(false)
  const [siteResourceEditorTab, setSiteResourceEditorTab] = useState<SiteResourceEditorTab>('contacts')

  const authHeaders = adminToken ? { Authorization: `Bearer ${adminToken}` } : {}

  const sections = useMemo(() => getPortalSections(cmsLocale), [cmsLocale])
  const sectionKeys = useMemo(() => Object.keys(sections) as PortalSectionKey[], [sections])

  useEffect(() => {
    if (sectionKeys.length === 0) {
      return
    }

    if (!sections[cmsSectionKey]) {
      setCmsSectionKey(sectionKeys[0])
    }
  }, [cmsSectionKey, sectionKeys, sections])

  const currentSection = sections[cmsSectionKey] || sections[sectionKeys[0]]

  useEffect(() => {
    if (!currentSection) {
      return
    }

    if (!cmsPageId || !currentSection.pages[cmsPageId]) {
      setCmsPageId(currentSection.defaultPageId)
    }
  }, [cmsPageId, currentSection])

  const basePage = currentSection?.pages[cmsPageId] || null

  const activeOverride = useMemo(() => {
    return cmsOverrides.find((item) => item.sectionKey === cmsSectionKey && item.pageId === cmsPageId)
  }, [cmsOverrides, cmsPageId, cmsSectionKey])

  const activeContent = activeOverride?.content && isPortalPageData(activeOverride.content)
    ? activeOverride.content
    : basePage
  const currentMenuItem = currentSection?.menu.find((item) => item.id === cmsPageId)

  const homeBase = useMemo(() => (cmsLocale === 'zh' ? zhCopy.home : enCopy.home), [cmsLocale])

  const homeOverride = useMemo(() => {
    return cmsOverrides.find((item) => item.sectionKey === 'home' && item.pageId === 'index')
  }, [cmsOverrides])

  const homeContent = useMemo(() => {
    return mergeHomeContent(homeBase, homeOverride?.content)
  }, [homeBase, homeOverride?.content])

  const pendingCount = useMemo(
    () => inquiries.filter((item) => item.status === 'pending').length,
    [inquiries]
  )
  const parsedSiteResourcesResult = useMemo(() => {
    if (!siteResourcesJson.trim()) {
      return {
        value: null as Record<string, unknown> | null,
        error: null as string | null
      }
    }

    try {
      const parsed = JSON.parse(siteResourcesJson)
      if (!isRecord(parsed)) {
        return {
          value: null,
          error: '共享资料 JSON 必须是对象。'
        }
      }

      return {
        value: parsed as Record<string, unknown>,
        error: null
      }
    } catch {
      return {
        value: null,
        error: '共享资料 JSON 格式不正确，模块化编辑暂不可用。'
      }
    }
  }, [siteResourcesJson])
  const parsedSiteResources = parsedSiteResourcesResult.value
  const siteResourcesJsonError = parsedSiteResourcesResult.error
  const contactResource = toRecord(parsedSiteResources?.contacts)
  const messageFormResource = toRecord(parsedSiteResources?.messageForm)
  const uiNarrativesResource = toRecord(parsedSiteResources?.uiNarratives)
  const verifiedPagesResource = toRecord(parsedSiteResources?.verifiedPages)
  const homeNarrativeResource = toRecord(uiNarrativesResource.home)
  const portalNarrativeResource = toRecord(uiNarrativesResource.portal)
  const inquiryNarrativeResource = toRecord(uiNarrativesResource.inquiry)
  const footerNarrativeResource = toRecord(uiNarrativesResource.footer)
  const companyProfileVerified = toRecord(verifiedPagesResource.companyProfile)
  const contactInfoVerified = toRecord(verifiedPagesResource.contactInfo)
  const messagePageVerified = toRecord(verifiedPagesResource.messagePage)

  const applySiteResourceDraft = (mutator: (draft: Record<string, unknown>) => void) => {
    if (!parsedSiteResources) {
      setSiteResourcesError('共享资料 JSON 格式不正确，无法执行模块化编辑。')
      return
    }

    const draft = cloneRecord(parsedSiteResources)
    mutator(draft)
    setSiteResourcesJson(JSON.stringify(draft, null, 2))
    setSiteResourcesMessage(null)
    setSiteResourcesError(null)
  }

  const updateContactField = (field: string, value: string) => {
    applySiteResourceDraft((draft) => {
      const contacts = getOrCreateRecord(draft, 'contacts')
      contacts[field] = value
    })
  }

  const updateMessageFormField = (field: string, value: string) => {
    applySiteResourceDraft((draft) => {
      const messageForm = getOrCreateRecord(draft, 'messageForm')
      messageForm[field] = value
    })
  }

  const updateMessageRequiredFields = (value: string) => {
    const fields = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    applySiteResourceDraft((draft) => {
      const messageForm = getOrCreateRecord(draft, 'messageForm')
      messageForm.requiredFields = fields
    })
  }

  const updateNarrativeField = (
    group: 'home' | 'portal' | 'inquiry' | 'footer',
    field: string,
    value: string
  ) => {
    applySiteResourceDraft((draft) => {
      const uiNarratives = getOrCreateRecord(draft, 'uiNarratives')
      const groupRecord = getOrCreateRecord(uiNarratives, group)
      groupRecord[field] = value
    })
  }

  const updateVerifiedSummary = (
    key: 'companyProfile' | 'contactInfo' | 'messagePage',
    field: 'summary' | 'summaryEn',
    value: string
  ) => {
    applySiteResourceDraft((draft) => {
      const verifiedPages = getOrCreateRecord(draft, 'verifiedPages')
      const page = getOrCreateRecord(verifiedPages, key)
      if (!getTextValue(page, 'title')) {
        page.title = key
      }
      if (!getTextValue(page, 'sourcePageUrl')) {
        page.sourcePageUrl = ''
      }
      page[field] = value
    })
  }

  const contactMailboxCount = Array.isArray(contactResource.mailboxes) ? contactResource.mailboxes.length : 0
  const messageCategoryCount = Array.isArray(messageFormResource.categoryOptions)
    ? messageFormResource.categoryOptions.length
    : 0
  const requiredFieldsText = getStringArray(messageFormResource.requiredFields).join(', ')

  useEffect(() => {
    if (!adminToken) {
      return
    }

    void fetchInquiries()
  }, [adminToken])

  useEffect(() => {
    if (!adminToken) {
      return
    }

    void fetchCmsOverrides(cmsLocale)
  }, [adminToken, cmsLocale])

  useEffect(() => {
    if (!adminToken) {
      return
    }

    void fetchSiteResources()
  }, [adminToken])

  useEffect(() => {
    if (!activeContent) {
      return
    }

    const { title, subtitle, ...rest } = activeContent
    setCmsTitle(title)
    setCmsSubtitle(subtitle || '')
    setCmsBodyJson(JSON.stringify(rest, null, 2))
    setCmsMessage(null)
    setCmsError(null)
  }, [activeContent])

  useEffect(() => {
    setHomeCmsJson(JSON.stringify(homeContent, null, 2))
    setHomeCmsError(null)
    setHomeCmsMessage(null)
  }, [homeContent])

  useEffect(() => {
    if (!showDetail) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDetail(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showDetail])

  const fetchInquiries = async () => {
    try {
      setInquiryLoading(true)
      setInquiryError(null)
      const response = await axios.get<Inquiry[]>('/api/inquiries', { headers: authHeaders })
      setInquiries(response.data)
    } catch {
      setInquiryError('获取询盘失败，请检查管理员令牌。')
    } finally {
      setInquiryLoading(false)
    }
  }

  const fetchCmsOverrides = async (locale: Locale) => {
    try {
      setCmsLoading(true)
      setCmsError(null)
      const response = await axios.get<CmsPagesResponse>(`/api/cms/pages/${locale}`)
      setCmsOverrides(Array.isArray(response.data.pages) ? response.data.pages : [])
    } catch {
      setCmsOverrides([])
      setCmsError('加载 CMS 页面内容失败。')
    } finally {
      setCmsLoading(false)
    }
  }

  const fetchSiteResources = async () => {
    try {
      setSiteResourcesLoading(true)
      setSiteResourcesError(null)
      const response = await axios.get<SiteResourcesResponse>('/api/cms/site-resources', {
        headers: authHeaders
      })
      setSiteResourcesJson(JSON.stringify(response.data.content, null, 2))
      setSiteResourcesHasOverride(!!response.data.hasOverride)
      setSiteResourcesUpdatedAt(response.data.updatedAt || null)
    } catch {
      setSiteResourcesJson('')
      setSiteResourcesHasOverride(false)
      setSiteResourcesUpdatedAt(null)
      setSiteResourcesError('加载共享资料池失败。')
    } finally {
      setSiteResourcesLoading(false)
    }
  }

  const handleViewDetail = async (id: number) => {
    try {
      setInquiryError(null)
      const response = await axios.get<Inquiry>(`/api/inquiries/${id}`, { headers: authHeaders })
      setSelectedInquiry(response.data)
      setShowDetail(true)
    } catch {
      setInquiryError('获取询盘详情失败。')
    }
  }

  const handleUpdateStatus = async (id: number, status: InquiryStatus) => {
    try {
      setInquiryError(null)
      await axios.put(`/api/inquiries/${id}/status`, { status }, { headers: authHeaders })
      setInquiries((current) => current.map((item) => (item.id === id ? { ...item, status } : item)))
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status })
      }
    } catch {
      setInquiryError('更新状态失败。')
    }
  }

  const handleSaveCmsContent = async () => {
    if (!basePage) {
      return
    }

    const trimmedTitle = cmsTitle.trim()
    if (!trimmedTitle) {
      setCmsError('标题不能为空。')
      return
    }

    let rest: Record<string, unknown>
    try {
      const parsed = JSON.parse(cmsBodyJson)
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        setCmsError('内容 JSON 必须是对象。')
        return
      }
      rest = parsed as Record<string, unknown>
    } catch {
      setCmsError('内容 JSON 格式不正确。')
      return
    }

    const contentPayload: Record<string, unknown> = {
      ...rest,
      title: trimmedTitle,
      kind: basePage.kind
    }

    const subtitle = cmsSubtitle.trim()
    if (subtitle) {
      contentPayload.subtitle = subtitle
    }

    try {
      setCmsError(null)
      await axios.put(
        `/api/cms/page/${cmsLocale}/${cmsSectionKey}/${cmsPageId}`,
        { content: contentPayload },
        { headers: authHeaders }
      )
      setCmsMessage('栏目页内容已保存。')
      await fetchCmsOverrides(cmsLocale)
    } catch {
      setCmsError('保存栏目页内容失败。')
    }
  }

  const handleResetCmsContent = async () => {
    try {
      setCmsError(null)
      setCmsMessage(null)
      await axios.delete(`/api/cms/page/${cmsLocale}/${cmsSectionKey}/${cmsPageId}`, {
        headers: authHeaders
      })
      setCmsMessage('已恢复该栏目页的默认内容。')
      await fetchCmsOverrides(cmsLocale)
    } catch {
      setCmsError('恢复默认内容失败，若未保存过覆盖内容会返回失败。')
    }
  }

  const handleSaveHomeCmsContent = async () => {
    let parsed: unknown
    try {
      parsed = JSON.parse(homeCmsJson)
    } catch {
      setHomeCmsError('首页 JSON 格式不正确。')
      return
    }

    if (!isRecord(parsed)) {
      setHomeCmsError('首页 JSON 必须是对象。')
      return
    }

    try {
      setHomeCmsError(null)
      setHomeCmsMessage(null)
      await axios.put(
        `/api/cms/page/${cmsLocale}/home/index`,
        { content: parsed },
        { headers: authHeaders }
      )
      setHomeCmsMessage('首页叙事内容已保存。')
      await fetchCmsOverrides(cmsLocale)
    } catch {
      setHomeCmsError('保存首页配置失败。')
    }
  }

  const handleResetHomeCmsContent = async () => {
    try {
      setHomeCmsError(null)
      setHomeCmsMessage(null)
      await axios.delete(`/api/cms/page/${cmsLocale}/home/index`, {
        headers: authHeaders
      })
      setHomeCmsMessage('首页已恢复为默认叙事内容。')
      await fetchCmsOverrides(cmsLocale)
    } catch {
      setHomeCmsError('恢复首页默认内容失败，若未覆盖过会返回失败。')
    }
  }

  const handleSaveSiteResources = async () => {
    let parsed: unknown
    try {
      parsed = JSON.parse(siteResourcesJson)
    } catch {
      setSiteResourcesError('官方资源 JSON 格式不正确。')
      return
    }

    if (!isRecord(parsed)) {
      setSiteResourcesError('官方资源 JSON 必须是对象。')
      return
    }

    try {
      setSiteResourcesError(null)
      setSiteResourcesMessage(null)
      await axios.put(
        '/api/cms/site-resources',
        { content: parsed },
        { headers: authHeaders }
      )
      setSiteResourcesMessage('共享资料池已保存。')
      await fetchSiteResources()
    } catch {
      setSiteResourcesError('保存共享资料池失败。')
    }
  }

  const handleResetSiteResources = async () => {
    try {
      setSiteResourcesError(null)
      setSiteResourcesMessage(null)
      await axios.delete('/api/cms/site-resources', { headers: authHeaders })
      setSiteResourcesMessage('共享资料池已恢复为默认资料。')
      await fetchSiteResources()
    } catch {
      setSiteResourcesError('恢复共享资料池默认值失败，若未覆盖过会返回失败。')
    }
  }

  const handleTokenSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const value = tokenInput.trim()
    if (!value) {
      setInquiryError('请输入管理员令牌。')
      return
    }

    localStorage.setItem('admin_token', value)
    setAdminToken(value)
    setInquiryError(null)
  }

  const clearToken = () => {
    localStorage.removeItem('admin_token')
    setAdminToken('')
    setTokenInput('')
    setInquiries([])
    setSelectedInquiry(null)
    setShowDetail(false)
    setInquiryError(null)
    setCmsOverrides([])
    setCmsError(null)
    setCmsMessage(null)
    setHomeCmsError(null)
    setHomeCmsMessage(null)
    setSiteResourcesJson('')
    setSiteResourcesError(null)
    setSiteResourcesMessage(null)
    setSiteResourcesUpdatedAt(null)
    setSiteResourcesHasOverride(false)
    setSiteResourcesLoading(false)
    setSiteResourceEditorTab('contacts')
  }

  if (!adminToken) {
    return (
      <div className="section-wrap py-12 sm:py-16">
        <div className="mx-auto max-w-3xl panel panel-block panel-block-dark overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-[#d7b66c]/16 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#8f672b]/22 blur-3xl" />

          <div className="relative">
            <p className="eyebrow">Control Room</p>
            <h1 className="mt-4 font-display text-5xl leading-none text-white sm:text-6xl">
              后台管理入口
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#c8bcae] sm:text-base">
              这里用于管理询盘、栏目页覆盖内容，以及首页叙事字段。令牌仅存储在当前浏览器，不会写回站点内容。
            </p>

          {inquiryError && (
            <div className="mt-6 rounded-[22px] border border-[#ef7b7b]/22 bg-[#ef7b7b]/10 px-4 py-3 text-sm text-[#ffd6d6]">
              {inquiryError}
            </div>
          )}

            <form onSubmit={handleTokenSubmit} className="mt-8 grid gap-4">
              <label className={formLabelClass}>
                管理员令牌
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(event) => setTokenInput(event.target.value)}
                  placeholder="Admin token"
                  className={inputClass}
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="submit" className="btn-primary min-h-[48px] px-6 py-3">
                  进入后台
                </button>
                <p className="text-xs leading-6 text-[#a79b8c]">
                  建议仅在受信环境中登录，完成操作后及时退出。
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-wrap space-y-8 py-10 sm:py-12">
      <section className="panel panel-block panel-block-dark overflow-hidden px-6 py-8 sm:px-8 sm:py-9">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="eyebrow">Admin Console</p>
            <h1 className="mt-4 font-display text-5xl leading-none text-white sm:text-6xl">
              内容与询盘总控台
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-[#c8bcae] sm:text-base">
              前台已经切到更宽的工业化布局，后台也同步到同一套语言，并把首页叙事字段、栏目覆盖逻辑和询盘流转放到一个界面里管理。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="pill">{cmsLocale === 'zh' ? '中文内容池' : 'English Content Pool'}</span>
            <span className="pill">{activeTab === 'inquiries' ? 'Inquiry Desk' : 'CMS Desk'}</span>
            <button type="button" onClick={clearToken} className="btn-secondary min-h-[44px] px-5 py-2 text-sm">
              退出登录
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="art-card px-5 py-5 sm:px-6">
            <p className="eyebrow">Volume</p>
            <p className="mt-4 font-display text-4xl leading-none text-white">{inquiries.length}</p>
            <p className="mt-3 text-sm leading-7 text-[#b8ad9e]">当前询盘总量</p>
          </article>
          <article className="art-card px-5 py-5 sm:px-6">
            <p className="eyebrow">Pending</p>
            <p className="mt-4 font-display text-4xl leading-none text-white">{pendingCount}</p>
            <p className="mt-3 text-sm leading-7 text-[#b8ad9e]">待处理询盘数</p>
          </article>
          <article className="art-card px-5 py-5 sm:px-6">
            <p className="eyebrow">Overrides</p>
            <p className="mt-4 font-display text-4xl leading-none text-white">{cmsOverrides.length}</p>
            <p className="mt-3 text-sm leading-7 text-[#b8ad9e]">当前语言下的 CMS 覆盖记录</p>
          </article>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={
            activeTab === 'inquiries'
              ? 'btn-primary min-h-[44px] px-5 py-2 text-sm'
              : 'btn-secondary min-h-[44px] px-5 py-2 text-sm'
          }
        >
          询盘管理
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cms')}
          className={
            activeTab === 'cms'
              ? 'btn-primary min-h-[44px] px-5 py-2 text-sm'
              : 'btn-secondary min-h-[44px] px-5 py-2 text-sm'
          }
        >
          页面内容管理
        </button>
      </div>

      {activeTab === 'inquiries' ? (
        <section className="panel overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-white/6 px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
            <div>
              <p className="eyebrow">Inquiry Desk</p>
              <h2 className="mt-3 font-display text-4xl leading-none text-white sm:text-5xl">
                询盘管理
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#b8ad9e]">
                查看详情、切换状态，并保持销售跟进链路清晰。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="pill">待处理 {pendingCount}</span>
              <button
                type="button"
                onClick={() => void fetchInquiries()}
                className="btn-secondary min-h-[44px] px-5 py-2 text-sm"
                disabled={inquiryLoading}
              >
                {inquiryLoading ? '刷新中...' : '刷新数据'}
              </button>
            </div>
          </div>

          {inquiryError && (
            <div className="mx-6 mt-6 rounded-[22px] border border-[#ef7b7b]/22 bg-[#ef7b7b]/10 px-4 py-3 text-sm text-[#ffd6d6] sm:mx-8">
              {inquiryError}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className="label-muted px-6 py-4 text-left text-[11px] sm:px-8">ID</th>
                  <th className="label-muted px-6 py-4 text-left text-[11px] sm:px-8">姓名</th>
                  <th className="label-muted px-6 py-4 text-left text-[11px] sm:px-8">邮箱</th>
                  <th className="label-muted px-6 py-4 text-left text-[11px] sm:px-8">状态</th>
                  <th className="label-muted px-6 py-4 text-left text-[11px] sm:px-8">创建时间</th>
                  <th className="label-muted px-6 py-4 text-left text-[11px] sm:px-8">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="px-6 py-4 text-sm text-[#d7ccbd] sm:px-8">{inquiry.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-white sm:px-8">{inquiry.name}</td>
                    <td className="px-6 py-4 text-sm text-[#c8bcae] sm:px-8">{inquiry.email}</td>
                    <td className="px-6 py-4 text-sm sm:px-8">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(inquiry.status)}`}>
                        {statusLabels[inquiry.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#a79b8c] sm:px-8">{formatDate(inquiry.created_at)}</td>
                    <td className="px-6 py-4 text-sm sm:px-8">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(inquiry.id)}
                        className="font-semibold text-[#f0dfb0] transition-colors hover:text-white"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {inquiryLoading && <p className="px-6 py-6 text-sm text-[#a79b8c] sm:px-8">询盘列表加载中...</p>}
          {!inquiryLoading && inquiries.length === 0 && <p className="px-6 py-6 text-sm text-[#a79b8c] sm:px-8">暂无询盘数据。</p>}

          {showDetail && selectedInquiry && (
            <div
              className="fixed inset-0 z-[70] flex items-center justify-center bg-black/72 p-4 backdrop-blur-md"
              onClick={() => setShowDetail(false)}
            >
              <div
                className="panel panel-block panel-block-dark max-h-[90vh] w-full max-w-3xl overflow-y-auto px-6 py-6 sm:px-8"
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-inquiry-title"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Detail Sheet</p>
                    <h2
                      id="admin-inquiry-title"
                      className="mt-3 font-display text-4xl leading-none text-white sm:text-5xl"
                    >
                      询盘详情
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[#b8ad9e]">
                      使用 `Esc` 或右上角按钮可快速关闭。
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDetail(false)}
                    className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border border-[#e8ce8e]/16 bg-white/[0.03] text-white transition-colors hover:bg-white/[0.07]"
                    aria-label="关闭详情"
                  >
                    <span className="text-xl leading-none">&times;</span>
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="pill">ID {selectedInquiry.id}</span>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(selectedInquiry.status)}`}>
                    {statusLabels[selectedInquiry.status]}
                  </span>
                  <span className="label-muted text-xs">
                    {formatDate(selectedInquiry.created_at)}
                  </span>
                </div>

                <div className="art-divider my-6" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <article className="art-card px-5 py-4">
                    <p className="eyebrow">Name</p>
                    <p className="mt-3 text-sm text-white sm:text-base">{selectedInquiry.name}</p>
                  </article>
                  <article className="art-card px-5 py-4">
                    <p className="eyebrow">Email</p>
                    <p className="mt-3 text-sm text-white sm:text-base">{selectedInquiry.email}</p>
                  </article>
                  <article className="art-card px-5 py-4">
                    <p className="eyebrow">Phone</p>
                    <p className="mt-3 text-sm text-white sm:text-base">{selectedInquiry.phone || '-'}</p>
                  </article>
                  <article className="art-card px-5 py-4">
                    <p className="eyebrow">Company</p>
                    <p className="mt-3 text-sm text-white sm:text-base">{selectedInquiry.company || '-'}</p>
                  </article>
                  <article className="art-card px-5 py-4">
                    <p className="eyebrow">Category</p>
                    <p className="mt-3 text-sm text-white sm:text-base">{selectedInquiry.category || '-'}</p>
                  </article>
                  <article className="art-card px-5 py-4">
                    <p className="eyebrow">Product</p>
                    <p className="mt-3 text-sm text-white sm:text-base">{selectedInquiry.product || '-'}</p>
                  </article>
                  <article className="art-card px-5 py-4">
                    <p className="eyebrow">Quantity</p>
                    <p className="mt-3 text-sm text-white sm:text-base">{selectedInquiry.quantity || '-'}</p>
                  </article>
                  <article className="art-card px-5 py-4">
                    <p className="eyebrow">Privacy</p>
                    <p className="mt-3 text-sm text-white sm:text-base">
                      {selectedInquiry.privacy ? privacyLabels[selectedInquiry.privacy] : '-'}
                    </p>
                  </article>
                </div>

                <article className="art-card mt-4 px-5 py-5">
                  <p className="eyebrow">Message</p>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-[#d7ccbd] sm:text-base">
                    {selectedInquiry.message}
                  </p>
                </article>

                <div className="mt-6">
                  <p className="eyebrow">Status Flow</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleUpdateStatus(selectedInquiry.id, status)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${getStatusActionClass(
                          status,
                          selectedInquiry.status === status
                        )}`}
                      >
                        {statusLabels[status]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-6">
          <section className="panel px-6 py-6 sm:px-8">
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="eyebrow">Portal CMS</p>
                <h2 className="mt-3 font-display text-4xl leading-none text-white sm:text-5xl">
                  栏目页内容配置
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-[#b8ad9e] sm:text-base">
                  这里管理产品外的栏目页覆盖内容。标题、副标题和 JSON 主体会在保存后直接覆盖前台展示，恢复默认则删除覆盖记录。
                </p>
              </div>

              <div className="art-card px-5 py-5 sm:px-6">
                <p className="eyebrow">Current Scope</p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[#d7ccbd]">
                  <p><span className="text-[#9f9588]">语言：</span>{cmsLocale === 'zh' ? '中文' : 'English'}</p>
                  <p><span className="text-[#9f9588]">栏目：</span>{currentSection?.navLabel || '-'}</p>
                  <p><span className="text-[#9f9588]">页面：</span>{currentMenuItem?.label || cmsPageId || '-'}</p>
                  <p><span className="text-[#9f9588]">状态：</span>{activeOverride ? '已启用覆盖' : '使用默认内容'}</p>
                  <p><span className="text-[#9f9588]">最近更新：</span>{formatDate(activeOverride?.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <label className={formLabelClass}>
                语言
                <select
                  value={cmsLocale}
                  onChange={(event) => setCmsLocale(event.target.value as Locale)}
                  className={inputClass}
                >
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
              </label>

              <label className={formLabelClass}>
                栏目
                <select
                  value={cmsSectionKey}
                  onChange={(event) => setCmsSectionKey(event.target.value as PortalSectionKey)}
                  className={inputClass}
                >
                  {sectionKeys.map((key) => (
                    <option key={key} value={key}>{sections[key].navLabel}</option>
                  ))}
                </select>
              </label>

              <label className={formLabelClass}>
                子页面
                <select
                  value={cmsPageId}
                  onChange={(event) => setCmsPageId(event.target.value)}
                  className={inputClass}
                >
                  {currentSection?.menu.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {portalJsonHints.map((field) => (
                <span key={field} className="pill">{field}</span>
              ))}
            </div>

            {cmsError && (
              <div className="mt-5 rounded-[22px] border border-[#ef7b7b]/22 bg-[#ef7b7b]/10 px-4 py-3 text-sm text-[#ffd6d6]">{cmsError}</div>
            )}
            {cmsMessage && (
              <div className="mt-5 rounded-[22px] border border-[#5acb98]/22 bg-[#5acb98]/10 px-4 py-3 text-sm text-[#d7fbe8]">{cmsMessage}</div>
            )}

            {activeContent && (
              <div className="mt-6 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
                <div className="space-y-5">
                  <label className={formLabelClass}>
                    页面标题
                    <input
                      type="text"
                      value={cmsTitle}
                      onChange={(event) => setCmsTitle(event.target.value)}
                      className={inputClass}
                    />
                  </label>

                  <label className={formLabelClass}>
                    副标题
                    <input
                      type="text"
                      value={cmsSubtitle}
                      onChange={(event) => setCmsSubtitle(event.target.value)}
                      className={inputClass}
                    />
                    <p className={formHintClass}>留空时不会写入 subtitle。</p>
                  </label>

                  <div className="art-card px-5 py-5">
                    <p className="eyebrow">Write Rule</p>
                    <p className="mt-4 text-sm leading-8 text-[#b8ad9e]">
                    `title` 与 `kind` 会由后台保留，JSON 主体里只需要填写其余结构字段。`sourcePageUrl` 现在只作为内部资料溯源字段保留，前台不再直接展示外部原页入口，建议优先覆盖当前页面真正需要变化的区块，避免把默认内容整体复制进去。
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={handleSaveCmsContent} className="btn-primary min-h-[44px] px-5 py-2 text-sm" disabled={cmsLoading}>
                      保存覆盖内容
                    </button>
                    <button type="button" onClick={handleResetCmsContent} className="btn-secondary min-h-[44px] px-5 py-2 text-sm" disabled={cmsLoading}>
                      恢复默认
                    </button>
                  </div>
                </div>

                <label className={formLabelClass}>
                  内容 JSON（不含 title / subtitle）
                  <textarea
                    value={cmsBodyJson}
                    onChange={(event) => setCmsBodyJson(event.target.value)}
                    rows={18}
                    className={textAreaClass}
                  />
                  <p className={formHintClass}>
                    可按页面结构扩展 `hero`、`sections`、`timeline`、`highlights` 等字段，保存后会立即刷新覆盖记录。
                  </p>
                </label>
              </div>
            )}
          </section>

          <section className="panel panel-block panel-block-signal overflow-hidden px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="eyebrow">Home Narrative</p>
                <h2 className="mt-3 font-display text-4xl leading-none text-white sm:text-5xl">
                  首页叙事字段配置
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-8 text-[#c8bcae] sm:text-base">
                  这里管理首页的主叙事文本、精选产品说明、工序步骤和指标字段。对应覆盖键固定为 `sectionKey=home`、`pageId=index`。
                </p>
              </div>

              <div className="flex flex-wrap gap-2 xl:max-w-[440px] xl:justify-end">
                {homeJsonHints.map((field) => (
                  <span key={field} className="pill">{field}</span>
                ))}
              </div>
            </div>

            {homeCmsError && (
              <div className="mt-5 rounded-[22px] border border-[#ef7b7b]/22 bg-[#ef7b7b]/10 px-4 py-3 text-sm text-[#ffd6d6]">{homeCmsError}</div>
            )}
            {homeCmsMessage && (
              <div className="mt-5 rounded-[22px] border border-[#5acb98]/22 bg-[#5acb98]/10 px-4 py-3 text-sm text-[#d7fbe8]">{homeCmsMessage}</div>
            )}

            <label className={`${formLabelClass} mt-6`}>
              首页 JSON
              <textarea
                value={homeCmsJson}
                onChange={(event) => setHomeCmsJson(event.target.value)}
                rows={22}
                className={textAreaClass}
              />
            </label>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="art-card px-5 py-5">
                <p className="eyebrow">Editing Note</p>
                <p className="mt-4 text-sm leading-8 text-[#c8bcae]">
                  首页 JSON 建议按完整数组写入，尤其是 `designNotes[]`、`processSteps[]` 和 `featuredProducts[]`。后台会校验这些结构，空数组不会覆盖默认内容。
                </p>
                <p className="mt-3 text-sm leading-8 text-[#b8ad9e]">
                  当前状态：{homeOverride ? '已启用首页覆盖' : '使用默认首页内容'}，最近更新 {formatDate(homeOverride?.updatedAt)}。
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <button type="button" onClick={handleSaveHomeCmsContent} className="btn-primary min-h-[44px] px-5 py-2 text-sm" disabled={cmsLoading}>
                  保存首页配置
                </button>
                <button type="button" onClick={handleResetHomeCmsContent} className="btn-secondary min-h-[44px] px-5 py-2 text-sm" disabled={cmsLoading}>
                  恢复首页默认
                </button>
              </div>
            </div>
          </section>

          <section className="panel px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="eyebrow">Shared Resource Pool</p>
                <h2 className="mt-3 font-display text-4xl leading-none text-white sm:text-5xl">
                  共享资料资源配置
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-8 text-[#c8bcae] sm:text-base">
                  这里管理 `site-resources` 资源池，当前已被首页、栏目页、页脚、询盘页等前台模块直接消费。适合维护产品分类、应用分类、联系方式、留言字段、证书和栏目摘要等真实资料。
                </p>
              </div>

              <div className="flex flex-wrap gap-2 xl:max-w-[460px] xl:justify-end">
                {siteResourceJsonHints.map((field) => (
                  <span key={field} className="pill">{field}</span>
                ))}
              </div>
            </div>

            {siteResourcesError && (
              <div className="mt-5 rounded-[22px] border border-[#ef7b7b]/22 bg-[#ef7b7b]/10 px-4 py-3 text-sm text-[#ffd6d6]">
                {siteResourcesError}
              </div>
            )}
            {siteResourcesMessage && (
              <div className="mt-5 rounded-[22px] border border-[#5acb98]/22 bg-[#5acb98]/10 px-4 py-3 text-sm text-[#d7fbe8]">
                {siteResourcesMessage}
              </div>
            )}

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-5">
                <div className="art-card px-5 py-5">
                  <p className="eyebrow">Current Status</p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-[#d7ccbd]">
                    <p><span className="text-[#9f9588]">状态：</span>{siteResourcesHasOverride ? '已启用资源覆盖' : '使用默认共享资料'}</p>
                    <p><span className="text-[#9f9588]">最近更新：</span>{formatDate(siteResourcesUpdatedAt || undefined)}</p>
                    <p><span className="text-[#9f9588]">留言分类：</span>{messageCategoryCount} 项</p>
                    <p><span className="text-[#9f9588]">联系人邮箱路由：</span>{contactMailboxCount} 项</p>
                    <p><span className="text-[#9f9588]">影响范围：</span>首页摘要、栏目页摘要、产品分类、应用分类、新闻列表、询盘页留言字段与联系信息</p>
                  </div>
                </div>

                <div className="art-card px-5 py-5">
                  <p className="eyebrow">Module Editor</p>
                  <p className="mt-3 text-xs leading-6 text-[#9f9588]">
                    先按模块维护高频字段，复杂结构仍可在右侧原始 JSON 区域编辑。
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {siteResourceEditorTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSiteResourceEditorTab(tab.id)}
                        className={
                          siteResourceEditorTab === tab.id
                            ? 'rounded-full border border-[#d7b66c]/35 bg-[#d7b66c]/18 px-3 py-1.5 text-xs font-semibold text-[#f0dfb0]'
                            : 'rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-[#c8bcae] transition-colors hover:border-[#d7b66c]/28 hover:text-white'
                        }
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {siteResourcesJsonError ? (
                    <div className="mt-4 rounded-[16px] border border-[#ef7b7b]/22 bg-[#ef7b7b]/10 px-4 py-3 text-sm text-[#ffd6d6]">
                      {siteResourcesJsonError}
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {siteResourceEditorTab === 'contacts' && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className={formLabelClass}>
                            公司名称
                            <input
                              value={getTextValue(contactResource, 'company')}
                              onChange={(event) => updateContactField('company', event.target.value)}
                              className={inputClass}
                            />
                          </label>
                          <label className={formLabelClass}>
                            联系电话
                            <input
                              value={getTextValue(contactResource, 'phone')}
                              onChange={(event) => updateContactField('phone', event.target.value)}
                              className={inputClass}
                            />
                          </label>
                          <label className={formLabelClass}>
                            主邮箱
                            <input
                              value={getTextValue(contactResource, 'email')}
                              onChange={(event) => updateContactField('email', event.target.value)}
                              className={inputClass}
                            />
                          </label>
                          <label className={formLabelClass}>
                            热线
                            <input
                              value={getTextValue(contactResource, 'hotline')}
                              onChange={(event) => updateContactField('hotline', event.target.value)}
                              className={inputClass}
                            />
                          </label>
                          <label className={formLabelClass}>
                            网站
                            <input
                              value={getTextValue(contactResource, 'website')}
                              onChange={(event) => updateContactField('website', event.target.value)}
                              className={inputClass}
                            />
                          </label>
                          <label className={formLabelClass}>
                            地址
                            <input
                              value={getTextValue(contactResource, 'address')}
                              onChange={(event) => updateContactField('address', event.target.value)}
                              className={inputClass}
                            />
                          </label>
                        </div>
                      )}

                      {siteResourceEditorTab === 'message' && (
                        <div className="space-y-4">
                          <label className={formLabelClass}>
                            必填字段（逗号分隔）
                            <input
                              value={requiredFieldsText}
                              onChange={(event) => updateMessageRequiredFields(event.target.value)}
                              className={inputClass}
                            />
                            <p className={formHintClass}>示例：name, phone, email, message</p>
                          </label>
                          <label className={formLabelClass}>
                            中文留言说明
                            <textarea
                              value={getTextValue(messageFormResource, 'noteZh')}
                              onChange={(event) => updateMessageFormField('noteZh', event.target.value)}
                              className={compactTextAreaClass}
                            />
                          </label>
                          <label className={formLabelClass}>
                            英文留言说明
                            <textarea
                              value={getTextValue(messageFormResource, 'noteEn')}
                              onChange={(event) => updateMessageFormField('noteEn', event.target.value)}
                              className={compactTextAreaClass}
                            />
                          </label>
                        </div>
                      )}

                      {siteResourceEditorTab === 'narratives' && (
                        <div className="space-y-4">
                          <label className={formLabelClass}>
                            首页路径说明（中文）
                            <textarea
                              value={getTextValue(homeNarrativeResource, 'sitePathLeadZh')}
                              onChange={(event) =>
                                updateNarrativeField('home', 'sitePathLeadZh', event.target.value)
                              }
                              className={compactTextAreaClass}
                            />
                          </label>
                          <label className={formLabelClass}>
                            首页路径说明（英文）
                            <textarea
                              value={getTextValue(homeNarrativeResource, 'sitePathLeadEn')}
                              onChange={(event) =>
                                updateNarrativeField('home', 'sitePathLeadEn', event.target.value)
                              }
                              className={compactTextAreaClass}
                            />
                          </label>
                          <label className={formLabelClass}>
                            栏目摘要说明（中文）
                            <textarea
                              value={getTextValue(portalNarrativeResource, 'sectionSummaryLeadZh')}
                              onChange={(event) =>
                                updateNarrativeField('portal', 'sectionSummaryLeadZh', event.target.value)
                              }
                              className={compactTextAreaClass}
                            />
                          </label>
                          <label className={formLabelClass}>
                            询盘首屏说明（中文）
                            <textarea
                              value={getTextValue(inquiryNarrativeResource, 'heroLeadZh')}
                              onChange={(event) =>
                                updateNarrativeField('inquiry', 'heroLeadZh', event.target.value)
                              }
                              className={compactTextAreaClass}
                            />
                          </label>
                          <label className={formLabelClass}>
                            页脚声明（中文）
                            <textarea
                              value={getTextValue(footerNarrativeResource, 'statementZh')}
                              onChange={(event) =>
                                updateNarrativeField('footer', 'statementZh', event.target.value)
                              }
                              className={compactTextAreaClass}
                            />
                          </label>
                        </div>
                      )}

                      {siteResourceEditorTab === 'verified' && (
                        <div className="space-y-4">
                          <label className={formLabelClass}>
                            企业简介摘要（中文）
                            <textarea
                              value={getTextValue(companyProfileVerified, 'summary')}
                              onChange={(event) =>
                                updateVerifiedSummary('companyProfile', 'summary', event.target.value)
                              }
                              className={compactTextAreaClass}
                            />
                          </label>
                          <label className={formLabelClass}>
                            企业简介摘要（英文）
                            <textarea
                              value={getTextValue(companyProfileVerified, 'summaryEn')}
                              onChange={(event) =>
                                updateVerifiedSummary('companyProfile', 'summaryEn', event.target.value)
                              }
                              className={compactTextAreaClass}
                            />
                          </label>
                          <label className={formLabelClass}>
                            联系信息摘要（中文）
                            <textarea
                              value={getTextValue(contactInfoVerified, 'summary')}
                              onChange={(event) =>
                                updateVerifiedSummary('contactInfo', 'summary', event.target.value)
                              }
                              className={compactTextAreaClass}
                            />
                          </label>
                          <label className={formLabelClass}>
                            留言页面摘要（中文）
                            <textarea
                              value={getTextValue(messagePageVerified, 'summary')}
                              onChange={(event) =>
                                updateVerifiedSummary('messagePage', 'summary', event.target.value)
                              }
                              className={compactTextAreaClass}
                            />
                          </label>
                        </div>
                      )}

                      {siteResourceEditorTab === 'raw' && (
                        <p className="rounded-[16px] border border-[#d7b66c]/22 bg-[#d7b66c]/8 px-4 py-3 text-sm leading-7 text-[#d7ccbd]">
                          当前已切到原始 JSON 模式，请在右侧编辑器中直接维护完整结构。
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="art-card px-5 py-5">
                  <p className="eyebrow">Editing Note</p>
                  <p className="mt-4 text-sm leading-8 text-[#b8ad9e]">
                    建议只写真实可核实资料。`site-resources` 是全站共享资源层，前台会直接读取并渲染，不适合放占位信息或推测内容。
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSaveSiteResources}
                    className="btn-primary min-h-[44px] px-5 py-2 text-sm"
                    disabled={siteResourcesLoading}
                  >
                    保存资源池
                  </button>
                  <button
                    type="button"
                    onClick={handleResetSiteResources}
                    className="btn-secondary min-h-[44px] px-5 py-2 text-sm"
                    disabled={siteResourcesLoading}
                  >
                    恢复默认
                  </button>
                </div>
              </div>

              <label className={formLabelClass}>
                官方资源 JSON
                <textarea
                  value={siteResourcesJson}
                  onChange={(event) => setSiteResourcesJson(event.target.value)}
                  rows={24}
                  className={textAreaClass}
                />
                <p className={formHintClass}>
                  当前支持维护 `source`、`contacts`、`messageForm`、`uiNarratives`、`certificates`、`friendLinks`、`verifiedPages` 等字段，保存后前台共享资源会同步更新。
                </p>
              </label>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Admin
