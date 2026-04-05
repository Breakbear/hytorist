import type { SiteCopy } from './types'
import { visualAssets } from '../content/visualAssets'

const productImages = [
  visualAssets.windAssembly,
  visualAssets.pipeline,
  visualAssets.factoryFloor
]

export const enCopy: SiteCopy = {
  localeName: 'English',
  header: {
    brandName: 'Hytorist',
    brandTagline: 'Mechanical and Electric Tech',
    nav: {
      home: 'Home',
      products: 'Products',
      inquiry: 'Inquiry',
      about: 'About Us',
      contact: 'Contact'
    },
    quoteButton: 'Get Quote',
    switchLanguageLabel: '中文',
    openMenuLabel: 'Open menu',
    closeMenuLabel: 'Close menu'
  },
  footer: {
    aboutText:
      'Hytorist supports industrial assembly, industrial maintenance, and wind-power O&M work with hydraulic bolting tools, on-site machining equipment, hydraulic power units, and related engineering services.',
    quickLinksTitle: 'Quick Links',
    quickLinks: {
      home: 'Home',
      products: 'Products',
      inquiry: 'Inquiry',
      about: 'About Us',
      contact: 'Contact'
    },
    productsTitle: 'Engineering Scope',
    productItems: ['Bolting Engineering', 'Pipeline and Flange Engineering', 'On-site Machining Engineering'],
    contactTitle: 'Contact Info',
    contactItems: ['Xiaoyue Wuli 6-301-6, Fengtai District, Beijing', 'info@hytorist.com', '+86 13366668010'],
    copyright: 'Copyright (c) 2026 Beijing Hytorist Mechanical and Electric Tech Co., Ltd. All rights reserved.',
    icp: 'Beijing ICP15027480'
  },
  home: {
    heroTitle: 'Hydraulic Bolting and Industrial Maintenance Solutions',
    heroSubtitle:
      'For wind power, power generation, petrochemical, hydropower, and rail scenarios with hydraulic bolting, on-site machining, pipeline and flange service, and wind O&M equipment plus field engineering support.',
    viewProductsButton: 'View Products',
    requestQuoteButton: 'Submit Requirement',
    featuredTitle: 'Core Equipment',
    viewAllProductsButton: 'View All Products',
    brandEssenceTitle: 'Company Capability',
    brandEssenceHeadline: 'R&D, manufacturing, testing, and field service organized as one delivery chain.',
    brandFrameEyebrow: 'Shop Floor',
    brandFrameTitle: 'Hydraulic Torque Tools, Support Equipment, and Project Delivery',
    brandFrameText:
      'Hytorist organizes R&D, manufacturing, testing, and service around hydraulic power, mechanical structure, and field execution to support project-based industrial assembly and maintenance delivery.',
    curatedSelectionTitle: 'Equipment Matrix',
    nextMoveEyebrow: 'Project Intake',
    nextMoveTitle: 'Bring the operating condition. We will match the package.',
    nextMoveText:
      'Share target torque, workspace limits, media type, delivery timing, and service scope. We will match the operating condition with equipment direction, support configuration, and implementation advice.',
    contactButtonLabel: 'View Contact',
    featuredProducts: [
      {
        id: 1,
        name: 'Bolting Engineering',
        category: 'Engineering Type',
        image: productImages[0]
      },
      {
        id: 2,
        name: 'Pipeline and Flange Engineering',
        category: 'Engineering Type',
        image: productImages[1]
      },
      {
        id: 3,
        name: 'On-site Machining Engineering',
        category: 'Engineering Type',
        image: productImages[2]
      }
    ],
    designNotes: [
      {
        code: '01',
        title: 'Industrial assembly and maintenance solutions',
        description:
          'Equipment and engineering services are organized around hydraulic bolting, pipeline and flange work, on-site machining, and wind-power O&M scenarios.'
      },
      {
        code: '02',
        title: 'Certified systems and traceability',
        description: 'ISO9001 and ISO14001 management systems support R&D, manufacturing, testing, and quality traceability.'
      },
      {
        code: '03',
        title: 'Connected technical and service workflow',
        description:
          'The delivery thread covers solution design, process validation, on-site installation and commissioning, and after-sales support.'
      }
    ],
    processSteps: [
      {
        step: '01',
        title: 'Operating Condition Review',
        description: 'We start with torque target, workspace limits, safety constraints, and project timing.'
      },
      {
        step: '02',
        title: 'Equipment Matching',
        description: 'Tools, hydraulic units, accessories, and custom mechanisms are aligned into one package.'
      },
      {
        step: '03',
        title: 'Delivery and Service',
        description: 'Manufacturing, commissioning, field support, and after-sales response stay on one execution thread.'
      }
    ],
    curatedProductNotes: [
      'This direction supports wind-turbine bolting, stud removal, and hydraulic tightening work with torque wrenches, tensioners, nut splitters, and stud extractors.',
      'It covers pipe beveling machines, flange facing machines, and valve grinding equipment for pipeline maintenance, flange service, and valve overhaul work.',
      'It also includes portable boring and milling resources together with manufacturing capability for repair and custom-equipment support.'
    ],
    heroMetrics: [
      { value: '24H', label: 'Inquiry Response' },
      { value: 'ISO9001', label: 'Quality System' },
      { value: 'ISO14001', label: 'Environmental System' },
      { value: 'Beijing', label: 'Service Base' }
    ]
  },
  products: {
    title: 'Our Products',
    requestQuoteButton: 'Request Quote',
    introText:
      'The product center follows the public engineering categories and keeps the first view focused on work type, service scope, and equipment direction.',
    selectionLogicTitle: 'Selection Logic',
    selectionLogicHeadline: 'Read the application before the model.',
    selectionLogicText:
      'Start with the work type, site constraints, and matching equipment direction before narrowing specific models or delivery packages.',
    productNotes: [
      'Hydraulic power, bolting, flange service, on-site machining, and wind O&M form the main equipment directions.',
      'Selection should be narrowed by operating condition, working space, interface form, and delivery rhythm rather than by model name alone.',
      'Custom machinery manufacturing remains available when standard categories need project-specific extension or integrated support.'
    ],
    items: [
      { id: 1, name: 'Bolting Engineering', category: 'Engineering Type', image: productImages[0] },
      { id: 2, name: 'Pipeline and Flange Engineering', category: 'Engineering Type', image: productImages[1] },
      { id: 3, name: 'On-site Machining Engineering', category: 'Engineering Type', image: productImages[2] }
    ]
  },
  about: {
    title: 'About Hytorist',
    subtitle: 'Industrial assembly and maintenance partner',
    storyTitle: 'Our Story',
    storyParagraphs: [
      'Hytorist supports wind power, petrochemical, hydropower, power-generation, and rail scenarios with hydraulic bolting tools, support equipment, and project-oriented field service.',
      'The company has built ISO9001 and ISO14001 management systems and maintains an integrated process across R&D, manufacturing, testing, and service delivery.'
    ],
    imagePlaceholder: 'Company Image',
    contactInfoTitle: 'Contact Info',
    contactInfoText: 'Xiaoyue Wuli 6-301-6, Fengtai District, Beijing | info@hytorist.com | +86 13366668010'
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'Get in touch with our team',
    infoTitle: 'Contact Information',
    cards: [
      { icon: 'ADDR', title: 'Address', value: 'Xiaoyue Wuli 6-301-6, Fengtai District, Beijing' },
      { icon: 'MAIL', title: 'Email', value: 'info@hytorist.com' },
      { icon: 'CALL', title: 'Phone', value: '+86 10 80803620' },
      { icon: 'TIME', title: '24-Hour Hotline', value: '+86 13366668010' }
    ],
    mapPlaceholder: 'Map Location',
    quickInquiryTitle: 'Quick Inquiry',
    quickInquiryText: 'Have a question? Fill out our inquiry form and we will get back to you.',
    quickInquiryButton: 'Go to Inquiry Form'
  },
  inquiry: {
    title: 'Request a Quote',
    subtitle: 'Share your contact details, message category, and operating context. We will arrange a follow-up based on your project needs.',
    successIcon: 'OK',
    successTitle: 'Inquiry Submitted',
    successMessage: 'Thank you for your inquiry. Our sales team will contact you shortly.',
    submitAnotherButton: 'Submit Another Inquiry',
    errorIcon: '!',
    errorTitle: 'Something went wrong',
    errorMessage: 'We could not submit your inquiry. Please try again later.',
    retryButton: 'Try Again',
    contactButton: 'Contact Us',
    submitButton: 'Submit Inquiry',
    submittingButton: 'Submitting...',
    fields: {
      nameLabel: 'Name',
      namePlaceholder: 'Your full name',
      nameError: 'Please enter your name',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      emailRequiredError: 'Please enter your email',
      emailInvalidError: 'Please enter a valid email address',
      phoneLabel: 'Phone',
      phonePlaceholder: '+86 10 1234 5678',
      phoneRequiredError: 'Please enter your phone number',
      companyLabel: 'Company',
      companyPlaceholder: 'Your company name',
      categoryLabel: 'Message Category',
      productLabel: 'Product Interest',
      categoryPlaceholder: 'Select a message category...',
      quantityLabel: 'Quantity',
      quantityPlaceholder: 'Estimated quantity',
      messageLabel: 'Message',
      messagePlaceholder: 'Tell us about your requirements...',
      messageError: 'Please enter your message',
      privacyLabel: 'Information Setting',
      privacyPublicLabel: 'Public',
      privacyConfidentialLabel: 'Confidential',
      requiredMark: '*'
    },
    selectPlaceholder: 'Select a product...',
    productOptions: [
      { value: 'pump', label: 'Hydraulic Power Units' },
      { value: 'bolting', label: 'Bolting Engineering' },
      { value: 'lifting', label: 'Lifting and Positioning Engineering' },
      { value: 'pipeline', label: 'Pipeline and Flange Engineering' },
      { value: 'machining', label: 'On-site Machining Engineering' },
      { value: 'wind', label: 'Wind O&M Engineering' },
      { value: 'other-category', label: 'Other Product Categories' },
      { value: 'custom', label: 'Custom Machinery Manufacturing' }
    ]
  },
  seo: {
    home: {
      title: 'Hytorist | Professional Hydraulic Tool Solutions',
      description: 'Hytorist provides hydraulic torque wrenches, pumps and industrial fastening solutions.',
      hreflang: { zh: '/zh', en: '/en' },
      xDefault: '/'
    },
    products: {
      title: 'Products | Hytorist',
      description: 'Explore Hytorist hydraulic torque wrenches, pumps and accessories.',
      hreflang: { zh: '/zh/products', en: '/en/products' },
      xDefault: '/'
    },
    inquiry: {
      title: 'Inquiry | Hytorist',
      description: 'Send your procurement requirements and get a quick response from our team.',
      hreflang: { zh: '/zh/inquiry', en: '/en/inquiry' },
      xDefault: '/'
    },
    about: {
      title: 'About Us | Hytorist',
      description: 'Learn about Hytorist capabilities in hydraulic tools and industrial applications.',
      hreflang: { zh: '/zh/about', en: '/en/about' },
      xDefault: '/'
    },
    contact: {
      title: 'Contact | Hytorist',
      description: 'Get Hytorist contact details including address, email, phone and business hours.',
      hreflang: { zh: '/zh/contact', en: '/en/contact' },
      xDefault: '/'
    }
  }
}

