import { visualAssets } from '../../content/visualAssets'
import type { Locale, SiteCopy } from '../../i18n/types'
import { usePageSeo } from '../../i18n/usePageSeo'

interface AboutViewProps {
  locale: Locale
  copy: SiteCopy
}

const AboutView = ({ locale, copy }: AboutViewProps) => {
  const page = copy.about
  const isZh = locale === 'zh'
  const highlights = isZh
    ? [
        {
          label: '质量',
          value: '从研发、装配到现场交付，强调稳定与可追踪。'
        },
        {
          label: '定制',
          value: '围绕具体工况调整工具、动力和服务方式。'
        },
        {
          label: '响应',
          value: '销售、技术、售后形成同一条支持链路。'
        }
      ]
    : [
        {
          label: 'Quality',
          value: 'R&D, assembly, and field delivery are built around stability and traceability.'
        },
        {
          label: 'Customization',
          value: 'Tools, power units, and service flow are adapted to the actual application.'
        },
        {
          label: 'Response',
          value: 'Sales, engineering, and after-sales stay aligned through one support thread.'
        }
      ]

  usePageSeo(locale, copy.seo.about)

  return (
    <div className="space-y-16 pb-12 sm:space-y-20 sm:pb-16">
      <section className="section-wrap">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="eyebrow">{isZh ? '关于我们' : 'About Us'}</p>
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
                    src={visualAssets.office}
                    alt={page.imagePlaceholder}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="eyebrow">{isZh ? '品牌语境' : 'Brand Context'}</p>
                <h2 className="mt-4 font-display text-4xl leading-none text-white">
                  {isZh ? '工程能力，也需要气质表达。' : 'Capability should also feel composed.'}
                </h2>
                <p className="mt-4 text-sm leading-8 text-[#b8ad9e] sm:text-base">
                  {isZh
                    ? '关于页不再只是基础文字堆叠，而是通过图像、标题比例和留白来建立可信度。'
                    : 'The about page now reads as a composed brand statement rather than a plain block of company copy.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="panel p-8 sm:p-10">
            <p className="eyebrow">{page.storyTitle}</p>
            <h2 className="mt-4 font-display text-4xl leading-none text-white sm:text-5xl">
              {isZh ? '把机械能力组织成长期交付体系。' : 'Turning mechanical capability into long-term delivery.'}
            </h2>

            <div className="mt-6 space-y-5">
              {page.storyParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-8 text-[#c8bcae] sm:text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <div className="grid gap-5">
            {highlights.map((item) => (
              <article key={item.label} className="art-card px-6 py-6 sm:px-7">
                <p className="eyebrow">{item.label}</p>
                <p className="mt-4 font-display text-3xl leading-none text-white">
                  {item.value}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="panel panel-block overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
          <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
            <div className="max-w-[420px]">
              <div className="art-image-frame">
                <div className="aspect-[4/5]">
                  <img
                    src={visualAssets.team}
                    alt={page.imagePlaceholder}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="eyebrow">{page.contactInfoTitle}</p>
              <h2 className="mt-4 font-display text-4xl leading-none text-white sm:text-5xl">
                {isZh ? '沟通路径清晰，协作节奏稳定。' : 'Clear contact paths, stable collaboration rhythm.'}
              </h2>
              <p className="mt-5 text-sm leading-8 text-[#c8bcae] sm:text-base">
                {page.contactInfoText}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutView
