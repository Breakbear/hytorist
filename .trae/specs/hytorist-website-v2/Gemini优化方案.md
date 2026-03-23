# Hytorist 网站优化与 UI 提升方案

基于 `spec.md` 需求文档，针对 **Hytorist (海拓瑞斯)** 液压扳手官网的定制化优化方案。本方案旨在利用 React + Tailwind CSS 技术栈，打造一个兼具**工业专业感**与**现代审美**的企业官网。

---

### 第一部分：UI/UX 视觉升级方案 (Visual Identity)

目标：摆脱传统工业网站的陈旧感，传递“精密、强劲、可信赖”的品牌形象。

#### 1. 配色系统 (Color Palette)
采用 **“深蓝 + 活力橙”** 的经典工业配色，结合大量的留白。
*   **主色 (Primary):** `Slate-900` (#0f172a) 或 `Blue-900`。代表稳重、科技、金属质感。
*   **强调色 (Accent):** `Orange-500` (#f97316)。用于按钮、高亮图标，代表安全、警示、活力（液压工具常见色）。
*   **背景色 (Surface):** `Gray-50` (#f9fafb) 代替纯白，降低视觉疲劳。

#### 2. 关键组件设计 (Component Design)

**A. 英雄区 (Hero Section) - 第一印象**
*   **设计:** 全屏宽背景图（高质量液压扳手作业场景），叠加深色半透明遮罩（`bg-black/60`）。
*   **内容:** 醒目的白色 H1 标题（例如：“工业级液压扭矩解决方案”），配以橙色实心 CTA 按钮（“立即咨询”）。
*   **动效:** 文字轻微上浮淡入 (Fade Up)。

**B. 产品卡片 (Product Cards) - 核心展示**
*   **风格:** 极简卡片，白色背景，微弱边框。
*   **交互:** 
    *   默认状态：`shadow-sm` (轻微阴影)。
    *   悬停状态：`hover:shadow-xl` (浮起效果) + `hover:-translate-y-1` (轻微上移)。
    *   图片区域：保持统一的宽高比（如 4:3），使用 `object-contain` 确保产品完整显示。

**C. 询盘表单 (Inquiry Form) - 转化入口**
*   **布局:** 左右分栏。左侧为联系方式和地图，右侧为表单。
*   **样式:** 输入框移除默认边框，使用底部边框或浅灰色背景 (`bg-gray-100`)，聚焦时显示主色边框 (`focus:ring-2`)。

#### 3. Tailwind 配置建议

```javascript
// tailwind.config.js 建议配置
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0f172a', // Slate 900
        accent: '#f97316',  // Orange 500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // 推荐使用 Inter 字体，显得更现代
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // 必须引入，美化表单
    require('@tailwindcss/typography'), // 用于文章详情页
  ],
}
```

---

### 第二部分：代码与架构优化 (Architecture)

#### 1. 目录结构规范 (React)
建议按照功能模块而非文件类型组织代码，便于维护。
```text
src/
  components/
    common/       # 通用组件 (Button, Input, Card)
    layout/       # 布局组件 (Navbar, Footer)
    sections/     # 页面区块 (Hero, Features, ProductGrid)
  pages/          # 页面入口
  hooks/          # 自定义 Hooks (useInquiry)
  types/          # TypeScript 类型定义
```

#### 2. 响应式策略 (Responsive Strategy)
*   **移动优先 (Mobile First):** 先编写移动端样式，再通过 `md:` 和 `lg:` 覆盖桌面端样式。
*   **导航栏:** 移动端使用汉堡菜单 (Hamburger Menu)，桌面端展开。
*   **表格/列表:** 产品参数表在移动端应转换为卡片视图或支持横向滚动。

---

### 第三部分：检测与验收清单 (Checklist)

#### 1. 视觉细节检查
*   [ ] **一致性:** 所有的按钮圆角 (`rounded`) 是否统一？（建议 `rounded-md` 或 `rounded-lg`）
*   [ ] **留白:** 模块之间是否有足够的间距？（建议 `py-16` 或 `py-24`）
*   [ ] **字体:** 标题是否使用了加粗 (`font-bold`) 且颜色更深？正文颜色是否稍浅 (`text-gray-600`) 以提升阅读体验？

#### 2. 功能与性能
*   [ ] **图片优化:** 产品图片是否使用了 WebP 格式？是否配置了 `loading="lazy"`？
*   [ ] **表单验证:** 提交空表单时，输入框是否变红并显示提示文字？
*   [ ] **SEO:** 首页 Title 是否包含核心关键词（如“液压扳手 - 海拓瑞斯”）？

#### 3. 交互体验
*   [ ] **加载状态:** 提交询盘时，按钮是否显示“提交中...”并禁用？
*   [ ] **反馈:** 提交成功后，是否弹出清晰的 Success Toast 或跳转到感谢页？

---

**总结:** 优化的核心在于**“克制的设计”**与**“细腻的交互”**。通过 Tailwind CSS 我们可以快速建立一套统一的设计语言，使网站看起来既专业又值得信赖。
