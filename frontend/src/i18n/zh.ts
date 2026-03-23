import type { SiteCopy } from './types'
import { visualAssets } from '../content/visualAssets'

const productImages = [
  visualAssets.windAssembly,
  visualAssets.pipeline,
  visualAssets.factoryFloor
]

export const zhCopy: SiteCopy = {
  localeName: '中文',
  header: {
    brandName: '海拓斯特',
    brandTagline: '机械与电动科技',
    nav: {
      home: '首页',
      products: '产品',
      inquiry: '询盘',
      about: '关于我们',
      contact: '联系我们'
    },
    quoteButton: '获取报价',
    switchLanguageLabel: 'EN',
    openMenuLabel: '打开菜单',
    closeMenuLabel: '关闭菜单'
  },
  footer: {
    aboutText: '海拓斯特围绕工业装配、工业检修与风电运维场景，提供液压紧固工具、现场机加设备、液压动力站与工程服务支持。',
    quickLinksTitle: '快速链接',
    quickLinks: {
      home: '首页',
      products: '产品中心',
      inquiry: '询盘',
      about: '关于我们',
      contact: '联系我们'
    },
    productsTitle: '工程方向',
    productItems: ['螺栓螺母工程', '管道法兰工程', '现场机械加工工程'],
    contactTitle: '联系方式',
    contactItems: ['北京市丰台区晓月五里6号楼301-6', 'info@hytorist.com', '+86 13366668010'],
    copyright: 'Copyright (c) 2026 Beijing Hytorist Mechanical and Electric Tech Co., Ltd. All rights reserved.',
    icp: 'Beijing ICP15027480'
  },
  home: {
    heroTitle: '液压紧固与工业检修解决方案',
    heroSubtitle: '面向风电、电力、石化、水电与轨交场景，提供液压紧固、现场机加、管道法兰与风电运维相关设备及工程服务。',
    viewProductsButton: '查看产品',
    requestQuoteButton: '提交需求',
    featuredTitle: '核心设备',
    viewAllProductsButton: '查看全部产品',
    brandEssenceTitle: '企业能力',
    brandEssenceHeadline: '研发、制造、测试与现场服务贯通同一交付链路。',
    brandFrameEyebrow: '制造现场',
    brandFrameTitle: '液压扭矩工具、配套设备与工程交付',
    brandFrameText: '海拓斯特围绕液压动力、机械结构和现场执行能力组织研发、制造、测试与服务，用于支撑项目型工业装配与检维修交付。',
    curatedSelectionTitle: '设备矩阵',
    nextMoveEyebrow: '项目对接',
    nextMoveTitle: '提供工况，我们给出成套方案。',
    nextMoveText: '欢迎提交目标扭矩、作业空间、介质类型、交付周期和服务范围，我们将按工况匹配设备、配套方案与实施建议。',
    contactButtonLabel: '查看联系方式',
    featuredProducts: [
      {
        id: 1,
        name: '螺栓螺母工程',
        category: '工程类型',
        image: productImages[0]
      },
      {
        id: 2,
        name: '管道法兰工程',
        category: '工程类型',
        image: productImages[1]
      },
      {
        id: 3,
        name: '现场机械加工工程',
        category: '工程类型',
        image: productImages[2]
      }
    ],
    designNotes: [
      {
        code: '01',
        title: '工业装配与检修方案',
        description: '围绕液压紧固、管道法兰、现场机加与风电运维工况组织设备和工程服务。'
      },
      {
        code: '02',
        title: '体系认证与质量追溯',
        description: '已完成 ISO9001、ISO14001 体系建设，建立研发、制造、测试与质量追溯流程。'
      },
      {
        code: '03',
        title: '技术与服务联动',
        description: '覆盖方案设计、工艺验证、现场安装调试与售后支持，保持项目交付闭环。'
      }
    ],
    processSteps: [
      {
        step: '01',
        title: '工况评估',
        description: '结合目标扭矩、作业空间、工位安全和交付周期梳理配置条件。'
      },
      {
        step: '02',
        title: '设备匹配',
        description: '围绕工具、液压站、附件和非标机构完成成套方案配置。'
      },
      {
        step: '03',
        title: '交付服务',
        description: '覆盖制造、调试、驻场支持和售后响应，保持项目闭环。'
      }
    ],
    curatedProductNotes: [
      '公开资料明确展示风电锁紧盘螺栓拧紧、液压扭矩工具与相关螺栓工程方向，可用于高强度预紧与拆装工况。',
      '公开资料明确覆盖管道坡口、法兰端面加工与阀门检修方向，适配现场管线维护场景。',
      '公开资料明确提及便携式机加与制造能力，用于现场修复加工、非标配套与项目执行支持。'
    ],
    heroMetrics: [
      { value: '24H', label: '询盘响应' },
      { value: 'ISO9001', label: '质量体系' },
      { value: 'ISO14001', label: '环境体系' },
      { value: '丰台区', label: '北京联络点' }
    ]
  },
  products: {
    title: '我们的产品',
    requestQuoteButton: '申请报价',
    introText: '围绕液压扳手、动力单元与配套附件建立清晰的产品陈列，让用户快速理解设备层级与应用方向。',
    selectionLogicTitle: '选型原则',
    selectionLogicHeadline: '先看工况，再看型号。',
    selectionLogicText: '新版产品页降低了边框存在感，通过更大的图片比例、层次化标题和少量金属线条来承载信息。',
    productNotes: [
      '以稳定扭矩输出和便捷现场部署为核心，适配典型工业检修工位。',
      '强调连续工况下的可靠性、操作安全性与批量交付一致性。',
      '作为动力与控制中枢，适合需要稳定节拍的项目型现场。'
    ],
    items: [
      { id: 1, name: '螺栓螺母工程', category: '工程类型', image: productImages[0] },
      { id: 2, name: '管道法兰工程', category: '工程类型', image: productImages[1] },
      { id: 3, name: '现场机械加工工程', category: '工程类型', image: productImages[2] }
    ]
  },
  about: {
    title: '关于海拓斯特',
    subtitle: '液压工具领域值得信赖的合作伙伴',
    storyTitle: '我们的故事',
    storyParagraphs: [
      '海拓斯特专注于工业装配与工业检修技术方案，面向风电、石化、水电、轨交等行业提供液压扭矩工具和配套设备。',
      '公司通过 ISO9001、ISO14001 体系建设，建立研发、制造、测试、现场服务一体化流程，形成可复制的工程交付能力。'
    ],
    imagePlaceholder: '公司形象图',
    contactInfoTitle: '联系信息',
    contactInfoText: '北京市丰台区晓月五里6号楼301-6 | info@hytorist.com | +86 13366668010'
  },
  contact: {
    title: '联系我们',
    subtitle: '欢迎与我们的团队取得联系',
    infoTitle: '联系信息',
    cards: [
      { icon: 'ADDR', title: '地址', value: '北京市丰台区晓月五里6号楼301-6' },
      { icon: 'MAIL', title: '邮箱', value: 'info@hytorist.com' },
      { icon: 'CALL', title: '电话', value: '+86 10 80803620' },
      { icon: 'TIME', title: '24小时热线', value: '+86 13366668010' }
    ],
    mapPlaceholder: '地图位置',
    quickInquiryTitle: '快速询盘',
    quickInquiryText: '如需咨询，请填写询盘表单，我们会尽快回复。',
    quickInquiryButton: '前往询盘表单'
  },
  inquiry: {
    title: '提交询盘',
    subtitle: '请填写项目联系信息、问题类别与工况说明，我们会结合需求尽快安排对接。',
    successIcon: 'OK',
    successTitle: '提交成功',
    successMessage: '感谢您的询盘，我们的销售团队将尽快联系您。',
    submitAnotherButton: '继续提交',
    errorIcon: '!',
    errorTitle: '提交失败',
    errorMessage: '暂时无法提交您的询盘，请稍后重试。',
    retryButton: '重试',
    contactButton: '联系我们',
    submitButton: '提交询盘',
    submittingButton: '提交中...',
    fields: {
      nameLabel: '姓名',
      namePlaceholder: '请输入姓名',
      nameError: '请输入姓名',
      emailLabel: '邮箱',
      emailPlaceholder: '请输入邮箱',
      emailRequiredError: '请输入邮箱',
      emailInvalidError: '请输入有效邮箱地址',
      phoneLabel: '电话',
      phonePlaceholder: '+86 10 1234 5678',
      phoneRequiredError: '请输入电话',
      companyLabel: '公司',
      companyPlaceholder: '请输入公司名称',
      categoryLabel: '问题类别',
      productLabel: '意向产品',
      categoryPlaceholder: '请选择问题类别...',
      quantityLabel: '数量',
      quantityPlaceholder: '预估采购数量',
      messageLabel: '需求说明',
      messagePlaceholder: '请描述您的具体需求...',
      messageError: '请输入需求说明',
      privacyLabel: '信息设置',
      privacyPublicLabel: '公开',
      privacyConfidentialLabel: '保密',
      requiredMark: '*'
    },
    selectPlaceholder: '请选择产品...',
    productOptions: [
      { value: 'pump', label: '专用液压泵站' },
      { value: 'bolting', label: '螺栓螺母工程' },
      { value: 'lifting', label: '顶升平移工程' },
      { value: 'pipeline', label: '管道法兰工程' },
      { value: 'machining', label: '现场机加工程' },
      { value: 'wind', label: '风电运维工程' },
      { value: 'other-category', label: '其他类别产品' },
      { value: 'custom', label: '非标机械制造' }
    ]
  },
  seo: {
    home: {
      title: '海拓斯特 | 专业液压工具解决方案',
      description: '海拓斯特提供液压扭矩扳手、液压泵及工业紧固方案。',
      hreflang: { zh: '/zh', en: '/en' },
      xDefault: '/'
    },
    products: {
      title: '产品中心 | 海拓斯特',
      description: '浏览海拓斯特液压扭矩扳手、液压泵与配件产品。',
      hreflang: { zh: '/zh/products', en: '/en/products' },
      xDefault: '/'
    },
    inquiry: {
      title: '提交询盘 | 海拓斯特',
      description: '提交您的采购需求，海拓斯特销售团队将快速响应。',
      hreflang: { zh: '/zh/inquiry', en: '/en/inquiry' },
      xDefault: '/'
    },
    about: {
      title: '关于我们 | 海拓斯特',
      description: '了解海拓斯特在液压工具与工业应用领域的实力。',
      hreflang: { zh: '/zh/about', en: '/en/about' },
      xDefault: '/'
    },
    contact: {
      title: '联系我们 | 海拓斯特',
      description: '获取海拓斯特地址、邮箱、电话和商务联系信息。',
      hreflang: { zh: '/zh/contact', en: '/en/contact' },
      xDefault: '/'
    }
  }
}


