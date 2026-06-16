<template>
  <!-- ===== 頁面主容器：控制整個寵物醫療系統介紹網站 ===== -->
  <div class="home-page">
    <!-- ===== HERO 首頁區塊：控制首頁主視覺與右側系統示意圖 ===== -->
<section class="hero" id="home">
  <div class="hero-shell">
    <div class="container hero-grid">
      <!-- ===== HERO 左側內容：控制主標題、描述、賣點與 CTA 按鈕 ===== -->
      <article class="hero-content">
        <p class="hero-eyebrow">{{ t('home.heroEyebrow') }}</p>

        <h1 class="hero-title">{{ t('home.heroTitle') }}</h1>

        <p class="hero-desc">
          {{ t('home.heroDesc') }}
        </p>

        <!-- ===== HERO 賣點標籤：控制主標下方四個重點小膠囊 ===== -->
        <ul class="hero-badges" role="list">
          <li>
            <Icon name="fa6-solid:calendar-check" class="hero-badge-icon" aria-hidden="true" />
            <span>線上預約</span>
          </li>

          <li>
            <Icon name="fa6-solid:file-medical" class="hero-badge-icon" aria-hidden="true" />
            <span>電子病歷</span>
          </li>

          <li>
            <Icon name="fa6-solid:bell" class="hero-badge-icon" aria-hidden="true" />
            <span>健康提醒</span>
          </li>

          <li>
            <Icon name="fa6-solid:paw" class="hero-badge-icon" aria-hidden="true" />
            <span>收費結算</span>
          </li>
        </ul>

        <div class="hero-actions">
          <!-- ===== 查看功能按鈕：導向功能介紹頁 function.vue ===== -->
          <NuxtLink to="/function" class="btn btn-primary">
            <Icon
              name="fa6-solid:table-cells-large"
              class="btn-icon"
              aria-hidden="true"
            />
            <span>{{ t('home.viewFeatures') }}</span>
            <span class="btn-arrow" aria-hidden="true">›</span>
          </NuxtLink>

          <!-- ===== 查看方案按鈕：導向價格方案頁 price.vue ===== -->
          <NuxtLink to="/price" class="btn btn-outline">
            <Icon
              name="fa6-solid:tag"
              class="btn-icon"
              aria-hidden="true"
            />
            <span>{{ t('home.viewPlans') }}</span>
            <span class="btn-arrow" aria-hidden="true">›</span>
          </NuxtLink>
        </div>
      </article>

      <!-- ===== HERO 右側圖片：控制系統儀表板與寵物示意圖 ===== -->
      <aside class="hero-visual" aria-hidden="true">
        <img
          src="/assets/image/Image11.png"
          alt=""
          class="hero-visual-img"
        />
      </aside>
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
            {{ t('home.commonChallenges') }}
          </p>

          <h2 class="pain-points-title">
            {{ t('home.painTitleLine1') }}<br />
            {{ t('home.painTitleLine2') }}
          </h2>

          <div class="pain-points-divider">
            <span></span>
            <strong
              ><Icon
                name="fa6-solid:paw"
                class="divider-paw"
                aria-hidden="true"
            /></strong>
            <span></span>
          </div>

          <p class="pain-points-desc">
            {{ t('home.painDesc') }}
          </p>

          <NuxtLink to="/function" class="pain-points-link">
            <span>{{ t('home.learnSolution') }}</span>
            <strong aria-hidden="true">›</strong>
          </NuxtLink>
        </article>

        <!-- ===== 右側痛點卡片列表：控制三大常見痛點 ===== -->
        <ul class="pain-points-list" role="list">
          <!-- ===== 痛點卡片 1：控制預約與掛號問題 ===== -->
          <li class="pain-point-item">
            <div class="pain-point-visual">
              <Icon
                name="fa6-solid:calendar-check"
                class="pain-point-icon"
                aria-hidden="true"
              />
            </div>

            <article class="pain-point-content">
              <div class="pain-point-heading">
                <span class="pain-point-number">01</span>
                <h3>{{ t('home.pain1Title') }}</h3>
              </div>

              <ul class="pain-point-checks" role="list">
                <li>{{ t('home.pain1Item1') }}</li>
                <li>{{ t('home.pain1Item2') }}</li>
              </ul>
            </article>

            <span class="pain-point-arrow" aria-hidden="true">›</span>
          </li>

          <!-- ===== 痛點卡片 2：控制病歷與檢查紀錄問題 ===== -->
          <li class="pain-point-item">
            <div class="pain-point-visual">
              <Icon
                name="fa6-solid:file-medical"
                class="pain-point-icon"
                aria-hidden="true"
              />
            </div>

            <article class="pain-point-content">
              <div class="pain-point-heading">
                <span class="pain-point-number">02</span>
                <h3>{{ t('home.pain2Title') }}</h3>
              </div>

              <ul class="pain-point-checks" role="list">
                <li>{{ t('home.pain2Item1') }}</li>
                <li>{{ t('home.pain2Item2') }}</li>
              </ul>
            </article>

            <span class="pain-point-arrow" aria-hidden="true">›</span>
          </li>

          <!-- ===== 痛點卡片 3：控制收費、庫存與報表問題 ===== -->
          <li class="pain-point-item">
            <div class="pain-point-visual">
              <Icon
                name="fa6-solid:chart-simple"
                class="pain-point-icon"
                aria-hidden="true"
              />
            </div>

            <article class="pain-point-content">
              <div class="pain-point-heading">
                <span class="pain-point-number">03</span>
                <h3>{{ t('home.pain3Title') }}</h3>
              </div>

              <ul class="pain-point-checks" role="list">
                <li>{{ t('home.pain3Item1') }}</li>
                <li>{{ t('home.pain3Item2') }}</li>
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
            {{ t('home.coreFeatures') }}
            <span></span>
          </p>

          <div class="workflow-paw" aria-hidden="true">
            <Icon name="fa6-solid:paw" />
          </div>

          <h2 class="workflow-title">{{ t('home.workflowTitle') }}</h2>

          <p class="workflow-desc">
            {{ t('home.workflowDesc') }}
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

              <h3>{{ t('home.preVisit') }}</h3>

              <ul class="workflow-list" role="list">
                <li>{{ t('home.preVisit1') }}</li>
                <li>{{ t('home.preVisit2') }}</li>
                <li>{{ t('home.preVisit3') }}</li>
              </ul>
            </div>
          </article>

          <!-- ===== 流程箭頭 1：控制看診前到看診中的連接 ===== -->
          <div class="workflow-arrow" aria-hidden="true">
            <Icon name="fa6-solid:arrow-right" />
          </div>

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

              <h3>{{ t('home.duringVisit') }}</h3>

              <ul class="workflow-list" role="list">
                <li>{{ t('home.duringVisit1') }}</li>
                <li>{{ t('home.duringVisit2') }}</li>
                <li>{{ t('home.duringVisit3') }}</li>
              </ul>
            </div>
          </article>

          <!-- ===== 流程箭頭 2：控制看診中到看診後的連接 ===== -->
          <div class="workflow-arrow" aria-hidden="true">
            <Icon name="fa6-solid:arrow-right" />
          </div>

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

              <h3>{{ t('home.afterVisit') }}</h3>

              <ul class="workflow-list" role="list">
                <li>{{ t('home.afterVisit1') }}</li>
                <li>{{ t('home.afterVisit2') }}</li>
                <li>{{ t('home.afterVisit3') }}</li>
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
          <p class="section-eyebrow">{{ t('home.whyChooseUs') }}</p>
          <h2 class="section-title">{{ t('home.whyChooseTitle') }}</h2>

          <p class="benefits-desc">
            {{ t('home.whyChooseDesc') }}
          </p>

          <ul class="benefits-list" role="list">
            <li>✓ {{ t('home.why1') }}</li>
            <li>✓ {{ t('home.why2') }}</li>
            <li>✓ {{ t('home.why3') }}</li>
            <li>✓ {{ t('home.why4') }}</li>
          </ul>
        </article>

        <!-- ===== 右側數據區塊：控制產品成效資料 ===== -->
        <aside class="benefits-stats" :aria-label="t('home.statsAria')">
          <div class="stat-card">
            <strong>{{ t('home.stat1Value') }}</strong>
            <span>{{ t('home.stat1Label') }}</span>
          </div>

          <div class="stat-card">
            <strong>{{ t('home.stat2Value') }}</strong>
            <span>{{ t('home.stat2Label') }}</span>
          </div>

          <div class="stat-card">
            <strong>{{ t('home.stat3Value') }}</strong>
            <span>{{ t('home.stat3Label') }}</span>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

