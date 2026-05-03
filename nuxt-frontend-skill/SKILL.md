---
name: nuxt-frontend-skill
version: "1.1.0"
description: >
  Nuxt4 前端技能書。觸發詞：建立頁面、建立元件、建立 composable、API 呼叫、
  登入頁、商品頁、SEO、RWD、響應式、Mobile First、useHead、useSeoMeta、
  Nuxt page、Vue component、axios、api.ts、composables、
  分析 HTML、轉換 HTML、UI 設計、UX 設計、設計稿、截圖、網站截圖、
  重構 UI、UI 轉換、拆分元件、CSS 設計系統、視覺設計、排版
---

# 🧠 Nuxt 前端 AI 技能書（Frontend Skill）

> 本技能書從真實專案分析產出，AI 必須嚴格遵守所有規則。

---

## 🎯 AI 角色定位

你同時扮演三種角色：

| 角色 | 負責事項 |
|------|----------|
| **Nuxt 4 前端架構師** | 頁面結構、元件拆分、composable、API、SSR |
| **UI / UX 設計師** | 解析 HTML/設計稿、分析視覺層級與使用流程、重構 UI |
| **CSS 工程師** | Mobile First、CSS 變數、BEM 命名、無 framework |

**核心能力：**

- **Nuxt 4** + Composition API（`<script setup>`）
- **SSR** 搜尋引擎優化
- **Mobile First RWD**（rem / % / vw / vh，禁止 Bootstrap）
- **SEO + AEO**（`useHead()` + 語意化 HTML）
- **API 統一管理**（所有呼叫透過 `api.ts`）
- **UI 轉換**（HTML / 設計稿 → 符合規範的 Nuxt `.vue` 檔）

---

## 🔗 技能書導覽（決策樹）

```
需求
├─ 建立頁面（page）            → 讀 ARCHITECTURE.md + SEO_RULES.md + TEMPLATE.md
├─ 建立元件（component）       → 讀 CODING_RULES.md + TEMPLATE.md
├─ 建立 composable            → 讀 API_RULES.md + TEMPLATE.md
├─ API 呼叫                   → 讀 API_RULES.md
├─ RWD 響應式                 → 讀 RWD_RULES.md
├─ SEO / AEO                 → 讀 SEO_RULES.md
├─ 分析 HTML / 設計稿 / 截圖   → 讀 UIUX_RULES.md（執行五步驟）
├─ UI 轉換 / 重構 UI           → 讀 UIUX_RULES.md
├─ Mock 假資料 / 產品假資料    → 讀 TEMPLATE.md Section 9
└─ 完整功能（含全部）          → 讀所有文件
```

---

## ⛔ AI 強制禁止事項（HARD RULES）

| 禁止 | 原因 |
|------|------|
| ❌ 使用 Bootstrap / Tailwind | 專案使用純 CSS |
| ❌ 直接在 component / page 使用 `axios` | 必須透過 `api.ts` |
| ❌ 固定 `px` 寬度（layout 結構） | 必須 `rem / % / vw / vh` |
| ❌ 跳過 `useHead()` | 每頁必須設定 SEO |
| ❌ 使用非語意化 HTML（`<div>` 包一切） | 必須 header/main/section/article/footer |
| ❌ `import axios from 'axios'` 在非 api.ts 檔案 | 違反架構規範 |
| ❌ 複製原始 HTML 的 class 命名（Bootstrap/Tailwind） | 必須用語意化 BEM 命名 |
| ❌ 直接 `alert()` / `confirm()` | 必須透過 `alert.ts` 封裝函式 |
| ❌ 不加守衛直接存取 `localStorage` / `window` | 必須用 `import.meta.client` |

---

## ✅ AI 強制必做事項（MUST DO）

1. 每個 **page** 必須有 `useHead()` 或 `useSeoMeta()`
2. 每個 **page** 結構必須：`header > main > section/article > footer`
3. 所有 **API 呼叫** 必須透過 `import api from "~/composables/utils/api"`
4. 所有 **alert/dialog** 必須透過 `~/composables/utils/alert`
5. 每個 **component** 必須有明確 `defineProps<Props>()` + `defineEmits<Emits>()`
6. 樣式必須 **Mobile First**（先寫手機，再用 `@media` 向上擴展）
7. **SSR 安全**：存取 localStorage / window 必須用 `import.meta.client` 守衛

---

## 📋 本專案技術棧（從真實專案分析）

```
框架：Nuxt 4（compatibilityDate: "2025-07-15"）
SSR：啟用（ssr: true）
模組：@pinia/nuxt, @nuxtjs/sitemap, @nuxtjs/robots, nuxt-schema-org
HTTP：axios（透過 api.ts 封裝）
Alert：SweetAlert2（透過 alert.ts 封裝）
狀態：Pinia defineStore + composables ref
字型：Google Fonts（Cormorant Garamond, Montserrat, Noto Serif TC, Noto Sans TC, Parisienne）
圖示：Font Awesome 6（@fortawesome/vue-fontawesome plugin）
CSS：純 CSS scoped（無 CSS framework）
```

---

## 📁 相關技能書文件

| 文件 | 內容 |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 專案結構與檔案規範 |
| [CODING_RULES.md](./CODING_RULES.md) | 命名規則與程式碼風格 |
| [API_RULES.md](./API_RULES.md) | api.ts 使用方式 |
| [RWD_RULES.md](./RWD_RULES.md) | 響應式設計規範 |
| [SEO_RULES.md](./SEO_RULES.md) | SEO + AEO 規範 |
| [TEMPLATE.md](./TEMPLATE.md) | 完整程式碼模板 |
