import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import DetailCardList from '../../components/DetailCardList'
import ZoomableImage from '../../components/ZoomableImage'
import { visualAssets } from '../../content/visualAssets'
import useSiteResources from '../../hooks/useSiteResources'
import { buildLocalizedPath } from '../../i18n/routes'
import type { Locale, SiteCopy } from '../../i18n/types'
import { usePageSeo } from '../../i18n/usePageSeo'

interface InquiryViewProps {
  locale: Locale
  copy: SiteCopy
}

interface InquiryFormState {
  name: string
  email: string
  phone: string
  company: string
  category: string
  product: string
  quantity: string
  privacy: 'public' | 'confidential'
  message: string
}

type InquiryFormErrors = Partial<Record<keyof InquiryFormState, string>>

interface ResourceOption {
  value: string
  labelZh: string
  labelEn: string
}

interface ResourceCategory {
  key: string
  label: string
  labelEn?: string
  publicItemCount?: number
}

interface ResourceMailbox {
  label: string
  labelEn?: string
  email: string
}

interface OfficialSiteResources {
  contacts?: {
    company?: string
    phone?: string
    email?: string
    hotline?: string
    mailboxes?: ResourceMailbox[]
  }
  messageForm?: {
    categoryOptions?: ResourceOption[]
    privacyOptions?: ResourceOption[]
    noteZh?: string
    noteEn?: string
  }
  productCategories?: ResourceCategory[]
  caseCategories?: ResourceCategory[]
  certificates?: Array<{
    title: string
    sourcePageUrl: string
    imageUrl: string
  }>
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
    inquiry?: {
      heroLeadZh?: string
      heroLeadEn?: string
      formLeadZh?: string
      formLeadEn?: string
      resourceLeadZh?: string
      resourceLeadEn?: string
      messageNoteZh?: string
      messageNoteEn?: string
      coverageNoteZh?: string
      coverageNoteEn?: string
    }
  }
}

const initialFormState: InquiryFormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  category: '',
  product: '',
  quantity: '',
  privacy: 'confidential',
  message: ''
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

const getMailboxLabel = (locale: Locale, item: ResourceMailbox) => {
  if (locale === 'zh') {
    return item.label || item.labelEn || ''
  }

  return item.labelEn || item.label || ''
}

const getLeadText = (text: string, fallback: string) => {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) {
    return fallback
  }

  const sentenceMatch = normalized.match(/^(.+?[。！？!?])(?=\s|$)/)
  if (sentenceMatch) {
    return sentenceMatch[1]
  }

  return normalized.length > 96 ? `${normalized.slice(0, 96).trim()}...` : normalized
}

