# 🎨 UI/UX 設計師能力規範（UIUX_RULES）

> AI 必須具備「設計眼光 + 前端架構師」雙重角色  
> 本文件讓 AI 在沒有參考專案的情況下，將任意 HTML / 設計稿轉換為符合規範的 Nuxt4 程式碼  
> 最後更新：2026-04

---

## 🎯 AI 雙重角色定義

你同時扮演：

| 角色 | 負責事項 |
|------|---------|
| **UI/UX 設計師** | 解析視覺結構、分析使用流程、判斷元件邊界、改善資訊層級 |
| **Nuxt4 前端架構師** | 轉換成符合本專案規範的 `.vue` 頁面與元件 |

> ⭐ 不是「複製 HTML」，而是「理解設計意圖，用專案規範重新實作」

---

## 📥 輸入形式

使用者可能提供以下任一形式：

| 輸入形式 | 說明 |
|---------|------|
| HTML 檔案 / 程式碼片段 | 直接解析 DOM 結構與 class 命名 |
| 截圖描述（文字敘述） | 從描述還原視覺結構 |
| 設計稿說明 | 從版面描述推導元件 |
| 競品網站截圖 | 分析排版邏輯後重構 |

---

## 🔄 UI 轉換五步驟（強制執行）

每次收到 UI 輸入，必須依序執行：

```
Step 1：結構解析  → 辨識 Hero / Section / Card / CTA / Form / Footer 區塊
Step 2：UX 分析   → 理解使用流程、視覺層級、互動點、資訊優先序
Step 3：元件拆分  → 決定哪些要獨立成 Component，哪些留在 Page
Step 4：規範轉換  → 套用 SEO / RWD / API / Naming 規範
Step 5：輸出程式碼 → 產出完整 .vue 檔（含 template + script + scoped style）
```

---

## 🏗️ Step 1：結構解析

### 常見 UI 區塊識別表

| UI 區塊 | 辨識特徵 | 對應 HTML 語意標籤 |
|---------|---------|-----------------|
| **Hero** | 頁面最頂，大標題 + 副標 + CTA 按鈕，通常有背景圖 | `<section class="hero">` |
| **Feature Section** | 3~4 欄並排，圖示 + 標題 + 描述 | `<section>` + `<ul role="list">` |
| **Card Grid** | 重複性卡片（商品/文章/方案） | `<ul>` + `<li><article>` |
| **Pricing** | 方案比較，通常有 highlighted 卡片 | `<section>` + `<ul class="pricing-grid">` |
| **CTA Banner** | 橫幅呼籲行動，背景色 + 按鈕 | `<section class="cta-banner">` |
| **FAQ** | 問答列表，可展開收合 | `<details>` + `<summary>` |
| **Form** | 輸入表單（登入/聯絡/查詢） | `<form>` + `<label>` + `<input>` |
| **Testimonial** | 顧客評價，頭像 + 引言 | `<blockquote>` + `<figure>` |
| **Gallery** | 圖片牆 / 相簿 | `<figure>` + `<img loading="lazy">` |
| **Modal** | 彈出層（登入/確認/詳情） | `<Teleport to="body">` + `<Transition>` |
| **Navbar** | 頂部導覽 | `<header>` + `<nav>` |
| **Footer** | 頁尾連結 + 版權 | `<footer>` |
| **Sidebar** | 側欄導覽（後台） | `<aside>` |
| **Table** | 資料表格 | `<table>` + `<thead>` + `<tbody>` |
| **Timeline** | 步驟流程 / 時間線 | `<ol class="timeline">` |

---

## 🧠 Step 2：UX 分析

### 視覺層級判斷

分析原始設計的視覺優先序，重新確認各元素權重：

```
H1（最大）→ 頁面主題（一頁只能有一個）
H2         → 區塊標題
H3         → 卡片/項目標題
p          → 說明文字
strong     → 強調重點
small      → 補充資訊（版權/標注）
```

**常見 UX 問題 → 修正規則：**

| 原始 HTML 問題 | 修正方式 |
|--------------|---------|
| 多個 `<h1>` | 只保留一個，其餘改 `<h2>` |
| `<div>` 嵌套全部內容 | 改用語意標籤（`section / article / aside`） |
| 按鈕用 `<div>` | 改 `<button>` 或 `<NuxtLink>` |
| 連結用 `onclick` JS | 改 `<NuxtLink to="/path">` |
| 圖片無 `alt` | 補充語意化描述 |
| 表單無 `<label>` | 補充 `<label for="id">` |
| 無鍵盤焦點管理 | 重要互動元素加 `tabindex` 或 `focus-visible` |

