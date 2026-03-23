import { Link } from 'react-router-dom'
import { visualAssets } from '../../content/visualAssets'
import { buildLocalizedPath } from '../../i18n/routes'
import type { Locale, SiteCopy } from '../../i18n/types'
import { usePageSeo } from '../../i18n/usePageSeo'

interface ProductsViewProps {
  locale: Locale
  copy: SiteCopy
}

  const ProductsView = ({ locale, copy }: ProductsViewProps) => {
  const page = copy.products
  const isZh = locale === 'zh'
  const categories = Array.from(new Set(page.items.map((item) => item.category)))

  usePageSeo(locale, copy.seo.products)

  return (
    <div className="space-y-16 pb-12 sm:space-y-20 sm:pb-16">
      <section className="section-wrap">
        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <p className="eyebrow">{isZh ? '产品矩阵' : 'Product Matrix'}</p>
            <h1 className="mt-4 font-display text-5xl leading-none text-white sm:text-6xl">
              {page.title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#c8bcae] sm:text-base">
              {page.introText}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span key={category} className="pill">
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="panel overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
            <div className="grid gap-6 md:grid-cols-[0.92fr_1.08fr] md:items-center">
              <div className="art-image-frame">
                <div className="aspect-[4/5]">
                  <img
                    src={visualAssets.pump}
                    alt={page.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="eyebrow">{page.selectionLogicTitle}</p>
                <h2 className="mt-4 font-display text-4xl leading-none text-white">
                  {page.selectionLogicHeadline}
                </h2>
                <p className="mt-4 text-sm leading-8 text-[#b8ad9e] sm:text-base">
                  {page.selectionLogicText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          {page.items.map((product, index) => {
            const spanClass =
              index === 0 ? 'lg:col-span-7' : index === 1 ? 'lg:col-span-5' : 'lg:col-span-12'
            const note = page.productNotes[index % page.productNotes.length]

            return (
              <article key={product.id} className={`panel p-4 sm:p-5 ${spanClass}`}>
                <div className="art-image-frame">
                  <div className={index === 2 ? 'aspect-[21/9]' : 'aspect-[5/4]'}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="pill">{product.category}</span>
                  <span className="pill">
                    {isZh ? `型号 ${String(product.id).padStart(2, '0')}` : `Model ${String(product.id).padStart(2, '0')}`}
                  </span>
                </div>

                <h2 className="mt-4 font-display text-4xl leading-none text-white">
                  {product.name}
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-8 text-[#b8ad9e] sm:text-base">
                  {note}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to={buildLocalizedPath(locale, 'inquiry')} className="btn-primary">
                    {page.requestQuoteButton}
                  </Link>
                  <Link to={buildLocalizedPath(locale, 'contact')} className="btn-secondary">
                    {isZh ? '联系顾问' : 'Contact Advisor'}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default ProductsView
