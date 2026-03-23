const officialNewsArticles = require('./officialNewsArticles')

const officialSiteData = {
  source: {
    websiteTitle: '北京海拓斯特机电技术有限公司',
    homepageUrl: 'http://www.hytorist.com/',
    mapUrl: 'http://www.hytorist.com/map.asp',
    mailLoginUrl: 'http://mail.hytorist.com'
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
        '已公开企业资料明确了工业装配与工业检修方案、服务行业范围、ISO9001 认证、专利证书、实验室、售后服务和工程租赁等核心信息。',
      summaryEn:
        'Public company materials confirm industrial assembly and maintenance solutions, served industries, ISO9001 certification, patent records, laboratory capability, after-sales support, and engineering rental directions.'
    },
    culture: {
      title: '企业文化',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=5',
      summary:
        '已公开企业文化资料展示了管理理念、经营理念、发展理念、服务理念和人才理念，强调服务第一、诚信为本与持续创新。',
      summaryEn:
        'Public culture materials cover management values, business principles, development philosophy, service philosophy, and talent philosophy with emphasis on service, integrity, and continuous innovation.'
    },
    manufacturing: {
      title: '制造能力',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=12',
      summary:
        '已公开制造资料展示了非标机械配件、OEM 定向加工、约 1000 平方米协同生产场地和 50 余台套加工设备等核心制造条件。',
      summaryEn:
        'Public manufacturing materials describe non-standard mechanical parts, OEM-oriented production, roughly 1,000 square meters of coordinated production area, and more than 50 sets of machining equipment.'
    },
    testing: {
      title: '检测手段',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=27',
      summary:
        '已公开检测资料展示了实验测试室、扭力试验仪、液压拉伸试验台、压力标定仪和法兰管道加工试验台等检测与验证设备。',
      summaryEn:
        'Public testing materials list a laboratory, torque testers, hydraulic tensile benches, pressure calibration rigs, and flange-processing test equipment for verification work.'
    },
    engineeringService: {
      title: '工程服务',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=13',
      summary:
        '已公开工程服务资料强调工程服务部、现场检维修能力、标准化服务流程与可定制解决方案。',
      summaryEn:
        'Public engineering-service materials emphasize the field-service department, on-site repair capability, standardized workflows, and customizable solutions.'
    },
    rentalService: {
      title: '产品租赁',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=14',
      summary:
        '已公开产品租赁资料展示了螺栓、顶升平移、管道法兰、现场机加和风电运维等租赁方向。',
      summaryEn:
        'Public rental materials list bolting, lifting and positioning, pipeline and flange service, on-site machining, and wind-power maintenance as rental directions.'
    },
    afterSales: {
      title: '售后服务',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=17',
      summary:
        '已公开售后服务资料展示了 1 年质保、2 小时响应、24 小时到场和替代产品等服务承诺。',
      summaryEn:
        'Public after-sales materials state a one-year warranty together with 2-hour response, 24-hour on-site service, and replacement-product commitments.'
    },
    training: {
      title: '技术培训',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=18',
      summary:
        '已公开技术培训资料展示了理论培训、操作培训、维保培训以及培训考核与证书发放机制。',
      summaryEn:
        'Public training materials describe theory, operation, and maintenance training together with assessment and certificate issuance.'
    },
    jobs: {
      title: '招聘职位',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=21',
      summary:
        '已公开招聘资料展示了机械设计/研发、技术服务/维修、销售工程师/经理等岗位及简历投递方式。',
      summaryEn:
        'Public recruitment materials list positions in mechanical design and R&D, service and maintenance, and sales, together with resume submission instructions.'
    },
    contactInfo: {
      title: '联系方式',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=2',
      summary:
        '已公开联系资料展示了北京市丰台区地址、电话传真、主邮箱、24 小时热线和微信公众号等联络信息。',
      summaryEn:
        'Public contact materials provide the Fengtai District address in Beijing, phone and fax, main mailbox, 24-hour hotline, and WeChat contact details.'
    },
    messagePage: {
      title: '客户留言',
      sourcePageUrl: 'http://www.hytorist.com/about.asp?id=4',
      summary:
        '已公开留言资料展示了姓名、电话、邮箱、问题类别以及公开或保密选项等字段，现已并入新版站点统一询盘流程。',
      summaryEn:
        'Public message materials list fields such as name, phone, email, category, and public or confidential settings, which are now merged into the new-site inquiry flow.'
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