// ===== SEO 設定區塊：控制首頁標題、描述、搜尋引擎資訊 =====
useHead(() => ({
  title: t("seo.index.title"),
  meta: [
    {
      name: "description",
      content: t("seo.index.description"),
    },
    {
      name: "keywords",
      content:
        "寵物醫療系統, 動物醫院系統, 獸醫系統, 電子病歷, 預約掛號, 寵物診所管理系統",
    },
    {
      property: "og:title",
      content: t("seo.index.title"),
    },
    {
      property: "og:description",
      content: t("seo.index.description"),
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
}));
</script>

<style scoped>
/* ===== 色系設定：控制整個首頁的主題顏色，精品深藍 × 鼠尾草綠 × 金色 ===== */
.home-page {
  --color-primary: #2e4a62;
  --color-primary-dark: #1f3548;
  --color-secondary: #9cbfa7;
  --color-accent: #d9b26f;
  --color-bg: #f8f7f3;
  --color-card: #ffffff;
  --color-text: #263238;
  --color-muted: #6f7a80;
  --color-border: #e6d8bd;
  --color-soft: #f3efe6;

  color: var(--color-text);
  background-color: var(--color-bg);
  overflow-x: hidden;
}

/* ===== 全站盒模型：控制 padding / border 不會把寬度撐爆 ===== */
.home-page *,
.home-page *::before,
.home-page *::after {
  box-sizing: border-box;
}

/* ===== 圖片自適應：控制 img、svg、video 不超出容器 ===== */
.home-page img,
.home-page svg,
.home-page video {
  max-width: 100%;
  height: auto;
  display: block;
}

/* ===== 共用容器：手機優先，控制內容左右留白與最大寬度 ===== */
.container {
  width: min(100% - 2rem, 1120px);
  margin-inline: auto;
}

/* ============================================================
   HERO 區塊：改成左文案、右側 Image11.png 示意圖
   ============================================================ */

/* ===== HERO 外層：控制首頁主視覺外部區塊 ===== */
.hero {
  position: relative;
  padding: 0;
  overflow: hidden;
  background:
    radial-gradient(
      circle at top right,
      rgba(217, 178, 111, 0.18),
      transparent 30rem
    ),
    radial-gradient(
      circle at bottom left,
      rgba(155, 180, 215, 0.18),
      transparent 28rem
    ),
    linear-gradient(
      135deg,
      #fffaf3 0%,
      #f8f7f3 48%,
      #fff3df 100%
    );
}

/* ===== HERO 主視覺外框：取消原本背景圖，改成左右排版 ===== */
.hero-shell {
  position: relative;
  min-height: auto;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: transparent;
  border-radius: 0;
}

/* ===== HERO 柔和背景光暈：控制右上角淡金色氛圍 ===== */
.hero-shell::before {
  content: "";
  position: absolute;
  top: 3rem;
  right: -8rem;
  width: 28rem;
  height: 28rem;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(217, 178, 111, 0.2) 0%,
    rgba(217, 178, 111, 0.08) 38%,
    transparent 70%
  );
  pointer-events: none;
}

/* ===== HERO 底部淡色過渡：控制底部微光 ===== */
.hero-shell::after {
  content: "";
  position: absolute;
  left: -10%;
  right: -10%;
  bottom: -4rem;
  height: 8rem;
  border-radius: 50% 50% 0 0;
  background: rgba(255, 255, 255, 0.52);
  pointer-events: none;
}

/* ===== HERO 排版：手機優先，文字在上、圖片在下 ===== */
.hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 2.25rem;
  width: min(100% - 2rem, 1200px);
  min-height: auto;
  padding: 5.5rem 0 3rem;
  margin-inline: auto;
}

