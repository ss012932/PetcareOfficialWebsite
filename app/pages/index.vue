<template>
  <!-- ===== 頁面主容器：控制整個寵物醫療系統介紹網站 ===== -->
  <div class="home-page">
    <!-- ===== HERO 首頁區塊：控制首頁主視覺與背景圖片 ===== -->
    <section class="hero" id="home">
      <div class="container hero-grid">
        <!-- ===== HERO 文字區塊：控制左側主標題、描述、按鈕 ===== -->
        <article class="hero-content">
          <p class="hero-eyebrow">寵物醫療院所專用管理系統</p>

          <h1 class="hero-title">守護毛孩健康．建立安心信任</h1>

          <p class="hero-desc">
            從預約、病歷、看診、收費到庫存與報表分析，<br />
            PetCare提供完整的數位化管理工具，<br />
            協助院所降低行政負擔，提升醫療服務品質。
          </p>

          <!-- ===== HERO 按鈕區塊：控制主要行動按鈕與 icon ===== -->
          <div class="hero-actions">
            <NuxtLink to="#features" class="btn btn-primary">
              <span class="btn-icon" aria-hidden="true">▦</span>
              <span>查看功能</span>
              <span class="btn-arrow" aria-hidden="true">›</span>
            </NuxtLink>

            <NuxtLink to="#pricing" class="btn btn-outline">
              <span class="btn-icon" aria-hidden="true">◇</span>
              <span>查看方案</span>
              <span class="btn-arrow" aria-hidden="true">›</span>
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <!-- ===== 功能介紹區塊：控制系統核心功能卡片 ===== -->
    <section class="features-section" id="features">
      <div class="container">
        <!-- ===== 區塊標題：控制功能介紹標題與說明 ===== -->
        <header class="section-header">
          <p class="section-eyebrow">Features</p>
          <h2 class="section-title">功能介紹</h2>
          <p class="section-desc">
            從前台掛號到後台營運分析，協助動物醫院完成數位化管理。
          </p>
        </header>

        <!-- ===== 功能卡片列表：控制所有系統功能 ===== -->
        <ul class="features-grid" role="list">
          <li class="feature-card">
            <div class="feature-icon">📅</div>
            <h3>預約掛號管理</h3>
            <p>
              支援現場掛號、線上預約、醫師班表與看診狀態管理，減少櫃台重複作業。
            </p>
          </li>

          <li class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>電子病歷系統</h3>
            <p>完整記錄寵物基本資料、病史、檢查紀錄、用藥紀錄與回診追蹤。</p>
          </li>

          <li class="feature-card">
            <div class="feature-icon">💊</div>
            <h3>藥品與庫存管理</h3>
            <p>管理藥品、疫苗、耗材庫存，並提供低庫存提醒，降低缺貨風險。</p>
          </li>

          <li class="feature-card">
            <div class="feature-icon">💳</div>
            <h3>收費與結帳管理</h3>
            <p>支援診療費、藥品費、檢驗費與商品費用整合結帳，帳務更清楚。</p>
          </li>

          <li class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>營運報表分析</h3>
            <p>提供營收、看診量、熱門服務、庫存消耗等數據，協助經營決策。</p>
          </li>

          <li class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3>權限與帳號管理</h3>
            <p>可依照院長、獸醫、櫃台、助理設定不同權限，保護重要資料安全。</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- ===== 系統優勢區塊：控制產品賣點說明 ===== -->
    <section class="benefits-section">
      <div class="container benefits-grid">
        <!-- ===== 左側文字區塊：控制系統優勢描述 ===== -->
        <article class="benefits-content">
          <p class="section-eyebrow">Why Choose Us</p>
          <h2 class="section-title">為什麼選擇 PetCare System？</h2>

          <p class="benefits-desc">
            我們不只是提供一套系統，而是協助動物醫院建立更穩定、更有效率的營運流程。
          </p>

          <ul class="benefits-list" role="list">
            <li>✓ 降低櫃台行政作業時間</li>
            <li>✓ 提升獸醫看診與病歷查詢效率</li>
            <li>✓ 減少紙本紀錄與人工統計錯誤</li>
            <li>✓ 協助院所掌握營收與庫存狀況</li>
          </ul>
        </article>

        <!-- ===== 右側數據區塊：控制產品成效資料 ===== -->
        <aside class="benefits-stats" aria-label="系統成效">
          <div class="stat-card">
            <strong>50%</strong>
            <span>行政時間降低</span>
          </div>

          <div class="stat-card">
            <strong>3 秒</strong>
            <span>快速查詢病歷</span>
          </div>

          <div class="stat-card">
            <strong>24H</strong>
            <span>雲端資料存取</span>
          </div>
        </aside>
      </div>
    </section>

    <!-- ===== 價格方案區塊：控制產品方案與價格 ===== -->
    <section class="pricing-section" id="pricing">
      <div class="container">
        <!-- ===== 區塊標題：控制價格方案標題與說明 ===== -->
        <header class="section-header">
          <p class="section-eyebrow">Pricing</p>
          <h2 class="section-title">價格方案</h2>
          <p class="section-desc">
            可依照診所規模選擇適合的方案，未來也能彈性升級。
          </p>
        </header>

        <!-- ===== 價格卡片列表：控制三種方案 ===== -->
        <ul class="pricing-grid" role="list">
          <li class="pricing-card">
            <h3>基本版</h3>
            <p class="pricing-subtitle">適合小型動物診所</p>

            <div class="price">
              NT$ 1,980
              <span>/ 月</span>
            </div>

            <ul class="plan-list" role="list">
              <li>✓ 預約掛號管理</li>
              <li>✓ 電子病歷管理</li>
              <li>✓ 基本收費功能</li>
              <li>✓ 3 個員工帳號</li>
            </ul>

            <NuxtLink to="#contact-sales" class="btn btn-plan">
              選擇方案
            </NuxtLink>
          </li>

          <li class="pricing-card pricing-card-featured">
            <div class="popular-badge">最推薦</div>

            <h3>專業版</h3>
            <p class="pricing-subtitle">適合成長中的動物醫院</p>

            <div class="price">
              NT$ 3,980
              <span>/ 月</span>
            </div>

            <ul class="plan-list" role="list">
              <li>✓ 包含基本版所有功能</li>
              <li>✓ 藥品與庫存管理</li>
              <li>✓ 營運報表分析</li>
              <li>✓ 10 個員工帳號</li>
            </ul>

            <NuxtLink to="#contact-sales" class="btn btn-primary">
              選擇方案
            </NuxtLink>
          </li>

          <li class="pricing-card">
            <h3>企業版</h3>
            <p class="pricing-subtitle">適合多分院與大型院所</p>

            <div class="price">
              客製報價
              <span></span>
            </div>

            <ul class="plan-list" role="list">
              <li>✓ 包含專業版所有功能</li>
              <li>✓ 多分院管理</li>
              <li>✓ 客製化報表</li>
              <li>✓ 專屬技術支援</li>
            </ul>

            <NuxtLink to="#contact-sales" class="btn btn-plan">
              聯絡我們
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- ===== CTA 區塊：控制最後轉換行動 ===== -->
    <section class="cta-section" id="contact-sales">
      <div class="container cta-content">
        <h2>準備讓你的動物醫院升級數位管理了嗎？</h2>

        <p>立即了解 PetCare System，讓掛號、病歷、收費與庫存管理一次到位。</p>

        <a href="mailto:sales@petcare-system.com" class="btn btn-secondary">
          聯絡業務
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// ===== SEO 設定區塊：控制首頁標題、描述、搜尋引擎資訊 =====
useHead({
  title: "PetCare System｜寵物醫療管理系統",
  meta: [
    {
      name: "description",
      content:
        "PetCare System 是專為動物醫院打造的寵物醫療管理系統，提供預約掛號、電子病歷、收費結帳、庫存管理與營運報表分析。",
    },
    {
      name: "keywords",
      content:
        "寵物醫療系統, 動物醫院系統, 獸醫系統, 電子病歷, 預約掛號, 寵物診所管理系統",
    },
    {
      property: "og:title",
      content: "PetCare System｜寵物醫療管理系統",
    },
    {
      property: "og:description",
      content:
        "專為動物醫院打造的雲端管理系統，整合掛號、病歷、收費、庫存與報表分析。",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
});
</script>

<style scoped>
/* ===== 色系設定：控制整個首頁的主題顏色，精品深藍 × 鼠尾草綠 × 金色 ===== */
.home-page {
  --color-primary: #2e4a62; /* 主色：深藍色，控制主要區塊、標題、重點按鈕 */
  --color-primary-dark: #1f3548; /* 深主色：控制 hover、深色狀態 */
  --color-secondary: #9cbfa7; /* 輔助色：鼠尾草綠，控制自然安心感 */
  --color-accent: #d9b26f; /* 強調色：精品金，控制 CTA、線條、徽章 */
  --color-bg: #f8f7f3; /* 背景色：乾淨米白，控制整體背景 */
  --color-card: #ffffff; /* 卡片色：控制功能卡片、價格卡片背景 */
  --color-text: #263238; /* 主要文字色：控制標題與正文 */
  --color-muted: #6f7a80; /* 次要文字色：控制描述文字 */
  --color-border: #e6d8bd; /* 邊框色：控制卡片與區塊邊線 */
  --color-soft: #f3efe6; /* 柔和色：控制淡色區塊背景 */

  color: var(--color-text);
  background-color: var(--color-bg);
}

/* ===== 共用容器：控制內容最大寬度 ===== */
.container {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
}

/* ===== HERO 區塊：控制首頁主視覺背景圖片與精品感遮罩 ===== */
.hero {
  position: relative;
  min-height: calc(100vh - 4.5rem);
  padding: 6rem 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-image:
    linear-gradient(
      90deg,
      rgba(248, 247, 243, 0.98) 0%,
      rgba(248, 247, 243, 0.92) 32%,
      rgba(248, 247, 243, 0.48) 58%,
      rgba(248, 247, 243, 0.08) 100%
    ),
    url("/assets/image/Image1.png");
  background-size: cover;
  background-position: center right;
  background-repeat: no-repeat;
}

/* ===== HERO 底部金色弧線：控制圖片下方精品裝飾線 ===== */
.hero::after {
  content: "";
  position: absolute;
  left: -8%;
  right: -8%;
  bottom: 1.25rem;
  height: 5rem;
  border-bottom: 2px solid rgba(217, 178, 111, 0.75);
  border-radius: 0 0 50% 50%;
  pointer-events: none;
}

/* ===== HERO 底部小爪印：控制主視覺中央下方裝飾 ===== */
.hero::before {
  content: "🐾";
  position: absolute;
  left: 50%;
  bottom: 0.35rem;
  transform: translateX(-50%);
  color: var(--color-accent);
  font-size: 1.35rem;
  z-index: 1;
  filter: sepia(1) saturate(1.2) hue-rotate(350deg);
  pointer-events: none;
}

/* ===== HERO 排版：控制左側文字區塊寬度 ===== */
.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 42rem);
  align-items: center;
}

