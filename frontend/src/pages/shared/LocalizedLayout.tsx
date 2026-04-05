import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { setStoredLocale } from '../../i18n/routes'
import type { Locale, SiteCopy } from '../../i18n/types'

interface LocalizedLayoutProps {
  locale: Locale
  copy: SiteCopy
}

const LocalizedLayout = ({ locale, copy }: LocalizedLayoutProps) => {
  const location = useLocation()

  useEffect(() => {
    setStoredLocale(locale)
  }, [locale])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="page-shell flex min-h-screen flex-col overflow-x-hidden">
      <Header locale={locale} copy={copy} />
      <main className="flex-grow pt-[7rem] sm:pt-[7.6rem] xl:pt-[10.4rem] 2xl:pt-[10.8rem]">
        <Outlet />
      </main>
      <Footer locale={locale} copy={copy} />
    </div>
  )
}

export default LocalizedLayout
