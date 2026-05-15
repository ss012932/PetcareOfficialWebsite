<template>
  <!-- ===== 頁面主容器：控制整個寵物醫療系統介紹網站 ===== -->
  <div class="home-page">
    <!-- ===== HERO 首頁區塊：控制首頁主視覺與背景圖片 ===== -->
    <section class="hero" id="home">
      <div class="hero-shell">
        <div class="container hero-grid">
          <article class="hero-content">
            <p class="hero-eyebrow">寵物醫療院所專用管理系統</p>

            <h1 class="hero-title">守護毛孩健康・建立安心信任</h1>

            <p class="hero-desc">
              整合線上預約、看診紀錄、貼心提醒與健康知識，
              讓毛孩的每一次就診都更安心，照護更有依據。
            </p>

            <div class="hero-actions">
              <NuxtLink to="#features" class="btn btn-primary">
                <Icon name="fa6-solid:table-cells-large" class="btn-icon" aria-hidden="true" />
                <span>查看功能</span>
                <span class="btn-arrow" aria-hidden="true">›</span>
              </NuxtLink>

              <NuxtLink to="#pricing" class="btn btn-outline">
                <Icon name="fa6-solid:tag" class="btn-icon" aria-hidden="true" />
                <span>查看方案</span>
                <span class="btn-arrow" aria-hidden="true">›</span>
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== 客戶痛點區塊：控制動物醫院常見管理問題 ===== -->
    <section class="pain-points-section" aria-label="動物醫院常見管理痛點">
      <!-- ===== 痛點內容容器：控制左側說明與右側痛點卡片排列 ===== -->
      <div class="container pain-points-panel">
        <!-- ===== 左側說明區：控制痛點區塊主標題與介紹文字 ===== -->
        <article class="pain-points-intro">
          <p class="pain-points-eyebrow">
            <span></span>
            Common Challenges
          </p>

          <h2 class="pain-points-title">
            院所日常管理，<br />
            是否也遇到這些狀況？
          </h2>

          <div class="pain-points-divider">
            <span></span>
            <strong><Icon name="fa6-solid:paw" class="divider-paw" aria-hidden="true" /></strong>
            <span></span>
          </div>

          <p class="pain-points-desc">
            從預約掛號、病歷紀錄到收費與庫存管理，若流程分散在紙本、Excel
            或不同工具中， 容易造成重複作業、資料查詢不便與行政負擔增加。
          </p>

          <NuxtLink to="#features" class="pain-points-link">
            <span>了解完整解決方案</span>
            <strong aria-hidden="true">›</strong>
          </NuxtLink>
        </article>

        <!-- ===== 右側痛點卡片列表：控制三大常見痛點 ===== -->
        <ul class="pain-points-list" role="list">
          <!-- ===== 痛點卡片 1：控制預約與掛號問題 ===== -->
          <li class="pain-point-item">
            <div class="pain-point-visual">
              <Icon name="fa6-solid:calendar-check" class="pain-point-icon" aria-hidden="true" />
            </div>

            <article class="pain-point-content">
              <div class="pain-point-heading">
                <span class="pain-point-number">01</span>
                <h3>預約與掛號常常卡住？</h3>
              </div>

              <ul class="pain-point-checks" role="list">
                <li>預約資料分散，櫃台需要反覆確認</li>
                <li>回診與疫苗提醒容易遺漏</li>
              </ul>
            </article>

            <span class="pain-point-arrow" aria-hidden="true">›</span>
          </li>

          <!-- ===== 痛點卡片 2：控制病歷與檢查紀錄問題 ===== -->
          <li class="pain-point-item">
            <div class="pain-point-visual">
              <Icon name="fa6-solid:file-medical" class="pain-point-icon" aria-hidden="true" />
            </div>

            <article class="pain-point-content">
              <div class="pain-point-heading">
                <span class="pain-point-number">02</span>
                <h3>病歷與檢查紀錄找不到？</h3>
              </div>

              <ul class="pain-point-checks" role="list">
                <li>歷史病歷查詢不方便</li>
                <li>檢驗、照片與用藥紀錄難整合</li>
              </ul>
            </article>

            <span class="pain-point-arrow" aria-hidden="true">›</span>
          </li>

          <!-- ===== 痛點卡片 3：控制收費、庫存與報表問題 ===== -->
          <li class="pain-point-item">
            <div class="pain-point-visual">
              <Icon name="fa6-solid:chart-simple" class="pain-point-icon" aria-hidden="true" />
            </div>

            <article class="pain-point-content">
              <div class="pain-point-heading">
                <span class="pain-point-number">03</span>
                <h3>收費、庫存、報表整理很花時間？</h3>
              </div>

              <ul class="pain-point-checks" role="list">
                <li>月底營收與服務項目需要人工統計</li>
                <li>藥品與耗材庫存不容易即時掌握</li>
              </ul>
            </article>

            <span class="pain-point-arrow" aria-hidden="true">›</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- ===== 方案總覽區塊：控制看診前、中、後流程整合說明 ===== -->
    <section class="workflow-section" aria-label="方案總覽：看診前中後流程">
      <div class="container workflow-container">
        <!-- ===== 方案總覽標題區：控制區塊標題與說明文字 ===== -->
        <header class="workflow-header">
          <p class="workflow-eyebrow">
            <span></span>
            核心功能
            <span></span>
          </p>

          <div class="workflow-paw" aria-hidden="true"><Icon name="fa6-solid:paw" /></div>

          <h2 class="workflow-title">一套系統整合看診前、中、後流程</h2>

          <p class="workflow-desc">
            整合預約掛號、診療管理與追蹤關懷，串聯每一次就診旅程，
            提升醫療品質與營運效率。
          </p>
        </header>

        <!-- ===== 流程時間軸：控制三個看診階段與連接線 ===== -->
        <div class="workflow-timeline">
          <!-- ===== 流程項目 1：控制看診前內容 ===== -->
          <article class="workflow-step">
            <!-- ===== 流程 icon：看診前，使用圖片 icon1 ===== -->
            <div class="workflow-icon-wrap">
              <img
                src="/assets/image/icon1.png"
                alt="看診前流程圖示"
                class="workflow-icon-img"
              />
            </div>

            <div class="workflow-step-content">
              <p class="workflow-number">01</p>

              <h3>看診前</h3>

              <ul class="workflow-list" role="list">
                <li>線上預約</li>
                <li>掛號排程</li>
                <li>到診提醒</li>
              </ul>
            </div>
          </article>

          <!-- ===== 流程箭頭 1：控制看診前到看診中的連接 ===== -->
          <div class="workflow-arrow" aria-hidden="true"><Icon name="fa6-solid:arrow-right" /></div>

          <!-- ===== 流程項目 2：控制看診中內容 ===== -->
          <article class="workflow-step">
            <!-- ===== 流程 icon：看診中，使用圖片 icon2 ===== -->
            <div class="workflow-icon-wrap">
              <img
                src="/assets/image/icon2.png"
                alt="看診中流程圖示"
                class="workflow-icon-img"
              />
            </div>

            <div class="workflow-step-content">
              <p class="workflow-number">02</p>

              <h3>看診中</h3>

              <ul class="workflow-list" role="list">
                <li>電子病歷</li>
                <li>看診紀錄</li>
                <li>收費結帳</li>
              </ul>
            </div>
          </article>

          <!-- ===== 流程箭頭 2：控制看診中到看診後的連接 ===== -->
          <div class="workflow-arrow" aria-hidden="true"><Icon name="fa6-solid:arrow-right" /></div>

          <!-- ===== 流程項目 3：控制看診後內容 ===== -->
          <article class="workflow-step">
            <!-- ===== 流程 icon：看診後，使用圖片 icon3 ===== -->
            <div class="workflow-icon-wrap">
              <img
                src="/assets/image/icon3.png"
                alt="看診後流程圖示"
                class="workflow-icon-img"
              />
            </div>

            <div class="workflow-step-content">
              <p class="workflow-number">03</p>

              <h3>看診後</h3>

              <ul class="workflow-list" role="list">
                <li>回診追蹤</li>
                <li>健康提醒</li>
                <li>營運報表</li>
              </ul>
            </div>
          </article>
        </div>
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