/* ===== HERO 文字內容：控制左側文字不遮住右側寵物圖片 ===== */
.hero-content {
  max-width: 42rem;
  position: relative;
  z-index: 2;
}

/* ===== HERO 小標：控制主標上方說明文字 ===== */
.hero-eyebrow {
  color: var(--color-accent);
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  margin-bottom: 1rem;
}

/* ===== HERO 標題：控制首頁主標題，桌機盡量維持一行 ===== */
.hero-title {
  color: var(--color-primary);
  font-size: clamp(2.4rem, 3vw, 4rem);
  line-height: 1.18;
  font-weight: 900;
  letter-spacing: 0.06em;
  margin-bottom: 1.5rem;
  text-shadow: 0 3px 10px rgba(46, 74, 98, 0.12);
}

/* ===== HERO 描述：控制首頁說明文字，模擬圖中的灰藍副標 ===== */
.hero-desc {
  color: rgba(38, 50, 56, 0.78);
  font-size: clamp(1.1rem, 1.8vw, 1rem);
  line-height: 2;
  letter-spacing: 0.08em;
  max-width: 42rem;
  margin-bottom: 2.25rem;
  font-weight: 600;
}

/* ===== HERO 按鈕區：控制首頁按鈕排列 ===== */
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* ===== 共用按鈕：控制所有按鈕基礎樣式 ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 4rem;
  padding: 0 1.75rem;
  border-radius: 999px;
  font-weight: 900;
  font-size: 1.15rem;
  letter-spacing: 0.08em;
  text-decoration: none;
  transition: 0.2s ease;
}

