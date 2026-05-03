# 📱 響應式設計規範（RWD_RULES）

> Mobile First 強制規範 ｜ 最後更新：2026-04

---

## 🎯 核心原則

1. **Mobile First**：先寫手機版，再往上擴展
2. **流動式設計**：禁止寫死寬度（layout 結構層）
3. **語意化單位**：`rem / % / vw / vh`，非必要不用 `px`
4. **Flex / Grid**：禁止 `float`，禁止 Bootstrap

---

## 📐 斷點定義

| 裝置 | 寬度範圍 | Media Query |
|------|----------|-------------|
| 手機（預設）| < 768px | 無（Mobile First 基礎層） |
| 平板 | 768px ~ 1024px | `@media (min-width: 48em)` |
| 小桌機 | 1024px ~ 1280px | `@media (min-width: 64em)` |
| 大桌機 | > 1280px | `@media (min-width: 80em)` |

> ⭐ 使用 `em` 斷點（`48em = 768px`）避免使用者字型縮放時排版破版

---

## 📏 單位使用規範

| 用途 | 正確單位 | 禁止 |
|------|----------|------|
| 字型大小 | `rem` | `px`（除非特殊設計需求） |
| 間距（padding/margin） | `rem` | `px`（小值如 1px border 除外） |
| 容器寬度 | `%` / `vw` / `max-width` | 固定 `px`（除非 max-width 上限） |
| 容器高度 | `vh` / `dvh` / `auto` | 固定 `px` |
| 圖示大小 | `1em`（跟隨字型）或 `rem` | - |
| Border / shadow | `px` ✅ 可用 | - |

---

## 📦 版面結構範式

### 基礎 Section 結構

```css
/* ======= Mobile First ======= */
.section {
  padding: 3rem 1.25rem;  /* 手機：小 padding */
}

.section-inner {
  max-width: 75rem;        /* 1200px 上限 */
  margin: 0 auto;
  width: 100%;
}

/* ======= 平板 ======= */
@media (min-width: 48em) {
  .section {
    padding: 4rem 2rem;
  }
}

/* ======= 桌機 ======= */
@media (min-width: 64em) {
  .section {
    padding: 5rem 3rem;
  }
}
```

### Grid 多欄排版

```css
/* Mobile First：單欄 */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* 平板：兩欄 */
@media (min-width: 48em) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 桌機：三欄 */
@media (min-width: 64em) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Flex 水平排列

```css
/* Mobile First：垂直排 */
.flex-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 平板以上：水平排 */
@media (min-width: 48em) {
  .flex-row {
    flex-direction: row;
    align-items: center;
  }
}
```

---

## 🖼️ 圖片 RWD

### `<picture>` 元素（不同解析度提供不同圖片）

```html
<!-- 桌機用高解析度，手機用小圖 -->
<picture>
  <source media="(min-width: 64em)" srcset="@/assets/image/hero-desktop.jpg" />
  <img
    src="@/assets/image/hero-mobile.jpg"
    class="hero-img"
    alt="描述文字"
    loading="lazy"
  />
</picture>
```

### 響應式圖片 CSS

```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Hero 背景圖 */
.hero-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

---

## 📱 常見 RWD 模式

### Header（桌機導覽 ↔ 漢堡選單）

```css
/* Mobile：隱藏桌機導覽，顯示漢堡 */
.nav-desktop { display: none; }
.hamburger   { display: flex; }

/* 桌機：顯示導覽，隱藏漢堡 */
@media (min-width: 64em) {
  .nav-desktop { display: flex; }
  .hamburger   { display: none; }
}
```

### 卡片群組

```css
.cards {
  display: grid;
  grid-template-columns: 1fr;          /* 手機：1欄 */
  gap: 1.5rem;
  padding: 0 1rem;
}

@media (min-width: 48em) {
  .cards { grid-template-columns: repeat(2, 1fr); }  /* 平板：2欄 */
}

@media (min-width: 64em) {
  .cards { grid-template-columns: repeat(3, 1fr); }  /* 桌機：3欄 */
  padding: 0;
}
```

### 表單欄位

```css
.form-row {
  display: flex;
  flex-direction: column;  /* 手機：垂直 */
  gap: 1rem;
}

@media (min-width: 48em) {
  .form-row {
    flex-direction: row;   /* 平板+：水平 */
  }
  .form-row .form-group {
    flex: 1;
  }
}
```

---

## 📐 字型大小 RWD（clamp 推薦）

```css
/* 流動字型：手機 1.5rem → 桌機 2.5rem 之間自動縮放 */
.hero-title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}

.section-title {
  font-size: clamp(1.25rem, 3vw, 2rem);
}

.body-text {
  font-size: clamp(0.875rem, 2vw, 1rem);
}
```

---

## 🔲 Admin Layout RWD（從 admin.vue 分析）

```css
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

/* 中小螢幕：使用 dvh（Dynamic Viewport Height）*/
@media (max-width: 1730px) {
  .admin-layout {
    height: 100dvh;
  }
  .content {
    padding-bottom: 70px;  /* 避免被底部導覽遮擋 */
    height: 100dvh;
  }
}
```

---

## ✅ RWD 自我檢查清單

在產生任何樣式前，確認：

- [ ] 是否從手機尺寸開始撰寫（Mobile First）？
- [ ] 容器是否使用 `%` / `max-width` 而非固定 `px`？
- [ ] 字型是否使用 `rem` 或 `clamp()`？
- [ ] 版面是否用 `flex` 或 `grid`？
- [ ] 圖片是否有 `max-width: 100%; height: auto`？
- [ ] 手機、平板、桌機三個尺寸都有對應樣式？
- [ ] 是否在 `48em` 和 `64em` 設有斷點？
