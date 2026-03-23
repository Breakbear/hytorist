import { useEffect, useState, type FormEvent } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import DetailCardList from '../../components/DetailCardList'
import { visualAssets } from '../../content/visualAssets'
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

const InquiryView = ({ locale, copy }: InquiryViewProps) => {
  const isZh = locale === 'zh'
  const page = copy.inquiry
  const [formData, setFormData] = useState<InquiryFormState>(initialFormState)
  const [errors, setErrors] = useState<InquiryFormErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [siteResources, setSiteResources] = useState<OfficialSiteResources | null>(null)

  const intakeItems = isZh
    ? ['姓名、电话、邮箱等基础联络信息', '问题类别、是否保密与目标工况', '交付时间、服务范围与采购主体']
    : ['Contact basics such as name, phone, and email', 'Message category, privacy setting, and operating condition', 'Delivery timing, service scope, and buyer entity']

  usePageSeo(locale, copy.seo.inquiry)

  useEffect(() => {
    let active = true

    const loadSiteResources = async () => {
      try {
        const response = await axios.get<OfficialSiteResources>('/api/site-resources')
        if (active) {
          setSiteResources(response.data)
        }
      } catch {
        if (active) {
          setSiteResources(null)
        }
      }
    }

    void loadSiteResources()

    return () => {
      active = false
    }
  }, [])

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
        ? `站内已整理 ${productCategoryCount} 个设备分类和 ${caseCategoryCount} 个应用分类，询盘可直接对应设备方向和工况范围。`
        : `The site organizes ${productCategoryCount} equipment categories and ${caseCategoryCount} application categories so inquiries can map directly to equipment direction and operating scope.`
      : isZh
        ? '设备分类和应用分类正在按已核实资料持续整理。'
        : 'Equipment and application categories are still being organized from verified materials.'
  const intakeScopeText = isZh
    ? `当前站内统一承接 ${categoryOptions.length} 类问题，支持 ${privacyOptions.length} 种信息设置。`
    : `The site currently handles ${categoryOptions.length} inquiry tracks with ${privacyOptions.length} privacy settings.`
  const highlightedCertificate = siteResources?.certificates?.[0] ?? null
  const inquirySummaryTags = isZh
    ? ['需求说明', '沟通字段', '服务资质']
    : ['Requirement Notes', 'Contact Fields', 'Service Credentials']
  const formLeadText =
    formNote ||
    (isZh
      ? '建议优先填写工况、时间与服务范围，便于快速分流。'
      : 'Share the operating condition, timing, and scope first so the team can route the request quickly.')

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
    <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#65707c]">
      {label}
      {required && <span className="ml-1 text-[#c89b45]">{page.fields.requiredMark}</span>}
    </span>
  )

  return (
    <div className="space-y-12 pb-16 sm:space-y-16 sm:pb-20">
      <section className="section-wrap">
        <div className="relative overflow-hidden rounded-[36px] border border-[#d7cfbf] px-5 py-6 sm:px-8 sm:py-9 xl:px-12 xl:py-12 art-surface-strong">
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
                className={`mt-4 hero-display hero-display-compact text-[#1f252d] ${
                  isZh ? 'hero-title-nowrap' : ''
                }`}
              >
                {page.title}
              </h1>
                <p className="hero-copy hero-copy-compact mt-6 max-w-[42rem] text-[1.02rem] leading-8 text-[#58616d] sm:text-[1.12rem] sm:leading-9">
                  {page.subtitle}
                </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link to={buildLocalizedPath(locale, 'products')} className="btn-secondary w-full sm:w-auto">
                  {isZh ? '先看设备目录' : 'View Equipment First'}
                </Link>
                <Link to={buildLocalizedPath(locale, 'contact')} className="btn-secondary w-full sm:w-auto">
                  {page.contactButton}
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="art-image-frame">
                <div className="aspect-[15/10]">
                  <img
                    src={visualAssets.factoryFloor}
                    alt={page.title}
                    className="day-section-image h-full w-full object-cover"
                  />
                </div>
              </div>

              <article className="art-card px-6 py-5">
                <p className="eyebrow">{isZh ? '承接范围' : 'Intake Scope'}</p>
                <p className="mt-4 text-[1rem] leading-8 text-[#58616d] sm:text-[1.04rem] copy-clamp-4">
                  {intakeScopeText}
                </p>
                <p className="mt-4 text-[0.95rem] leading-7 text-[#66707c] copy-clamp-3">{categorySummary}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        {status === 'success' ? (
          <div className="panel px-6 py-8 sm:px-8 sm:py-10 xl:px-10">
            <p className="eyebrow">{page.successIcon}</p>
            <h2 className="section-title-lg mt-4">
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
              <article className="panel px-6 py-7 sm:px-8 sm:py-8">
                <p className="eyebrow">{isZh ? '项目输入建议' : 'Recommended Inputs'}</p>
                <div className="mt-5 grid gap-3">
                  {intakeItems.map((item, index) => (
                    <div
                      key={item}
                      className="art-card px-4 py-4"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-[#8f672b]">
                        {String(index + 1).padStart(2, '0')}
                      </p>
                  <p className="mt-3 text-[0.98rem] leading-8 text-[#485260] copy-clamp-3">{item}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel px-6 py-7 sm:px-8 sm:py-8">
                <p className="eyebrow">{isZh ? '直达联络' : 'Direct Contact'}</p>
                <DetailCardList
                  items={directContacts.map((card) => ({ label: card.title, value: card.value }))}
                  className="mt-5 grid gap-3"
                  itemClassName="art-card px-4 py-4"
                />
                {directMailboxes.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f672b]">
                      {isZh ? '直达邮箱' : 'Direct Mailboxes'}
                    </p>
                    <DetailCardList
                      items={directMailboxes}
                      className="mt-3 grid gap-3"
                      itemClassName="art-card px-4 py-4"
                    />
                  </div>
                )}
                {(contactSummary || formNote) && (
                  <p className="mt-4 text-[0.95rem] leading-7 text-[#616a76] copy-clamp-4">{contactSummary || formNote}</p>
                )}
              </article>
            </div>

            <div className="panel px-5 py-6 sm:px-8 sm:py-8 xl:px-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow">{isZh ? '提交需求' : 'Submit Requirement'}</p>
                  <h2 className="section-title-lg mt-3">
                    {page.title}
                  </h2>
                </div>
                <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7b838f]">
                  {status === 'error' ? page.errorTitle : page.submitButton}
                </span>
              </div>
              <p className="section-copy section-copy-wide mt-5 max-w-none copy-clamp-4">
                {formLeadText}
              </p>

              {status === 'error' && (
                <div className="mt-6 rounded-[22px] border border-[#f59e0b]/24 bg-[#fff5e5] px-5 py-4">
                  <p className="text-sm font-semibold text-[#1f252d]">{page.errorTitle}</p>
                  <p className="mt-2 text-sm leading-7 text-[#58616d]">{page.errorMessage}</p>
                </div>
              )}

              <form className="mt-10 grid gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="grid gap-2.5">
                    {fieldLabel(page.fields.nameLabel, true)}
                    <input
                      value={formData.name}
                      onChange={(event) => handleChange('name', event.target.value)}
                      placeholder={page.fields.namePlaceholder}
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
                      className={`art-form-field ${errors.phone ? 'art-form-field-error' : ''}`}
                    />
                    {errors.phone && <span className="text-[13px] leading-6 text-[#b44956]">{errors.phone}</span>}
                  </label>

                  <label className="grid gap-2.5">
                    {fieldLabel(page.fields.companyLabel)}
                    <input
                      value={formData.company}
                      onChange={(event) => handleChange('company', event.target.value)}
                      placeholder={page.fields.companyPlaceholder}
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

                  <label className="grid gap-2.5">
                    {fieldLabel(page.fields.quantityLabel)}
                    <input
                      value={formData.quantity}
                      onChange={(event) => handleChange('quantity', event.target.value)}
                      placeholder={page.fields.quantityPlaceholder}
                      className="art-form-field"
                    />
                  </label>
                </div>

                <fieldset className="grid gap-3">
                  <legend className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#65707c]">
                    {page.fields.privacyLabel}
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

                <label className="grid gap-2.5">
                  {fieldLabel(page.fields.messageLabel, true)}
                  <textarea
                    value={formData.message}
                    onChange={(event) => handleChange('message', event.target.value)}
                    placeholder={page.fields.messagePlaceholder}
                    className={`art-form-field min-h-[200px] ${errors.message ? 'art-form-field-error' : ''}`}
                  />
                  {errors.message && <span className="text-[13px] leading-6 text-[#b44956]">{errors.message}</span>}
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
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

      <section className="section-wrap">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="panel px-6 py-7 sm:px-8 sm:py-8">
            <p className="eyebrow">{isZh ? '资料说明' : 'Resource Notes'}</p>
            <h2 className="section-title-lg mt-4">
              {isZh
                ? '询盘页保留新站自己的沟通说明与资料摘要。'
                : 'The inquiry page keeps the new site’s own contact notes and material summary.'}
            </h2>
            <p className="section-copy section-copy-compact mt-5 max-w-none copy-clamp-4">
              {isZh
                ? '页面信息按已核实业务资料整理，不再展示外部网站入口。'
                : 'Page content is organized from verified business materials without exposing external-site entry points.'}
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
              <article className="panel px-6 py-7 sm:px-8">
                <p className="eyebrow">{isZh ? '留言规则' : 'Message Rules'}</p>
                <p className="section-copy mt-5 max-w-none copy-clamp-4">
                  {messageSummary ||
                    formNote ||
                  (isZh
                    ? '当前询盘流程保留问题类别和公开/保密设置，便于统一沟通。'
                    : 'The current inquiry flow keeps message categories together with public/confidential settings for consistent coordination.')}
                </p>
                <p className="mt-4 text-sm leading-7 text-[#58616d]">
                  {categorySummary}
                </p>
              </article>

              <article className="panel px-6 py-7 sm:px-8">
                <p className="eyebrow">{isZh ? '承接范围' : 'Coverage And Contact'}</p>
                <p className="section-copy mt-5 max-w-none copy-clamp-4">
                  {equipmentCoverageText}
                </p>
                <p className="mt-4 text-sm leading-7 text-[#58616d] copy-clamp-4">
                  {contactSummary ||
                    (isZh
                      ? '联系方式、热线和证书资料已纳入统一资料池，前后台保持同一份维护口径。'
                      : 'Contacts, hotline, and certificate assets are maintained in one shared resource pool for both public pages and admin.')}
                </p>
                {highlightedCertificate && (
                  <p className="mt-4 text-sm leading-7 text-[#58616d]">
                    {isZh
                      ? `当前资料池包含：${highlightedCertificate.title}`
                      : `Current resource note: ${highlightedCertificate.title}`}
                  </p>
                )}
              </article>

              <article className="panel px-6 py-7 sm:px-8 md:col-span-2">
                <p className="eyebrow">{isZh ? '资料摘要' : 'Resource Snapshot'}</p>
                <p className="section-copy mt-5 max-w-none copy-clamp-4">
                  {messageSummary ||
                    contactSummary ||
                    (isZh
                      ? '询盘页中的联络资料、留言字段与资质说明都已并入新站自己的内容体系。'
                      : 'Contact records, message fields, and qualification notes on this inquiry page are now part of the new site’s own content system.')}
                </p>
                <p className="mt-4 text-sm leading-7 text-[#58616d] copy-clamp-4">
                  {intakeScopeText}
                </p>
              </article>
            </div>
          </div>
      </section>
    </div>
  )
}

export default InquiryView
