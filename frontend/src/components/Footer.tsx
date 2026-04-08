import { Link } from 'react-router-dom'
import useSiteResources from '../hooks/useSiteResources'
import { buildLocalizedPath } from '../i18n/routes'
import type { Locale, RouteKey, SiteCopy } from '../i18n/types'

interface FooterProps {
  locale: Locale
  copy: SiteCopy
}

interface SiteResourcesResponse {
  contacts?: {
    address?: string
    email?: string
    phone?: string
    hotline?: string
  }
  productCategories?: Array<{
    key: string
    label: string
    labelEn?: string
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
    footer?: {
      statementZh?: string
      statementEn?: string
      coverageZh?: string
      coverageEn?: string
    }
  }
}

const quickLinkKeys: RouteKey[] = ['home', 'products', 'inquiry', 'about', 'contact']

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

const Footer = ({ locale, copy }: FooterProps) => {
  const siteResources = useSiteResources<SiteResourcesResponse>()

  const sectorItems =
    locale === 'zh'
      ? ['风电运维', '石化检修', '水电工程', '轨交与非标装备']
      : ['Wind O&M', 'Petrochemical', 'Hydropower Projects', 'Rail and Custom Machinery']

  const footerContactItems = siteResources?.contacts
    ? [
        siteResources.contacts.address,
        siteResources.contacts.email,
        siteResources.contacts.hotline || siteResources.contacts.phone
      ].filter((item): item is string => Boolean(item))
    : copy.footer.contactItems
  const footerProductItems =
    siteResources?.productCategories && siteResources.productCategories.length > 0
      ? siteResources.productCategories
          .slice(0, 4)
          .map((item) => (locale === 'zh' ? item.label : item.labelEn || item.label))
      : copy.footer.productItems
  const footerAboutText =
    getVerifiedSummary(locale, siteResources?.verifiedPages?.companyProfile) || copy.footer.aboutText
  const footerNarrative = siteResources?.uiNarratives?.footer
  const footerStatement =
    getVerifiedSummary(locale, siteResources?.verifiedPages?.messagePage) ||
    getVerifiedSummary(locale, siteResources?.verifiedPages?.contactInfo) ||
    (locale === 'zh'
      ? footerNarrative?.statementZh ||
        '我们提供液压工具、工程服务与项目支持，欢迎通过询盘或联系方式与我们对接。'
      : footerNarrative?.statementEn ||
        'We provide hydraulic tools, engineering services, and project support. Contact us through inquiry or direct channels for follow-up.')
  const footerBlockTitleClass = 'text-[13px] font-semibold uppercase tracking-[0.18em] text-[#f15a24]'
  const footerBlockListClass =
    'mt-5 space-y-3 text-[1rem] text-[rgba(255,255,255,0.82)] sm:space-y-4 sm:text-[1.04rem]'
  const footerSectionCardClass =
    'rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:px-5 sm:py-5'

  return (
    <footer className="mt-16 bg-[#0A2E5C] pb-8 pt-10 text-white sm:mt-24 sm:pt-12 xl:mt-28 xl:pt-14">
      <div className="section-wrap">
        <div className="overflow-hidden px-0 py-4 sm:py-10 xl:py-[4.2rem]">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div className="max-w-2xl rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:px-7 sm:py-7">
              <p className={footerBlockTitleClass}>{locale === 'zh' ? '工业服务网络' : 'Industrial Service Network'}</p>
              <h2 className="section-title-lg mt-4 max-w-[32rem] text-white">
                {copy.header.brandName}
              </h2>
              <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-[rgba(255,255,255,0.64)] sm:mt-4 sm:text-[13px]">
                {copy.header.brandTagline}
              </p>
              <p className="mt-6 max-w-none text-[1rem] leading-8 text-[rgba(255,255,255,0.82)] sm:text-[1.04rem] sm:leading-8">
                {footerAboutText}
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5 sm:mt-9 sm:gap-3">
                {sectorItems.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/12 bg-[rgba(255,255,255,0.08)] px-3 py-1.5 text-[12px] font-semibold text-white sm:px-4 sm:py-2.5 sm:text-[14px]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-[12px] uppercase tracking-[0.14em] text-[rgba(255,255,255,0.56)]">
                {locale === 'zh'
                  ? '欢迎提交项目需求，我们将尽快安排专人对接。'
                  : 'Submit your project requirements and our team will follow up shortly.'}
              </p>

              <Link
                to={buildLocalizedPath(locale, 'inquiry')}
                className="btn-primary mt-7 inline-flex w-full sm:mt-8 sm:w-auto"
              >
                {copy.header.quoteButton}
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-[0.92fr_0.92fr_1.08fr]">
              <div className={footerSectionCardClass}>
                <h3 className={footerBlockTitleClass}>
                  {copy.footer.quickLinksTitle}
                </h3>
                <ul className={footerBlockListClass}>
                  {quickLinkKeys.map((key) => (
                    <li key={key}>
                      <Link
                        to={buildLocalizedPath(locale, key)}
                        className="transition-colors hover:text-white"
                      >
                        {copy.footer.quickLinks[key]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={footerSectionCardClass}>
                <h3 className={footerBlockTitleClass}>
                  {copy.footer.productsTitle}
                </h3>
                <ul className={footerBlockListClass}>
                  {footerProductItems.map((item, index) => (
                    <li key={item} className={index > 2 ? 'hidden sm:list-item' : ''}>
                      <Link
                        to={buildLocalizedPath(locale, 'products')}
                        className="transition-colors hover:text-white"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`${footerSectionCardClass} sm:col-span-2 xl:col-span-1`}>
                <h3 className={footerBlockTitleClass}>
                  {copy.footer.contactTitle}
                </h3>
                <ul className={footerBlockListClass}>
                  {footerContactItems.map((item) => (
                    <li key={item} className="leading-7 sm:leading-8">
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="art-divider my-5" />

                <h3 className={footerBlockTitleClass}>
                  {locale === 'zh' ? '服务领域' : 'Service Coverage'}
                </h3>
                <p className="mt-4 max-w-none text-[0.96rem] leading-8 text-[rgba(255,255,255,0.76)] sm:text-[1rem] copy-clamp-4">
                  {locale === 'zh'
                    ? footerNarrative?.coverageZh ||
                      `重点覆盖 ${sectorItems.join('、')} 等工程方向，可按项目需求提供对应方案。`
                    : footerNarrative?.coverageEn ||
                      `Coverage focuses on ${sectorItems.join(', ')} with tailored solutions based on project needs.`}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 h-px bg-white/10 sm:mt-10" />

          <div className="mt-6 rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:mt-8">
            <p className="max-w-none text-[0.98rem] leading-8 text-[rgba(255,255,255,0.82)] copy-clamp-4">
              {footerStatement}
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-2 text-[13px] text-[rgba(255,255,255,0.48)] sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
            <p>{copy.footer.copyright}</p>
            <p>{copy.footer.icp}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
