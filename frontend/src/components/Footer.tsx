import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
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
  const [siteResources, setSiteResources] = useState<SiteResourcesResponse | null>(null)

  const sectorItems =
    locale === 'zh'
      ? ['风电运维', '石化检修', '水电工程', '轨交与非标装备']
      : ['Wind O&M', 'Petrochemical', 'Hydropower Projects', 'Rail and Custom Machinery']

  useEffect(() => {
    let cancelled = false

    const fetchResources = async () => {
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

    void fetchResources()

    return () => {
      cancelled = true
    }
  }, [])

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
  const footerStatement =
    getVerifiedSummary(locale, siteResources?.verifiedPages?.messagePage) ||
    getVerifiedSummary(locale, siteResources?.verifiedPages?.contactInfo) ||
    (locale === 'zh'
      ? '本网站聚焦新站自己的业务展示与项目沟通，能力、服务和联系方式以当前页面内容与站内对接信息为准。'
      : 'This website focuses on its own business presentation and project communication. Capability, service, and contact information are defined by the current site content and on-site contact flow.')

  return (
    <footer className="mt-20 pb-8 text-[#1f252d] sm:mt-24 xl:mt-28">
      <div className="section-wrap">
        <div className="overflow-hidden border-t border-[#d7cfbf] px-2 py-10 sm:px-0 sm:py-14 xl:py-16">
          <div className="grid gap-10 sm:gap-12 md:grid-cols-2 xl:grid-cols-[1.14fr_0.56fr_0.56fr_0.74fr] xl:items-start">
            <div className="max-w-2xl">
              <p className="eyebrow">{locale === 'zh' ? '工业服务网络' : 'Industrial Service Network'}</p>
              <h2 className="section-title-xl mt-4 max-w-[30rem]">
                {copy.header.brandName}
              </h2>
              <p className="mt-4 text-[13px] uppercase tracking-[0.18em] text-[#6b7380]">
                {copy.header.brandTagline}
              </p>
              <p className="section-copy section-copy-compact mt-7 max-w-none copy-clamp-4">
                {footerAboutText}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                {sectorItems.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#d7cfbf] bg-white/70 px-3.5 py-2 text-[13px] font-medium text-[#3b4652] sm:px-4 sm:py-2.5 sm:text-[14px]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7b838f]">
                {locale === 'zh'
                  ? '站内统一承接项目沟通、设备咨询与服务联系。'
                  : 'Project inquiries, equipment requests, and service contacts are handled inside this site.'}
              </p>

              <Link
                to={buildLocalizedPath(locale, 'inquiry')}
                className="btn-primary mt-8 inline-flex w-full sm:w-auto"
              >
                {copy.header.quoteButton}
              </Link>
            </div>

            <div>
              <h3 className="text-[12px] uppercase tracking-[0.18em] text-[#8f672b]">
                {copy.footer.quickLinksTitle}
              </h3>
              <ul className="mt-5 space-y-3 text-[0.96rem] text-[#4d5763] sm:space-y-4 sm:text-[1.02rem]">
                {quickLinkKeys.map((key) => (
                  <li key={key}>
                    <Link
                      to={buildLocalizedPath(locale, key)}
                      className="transition-colors hover:text-[#1f252d]"
                    >
                      {copy.footer.quickLinks[key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[12px] uppercase tracking-[0.18em] text-[#8f672b]">
                {copy.footer.productsTitle}
              </h3>
              <ul className="mt-5 space-y-3 text-[0.96rem] text-[#4d5763] sm:space-y-4 sm:text-[1.02rem]">
                {footerProductItems.map((item) => (
                  <li key={item}>
                    <Link
                      to={buildLocalizedPath(locale, 'products')}
                      className="transition-colors hover:text-[#1f252d]"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[12px] uppercase tracking-[0.18em] text-[#8f672b]">
                {copy.footer.contactTitle}
              </h3>
              <ul className="mt-5 space-y-3 text-[0.96rem] text-[#4d5763] sm:space-y-4 sm:text-[1.02rem]">
                {footerContactItems.map((item) => (
                  <li key={item} className="leading-8">
                    {item}
                  </li>
                ))}
              </ul>

              <div className="art-divider my-5" />

              <h3 className="text-[12px] uppercase tracking-[0.18em] text-[#8f672b]">
                {locale === 'zh' ? '服务领域' : 'Service Coverage'}
              </h3>
              <ul className="mt-5 space-y-3 text-[0.96rem] text-[#4d5763] sm:space-y-4 sm:text-[1.02rem]">
                {sectorItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="art-divider mt-8 sm:mt-10" />

          <p className="section-copy section-copy-wide mt-6 max-w-none text-[0.98rem] sm:mt-8 copy-clamp-4">
            {footerStatement}
          </p>

          <div className="mt-5 flex flex-col gap-2 text-[13px] text-[#7b838f] sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
            <p>{copy.footer.copyright}</p>
            <p>{copy.footer.icp}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