/* ===== 共用容器：手機優先，控制內容左右留白與最大寬度 ===== */
.container {
  width: min(100% - 2rem, 1120px);
  margin: 0 auto;
}

/* ===== HERO 外層：控制首頁主視覺外部區塊 ===== */
.hero {
  position: relative;
  padding: 0 0 1.5rem;
  background-color: var(--color-bg);
}

/* ===== HERO 主視覺外框：控制手機版背景圖與底部圓弧 ===== */
.hero-shell {
  position: relative;
  min-height: auto;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-bottom-left-radius: 50% 5%;
  border-bottom-right-radius: 50% 5%;
  background-image:
    linear-gradient(
      180deg,
      rgba(248, 247, 243, 0.98) 0%,
      rgba(248, 247, 243, 0.94) 58%,
      rgba(248, 247, 243, 0.72) 100%
    ),
    url("/assets/image/Image1.png");
  background-size: cover;
  background-position: center right;
  background-repeat: no-repeat;
}

/* ===== HERO 底部金色弧線：控制圓弧裝飾線 ===== */
.hero-shell::after {
  content: "";
  position: absolute;
  left: -3%;
  right: -3%;
  bottom: 0.65rem;
  height: 4rem;
  border-bottom: 2px solid rgba(217, 178, 111, 0.75);
  border-radius: 0 0 50% 50%;
  pointer-events: none;
}

/* ===== HERO 中央小爪印：控制底部中央裝飾 ===== */
.hero-shell::before {
  content: "🐾";
  position: absolute;
  left: 50%;
  bottom: 0.1rem;
  transform: translateX(-50%);
  color: var(--color-accent);
  font-size: 1.1rem;
  z-index: 2;
  pointer-events: none;
}

/* ===== HERO 排版：手機版控制文字區塊內距 ===== */
.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  width: 100%;
  min-height: auto;
  padding: 3.5rem 0 4.5rem;
}