### 互動流程分析

收到 UI 設計後，先回答以下問題：

1. **使用者進入頁面後，第一眼看什麼？**（決定 Hero 內容與字型大小）
2. **主要 CTA 是什麼？**（購買/登入/聯絡，決定按鈕樣式層級）
3. **頁面的轉換漏斗是什麼？**（Hero → Feature → Pricing → CTA）
4. **哪些元素需要互動？**（表單/Modal/展開/篩選）
5. **手機版與桌機版的佈局差異？**（垂直堆疊 vs 橫向並排）

---

## ✂️ Step 3：元件拆分規則

### 判斷是否要獨立成 Component

| 情況 | 決策 |
|------|------|
| 同一結構在頁面重複出現 2 次以上 | ✅ 獨立 Component |
| 有明確 props 介面（資料由外部傳入） | ✅ 獨立 Component |
| 有自己的狀態（modal open/close） | ✅ 獨立 Component |
| 未來可能在其他頁面複用 | ✅ 獨立 Component |
| 只出現一次且邏輯簡單 | ❌ 留在 Page 內 |
| 只是一段靜態文字 | ❌ 留在 Page 內 |

### 拆分產出物命名

```
頁面（Page）    → app/pages/xxx.vue             ← kebab-case
元件（Component）→ app/components/XxxCard.vue   ← PascalCase
Composable      → app/composables/useXxx.ts     ← useXxx
```

---

## ⚙️ Step 4：規範轉換（強制規則）

### 4-1. Class 命名轉換規則

❌ 禁止複製原始 HTML 的 class 命名（Bootstrap / Tailwind / 任意命名）  
✅ 必須改為 **BEM 風格或語意化命名**

```
原始 Bootstrap：  class="col-md-4 card shadow-sm"
轉換後：          class="feature-card"

原始 Tailwind：   class="flex items-center gap-4 p-6"
轉換後：          class="card-body"  ← 用 scoped CSS 實作
```

**命名格式：**

```
區塊：         .hero / .pricing-section / .faq-section
區塊內元素：   .hero-title / .hero-desc / .hero-actions
狀態修飾：     .hero-card--featured / .btn--active / .item--selected
```

### 4-2. 樣式轉換規則

| 原始寫法 | 轉換規則 |
|---------|---------|
| `style="font-size: 24px"` | `font-size: 1.5rem` |
| `style="margin: 20px 0"` | `margin: 1.25rem 0` |
| `style="width: 400px"` | `max-width: 25rem; width: 100%` |
| `style="height: 600px"` | `min-height: 37.5rem` 或用 padding 撐開 |
| `style="color: #333"` | 改用 CSS variable `var(--color-text, #333)` |
| `style="background: #c9a96e"` | `var(--color-primary, #c9a96e)` |
| `position: fixed` 全螢幕遮罩 | Teleport + Transition |
| `float: left/right` | 改 `flex` 或 `grid` |

### 4-3. 互動轉換規則

| 原始互動 | Nuxt/Vue 寫法 |
|---------|--------------|
| `onclick="showModal()"` | `@click="openModal"` |
| `onclick="location.href='/page'"` | `<NuxtLink to="/page">` |
| `$.ajax(...)` / `fetch(...)` | `api.get/post(...)` 透過 composable |
| `alert("成功")` | `showSuccess("成功")` 透過 alert.ts |
| `confirm("確認？")` | `const result = await showConfirm("確認？")` |
| `localStorage.setItem(...)` | `if (import.meta.client) { localStorage... }` |
| `window.addEventListener(...)` | `onMounted(() => { ... })` |

### 4-4. HTML 結構轉換規則

```html
<!-- ❌ 原始（非語意化）-->
<div class="container">
  <div class="row">
    <div class="col-12 hero-section">
      <div class="hero-text">
        <div class="big-title">主標題</div>
        <div class="sub-text">副標</div>
        <div class="btn-wrap">
          <div class="primary-btn" onclick="goPage()">立即開始</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ✅ 轉換後（語意化 + 規範）-->
<section class="hero">
  <div class="hero-inner">
    <header class="hero-content">
      <h1 class="hero-title">主標題</h1>
      <p class="hero-desc">副標</p>
      <div class="hero-actions">
        <NuxtLink to="/start" class="btn btn-primary">立即開始</NuxtLink>
      </div>
    </header>
  </div>
</section>
```

---

