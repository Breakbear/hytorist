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
          <div className="flex h-[98px] items-center justify-between gap-4 sm:h-[104px] xl:h-[112px] 2xl:h-[118px]">
            <Link to={`/${locale}`} className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="grid h-11 w-11 flex-shrink-0 place-items-center border border-[#d7cfbf] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(238,230,215,0.88))] text-[#8f672b] shadow-[0_10px_20px_rgba(88,98,112,0.12)] sm:h-12 sm:w-12 2xl:h-14 2xl:w-14">
                <span className="font-display text-[1.52rem] leading-none sm:text-[1.66rem] 2xl:text-[1.92rem]">H</span>
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-[1.58rem] leading-none text-[#1f252d] sm:text-[1.72rem] 2xl:text-[2.02rem]">
                  {copy.header.brandName}
                </p>
                <p className="brand-tagline mt-1 truncate text-[11px] 2xl:text-[12px]">
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

            <div className="flex items-center gap-3 xl:hidden">
              <Link
                to={switchPath}
                onClick={() => setStoredLocale(switchTo)}
                className="machine-nav-utility min-h-[46px] px-3.5 text-[12px]"
              >
                {copy.header.switchLanguageLabel}
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="grid h-12 w-12 place-items-center border border-[#d7cfbf] bg-[rgba(255,255,255,0.82)] text-[#1f252d] transition-colors hover:bg-white"
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
          <div className="section-wrap py-6">
            <div className="label-muted flex flex-wrap items-center gap-4 border-b border-[#d7cfbf] pb-4 text-[13px]">
              <a href={`tel:${phoneNumber.replace(/\s+/g, '')}`} className="transition-colors hover:text-[#1f252d]">
                {phoneNumber}
              </a>
            </div>
            <p className="brand-tagline mt-5 text-[12px]">
              {copy.header.brandTagline}
            </p>

            <nav id="mobile-site-menu" className="mt-5 grid gap-3.5">
              {mobileMainNavItems.map((item) => {
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`header-mobile-nav-item border-b px-1 pb-4 pt-2 transition-colors ${mobileNavLocaleClass} ${
                      active
                        ? 'border-[#c89b45] text-[#8f672b]'
                        : 'border-[#d7cfbf] text-[#5e6874] hover:text-[#1f252d]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <Link
              to={`/${locale}/inquiry`}
              className="btn-primary mt-6 min-h-[54px] w-full px-6 text-[14px]"
            >
              {copy.header.quoteButton}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