const InquiryView = ({ locale, copy }: InquiryViewProps) => {
  const isZh = locale === 'zh'
  const page = copy.inquiry
  const [formData, setFormData] = useState<InquiryFormState>(initialFormState)
  const [errors, setErrors] = useState<InquiryFormErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [showOptionalFields, setShowOptionalFields] = useState(false)
  const siteResources = useSiteResources<OfficialSiteResources>()

  const intakeItems = isZh
    ? ['姓名、电话、邮箱等基础联络信息', '问题类别、是否保密与目标工况', '交付时间、服务范围与采购主体']
    : ['Contact basics such as name, phone, and email', 'Message category, privacy setting, and operating condition', 'Delivery timing, service scope, and buyer entity']

  usePageSeo(locale, copy.seo.inquiry)

  const categoryOptions =
    siteResources?.messageForm?.categoryOptions?.map((item) => ({
      value: item.value,
      label: isZh ? item.labelZh : item.labelEn
    })) || [
      { value: 'product', label: isZh ? '产品咨询' : 'Product Inquiry' },
      { value: 'technical', label: isZh ? '技术咨询' : 'Technical Inquiry' },
      { value: 'complaint', label: isZh ? '投诉与建议' : 'Complaints and Suggestions' },
      { value: 'other', label: isZh ? '其他事项' : 'Other Topics' }
    ]

  const privacyOptions =
    siteResources?.messageForm?.privacyOptions?.map((item) => ({
      value: item.value as InquiryFormState['privacy'],
      label: isZh ? item.labelZh : item.labelEn
    })) || [
      { value: 'public' as const, label: page.fields.privacyPublicLabel },
      { value: 'confidential' as const, label: page.fields.privacyConfidentialLabel }
    ]

  const directContacts = siteResources?.contacts
    ? [
        { title: isZh ? '公司' : 'Company', value: siteResources.contacts.company || '' },
        { title: isZh ? '电话' : 'Phone', value: siteResources.contacts.phone || '' },
        { title: isZh ? '邮箱' : 'Email', value: siteResources.contacts.email || '' },
        { title: isZh ? '热线' : 'Hotline', value: siteResources.contacts.hotline || '' }
      ].filter((item) => item.value)
    : copy.contact.cards.slice(0, 4).map((card) => ({ title: card.title, value: card.value }))
  const directMailboxes =
    siteResources?.contacts?.mailboxes?.slice(0, 2).map((item) => ({
      label: getMailboxLabel(locale, item),
      value: item.email,
      href: `mailto:${item.email}`
    })) || []

  const formNote = isZh ? siteResources?.messageForm?.noteZh : siteResources?.messageForm?.noteEn
  const messageSummary = getVerifiedSummary(locale, siteResources?.verifiedPages?.messagePage)
  const contactSummary = getVerifiedSummary(locale, siteResources?.verifiedPages?.contactInfo)
  const inquiryNarrative = siteResources?.uiNarratives?.inquiry
  const productCategoryCount = siteResources?.productCategories?.length || 0
  const caseCategoryCount = siteResources?.caseCategories?.length || 0
  const categorySummary =
    categoryOptions.length > 0
      ? categoryOptions.map((item) => item.label).join(' / ')
      : isZh
        ? '产品咨询 / 技术咨询 / 投诉与建议 / 其他事项'
        : 'Product Inquiry / Technical Inquiry / Complaints and Suggestions / Other Topics'
  const equipmentCoverageText =
    productCategoryCount > 0 || caseCategoryCount > 0
      ? isZh
        ? `已覆盖 ${productCategoryCount} 个设备分类和 ${caseCategoryCount} 个应用分类，可按设备方向和工况范围快速提交需求。`
        : `The site organizes ${productCategoryCount} equipment categories and ${caseCategoryCount} application categories so inquiries can map directly to equipment direction and operating scope.`
      : isZh
        ? '设备与应用分类持续完善中，可先提交需求由顾问协助匹配。'
        : 'Equipment and application categories are being continuously expanded. You can submit your requirement for guided matching.'
  const intakeScopeText = isZh
    ? `当前支持 ${categoryOptions.length} 类咨询，提供 ${privacyOptions.length} 种信息设置。`
    : `This page supports ${categoryOptions.length} inquiry tracks with ${privacyOptions.length} privacy options.`
  const highlightedCertificate = siteResources?.certificates?.[0] ?? null
  const inquirySummaryTags = isZh
    ? ['需求说明', '沟通字段', '服务资质']
    : ['Requirement Notes', 'Contact Fields', 'Service Credentials']
  const formLeadText =
    formNote ||
    (isZh
      ? inquiryNarrative?.formLeadZh || '建议优先填写工况、时间与服务范围，便于快速分流。'
      : inquiryNarrative?.formLeadEn ||
        'Share the operating condition, timing, and scope first so the team can route the request quickly.')
  const heroLeadText =
    (isZh ? inquiryNarrative?.heroLeadZh : inquiryNarrative?.heroLeadEn) || page.subtitle
  const resourceLeadText =
    isZh
      ? inquiryNarrative?.resourceLeadZh || '在此页面可直接提交需求并查看沟通要点。'
      : inquiryNarrative?.resourceLeadEn ||
        'This page lets you submit requirements directly and review key communication notes.'
  const messageRuleNote =
    messageSummary ||
    formNote ||
    (isZh
      ? inquiryNarrative?.messageNoteZh || '当前询盘流程保留问题类别和公开/保密设置，便于统一沟通。'
      : inquiryNarrative?.messageNoteEn ||
        'The current inquiry flow keeps message categories together with public/confidential settings for consistent coordination.')
  const coverageNote =
    contactSummary ||
    (isZh
      ? inquiryNarrative?.coverageNoteZh ||
        '联系方式、热线和资质信息可按项目需要提供与说明。'
      : inquiryNarrative?.coverageNoteEn ||
        'Contact channels, hotline, and qualification information can be provided based on project needs.')
  const compactCategorySummary = getLeadText(categorySummary, categorySummary)
  const compactMessageRuleNote = getLeadText(messageRuleNote, messageRuleNote)
  const compactCoverageNote = getLeadText(coverageNote, coverageNote)
  const compactEquipmentCoverageText = getLeadText(equipmentCoverageText, equipmentCoverageText)
  const inquiryHeroGuide = isZh
    ? '本页重点用于需求录入与沟通分流，提交后将由技术或商务团队跟进。'
    : 'This page is designed for requirement intake and routing, followed by technical or commercial response.'
  const inquiryHeroTags = isZh
    ? ['需求录入', '沟通分流', '项目对接']
    : ['Requirement Intake', 'Routing', 'Project Follow-up']
  const requiredInfoLabel = isZh ? '必填信息' : 'Required Details'
  const requiredInfoHint = isZh ? '姓名、邮箱、电话与需求描述为必填项。' : 'Name, email, phone, and requirement message are required.'
  const optionalInfoLabel = isZh ? '补充信息' : 'Additional Details'
  const optionalInfoHint = isZh ? '如已明确设备方向、数量或采购主体，可展开补充。' : 'Expand this part if equipment direction, quantity, or buyer details are already clear.'
  const optionalToggleLabel = showOptionalFields
    ? isZh
      ? '收起补充信息'
      : 'Hide Additional Details'
    : isZh
      ? '展开补充信息'
      : 'Show Additional Details'
  const privacyLabel = page.fields.privacyLabel || (isZh ? '沟通设置' : 'Communication Settings')

  const handleChange = (field: keyof InquiryFormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) {
        return current
      }
      const next = { ...current }
      delete next[field]
      return next
    })
    if (status === 'error') {
      setStatus('idle')
    }
  }

  const validate = () => {
    const nextErrors: InquiryFormErrors = {}

    if (!formData.name.trim()) {
      nextErrors.name = page.fields.nameError
    }
    if (!formData.email.trim()) {
      nextErrors.email = page.fields.emailRequiredError
    } else if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = page.fields.emailInvalidError
    }
    if (!formData.phone.trim()) {
      nextErrors.phone = page.fields.phoneRequiredError
    }
    if (!formData.message.trim()) {
      nextErrors.message = page.fields.messageError
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) {
      return
    }

    setStatus('submitting')

    try {
      await axios.post('/api/inquiries', {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        category: formData.category.trim(),
        product: formData.product.trim(),
        quantity: formData.quantity.trim(),
        privacy: formData.privacy,
        message: formData.message.trim()
      })

      setStatus('success')
      setFormData(initialFormState)
      setErrors({})
    } catch {
      setStatus('error')
    }
  }

  const resetFormState = () => {
    setStatus('idle')
    setErrors({})
  }

  const fieldLabel = (label: string, required = false) => (
    <span className="label-muted text-[12px] text-[#65707c]">
      {label}
      {required && <span className="ml-1 text-[#c89b45]">{page.fields.requiredMark}</span>}
    </span>
  )
  const imagePreviewLabel = isZh ? '查看原图' : 'View Full Image'
  const imageCloseLabel = isZh ? '关闭原图' : 'Close Image'

  return (
    <div className="space-y-14 pb-20 sm:space-y-18 sm:pb-24">
      <section className="section-wrap">
        <div className="relative overflow-hidden rounded-[36px] px-5 py-7 sm:px-8 sm:py-10 xl:px-12 xl:py-14 art-surface-strong">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(121,132,146,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(121,132,146,0.06)_1px,transparent_1px)] bg-[size:220px_220px] opacity-[0.1]" />
          <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-[#d7b66c]/18 blur-3xl" />

          <div className="relative grid gap-10 xl:grid-cols-[0.98fr_1.02fr] xl:items-center">
            <div className="max-w-[44rem]">
              <div className="flex flex-wrap gap-2">
                <span className="pill">{isZh ? '项目对接入口' : 'Project Intake Desk'}</span>
                <span className="pill">{copy.header.brandTagline}</span>
              </div>

              <p className="eyebrow mt-8">{isZh ? '询盘中心' : 'Inquiry Center'}</p>
              <h1
                className={`mt-5 hero-display hero-display-compact text-[#1f252d] ${
                  isZh ? 'hero-title-nowrap' : ''
                }`}
              >
                {page.title}
              </h1>
              <p className="hero-copy hero-copy-compact mt-7 max-w-[46rem] text-[1.1rem] leading-8 text-[#58616d] sm:text-[1.22rem] sm:leading-9">
                {heroLeadText}
              </p>
              <p className="mt-5 max-w-[46rem] text-[0.96rem] leading-8 text-[#5d6773] sm:text-[1.02rem]">
                {inquiryHeroGuide}
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {inquiryHeroTags.map((item) => (
                  <span key={item} className="summary-chip">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link
                  to={buildLocalizedPath(locale, 'products')}
                  className="btn-secondary min-h-[58px] w-full text-[15px] sm:w-auto sm:text-[16px]"
                >
                  {isZh ? '先看设备目录' : 'View Equipment First'}
                </Link>
                <Link
                  to={buildLocalizedPath(locale, 'contact')}
                  className="btn-secondary min-h-[58px] w-full text-[15px] sm:w-auto sm:text-[16px]"
                >
                  {page.contactButton}
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="art-image-frame">
                <div className="aspect-[15/10]">
                  <ZoomableImage
                    src={visualAssets.factoryFloor}
                    alt={page.title}
                    hintVisibility="always"
                    previewLabel={imagePreviewLabel}
                    closeLabel={imageCloseLabel}
                    wrapperClassName="h-full w-full"
                    className="day-section-image hero-focus-delivery h-full w-full object-cover"
                  />
                </div>
              </div>

              <article className="art-card content-card">
                <p className="eyebrow">{isZh ? '承接范围' : 'Intake Scope'}</p>
                <p className="mt-4 text-[1rem] font-medium leading-8 text-[#4d5965] sm:text-[1.04rem] copy-clamp-4 copy-unclamp-lg">
                  {intakeScopeText}
                </p>
                <p className="mt-4 text-[0.96rem] font-medium leading-7 text-[#5c6773] copy-clamp-2 copy-unclamp-lg">{compactCategorySummary}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap border-t border-[#d7cfbf]/75 pt-8 sm:pt-10">
        {status === 'success' ? (
          <div className="panel px-6 py-8 sm:px-8 sm:py-10 xl:px-10">
            <p className="eyebrow">{page.successIcon}</p>
            <h2 className="subsection-title mt-4">
              {page.successTitle}
            </h2>
            <p className="section-copy section-copy-wide mt-5 max-w-none">
              {page.successMessage}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button type="button" onClick={resetFormState} className="btn-primary">
                {page.submitAnotherButton}
              </button>
              <Link to={buildLocalizedPath(locale, 'contact')} className="btn-secondary">
                {page.contactButton}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-6">
              <article className="panel content-card">
                <p className="eyebrow">{isZh ? '项目输入建议' : 'Recommended Inputs'}</p>
                <div className="mt-5 grid gap-4">
                  {intakeItems.map((item, index) => (
                    <div
                      key={item}
                      className="art-card content-card"
                    >
                      <p className="label-accent text-xs">
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <p className="mt-3 text-[0.98rem] leading-8 text-[#485260] copy-clamp-3">{item}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel content-card">
                <p className="eyebrow">{isZh ? '直达联络' : 'Direct Contact'}</p>
                <DetailCardList
                  items={directContacts.map((card) => ({ label: card.title, value: card.value }))}
                  className="mt-5 grid gap-4"
                  itemClassName="art-card content-card"
                  valueClassName="meta-copy meta-copy-compact mt-3"
                />
                {directMailboxes.length > 0 && (
                  <div className="mt-5">
                    <p className="label-accent text-xs">
                      {isZh ? '直达邮箱' : 'Direct Mailboxes'}
                    </p>
                    <DetailCardList
                      items={directMailboxes}
                      className="mt-3 grid gap-4"
                      itemClassName="art-card content-card"
                      valueClassName="meta-copy meta-copy-compact mt-3"
                    />
                  </div>
                )}
                {(contactSummary || formNote) && (
                  <p className="mt-4 text-[0.95rem] leading-7 text-[#616a76] copy-clamp-4 copy-unclamp-lg">{contactSummary || formNote}</p>
                )}
              </article>
            </div>

            <div className="panel inquiry-form-panel px-4 py-5 sm:px-8 sm:py-8 xl:px-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow">{isZh ? '提交需求' : 'Submit Requirement'}</p>
                  <h2 className="subsection-title mt-3">
                    {page.title}
                  </h2>
                </div>
                <span className="label-muted text-[12px]">
                  {status === 'error' ? page.errorTitle : page.submitButton}
                </span>
              </div>
              <p className="section-copy section-copy-wide mt-5 max-w-none copy-clamp-4 copy-unclamp-lg">
                {formLeadText}
              </p>

              {status === 'error' && (
                <div className="mt-6 rounded-[22px] border border-[#f59e0b]/24 bg-[#fff5e5] px-5 py-4">
                  <p className="text-sm font-semibold text-[#1f252d]">{page.errorTitle}</p>
                  <p className="mt-2 text-sm leading-7 text-[#58616d]">{page.errorMessage}</p>
                </div>
              )}

              <form className="inquiry-form mt-8 grid gap-5 sm:mt-10 sm:gap-6" onSubmit={handleSubmit}>
                <section className="inquiry-group grid gap-4 border-t border-[#d7cfbf] pt-5 sm:pt-6">
                  <div className="space-y-2">
                    <p className="label-accent text-[12px]">
                      {requiredInfoLabel}
                    </p>
                    <p className="text-[0.94rem] leading-7 text-[#616a76]">{requiredInfoHint}</p>
                  </div>

                  <div className="inquiry-form-grid grid gap-5 sm:gap-6 md:grid-cols-2">
                    <label className="grid gap-2.5">
                      {fieldLabel(page.fields.nameLabel, true)}
                      <input
                        value={formData.name}
                        onChange={(event) => handleChange('name', event.target.value)}
                        placeholder={page.fields.namePlaceholder}
                        autoComplete="name"
                        enterKeyHint="next"
                        className={`art-form-field ${errors.name ? 'art-form-field-error' : ''}`}
                      />
                      {errors.name && <span className="text-[13px] leading-6 text-[#b44956]">{errors.name}</span>}
                    </label>

                    <label className="grid gap-2.5">
                      {fieldLabel(page.fields.emailLabel, true)}
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(event) => handleChange('email', event.target.value)}
                        placeholder={page.fields.emailPlaceholder}
                        autoComplete="email"
                        inputMode="email"
                        enterKeyHint="next"
                        className={`art-form-field ${errors.email ? 'art-form-field-error' : ''}`}
                      />
                      {errors.email && <span className="text-[13px] leading-6 text-[#b44956]">{errors.email}</span>}
                    </label>

                    <label className="grid gap-2.5">
                      {fieldLabel(page.fields.phoneLabel, true)}
                      <input
                        value={formData.phone}
                        onChange={(event) => handleChange('phone', event.target.value)}
                        placeholder={page.fields.phonePlaceholder}
                        autoComplete="tel"
                        inputMode="tel"
                        enterKeyHint="next"
                        className={`art-form-field ${errors.phone ? 'art-form-field-error' : ''}`}
                      />
                      {errors.phone && <span className="text-[13px] leading-6 text-[#b44956]">{errors.phone}</span>}
                    </label>

                    <fieldset className="grid gap-3 md:col-span-2">
                      <legend className="label-muted text-[12px] text-[#65707c]">
                        {privacyLabel}
                      </legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {privacyOptions.map((option) => {
                          const active = formData.privacy === option.value
                          return (
                            <label
                              key={option.value}
                              className={`flex min-h-[58px] cursor-pointer items-center gap-3 rounded-[20px] border px-5 py-4 text-[0.98rem] transition-colors ${
                                active
                                  ? 'border-[#c89b45]/30 bg-[#f6e9c8] text-[#1f252d] shadow-[0_14px_28px_rgba(123,89,34,0.08)]'
                                  : 'border-[#d7cfbf] bg-white/72 text-[#485260]'
                              }`}
                            >
                              <input
                                type="radio"
                                name="privacy"
                                value={option.value}
                                checked={active}
                                onChange={(event) =>
                                  handleChange('privacy', event.target.value as InquiryFormState['privacy'])
                                }
                                className="h-4 w-4 accent-[#d7b66c]"
                              />
                              <span>{option.label}</span>
                            </label>
                          )
                        })}
                      </div>
                    </fieldset>

                    <label className="grid gap-2.5 md:col-span-2">
                      {fieldLabel(page.fields.messageLabel, true)}
                      <textarea
                        value={formData.message}
                        onChange={(event) => handleChange('message', event.target.value)}
                        placeholder={page.fields.messagePlaceholder}
                        enterKeyHint="send"
                        className={`art-form-field min-h-[200px] ${errors.message ? 'art-form-field-error' : ''}`}
                      />
                      {errors.message && <span className="text-[13px] leading-6 text-[#b44956]">{errors.message}</span>}
                    </label>
                  </div>
                </section>

                <section className="inquiry-group grid gap-4 border-t border-[#d7cfbf] pt-5 sm:pt-6">
                  <button
                    type="button"
                    className="flex min-h-[54px] w-full items-center justify-between rounded-[16px] border border-[#d7cfbf] bg-[rgba(255,255,255,0.62)] px-4 py-3 text-left transition-colors hover:border-[#c89b45]/32 hover:bg-[rgba(255,255,255,0.9)] sm:px-5"
                    onClick={() => setShowOptionalFields((current) => !current)}
                    aria-expanded={showOptionalFields}
                    aria-controls="inquiry-optional-fields"
                  >
                    <span className="space-y-1.5">
                      <span className="label-accent block text-[12px]">
                        {optionalInfoLabel}
                      </span>
                      <span className="block text-[0.92rem] leading-7 text-[#616a76]">{optionalInfoHint}</span>
                    </span>
                    <span className="label-muted inline-flex items-center gap-2 text-[12px]">
                      {optionalToggleLabel}
                      <svg
                        className={`h-4 w-4 transition-transform ${showOptionalFields ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  {showOptionalFields && (
                    <div id="inquiry-optional-fields" className="animate-fade-up">
                      <div className="inquiry-form-grid grid gap-5 sm:gap-6 md:grid-cols-2">
                        <label className="grid gap-2.5">
                          {fieldLabel(page.fields.companyLabel)}
                          <input
                            value={formData.company}
                            onChange={(event) => handleChange('company', event.target.value)}
                            placeholder={page.fields.companyPlaceholder}
                            autoComplete="organization"
                            enterKeyHint="next"
                            className="art-form-field"
                          />
                        </label>

                        <label className="grid gap-2.5">
                          {fieldLabel(page.fields.quantityLabel)}
                          <input
                            value={formData.quantity}
                            onChange={(event) => handleChange('quantity', event.target.value)}
                            placeholder={page.fields.quantityPlaceholder}
                            inputMode="numeric"
                            enterKeyHint="next"
                            className="art-form-field"
                          />
                        </label>

                        <label className="grid gap-2.5">
                          {fieldLabel(page.fields.categoryLabel)}
                          <select
                            value={formData.category}
                            onChange={(event) => handleChange('category', event.target.value)}
                            className="art-form-field"
                          >
                            <option value="">{page.fields.categoryPlaceholder}</option>
                            {categoryOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="grid gap-2.5">
                          {fieldLabel(page.fields.productLabel)}
                          <select
                            value={formData.product}
                            onChange={(event) => handleChange('product', event.target.value)}
                            className="art-form-field"
                          >
                            <option value="">{page.selectPlaceholder}</option>
                            {page.productOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  )}
                </section>

                <div className="inquiry-form-actions flex flex-col gap-3 border-t border-[#d7cfbf] pt-5 sm:flex-row sm:flex-wrap sm:gap-4 sm:pt-6">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-primary w-full sm:w-auto"
                  >
                    {status === 'submitting' ? page.submittingButton : page.submitButton}
                  </button>

                  {status === 'error' && (
                    <button type="button" onClick={resetFormState} className="btn-secondary w-full sm:w-auto">
                      {page.retryButton}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      <section className="section-wrap border-t border-[#d7cfbf]/75 pt-8 sm:pt-10">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="panel content-card">
            <p className="eyebrow">{isZh ? '资料说明' : 'Resource Notes'}</p>
            <h2 className="subsection-title mt-4">{resourceLeadText}</h2>
            <p className="section-copy section-copy-compact mt-5 max-w-none copy-clamp-4 copy-unclamp-lg">
              {isZh
                ? '本页聚焦项目沟通与需求提交，帮助您更快进入对接流程。'
                : 'This page focuses on project communication and requirement submission for faster follow-up.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {inquirySummaryTags.map((item) => (
                <span key={item} className="summary-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <article className="panel content-card">
              <p className="eyebrow">{isZh ? '留言规则' : 'Message Rules'}</p>
              <p className="section-copy mt-5 max-w-none copy-clamp-4 copy-unclamp-lg">
                {compactMessageRuleNote}
              </p>
              <p className="mt-4 text-sm leading-7 text-[#58616d] copy-clamp-4 copy-unclamp-lg">
                {compactCategorySummary}
              </p>
              <p className="mt-3 text-sm leading-7 text-[#58616d] copy-clamp-4 copy-unclamp-lg">
                {intakeScopeText}
              </p>
            </article>

            <article className="panel content-card">
              <p className="eyebrow">{isZh ? '承接范围' : 'Coverage And Contact'}</p>
              <p className="section-copy mt-5 max-w-none copy-clamp-4 copy-unclamp-lg">
                {compactEquipmentCoverageText}
              </p>
              <p className="mt-4 text-sm leading-7 text-[#58616d] copy-clamp-4 copy-unclamp-lg">
                {compactCoverageNote}
              </p>
              {highlightedCertificate && (
                <p className="mt-4 text-sm leading-7 text-[#58616d]">
                  {isZh
                    ? `可提供资质文件：${highlightedCertificate.title}`
                    : `Available qualification document: ${highlightedCertificate.title}`}
                </p>
              )}
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InquiryView