/* ===== HERO 文字內容：控制左側文字區塊 ===== */
.hero-content {
  max-width: 100%;
  position: relative;
  z-index: 2;
}

/* ===== HERO 小標：控制主標上方說明文字 ===== */
.hero-eyebrow {
  color: var(--color-accent);
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin-bottom: 0.85rem;
}

/* ===== HERO 標題：手機版控制首頁主標題大小 ===== */
.hero-title {
  color: var(--color-primary);
  font-size: clamp(2rem, 9vw, 2.75rem);
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: 0.03em;
  margin-bottom: 1.25rem;
  text-shadow: 0 3px 10px rgba(46, 74, 98, 0.12);
}

/* ===== HERO 描述：控制首頁說明文字 ===== */
.hero-desc {
  color: rgba(38, 50, 56, 0.78);
  font-size: 0.98rem;
  line-height: 1.9;
  letter-spacing: 0.03em;
  max-width: 42rem;
  margin-bottom: 1.75rem;
  font-weight: 600;
}

/* ===== HERO 按鈕區：手機版控制按鈕上下排列 ===== */
.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.85rem;
}

/* ===== 共用按鈕：手機版控制所有按鈕基礎樣式 ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  width: 100%;
  max-width: 18rem;
  min-height: 3.25rem;
  padding: 0 1.15rem;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.98rem;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: 0.2s ease;
}

/* ===== 按鈕 icon：手機版控制按鈕左側圖示樣式 ===== */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.65rem;
  height: 1.65rem;
  color: var(--color-accent);
  border: 1.5px solid var(--color-accent);
  border-radius: 0.35rem;
  padding: 0.25rem;
}

/* ===== 按鈕箭頭：控制按鈕右側箭頭 ===== */
.btn-arrow {
  color: var(--color-accent);
  font-size: 1.55rem;
  line-height: 1;
  margin-left: 0.1rem;
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

/* ===== 客戶痛點區塊：手機版控制痛點區塊背景與間距 ===== */
.pain-points-section {
  position: relative;
  padding: 3.5rem 0;
  background:
    radial-gradient(
      circle at top left,
      rgba(217, 178, 111, 0.1),
      transparent 28rem
    ),
    radial-gradient(
      circle at bottom right,
      rgba(156, 191, 167, 0.1),
      transparent 26rem
    ),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.96) 0%,
      rgba(248, 247, 243, 0.94) 100%
    );
  box-shadow: inset 0 24px 70px rgba(38, 50, 56, 0.035);
  overflow: hidden;
}

/* ===== 痛點區塊背景裝飾：控制左下角金色弧線 ===== */
.pain-points-section::after {
  content: "";
  position: absolute;
  left: -8%;
  bottom: 3rem;
  width: 48%;
  height: 7rem;
  border-bottom: 2px solid rgba(217, 178, 111, 0.58);
  border-radius: 0 0 50% 50%;
  pointer-events: none;
}

/* ===== 痛點區塊專用容器：手機版控制左右留白 ===== */
.pain-points-section .container {
  width: min(100% - 2rem, 100%);
}

/* ===== 痛點內容容器：手機版上下排列 ===== */
.pain-points-panel {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.25rem;
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  overflow: visible;
}

/* ===== 關閉原本外框裝飾，避免重複出現 ===== */
.pain-points-panel::after {
  display: none;
}

/* ===== 左側說明區：控制標題、描述與連結排列 ===== */
.pain-points-intro {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ===== 左側淡色浮水印：控制爪印裝飾 ===== */
.pain-points-intro::after {
  content: "🐾";
  position: absolute;
  right: 2%;
  bottom: 4%;
  width: 6rem;
  height: 6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0.3rem solid rgba(217, 178, 111, 0.08);
  border-radius: 1.5rem;
  color: rgba(217, 178, 111, 0.08);
  font-size: 3rem;
  transform: rotate(-8deg);
  pointer-events: none;
}

/* ===== 痛點小標：控制 Common Challenges 小字與金色線條 ===== */
.pain-points-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-accent);
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  margin-bottom: 1.25rem;
}

/* ===== 痛點小標線條：控制左側金色短線 ===== */
.pain-points-eyebrow span {
  width: 2rem;
  height: 1px;
  background-color: var(--color-accent);
}

/* ===== 痛點主標題：手機版控制標題大小 ===== */
.pain-points-title {
  color: var(--color-primary);
  font-size: clamp(2rem, 10vw, 2.75rem);
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: 0.03em;
  margin-bottom: 1.35rem;
}

/* ===== 痛點分隔線：控制標題下方金線與爪印 ===== */
.pain-points-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 14rem;
  margin-bottom: 1.5rem;
  color: var(--color-accent);
}

/* ===== 痛點分隔線左右線條 ===== */
.pain-points-divider span {
  flex: 1;
  height: 1px;
  background-color: rgba(217, 178, 111, 0.72);
}

/* ===== 痛點分隔線爪印 ===== */
.pain-points-divider strong {
  display: inline-flex;
  align-items: center;
}