/* ===== HERO 文字內容：控制左側文字區塊 ===== */
.hero-content {
  position: relative;
  z-index: 2;
  width: min(100%, 36rem);
  max-width: 100%;
}

/* ===== HERO 小標：控制主標上方說明文字 ===== */
.hero-eyebrow {
  color: var(--color-accent);
  font-size: 0.86rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 0.95rem;
}

/* ===== HERO 標題：手機版控制首頁主標題大小 ===== */
.hero-title {
  color: var(--color-primary-dark);
  font-size: clamp(2.25rem, 9vw, 3.2rem);
  line-height: 1.18;
  font-weight: 900;
  letter-spacing: 0.035em;
  margin-bottom: 1.25rem;
  text-shadow: 0 3px 10px rgba(46, 74, 98, 0.1);
}

/* ===== HERO 描述：控制首頁說明文字 ===== */
.hero-desc {
  color: rgba(38, 50, 56, 0.62);
  font-size: 1rem;
  line-height: 1.9;
  letter-spacing: 0.03em;
  max-width: 36rem;
  margin-bottom: 1.4rem;
  font-weight: 700;
}

/* ===== HERO 賣點標籤：手機版兩欄排列 ===== */
.hero-badges {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  max-width: 32rem;
  padding: 0;
  margin: 0 0 1.75rem;
}