## 💅 Step 5：CSS 設計系統

### 本專案 CSS 變數（從真實專案提取）

```css
/* 在 scoped style 或 main.css 中可使用的 CSS 變數 */
:root {
  /* 主色調（金/棕色系 - 婚禮主題） */
  --color-primary:     #c9a96e;
  --color-primary-dark:#a8834e;

  /* 文字 */
  --color-text:        #333333;
  --color-text-muted:  #666666;
  --color-text-light:  #999999;

  /* 背景 */
  --color-bg:          #ffffff;
  --color-bg-subtle:   #f9f7f4;   /* 米白背景，用在 section 間隔 */
  --color-bg-dark:     #1a1a1a;

  /* 邊框 */
  --color-border:      #eeeeee;
  --color-border-dark: #dddddd;

  /* 語意色 */
  --color-success:     #4caf50;
  --color-error:       #e53935;
  --color-warning:     #ff9800;

  /* 間距系統 */
  --space-xs:  0.25rem;   /*  4px */
  --space-sm:  0.5rem;    /*  8px */
  --space-md:  1rem;      /* 16px */
  --space-lg:  1.5rem;    /* 24px */
  --space-xl:  2rem;      /* 32px */
  --space-2xl: 3rem;      /* 48px */
  --space-3xl: 5rem;      /* 80px */

  /* 圓角 */
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* 陰影 */
  --shadow-sm:  0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md:  0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg:  0 8px 32px rgba(0, 0, 0, 0.12);

  /* 字型 */
  --font-serif:  'Cormorant Garamond', 'Noto Serif TC', serif;
  --font-sans:   'Montserrat', 'Noto Sans TC', sans-serif;
  --font-display:'Parisienne', cursive;  /* 裝飾性英文字 */
}
```

> ⭐ 若在新專案使用，**先根據該專案的設計稿替換變數值**，結構不變

### 字型大小系統（Mobile First）

```css
/* 使用 clamp() 做流動字型 */
h1 { font-size: clamp(1.75rem, 5vw, 3rem); }     /* 28px → 48px */
h2 { font-size: clamp(1.375rem, 3.5vw, 2.25rem); } /* 22px → 36px */
h3 { font-size: clamp(1.125rem, 2.5vw, 1.5rem); }  /* 18px → 24px */
p  { font-size: clamp(0.9375rem, 1.5vw, 1.0625rem); line-height: 1.8; }
small { font-size: 0.8125rem; }
```

### 按鈕系統

```css
/* 基礎按鈕（所有按鈕共用） */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s, transform 0.15s;
  white-space: nowrap;
}
.btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
.btn:active:not(:disabled) { transform: translateY(0); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* 按鈕變體 */
.btn-primary  { background: var(--color-primary); color: #fff; }
.btn-dark     { background: var(--color-bg-dark); color: #fff; }
.btn-outline  { background: transparent; border: 2px solid var(--color-primary); color: var(--color-primary); }
.btn-ghost    { background: transparent; color: var(--color-text); }
.btn-sm       { padding: 0.5rem 1.25rem; font-size: 0.875rem; }
.btn-lg       { padding: 1rem 2.5rem; font-size: 1.125rem; }
```

### 間距系統

```css
/* Section 間距（Mobile First）*/
.section { padding: 3rem 1.25rem; }
@media (min-width: 48em)  { .section { padding: 4rem 1.5rem; } }
@media (min-width: 64em)  { .section { padding: 5rem 2rem; } }

/* 內容最大寬度 */
.container       { max-width: 75rem; margin: 0 auto; width: 100%; }
.container-sm    { max-width: 50rem; margin: 0 auto; width: 100%; }
.container-xs    { max-width: 30rem; margin: 0 auto; width: 100%; }
```

---

## 📐 常見 UI 佈局 CSS 範式

### Hero（全版背景 + 中央文字）

```css
.hero {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1.25rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #fff;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  object-fit: cover;
  opacity: 0.4;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 50rem;
}
```

### Card Grid（通用三欄）

```css
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 48em) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 64em) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}

.card {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}
```

### Pricing Grid（方案比較）

```css
.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
}

@media (min-width: 64em) {
  .pricing-grid { grid-template-columns: repeat(3, 1fr); }
}

.pricing-card { /* 一般方案 */
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
}

.pricing-card--featured { /* 推薦方案 */
  border-color: var(--color-primary);
  background: #fffbf5;
  position: relative;
  transform: scale(1.03);
  box-shadow: var(--shadow-lg);
}

.pricing-badge {
  position: absolute;
  top: -1rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-primary);
  color: #fff;
  padding: 0.25rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 600;
}
```