/* ===== 按鈕 icon：控制按鈕左側圖示樣式 ===== */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--color-accent);
  border: 2px solid var(--color-accent);
  border-radius: 0.35rem;
  font-size: 1rem;
  line-height: 1;
}

/* ===== 按鈕箭頭：控制按鈕右側箭頭 ===== */
.btn-arrow {
  color: var(--color-accent);
  font-size: 2rem;
  line-height: 1;
  margin-left: 0.25rem;
}

/* ===== 主要按鈕：控制深藍金框按鈕 ===== */
.btn-primary {
  color: #ffffff;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
  );
  border: 2px solid var(--color-accent);
  box-shadow:
    0 14px 32px rgba(31, 53, 72, 0.24),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

/* ===== 主要按鈕滑過：控制深藍金框按鈕互動效果 ===== */
.btn-primary:hover {
  background: linear-gradient(
    135deg,
    var(--color-primary-dark) 0%,
    #0f2538 100%
  );
  transform: translateY(-2px);
}

/* ===== 外框按鈕：控制白底金框按鈕 ===== */
.btn-outline {
  color: var(--color-primary);
  background-color: rgba(255, 255, 255, 0.78);
  border: 2px solid var(--color-accent);
  box-shadow: 0 12px 28px rgba(38, 50, 56, 0.1);
}

