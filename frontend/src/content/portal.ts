import type { Locale } from '../i18n/types'
import { portalHeroVisuals, visualAssets } from './visualAssets'

export type PortalSectionKey =
  | 'about'
  | 'manufacturing'
  | 'products'
  | 'engineering'
  | 'cases'
  | 'support'
  | 'news'
  | 'hr'
  | 'contact'

export interface PrimaryNavItem {
  key: 'home' | PortalSectionKey
  segment: string
  label: string
}

interface PortalGridItem {
  id: number
  title: string
  image: string
  description?: string
  link?: string
}

interface PortalNewsItem {
  id: number
  title: string
  date: string
  pageId?: string
}

interface ContactDetail {
  label: string
  value: string
}

interface ContactMailbox {
  label: string
  email: string
}

export interface PortalHeroMetric {
  label: string
  value: string
}

export interface PortalHeroData {
  title: string
  subtitle: string
  image: string
  badges: string[]
  metrics: PortalHeroMetric[]
}

interface BasePageData {
  title: string
  subtitle?: string
  hero?: PortalHeroData
  sourcePageUrl?: string
}

interface ArticlePageData extends BasePageData {
  kind: 'article'
  paragraphs: string[]
  bullets?: string[]
  image?: string
  imageAlt?: string
}

interface GridPageData extends BasePageData {
  kind: 'grid'
  summary?: string
  items: PortalGridItem[]
  pager: string
}

interface NewsPageData extends BasePageData {
  kind: 'news'
  items: PortalNewsItem[]
  pager: string
}

interface ContactPageData extends BasePageData {
  kind: 'contact'
  company: string
  details: ContactDetail[]
  mailboxes: ContactMailbox[]
  qrLabel: string
  qrImage?: string
  ctaLabel?: string
}

export type PortalPageData = ArticlePageData | GridPageData | NewsPageData | ContactPageData

export interface PortalMenuItem {
  id: string
  label: string
}

export interface PortalSectionData {
  key: PortalSectionKey
  navLabel: string
  segment: string
  menuTitle: string
  defaultPageId: string
  menu: PortalMenuItem[]
  pages: Record<string, PortalPageData>
}

const media = visualAssets
const officialBaseUrl = 'http://www.hytorist.com'
const officialPages = {
  aboutProfile: `${officialBaseUrl}/about.asp?id=3`,
  aboutCulture: `${officialBaseUrl}/about.asp?id=5`,
  aboutOrg: `${officialBaseUrl}/about.asp?id=9`,
  aboutHonor: `${officialBaseUrl}/about.asp?id=10`,
  rd: `${officialBaseUrl}/about.asp?id=6`,
  manufacturing: `${officialBaseUrl}/about.asp?id=12`,
  testing: `${officialBaseUrl}/about.asp?id=27`,
  engineeringService: `${officialBaseUrl}/about.asp?id=13`,
  rentalService: `${officialBaseUrl}/about.asp?id=14`,
  afterSales: `${officialBaseUrl}/about.asp?id=17`,
  training: `${officialBaseUrl}/about.asp?id=18`,
  trial: `${officialBaseUrl}/about.asp?id=19`,
  downloads: `${officialBaseUrl}/about.asp?id=20`,
  talentStrategy: `${officialBaseUrl}/about.asp?id=16`,
  jobs: `${officialBaseUrl}/about.asp?id=21`,
  staff: `${officialBaseUrl}/about.asp?id=22`,
  contact: `${officialBaseUrl}/about.asp?id=2`,
  message: `${officialBaseUrl}/about.asp?id=4`
}
const officialAssets = {
  certificate: `${officialBaseUrl}/UploadFiles/201578185652222.jpg`,
  manufacturing: `${officialBaseUrl}/UploadFiles/201571033051350.png`,
  wechatQr: `${officialBaseUrl}/UploadFiles/20202182394680.png`
}

const productItemsZh: PortalGridItem[] = [
  {
    id: 1,
    title: '专用液压泵站',
    image: media.pump,
    description: '公开产品目录已保留该分类，当前未显示具体型号。新版页面按液压动力站、现场供压与多工具联动配套场景整理这一方向。',
    link: officialPages.rentalService
  },
  {
    id: 2,
    title: '螺栓螺母工程',
    image: media.windAssembly,
    description:
      '公开资料对应风机锁紧盘、多螺栓同步拧紧与检维修工况，覆盖液压扭矩扳手、液压拉伸器、螺母劈开器与栽丝取出器等设备方向，具体配置按项目工况确认。',
    link: officialPages.rentalService
  },
  {
    id: 3,
    title: '顶升平移工程',
    image: media.factoryFloor,
    description:
      '公开资料对应设备顶升、同步平移与姿态调整工况，重点整理液压油缸、同步顶升系统与三维调整系统等设备方向。',
    link: officialPages.rentalService
  },
  {
    id: 4,
    title: '管道法兰工程',
    image: media.pipeline,
    description: '公开资料对应管道检修与法兰加工工况，重点整理坡口、端面加工与阀门研磨等现场设备方向。',
    link: officialPages.rentalService
  },
  {
    id: 5,
    title: '现场机加工程',
    image: media.factoryFloor,
    description:
      '公开资料对应现场镗孔、铣削与检维修加工工况，重点整理便携式机加设备、修复加工能力与现场服务支持。',
    link: officialPages.rentalService
  },
  {
    id: 6,
    title: '风电运维工程',
    image: media.turbine,
    description: '公开资料对应风机检修与齿轮箱维护工况，重点整理换油工程车及相关运维专用设备方向。',
    link: officialPages.rentalService
  },
  {
    id: 7,
    title: '其他类别产品',
    image: media.digitalScene,
    description:
      '公开产品目录保留了综合分类，当前未显示独立条目。新版页面先将其作为跨类别设备、成套配套与组合方案的承接入口。',
    link: officialPages.rentalService
  },
  {
    id: 8,
    title: '非标机械制造',
    image: media.factoryFloor,
    description:
      '企业资料明确包含非标机械、自动化装备与工业机器人相关研发制造能力，可承接定制化装备、夹具工装与集成方案。',
    link: officialPages.aboutProfile
  }
]

const productItemsEn: PortalGridItem[] = [
  {
    id: 1,
    title: 'Hydraulic Power Units',
    image: media.pump,
    description: 'The public product directory keeps this category, but no concrete model list is exposed. The new site organizes it around hydraulic power supply, field pressure support, and multi-tool operation scenarios.',
    link: officialPages.rentalService
  },
  {
    id: 2,
    title: 'Bolting Engineering',
    image: media.windAssembly,
    description:
      'Public materials align this category with wind-turbine bolting, multi-bolt tightening, removal, and maintenance work, covering torque wrenches, tensioners, nut splitters, and stud extractors. Exact configurations are confirmed per project condition.',
    link: officialPages.rentalService
  },
  {
    id: 3,
    title: 'Lifting and Positioning Engineering',
    image: media.factoryFloor,
    description:
      'Public materials align this category with lifting, synchronous positioning, and attitude adjustment work, centered on cylinders, synchronous lifting systems, and 3D alignment systems.',
    link: officialPages.rentalService
  },
  {
    id: 4,
    title: 'Pipeline and Flange Engineering',
    image: media.pipeline,
    description: 'Public materials align this category with pipeline maintenance and flange machining work, centered on beveling, flange facing, and valve grinding equipment.',
    link: officialPages.rentalService
  },
  {
    id: 5,
    title: 'On-site Machining Engineering',
    image: media.factoryFloor,
    description:
      'Public materials align this category with field boring, milling, and repair-machining work, organized around portable machining equipment, repair capability, and on-site service support.',
    link: officialPages.rentalService
  },
  {
    id: 6,
    title: 'Wind O&M Engineering',
    image: media.turbine,
    description: 'Public materials align this category with turbine maintenance and gearbox service work, centered on oil-changing service vehicles and related O&M equipment.',
    link: officialPages.rentalService
  },
  {
    id: 7,
    title: 'Other Product Categories',
    image: media.digitalScene,
    description:
      'The public directory keeps this composite category, but no standalone rows are exposed. The new site keeps it as an entry for cross-category equipment, packaged support, and combined delivery programs.',
    link: officialPages.rentalService
  },
  {
    id: 8,
    title: 'Custom Machinery Manufacturing',
    image: media.factoryFloor,
    description:
      'Public company materials confirm capability in non-standard machinery, automation equipment, and industrial-robot-related manufacturing for custom equipment, fixtures, and integrated programs.',
    link: officialPages.aboutProfile
  }
]

