import { useEffect } from 'react'
import type { Locale, SeoEntry } from './types'
import { toHtmlLang } from './routes'

const META_DESCRIPTION_SELECTOR = 'meta[name="description"]'
const CANONICAL_SELECTOR = 'link[rel="canonical"]'

const ensureMetaDescription = () => {
  let meta = document.querySelector<HTMLMetaElement>(META_DESCRIPTION_SELECTOR)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    document.head.appendChild(meta)
  }
  return meta
}

const ensureCanonicalLink = () => {
  let link = document.querySelector<HTMLLinkElement>(CANONICAL_SELECTOR)
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  return link
}

const toAbsoluteUrl = (href: string) => {
  if (typeof window === 'undefined') {
    return href
  }
  return new URL(href, window.location.origin).toString()
}

const applyHreflangLinks = (seo: SeoEntry) => {
  const previous = document.querySelectorAll('link[data-hreflang="site-i18n"]')
  previous.forEach((node) => node.parentNode?.removeChild(node))

  Object.entries(seo.hreflang).forEach(([locale, href]) => {
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = locale
    link.href = toAbsoluteUrl(href)
    link.setAttribute('data-hreflang', 'site-i18n')
    document.head.appendChild(link)
  })

  const xDefaultLink = document.createElement('link')
  xDefaultLink.rel = 'alternate'
  xDefaultLink.hreflang = 'x-default'
  xDefaultLink.href = toAbsoluteUrl(seo.xDefault)
  xDefaultLink.setAttribute('data-hreflang', 'site-i18n')
  document.head.appendChild(xDefaultLink)
}

export const usePageSeo = (locale: Locale, seo: SeoEntry) => {
  useEffect(() => {
    document.title = seo.title
    document.documentElement.lang = toHtmlLang(locale)

    const metaDescription = ensureMetaDescription()
    metaDescription.content = seo.description

    const canonicalLink = ensureCanonicalLink()
    canonicalLink.href = toAbsoluteUrl(seo.hreflang[locale])

    applyHreflangLinks(seo)
  }, [locale, seo])
}
