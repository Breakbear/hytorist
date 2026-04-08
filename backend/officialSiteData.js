const officialNewsArticles = require('./officialNewsArticles')

const officialSiteData = {
  source: {
    websiteTitle: '北京海拓斯特机电技术有限公司',
    homepageUrl: 'http://www.hytorist.com/',
    mapUrl: 'http://www.hytorist.com/map.asp',
    mailLoginUrl: 'http://mail.hytorist.com'
  },
  brandProfile: {
    brandName: '海拓斯特',
    brandNameEn: 'Hytorist',
    brandTaglineZh: '专业液压工具解决方案',
    brandTaglineEn: 'Hydraulic Torque Tool Solutions',
    serviceDeskZh: '工业服务控制台',
    serviceDeskEn: 'Industrial Service Desk',
    quoteLeadZh:
      '欢迎提交工况、目标扭矩、交付周期和服务范围，我们将由技术或商务团队在一个工作日内安排对接。',
    quoteLeadEn:
      'Share your operating conditions, target torque, delivery schedule, and service scope. Our technical or commercial team will follow up within one business day.',
    sectorItemsZh: ['风电运维', '石化检修', '水电工程', '轨交与非标装备'],
    sectorItemsEn: ['Wind O&M', 'Petrochemical', 'Hydropower Projects', 'Rail and Custom Machinery']
  },
  pageIndex: [
    {
      label: '关于我们',
      url: 'http://www.hytorist.com/about.asp?id=3',
      children: [
        { label: '企业简介', url: 'http://www.hytorist.com/about.asp?id=3' },
        { label: '企业文化', url: 'http://www.hytorist.com/about.asp?id=5' },
        { label: '组织架构', url: 'http://www.hytorist.com/about.asp?id=9' },
        { label: '荣誉资质', url: 'http://www.hytorist.com/about.asp?id=10' }
      ]
    },
    {
      label: '研发制造',
      url: 'http://www.hytorist.com/about.asp?id=6',
      children: [
        { label: '研发能力', url: 'http://www.hytorist.com/about.asp?id=6' },
        { label: '制造能力', url: 'http://www.hytorist.com/about.asp?id=12' },
        { label: '检测手段', url: 'http://www.hytorist.com/about.asp?id=27' }
      ]
    },
    {
      label: '产品中心',
      url: 'http://www.hytorist.com/ProductList.asp?bigclassname=产品中心',
      children: [
        {
          label: '专用液压泵站',
          url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=专用液压泵站'
        },
        {
          label: '螺栓螺母工程',
          url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=螺栓螺母工程'
        },
        {
          label: '顶升平移工程',
          url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=顶升平移工程'
        },
        {
          label: '管道法兰工程',
          url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=管道法兰工程'
        },
        {
          label: '现场机加工程',
          url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=现场机加工程'
        },
        {
          label: '风电运维工程',
          url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=风电运维工程'
        },
        {
          label: '其他类别产品',
          url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=其他类别产品'
        },
        {
          label: '非标机械制造',
          url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=非标机械制造'
        }
      ]
    },
    {
      label: '工程服务',
      url: 'http://www.hytorist.com/about.asp?id=13',
      children: [
        { label: '工程服务', url: 'http://www.hytorist.com/about.asp?id=13' },
        { label: '产品租赁', url: 'http://www.hytorist.com/about.asp?id=14' }
      ]
    },
    {
      label: '技术支持',
      url: 'http://www.hytorist.com/about.asp?id=17',
      children: [
        { label: '售后服务', url: 'http://www.hytorist.com/about.asp?id=17' },
        { label: '技术培训', url: 'http://www.hytorist.com/about.asp?id=18' },
        { label: '产品试用', url: 'http://www.hytorist.com/about.asp?id=19' },
        { label: '下载中心', url: 'http://www.hytorist.com/about.asp?id=20' }
      ]
    },
    {
      label: '应用案例',
      url: 'http://www.hytorist.com/CaseList.asp?bigclassname=应用案例',
      children: [
        {
          label: '螺栓螺母工程',
          url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=螺栓螺母工程'
        },
        {
          label: '顶升平移工程',
          url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=顶升平移工程'
        },
        {
          label: '管道法兰工程',
          url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=管道法兰工程'
        },
        {
          label: '现场机加工程',
          url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=现场机加工程'
        },
        {
          label: '风电运维工程',
          url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=风电运维工程'
        },
        {
          label: '节能环保工程',
          url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=节能环保工程'
        },
        {
          label: '其它类别产品',
          url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=其它类别产品'
        },
        {
          label: '非标机械制造',
          url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=非标机械制造'
        },
        {
          label: '我们的用户',
          url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=我们的用户'
        }
      ]
    },
    {
      label: '新闻中心',
      url: 'http://www.hytorist.com/NewsList.asp?bigclassname=公司新闻',
      children: [
        { label: '公司新闻', url: 'http://www.hytorist.com/NewsList.Asp?BigClassName=公司新闻' },
        { label: '行业新闻', url: 'http://www.hytorist.com/NewsList.Asp?BigClassName=行业新闻' },
        { label: '信息公示', url: 'http://www.hytorist.com/NewsList.Asp?BigClassName=信息公示' }
      ]
    },
    {
      label: '人力资源',
      url: 'http://www.hytorist.com/about.asp?id=16',
      children: [
        { label: '人才战略', url: 'http://www.hytorist.com/about.asp?id=16' },
        { label: '招聘职位', url: 'http://www.hytorist.com/about.asp?id=21' },
        { label: '员工天地', url: 'http://www.hytorist.com/about.asp?id=22' }
      ]
    },
    {
      label: '联系我们',
      url: 'http://www.hytorist.com/about.asp?id=2',
      children: [
        { label: '联系方式', url: 'http://www.hytorist.com/about.asp?id=2' },
        { label: '客户留言', url: 'http://www.hytorist.com/about.asp?id=4' }
      ]
    }
  ],
  productCategories: [
    {
      key: 'pump',
      label: '专用液压泵站',
      labelEn: 'Hydraulic Power Units',
      url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=专用液压泵站',
      publicItemCount: 0,
      summary: '面向液压动力供给、现场供压与多工具联动作业的动力站方向。',
      summaryEn: 'Power-unit direction for hydraulic supply, field pressure support, and multi-tool operation.'
    },
    {
      key: 'bolting',
      label: '螺栓螺母工程',
      labelEn: 'Bolting Engineering',
      url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=螺栓螺母工程',
      publicItemCount: 0,
      summary: '对应风机锁紧盘、多螺栓同步拧紧与检维修工况的液压紧固方向。',
      summaryEn:
        'Hydraulic bolting direction for wind locking discs, multi-bolt synchronous tightening, and maintenance scenarios.'
    },
    {
      key: 'lifting',
      label: '顶升平移工程',
      labelEn: 'Lifting and Positioning Engineering',
      url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=顶升平移工程',
      publicItemCount: 0,
      summary: '对应设备顶升、同步平移与姿态调整工况的液压执行方向。',
      summaryEn:
        'Hydraulic actuation direction for equipment lifting, synchronous translation, and attitude adjustment.'
    },
    {
      key: 'pipeline',
      label: '管道法兰工程',
      labelEn: 'Pipeline and Flange Engineering',
      url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=管道法兰工程',
      publicItemCount: 0,
      summary: '对应管道维护、法兰加工与阀门检修工况的现场设备方向。',
      summaryEn:
        'Field-equipment direction for pipeline maintenance, flange machining, and valve-service scenarios.'
    },
    {
      key: 'machining',
      label: '现场机加工程',
      labelEn: 'On-site Machining Engineering',
      url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=现场机加工程',
      publicItemCount: 0,
      summary: '对应现场镗孔、铣削与修复加工工况的便携式机加设备方向。',
      summaryEn:
        'Portable machining direction for field boring, milling, and repair-machining scenarios.'
    },
    {
      key: 'wind',
      label: '风电运维工程',
      labelEn: 'Wind O&M Engineering',
      url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=风电运维工程',
      publicItemCount: 0,
      summary: '对应风机检修、换油与维护保障工况的风电运维设备方向。',
      summaryEn:
        'Wind O&M equipment direction for turbine maintenance, oil-changing, and service-support scenarios.'
    },
    {
      key: 'other',
      label: '其他类别产品',
      labelEn: 'Other Product Categories',
      url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=其他类别产品',
      publicItemCount: 0,
      summary: '承接跨类别设备、成套配套与组合方案的综合入口。',
      summaryEn:
        'Composite intake for cross-category equipment, packaged support, and combined delivery solutions.'
    },
    {
      key: 'custom',
      label: '非标机械制造',
      labelEn: 'Custom Machinery Manufacturing',
      url: 'http://www.hytorist.com/ProductList.Asp?BigClassName=产品中心&SmallClassName=非标机械制造',
      publicItemCount: 0,
      summary: '涵盖非标机械、自动化装备与定制化集成方案的研发制造方向。',
      summaryEn:
        'R&D and manufacturing direction for non-standard machinery, automation equipment, and custom integrated solutions.'
    }
  ],
  caseCategories: [
    {
      key: 'bolting',
      label: '螺栓螺母工程',
      labelEn: 'Bolting Engineering',
      url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=螺栓螺母工程',
      publicItemCount: 0,
      summary: '应用入口围绕风机锁紧盘、多螺栓同步拧紧与检维修工况组织。',
      summaryEn:
        'Application entry organized around wind locking discs, multi-bolt synchronous tightening, and maintenance scenarios.'
    },
    {
      key: 'lifting',
      label: '顶升平移工程',
      labelEn: 'Lifting and Positioning Engineering',
      url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=顶升平移工程',
      publicItemCount: 0,
      summary: '应用入口围绕设备顶升、同步平移与安装调整工况组织。',
      summaryEn:
        'Application entry organized around equipment lifting, synchronous translation, and installation-adjustment scenarios.'
    },
    {
      key: 'pipeline',
      label: '管道法兰工程',
      labelEn: 'Pipeline and Flange Engineering',
      url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=管道法兰工程',
      publicItemCount: 0,
      summary: '应用入口围绕管道维护、法兰加工与阀门检修工况组织。',
      summaryEn:
        'Application entry organized around pipeline maintenance, flange machining, and valve-service scenarios.'
    },
    {
      key: 'machining',
      label: '现场机加工程',
      labelEn: 'On-site Machining Engineering',
      url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=现场机加工程',
      publicItemCount: 0,
      summary: '应用入口围绕现场镗孔、铣削与修复加工工况组织。',
      summaryEn:
        'Application entry organized around field boring, milling, and repair-machining scenarios.'
    },
    {
      key: 'wind',
      label: '风电运维工程',
      labelEn: 'Wind O&M Engineering',
      url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=风电运维工程',
      publicItemCount: 0,
      summary: '应用入口围绕风机安装检修、换油与维护保障工况组织。',
      summaryEn:
        'Application entry organized around turbine installation, maintenance, oil-changing, and service-support scenarios.'
    },
    {
      key: 'energy',
      label: '节能环保工程',
      labelEn: 'Energy Saving and Environmental Engineering',
      url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=节能环保工程',
      publicItemCount: 0,
      summary: '应用入口围绕节能环保装备、数字化场景与工程实施工况组织。',
      summaryEn:
        'Application entry organized around energy-saving equipment, digital-scene, and environmental engineering scenarios.'
    },
    {
      key: 'other',
      label: '其它类别产品',
      labelEn: 'Other Categories',
      url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=其它类别产品',
      publicItemCount: 0,
      summary: '应用入口围绕跨类别项目、组合型设备与集成场景组织。',
      summaryEn:
        'Application entry organized around mixed-category projects, combined equipment, and integrated scenarios.'
    },
    {
      key: 'custom',
      label: '非标机械制造',
      labelEn: 'Custom Machinery Manufacturing',
      url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=非标机械制造',
      publicItemCount: 0,
      summary: '应用入口围绕非标装备设计、制造与系统集成工况组织。',
      summaryEn:
        'Application entry organized around custom-equipment design, manufacturing, and integration scenarios.'
    },
    {
      key: 'users',
      label: '我们的用户',
      labelEn: 'Our Users',
      url: 'http://www.hytorist.com/CaseList.Asp?BigClassName=应用案例&SmallClassName=我们的用户',
      publicItemCount: 0,
      summary: '仅保留用户行业与合作场景入口，不展示未公开客户名称。',
      summaryEn:
        'Only the industry and cooperation entry is kept here, without exposing unpublished customer names.'
    }
  ],
  newsCategories: [
    {
      key: 'company',
      label: '公司新闻',
      url: 'http://www.hytorist.com/NewsList.Asp?BigClassName=公司新闻',
      publicItemCount: 8
    },
    {
      key: 'industry',
      label: '行业新闻',
      url: 'http://www.hytorist.com/NewsList.Asp?BigClassName=行业新闻',
      publicItemCount: 0
    },
    {
      key: 'notice',
      label: '信息公示',
      url: 'http://www.hytorist.com/NewsList.Asp?BigClassName=信息公示',
      publicItemCount: 0
    }
  ],
  newsPages: {
    company: {
      publicItemCount: 8,
      items: [
        {
          id: 80,
          pageId: 'article-80',
          title: '海拓斯特数字化场景案例入选2022年国家制造业质量管理数字化典型案例',
          date: '2023-2-23'
        },
        {
          id: 79,
          pageId: 'article-79',
          title: '兆瓦级风电锁紧盘螺栓多同步拧紧工艺及智能化拧紧机的研究',
          date: '2021-6-11'
        },
        {
          id: 77,
          pageId: 'article-77',
          title: '关于我公司延期复工的通知',
          date: '2020-2-9'
        },
        {
          id: 76,
          pageId: 'article-76',
          title: '我公司近日获得了多项风电拧紧机专利证书',
          date: '2017-3-6'
        },
        {
          id: 75,
          pageId: 'article-75',
          title: '我公司成功取得国家商标局商标注册证书',
          date: '2017-3-6'
        },
        {
          id: 69,
          pageId: 'article-69',
          title: '关于粗齿液压扳手与细齿液压扳手的优缺点对比',
          date: '2015-7-25'
        },
        {
          id: 61,
          pageId: 'article-61',
          title: '润滑油工程车在风电的应用',
          date: '2015-7-9'
        },
        {
          id: 59,
          pageId: 'article-59',
          title: '我公司顺利通过ISO9000质量体系认证',
          date: '2015-7-6'
        }
      ]
    },
    industry: {
      publicItemCount: 0,
      items: []
    },
    notice: {
      publicItemCount: 0,
      items: []
    }
  },
  newsArticles: officialNewsArticles,
  verifiedPages: {
    companyProfile: {
      title: '企业简介',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=3',
      summary:
        '聚焦工业装配与工业检修场景，覆盖多行业应用，并配套质量体系、实验测试、售后支持与工程租赁能力。',
      summaryEn:
        'Focused on industrial assembly and maintenance, the company supports multiple industries with quality systems, testing capability, after-sales support, and engineering rental services.'
    },
    culture: {
      title: '企业文化',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=5',
      summary:
        '坚持服务第一、诚信为本与持续创新，以用户价值、团队协作和长期发展为核心。',
      summaryEn:
        'Its culture emphasizes service, integrity, continuous innovation, customer value, teamwork, and long-term growth.'
    },
    manufacturing: {
      title: '制造能力',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=12',
      summary:
        '具备非标机械配件与 OEM 配套加工能力，配套约 1000 平方米协同生产场地和 50 余台套加工设备。',
      summaryEn:
        'Manufacturing capability includes non-standard mechanical parts, OEM-oriented production, roughly 1,000 square meters of coordinated production area, and more than 50 sets of machining equipment.'
    },
    testing: {
      title: '检测手段',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=27',
      summary:
        '配备实验测试室、扭力试验仪、液压拉伸试验台、压力标定仪等设备，用于关键参数验证与现场适配性测试。',
      summaryEn:
        'Testing capability includes a laboratory, torque testers, hydraulic tensile benches, pressure calibration rigs, and flange-processing equipment for validation work.'
    },
    engineeringService: {
      title: '工程服务',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=13',
      summary:
        '工程服务团队具备现场检维修能力，提供标准化服务流程与可定制解决方案。',
      summaryEn:
        'The engineering service team provides on-site maintenance capability, standardized service workflows, and customizable solutions.'
    },
    rentalService: {
      title: '产品租赁',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=14',
      summary:
        '提供螺栓、顶升平移、管道法兰、现场机加和风电运维等方向的设备租赁与项目支持。',
      summaryEn:
        'Rental services cover bolting, lifting and positioning, pipeline and flange work, on-site machining, and wind-power maintenance.'
    },
    afterSales: {
      title: '售后服务',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=17',
      summary:
        '提供 1 年质保、2 小时响应、24 小时到场及替代产品等售后服务支持。',
      summaryEn:
        'After-sales support includes a one-year warranty, 2-hour response, 24-hour on-site service, and replacement-product commitments.'
    },
    training: {
      title: '技术培训',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=18',
      summary:
        '提供理论培训、操作培训、维保培训及培训考核与证书发放服务。',
      summaryEn:
        'Training services include theory, operation, and maintenance modules together with assessment and certificate issuance.'
    },
    jobs: {
      title: '招聘职位',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=21',
      summary:
        '开放机械设计研发、技术服务维修、销售工程等岗位，并提供明确的简历投递方式。',
      summaryEn:
        'Recruitment includes roles in mechanical design and R&D, service and maintenance, and sales together with clear resume-submission instructions.'
    },
    contactInfo: {
      title: '联系方式',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=2',
      summary:
        '提供北京市丰台区地址、电话传真、主邮箱、24 小时热线和微信公众号等联络方式。',
      summaryEn:
        'Contact details include the Fengtai District address in Beijing, phone and fax, main mailbox, 24-hour hotline, and WeChat access.'
    },
    messagePage: {
      title: '客户留言',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=4',
      summary:
        '新版站点已将留言需求整合到统一询盘流程，便于提交姓名、电话、邮箱与需求类别等信息。',
      summaryEn:
        'The new site merges customer messages into one inquiry flow for submitting name, phone, email, and requirement category.'
    }
  },
  contacts: {
    company: '北京海拓斯特机电技术有限公司',
    address: '北京市丰台区晓月五里6号楼301-6',
    postcode: '100165',
    phone: '+86 10 80803620',
    fax: '+86 10 80803826',
    email: 'info@hytorist.com',
    website: 'www.hytorist.com',
    hotline: '+86 13366668010',
    mailboxes: [
      { label: '产品咨询', labelEn: 'Product Inquiry', email: 'info@hytorist.com' },
      { label: '技术支持', labelEn: 'Technical Support', email: 'info@hytorist.com' },
      { label: '人力资源', labelEn: 'Human Resources', email: 'hr@hytorist.com' },
      { label: '投诉与建议', labelEn: 'Complaints and Suggestions', email: 'zhaoxuqiang@hytorist.com' }
    ]
  },
  messageForm: {
    sourcePageUrl: 'http://www.hytorist.com/about.asp?id=4',
    requiredFields: ['name', 'phone', 'email', 'message'],
    categoryOptions: [
      { value: 'product', labelZh: '产品咨询', labelEn: 'Product Inquiry' },
      { value: 'technical', labelZh: '技术咨询', labelEn: 'Technical Inquiry' },
      { value: 'complaint', labelZh: '投诉与建议', labelEn: 'Complaints and Suggestions' },
      { value: 'other', labelZh: '其他事项', labelEn: 'Other Topics' }
    ],
    privacyOptions: [
      { value: 'public', labelZh: '公开', labelEn: 'Public' },
      { value: 'confidential', labelZh: '保密', labelEn: 'Confidential' }
    ],
    noteZh: '询盘表单包含问题类别与公开/保密选项，便于项目沟通统一处理。',
    noteEn:
      'The inquiry form includes question categories together with public/confidential options so the site can handle project communication in one flow.'
  },
  uiNarratives: {
    home: {
      sitePathLeadZh: '从查看能力到发起项目对接，用一条站内路径完成。',
      sitePathLeadEn: 'Move from capability review to project intake in one on-site flow.',
      sitePathHintZh: '设备目录、应用入口和需求提交在同一条链路内完成。',
      sitePathHintEn: 'Equipment review, application entry, and requirement submission stay in one flow.',
      resourceLeadZh: '围绕项目沟通、服务资质与能力信息统一整理。',
      resourceLeadEn: 'Project intake, service credentials, and capability notes organized in one place.',
      resourceHintZh: '这组内容用于帮助访客快速理解沟通方式、资质说明和服务摘要。',
      resourceHintEn: 'This block helps visitors understand contact flow, qualification notes, and service highlights.'
    },
    portal: {
      referenceNoteZh: '栏目内容围绕业务能力、服务范围和沟通重点展开，便于快速了解当前方向。',
      referenceNoteEn:
        'Section content focuses on capability, service scope, and communication priorities for quick understanding.',
      communicationNoteZh: '如需资质文件、服务说明或更细的项目资料，建议通过站内询盘和联系入口统一沟通。',
      communicationNoteEn:
        'If you need qualification files, service notes, or more detailed project material, use the site inquiry and contact flow directly.',
      asideLeadZh: '从当前栏目继续查看相关内容，或直接进入需求与联系。',
      asideLeadEn: 'Continue within this section or move directly into inquiry and contact.',
      sectionSummaryTitleZh: '栏目资料摘要',
      sectionSummaryTitleEn: 'Section Summary',
      sectionSummaryLeadZh: '栏目重点与沟通说明统一收口。',
      sectionSummaryLeadEn: 'Section notes and communication points organized in one place.'
    },
    inquiry: {
      heroLeadZh: '提交工况、交付时间与服务范围后，站内统一进入技术或商务对接流程。',
      heroLeadEn:
        'After you submit operating conditions, timing, and service scope, the site routes your request into technical or commercial follow-up.',
      formLeadZh: '建议优先填写工况、时间与服务范围，便于快速分流。',
      formLeadEn: 'Share operating condition, timing, and scope first so the team can route the request quickly.',
      resourceLeadZh: '询盘页保留新站自己的沟通说明与资料摘要。',
      resourceLeadEn: 'The inquiry page keeps the new site’s own contact notes and material summary.',
      messageNoteZh: '当前询盘流程保留问题类别和公开/保密设置，便于统一沟通。',
      messageNoteEn:
        'The current inquiry flow keeps message categories together with public/confidential settings for consistent coordination.',
      coverageNoteZh: '联系方式、热线和资质信息可按项目需要提供与说明。',
      coverageNoteEn:
        'Contact channels, hotline, and qualification information can be provided according to project needs.'
    },
    footer: {
      statementZh:
        '本网站聚焦新站自己的业务展示与项目沟通，能力、服务和联系方式以当前页面内容与站内对接信息为准。',
      statementEn:
        'This website focuses on its own business presentation and project communication. Capability, service, and contact information are defined by the current site content and on-site contact flow.',
      coverageZh: '当前站点重点覆盖风电运维、石化检修、水电工程、轨交与非标装备等工程方向，统一通过站内入口进行项目对接。',
      coverageEn:
        'Current coverage focuses on wind O&M, petrochemical maintenance, hydropower projects, and rail/custom machinery directions with project coordination handled through on-site entry points.'
    }
  },
  certificates: [
    {
      title: '质量体系认证证书',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=10',
      imageUrl: 'http://hytorist.com/UploadFiles/201578185652222.jpg'
    }
  ],
  contactAssets: {
    wechatQrTitle: '微信公众号',
    wechatQrImageUrl: 'http://www.hytorist.com/UploadFiles/20202182394680.png'
  },
  friendLinks: [
    { label: '国家能源集团公司', url: 'https://www.ceic.com/' },
    { label: '中国华能集团公司', url: 'https://www.chng.com.cn/' },
    { label: '国家电力投资电集团公司', url: 'http://www.spic.com.cn/' },
    { label: '中国大唐集团公司', url: 'http://www.china-cdt.com/' },
    { label: '中国华电集团公司', url: 'http://www.chd.com.cn/' },
    { label: '国投电力控股股份有限公司', url: 'http://www.sdicpower.com' },
    { label: '国华电力有限责任公司', url: 'http://www.ghepc.com' },
    { label: '华润电力控股有限公司', url: 'http://www.cr-power.com' },
    { label: '中国广核集团', url: 'http://www.cgnpc.com.cn' },
    { label: '中国石油天然气集团公司', url: 'http://www.cnpc.com.cn' },
    { label: '中国石化集团公司', url: 'http://www.sinopecgroup.com' },
    { label: '中国海洋石油总公司', url: 'http://www.cnooc.com.cn' },
    { label: '中国铁路总公司', url: 'http://www.china-railway.com.cn' },
    { label: '中国核工业集团公司', url: 'http://www.cnnc.com.cn' },
    { label: '中国兵器工业集团公司', url: 'http://www.norincogroup.com.cn' },
    { label: '中国船舶重工集团公司', url: 'http://www.csic.com.cn' }
  ]
}

module.exports = officialSiteData
