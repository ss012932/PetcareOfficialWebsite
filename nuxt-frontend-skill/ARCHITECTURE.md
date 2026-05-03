# 🏗️ Nuxt 專案架構規範（ARCHITECTURE）

> 從真實專案分析產出 ｜ 最後更新：2026-04

---

## 📂 完整目錄結構

```
專案根目錄/
├── nuxt.config.ts          # Nuxt 全域設定（SSR/模組/head/CSS）
├── tsconfig.json           # TypeScript 設定
├── package.json
│
├── public/                 # 靜態資源（直接對應網址根目錄）
│   └── favicon.ico
│
└── app/                    # ⭐ Nuxt 4 應用程式主目錄
    ├── app.vue             # 全域入口（<NuxtLayout><NuxtPage /></NuxtLayout>）
    │
    ├── assets/             # 需 bundler 處理的資源
    │   ├── css/
    │   │   └── main.css    # 全域 CSS（在 nuxt.config.ts 引入）
    │   └── image/          # 頁面使用的圖片（用 @/assets/image/ 引用）
    │
    ├── components/         # 可重用元件（PascalCase 命名）
    │   ├── AppHeader.vue   # 網站共用 Header
    │   ├── AppFooter.vue   # 網站共用 Footer
    │   ├── AppSidebar.vue  # 管理後台側邊欄
    │   ├── LoginModal.vue  # 登入 Modal（Teleport + Transition）
    │   └── [功能]Modal.vue # 其他功能 Modal
    │
    ├── composables/        # 可重用邏輯層
    │   ├── useXxx.ts       # 業務邏輯 composable（useXxx 命名）
    │   ├── xxxStore.ts     # Pinia store（defineStore）
    │   └── utils/          # 工具函式
    │       ├── api.ts      # ⭐ axios 封裝（所有 API 呼叫入口）
    │       └── alert.ts    # SweetAlert2 封裝
    │
    ├── layouts/            # 版面骨架
    │   ├── default.vue     # 公開頁面（Header + main + Footer）
    │   └── admin.vue       # 管理後台（Sidebar + main）
    │
    ├── middleware/         # 路由守衛
    │   ├── auth.global.ts      # 全域認證守衛（.global = 自動套用所有路由）
    │   └── admin-purchase.ts   # 手動套用：管理後台各頁功能權限檢查
    │
    ├── pages/              # 路由頁面（自動對應 URL）
    │   ├── index.vue       # → /
    │   ├── features.vue    # → /features
    │   ├── price.vue       # → /price
    │   ├── reset.vue       # → /reset
    │   ├── checkinvite.vue # → /checkinvite
    │   ├── admin/          # → /admin/*
    │   │   ├── dashboard.vue
    │   │   └── [功能].vue
    │   └── order/          # → /order/*
    │       ├── index.vue
    │       └── result.vue
    │
    └── plugins/            # Nuxt 插件
        └── fontawesome.js  # Font Awesome 全域註冊
```

---

## 🧱 app.vue 骨架（固定寫法）

```vue
<!-- 全域應用入口層 -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* Google Fonts 在此匯入 */
@import url('https://fonts.googleapis.com/css2?...');

/* CSS Reset */
html, body, #__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
```

---

## 📐 layouts/default.vue 骨架

```vue
<template>
  <div class="layout-root">
    <AppHeader v-if="!route.meta.hideHeader" />
    <main class="page-container">
      <slot />
    </main>
    <AppFooter v-if="!route.meta.hideFooter" />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "~/components/AppHeader.vue";
import AppFooter from "~/components/AppFooter.vue";
const route = useRoute();
</script>

<style scoped>
.layout-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.page-container {
  flex: 1;
  position: relative;
}
</style>
```

---

## 📐 layouts/admin.vue 骨架

```vue
<script setup>
import AppSidebar from "@/components/AppSidebar.vue";
</script>

<template>
  <div class="admin-layout">
    <AppSidebar />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.content {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
  height: 100vh;
}
@media (max-width: 1730px) {
  .admin-layout { height: 100dvh; }
  .content {
    padding-bottom: 70px;
    height: 100dvh;
  }
}
</style>
```

---

## 📄 Page 骨架規範

### 公開頁面（使用 default layout）

```vue
<template>
  <div class="[page-name]-page">
    <section class="hero">...</section>
    <section class="[features]">...</section>
  </div>
</template>

<script setup lang="ts">
// 1. SEO（必要）
useHead({ title: '頁面標題' })

// 2. definePageMeta（可選，預設使用 default layout）
// definePageMeta({ hideHeader: false, hideFooter: false })

// 3. 業務邏輯
</script>

<style scoped>
/* Mobile First */
</style>
```

### 管理後台頁面

```vue
<script setup>
definePageMeta({ layout: "admin" })
// 業務邏輯...
</script>
```

---

## 🔧 nuxt.config.ts 核心設定

```ts
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: true,                        // ⭐ 開啟 SSR（SEO 必要）
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "nuxt-schema-org",
  ],
  css: ["assets/css/main.css"],     // 全域 CSS
  app: {
    head: {
      htmlAttrs: { lang: "zh-TW" },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "網站名稱",
      titleTemplate: "%s | 網站名稱",
      meta: [
        { name: "description", content: "..." },
        { property: "og:type", content: "website" },
        // ... OG / Twitter meta
      ],
    },
  },
})
```

---

## 🗂️ 模組對應職責

| 層級 | 目錄 | 職責 |
|------|------|------|
| 路由 | `pages/` | URL 對應、SEO、版面組合 |
| 版面 | `layouts/` | 共用骨架（header/sidebar/footer） |
| 元件 | `components/` | 可重用 UI 單元（無業務邏輯） |
| 邏輯 | `composables/` | 狀態管理、API 封裝 |
| 工具 | `composables/utils/` | 純工具函式（api, alert） |
| 守衛 | `middleware/` | 路由權限控制 |
| 插件 | `plugins/` | 第三方函式庫全域掛載 |