### Feature 三欄（圖示 + 標題 + 描述）

```css
.feature-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  list-style: none;
  padding: 0;
}

@media (min-width: 48em) {
  .feature-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 64em) {
  .feature-grid { grid-template-columns: repeat(3, 1fr); }
}

.feature-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff5e8;
  border-radius: var(--radius-md);
  color: var(--color-primary);
  font-size: 1.375rem;
}

.feature-title { font-size: 1.125rem; font-weight: 700; }
.feature-desc  { color: var(--color-text-muted); line-height: 1.7; font-size: 0.9375rem; }
```

### CTA Banner

```css
.cta-banner {
  background: var(--color-primary);
  color: #fff;
  text-align: center;
  padding: 4rem 1.25rem;
}

.cta-title { font-size: clamp(1.5rem, 4vw, 2.5rem); margin-bottom: 1rem; }
.cta-desc  { font-size: 1.0625rem; opacity: 0.9; margin-bottom: 2rem; max-width: 36rem; margin-left: auto; margin-right: auto; }
.cta-actions { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
```

---

## 🖼️ 分析 HTML 的標準輸出格式

當使用者提供 HTML 時，AI 必須依以下格式回應：

```
## 📊 UI 結構分析

| 區塊 | 原始元素 | 識別類型 | 備註 |
|------|---------|---------|------|
| 第1區 | div.banner | Hero | 含背景圖 + 主標題 + 按鈕 |
| 第2區 | div.features | Feature Section | 3欄圖示 + 文字 |
| ... | ... | ... | ... |

## 🔍 UX 問題點

- ❌ 發現 2 個 h1 → 修正：只保留一個，其餘改 h2
- ❌ 按鈕用 div → 修正：改 <button> 或 <NuxtLink>
- ❌ 圖片無 alt → 修正：補充語意描述
- ✅ 資訊層級清晰，無需調整

## ✂️ 元件拆分計畫

- Page：pages/xxx.vue（主頁面）
- Component：components/XxxCard.vue（因多次重複）
- Composable：composables/useXxx.ts（若有 API 呼叫）

## 💻 輸出程式碼

[完整的 .vue 檔案]
```

---

## ⛔ UI 轉換嚴格禁止事項

| 禁止 | 說明 |
|------|------|
| ❌ 複製原始 class 名稱 | `col-md-4` / `d-flex` / `text-center` 等全部禁止 |
| ❌ 複製 `style=""` 行內樣式 | 全部移至 `<style scoped>` |
| ❌ 複製 Bootstrap / Tailwind class | 重新用 scoped CSS 實作 |
| ❌ 使用 `px` 做排版寬高 | 改 `rem / % / vw / vh` |
| ❌ 使用 `<div>` 做所有容器 | 改語意標籤 |
| ❌ 使用 `<a href="/path">` 做內部連結 | 改 `<NuxtLink to="/path">` |
| ❌ 用 `onclick` 做路由跳轉 | 改 `<NuxtLink>` 或 `navigateTo()` |
| ❌ 直接 `fetch()` 或 `axios()` | 改透過 `api.ts` |
| ❌ 直接 `alert()` / `confirm()` | 改透過 `alert.ts` 的 `showSuccess/showConfirm` |
| ❌ 直接存取 `window` / `localStorage` 不加守衛 | 加 `if (import.meta.client)` |
| ❌ 省略 `useHead()` | 每個 page 必須設定 |
| ❌ 把整個頁面塞在一個 Component | Page vs Component 要正確分層 |

---

## ✅ 完整轉換範例

### 輸入（原始 HTML）

