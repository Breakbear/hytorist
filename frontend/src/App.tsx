import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import Admin from './pages/Admin'
import Header from './components/Header'
import Footer from './components/Footer'
import LocalizedLayout from './pages/shared/LocalizedLayout'
import InquiryView from './pages/shared/InquiryView'
import PortalSectionView from './pages/shared/PortalSectionView'
import { enCopy } from './i18n/en'
import { zhCopy } from './i18n/zh'
import { buildLocalizedPathWithState, detectPreferredLocale } from './i18n/routes'
import ZhHome from './pages/zh/Home'
import EnHome from './pages/en/Home'

const PreserveRedirect = ({ to }: { to: string }) => {
  const location = useLocation()
  return <Navigate to={`${to}${location.search}${location.hash}`} replace />
}

const LocaleSectionRedirect = ({ locale }: { locale: 'zh' | 'en' }) => {
  const location = useLocation()
  return (
    <Navigate
      to={buildLocalizedPathWithState(locale, 'home', location.search, location.hash)}
      replace
    />
  )
}

const BrowserLocaleRedirect = () => {
  const location = useLocation()
  const locale = detectPreferredLocale()
  return (
    <Navigate
      to={buildLocalizedPathWithState(locale, 'home', location.search, location.hash)}
      replace
    />
  )
}

const LegacySectionRedirect = ({ segment }: { segment: string }) => {
  const location = useLocation()
  const locale = detectPreferredLocale()
  const normalized = location.pathname.replace(/^\/+/, '')
  const rest = normalized.startsWith(segment) ? normalized.slice(segment.length) : ''
  const normalizedRest = rest.startsWith('/') ? rest : rest ? `/${rest}` : ''

  const targetBase = segment === 'home' ? `/${locale}` : `/${locale}/${segment}`
  return <Navigate to={`${targetBase}${normalizedRest}${location.search}${location.hash}`} replace />
}

const InvalidLocaleRedirect = () => {
  const params = useParams<{ locale: string }>()
  const location = useLocation()

  if (params.locale === 'zh' || params.locale === 'en') {
    return (
      <Navigate
        to={buildLocalizedPathWithState(params.locale, 'home', location.search, location.hash)}
        replace
      />
    )
  }

  return (
    <Navigate
      to={buildLocalizedPathWithState('zh', 'home', location.search, location.hash)}
      replace
    />
  )
}

const AdminShell = () => {
  return (
    <div className="page-shell min-h-screen flex flex-col">
      <Header locale="zh" copy={zhCopy} />
      <main className="flex-grow pt-[7rem] sm:pt-[7.6rem] xl:pt-[10.4rem] 2xl:pt-[10.8rem]">
        <Admin />
      </main>
      <Footer locale="zh" copy={zhCopy} />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<BrowserLocaleRedirect />} />
      <Route path="/home/*" element={<LegacySectionRedirect segment="home" />} />
      <Route path="/about/*" element={<LegacySectionRedirect segment="about" />} />
      <Route path="/manufacturing/*" element={<LegacySectionRedirect segment="manufacturing" />} />
      <Route path="/products/*" element={<LegacySectionRedirect segment="products" />} />
      <Route path="/engineering/*" element={<LegacySectionRedirect segment="engineering" />} />
      <Route path="/cases/*" element={<LegacySectionRedirect segment="cases" />} />
      <Route path="/support/*" element={<LegacySectionRedirect segment="support" />} />
      <Route path="/news/*" element={<LegacySectionRedirect segment="news" />} />
      <Route path="/hr/*" element={<LegacySectionRedirect segment="hr" />} />
      <Route path="/contact/*" element={<LegacySectionRedirect segment="contact" />} />
      <Route path="/inquiry" element={<LegacySectionRedirect segment="inquiry" />} />

      <Route path="/admin" element={<AdminShell />} />

      <Route path="/zh" element={<LocalizedLayout locale="zh" copy={zhCopy} />}>
        <Route index element={<ZhHome />} />
        <Route path="home" element={<LocaleSectionRedirect locale="zh" />} />
        <Route path="about/*" element={<PortalSectionView locale="zh" sectionKey="about" />} />
        <Route path="manufacturing/*" element={<PortalSectionView locale="zh" sectionKey="manufacturing" />} />
        <Route path="products/*" element={<PortalSectionView locale="zh" sectionKey="products" />} />
        <Route path="engineering/*" element={<PortalSectionView locale="zh" sectionKey="engineering" />} />
        <Route path="cases/*" element={<PortalSectionView locale="zh" sectionKey="cases" />} />
        <Route path="support/*" element={<PortalSectionView locale="zh" sectionKey="support" />} />
        <Route path="news/*" element={<PortalSectionView locale="zh" sectionKey="news" />} />
        <Route path="hr/*" element={<PortalSectionView locale="zh" sectionKey="hr" />} />
        <Route path="contact/*" element={<PortalSectionView locale="zh" sectionKey="contact" />} />
        <Route path="inquiry" element={<InquiryView locale="zh" copy={zhCopy} />} />
        <Route path="*" element={<LocaleSectionRedirect locale="zh" />} />
      </Route>

      <Route path="/en" element={<LocalizedLayout locale="en" copy={enCopy} />}>
        <Route index element={<EnHome />} />
        <Route path="home" element={<LocaleSectionRedirect locale="en" />} />
        <Route path="about/*" element={<PortalSectionView locale="en" sectionKey="about" />} />
        <Route path="manufacturing/*" element={<PortalSectionView locale="en" sectionKey="manufacturing" />} />
        <Route path="products/*" element={<PortalSectionView locale="en" sectionKey="products" />} />
        <Route path="engineering/*" element={<PortalSectionView locale="en" sectionKey="engineering" />} />
        <Route path="cases/*" element={<PortalSectionView locale="en" sectionKey="cases" />} />
        <Route path="support/*" element={<PortalSectionView locale="en" sectionKey="support" />} />
        <Route path="news/*" element={<PortalSectionView locale="en" sectionKey="news" />} />
        <Route path="hr/*" element={<PortalSectionView locale="en" sectionKey="hr" />} />
        <Route path="contact/*" element={<PortalSectionView locale="en" sectionKey="contact" />} />
        <Route path="inquiry" element={<InquiryView locale="en" copy={enCopy} />} />
        <Route path="*" element={<LocaleSectionRedirect locale="en" />} />
      </Route>

      <Route path="/:locale/*" element={<InvalidLocaleRedirect />} />
      <Route path="*" element={<PreserveRedirect to="/zh" />} />
    </Routes>
  )
}

export default App