/* ===== 外框按鈕滑過：控制白底金框按鈕互動效果 ===== */
.btn-outline:hover {
  color: var(--color-primary-dark);
  background-color: var(--color-soft);
  transform: translateY(-2px);
}

/* ===== 次要按鈕：控制 CTA 白底按鈕 ===== */
.btn-secondary {
  color: var(--color-primary);
  background-color: #ffffff;
  border: 1px solid rgba(217, 178, 111, 0.65);
}

/* ===== 次要按鈕滑過：控制 CTA 按鈕互動 ===== */
.btn-secondary:hover {
  transform: translateY(-2px);
}

/* ===== 共用區塊：控制主要內容區塊上下間距 ===== */
.features-section,
.benefits-section,
.pricing-section {
  padding: 5rem 0;
}

/* ===== 功能區背景：控制功能介紹背景色 ===== */
.features-section {
  background-color: var(--color-bg);
}

/* ===== 區塊標題：控制標題置中與寬度 ===== */
.section-header {
  max-width: 42rem;
  margin: 0 auto 3rem auto;
  text-align: center;
}

/* ===== 區塊小標籤：控制英文小標 ===== */
.section-eyebrow {
  color: var(--color-accent);
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

/* ===== 區塊主標題：控制每區主標題 ===== */
.section-title {
  color: var(--color-primary);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  margin-bottom: 1rem;
}

/* ===== 區塊描述：控制每區說明文字 ===== */
.section-desc {
  color: var(--color-muted);
  line-height: 1.8;
}

/* ===== 功能列表：控制功能卡片排列 ===== */
.features-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* ===== 功能卡片：控制每個功能外觀 ===== */
.feature-card {
  padding: 2rem;
  border-radius: 1.5rem;
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  box-shadow: 0 14px 40px rgba(38, 50, 56, 0.06);
  transition: 0.2s ease;
}

/* ===== 功能卡片滑過：控制卡片互動效果 ===== */
.feature-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(46, 74, 98, 0.12);
}

/* ===== 功能圖示：控制 icon 大小 ===== */
.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

