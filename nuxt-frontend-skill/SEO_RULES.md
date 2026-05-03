# 🔍 SEO + AEO 規範（SEO_RULES）

> 從真實 nuxt.config.ts 分析產出 ｜ 最後更新：2026-04

---

## 🎯 核心原則

| 目標 | 技術 |
|------|------|
| **SEO**（Search Engine Optimization） | useHead / useSeoMeta / 語意化 HTML / Schema.org |
| **AEO**（Answer Engine Optimization） | 結構化內容 / FAQ / 清晰 H1~H3 標題層次 |
| **SMO**（Social Media Optimization） | OG Tags / Twitter Card |

---

## 📋 nuxt.config.ts 全域 SEO 設定（固定範式）

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,  // ⭐ 必須開啟 SSR，爬蟲才能讀到完整 HTML

  modules: [
    "@pinia/nuxt",
    "@nuxtjs/sitemap",    // 自動產生 sitemap.xml
    "@nuxtjs/robots",     // 管理 robots.txt
    "nuxt-schema-org",    // Schema.org 結構化資料
  ],

  app: {
    head: {
      htmlAttrs: { lang: "zh-TW" },          // ⭐ Google 語言判斷依據
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",

      title: "網站名稱",
      titleTemplate: "%s | 網站名稱",        // ⭐ 每頁標題格式

      meta: [
        // ── 基本 ──
        { name: "description", content: "全站預設描述（150字內）" },

        // ── Open Graph（Facebook / LINE 分享預覽）──
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "網站名稱" },
        { property: "og:title", content: "網站名稱 — 副標題" },
        { property: "og:description", content: "描述（150字內）" },
        { property: "og:image", content: "https://example.com/og-image.jpg" },
        { property: "og:url", content: "https://example.com" },

        // ── Twitter Card ──
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "網站名稱" },
        { name: "twitter:description", content: "描述" },
        { name: "twitter:image", content: "https://example.com/og-image.jpg" },
      ],

      link: [
        // ── Canonical（防重複內容）──
        { rel: "canonical", href: "https://example.com" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
    },
  },
})
```

---

## 📄 頁面層級 SEO（useHead / useSeoMeta）

### 方式一：useHead（本專案標準）

```ts
// 在每個 page 的 <script setup> 最前面
useHead({
  title: '頁面標題',           // titleTemplate 會自動加上 " | 網站名稱"
  meta: [
    { name: 'description', content: '頁面描述，150字以內，包含主要關鍵字' },
    { name: 'keywords', content: '關鍵字1, 關鍵字2, 關鍵字3' },
    // ── 頁面專屬 OG ──
    { property: 'og:title', content: '頁面標題 | 網站名稱' },
    { property: 'og:description', content: '頁面描述' },
    { property: 'og:url', content: 'https://example.com/page' },
  ],
  link: [
    { rel: 'canonical', href: 'https://example.com/page' },
  ],
})
```

### 方式二：useSeoMeta（Nuxt 3/4 推薦簡寫）

```ts
useSeoMeta({
  title: '頁面標題',
  description: '頁面描述',
  keywords: '關鍵字1, 關鍵字2',
  ogTitle: '頁面標題',
  ogDescription: '頁面描述',
  ogImage: 'https://example.com/og-image.jpg',
  ogUrl: 'https://example.com/page',
  twitterCard: 'summary_large_image',
})
```

---

## 🏗️ 語意化 HTML 結構（強制）

### 公開頁面結構

```html
<!-- ✅ 正確 -->
<div class="page-name">

  <!-- 主視覺 Hero -->
  <section class="hero" aria-label="主視覺">
    <div class="hero-content">
      <p class="hero-eyebrow">副標籤文字</p>
      <h1>主標題（每頁只能有一個 H1）</h1>
      <p>描述段落</p>
    </div>
  </section>

  <!-- 功能區塊 -->
  <section class="features" id="features" aria-labelledby="features-title">
    <header class="section-header">
      <h2 id="features-title">區塊標題</h2>
      <p>區塊描述</p>
    </header>

    <ul class="features-grid" role="list">
      <li class="feature-item">
        <article>
          <h3>功能名稱</h3>
          <p>功能描述</p>
        </article>
      </li>
    </ul>
  </section>

  <!-- FAQ 區塊 -->
  <section class="faq" aria-label="常見問題">
    <h2>常見問題</h2>
    <details>
      <summary>問題一</summary>
      <p>答案一</p>
    </details>
    <details>
      <summary>問題二</summary>
      <p>答案二</p>
    </details>
  </section>