.divider-paw {
  width: 1rem;
  height: 1rem;
  color: var(--color-accent);
}

/* ===== 痛點描述文字：控制左側說明文字 ===== */
.pain-points-desc {
  max-width: 34rem;
  color: var(--color-text);
  font-size: 0.98rem;
  line-height: 1.85;
  letter-spacing: 0.03em;
  margin-bottom: 1.75rem;
}

/* ===== 痛點連結：控制了解完整解決方案連結 ===== */
.pain-points-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  width: fit-content;
  color: #b98b42;
  font-weight: 900;
  text-decoration: none;
  letter-spacing: 0.04em;
  border-bottom: 1px solid rgba(217, 178, 111, 0.7);
  padding-bottom: 0.35rem;
  transition: 0.2s ease;
}

/* ===== 痛點連結箭頭：控制右側深藍圓形箭頭 ===== */
.pain-points-link strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.85rem;
  height: 1.85rem;
  color: #ffffff;
  background-color: var(--color-primary);
  border-radius: 999px;
  font-size: 1.5rem;
  line-height: 1;
}

/* ===== 痛點連結滑過：控制連結互動 ===== */
.pain-points-link:hover {
  color: var(--color-primary);
  transform: translateX(0.2rem);
}

/* ===== 右側痛點列表：控制三張痛點卡片排列 ===== */
.pain-points-list {
  position: relative;
  z-index: 2;
  list-style: none;
  display: grid;
  gap: 1rem;
  padding: 0;
  margin: 0;
}

/* ===== 痛點卡片：手機版控制 icon 與標題在同一列 ===== */
.pain-point-item {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "icon content"
    "icon content";
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1.35rem;
  background-color: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(230, 216, 189, 0.86);
  box-shadow: 0 14px 36px rgba(38, 50, 56, 0.08);
  transition: 0.2s ease;
}

/* ===== 痛點卡片滑過：控制卡片互動效果 ===== */
.pain-point-item:hover {
  transform: translateY(-3px);
  border-color: var(--color-accent);
  box-shadow: 0 20px 46px rgba(46, 74, 98, 0.13);
}

/* ===== 痛點圖示外圈：手機版控制 icon 放在左側 ===== */
.pain-point-visual {
  grid-area: icon;
  width: 4rem;
  height: 4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(217, 178, 111, 0.2) 0%,
    rgba(243, 239, 230, 0.88) 70%
  );
  flex-shrink: 0;
}

/* ===== 痛點圖示：手機版控制 icon 尺寸 ===== */
.pain-point-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.45rem;
  height: 2.45rem;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 0.65rem;
  padding: 0.45rem;
}

/* ===== 痛點內容：控制文字放在右側 ===== */
.pain-point-content {
  grid-area: content;
  min-width: 0;
}

/* ===== 痛點標題列：手機版控制編號與標題同一列 ===== */
.pain-point-heading {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

/* ===== 痛點編號：手機版控制 01、02、03 尺寸 ===== */
.pain-point-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.85rem;
  height: 1.85rem;
  flex-shrink: 0;
  color: #ffffff;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
  );
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 900;
  box-shadow: 0 8px 18px rgba(46, 74, 98, 0.22);
}

/* ===== 痛點卡片標題：手機版控制標題字級 ===== */
.pain-point-heading h3 {
  color: var(--color-primary);
  font-size: 1.15rem;
  font-weight: 900;
  line-height: 1.4;
  margin: 0;
}

/* ===== 痛點卡片描述：控制標題下方說明 ===== */
.pain-point-content > p {
  color: var(--color-muted);
  font-size: 0.95rem;
  line-height: 1.8;
  margin: 0 0 0.75rem 0;
}

/* ===== 痛點清單：控制卡片內部重點條列 ===== */
.pain-point-checks {
  list-style: none;
  display: grid;
  gap: 0.35rem;
  padding: 0.65rem 0 0 0;
  margin: 0;
  border-top: 1px dashed rgba(217, 178, 111, 0.55);
}

/* ===== 痛點清單項目：控制每個勾選項目 ===== */
.pain-point-checks li {
  position: relative;
  padding-left: 1.55rem;
  color: var(--color-text);
  font-size: 0.92rem;
  line-height: 1.6;
  font-weight: 600;
}

/* ===== 痛點清單勾選符號：控制金色圓形勾勾 ===== */
.pain-point-checks li::before {
  content: "✓";
  position: absolute;
  left: 0;
  top: 0.25rem;
  width: 1rem;
  height: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #b98b42;
  border: 1px solid rgba(217, 178, 111, 0.9);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 900;
  line-height: 1;
}

/* ===== 痛點箭頭：手機版隱藏右側箭頭避免擁擠 ===== */
.pain-point-arrow {
  display: none;
}

/* ===== 方案總覽區塊：手機版控制整個看診流程區塊背景 ===== */
.workflow-section {
  position: relative;
  padding: 4rem 0;
  overflow: hidden;
  background:
    radial-gradient(
      circle at top right,
      rgba(217, 178, 111, 0.12),
      transparent 28rem
    ),
    radial-gradient(
      circle at bottom left,
      rgba(156, 191, 167, 0.1),
      transparent 26rem
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.96) 0%,
      rgba(248, 247, 243, 0.96) 100%
    );
}