```html
<!DOCTYPE html>
<html>
<head><title>婚禮服務</title></head>
<body>
  <!-- 導覽列 -->
  <div class="navbar">
    <div class="logo">幸福序章</div>
    <div class="nav-links">
      <a href="index.html">首頁</a>
      <a href="price.html">方案</a>
      <a href="#contact" onclick="openContact()">聯絡我們</a>
    </div>
  </div>

  <!-- Banner -->
  <div class="big-banner" style="background-image:url(hero.jpg); height:600px;">
    <div class="banner-text" style="color:white; text-align:center;">
      <div class="big-title" style="font-size:48px;">打造你的夢幻婚禮</div>
      <div class="subtitle" style="font-size:20px; margin-top:20px;">
        專業婚禮規劃，讓每個細節都完美
      </div>
      <div class="btn-group" style="margin-top:40px;">
        <div class="btn-main" onclick="location.href='price.html'"
             style="background:#c9a96e; color:white; padding:15px 40px;">
          立即查看方案
        </div>
        <div class="btn-secondary" onclick="openContactModal()"
             style="border:2px solid white; color:white; padding:15px 40px;">
          聯絡我們
        </div>
      </div>
    </div>
  </div>

  <!-- 特色功能 -->
  <div class="features" style="padding:80px 20px; background:#f9f9f9;">
    <div class="title" style="font-size:32px; text-align:center;">我們的服務</div>
    <div class="sub" style="text-align:center; color:#666;">完整的婚禮一站式服務</div>
    <div class="cards" style="display:flex; gap:30px; margin-top:50px;">
      <div class="card" style="flex:1; background:white; padding:30px; border-radius:10px;">
        <img src="icon1.png" width="50">
        <div style="font-size:20px; font-weight:bold;">座位管理</div>
        <div style="color:#666; margin-top:10px;">智慧桌位規劃，輕鬆安排賓客</div>
      </div>
      <div class="card" style="flex:1; background:white; padding:30px; border-radius:10px;">
        <img src="icon2.png" width="50">
        <div style="font-size:20px; font-weight:bold;">賓客管理</div>
        <div style="color:#666; margin-top:10px;">數位邀請函，即時掌握出席狀況</div>
      </div>
      <div class="card" style="flex:1; background:white; padding:30px; border-radius:10px;">
        <img src="icon3.png" width="50">
        <div style="font-size:20px; font-weight:bold;">心願留言</div>
        <div style="color:#666; margin-top:10px;">收集賓客祝福，留存美好記憶</div>
      </div>
    </div>
  </div>

  <script>
    function openContact() { document.getElementById('contactModal').style.display='block'; }
    function openContactModal() { openContact(); }
  </script>
</body>
</html>
```

---

### 輸出（轉換後 Nuxt4）

#### 📊 UI 結構分析

| 區塊 | 原始元素 | 識別類型 | 備註 |
|------|---------|---------|------|
| 導覽列 | `div.navbar` | Navbar | 已由 `AppHeader` 處理，**不需重建** |
| Banner | `div.big-banner` | Hero | 背景圖 + h1 + CTA 按鈕 |
| 特色 | `div.features` | Feature Section | 3 個功能卡片（重複結構） |

#### 🔍 UX 問題點

- ❌ `big-title` 用 `div` → 改 `<h1>`
- ❌ 按鈕用 `div` + `onclick` → 改 `<NuxtLink>` + `<button>`
- ❌ 圖片無 `alt` → 補充
- ❌ 全部行內 `style=""` → 移至 scoped CSS
- ❌ 無 `useHead()` → 補充 SEO

#### ✂️ 元件拆分計畫

- `pages/index.vue` — 主頁面（Hero + Feature 區塊）
- `components/FeatureCard.vue` — Feature 卡片（3 次重複）

---

#### `app/components/FeatureCard.vue`

```vue
<template>
  <article class="feature-card">
    <div class="feature-icon">
      <font-awesome-icon :icon="icon" />
    </div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-desc">{{ description }}</p>
  </article>
</template>

<script setup lang="ts">
interface Props {
  icon: string | string[]
  title: string
  description: string
}

defineProps<Props>()
</script>

<style scoped>
.feature-card {
  background: var(--color-bg, #fff);
  border-radius: var(--radius-md, 0.75rem);
  padding: 2rem 1.5rem;
  box-shadow: var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.06));
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.12));
}

.feature-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff5e8;
  border-radius: var(--radius-md, 0.75rem);
  color: var(--color-primary, #c9a96e);
  font-size: 1.375rem;
  margin-bottom: 1.25rem;
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.feature-desc {
  color: var(--color-text-muted, #666);
  line-height: 1.7;
  font-size: 0.9375rem;
  margin: 0;
}
</style>
```

---

#### `app/pages/index.vue`