const caseItemsZh: PortalGridItem[] = [
  {
    id: 1,
    title: '螺栓螺母工程',
    image: media.windAssembly,
    description:
      '公开案例目录保留了该工程分类，但当前未显示具体案例。新版页面先按风机锁紧盘、多螺栓同步拧紧与检维修工况整理应用入口。',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=螺栓螺母工程`
  },
  {
    id: 2,
    title: '顶升平移工程',
    image: media.factoryFloor,
    description:
      '公开案例目录保留了该工程分类，但当前未显示具体案例。新版页面先按设备顶升、同步平移与安装调整工况整理应用入口。',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=顶升平移工程`
  },
  {
    id: 3,
    title: '管道法兰工程',
    image: media.pipeline,
    description: '公开案例目录保留了该工程分类，但当前未显示具体案例。新版页面先按管道维护、法兰加工与阀门检修工况整理应用入口。',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=管道法兰工程`
  },
  {
    id: 4,
    title: '现场机加工程',
    image: media.factoryFloor,
    description:
      '公开案例目录保留了该工程分类，但当前未显示具体案例。新版页面先按现场镗孔、铣削与修复加工工况整理应用入口。',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=现场机加工程`
  },
  {
    id: 5,
    title: '风电运维工程',
    image: media.turbine,
    description: '公开案例目录保留了该工程分类，但当前未显示具体案例。新版页面先按风机安装检修、换油与维护保障工况整理应用入口。',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=风电运维工程`
  },
  {
    id: 6,
    title: '节能环保工程',
    image: media.digitalScene,
    description:
      '公开案例目录保留了该工程分类，但当前未显示具体案例。新版页面先按节能环保装备、数字化场景与工程实施工况整理应用入口。',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=节能环保工程`
  },
  {
    id: 7,
    title: '其它类别产品',
    image: media.digitalScene,
    description:
      '公开案例目录保留了综合分类，但当前未显示具体案例。新版页面先按跨类别项目、组合型设备与集成场景整理应用入口。',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=其它类别产品`
  },
  {
    id: 8,
    title: '非标机械制造',
    image: media.factoryFloor,
    description:
      '公开案例目录保留了该工程分类，但当前未显示具体案例。新版页面先按非标装备设计、制造与系统集成工况整理应用入口。',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=非标机械制造`
  },
  {
    id: 9,
    title: '我们的用户',
    image: media.team,
    description:
      '公开案例目录保留了该分类，但当前未公开客户名单。新版页面仅保留用户行业与合作场景入口，不展示未公开名称。',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=我们的用户`
  }
]

const caseItemsEn: PortalGridItem[] = [
  {
    id: 1,
    title: 'Bolting Engineering',
    image: media.windAssembly,
    description:
      'The public application catalog keeps this engineering category, but no concrete case rows are shown. The new site organizes it as an entry for wind-turbine bolting, multi-bolt tightening, and maintenance scenarios.',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=螺栓螺母工程`
  },
  {
    id: 2,
    title: 'Lifting and Positioning',
    image: media.factoryFloor,
    description:
      'The public application catalog keeps this engineering category, but no concrete case rows are shown. The new site organizes it as an entry for lifting, synchronous positioning, and installation-adjustment scenarios.',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=顶升平移工程`
  },
  {
    id: 3,
    title: 'Pipeline and Flange',
    image: media.pipeline,
    description: 'The public application catalog keeps this engineering category, but no concrete case rows are shown. The new site organizes it as an entry for pipeline maintenance, flange machining, and valve-service scenarios.',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=管道法兰工程`
  },
  {
    id: 4,
    title: 'On-site Machining',
    image: media.factoryFloor,
    description:
      'The public application catalog keeps this engineering category, but no concrete case rows are shown. The new site organizes it as an entry for field boring, milling, and repair-machining scenarios.',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=现场机加工程`
  },
  {
    id: 5,
    title: 'Wind O&M Engineering',
    image: media.turbine,
    description: 'The public application catalog keeps this engineering category, but no concrete case rows are shown. The new site organizes it as an entry for turbine installation, maintenance, oil-changing, and service-support scenarios.',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=风电运维工程`
  },
  {
    id: 6,
    title: 'Energy Saving and Environmental',
    image: media.digitalScene,
    description:
      'The public application catalog keeps this engineering category, but no concrete case rows are shown. The new site organizes it as an entry for energy-saving equipment, digital-scene, and environmental engineering scenarios.',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=节能环保工程`
  },
  {
    id: 7,
    title: 'Other Categories',
    image: media.digitalScene,
    description:
      'The public application catalog keeps this composite category, but no concrete case rows are shown. The new site organizes it as an entry for mixed-category projects, combined equipment, and integrated scenarios.',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=其它类别产品`
  },
  {
    id: 8,
    title: 'Custom Machinery',
    image: media.factoryFloor,
    description:
      'The public application catalog keeps this engineering category, but no concrete case rows are shown. The new site organizes it as an entry for custom-equipment design, manufacturing, and integration scenarios.',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=非标机械制造`
  },
  {
    id: 9,
    title: 'Our Users',
    image: media.team,
    description:
      'The public application catalog keeps this category, but no public customer list is shown. The new site limits it to industry and cooperation scenarios without exposing unpublished names.',
    link: `${officialBaseUrl}/CaseList.Asp?BigClassName=应用案例&SmallClassName=我们的用户`
  }
]

const zhHeroMetrics: PortalHeroMetric[] = [
  { label: '服务热线', value: '24H' },
  { label: '质量体系', value: 'ISO9001' },
  { label: '服务基地', value: '北京' }
]

const enHeroMetrics: PortalHeroMetric[] = [
  { label: 'Service Hotline', value: '24H' },
  { label: 'Quality System', value: 'ISO9001' },
  { label: 'Service Base', value: 'Beijing' }
]

const createHero = (
  locale: Locale,
  sectionKey: PortalSectionKey,
  title: string,
  subtitle: string,
  badges: string[]
): PortalHeroData => ({
  title,
  subtitle,
  image: portalHeroVisuals[sectionKey],
  badges,
  metrics: locale === 'zh' ? zhHeroMetrics : enHeroMetrics
})

const zhSections: Record<PortalSectionKey, PortalSectionData> = {
  about: {
    key: 'about',
    navLabel: '关于我们',
    segment: 'about',
    menuTitle: '关于我们',
    defaultPageId: 'profile',
    menu: [
      { id: 'profile', label: '企业简介' },
      { id: 'culture', label: '企业文化' },
      { id: 'org', label: '组织架构' },
      { id: 'honor', label: '荣誉资质' }
    ],
    pages: {
      profile: {
        kind: 'article',
        title: '企业简介',
        sourcePageUrl: officialPages.aboutProfile,
        hero: createHero(
          'zh',
          'about',
          '关于海拓斯特',
          '机械设计基因驱动的工业紧固与检修解决方案',
          ['企业简介', '机械设计驱动', '工程交付体系']
        ),
        paragraphs: [
          '海拓斯特（Hytorist）专业从事高效的工业装配与工业检修技术方案研究，围绕螺栓拧紧工具及设备、管道检修工具及设备、便携式机床、工业机器人与自动化装备组织研发与制造能力。',
          '主要服务行业包括核电、火电、风电、水电、石油、化工、冶金、矿山、造船、铁路、军工与航空航天等领域，产品范围覆盖螺栓工程、管道工程、现场机械加工工程、液压顶升平移定位工程与非标自动化机械设备。',
          '公司已通过 ISO9001 质量体系认证，多种产品取得相关专利证书；研发实验室、售后技术部门与工程部门共同支撑产品培训、维护维修、工程承包与产品租赁服务。'
        ],
        image: media.office,
        imageAlt: '企业办公环境'
      },
      culture: {
        kind: 'article',
        title: '企业文化',
        sourcePageUrl: officialPages.aboutCulture,
        paragraphs: [
          '管理理念：民主、和谐、科学、创新；经营理念：服务第一、用户至上、诚信为本、激情创新。',
          '发展理念：思路决定出路、观念决定发展、细节决定成败；服务理念：迅捷、高效、真诚、品质。',
          '人才理念：以人为本、天道酬勤；为用户创造价值、为员工创造机会、为社会创造效益。'
        ],
        bullets: ['民主和谐', '用户至上', '真诚品质', '以人为本']
      },
      org: {
        kind: 'article',
        title: '组织架构',
        sourcePageUrl: officialPages.aboutOrg,
        paragraphs: [
          '公开资料保留了“组织架构”栏目入口，但未展示具体组织图或岗位结构明细。',
          '结合已公开的企业简介与人才战略页面，当前可确认公司由研发、制造、实验测试、售后技术和工程服务等能力单元共同支撑交付。'
        ],
        image: media.team,
        imageAlt: '组织团队'
      },
      honor: {
        kind: 'grid',
        title: '荣誉资质',
        sourcePageUrl: officialPages.aboutHonor,
        summary: '当前公开资料展示了质量体系认证证书页面。新版站点先将证书原图与证书标题结构化接入，后续继续补齐专利与认证明细。',
        items: [
          {
            id: 1,
            title: '质量体系认证证书',
            image: officialAssets.certificate,
            description: '当前已核实接入的证书资料，可与联系信息和后台资料池统一维护。',
            link: officialPages.aboutHonor
          }
        ],
        pager: '现阶段已接入可核实证书资料，后续继续补充专利与体系证书'
      }
    }
  },
  manufacturing: {
    key: 'manufacturing',
    navLabel: '研发制造',
    segment: 'manufacturing',
    menuTitle: '研发制造',
    defaultPageId: 'rd',
    menu: [
      { id: 'rd', label: '研发能力' },
      { id: 'production', label: '制造能力' },
      { id: 'testing', label: '检测手段' }
    ],
    pages: {
      rd: {
        kind: 'article',
        title: '研发能力',
        sourcePageUrl: officialPages.rd,
        hero: createHero(
          'zh',
          'manufacturing',
          '研发制造能力',
          '围绕液压动力与结构可靠性持续迭代，支撑复杂工况。',
          ['研发能力', '研发制造一体', '质量追溯']
        ),
        paragraphs: [
          '研发部门围绕高扭矩、智能控制、轻量化结构持续迭代核心产品。',
          '每年保持研发投入，并通过客户工况反哺设计优化，缩短产品验证周期。'
        ],
        image: media.lab,
        imageAlt: '研发实验室'
      },
      production: {
        kind: 'article',
        title: '制造能力',
        sourcePageUrl: officialPages.manufacturing,
        paragraphs: [
          '公司早期主要为军工企业提供非标类机械配件，同时为国外品牌进行 OEM 定向代加工，并在持续引进、吸收国外先进技术的过程中积累了较强的制造能力。',
          '目前配套外协生产场地约 1000 平方米，配置数控车床、精密磨床、精密车床、精密铣床、线切割、电气焊机、激光切割机、数控冲床、数控折弯机和数控剪板机等 50 余台套设备，可覆盖大型机械零件与复杂零件加工。',
          '先进设备、成熟工艺、质量管理体系以及精益求精的生产团队，共同构成企业稳步发展与持续交付的基础。'
        ],
        image: officialAssets.manufacturing,
        imageAlt: '制造能力展示'
      },
      testing: {
        kind: 'article',
        title: '检测手段',
        sourcePageUrl: officialPages.testing,
        paragraphs: [
          '为适应公司战略发展，海拓斯特以整个平台设立实验测试室，形成集产品开发设计、实验、试制、验证和基础研究、应用于一体的完整研发体系。',
          '研发实验室配置扭力试验仪、液压拉伸试验台、液压压力标定仪、硬度试验仪、法兰管道加工机试验台以及阀门研磨加工试验台等设备，用于验证关键参数与现场适配性。',
          '公司以严谨、精益求精的态度推进检测和验证工作，确保方案、设备与交付过程具备可追溯性。'
        ],
        bullets: ['扭矩精度检测', '压力稳定性测试', '耐久寿命测试', '整机出厂检验']
      }
    }
  },
  products: {
    key: 'products',
    navLabel: '产品中心',
    segment: 'products',
    menuTitle: '产品中心',
    defaultPageId: 'all',
    menu: [
      { id: 'all', label: '全部分类' },
      { id: 'pump', label: '专用液压泵站' },
      { id: 'bolting', label: '螺栓螺母工程' },
      { id: 'lifting', label: '顶升平移工程' },
      { id: 'pipe', label: '管道法兰工程' },
      { id: 'machining', label: '现场机加工程' },
      { id: 'wind', label: '风电运维工程' },
      { id: 'other', label: '其他类别产品' },
      { id: 'custom', label: '非标机械制造' }
    ],
    pages: {
      all: {
        kind: 'grid',
        title: '产品中心',
        sourcePageUrl: officialPages.rentalService,
        hero: createHero(
          'zh',
          'products',
          '设备目录',
          '当前公开产品页未返回型号明细，站内先按已核实的 8 个产品分类组织目录。',
          ['8 个公开分类', '设备方向目录', '按工况沟通']
        ),
        summary: '当前目录依据已公开产品分类、产品租赁信息和企业能力资料整理，先完整保留 8 个产品分类，再用已公开设备方向说明适用场景。',
        items: productItemsZh,
        pager: '8 个公开产品分类已全部接入；具体型号仍待取得可公开资料后再发布'
      },
      pump: {
        kind: 'grid',
        title: '专用液压泵站',
        sourcePageUrl: officialPages.rentalService,
        summary: '公开目录保留了专用液压泵站分类，但当前未提供型号列表。当前页面先说明液压动力配套方向与项目沟通入口。',
        items: productItemsZh.filter((item) => item.title.includes('泵站')),
        pager: '已接入专用液压泵站分类，后续如取得真实型号资料再补齐'
      },
      bolting: {
        kind: 'grid',
        title: '螺栓螺母工程',
        sourcePageUrl: officialPages.rentalService,
        summary: '该方向在公开产品资料与租赁资料中均有明确提及，是当前可核实程度较高的产品方向之一。',
        items: productItemsZh.filter((item) => item.title.includes('螺栓')),
        pager: '按已公开设备方向整理'
      },
      lifting: {
        kind: 'grid',
        title: '顶升平移工程',
        sourcePageUrl: officialPages.rentalService,
        summary: '当前公开资料明确提到了液压油缸、同步顶升系统与三维调整系统等顶升平移设备方向。',
        items: productItemsZh.filter((item) => item.title.includes('顶升平移')),
        pager: '按已公开设备方向整理'
      },
      pipe: {
        kind: 'grid',
        title: '管道法兰工程',
        sourcePageUrl: officialPages.rentalService,
        summary: '公开资料明确提到管道坡口机、法兰端面加工机与阀门研磨机等设备，用于管道法兰类工程。',
        items: productItemsZh.filter((item) => item.title.includes('管道')),
        pager: '按已公开设备方向整理'
      },
      machining: {
        kind: 'grid',
        title: '现场机加工程',
        sourcePageUrl: officialPages.rentalService,
        summary: '公开资料提到便携式镗孔机、便携式铣削机床等现场机加设备，可用于检修与现场加工场景。',
        items: productItemsZh.filter((item) => item.title.includes('现场机加')),
        pager: '按已公开设备方向整理'
      },
      wind: {
        kind: 'grid',
        title: '风电运维工程',
        sourcePageUrl: officialPages.rentalService,
        summary: '风电运维工程已在公开产品资料中单独列出，当前先按可核实设备方向展示。',
        items: productItemsZh.filter((item) => item.title.includes('风电运维')),
        pager: '按已公开设备方向整理'
      },
      other: {
        kind: 'grid',
        title: '其他类别产品',
        sourcePageUrl: officialPages.rentalService,
        summary: '公开产品目录保留了“其他类别产品”分类，但未公开独立条目。当前先保留该入口承接综合型需求。',
        items: productItemsZh.filter((item) => item.title.includes('其他类别')),
        pager: '分类入口已保留，待取得公开资料后补充细项'
      },
      custom: {
        kind: 'grid',
        title: '非标机械制造',
        sourcePageUrl: officialPages.aboutProfile,
        summary: '企业资料明确提到非标机械制造与自动化装备研发制造能力，当前按已核实方向整理展示。',
        items: productItemsZh.filter((item) => item.title.includes('非标机械制造')),
        pager: '按已公开设备方向整理'
      }
    }
  },
  engineering: {
    key: 'engineering',
    navLabel: '工程服务',
    segment: 'engineering',
    menuTitle: '工程服务',
    defaultPageId: 'service',
    menu: [
      { id: 'service', label: '工程服务' },
      { id: 'rental', label: '产品租赁' }
    ],
    pages: {
      service: {
        kind: 'article',
        title: '工程服务',
        sourcePageUrl: officialPages.engineeringService,
        hero: createHero(
          'zh',
          'engineering',
          '工程服务体系',
          '标准化流程驱动现场交付，保障复杂项目实施稳定性。',
          ['服务 E-01', '驻场支持', '工艺验证']
        ),
        paragraphs: [
          '海拓斯特设有工程服务部，能够为用户提供满意的现场检维修服务。全部上岗人员均经历专业技术培训，可快速组合成多个高水平工作组。',
          '在以往专业现场服务过程中，公司形成了工程服务程序化、技术操作规范化、维修工作专业化、质量管理标准化的一套服务模式。',
          '专业化的服务设备与经验丰富的服务团队，不但提供高质量现场服务，也可面向具体工况提供定制解决方案。'
        ],
        image: `${officialBaseUrl}/UploadFiles/20157262092864.png`,
        imageAlt: '工程服务现场'
      },
      rental: {
        kind: 'article',
        title: '产品租赁',
        sourcePageUrl: officialPages.rentalService,
        paragraphs: [
          '为满足多样化市场需求并帮助用户节约成本，海拓斯特提供产品及专用设备租赁业务，并可同步安排相关技术工程师进行产品与设备的操作技术培训和施工作业指导。',
          '当前公开资料明确列出的租赁方向包括：螺栓螺母工程、顶升平移工程、管道法兰工程、现场机加工程以及风电运维工程。',
          '可租赁设备包括液压扭矩扳手、液压拉伸器、液压油缸、同步顶升系统、三维顶升调整系统、管道坡口机、法兰端面加工机、阀门研磨机、便携式镗孔机、便携式铣削机床以及齿轮箱换油工程车等。'
        ],
        bullets: ['设备租赁', '现场支持', '快速调配', '按项目计费']
      }
    }
  },
  cases: {
    key: 'cases',
    navLabel: '应用案例',
    segment: 'cases',
    menuTitle: '应用案例',
    defaultPageId: 'all',
    menu: [
      { id: 'all', label: '全部分类' },
      { id: 'bolting', label: '螺栓螺母工程' },
      { id: 'lifting', label: '顶升平移工程' },
      { id: 'pipeline', label: '管道法兰工程' },
      { id: 'machining', label: '现场机加工程' },
      { id: 'wind', label: '风电运维工程' },
      { id: 'energy', label: '节能环保工程' },
      { id: 'other', label: '其它类别产品' },
      { id: 'custom', label: '非标机械制造' },
      { id: 'users', label: '我们的用户' }
    ],
    pages: {
      all: {
        kind: 'grid',
        title: '应用案例',
        sourcePageUrl: officialPages.aboutProfile,
        hero: createHero(
          'zh',
          'cases',
          '应用场景案例',
          '当前公开案例页未返回案例明细，站内先按已核实的 9 个应用分类组织目录。',
          ['9 个公开分类', '场景入口目录', '按项目沟通']
        ),
        items: caseItemsZh,
        pager: '9 个公开应用分类已全部接入；具体案例内容仍待取得可公开资料后再发布'
      },
      bolting: {
        kind: 'grid',
        title: '螺栓螺母工程',
        summary: '公开案例目录保留了“螺栓螺母工程”分类，但当前未公开案例条目。当前页面先保留该类场景入口。',
        items: caseItemsZh.filter((item) => item.title === '螺栓螺母工程'),
        pager: '分类入口已保留，待取得公开案例资料后补充细项'
      },
      lifting: {
        kind: 'grid',
        title: '顶升平移工程',
        summary: '公开案例目录保留了“顶升平移工程”分类，但当前未公开案例条目。当前页面先保留该类场景入口。',
        items: caseItemsZh.filter((item) => item.title === '顶升平移工程'),
        pager: '分类入口已保留，待取得公开案例资料后补充细项'
      },
      wind: {
        kind: 'grid',
        title: '风电运维工程',
        summary: '公开案例目录保留了“风电运维工程”分类，但当前未公开案例条目。当前页面先保留该类场景入口。',
        items: caseItemsZh.filter((item) => item.title === '风电运维工程'),
        pager: '分类入口已保留，待取得公开案例资料后补充细项'
      },
      pipeline: {
        kind: 'grid',
        title: '管道法兰工程',
        summary: '公开案例目录保留了“管道法兰工程”分类，但当前未公开案例条目。当前页面先保留该类场景入口。',
        items: caseItemsZh.filter((item) => item.title === '管道法兰工程'),
        pager: '分类入口已保留，待取得公开案例资料后补充细项'
      },
      machining: {
        kind: 'grid',
        title: '现场机加工程',
        summary: '公开案例目录保留了“现场机加工程”分类，但当前未公开案例条目。当前页面先保留该类场景入口。',
        items: caseItemsZh.filter((item) => item.title === '现场机加工程'),
        pager: '分类入口已保留，待取得公开案例资料后补充细项'
      },
      energy: {
        kind: 'grid',
        title: '节能环保工程',
        summary: '公开案例目录保留了“节能环保工程”分类，但当前未公开案例条目。当前页面先保留该类场景入口。',
        items: caseItemsZh.filter((item) => item.title === '节能环保工程'),
        pager: '分类入口已保留，待取得公开案例资料后补充细项'
      },
      other: {
        kind: 'grid',
        title: '其它类别产品',
        summary: '公开案例目录保留了“其它类别产品”分类，但当前未公开案例条目。当前页面先保留该类场景入口。',
        items: caseItemsZh.filter((item) => item.title === '其它类别产品'),
        pager: '分类入口已保留，待取得公开案例资料后补充细项'
      },
      custom: {
        kind: 'grid',
        title: '非标机械制造',
        summary: '公开案例目录保留了“非标机械制造”分类，但当前未公开案例条目。当前页面先保留该类场景入口。',
        items: caseItemsZh.filter((item) => item.title === '非标机械制造'),
        pager: '分类入口已保留，待取得公开案例资料后补充细项'
      },
      users: {
        kind: 'grid',
        title: '我们的用户',
        summary: '公开案例目录保留了“我们的用户”分类，但当前未公开客户或用户名单。当前页面先保留该类入口。',
        items: caseItemsZh.filter((item) => item.title === '我们的用户'),
        pager: '分类入口已保留，待取得公开案例资料后补充细项'
      }
    }
  },
  support: {
    key: 'support',
    navLabel: '技术支持',
    segment: 'support',
    menuTitle: '技术支持',
    defaultPageId: 'aftersales',
    menu: [
      { id: 'aftersales', label: '售后服务' },
      { id: 'training', label: '技术培训' },
      { id: 'trial', label: '产品试用' },
      { id: 'downloads', label: '下载中心' }
    ],
    pages: {
      aftersales: {
        kind: 'article',
        title: '售后服务',
        sourcePageUrl: officialPages.afterSales,
        hero: createHero(
          'zh',
          'support',
          '技术支持与售后',
          '构建服务闭环，覆盖故障响应、培训、试用与资料支持。',
          ['支持 S-01', '24H 响应', '保内保外流程']
        ),
        paragraphs: [
          '海拓斯特已通过 ISO9001 质量管理体系认证，拥有先进的试验设备和完善的售后服务体系，售后服务部覆盖售前技术支持、技术培训、产品维修等工作。',
          '公开服务资料明确说明：质保期内由设计或生产缺陷导致的问题由公司免费维修及更换配件；因用户使用不当导致的问题，可提供免费维修并收取零件成本费用。',
          '交货服务可覆盖安装、调试、理论培训、操作培训与维保培训；保内服务承诺 2 小时响应，一般故障远程指导，疑难故障 24 小时内赴现场并在必要时提供替代产品。'
        ],
        bullets: ['质量保证', '交货服务', '保内服务', '保外服务']
      },
      training: {
        kind: 'article',
        title: '技术培训',
        sourcePageUrl: officialPages.training,
        paragraphs: [
          '公开技术培训资料明确列出理论培训、操作培训和维保培训三大部分，并在培训完结后对接受培训的人员进行技术考核，对通过者颁发相关证书。',
          '理论培训覆盖工作原理、故障预防与检测、安全注意事项以及日常维护保养；操作培训包括产品演示、安全操作全过程讲解和逐步实操指导。',
          '维保培训强调设备保养与维护知识、人员安全、设备安全、设备维护、修理及备件更换等全过程注意事项。'
        ],
        image: media.training,
        imageAlt: '技术培训'
      },
      trial: {
        kind: 'article',
        title: '产品试用',
        sourcePageUrl: officialPages.trial,
        paragraphs: [
          '当前公开资料内容较简洁，仅明确说明公司可提供产品演示以及试用服务。',
          '如需试用，建议直接与公司联系，由团队进一步确认设备、工况和试用安排。'
        ]
      },
      downloads: {
        kind: 'article',
        title: '下载中心',
        sourcePageUrl: officialPages.downloads,
        paragraphs: [
          '当前公开的“下载中心”列表未返回有效文件条目。',
          '新版站点暂按栏目结构保留下载入口，待取得真实公开资料后再接入文件与参数包。'
        ],
        bullets: ['栏目入口已保留', '当前无公开文件列表', '后续接入真实下载资料', '统一由后台管理']
      }
    }
  },
  news: {
    key: 'news',
    navLabel: '新闻中心',
    segment: 'news',
    menuTitle: '新闻中心',
    defaultPageId: 'company',
    menu: [
      { id: 'company', label: '公司新闻' },
      { id: 'industry', label: '行业新闻' },
      { id: 'notice', label: '信息公示' }
    ],
    pages: {
      company: {
        kind: 'news',
        title: '公司新闻',
        sourcePageUrl: officialPages.aboutProfile,
        hero: createHero(
          'zh',
          'news',
          '新闻与公告',
          '当前公开公司新闻 8 条，行业新闻和信息公示当前未显示公开条目。',
          ['新闻 N-01', '时间轴检索', '公开发布']
        ),
        items: [],
        pager: '当前公开公司新闻 8 条，行业新闻和信息公示当前未显示公开条目'
      },
      industry: {
        kind: 'news',
        title: '行业新闻',
        items: [],
        pager: '当前公开行业新闻未显示条目'
      },
      notice: {
        kind: 'news',
        title: '信息公示',
        items: [],
        pager: '当前公开信息公示未显示条目'
      }
    }
  },
  hr: {
    key: 'hr',
    navLabel: '人力资源',
    segment: 'hr',
    menuTitle: '人力资源',
    defaultPageId: 'strategy',
    menu: [
      { id: 'strategy', label: '人才战略' },
      { id: 'jobs', label: '招聘职位' },
      { id: 'staff', label: '员工天地' }
    ],
    pages: {
      strategy: {
        kind: 'article',
        title: '人才战略',
        sourcePageUrl: officialPages.talentStrategy,
        hero: createHero(
          'zh',
          'hr',
          '人力资源',
          '面向工程实践打造人才体系，强化协作与交付能力。',
          ['人力 H-01', '岗位模型', '成长机制']
        ),
        paragraphs: [
          '人才是企业发展的“血脉”。公司坚持“以人为本”，将人才引进、培养和任用放在企业发展战略高度，持续建设完备的人力资源管理体系。',
          '海拓斯特坚持任人唯贤、以德为先、公平竞争和用人所长，通过合理岗位设置、跟踪培养、专业培训与实践锻炼推动人才成长。',
          '在任用和激励机制上，公司强调责任感、事业心、执行力和团队意识，并通过目标管理、薪酬等级、奖励机制与发展平台实现长期成长。'
        ],
        bullets: ['公平竞争', '以岗定人', '导师机制', '持续成长']
      },
      jobs: {
        kind: 'article',
        title: '招聘职位',
        sourcePageUrl: officialPages.jobs,
        paragraphs: [
          '公开招聘资料说明：如对职位感兴趣，可将简历发送至 hr@hytorist.com，并附近期免冠照片，在邮件主题中注明“职位+姓名”及期望薪资。',
          '当前公开岗位包括机械设计工程师/技术研发工程师、技术服务工程师/维修工程师、销售工程师/销售经理等方向。',
          '岗位说明对机械制图、结构与材料知识、SolidWorks/CAD/CAXA、Office、出差适应性以及相关行业经验等能力有较明确要求。'
        ]
      },
      staff: {
        kind: 'article',
        title: '员工天地',
        sourcePageUrl: officialPages.staff,
        paragraphs: [
          '公开资料保留了“员工天地”栏目入口，但当前公开页面未展示正文内容。',
          '新版站点保留该栏目结构，后续如取得真实公开活动、团队文化或员工发展资料，再由后台统一补充。'
        ],
        image: media.team,
        imageAlt: '员工活动'
      }
    }
  },
  contact: {
    key: 'contact',
    navLabel: '联系我们',
    segment: 'contact',
    menuTitle: '联系我们',
    defaultPageId: 'info',
    menu: [
      { id: 'info', label: '联系方式' },
      { id: 'message', label: '客户留言' }
    ],
    pages: {
      info: {
        kind: 'contact',
        title: '联系方式',
        sourcePageUrl: officialPages.contact,
        hero: createHero(
          'zh',
          'contact',
          '联系与服务台账',
          '提供多渠道技术与商务联络入口，确保沟通可追踪。',
          ['联络 T-01', '渠道清单', '快速转接']
        ),
        company: '北京海拓斯特机电技术有限公司',
        details: [
          { label: '地址', value: '北京市丰台区晓月五里6号楼301-6' },
          { label: '邮编', value: '100165' },
          { label: '电话', value: '+86 10 80803620' },
          { label: '传真', value: '+86 10 80803826' },
          { label: '邮箱', value: 'info@hytorist.com' },
          { label: '网址', value: 'www.hytorist.com' },
          { label: '24小时热线', value: '+86 13366668010' }
        ],
        mailboxes: [
          { label: '产品咨询', email: 'info@hytorist.com' },
          { label: '技术支持', email: 'info@hytorist.com' },
          { label: '人力资源', email: 'hr@hytorist.com' },
          { label: '投诉建议', email: 'zhaoxuqiang@hytorist.com' }
        ],
        qrLabel: '微信公众号',
        qrImage: officialAssets.wechatQr
      },
      message: {
        kind: 'contact',
        title: '客户留言',
        sourcePageUrl: officialPages.message,
        subtitle: '站内询盘表单统一收纳姓名、电话、邮箱、问题类别、公开与保密选项及问题内容，便于项目沟通集中处理。',
        company: '在线留言入口',
        details: [
          { label: '必填字段', value: '姓名、电话、邮箱、问题内容' },
          { label: '问题类别', value: '产品咨询、技术咨询、投诉或建议、其他内容' },
          { label: '信息设置', value: '支持公开与保密选项' }
        ],
        mailboxes: [
          { label: '商务咨询', email: 'info@hytorist.com' },
          { label: '技术支持', email: 'info@hytorist.com' }
        ],
        qrLabel: '扫码关注公众号',
        qrImage: officialAssets.wechatQr,
        ctaLabel: '前往提交询盘'
      }
    }
  }
}

const enSections: Record<PortalSectionKey, PortalSectionData> = {
  about: {
    ...zhSections.about,
    navLabel: 'About Us',
    menuTitle: 'About Us',
    menu: [
      { id: 'profile', label: 'Company Profile' },
      { id: 'culture', label: 'Culture' },
      { id: 'org', label: 'Organization' },
      { id: 'honor', label: 'Certifications' }
    ],
    pages: {
      profile: {
        kind: 'article',
        title: 'Company Profile',
        sourcePageUrl: officialPages.aboutProfile,
        hero: createHero(
          'en',
          'about',
          'About Hytorist',
          'Mechanical design DNA with industrial bolting engineering delivery.',
          ['A-01 Nameplate', 'Mechanics-first', 'Delivery System']
        ),
        paragraphs: [
          'Hytorist focuses on industrial assembly and maintenance solutions, developing tooling and equipment for bolting, pipeline maintenance, portable machining, robotics, and automation scenarios.',
          'Public company materials cover applications in nuclear, thermal, wind, hydropower, petrochemical, metallurgy, mining, shipbuilding, railway, defense, and aerospace sectors.',
          'The company states that ISO9001 certification, patented products, laboratory capability, after-sales engineers, engineering contracting, and equipment rental together support its delivery system.'
        ]
      },
      culture: {
        kind: 'article',
        title: 'Culture',
        sourcePageUrl: officialPages.aboutCulture,
        paragraphs: [
          'Public culture materials list management values around democracy, harmony, science, and innovation.',
          'Its business philosophy emphasizes service first, customer priority, integrity, and innovation, while the development philosophy focuses on mindset, detail, and execution.',
          'The page also states a people-first talent philosophy and the goal of creating value for customers, employees, and society.'
        ]
      },
      org: {
        kind: 'article',
        title: 'Organization',
        sourcePageUrl: officialPages.aboutOrg,
        paragraphs: [
          'Public materials keep an organization section, but the current page does not expose a detailed organizational chart.',
          'Based on the available company materials, the delivery structure clearly involves R&D, manufacturing, testing, after-sales support, and engineering service functions.'
        ]
      },
      honor: {
        kind: 'grid',
        title: 'Certifications',
        sourcePageUrl: officialPages.aboutHonor,
        summary: 'Current public materials expose a quality-system certificate page. The new site structures the certificate image and title for future expansion.',
        items: [
          {
            id: 1,
            title: 'Quality Management Certification',
            image: officialAssets.certificate,
            description: 'Currently verified certificate material, structured as a reusable asset inside the new site.',
            link: officialPages.aboutHonor
          }
        ],
        pager: 'Current verified certificate material connected, with more patents and certifications to be added'
      }
    }
  },
  manufacturing: {
    ...zhSections.manufacturing,
    navLabel: 'R&D and Manufacturing',
    menuTitle: 'R&D and Manufacturing',
    menu: [
      { id: 'rd', label: 'R&D Capability' },
      { id: 'production', label: 'Production Capability' },
      { id: 'testing', label: 'Testing Methods' }
    ],
    pages: {
      rd: {
        kind: 'article',
        title: 'R&D Capability',
        sourcePageUrl: officialPages.rd,
        hero: createHero(
          'en',
          'manufacturing',
          'R&D and Manufacturing',
          'Hydraulic power and mechanical reliability iterated for complex scenarios.',
          ['R&D Capability', 'Integrated Chain', 'Quality Traceability']
        ),
        paragraphs: [
          'Public materials position R&D around a complete chain of design, testing, prototyping, validation, and applied development.',
          'It emphasizes laboratory capability and the ability to iterate hydraulic power, structural reliability, and field-oriented equipment solutions.'
        ]
      },
      production: {
        kind: 'article',
        title: 'Production Capability',
        sourcePageUrl: officialPages.manufacturing,
        paragraphs: [
          'Public manufacturing materials describe early non-standard machining work for defense-industry customers together with OEM-oriented production for overseas brands.',
          'It highlights roughly 1,000 square meters of coordinated production capacity and more than 50 sets of equipment, including CNC lathes, grinding machines, milling machines, laser cutting, bending, and sheet-metal systems.',
          'Advanced equipment, mature processing methods, and the quality-management system are presented as the foundation for stable delivery.'
        ],
        image: officialAssets.manufacturing,
        imageAlt: 'Manufacturing capability'
      },
      testing: {
        kind: 'article',
        title: 'Testing Methods',
        sourcePageUrl: officialPages.testing,
        paragraphs: [
          'Public materials state that Hytorist established a laboratory and test room to support design, prototyping, validation, and applied research in one system.',
          'Equipment includes torque testers, hydraulic tensile benches, pressure calibration rigs, hardness testers, flange-processing benches, and valve grinding test equipment.',
          'The testing workflow is positioned as a disciplined part of product reliability and engineering delivery.'
        ]
      }
    }
  },
  products: {
    ...zhSections.products,
    navLabel: 'Products',
    menuTitle: 'Products',
    menu: [
      { id: 'all', label: 'All Categories' },
      { id: 'pump', label: 'Hydraulic Power Units' },
      { id: 'bolting', label: 'Bolting Engineering' },
      { id: 'lifting', label: 'Lifting and Positioning' },
      { id: 'pipe', label: 'Pipeline and Flange' },
      { id: 'machining', label: 'On-site Machining' },
      { id: 'wind', label: 'Wind O&M Engineering' },
      { id: 'other', label: 'Other Products' },
      { id: 'custom', label: 'Custom Machinery' }
    ],
    pages: {
      all: {
        kind: 'grid',
        title: 'Products',
        sourcePageUrl: officialPages.rentalService,
        hero: createHero(
          'en',
          'products',
          'Equipment Catalog',
          'The current public catalog does not expose model-level product records, so this page keeps the eight verified product categories and explains each direction without inventing SKUs.',
          ['8 Public Categories', 'Equipment Directions', 'Scenario Matching']
        ),
        summary: 'The current catalog is derived from verified product categories, rental materials, and company capabilities, preserving all eight public categories before any model list is published.',
        items: productItemsEn,
        pager: 'All eight public product categories are now connected; model-level details will be added only after verified records are available'
      },
      pump: {
        kind: 'grid',
        title: 'Hydraulic Power Units',
        sourcePageUrl: officialPages.rentalService,
        summary: 'The public catalog keeps a Hydraulic Power Units category, but no model list is currently exposed. This page explains the verified hydraulic-power direction only.',
        items: productItemsEn.filter((item) => item.title.includes('Hydraulic Power')),
        pager: 'Hydraulic Power Units category connected with verified direction notes'
      },
      bolting: {
        kind: 'grid',
        title: 'Bolting Engineering',
        sourcePageUrl: officialPages.rentalService,
        summary: 'Bolting engineering is explicitly listed in the public product and rental materials.',
        items: productItemsEn.filter((item) => item.title.includes('Bolting')),
        pager: 'Organized from verified public equipment directions'
      },
      lifting: {
        kind: 'grid',
        title: 'Lifting and Positioning',
        sourcePageUrl: officialPages.rentalService,
        summary: 'Public materials explicitly reference cylinders, synchronous lifting systems, and 3D adjustment systems in this category.',
        items: productItemsEn.filter((item) => item.title.includes('Lifting')),
        pager: 'Organized from verified public equipment directions'
      },
      pipe: {
        kind: 'grid',
        title: 'Pipeline and Flange',
        sourcePageUrl: officialPages.rentalService,
        summary: 'Pipe beveling, flange facing, and valve grinding equipment are explicitly referenced in public materials.',
        items: productItemsEn.filter((item) => item.title.includes('Pipeline')),
        pager: 'Organized from verified public equipment directions'
      },
      machining: {
        kind: 'grid',
        title: 'On-site Machining',
        sourcePageUrl: officialPages.rentalService,
        summary: 'Portable boring and milling equipment are listed in public materials for on-site machining scenarios.',
        items: productItemsEn.filter((item) => item.title.includes('Machining')),
        pager: 'Organized from verified public equipment directions'
      },
      wind: {
        kind: 'grid',
        title: 'Wind O&M Engineering',
        sourcePageUrl: officialPages.rentalService,
        summary: 'Wind-power maintenance is preserved as its own category in the public catalog and remains available as a verified engineering direction.',
        items: productItemsEn.filter((item) => item.title.includes('Wind O&M')),
        pager: 'Organized from verified public equipment directions'
      },
      other: {
        kind: 'grid',
        title: 'Other Products',
        sourcePageUrl: officialPages.rentalService,
        summary: 'The public catalog keeps an Other Products category, but no standalone rows are currently exposed. The new site preserves this category as a general intake bucket.',
        items: productItemsEn.filter((item) => item.title.includes('Other Product')),
        pager: 'Category preserved until verified public details are available'
      },
      custom: {
        kind: 'grid',
        title: 'Custom Machinery',
        sourcePageUrl: officialPages.aboutProfile,
        summary: 'Public company materials state capability in custom machinery manufacturing and automation equipment.',
        items: productItemsEn.filter((item) => item.title.includes('Custom Machinery')),
        pager: 'Organized from verified public equipment directions'
      }
    }
  },
  engineering: {
    ...zhSections.engineering,
    navLabel: 'Engineering Services',
    menuTitle: 'Engineering Services',
    menu: [
      { id: 'service', label: 'Field Services' },
      { id: 'rental', label: 'Rental Services' }
    ],
    pages: {
      service: {
        kind: 'article',
        title: 'Field Services',
        sourcePageUrl: officialPages.engineeringService,
        hero: createHero(
          'en',
          'engineering',
          'Engineering Services',
          'Standard workflow for stable on-site delivery and maintenance support.',
          ['Field Service', 'Service Team', 'Process Control']
        ),
        paragraphs: [
          'Public field-service materials describe a dedicated engineering service department with trained personnel and organized service teams.',
          'It emphasizes procedural service workflow, standardized operation, professional repair work, and standardized quality management.',
          'The team is positioned to deliver both on-site service and scenario-specific solution customization.'
        ],
        image: `${officialBaseUrl}/UploadFiles/20157262092864.png`,
        imageAlt: 'Field service'
      },
      rental: {
        kind: 'article',
        title: 'Rental Services',
        sourcePageUrl: officialPages.rentalService,
        paragraphs: [
          'Public rental materials state that Hytorist offers equipment rental to reduce customer cost and support diverse project demand.',
          'It explicitly lists bolting engineering, lifting and positioning, pipeline and flange work, on-site machining, and wind-power maintenance as rental directions.',
          'Training and operational guidance can be provided together with the rented equipment.'
        ]
      }
    }
  },
  cases: {
    ...zhSections.cases,
    navLabel: 'Applications',
    menuTitle: 'Applications',
    menu: [
      { id: 'all', label: 'All Categories' },
      { id: 'bolting', label: 'Bolting Engineering' },
      { id: 'lifting', label: 'Lifting and Positioning' },
      { id: 'pipeline', label: 'Pipeline and Flange' },
      { id: 'machining', label: 'On-site Machining' },
      { id: 'wind', label: 'Wind O&M Engineering' },
      { id: 'energy', label: 'Energy Saving and Environmental' },
      { id: 'other', label: 'Other Categories' },
      { id: 'custom', label: 'Custom Machinery' },
      { id: 'users', label: 'Our Users' }
    ],
    pages: {
      all: {
        kind: 'grid',
        title: 'Applications',
        sourcePageUrl: officialPages.aboutProfile,
        hero: createHero(
          'en',
          'cases',
          'Application Cases',
          'The current public application pages do not expose case-level records, so this page keeps the nine verified categories and explains each one without inventing project entries.',
          ['9 Public Categories', 'Scenario Entry Points', 'Project Coordination']
        ),
        items: caseItemsEn,
        pager: 'All nine public application categories are now connected; case-level details will be added only after verified records are available'
      },
      bolting: {
        kind: 'grid',
        title: 'Bolting Engineering',
        summary: 'The public application catalog keeps a Bolting Engineering category, but no case rows are currently exposed. The new site preserves it as a scenario entry.',
        items: caseItemsEn.filter((item) => item.title === 'Bolting Engineering'),
        pager: 'Category preserved until verified public case details are available'
      },
      lifting: {
        kind: 'grid',
        title: 'Lifting and Positioning',
        summary: 'The public application catalog keeps a Lifting and Positioning category, but no case rows are currently exposed. The new site preserves it as a scenario entry.',
        items: caseItemsEn.filter((item) => item.title === 'Lifting and Positioning'),
        pager: 'Category preserved until verified public case details are available'
      },
      wind: {
        kind: 'grid',
        title: 'Wind O&M Engineering',
        summary: 'The public application catalog keeps a Wind O&M Engineering category, but no case rows are currently exposed. The new site preserves it as a scenario entry.',
        items: caseItemsEn.filter((item) => item.title === 'Wind O&M Engineering'),
        pager: 'Category preserved until verified public case details are available'
      },
      pipeline: {
        kind: 'grid',
        title: 'Pipeline and Flange',
        summary: 'The public application catalog keeps a Pipeline and Flange category, but no case rows are currently exposed. The new site preserves it as a scenario entry.',
        items: caseItemsEn.filter((item) => item.title === 'Pipeline and Flange'),
        pager: 'Category preserved until verified public case details are available'
      },
      machining: {
        kind: 'grid',
        title: 'On-site Machining',
        summary: 'The public application catalog keeps an On-site Machining category, but no case rows are currently exposed. The new site preserves it as a scenario entry.',
        items: caseItemsEn.filter((item) => item.title === 'On-site Machining'),
        pager: 'Category preserved until verified public case details are available'
      },
      energy: {
        kind: 'grid',
        title: 'Energy Saving and Environmental',
        summary: 'The public application catalog keeps an Energy Saving and Environmental category, but no case rows are currently exposed. The new site preserves it as a scenario entry.',
        items: caseItemsEn.filter((item) => item.title === 'Energy Saving and Environmental'),
        pager: 'Category preserved until verified public case details are available'
      },
      other: {
        kind: 'grid',
        title: 'Other Categories',
        summary: 'The public application catalog keeps an Other Categories section, but no case rows are currently exposed. The new site preserves it as a scenario entry.',
        items: caseItemsEn.filter((item) => item.title === 'Other Categories'),
        pager: 'Category preserved until verified public case details are available'
      },
      custom: {
        kind: 'grid',
        title: 'Custom Machinery',
        summary: 'The public application catalog keeps a Custom Machinery category, but no case rows are currently exposed. The new site preserves it as a scenario entry.',
        items: caseItemsEn.filter((item) => item.title === 'Custom Machinery'),
        pager: 'Category preserved until verified public case details are available'
      },
      users: {
        kind: 'grid',
        title: 'Our Users',
        summary: 'The public application catalog keeps an Our Users section, but no public user list is currently exposed. The new site preserves it as a category entry.',
        items: caseItemsEn.filter((item) => item.title === 'Our Users'),
        pager: 'Category preserved until verified public case details are available'
      }
    }
  },
  support: {
    ...zhSections.support,
    navLabel: 'Technical Support',
    menuTitle: 'Technical Support',
    menu: [
      { id: 'aftersales', label: 'After-sales' },
      { id: 'training', label: 'Training' },
      { id: 'trial', label: 'Trial' },
      { id: 'downloads', label: 'Downloads' }
    ],
    pages: {
      aftersales: {
        kind: 'article',
        title: 'After-sales',
        sourcePageUrl: officialPages.afterSales,
        hero: createHero(
          'en',
          'support',
          'Technical Support',
          'Service loop for after-sales response, training, trial and document delivery.',
          ['Technical Support', '24H Response', 'Service Coverage']
        ),
        paragraphs: [
          'Public support materials state that the company operates under ISO9001 and maintains a dedicated after-sales service department.',
          'Its service scope includes pre-sales technical support, training, repair, installation, commissioning, and customer follow-up.',
          'The public service commitment includes a 2-hour response window and a 24-hour on-site dispatch path for difficult failures.'
        ]
      },
      training: {
        kind: 'article',
        title: 'Training',
        sourcePageUrl: officialPages.training,
        paragraphs: [
          'Public training materials break training into theory, operation, and maintenance modules.',
          'It explicitly mentions post-training assessment and issuing certificates to qualified participants.'
        ]
      },
      trial: {
        kind: 'article',
        title: 'Trial',
        sourcePageUrl: officialPages.trial,
        paragraphs: [
          'The current public materials provide only a short note for trial service, stating that product demonstration and trial support are available on request.',
          'Customers are asked to contact the company directly for further arrangement.'
        ]
      },
      downloads: {
        kind: 'article',
        title: 'Downloads',
        sourcePageUrl: officialPages.downloads,
        paragraphs: [
          'The public download-center page does not currently return valid file records.',
          'The new site therefore keeps the section structure in place and waits for verified downloadable files before publishing them.'
        ]
      }
    }
  },
  news: {
    ...zhSections.news,
    navLabel: 'News',
    menuTitle: 'News',
    menu: [
      { id: 'company', label: 'Company News' },
      { id: 'industry', label: 'Industry News' },
      { id: 'notice', label: 'Notices' }
    ],
    pages: {
      company: {
        kind: 'news',
        title: 'Company News',
        sourcePageUrl: officialPages.aboutProfile,
        hero: createHero(
          'en',
          'news',
          'News and Notices',
          'There are currently 8 public company-news items, while Industry News and Notices do not show public entries.',
          ['News', 'Public Section', 'Structured Archive']
        ),
        items: [],
        pager: 'There are currently 8 public company-news items, while Industry News and Notices do not show public entries'
      },
      industry: { kind: 'news', title: 'Industry News', sourcePageUrl: officialPages.aboutProfile, items: [], pager: 'No public Industry News entries are currently shown' },
      notice: { kind: 'news', title: 'Notices', sourcePageUrl: officialPages.aboutProfile, items: [], pager: 'No public Notice entries are currently shown' }
    }
  },
  hr: {
    ...zhSections.hr,
    navLabel: 'Careers',
    menuTitle: 'Careers',
    menu: [
      { id: 'strategy', label: 'Talent Strategy' },
      { id: 'jobs', label: 'Open Positions' },
      { id: 'staff', label: 'Employee Life' }
    ],
    pages: {
      strategy: {
        kind: 'article',
        title: 'Talent Strategy',
        sourcePageUrl: officialPages.talentStrategy,
        hero: createHero(
          'en',
          'hr',
          'Human Resources',
          'Talent framework designed for engineering execution and long-term growth.',
          ['Talent Strategy', 'Role System', 'Growth Framework']
        ),
        paragraphs: [
          'Public talent-strategy materials frame people as the company’s growth engine and emphasize a long-term people-first management system.',
          'It highlights merit-based selection, fair competition, role matching, tracking and mentoring, professional training, and growth through practical project work.',
          'Compensation, incentives, and career-development mechanisms are positioned around responsibility, execution, teamwork, and continuous improvement.'
        ]
      },
      jobs: {
        kind: 'article',
        title: 'Open Positions',
        sourcePageUrl: officialPages.jobs,
        paragraphs: [
          'Public recruitment materials ask applicants to send resumes to hr@hytorist.com with a recent photo, expected salary, and an email subject formatted as “position + name”.',
          'The publicly listed roles include mechanical design and R&D engineers, service and maintenance engineers, and sales engineers or managers.',
          'The role descriptions emphasize mechanical knowledge, CAD and SolidWorks capability, office software, communication skills, and travel adaptability.'
        ]
      },
      staff: {
        kind: 'article',
        title: 'Employee Life',
        sourcePageUrl: officialPages.staff,
        paragraphs: [
          'Public materials keep an employee-life section, but the current page does not provide body content.',
          'The new site keeps the section structure and will publish verified employee or culture materials once they are available.'
        ]
      }
    }
  },
  contact: {
    ...zhSections.contact,
    navLabel: 'Contact',
    menuTitle: 'Contact',
    menu: [
      { id: 'info', label: 'Contact Details' },
      { id: 'message', label: 'Customer Message' }
    ],
    pages: {
      info: {
        kind: 'contact',
        title: 'Contact Details',
        sourcePageUrl: officialPages.contact,
        hero: createHero(
          'en',
          'contact',
          'Contact Service Desk',
          'Multi-channel technical and business contact records for quick response.',
          ['Contact Details', 'Service Desk', 'Quick Response']
        ),
        company: 'Beijing Hytorist Mechanical and Electric Tech Co., Ltd.',
        details: [
          { label: 'Address', value: 'Fengtai District, Beijing, China' },
          { label: 'Email', value: 'info@hytorist.com' },
          { label: 'Phone', value: '+86 10 80803620' },
          { label: 'Fax', value: '+86 10 80803826' },
          { label: 'Hotline', value: '+86 13366668010' }
        ],
        mailboxes: [
          { label: 'Sales', email: 'info@hytorist.com' },
          { label: 'Support', email: 'info@hytorist.com' },
          { label: 'HR', email: 'hr@hytorist.com' },
          { label: 'Complaints', email: 'zhaoxuqiang@hytorist.com' }
        ],
        qrLabel: 'WeChat Account',
        qrImage: officialAssets.wechatQr
      },
      message: {
        kind: 'contact',
        title: 'Customer Message',
        sourcePageUrl: officialPages.message,
        subtitle: 'The site inquiry form consolidates name, phone, email, category, confidentiality preference, and message content into one workflow.',
        company: 'Online Message Entry',
        details: [
          { label: 'Required Fields', value: 'name, phone, email, and message' },
          { label: 'Categories', value: 'product inquiry, technical inquiry, complaints, other topics' },
          { label: 'Privacy Setting', value: 'public or confidential option inside the site inquiry flow' }
        ],
        mailboxes: [
          { label: 'Business', email: 'info@hytorist.com' },
          { label: 'Support', email: 'info@hytorist.com' }
        ],
        qrLabel: 'WeChat Account',
        qrImage: officialAssets.wechatQr,
        ctaLabel: 'Go to Inquiry Form'
      }
    }
  }
}

export const getPortalSections = (locale: Locale): Record<PortalSectionKey, PortalSectionData> => {
  return locale === 'zh' ? zhSections : enSections
}

export const getPrimaryNavigation = (locale: Locale): PrimaryNavItem[] => {
  const sections = getPortalSections(locale)

  if (locale === 'en') {
    return [
      { key: 'home', segment: '', label: 'Home' },
      { key: 'about', segment: sections.about.segment, label: 'About' },
      { key: 'manufacturing', segment: sections.manufacturing.segment, label: 'R&D' },
      { key: 'products', segment: sections.products.segment, label: 'Products' },
      { key: 'engineering', segment: sections.engineering.segment, label: 'Engineering' },
      { key: 'cases', segment: sections.cases.segment, label: 'Applications' },
      { key: 'support', segment: sections.support.segment, label: 'Support' },
      { key: 'news', segment: sections.news.segment, label: 'News' },
      { key: 'hr', segment: sections.hr.segment, label: 'Careers' },
      { key: 'contact', segment: sections.contact.segment, label: 'Contact' }
    ]
  }

  return [
    { key: 'home', segment: '', label: '网站首页' },
    { key: 'about', segment: sections.about.segment, label: sections.about.navLabel },
    { key: 'manufacturing', segment: sections.manufacturing.segment, label: sections.manufacturing.navLabel },
    { key: 'products', segment: sections.products.segment, label: sections.products.navLabel },
    { key: 'engineering', segment: sections.engineering.segment, label: sections.engineering.navLabel },
    { key: 'cases', segment: sections.cases.segment, label: sections.cases.navLabel },
    { key: 'support', segment: sections.support.segment, label: sections.support.navLabel },
    { key: 'news', segment: sections.news.segment, label: sections.news.navLabel },
    { key: 'hr', segment: sections.hr.segment, label: sections.hr.navLabel },
    { key: 'contact', segment: sections.contact.segment, label: sections.contact.navLabel }
  ]
}

