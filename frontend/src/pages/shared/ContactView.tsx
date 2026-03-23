import { Link } from 'react-router-dom'
import { visualAssets } from '../../content/visualAssets'
import { buildLocalizedPath } from '../../i18n/routes'
import type { Locale, SiteCopy } from '../../i18n/types'
import { usePageSeo } from '../../i18n/usePageSeo'

interface ContactViewProps {
  locale: Locale
  copy: SiteCopy
}

const iconMap: Record<string, string> = {
  ADDR: 'AD',
  MAIL: 'EM',
  CALL: 'TL',
  TIME: 'TM'
}

const ContactView = ({ locale, copy }: ContactViewProps) => {
  const page = copy.contact
  const isZh = locale === 'zh'
  usePageSeo(locale, copy.seo.contact)

  return (
    <div className="space-y-16 pb-12 sm:space-y-20 sm:pb-16">
      <section className="section-wrap">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">{isZh ? '联络中心' : 'Contact Hub'}</p>
            <h1 className="mt-4 font-display text-5xl leading-none text-white sm:text-6xl">
              {page.title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#c8bcae] sm:text-base">
              {page.subtitle}
            </p>
          </div>

          <div className="panel overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
            <div className="grid gap-6 md:grid-cols-[1.04fr_0.96fr] md:items-center">
              <div className="art-image-frame">
                <div className="aspect-[4/5]">
                  <img
                    src={visualAssets.pipeline}
                    alt={page.mapPlaceholder}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="eyebrow">{isZh ? '沟通方式' : 'Contact Rhythm'}</p>
                <h2 className="mt-4 font-display text-4xl leading-none text-white">
                  {isZh ? '让联系入口也有秩序感。' : 'Make the contact path feel curated.'}
                </h2>
                <p className="mt-4 text-sm leading-8 text-[#b8ad9e] sm:text-base">
                  {isZh
                    ? '新版联系页以信息层级和视觉留白为主，不再依赖厚重边框来分隔内容。'
                    : 'The updated contact page uses rhythm, spacing, and hierarchy rather than heavy dividers to guide the eye.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
          <article className="panel p-8 sm:p-10">
            <p className="eyebrow">{page.infoTitle}</p>
            <h2 className="mt-4 font-display text-4xl leading-none text-white sm:text-5xl">
              {isZh ? '保持直接，也保持优雅。' : 'Direct, but still elegant.'}
            </h2>

            <div className="mt-8 space-y-4">
              {page.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[24px] border border-[#e8ce8e]/10 bg-white/[0.03] px-5 py-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full border border-[#f0dfb0]/24 bg-[#d7b66c]/10 text-[11px] font-semibold tracking-[0.22em] text-[#f0dfb0]">
                      {iconMap[card.icon] ?? card.icon.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#f0dfb0]">
                        {card.title}
                      </p>
                      <p className="mt-2 text-sm leading-8 text-[#ddd1c0] sm:text-base">
                        {card.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <aside className="space-y-6">
            <div className="panel panel-block overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
              <p className="eyebrow">{page.mapPlaceholder}</p>
              <h3 className="mt-4 font-display text-4xl leading-none text-white">
                {isZh ? '商务、技术与项目可同步触达。' : 'Business, technical and project contact stay aligned.'}
              </h3>
              <p className="mt-4 text-sm leading-8 text-[#b8ad9e] sm:text-base">
                {isZh
                  ? '在需要快速沟通时，优先从询盘入口提交需求，可以减少往返确认成本。'
                  : 'For faster routing, the inquiry form is still the best entry point when requirements need quick alignment.'}
              </p>
            </div>

            <div className="panel px-6 py-6 sm:px-8 sm:py-8">
              <p className="eyebrow">{page.quickInquiryTitle}</p>
              <h3 className="mt-4 font-display text-4xl leading-none text-white">
                {page.quickInquiryTitle}
              </h3>
              <p className="mt-4 text-sm leading-8 text-[#b8ad9e] sm:text-base">
                {page.quickInquiryText}
              </p>
              <Link to={buildLocalizedPath(locale, 'inquiry')} className="btn-primary mt-6">
                {page.quickInquiryButton}
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default ContactView