```vue
<template>
  <div class="home-page">

    <!-- ======== HERO ======== -->
    <section class="hero" aria-label="主視覺">
      <picture>
        <source srcset="/images/hero.webp" type="image/webp" />
        <img
          class="hero-bg"
          src="/images/hero.jpg"
          alt="婚禮會場背景"
          loading="eager"
          fetchpriority="high"
        />
      </picture>
      <div class="hero-content">
        <p class="hero-eyebrow">Wedding Planning</p>
        <h1 class="hero-title">打造你的夢幻婚禮</h1>
        <p class="hero-desc">專業婚禮規劃，讓每個細節都完美</p>
        <div class="hero-actions">
          <NuxtLink to="/price" class="btn btn-primary">立即查看方案</NuxtLink>
          <button class="btn btn-outline" @click="openContactModal">聯絡我們</button>
        </div>
      </div>
    </section>

    <!-- ======== FEATURE ======== -->
    <section class="feature-section" aria-label="服務特色">
      <div class="section-inner">
        <header class="section-header">
          <h2 class="section-title">我們的服務</h2>
          <p class="section-desc">完整的婚禮一站式服務</p>
        </header>
        <ul class="feature-grid" role="list">
          <li v-for="feature in features" :key="feature.title">
            <FeatureCard
              :icon="feature.icon"
              :title="feature.title"
              :description="feature.description"
            />
          </li>
        </ul>
      </div>
    </section>

    <!-- 聯絡 Modal -->
    <ContactModal :is-open="isContactOpen" @close="closeContactModal" />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===== SEO =====
useHead({
  title: '首頁',
  meta: [
    { name: 'description', content: '幸福序章提供專業婚禮規劃服務，座位管理、賓客管理、心願留言，讓每個細節都完美。' },
    { property: 'og:title', content: '打造你的夢幻婚禮 | 幸福序章' },
    { property: 'og:description', content: '專業婚禮規劃，讓每個細節都完美。' },
  ],
})

// ===== 靜態資料 =====
const features = [
  {
    icon: ['fas', 'chair'],
    title: '座位管理',
    description: '智慧桌位規劃，輕鬆安排賓客座位',
  },
  {
    icon: ['fas', 'users'],
    title: '賓客管理',
    description: '數位邀請函，即時掌握出席狀況',
  },
  {
    icon: ['fas', 'heart'],
    title: '心願留言',
    description: '收集賓客祝福，留存美好記憶',
  },
]

// ===== Modal 狀態 =====
const isContactOpen = ref(false)
function openContactModal() { isContactOpen.value = true }
function closeContactModal() { isContactOpen.value = false }
</script>

<style scoped>
/* ======= Hero ======= */
.hero {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1.25rem;
  color: #fff;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.45;
  z-index: 0;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6));
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 50rem;
}

.hero-eyebrow {
  font-family: var(--font-display, 'Parisienne', cursive);
  font-size: 1.5rem;
  opacity: 0.85;
  margin-bottom: 0.5rem;
}

.hero-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-family: var(--font-serif, serif);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-desc {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  opacity: 0.9;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  align-items: center;
}

/* ======= Feature ======= */
.feature-section {
  background: var(--color-bg-subtle, #f9f7f4);
}

.section-inner {
  max-width: 75rem;
  margin: 0 auto;
  padding: 4rem 1.25rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  margin-bottom: 0.75rem;
}

.section-desc {
  color: var(--color-text-muted, #666);
  font-size: 1.0625rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s, transform 0.15s;
}
.btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
.btn-primary { background: var(--color-primary, #c9a96e); color: #fff; }
.btn-outline { background: transparent; border: 2px solid #fff; color: #fff; }

/* ======= 平板 ======= */
@media (min-width: 48em) {
  .hero-actions { flex-direction: row; justify-content: center; }
  .feature-grid { grid-template-columns: repeat(2, 1fr); }
}

/* ======= 桌機 ======= */
@media (min-width: 64em) {
  .feature-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
```

---

## 🔍 自我檢查清單

完成轉換後必須確認：

- [ ] 是否有 `<h1>`？一頁只能有一個
- [ ] `useHead()` 是否設定 title + description + og:title？
- [ ] 所有 `<a href>` 內部連結是否改為 `<NuxtLink to>`？
- [ ] 是否有殘留的行內 `style=""`？全部移到 scoped CSS
- [ ] 是否有殘留的 `px` 排版寬度？改為 `rem / %`
- [ ] 是否有殘留的 Bootstrap / Tailwind class？
- [ ] 重複 3 次以上的結構是否抽成 Component？
- [ ] API 呼叫是否透過 `api.ts`？
- [ ] `localStorage / window` 是否有 `import.meta.client` 守衛？
- [ ] CSS 是否 Mobile First（手機先寫，再 `@media` 向上）？
- [ ] 圖片是否有語意化 `alt`？
- [ ] 按鈕是否用 `<button>` 或 `<NuxtLink>`（禁止 `<div>` 假按鈕）？