/* ===== 功能標題：控制功能卡片標題 ===== */
.feature-card h3 {
  color: var(--color-primary);
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

/* ===== 功能文字：控制功能卡片描述 ===== */
.feature-card p {
  color: var(--color-muted);
  line-height: 1.8;
}

/* ===== 優勢區塊：控制系統優勢背景 ===== */
.benefits-section {
  background:
    radial-gradient(
      circle at top right,
      rgba(156, 191, 167, 0.22),
      transparent 24rem
    ),
    var(--color-soft);
}

/* ===== 優勢排版：控制左右欄位 ===== */
.benefits-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

/* ===== 優勢描述：控制文字內容 ===== */
.benefits-desc {
  color: var(--color-muted);
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

/* ===== 優勢清單：控制條列項目 ===== */
.benefits-list {
  list-style: none;
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  color: var(--color-primary);
  font-weight: 700;
}

/* ===== 優勢統計：控制右側數字卡排列 ===== */
.benefits-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* ===== 統計卡片：控制數據卡片外觀 ===== */
.stat-card {
  padding: 2rem;
  border-radius: 1.5rem;
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  box-shadow: 0 14px 40px rgba(38, 50, 56, 0.08);
}

/* ===== 統計數字：控制數據重點樣式 ===== */
.stat-card strong {
  display: block;
  color: var(--color-accent);
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

/* ===== 統計說明：控制數字下方文字 ===== */
.stat-card span {
  color: var(--color-muted);
  font-weight: 700;
}

/* ===== 價格區塊：控制價格方案背景 ===== */
.pricing-section {
  background-color: var(--color-bg);
}

/* ===== 價格列表：手機版控制方案卡片上下排列 ===== */
.pricing-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* ===== 價格卡片：控制每個方案外觀 ===== */
.pricing-card {
  position: relative;
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-card);
  box-shadow: 0 14px 40px rgba(38, 50, 56, 0.06);
}

/* ===== 推薦價格卡片：控制中間熱門方案外觀 ===== */
.pricing-card-featured {
  border: 2px solid var(--color-accent);
  box-shadow: 0 24px 70px rgba(217, 178, 111, 0.24);
}

/* ===== 推薦標籤：控制最推薦徽章 ===== */
.popular-badge {
  position: absolute;
  top: -0.875rem;
  right: 1.5rem;
  padding: 0.35rem 0.9rem;
  color: #ffffff;
  background-color: var(--color-primary);
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 800;
}

/* ===== 價格標題：控制方案名稱 ===== */
.pricing-card h3 {
  color: var(--color-primary);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

/* ===== 價格副標：控制方案說明 ===== */
.pricing-subtitle {
  color: var(--color-muted);
  margin-bottom: 1.5rem;
}

/* ===== 價格數字：控制金額顯示 ===== */
.price {
  color: var(--color-primary);
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
}

/* ===== 價格單位：控制每月文字 ===== */
.price span {
  color: var(--color-muted);
  font-size: 1rem;
  font-weight: 600;
}

/* ===== 方案功能清單：控制方案項目 ===== */
.plan-list {
  list-style: none;
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0 0 2rem 0;
  color: var(--color-text);
}

/* ===== 方案按鈕：控制一般方案按鈕 ===== */
.btn-plan {
  color: var(--color-primary);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
}

/* ===== 方案按鈕滑過：控制一般方案按鈕互動 ===== */
.btn-plan:hover {
  background-color: var(--color-soft);
  transform: translateY(-2px);
}

/* ===== CTA 區塊：控制底部行動呼籲背景 ===== */
.cta-section {
  padding: 5rem 0;
  color: #ffffff;
  background:
    radial-gradient(
      circle at top right,
      rgba(217, 178, 111, 0.24),
      transparent 24rem
    ),
    linear-gradient(
      135deg,
      var(--color-primary) 0%,
      var(--color-primary-dark) 100%
    );
}

/* ===== CTA 內容：控制底部文字置中 ===== */
.cta-content {
  text-align: center;
}

/* ===== CTA 標題：控制底部主標 ===== */
.cta-content h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 1rem;
}

/* ===== CTA 描述：控制底部說明文字 ===== */
.cta-content p {
  max-width: 42rem;
  margin: 0 auto 2rem auto;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
}

/* ===== 手機版 HERO：控制手機時背景圖位置與文字可讀性 ===== */
@media (max-width: 47.99em) {
  .hero {
    min-height: auto;
    padding: 4rem 0 5rem;
    background-image:
      linear-gradient(
        180deg,
        rgba(248, 247, 243, 0.98) 0%,
        rgba(248, 247, 243, 0.94) 58%,
        rgba(248, 247, 243, 0.72) 100%
      ),
      url("/images/Image1.png");
    background-position: center right;
  }

  .hero-grid {
    grid-template-columns: 1fr;
  }

  .hero-content {
    max-width: 100%;
  }

  .hero-title {
    font-size: clamp(2.35rem, 1vw, 3.4rem);
    letter-spacing: 0.04em;
  }

  .hero-desc {
    font-size: 1rem;
    letter-spacing: 0.04em;
  }

  .hero-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn {
    width: 100%;
    max-width: 20rem;
  }
}

/* ===== 平板以上：控制功能卡片兩欄、價格方案三欄 ===== */
@media (min-width: 48em) {
  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pricing-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .benefits-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* ===== 桌機以上：控制功能卡片三欄、優勢區左右欄 ===== */
@media (min-width: 64em) {
  .benefits-grid {
    grid-template-columns: 1fr 1fr;
  }

  .features-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .pricing-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .benefits-stats {
    grid-template-columns: 1fr;
  }
}
</style>
