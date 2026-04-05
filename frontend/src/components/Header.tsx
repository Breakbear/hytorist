import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getPrimaryNavigation } from '../content/portal'
import { setStoredLocale, switchLocalePathWithState } from '../i18n/routes'
import type { Locale, SiteCopy } from '../i18n/types'

interface HeaderProps {
  locale: Locale
  copy: SiteCopy
}

const Header = ({ locale, copy }: HeaderProps) => {
  const location = useLocation()
  const switchTo = locale === 'zh' ? 'en' : 'zh'
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const switchPath = switchLocalePathWithState(
    location.pathname,
    switchTo,
    location.search,
    location.hash
  )

  const navItems = useMemo(
    () =>
      getPrimaryNavigation(locale).map((item) => ({
        key: item.key,
        label: item.label,
        path: item.key === 'home' ? `/${locale}` : `/${locale}/${item.segment}`
      })),
    [locale]
  )
  const primaryNavKeys = [
    'about',
    'manufacturing',
    'products',
    'engineering',
    'cases',
    'support',
    'news',
    'hr',
    'contact'
  ]
  const primaryNavItems = useMemo(
    () => navItems.filter((item) => primaryNavKeys.includes(item.key)),
    [navItems, primaryNavKeys]
  )
  const mobileMainNavItems = useMemo(
    () => navItems.filter((item) => item.key === 'home' || primaryNavKeys.includes(item.key)),
    [navItems, primaryNavKeys]
  )

  const phoneNumber =
    copy.footer.contactItems.find((item) => item.includes('+')) ?? '+86 13366668010'
  const mobileCallLabel = locale === 'zh' ? '拨打热线' : 'Call Hotline'
  const desktopNavLocaleClass = locale === 'zh' ? 'header-nav-item-zh' : 'header-nav-item-en'
  const mobileNavLocaleClass =
    locale === 'zh' ? 'header-mobile-nav-item-zh' : 'header-mobile-nav-item-en'
  const topBarClass = locale === 'zh' ? 'header-topbar header-topbar-zh' : 'header-topbar header-topbar-en'

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search, location.hash])

  useEffect(() => {
    if (!menuOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => {
    if (path === `/${locale}`) {
      return location.pathname === path
    }

    return location.pathname.startsWith(path)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(251,248,242,0.96)] shadow-[0_18px_40px_rgba(74,82,94,0.1)] backdrop-blur-xl'
          : 'bg-[rgba(251,248,242,0.88)] backdrop-blur-xl'
      }`}
    >
      <div className="border-b border-[#d7cfbf]">
        <div className="section-wrap hidden xl:block">
          <div className={`flex ${topBarClass}`}>
            <div className="flex items-center gap-6">
              <span className="brand-tagline truncate text-[12px]">{copy.header.brandTagline}</span>
              <span className="hidden 2xl:inline-flex text-[#97a0aa]">
                {locale === 'zh' ? '企业工业服务站' : 'Enterprise Service Desk'}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <span className="text-[#8a939e]">
                {locale === 'zh' ? '服务热线' : 'Service Line'}
              </span>
              <a
                href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                className="text-[#6b7380] transition-colors hover:text-[#1f252d]"
              >
                {phoneNumber}
              </a>
              <Link
                to={switchPath}
                onClick={() => setStoredLocale(switchTo)}
                className="text-[#8f672b] transition-colors hover:text-[#1f252d]"
              >
                {copy.header.switchLanguageLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[#d7cfbf]/90">
        <div className="section-wrap">
          <div className="flex h-[78px] items-center justify-between gap-3 sm:h-[92px] sm:gap-4 xl:h-[112px] 2xl:h-[118px]">
            <Link to={`/${locale}`} className="flex min-w-0 items-center gap-2.5 sm:gap-4">
              <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-[10px] border border-[#d7cfbf] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(238,230,215,0.88))] text-[#8f672b] shadow-[0_10px_20px_rgba(88,98,112,0.12)] sm:h-12 sm:w-12 2xl:h-14 2xl:w-14">
                <span className="font-display text-[1.38rem] leading-none sm:text-[1.66rem] 2xl:text-[1.92rem]">H</span>
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-[1.34rem] leading-none text-[#1f252d] sm:text-[1.72rem] 2xl:text-[2.02rem]">
                  {copy.header.brandName}
                </p>
                <p className="brand-tagline mt-1 hidden truncate text-[11px] sm:block 2xl:text-[12px]">
                  {copy.header.brandTagline}
                </p>
              </div>
            </Link>

            <nav className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
              <div className="nav-track max-w-[1220px] flex-1 2xl:max-w-[1320px]">
                <div className="machine-nav-shell header-nav-shell min-w-max px-1">
                  {primaryNavItems.map((item) => {
                    const active = isActive(item.path)
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        aria-current={active ? 'page' : undefined}
                        className={`machine-nav-item header-nav-item shrink-0 px-2 pb-3 2xl:min-h-[66px] ${desktopNavLocaleClass} ${
                          active ? 'machine-nav-item-active' : ''
                        }`}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </nav>

            <div className="hidden items-center gap-3 xl:flex">
              <Link
                to={`/${locale}/inquiry`}
                className="btn-primary min-h-[50px] px-5 text-[13px] 2xl:min-h-[54px] 2xl:px-6 2xl:text-[14px]"
              >
                {copy.header.quoteButton}
              </Link>
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              <Link
                to={switchPath}
                onClick={() => setStoredLocale(switchTo)}
                className="machine-nav-utility min-h-[42px] rounded-[12px] px-3 text-[11px] sm:min-h-[46px] sm:px-3.5 sm:text-[12px]"
              >
                {copy.header.switchLanguageLabel}
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="grid h-[42px] w-[42px] place-items-center rounded-[12px] border border-[#d7cfbf] bg-[rgba(255,255,255,0.82)] text-[#1f252d] transition-colors hover:bg-white sm:h-12 sm:w-12"
                aria-label={menuOpen ? copy.header.closeMenuLabel : copy.header.openMenuLabel}
                aria-expanded={menuOpen}
                aria-controls="mobile-site-menu"
              >
                {menuOpen ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M4 7h16M4 12h16M4 17h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="border-b border-[#d7cfbf] bg-[rgba(251,248,242,0.97)] xl:hidden">
          <div className="section-wrap pb-6 pt-5 sm:pb-7 sm:pt-6">
            <div className="rounded-[24px] border border-[#ded4c4] bg-[linear-gradient(180deg,rgba(252,248,241,0.94),rgba(243,236,226,0.9))] p-4 shadow-[0_16px_34px_rgba(82,92,106,0.1)] sm:p-5">
              <div className="border-b border-[#d7cfbf] pb-4">
                <p className="brand-tagline text-[12px]">
                  {copy.header.brandTagline}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                    className="inline-flex min-h-[40px] items-center rounded-full border border-[#d7cfbf] bg-white/70 px-3.5 text-[13px] font-semibold text-[#45515d]"
                  >
                    {phoneNumber}
                  </a>
                </div>
              </div>

              <nav id="mobile-site-menu" className="mt-4 grid grid-cols-2 gap-3">
              {mobileMainNavItems.map((item) => {
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`header-mobile-nav-item flex min-h-[86px] items-end rounded-[18px] border px-4 py-4 transition-all ${mobileNavLocaleClass} ${
                      active
                        ? 'border-[#c89b45]/65 bg-[linear-gradient(180deg,rgba(244,230,191,0.76),rgba(255,255,255,0.92))] text-[#8f672b] shadow-[0_14px_28px_rgba(182,141,63,0.14)]'
                        : 'border-[#dfd6c8] bg-[rgba(255,255,255,0.72)] text-[#55616d] hover:border-[#c89b45]/35 hover:text-[#1f252d]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              </nav>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  to={`/${locale}/inquiry`}
                  className="btn-primary min-h-[52px] w-full px-5 text-[13px]"
                >
                  {copy.header.quoteButton}
                </Link>
                <a
                  href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                  className="btn-secondary min-h-[52px] w-full px-5 text-[13px]"
                >
                  {mobileCallLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