/* ===== HERO 單一賣點：控制膠囊樣式 ===== */
.hero-badges li {
  min-width: 0;
  min-height: 2.35rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0 0.85rem;
  border-radius: 999px;
  color: rgba(46, 74, 98, 0.82);
  background-color: rgba(255, 255, 255, 0.68);
  box-shadow: 0 0.65rem 1.5rem rgba(38, 50, 56, 0.06);
  font-size: 0.88rem;
  font-weight: 800;
  white-space: nowrap;
}

/* ===== HERO 賣點 icon：控制膠囊左側圖示 ===== */
.hero-badge-icon {
  width: 0.95rem;
  height: 0.95rem;
  color: var(--color-accent);
  flex-shrink: 0;
}

/* ===== HERO 按鈕區：手機版控制按鈕上下排列 ===== */
.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.85rem;
  width: 100%;
}

/* ===== 共用按鈕：手機版控制所有按鈕基礎樣式 ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  width: 100%;
  max-width: 18rem;
  min-height: 3.35rem;
  padding: 0 1.25rem;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.98rem;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: 0.2s ease;
}

/* ===== 按鈕 icon：控制按鈕左側圖示樣式 ===== */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.55rem;
  height: 1.55rem;
  color: currentColor;
  border: none;
  border-radius: 0;
  padding: 0;
  flex-shrink: 0;
}

/* ===== 按鈕箭頭：控制按鈕右側箭頭 ===== */
.btn-arrow {
  font-size: 1.45rem;
  line-height: 1;
  margin-left: 0.1rem;
}

