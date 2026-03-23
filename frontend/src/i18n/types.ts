export type Locale = 'zh' | 'en'

export type RouteKey = 'home' | 'products' | 'inquiry' | 'about' | 'contact'

export interface SeoEntry {
  title: string
  description: string
  hreflang: Record<Locale, string>
  xDefault: string
}

export interface ProductCard {
  id: number
  name: string
  category: string
  image: string
}

export interface NarrativeNote {
  code: string
  title: string
  description: string
}

export interface NarrativeStep {
  step: string
  title: string
  description: string
}

export interface HeaderCopy {
  brandName: string
  brandTagline: string
  nav: Record<RouteKey, string>
  quoteButton: string
  switchLanguageLabel: string
  openMenuLabel: string
  closeMenuLabel: string
}

export interface FooterCopy {
  aboutText: string
  quickLinksTitle: string
  quickLinks: Record<RouteKey, string>
  productsTitle: string
  productItems: string[]
  contactTitle: string
  contactItems: string[]
  copyright: string
  icp: string
}

export interface HomeCopy {
  heroTitle: string
  heroSubtitle: string
  viewProductsButton: string
  requestQuoteButton: string
  featuredTitle: string
  viewAllProductsButton: string
  brandEssenceTitle: string
  brandEssenceHeadline: string
  brandFrameEyebrow: string
  brandFrameTitle: string
  brandFrameText: string
  curatedSelectionTitle: string
  nextMoveEyebrow: string
  nextMoveTitle: string
  nextMoveText: string
  contactButtonLabel: string
  featuredProducts: ProductCard[]
  designNotes: NarrativeNote[]
  processSteps: NarrativeStep[]
  curatedProductNotes: string[]
  heroMetrics?: {
    value: string
    label: string
  }[]
}

export interface ProductsCopy {
  title: string
  requestQuoteButton: string
  introText: string
  selectionLogicTitle: string
  selectionLogicHeadline: string
  selectionLogicText: string
  productNotes: string[]
  items: ProductCard[]
}

export interface AboutCopy {
  title: string
  subtitle: string
  storyTitle: string
  storyParagraphs: string[]
  imagePlaceholder: string
  contactInfoTitle: string
  contactInfoText: string
}

export interface ContactCardCopy {
  icon: string
  title: string
  value: string
}

export interface ContactCopy {
  title: string
  subtitle: string
  infoTitle: string
  cards: ContactCardCopy[]
  mapPlaceholder: string
  quickInquiryTitle: string
  quickInquiryText: string
  quickInquiryButton: string
}

export interface InquiryProductOption {
  value: string
  label: string
}

export interface InquiryCopy {
  title: string
  subtitle: string
  successIcon: string
  successTitle: string
  successMessage: string
  submitAnotherButton: string
  errorIcon: string
  errorTitle: string
  errorMessage: string
  retryButton: string
  contactButton: string
  submitButton: string
  submittingButton: string
  fields: {
    nameLabel: string
    namePlaceholder: string
    nameError: string
    emailLabel: string
    emailPlaceholder: string
    emailRequiredError: string
    emailInvalidError: string
    phoneLabel: string
    phonePlaceholder: string
    phoneRequiredError: string
    companyLabel: string
    companyPlaceholder: string
    categoryLabel: string
    productLabel: string
    categoryPlaceholder: string
    quantityLabel: string
    quantityPlaceholder: string
    messageLabel: string
    messagePlaceholder: string
    messageError: string
    privacyLabel: string
    privacyPublicLabel: string
    privacyConfidentialLabel: string
    requiredMark: string
  }
  selectPlaceholder: string
  productOptions: InquiryProductOption[]
}

export interface SiteCopy {
  localeName: string
  header: HeaderCopy
  footer: FooterCopy
  home: HomeCopy
  products: ProductsCopy
  about: AboutCopy
  contact: ContactCopy
  inquiry: InquiryCopy
  seo: Record<RouteKey, SeoEntry>
}