/* ===== 方案總覽背景裝飾：控制右上角淡色光影 ===== */
.workflow-section::before {
  content: "";
  position: absolute;
  top: 3rem;
  right: -5rem;
  width: 20rem;
  height: 14rem;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(217, 178, 111, 0.16) 0%,
    transparent 68%
  );
  opacity: 0.5;
  pointer-events: none;
}

/* ===== 方案總覽背景線條：控制底部金色曲線 ===== */
.workflow-section::after {
  content: "";
  position: absolute;
  left: -8%;
  right: -8%;
  bottom: 2.25rem;
  height: 6rem;
  border-bottom: 1.5px solid rgba(217, 178, 111, 0.36);
  border-radius: 0 0 50% 50%;
  pointer-events: none;
}

/* ===== 方案總覽容器：手機版控制左右留白 ===== */
.workflow-container {
  position: relative;
  z-index: 2;
  width: min(100% - 2rem, 100%);
}

/* ===== 方案總覽標題區：手機版控制標題置中與間距 ===== */
.workflow-header {
  max-width: 52rem;
  margin: 0 auto 3rem;
  text-align: center;
}

/* ===== 方案總覽小標：控制金色小標與左右線條 ===== */
.workflow-eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  color: var(--color-accent);
  font-size: 0.92rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  margin-bottom: 0.35rem;
}

/* ===== 方案總覽小標線條：控制左右金色短線 ===== */
.workflow-eyebrow span {
  width: 2.25rem;
  height: 1px;
  background-color: rgba(217, 178, 111, 0.8);
}

/* ===== 方案總覽爪印：控制小標下方裝飾 ===== */
.workflow-paw {
  display: inline-flex;
  align-items: center;
  width: 1.1rem;
  height: 1.1rem;
  color: var(--color-accent);
  margin-bottom: 1.25rem;
}

/* ===== 方案總覽主標題：手機版控制大標題文字，避免太大 ===== */
.workflow-title {
  color: var(--color-primary);
  font-size: clamp(2rem, 9vw, 2.75rem);
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: 0.03em;
  margin-bottom: 1.25rem;
}

/* ===== 方案總覽說明文字：控制標題下方描述 ===== */
.workflow-desc {
  color: var(--color-muted);
  font-size: 0.98rem;
  line-height: 1.85;
  letter-spacing: 0.03em;
  margin: 0;
}

/* ===== 流程時間軸：手機版三階段直向排列 ===== */
.workflow-timeline {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 1.5rem;
}

/* ===== 流程時間軸底線：手機版隱藏水平線 ===== */
.workflow-timeline::before {
  display: none;
}

/* ===== 流程項目：手機版改成小卡式直向流程 ===== */
.workflow-step {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 1rem;
  min-width: 0;
  padding: 1.25rem;
  border-radius: 1.35rem;
  background-color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(230, 216, 189, 0.72);
}

/* ===== 流程 icon 外圈：手機版控制圓形圖示外框 ===== */
.workflow-icon-wrap {
  position: relative;
  width: 4.3rem;
  height: 4.3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(217, 178, 111, 0.58);
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12px 32px rgba(38, 50, 56, 0.06);
}

/* ===== 流程圖片 icon：控制方案總覽三個圖片 icon 顯示 ===== */
.workflow-icon-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

/* ===== 流程 icon 圓點裝飾：手機版隱藏避免擁擠 ===== */
.workflow-icon-wrap::after {
  display: none;
}

/* ===== 流程 icon：手機版控制圖示本體 ===== */
.workflow-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 0.75rem;
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 1.15rem;
  font-weight: 900;
}

/* ===== 流程文字內容：控制每階段文字區 ===== */
.workflow-step-content {
  min-width: 0;
}

/* ===== 流程編號：手機版控制 01、02、03 樣式 ===== */
.workflow-number {
  color: #b98b42;
  font-size: 1.15rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  margin-bottom: 0.15rem;
}

/* ===== 流程標題：手機版控制看診前中後文字 ===== */
.workflow-step h3 {
  color: var(--color-primary);
  font-size: 1.65rem;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: 0.04em;
  margin-bottom: 0.75rem;
}

/* ===== 流程標題下方虛線：控制階段分隔線 ===== */
.workflow-step h3::after {
  content: "";
  display: block;
  width: min(100%, 13rem);
  margin-top: 0.65rem;
  border-bottom: 1px dashed rgba(217, 178, 111, 0.65);
}

/* ===== 流程清單：控制每階段功能列表 ===== */
.workflow-list {
  list-style: none;
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
}

/* ===== 流程清單項目：控制文字與勾勾排列 ===== */
.workflow-list li {
  position: relative;
  padding-left: 1.65rem;
  color: var(--color-text);
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.6;
}