/* ===== 主要按鈕：控制深藍實心按鈕 ===== */
.btn-primary {
  color: #ffffff;
  background: linear-gradient(
    135deg,
    var(--color-primary-dark) 0%,
    #0f2538 100%
  );
  border: 1px solid rgba(31, 53, 72, 0.92);
  box-shadow:
    0 16px 34px rgba(31, 53, 72, 0.22),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

/* ===== 主要按鈕滑過：控制深藍按鈕互動效果 ===== */
.btn-primary:hover {
  background: linear-gradient(
    135deg,
    #0f2538 0%,
    var(--color-primary-dark) 100%
  );
  transform: translateY(-2px);
}

/* ===== 外框按鈕：控制白底深藍外框按鈕 ===== */
.btn-outline {
  color: var(--color-primary-dark);
  background-color: rgba(255, 255, 255, 0.64);
  border: 1.5px solid rgba(31, 53, 72, 0.42);
  box-shadow: 0 12px 28px rgba(38, 50, 56, 0.08);
}

/* ===== 外框按鈕滑過：控制白底深藍外框互動效果 ===== */
.btn-outline:hover {
  color: var(--color-primary-dark);
  background-color: rgba(255, 255, 255, 0.92);
  border-color: rgba(31, 53, 72, 0.72);
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

/* ===== HERO 右側圖片區：手機版顯示在文字下方 ===== */
.hero-visual {
  position: relative;
  z-index: 1;
  width: min(100%, 38rem);
  margin-inline: auto;
}

/* ===== HERO 右側圖片：控制 Image11.png 完整顯示，不裁切 ===== */
.hero-visual-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 2rem 3.5rem rgba(15, 37, 56, 0.08));
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
  opacity: 0.55;
}

/* ===== 痛點區塊專用容器：手機版控制左右留白 ===== */
.pain-points-section .container {
  width: min(100% - 2rem, 1120px);
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
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 0;
  margin: 0;
}

/* ===== 痛點卡片：手機版控制 icon 與標題在同一列 ===== */
.pain-point-item {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-areas:
    "icon content"
    "icon content";
  align-items: flex-start;
  gap: 1rem;
  min-width: 0;
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
  opacity: 0.55;
}

