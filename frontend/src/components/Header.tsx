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
  const utilityNavKeys: string[] = []
  const primaryNavItems = useMemo(
    () => navItems.filter((item) => primaryNavKeys.includes(item.key)),
    [navItems, primaryNavKeys]
  )
  const utilityNavItems = useMemo(
    () => navItems.filter((item) => utilityNavKeys.includes(item.key)),
    [navItems, utilityNavKeys]
  )
  const mobileMainNavItems = useMemo(
    () => navItems.filter((item) => item.key === 'home' || primaryNavKeys.includes(item.key)),
    [navItems, primaryNavKeys]
  )

  const phoneNumber =
    copy.footer.contactItems.find((item) => item.includes('+')) ?? '+86 13366668010'
  const desktopNavTextClass =
    locale === 'zh'
      ? 'text-[13px] tracking-[0.01em] 2xl:text-[15px] 2xl:tracking-[0.03em]'
      : 'text-[12px] tracking-[0.06em] 2xl:text-[13px] 2xl:tracking-[0.08em]'
  const mobileNavTextClass =
    locale === 'zh' ? 'text-[16px] tracking-[0.06em]' : 'text-[15px] tracking-[0.14em]'
  const utilityTextClass = locale === 'zh' ? 'tracking-[0.08em]' : 'tracking-[0.16em]'

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
          <div className="flex min-h-[42px] items-center justify-between gap-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#75808b]">
            <div className="flex items-center gap-6">
              <span className={`truncate text-[#7b838f] ${utilityTextClass}`}>{copy.header.brandTagline}</span>
            </div>

            <div className="flex items-center gap-5">
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
          <div className="flex h-[90px] items-center justify-between gap-6 xl:h-[98px] 2xl:h-[102px]">
            <Link to={`/${locale}`} className="flex min-w-0 items-center gap-4">
              <div className="grid h-11 w-11 flex-shrink-0 place-items-center border border-[#d7cfbf] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(238,230,215,0.88))] text-[#8f672b] shadow-[0_12px_24px_rgba(88,98,112,0.12)] sm:h-12 sm:w-12 2xl:h-14 2xl:w-14">
                <span className="font-display text-[1.55rem] leading-none sm:text-[1.7rem] 2xl:text-[1.95rem]">H</span>
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-[1.62rem] leading-none text-[#1f252d] sm:text-[1.78rem] 2xl:text-[2.08rem]">
                  {copy.header.brandName}
                </p>
                <p className="mt-1.5 truncate text-[10px] uppercase tracking-[0.2em] text-[#6f7782] 2xl:text-[11px] 2xl:tracking-[0.24em]">
                  {copy.header.brandTagline}
                </p>
              </div>
            </Link>

            <nav className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
              <div className="machine-nav-shell max-w-[1040px] flex-1 justify-center gap-2.5 2xl:max-w-[1180px] 2xl:gap-4">
                {primaryNavItems.map((item) => {
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      aria-current={active ? 'page' : undefined}
                      className={`machine-nav-item min-h-[48px] px-1 pb-3 2xl:min-h-[52px] ${desktopNavTextClass} ${
                        active ? 'machine-nav-item-active' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </nav>

            <div className="hidden items-center gap-4 xl:flex">
              <Link
                to={`/${locale}/inquiry`}
                className="inline-flex min-h-[46px] items-center justify-center bg-[linear-gradient(135deg,#f0dfb0,#d7b66c_46%,#b9893d_100%)] px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#1a140a] shadow-[0_16px_32px_rgba(123,89,34,0.28)] transition-transform duration-300 hover:-translate-y-px 2xl:min-h-[50px] 2xl:px-6 2xl:text-[14px] 2xl:tracking-[0.12em]"
              >
                {copy.header.quoteButton}
              </Link>
            </div>

            <div className="flex items-center gap-3 xl:hidden">
              <Link
                to={switchPath}
                onClick={() => setStoredLocale(switchTo)}
                className="machine-nav-utility min-h-[44px] px-3 text-[11px]"
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
          <div className="section-wrap py-5">
            <div className="flex flex-wrap items-center gap-4 border-b border-[#d7cfbf] pb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6b7380]">
              <a href={`tel:${phoneNumber.replace(/\s+/g, '')}`} className="transition-colors hover:text-[#1f252d]">
                {phoneNumber}
              </a>
            </div>

            {utilityNavItems.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 border-b border-[#d7cfbf] pb-4">
                {utilityNavItems.map((item) => {
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`machine-nav-utility min-h-[40px] px-3 text-[11px] ${utilityTextClass} ${
                        active
                          ? 'border-[#c89b45]/50 text-[#8f672b]'
                          : 'text-[#5e6874] hover:text-[#1f252d]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )}

            <nav id="mobile-site-menu" className="mt-4 grid gap-3">
              {mobileMainNavItems.map((item) => {
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`border-b px-1 pb-3.5 pt-1.5 font-semibold uppercase transition-colors ${mobileNavTextClass} ${
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
              className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center bg-[linear-gradient(135deg,#f0dfb0,#d7b66c_46%,#b9893d_100%)] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#1a140a] shadow-[0_16px_32px_rgba(123,89,34,0.28)]"
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
