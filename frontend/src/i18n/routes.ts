import type { Locale, RouteKey } from './types'

const routeSegmentByKey: Record<RouteKey, string> = {
  home: '',
  products: 'products',
  inquiry: 'inquiry',
  about: 'about',
  contact: 'contact'
}

const routeKeyBySegment: Record<string, RouteKey> = {
  products: 'products',
  inquiry: 'inquiry',
  about: 'about',
  contact: 'contact'
}

const localeSet = new Set<Locale>(['zh', 'en'])
const LOCALE_STORAGE_KEY = 'site_locale'

const normalizePathname = (pathname: string) => {
  const normalized = pathname.replace(/\/+$/, '')
  return normalized === '' ? '/' : normalized
}

const appendSearchAndHash = (pathname: string, search = '', hash = '') => {
  return `${pathname}${search || ''}${hash || ''}`
}

export const detectLocaleFromBrowser = () => {
  const browserLanguage = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'zh'
  return browserLanguage.startsWith('zh') ? 'zh' : 'en'
}

export const getStoredLocale = (): Locale | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const value = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (value === 'zh' || value === 'en') {
    return value
  }

  return null
}

export const setStoredLocale = (locale: Locale) => {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

export const detectPreferredLocale = () => {
  return getStoredLocale() || detectLocaleFromBrowser()
}

export const getLocaleFromPath = (pathname: string): Locale | null => {
  const parts = normalizePathname(pathname).split('/').filter(Boolean)
  if (parts.length === 0) {
    return null
  }

  const first = parts[0]
  return localeSet.has(first as Locale) ? (first as Locale) : null
}

export const buildLocalizedPath = (locale: Locale, routeKey: RouteKey) => {
  const segment = routeSegmentByKey[routeKey]
  return segment ? `/${locale}/${segment}` : `/${locale}`
}

export const buildLocalizedPathWithState = (
  locale: Locale,
  routeKey: RouteKey,
  search = '',
  hash = ''
) => {
  const localizedPath = buildLocalizedPath(locale, routeKey)
  return appendSearchAndHash(localizedPath, search, hash)
}

export const getRouteKeyFromPath = (pathname: string): RouteKey | null => {
  const parts = normalizePathname(pathname).split('/').filter(Boolean)

  if (parts.length === 0) {
    return 'home'
  }

  const locale = getLocaleFromPath(pathname)
  if (locale) {
    if (parts.length === 1) {
      return 'home'
    }

    if (parts.length === 2) {
      return routeKeyBySegment[parts[1]] || null
    }

    return null
  }

  if (parts.length === 1) {
    return routeKeyBySegment[parts[0]] || null
  }

  return null
}

export const switchLocalePath = (pathname: string, targetLocale: Locale) => {
  const parts = normalizePathname(pathname).split('/').filter(Boolean)
  if (parts.length > 0 && localeSet.has(parts[0] as Locale)) {
    parts[0] = targetLocale
    return `/${parts.join('/')}`
  }

  const routeKey = getRouteKeyFromPath(pathname) || 'home'
  return buildLocalizedPath(targetLocale, routeKey)
}

export const switchLocalePathWithState = (
  pathname: string,
  targetLocale: Locale,
  search = '',
  hash = ''
) => {
  const localizedPath = switchLocalePath(pathname, targetLocale)
  return appendSearchAndHash(localizedPath, search, hash)
}

export const toHtmlLang = (locale: Locale) => (locale === 'zh' ? 'zh-CN' : 'en')