/* ===== 方案總覽容器：手機版控制左右留白與最大寬度 ===== */
.workflow-container {
  position: relative;
  z-index: 2;
  width: min(100% - 2rem, 1120px);
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
  justify-content: center;
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
  grid-template-columns: auto minmax(0, 1fr);
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
  flex-shrink: 0;
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
  min-width: 0;
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
  min-width: 0;
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

/* ============================================================
   平板版：768px 以上
   ============================================================ */
@media (min-width: 48em) {
  /* ===== 平板版容器：控制左右留白 ===== */
  .container {
    width: min(100% - 3rem, 1120px);
  }

  /* ===== 平板版共用區塊間距：控制首頁每個大區塊的上下距離 ===== */
  .pain-points-section,
  .workflow-section,
  .benefits-section,
  .features-section,
  .pricing-section {
    padding-block: 5rem;
  }

  /* ===== 平板版 HERO：左右排版開始成形 ===== */
  .hero-grid {
    width: min(100% - 3rem, 1200px);
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: 2rem;
    padding: 6.25rem 0 4rem;
  }

  /* ===== 平板版 HERO 左側內容：控制文字寬度 ===== */
  .hero-content {
    width: min(100%, 34rem);
  }

  /* ===== 平板版 HERO 按鈕：由上下排列改成橫向排列 ===== */
  .hero-actions {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  /* ===== 平板版按鈕：不再強制滿版 ===== */
  .btn {
    width: auto;
    max-width: none;
    min-height: 3.45rem;
    padding-inline: 1.35rem;
  }

  /* ===== 平板版 HERO 賣點：改成四個一排 ===== */
  .hero-badges {
    grid-template-columns: repeat(4, auto);
    justify-content: start;
    gap: 0.75rem;
  }

  /* ===== 平板版右側圖片：放大儀表板示意圖 ===== */
  .hero-visual {
    width: min(100%, 43rem);
    justify-self: end;
  }

  /* ===== 平板版痛點區塊：控制內容間距 ===== */
  .pain-points-panel {
    gap: 3rem;
  }

  /* ===== 平板版痛點卡片列表：前兩張並排，第三張滿版 ===== */
  .pain-points-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }

  /* ===== 平板版第三張痛點卡片：讓三張卡片視覺更平衡 ===== */
  .pain-point-item:nth-child(3) {
    grid-column: 1 / -1;
  }

  /* ===== 平板版痛點卡片：改成上 icon 下內容，避免二欄時過擠 ===== */
  .pain-point-item {
    grid-template-columns: 1fr;
    grid-template-areas:
      "icon"
      "content";
    gap: 1rem;
    padding: 1.5rem;
  }

  /* ===== 平板版痛點 icon：回到上方，讓卡片視覺更像功能卡 ===== */
  .pain-point-visual {
    grid-area: icon;
  }

  /* ===== 平板版痛點內容：控制文字區塊 ===== */
  .pain-point-content {
    grid-area: content;
  }

  /* ===== 平板版方案總覽容器：修正原本最大寬度過寬問題 ===== */
  .workflow-container {
    width: min(100% - 3rem, 1120px);
  }

  /* ===== 平板版流程區：三個流程卡片並排，箭頭隱藏 ===== */
  .workflow-timeline {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: stretch;
    gap: 1.25rem;
  }

  /* ===== 平板版流程箭頭：卡片並排後隱藏箭頭，避免破壞 grid ===== */
  .workflow-arrow {
    display: none;
  }

  /* ===== 平板版流程卡片：改成直向卡片，適合 iPad 寬度 ===== */
  .workflow-step {
    grid-template-columns: 1fr;
    align-content: start;
    gap: 1.25rem;
    padding: 1.5rem;
    border-radius: 1.5rem;
    background-color: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(230, 216, 189, 0.72);
    box-shadow: 0 14px 36px rgba(38, 50, 56, 0.06);
  }

  /* ===== 平板版流程 icon：控制卡片上方 icon 尺寸 ===== */
  .workflow-icon-wrap {
    width: 5rem;
    height: 5rem;
  }

  /* ===== 平板版流程標題：避免三欄時文字過大 ===== */
  .workflow-step h3 {
    font-size: clamp(1.45rem, 3vw, 1.85rem);
  }

  /* ===== 平板版功能卡片：控制兩欄排列 ===== */
  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* ===== 平板版優勢區塊：文字與統計左右排列 ===== */
  .benefits-grid {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.9fr);
    gap: 2.5rem;
  }

  /* ===== 平板版統計卡片：右側維持單欄，避免太扁 ===== */
  .benefits-stats {
    grid-template-columns: 1fr;
  }

  /* ===== 平板版價格方案：控制三欄排列 ===== */
  .pricing-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .hero-visual {
    position: relative;
    isolation: isolate;
    padding: 0;
    overflow: visible;
  }

  /* ===== Hero 圖片底層柔光：淡化圖片外框邊界 ===== */
  .hero-visual::before {
    content: "";
    position: absolute;
    inset: 8% 4% 2%;
    z-index: -1;
    border-radius: 3rem;
    background:
      radial-gradient(
        circle at 70% 45%,
        rgba(217, 178, 111, 0.22),
        transparent 58%
      ),
      radial-gradient(
        circle at 35% 65%,
        rgba(255, 255, 255, 0.8),
        transparent 62%
      );
    filter: blur(2.25rem);
    opacity: 0.9;
    pointer-events: none;
  }

  /* ===== Hero 右側圖片：用遮罩淡出圖片邊緣，避免方形邊框太生硬 ===== */
  .hero-visual-img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
    border-radius: 1.5rem;
    filter:
      drop-shadow(0 2rem 3.5rem rgba(15, 37, 56, 0.08))
      saturate(1.02);

    /* Safari / Chrome 用這段 */
    -webkit-mask-image:
      linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%),
      linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%);

    -webkit-mask-composite: source-in;

    /* Firefox / 標準語法備援 */
    mask-image:
      linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%),
      linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%);
    mask-composite: intersect;
  }
}