/* ===== 流程清單勾勾：控制金色圓形勾選圖示 ===== */
.workflow-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  top: 0.28rem;
  width: 1rem;
  height: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #b98b42;
  border: 1px solid rgba(217, 178, 111, 0.9);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 900;
}

/* ===== 流程箭頭：手機版改成向下箭頭感 ===== */
.workflow-arrow {
  position: relative;
  z-index: 2;
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: -0.25rem auto;
  color: #b98b42;
  background-color: rgba(255, 255, 255, 0.78);
  border: 2px solid rgba(217, 178, 111, 0.7);
  border-radius: 999px;
  box-shadow: 0 12px 28px rgba(38, 50, 56, 0.08);
  padding: 0.5rem;
  transform: rotate(90deg);
}

/* ===== 共用區塊：手機版控制主要內容區塊上下間距 ===== */
.features-section,
.benefits-section,
.pricing-section {
  padding: 4rem 0;
}

/* ===== 功能區背景：控制功能介紹背景色 ===== */
.features-section {
  background-color: var(--color-bg);
}

/* ===== 區塊標題：控制標題置中與寬度 ===== */
.section-header {
  max-width: 42rem;
  margin: 0 auto 2.5rem auto;
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

/* ===== 區塊主標題：手機版控制每區主標題 ===== */
.section-title {
  color: var(--color-primary);
  font-size: clamp(2rem, 9vw, 2.6rem);
  font-weight: 900;
  line-height: 1.25;
  margin-bottom: 1rem;
}

/* ===== 區塊描述：控制每區說明文字 ===== */
.section-desc {
  color: var(--color-muted);
  line-height: 1.8;
}

/* ===== 功能列表：手機版控制功能卡片排列 ===== */
.features-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

/* ===== 功能卡片：控制每個功能外觀 ===== */
.feature-card {
  padding: 1.5rem;
  border-radius: 1.35rem;
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
  width: 2.25rem;
  height: 2.25rem;
  color: var(--color-accent);
  margin-bottom: 1rem;
}

/* ===== 功能標題：控制功能卡片標題 ===== */
.feature-card h3 {
  color: var(--color-primary);
  font-size: 1.2rem;
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

/* ===== 優勢排版：手機版上下排列 ===== */
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

/* ===== 優勢統計：手機版上下排列 ===== */
.benefits-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* ===== 統計卡片：控制數據卡片外觀 ===== */
.stat-card {
  padding: 1.5rem;
  border-radius: 1.35rem;
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  box-shadow: 0 14px 40px rgba(38, 50, 56, 0.08);
}

/* ===== 統計數字：控制數據重點樣式 ===== */
.stat-card strong {
  display: block;
  color: var(--color-accent);
  font-size: 2.25rem;
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
  gap: 1.25rem;
}

/* ===== 價格卡片：控制每個方案外觀 ===== */
.pricing-card {
  position: relative;
  padding: 1.5rem;
  border-radius: 1.35rem;
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
  font-size: 1.4rem;
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
  font-size: 1.8rem;
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
  padding: 4rem 0;
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

/* ===== CTA 標題：手機版控制底部主標 ===== */
.cta-content h2 {
  font-size: clamp(2rem, 9vw, 2.6rem);
  line-height: 1.25;
  margin-bottom: 1rem;
}

/* ===== CTA 描述：控制底部說明文字 ===== */
.cta-content p {
  max-width: 42rem;
  margin: 0 auto 2rem auto;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
}

/* ===== 平板版：768px 以上調整欄位與間距 ===== */
@media (min-width: 48em) {
  /* ===== 平板版容器：控制左右留白 ===== */
  .container {
    width: min(100% - 3rem, 1120px);
  }

  /* ===== 平板版痛點區塊：控制內容間距 ===== */
  .pain-points-panel {
    gap: 3rem;
  }

  /* ===== 平板版方案總覽容器：控制左右留白 ===== */
  .workflow-container {
    width: min(100% - 3rem, 100%);
  }

  /* ===== 平板版流程時間軸：維持直向排列，避免太擠 ===== */
  .workflow-timeline {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  /* ===== 平板版流程時間軸線：隱藏水平線 ===== */
  .workflow-timeline::before {
    display: none;
  }

  /* ===== 平板版流程項目：保持卡片式直向閱讀 ===== */
  .workflow-step {
    grid-template-columns: auto 1fr;
    padding: 1.5rem;
    border-radius: 1.5rem;
    background-color: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(230, 216, 189, 0.72);
  }

  /* ===== 平板版流程箭頭：控制向下箭頭 ===== */
  .workflow-arrow {
    margin: -0.25rem auto;
    transform: rotate(90deg);
  }

  /* ===== 平板版功能卡片：控制兩欄排列 ===== */
  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* ===== 平板版價格方案：控制三欄排列 ===== */
  .pricing-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  /* ===== 平板版統計卡片：控制三欄排列 ===== */
  .benefits-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* ===== 桌機版：1024px 以上調整成桌機排版 ===== */
@media (min-width: 64em) {
  /* ===== 桌機版 HERO：控制背景圖與高度 ===== */
  .hero {
    padding: 0 0 2rem;
  }

  /* ===== 桌機版 HERO 圖片區：控制桌機版背景遮罩 ===== */
  .hero-shell {
    min-height: calc(100vh - 4.5rem);
    border-bottom-left-radius: 50% 10%;
    border-bottom-right-radius: 50% 10%;
    background-image:
      linear-gradient(
        90deg,
        rgba(248, 247, 243, 0.98) 0%,
        rgba(248, 247, 243, 0.92) 32%,
        rgba(248, 247, 243, 0.5) 58%,
        rgba(248, 247, 243, 0.08) 100%
      ),
      url("/assets/image/Image1.png");
    background-position: center right;
  }

  /* ===== 桌機版 HERO 排版：控制左側文字寬度 ===== */
  .hero-grid {
    grid-template-columns: minmax(0, 42rem);
    min-height: calc(100vh - 4.5rem);
    padding: 6rem 0 7rem;
  }

  /* ===== 桌機版 HERO 標題：控制文字不要過大 ===== */
  .hero-title {
    font-size: clamp(2.4rem, 3.5vw, 3.7rem);
    letter-spacing: 0.05em;
  }

  /* ===== 桌機版 HERO 描述：控制描述大小 ===== */
  .hero-desc {
    font-size: 1.08rem;
    line-height: 1.9;
  }

  /* ===== 桌機版 HERO 按鈕：恢復橫向排列 ===== */
  .hero-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }

  /* ===== 桌機版按鈕：控制不滿版 ===== */
  .btn {
    width: auto;
    max-width: none;
    min-height: 3.65rem;
    padding: 0 1.45rem;
    font-size: 1rem;
  }

  /* ===== 桌機版按鈕 icon：控制尺寸 ===== */
  .btn-icon {
    width: 1.85rem;
    height: 1.85rem;
    font-size: 0.95rem;
  }

  /* ===== 桌機版按鈕箭頭：控制尺寸 ===== */
  .btn-arrow {
    font-size: 1.7rem;
  }

  /* ===== 桌機版痛點區塊：控制整體間距 ===== */
  .pain-points-section {
    padding: 5rem 0;
  }

  /* ===== 桌機版痛點容器：控制內容不要太窄 ===== */
  .pain-points-section .container {
    width: min(1400px, calc(100% - 4rem));
  }

  /* ===== 桌機版痛點排版：控制左說明右卡片 ===== */
  .pain-points-panel {
    grid-template-columns: 0.8fr 1.2fr;
    gap: 3.5rem;
  }

  /* ===== 桌機版痛點標題：控制不要太大 ===== */
  .pain-points-title {
    font-size: clamp(2.3rem, 3vw, 3.2rem);
    line-height: 1.22;
    letter-spacing: 0.04em;
  }

  /* ===== 桌機版痛點描述：控制文字寬度與大小 ===== */
  .pain-points-desc {
    font-size: 1rem;
    line-height: 1.85;
    max-width: 34rem;
  }

  /* ===== 桌機版痛點卡片：控制卡片尺寸 ===== */
  .pain-point-item {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: none;
    align-items: center;
    padding: 1.25rem 1.35rem;
    gap: 1.15rem;
  }

  /* ===== 桌機版痛點 icon 外圈：控制尺寸 ===== */
  .pain-point-visual {
    grid-area: auto;
    width: 4.8rem;
    height: 4.8rem;
  }

  /* ===== 桌機版痛點 icon：控制尺寸 ===== */
  .pain-point-icon {
    width: 2.8rem;
    height: 2.8rem;
    font-size: 1.15rem;
  }

  /* ===== 桌機版痛點內容：重置 grid-area ===== */
  .pain-point-content {
    grid-area: auto;
  }

  /* ===== 桌機版痛點編號：控制尺寸 ===== */
  .pain-point-number {
    width: 1.95rem;
    height: 1.95rem;
    font-size: 0.85rem;
  }

  /* ===== 桌機版痛點標題：控制不要太大 ===== */
  .pain-point-heading h3 {
    font-size: 1.22rem;
  }

  /* ===== 桌機版痛點描述：控制字級 ===== */
  .pain-point-content > p {
    font-size: 0.95rem;
    line-height: 1.75;
  }

  /* ===== 桌機版痛點清單：控制間距 ===== */
  .pain-point-checks {
    padding-top: 0.65rem;
    gap: 0.35rem;
  }

  /* ===== 桌機版痛點清單項目：控制字級 ===== */
  .pain-point-checks li {
    font-size: 0.92rem;
    line-height: 1.55;
  }

  /* ===== 桌機版痛點箭頭：顯示右側箭頭 ===== */
  .pain-point-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.1rem;
    height: 2.1rem;
    flex-shrink: 0;
    color: #b98b42;
    background-color: #fffaf0;
    border: 1px solid rgba(217, 178, 111, 0.45);
    border-radius: 999px;
    box-shadow: 0 8px 18px rgba(38, 50, 56, 0.08);
    font-size: 1.55rem;
    line-height: 1;
  }

  /* ===== 桌機版方案總覽區塊：控制上下間距 ===== */
  .workflow-section {
    padding: 5rem 0;
  }

  /* ===== 桌機版方案總覽容器：控制內容寬度 ===== */
  .workflow-container {
    width: min(1400px, calc(100% - 4rem));
  }

  /* ===== 桌機版方案總覽標題區：控制標題不要太大 ===== */
  .workflow-header {
    max-width: 58rem;
    margin: 0 auto 3.5rem;
  }

  /* ===== 桌機版方案總覽標題：控制桌機字體不要過大 ===== */
  .workflow-title {
    font-size: clamp(2.35rem, 3.5vw, 3.5rem);
    line-height: 1.22;
    letter-spacing: 0.045em;
  }

  /* ===== 桌機版方案總覽描述：控制字級 ===== */
  .workflow-desc {
    font-size: 1rem;
    line-height: 1.85;
  }

  /* ===== 桌機版流程時間軸：控制看診前、中、後左中右排列 ===== */
  .workflow-timeline {
    display: grid;
    grid-template-columns: 1fr auto 1fr auto 1fr;
    align-items: center;
    gap: 1.25rem;
  }

  

  /* ===== 桌機版流程項目：取消手機卡片感，改成開放式排列 ===== */
  .workflow-step {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: start;
    gap: 1.15rem;
    padding: 0;
    background-color: transparent;
    border: none;
    border-radius: 0;
  }

  /* ===== 桌機版流程 icon 外圈：控制尺寸不要太大 ===== */
  .workflow-icon-wrap {
    width: 5.8rem;
    height: 5.8rem;
  }

  /* ===== 桌機版流程 icon 裝飾：顯示小金點 ===== */
  .workflow-icon-wrap::after {
    content: "";
    display: block;
    position: absolute;
    right: 0.45rem;
    bottom: 0.95rem;
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 999px;
    background-color: var(--color-accent);
    box-shadow: -4.8rem 0.12rem 0 rgba(217, 178, 111, 0.65);
  }

  /* ===== 桌機版流程 icon：控制尺寸 ===== */
  .workflow-icon {
    width: 3.55rem;
    height: 3.55rem;
    border-radius: 0.85rem;
    font-size: 1.35rem;
  }

  /* ===== 桌機版流程編號：控制字級 ===== */
  .workflow-number {
    font-size: 1.35rem;
    margin-bottom: 0.25rem;
  }

  /* ===== 桌機版流程標題：控制不要過大 ===== */
  .workflow-step h3 {
    font-size: clamp(1.8rem, 2.4vw, 2.4rem);
    line-height: 1.2;
    letter-spacing: 0.045em;
    margin-bottom: 0.9rem;
  }

  /* ===== 桌機版流程標題分隔線：控制間距 ===== */
  .workflow-step h3::after {
    margin-top: 0.85rem;
  }

  /* ===== 桌機版流程清單：控制間距 ===== */
  .workflow-list {
    gap: 0.7rem;
  }

  /* ===== 桌機版流程清單文字：控制字級 ===== */
  .workflow-list li {
    font-size: 0.98rem;
    line-height: 1.55;
  }

  /* ===== 桌機版流程箭頭：恢復水平箭頭 ===== */
  .workflow-arrow {
    width: 3rem;
    height: 3rem;
    margin: 0;
    transform: none;
    font-size: 1.6rem;
  }

  /* ===== 桌機版功能卡片：控制三欄排列 ===== */
  .features-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  /* ===== 桌機版功能卡片：控制內距 ===== */
  .feature-card {
    padding: 1.75rem;
  }

  /* ===== 桌機版優勢區塊：控制左右欄位 ===== */
  .benefits-grid {
    grid-template-columns: 1fr 1fr;
  }

  /* ===== 桌機版優勢統計：控制右側統計改回單欄 ===== */
  .benefits-stats {
    grid-template-columns: 1fr;
  }

  /* ===== 桌機版價格方案：控制三欄排列 ===== */
  .pricing-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* ===== 大螢幕版：1280px 以上控制寬版內容 ===== */
@media (min-width: 80em) {
  /* ===== 大螢幕痛點區塊：控制寬版內容 ===== */
  .pain-points-section .container {
    width: min(1500px, calc(100% - 5rem));
  }

  /* ===== 大螢幕痛點區塊：控制左右比例 ===== */
  .pain-points-panel {
    grid-template-columns: 0.78fr 1.22fr;
    gap: 4rem;
  }

  /* ===== 大螢幕方案總覽：控制內容寬度 ===== */
  .workflow-container {
    width: min(1500px, calc(100% - 5rem));
  }

  /* ===== 大螢幕方案總覽：控制流程間距 ===== */
  .workflow-timeline {
    gap: 1.75rem;
  }

  /* ===== 大螢幕方案總覽主標題：控制不要過大 ===== */
  .workflow-title {
    font-size: clamp(2.5rem, 3vw, 3.7rem);
  }

  /* ===== 大螢幕流程標題：控制不要過大 ===== */
  .workflow-step h3 {
    font-size: clamp(1.9rem, 2.2vw, 2.5rem);
  }
}
</style>