</div>
```

### 禁止寫法

```html
<!-- ❌ 所有內容都用 div 包，沒有語意 -->
<div class="section">
  <div class="header">
    <div class="title">標題</div>
  </div>
</div>
```

---

## 📐 標題層次規範（H1 ~ H3）

| 標籤 | 用途 | 每頁數量 |
|------|------|----------|
| `<h1>` | 頁面主題（與 title 相符） | **只能 1 個** |
| `<h2>` | 主要區塊標題 | 多個（每個 section） |
| `<h3>` | 子項目標題（列表、卡片） | 多個 |

```html
<!-- ✅ 正確的層次 -->
<h1>智慧電子喜帖平台</h1>

  <h2>核心功能</h2>
    <h3>電子喜帖</h3>
    <h3>RSVP 回覆</h3>

  <h2>價格方案</h2>
    <h3>基本方案</h3>
    <h3>進階方案</h3>

<!-- ❌ 跳層（H1 → H3）-->
<h1>標題</h1>
<h3>子標題</h3>  <!-- 跳過 H2，錯誤！ -->
```

---

## 🤖 AEO（AI 引擎優化）規範

AEO 讓 AI 搜尋引擎（ChatGPT、Perplexity、Google AI Overview）能理解並引用你的內容。

### 1. 結構化問答（FAQ）

```html
<section class="faq" itemscope itemtype="https://schema.org/FAQPage">
  <h2>常見問題</h2>

  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">電子喜帖是什麼？</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">
        電子喜帖是數位化的婚禮邀請函，透過手機或電腦傳送給賓客，
        包含婚禮資訊、RSVP 回覆功能，環保又便利。
      </p>
    </div>
  </div>
</section>
```

### 2. 清晰的定義性段落

```html
<!-- ✅ AEO 友善：直接給出定義 -->
<section>
  <h2>什麼是 RSVP 系統？</h2>
  <p>
    RSVP（Répondez s'il vous plaît）系統是讓賓客線上確認出席婚禮的功能。
    賓客只需點擊連結、填寫姓名與人數，新人即可即時掌握出席狀況，
    無需逐一電話確認。
  </p>
</section>
```

### 3. 列表結構（方便 AI 抓取）

```html
<section>
  <h2>平台主要功能</h2>
  <ul>
    <li><strong>電子喜帖</strong>：客製化婚禮邀請頁面，含照片與婚禮資訊</li>
    <li><strong>RSVP 回覆</strong>：線上出席確認，自動統計人數</li>
    <li><strong>QR Code 報到</strong>：婚禮當天掃碼報到，快速高效</li>
    <li><strong>桌位查詢</strong>：賓客自助查詢座位安排</li>
  </ul>
</section>
```

---

## 🗺️ Schema.org 結構化資料

使用 `nuxt-schema-org` 模組在頁面加入 JSON-LD：

```ts
// pages/index.vue
useSchemaOrg([
  defineWebSite({
    name: '網站名稱',
    url: 'https://example.com',
    description: '網站描述',
    inLanguage: 'zh-TW',
  }),
  defineOrganization({
    name: '公司名稱',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
  }),
])
```

---

## ✅ SEO 自我檢查清單

每個 Page 必須確認：

- [ ] `useHead()` 或 `useSeoMeta()` 已設定？
- [ ] `title` 包含主要關鍵字（≤60 字）？
- [ ] `description` 自然包含關鍵字（≤150 字）？
- [ ] 頁面有且只有一個 `<h1>`？
- [ ] `<h2>` / `<h3>` 層次正確（不跳層）？
- [ ] 重要區塊有 `id`（方便 anchor link）？
- [ ] 圖片有 `alt` 屬性（描述圖片內容）？
- [ ] 有 canonical link？
- [ ] OG meta 已設定（社群分享預覽）？
- [ ] 如有 FAQ 內容，是否用 `<details><summary>` 或 Schema 標記？