/* ============================================================
   桌機版：1024px 以上
   ============================================================ */
@media (min-width: 64em) {
   .hero-visual {
    width: min(100%, 50rem);
    justify-self: end;
    transform: translate(1.25rem, 0.25rem);
  }

  .hero-visual-img {
    opacity: 0.98;
  }
  /* ===== 桌機版 HERO：控制整體高度與留白 ===== */
  .hero {
    padding-bottom: 0;
  }

  /* ===== 桌機版 HERO 外框：接近參考圖的寬版 Hero ===== */
  .hero-shell {
    min-height: 42rem;
  }

  /* ===== 桌機版 HERO 排版：左文字、右示意圖 ===== */
  .hero-grid {
    grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
    gap: 3rem;
    min-height: 42rem;
    padding: 6.75rem 0 4.25rem;
  }

  /* ===== 桌機版 HERO 文字：控制左側文案區寬度 ===== */
  .hero-content {
    width: min(100%, 38rem);
  }

  /* ===== 桌機版 HERO 小標：接近參考圖金色小標 ===== */
  .hero-eyebrow {
    font-size: 0.92rem;
    letter-spacing: 0.12em;
    margin-bottom: 1rem;
  }

  /* ===== 桌機版 HERO 標題：桌機字級加大但限制上限 ===== */
  .hero-title {
    font-size: clamp(2.9rem, 3.6vw, 4rem);
    line-height: 1.2;
    letter-spacing: 0.04em;
  }

  /* ===== 桌機版 HERO 描述：提升閱讀性 ===== */
  .hero-desc {
    font-size: 1.05rem;
    line-height: 1.9;
    max-width: 36rem;
    margin-bottom: 1.5rem;
  }

  /* ===== 桌機版右側圖片：控制 Image11.png 大小與位置 ===== */
  .hero-visual {
    width: min(100%, 48rem);
    justify-self: end;
    transform: translateY(0.5rem);
  }

  /* ===== 桌機版按鈕：尺寸略放大 ===== */
  .btn {
    min-height: 3.55rem;
    padding-inline: 1.55rem;
    font-size: 1rem;
  }

  /* ===== 桌機版按鈕 icon：控制尺寸 ===== */
  .btn-icon {
    width: 1.1rem;
    height: 1.1rem;
  }

  /* ===== 桌機版按鈕箭頭：控制尺寸 ===== */
  .btn-arrow {
    font-size: 1.55rem;
  }

  /* ===== 桌機版痛點區塊：拉開上下距離 ===== */
  .pain-points-section {
    padding-block: 6rem;
  }

  /* ===== 桌機版痛點容器：控制最大寬度，不要滿到太寬 ===== */
  .pain-points-section .container {
    width: min(100% - 4rem, 1280px);
  }

  /* ===== 桌機版痛點排版：左說明、右卡片 ===== */
  .pain-points-panel {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    align-items: center;
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

  /* ===== 桌機版痛點卡片列表：恢復單欄，像清單式重點呈現 ===== */
  .pain-points-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  /* ===== 桌機版第三張痛點：取消平板滿版設定 ===== */
  .pain-point-item:nth-child(3) {
    grid-column: auto;
  }

  /* ===== 桌機版痛點卡片：icon、內容、箭頭橫向排列 ===== */
  .pain-point-item {
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas: none;
    align-items: center;
    padding: 1.35rem 1.5rem;
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

  /* ===== 桌機版痛點內容：取消 grid-area ===== */
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

  /* ===== 桌機版痛點箭頭：桌機顯示右側箭頭 ===== */
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

  /* ===== 桌機版流程區塊：放大上下距離 ===== */
  .workflow-section {
    padding-block: 6rem;
  }

  /* ===== 桌機版流程容器：控制最大寬度 ===== */
  .workflow-container {
    width: min(100% - 4rem, 1280px);
  }

  /* ===== 桌機版流程標題區：控制文字最大寬度 ===== */
  .workflow-header {
    max-width: 58rem;
    margin-bottom: 3.75rem;
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

  /* ===== 桌機版流程時間軸：三階段與箭頭水平排列 ===== */
  .workflow-timeline {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 1.25rem;
  }

  /* ===== 桌機版流程箭頭：恢復顯示水平箭頭 ===== */
  .workflow-arrow {
    display: inline-flex;
    width: 3rem;
    height: 3rem;
    margin: 0;
    transform: none;
    font-size: 1.5rem;
  }

  /* ===== 桌機版流程卡片：取消平板卡片感，改成開放式流程 ===== */
  .workflow-step {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
    gap: 1.15rem;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
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

  /* ===== 桌機版流程編號：控制字級 ===== */
  .workflow-number {
    font-size: 1.35rem;
    margin-bottom: 0.25rem;
  }

  /* ===== 桌機版流程標題：桌機加大但限制上限 ===== */
  .workflow-step h3 {
    font-size: clamp(1.8rem, 2.4vw, 2.35rem);
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
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.8fr);
    gap: 4rem;
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

/* ============================================================
   大桌機版：1280px 以上
   ============================================================ */
@media (min-width: 80em) {
   .hero-visual {
    width: min(100%, 53rem);
    transform: translate(1.75rem, 0.25rem);
  }
  /* ===== 大桌機容器：首頁主要內容最大寬度 ===== */
  .container {
    width: min(100% - 5rem, 1200px);
  }

  /* ===== 大桌機痛點容器：痛點區塊可稍微寬一點 ===== */
  .pain-points-section .container {
    width: min(100% - 5rem, 1360px);
  }

  /* ===== 大桌機流程容器：流程區塊可稍微寬一點 ===== */
  .workflow-container {
    width: min(100% - 5rem, 1360px);
  }

  /* ===== 大桌機痛點排版：控制左右比例 ===== */
  .pain-points-panel {
    grid-template-columns: minmax(0, 0.78fr) minmax(0, 1.22fr);
    gap: 4rem;
  }

  /* ===== 大桌機流程時間軸：拉開流程間距 ===== */
  .workflow-timeline {
    gap: 1.75rem;
  }

  /* ===== 大桌機 HERO 標題：限制最大尺寸，避免 1440 以上過大 ===== */
  .hero-title {
    font-size: clamp(3.2rem, 3.4vw, 4.15rem);
  }

  /* ===== 大桌機 HERO 右側圖片：放大但不超出畫面 ===== */
  .hero-visual {
    width: min(100%, 52rem);
  }

  /* ===== 大桌機流程標題：限制最大尺寸 ===== */
  .workflow-step h3 {
    font-size: clamp(1.9rem, 2vw, 2.45rem);
  }
}

/* ============================================================
   Hero 右側圖片修正
   1. 手機版隱藏圖片
   2. 桌機版讓 Image11.png 邊緣與背景融合
   ============================================================ */

/* ===== 手機版 Hero：隱藏右側示意圖，只保留文字與按鈕 ===== */
@media (max-width: 47.99em) {
  .hero-visual {
    display: none;
  }

  /* ===== 手機版 Hero 排版：圖片隱藏後，縮短下方空白 ===== */
  .hero-grid {
    gap: 0;
    padding: 5.5rem 0 4rem;
  }

  /* ===== 手機版 Hero 內容：避免文字區太窄 ===== */
  .hero-content {
    width: min(100%, 34rem);
  }
}

/* ============================================================
   動畫偏好：使用者若設定減少動畫，關閉 hover 位移
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .btn,
  .pain-point-item,
  .feature-card,
  .btn-primary:hover,
  .btn-outline:hover,
  .btn-secondary:hover,
  .btn-plan:hover,
  .pain-point-item:hover,
  .feature-card:hover,
  .pain-points-link:hover {
    transition: none;
    transform: none;
  }
}
</style>
