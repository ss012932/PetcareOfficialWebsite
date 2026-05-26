<template>
  <!-- ===== 功能介紹頁面：控制整個功能介紹頁內容 ===== -->
  <main class="function-page">
    <!-- ===== 頁面主視覺：控制功能介紹標題區與 Hero 圖片 ===== -->
    <section class="function-hero">
      <!-- ===== Hero 背景圖片：控制功能介紹頁主視覺照片 ===== -->
      <img
        src="~/assets/image/Image2.png"
        alt="寵物醫療管理系統功能介紹"
        class="function-hero-image"
      />

      <!-- ===== Hero 深色遮罩：讓文字在圖片上更清楚 ===== -->
      <div class="function-hero-overlay" aria-hidden="true"></div>

      <!-- ===== Hero 文字內容：控制標題與說明 ===== -->
      <div class="container function-hero-container">
        <p class="section-eyebrow">FEATURES</p>

        <h1 class="function-title">功能介紹</h1>

        <p class="function-desc">
           從預約門診、病歷照護、批價收費、庫存藥品到人事權限與多分店營運，協助動物醫院建立完整的數位化管理流程。
        </p>
      </div>
    </section>

    <!-- ===== 功能快捷導覽：點擊後快速導到對應功能區塊 ===== -->
    <section class="feature-anchor-section" aria-label="功能快捷導覽">
      <div class="container">
        <nav class="feature-anchor-panel" aria-label="功能分類導覽">
          <!-- ===== 快捷按鈕：導到預約排程管理 ===== -->
          <a href="#appointment" class="feature-anchor-item">
            <span class="feature-anchor-icon">
              <img
                src="~/assets/image/icon6.png"
                alt="預約排程"
                class="feature-anchor-icon-img"
              />
            </span>

            <span class="feature-anchor-text"> 預約門診 </span>
          </a>

          <!-- ===== 快捷按鈕：導到電子病歷管理 ===== -->
          <a href="#medical-record" class="feature-anchor-item">
            <span class="feature-anchor-icon">
              <img
                src="~/assets/image/icon5.png"
                alt="電子病歷"
                class="feature-anchor-icon-img"
              />
            </span>

            <span class="feature-anchor-text"> 病歷住院 </span>
          </a>

          <!-- ===== 快捷按鈕：導到飼主與寵物資料 ===== -->
          <a href="#pet-profile" class="feature-anchor-item">
            <span class="feature-anchor-icon">
              <img
                src="~/assets/image/icon9.png"
                alt="寵物資料"
                class="feature-anchor-icon-img"
              />
            </span>

            <span class="feature-anchor-text"> 飼主寵物 </span>
          </a>

          <!-- ===== 快捷按鈕：導到收費與帳務管理 ===== -->
          <a href="#billing" class="feature-anchor-item">
            <span class="feature-anchor-icon">
              <img
                src="~/assets/image/icon8.png"
                alt="收費帳務"
                class="feature-anchor-icon-img"
              />
            </span>

            <span class="feature-anchor-text"> 批價收費 </span>
          </a>

          <!-- ===== 快捷按鈕：導到藥品與庫存管理 ===== -->
          <a href="#inventory" class="feature-anchor-item">
            <span class="feature-anchor-icon">
              <img
                src="~/assets/image/icon7.png"
                alt="藥品庫存"
                class="feature-anchor-icon-img"
              />
            </span>

            <span class="feature-anchor-text"> 藥品庫存 </span>
          </a>

          <!-- ===== 快捷按鈕：導到營運報表分析 ===== -->
          <a href="#analytics" class="feature-anchor-item">
            <span class="feature-anchor-icon">
              <img
                src="~/assets/image/icon4.png"
                alt="報表分析"
                class="feature-anchor-icon-img"
              />
            </span>

            <span class="feature-anchor-text"> 營運分析 </span>
          </a>
          <!-- ===== 快捷按鈕：導到人事、角色與權限管理 ===== -->
          <a href="#staff-permission" class="feature-anchor-item">
            <span class="feature-anchor-icon">
              <img
                src="~/assets/image/icon11.png"
                alt="人事、角色與權限管理"
                class="feature-anchor-icon-img"
              />
            </span>

            <span class="feature-anchor-text"> 人事權限 </span>
          </a>

          <!-- ===== 快捷按鈕：導到多分店與品牌管理 ===== -->
          <a href="#branch-brand" class="feature-anchor-item">
            <span class="feature-anchor-icon">
              <img
                src="~/assets/image/icon10.png"
                alt="多分店與品牌管理"
                class="feature-anchor-icon-img"
              />
            </span>

            <span class="feature-anchor-text"> 多分店品牌 </span>
          </a>
        </nav>
      </div>
    </section>

    <!-- ===== 核心功能介紹區：滿版一區一功能 ===== -->
    <section class="feature-overview-section" aria-label="核心功能介紹">
      <!-- ===== 功能區塊標題：控制整段功能介紹開場 ===== -->

      <div class="feature-showcase-list">
        <!-- ===== 功能 01：預約與門診管理 ===== -->
        <article id="appointment" class="feature-showcase-item">
          <div class="container feature-showcase-inner">
            <div class="feature-showcase-content">
              <span class="feature-number">01</span>

              <div class="feature-heading-row">
                <span class="feature-showcase-icon">
                  <img
                    src="~/assets/image/icon6.png"
                    alt="預約與門診管理"
                    class="feature-showcase-icon-img"
                  />
                </span>

                <div>
                  <p class="feature-label">APPOINTMENT & CLINIC</p>
                  <h3>預約與門診管理</h3>
                </div>
              </div>

              <p class="feature-showcase-desc">
                整合預約、排班與門診流程，讓櫃台與醫師作業更順暢。
              </p>

              <ul class="feature-point-list">
                <li>預約管理</li>
                <li>門診管理</li>
                <li>醫師排班</li>
                <li>到診狀態追蹤</li>
              </ul>
            </div>

            <div class="feature-showcase-visual">
              <img
                src="~/assets/image/Image4.png"
                alt="預約與門診管理功能示意圖"
              />
            </div>
          </div>
        </article>

        <!-- ===== 功能 02：電子病歷與住院照護 ===== -->
        <article
          id="medical-record"
          class="feature-showcase-item feature-showcase-item-tint"
        >
          <div
            class="container feature-showcase-inner feature-showcase-inner-reverse"
          >
            <div class="feature-showcase-content">
              <span class="feature-number">02</span>

              <div class="feature-heading-row">
                <span class="feature-showcase-icon">
                  <img
                    src="~/assets/image/icon5.png"
                    alt="電子病歷與住院照護"
                    class="feature-showcase-icon-img"
                  />
                </span>

                <div>
                  <p class="feature-label">MEDICAL RECORD & CARE</p>
                  <h3>電子病歷與住院照護</h3>
                </div>
              </div>

              <p class="feature-showcase-desc">
                完整保存看診與住院紀錄，協助醫療團隊掌握照護狀況。
              </p>

              <ul class="feature-point-list">
                <li>病歷管理</li>
                <li>診療紀錄</li>
                <li>住院管理</li>
                <li>住院照護紀錄</li>
              </ul>
            </div>

            <div class="feature-showcase-visual">
              <img
                src="~/assets/image/Image5.png"
                alt="電子病歷與住院照護功能示意圖"
              />
            </div>
          </div>
        </article>

        <!-- ===== 功能 03：飼主與寵物資料 ===== -->
        <article id="pet-profile" class="feature-showcase-item">
          <div class="container feature-showcase-inner">
            <div class="feature-showcase-content">
              <span class="feature-number">03</span>

              <div class="feature-heading-row">
                <span class="feature-showcase-icon">
                  <img
                    src="~/assets/image/icon9.png"
                    alt="飼主與寵物資料"
                    class="feature-showcase-icon-img"
                  />
                </span>

                <div>
                  <p class="feature-label">OWNER & PET PROFILE</p>
                  <h3>飼主與寵物資料</h3>
                </div>
              </div>

              <p class="feature-showcase-desc">
                集中管理飼主與毛孩資料，讓照護資訊更完整。
              </p>

              <ul class="feature-point-list">
                <li>飼主聯絡資訊</li>
                <li>寵物基本資料</li>
                <li>晶片與品種資料</li>
                <li>健康與疫苗紀錄</li>
              </ul>
            </div>

            <div class="feature-showcase-visual">
              <img
                src="~/assets/image/Image6.png"
                alt="飼主與寵物資料功能示意圖"
              />
            </div>
          </div>
        </article>

        <!-- ===== 功能 04：批價收費管理 ===== -->
        <article
          id="billing"
          class="feature-showcase-item feature-showcase-item-tint"
        >
          <div
            class="container feature-showcase-inner feature-showcase-inner-reverse"
          >
            <div class="feature-showcase-content">
              <span class="feature-number">04</span>

              <div class="feature-heading-row">
                <span class="feature-showcase-icon">
                  <img
                    src="~/assets/image/icon8.png"
                    alt="批價收費管理"
                    class="feature-showcase-icon-img"
                  />
                </span>

                <div>
                  <p class="feature-label">BILLING & PAYMENT</p>
                  <h3>批價收費管理</h3>
                </div>
              </div>

              <p class="feature-showcase-desc">
                快速完成批價、收費與付款紀錄，降低櫃台作業負擔。
              </p>

              <ul class="feature-point-list">
                <li>批價收費</li>
                <li>帳單明細</li>
                <li>付款狀態</li>
                <li>收費紀錄查詢</li>
              </ul>
            </div>

            <div class="feature-showcase-visual">
              <img
                src="~/assets/image/Image3.png"
                alt="批價收費管理功能示意圖"
              />
            </div>
          </div>
        </article>

        <!-- ===== 功能 05：庫存與藥品管理 ===== -->
        <article id="inventory" class="feature-showcase-item">
          <div class="container feature-showcase-inner">
            <div class="feature-showcase-content">
              <span class="feature-number">05</span>

              <div class="feature-heading-row">
                <span class="feature-showcase-icon">
                  <img
                    src="~/assets/image/icon7.png"
                    alt="庫存與藥品管理"
                    class="feature-showcase-icon-img"
                  />
                </span>

                <div>
                  <p class="feature-label">INVENTORY & MEDICINE</p>
                  <h3>庫存與藥品管理</h3>
                </div>
              </div>

              <p class="feature-showcase-desc">
                掌握藥品與一般耗材庫存，降低缺貨與過期風險。
              </p>

              <ul class="feature-point-list">
                <li>採購管理</li>
                <li>一般庫存</li>
                <li>藥品庫存</li>
                <li>批號與效期管理</li>
              </ul>
            </div>

            <div class="feature-showcase-visual">
              <img
                src="~/assets/image/Image7.png"
                alt="庫存與藥品管理功能示意圖"
              />
            </div>
          </div>
        </article>

        <!-- ===== 功能 06：主控台與營運分析 ===== -->
        <article
          id="analytics"
          class="feature-showcase-item feature-showcase-item-tint"
        >
          <div
            class="container feature-showcase-inner feature-showcase-inner-reverse"
          >
            <div class="feature-showcase-content">
              <span class="feature-number">06</span>

              <div class="feature-heading-row">
                <span class="feature-showcase-icon">
                  <img
                    src="~/assets/image/icon4.png"
                    alt="主控台與營運分析"
                    class="feature-showcase-icon-img"
                  />
                </span>

                <div>
                  <p class="feature-label">DASHBOARD & ANALYTICS</p>
                  <h3>主控台與營運分析</h3>
                </div>
              </div>

              <p class="feature-showcase-desc">
                快速掌握院所營運狀況，讓每日管理更清楚。
              </p>

              <ul class="feature-point-list">
                <li>主控台總覽</li>
                <li>基本報表</li>
                <li>進階報表</li>
                <li>營收與看診數據</li>
              </ul>
            </div>

            <div class="feature-showcase-visual">
              <img
                src="~/assets/image/Image8.png"
                alt="主控台與營運分析功能示意圖"
              />
            </div>
          </div>
        </article>

        <!-- ===== 功能 07：人事與權限管理 ===== -->
        <article id="staff-permission" class="feature-showcase-item">
          <div class="container feature-showcase-inner">
            <div class="feature-showcase-content">
              <span class="feature-number">07</span>

              <div class="feature-heading-row">
                <span class="feature-showcase-icon">
                  <img
                    src="~/assets/image/icon11.png"
                    alt="人事與權限管理"
                    class="feature-showcase-icon-img"
                  />
                </span>

                <div>
                  <p class="feature-label">STAFF & PERMISSION</p>
                  <h3>人事與權限管理</h3>
                </div>
              </div>

              <p class="feature-showcase-desc">
                依照職務分配系統權限，讓院所管理更安全。
              </p>

              <ul class="feature-point-list">
                <li>人事資料管理</li>
                <li>角色權限設定</li>
                <li>不同職務權限</li>
                <li>操作安全控管</li>
              </ul>
            </div>

            <div class="feature-showcase-visual">
              <img
                src="~/assets/image/Image9.png"
                alt="人事與權限管理功能示意圖"
              />
            </div>
          </div>
        </article>

        <!-- ===== 功能 08：多分店與品牌管理 ===== -->
        <article
          id="branch-brand"
          class="feature-showcase-item feature-showcase-item-tint"
        >
          <div
            class="container feature-showcase-inner feature-showcase-inner-reverse"
          >
            <div class="feature-showcase-content">
              <span class="feature-number">08</span>

              <div class="feature-heading-row">
                <span class="feature-showcase-icon">
                  <img
                    src="~/assets/image/icon10.png"
                    alt="多分店與品牌管理"
                    class="feature-showcase-icon-img"
                  />
                </span>

                <div>
                  <p class="feature-label">BRANCH & BRAND</p>
                  <h3>多分店與品牌管理</h3>
                </div>
              </div>

              <p class="feature-showcase-desc">
                支援多院所與品牌化管理，協助連鎖院所統一營運。
              </p>

              <ul class="feature-point-list">
                <li>品牌管理</li>
                <li>院所管理</li>
                <li>多分店管理</li>
                <li>跨店庫存管理</li>
              </ul>
            </div>

            <div class="feature-showcase-visual">
              <img
                src="~/assets/image/Image10.png"
                alt="多分店與品牌管理功能示意圖"
              />
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ===== 流程整合區：控制看診前中後流程說明 ===== -->
    <section class="workflow-section" aria-label="看診流程整合">
      <div class="container workflow-panel">
        <div class="workflow-intro">
          <p class="section-eyebrow">WORKFLOW</p>

          <h2>
            串聯看診前、中、後，
            <br />
            讓流程更完整
          </h2>

          <p>
            系統不只是單一功能工具，而是協助院所把日常流程串接起來，降低行政負擔並提升服務品質。
          </p>
        </div>

        <div class="workflow-list">
          <article class="workflow-item">
            <span>01</span>

            <div>
              <h3>看診前</h3>
              <p>預約排程、到診提醒、飼主與寵物資料建立。</p>
            </div>
          </article>

          <article class="workflow-item">
            <span>02</span>

            <div>
              <h3>看診中</h3>
              <p>病歷紀錄、診療處置、用藥紀錄與收費項目建立。</p>
            </div>
          </article>

          <article class="workflow-item">
            <span>03</span>

            <div>
              <h3>看診後</h3>
              <p>追蹤提醒、回診安排、資料查詢與營運報表分析。</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== 權限與安全區：控制系統安全特色 ===== -->
    <section class="security-section" aria-label="權限與資料安全">
      <div class="container security-container">
        <div class="security-content">
          <p class="section-eyebrow">SECURITY</p>

          <h2>權限清楚，資料更安心</h2>

          <p>
            依照不同職務角色設定操作權限，讓醫師、櫃台、管理者都能使用適合自己的功能範圍。
          </p>
        </div>

        <div class="security-card-grid">
          <article class="security-card">
            <h3>員工帳號管理</h3>
            <p>依方案提供不同帳號數量，方便院所內部人員分工使用。</p>
          </article>

          <article class="security-card">
            <h3>角色權限控管</h3>
            <p>可依職務規劃不同權限，降低誤操作與資料外洩風險。</p>
          </article>

          <article class="security-card">
            <h3>雲端資料保存</h3>
            <p>資料集中保存，降低紙本遺失與查找困難的問題。</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== CTA 區塊：控制導向價格方案 ===== -->
    <section class="function-cta-section">
      <div class="container">
        <div class="function-cta">
          <p class="section-eyebrow">START NOW</p>

          <h2>選擇適合院所的方案</h2>

          <p>從基本管理到進階營運分析，依照院所規模彈性選擇合適版本。</p>

          <NuxtLink to="/price" class="cta-button"> 查看價格方案 </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// ===== 頁面 SEO：控制瀏覽器標題與描述 =====
useHead({
  title: "功能介紹｜PetCare System",
  meta: [
    {
      name: "description",
      content:
        "PetCare System 功能介紹，包含預約排程、電子病歷、飼主與寵物資料、收費管理、庫存管理、營運報表、人事權限與多分店品牌管理。",
    },
  ],
});
</script>

<style scoped>
/* ===== 頁面滾動：控制錨點點擊後平滑移動 ===== */
html {
  scroll-behavior: smooth;
}
/* ===== 共用容器：控制內容最大寬度 ===== */
.container {
  width: min(100% - 2rem, 80rem);
  margin-inline: auto;
}

/* ===== 功能頁面：控制整頁背景與基本色系 ===== */
.function-page {
  --color-primary: #2e4a62;
  --color-primary-dark: #1f3548;
  --color-accent: #d9b26f;
  --color-bg: #f8f7f3;
  --color-text: #263238;
  --color-muted: #6f7a80;
  --color-border: #e6d8bd;

  min-height: 100vh;
  color: var(--color-text);
  background:
    radial-gradient(
      circle at top left,
      rgba(217, 178, 111, 0.16),
      transparent 28rem
    ),
    radial-gradient(
      circle at bottom right,
      rgba(156, 191, 167, 0.12),
      transparent 26rem
    ),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(248, 247, 243, 0.98) 100%
    );
}

/* ===== 頁面主視覺：控制功能介紹 Hero 區塊 ===== */
.function-hero {
  position: relative;
  min-height: 34rem;
  display: flex;
  align-items: center;
  padding: 7rem 0 5rem;
  text-align: left;
  overflow: hidden;
  isolation: isolate;
}

/* ===== Hero 背景圖片：控制 Image2.png 覆蓋整個 Hero ===== */
.function-hero-image {
  position: absolute;
  inset: 0;
  z-index: -3;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* ===== Hero 遮罩：控制圖片上方漸層，讓左側文字清楚 ===== */
.function-hero-overlay {
  position: absolute;
  inset: 0;
  z-index: -2;
  background: linear-gradient(
    90deg,
    rgba(248, 247, 243, 0.96) 0%,
    rgba(248, 247, 243, 0.86) 34%,
    rgba(248, 247, 243, 0.38) 62%,
    rgba(248, 247, 243, 0.08) 100%
  );
}

/* ===== Hero 底部裝飾：控制深藍金色弧線區塊 ===== */
.function-hero::after {
  content: "";
  position: absolute;
  left: -5%;
  right: -5%;
  bottom: -4.25rem;
  z-index: -1;
  height: 8rem;
  border-top: 0.18rem solid rgba(217, 178, 111, 0.9);
  border-radius: 50% 50% 0 0;
  background: linear-gradient(
    135deg,
    rgba(46, 74, 98, 0.98) 0%,
    rgba(31, 53, 72, 0.98) 100%
  );
  pointer-events: none;
}

/* ===== 主視覺容器：控制文字層級與寬度 ===== */
.function-hero-container {
  position: relative;
  z-index: 2;
}

/* ===== Hero 文字內容寬度：避免文字太長 ===== */
.function-hero-container .function-desc,
.function-hero-container .function-title {
  max-width: 40rem;
}

/* ===== 英文小標：控制 FEATURES 樣式 ===== */
.section-eyebrow {
  color: var(--color-accent);
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  margin-bottom: 0.65rem;
}

/* ===== 功能頁標題：控制功能介紹文字 ===== */
.function-title {
  color: var(--color-primary);
  font-size: clamp(2.6rem, 7vw, 4.8rem);
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}

/* ===== 功能頁描述：控制標題下方說明 ===== */
.function-desc {
  color: var(--color-muted);
  font-size: 1.05rem;
  line-height: 1.85;
  margin: 0;
}

/* ===== 功能快捷導覽區：控制 Hero 下方快捷按鈕位置 ===== */
.feature-anchor-section {
  position: relative;
  z-index: 5;
  margin-top: 2rem;

  /* ===== 縮短按鈕到第一個功能區塊的距離 ===== */
  padding-bottom: 0;
}

/* ===== 功能快捷導覽外框：控制圓角白色膠囊卡片 ===== */
.feature-anchor-panel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  overflow: hidden;

  border-radius: 2rem;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.94) 0%,
    rgba(248, 247, 243, 0.92) 100%
  );
  box-shadow:
    0 18px 48px rgba(15, 37, 56, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(0.6rem);
}

/* ===== 功能快捷按鈕：控制單一按鈕排列 ===== */
.feature-anchor-item {
  position: relative;
  min-height: 7rem;
  display: grid;
  place-items: center;
  padding: 1.05rem 0.7rem;
  color: var(--color-primary);
  text-align: center;
  text-decoration: none;
  border-right: 1px solid rgba(230, 216, 189, 0.78);
  border-bottom: 1px solid rgba(230, 216, 189, 0.78);
  transition:
    background-color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

/* ===== 快捷按鈕底部金線：控制 hover 時精品感 ===== */
.feature-anchor-item::after {
  content: "";
  position: absolute;
  left: 22%;
  right: 22%;
  bottom: 0.7rem;
  height: 0.12rem;
  border-radius: 999px;
  background-color: var(--color-accent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.25s ease;
}

/* ===== 快捷導覽分隔線：手機版兩欄排列 ===== */
.feature-anchor-item:nth-child(2n) {
  border-right: none;
}

/* ===== 快捷導覽分隔線：手機版最後一排不要底線 ===== */
.feature-anchor-item:nth-last-child(-n + 2) {
  border-bottom: none;
}

/* ===== 功能快捷 icon：控制圖片顯示，移除圓形外框 ===== */
.feature-anchor-icon {
  width: 4.8rem;
  height: 4.8rem;
  display: grid;
  place-items: center;

  /* ===== 移除圓形外框與底色 ===== */
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;

  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

/* ===== 快捷導覽圖片 icon：控制按鈕內圖片大小 ===== */
.feature-anchor-icon-img {
  width: 4.4rem;
  height: 4.4rem;
  display: block;
  object-fit: contain;
}

/* ===== 功能標題圖片 icon：控制每區標題旁邊的圖片 icon ===== */
.feature-showcase-icon-img {
  width: 2.8rem;
  height: 2.8rem;
  display: block;
  object-fit: contain;
}

/* ===== 功能快捷文字：控制按鈕文字樣式 ===== */
.feature-anchor-text {
  color: var(--color-primary);
  font-size: 0.92rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  line-height: 1.4;
  transition: color 0.25s ease;
}

/* ===== 功能快捷 hover：控制滑過整個按鈕效果，使用淺色系 ===== */
.feature-anchor-item:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 250, 240, 0.96) 0%,
    rgba(248, 247, 243, 0.98) 100%
  );
}

/* ===== 功能快捷 hover icon：控制圖片輕微上浮，不顯示外框 ===== */
.feature-anchor-item:hover .feature-anchor-icon {
  transform: translateY(-0.25rem);
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}

/* ===== 功能快捷 hover 文字：控制文字維持深藍但不變太重 ===== */
.feature-anchor-item:hover .feature-anchor-text {
  color: var(--color-primary);
}

/* ===== 功能快捷 hover 底線：控制金色線條出現 ===== */
.feature-anchor-item:hover::after {
  transform: scaleX(1);
}

/* ===== 功能總覽區：控制核心功能滿版區塊 ===== */
.feature-overview-section {
  position: relative;

  /* ===== 原本 3rem 太大，拿掉上方空白 ===== */
  padding: 0;
  overflow: hidden;
}

/* ===== 功能區塊主標題：控制核心功能介紹文字 ===== */
.feature-section-title {
  color: var(--color-primary);
  font-size: clamp(2.2rem, 8vw, 3.8rem);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: 0.06em;
  margin-bottom: 0.9rem;
}

/* ===== 功能區塊描述：控制開場說明文字 ===== */
.feature-section-desc {
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.85;
  margin: 0;
}

/* ===== 功能展示列表：控制六個滿版功能區塊上下排列 ===== */
.feature-showcase-list {
  display: grid;
}

/* ===== 單一功能滿版區塊：控制每一區大面積排版 ===== */
.feature-showcase-item {
  position: relative;
  padding: 1.75rem 0;
  scroll-margin-top: 7rem;
  overflow: hidden;
}

/* ===== 單一功能滿版區塊：控制交錯淡色背景 ===== */
.feature-showcase-item-tint {
  background: linear-gradient(
    135deg,
    rgba(255, 250, 240, 0.62) 0%,
    rgba(248, 247, 243, 0.86) 100%
  );
}

/* ===== 單一功能背景裝飾：控制右上角柔和光圈 ===== */
.feature-showcase-item::before {
  content: "";
  position: absolute;
  top: 4rem;
  right: -8rem;
  width: 22rem;
  height: 22rem;
  border-radius: 999px;
  background: rgba(217, 178, 111, 0.1);
  pointer-events: none;
}

/* ===== 單一功能背景裝飾：控制左下角柔和光圈 ===== */
.feature-showcase-item::after {
  content: "";
  position: absolute;
  left: -10rem;
  bottom: 2rem;
  width: 18rem;
  height: 18rem;
  border-radius: 999px;
  background: rgba(46, 74, 98, 0.045);
  pointer-events: none;
}

/* ===== 單一功能內層：手機版上下排列 ===== */
.feature-showcase-inner {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 2rem;
}

/* ===== 功能文字內容：控制說明區排版 ===== */
.feature-showcase-content {
  display: grid;
  gap: 1.1rem;
  align-content: center;
}

/* ===== 功能編號：控制 01 02 03 樣式 ===== */
.feature-number {
  width: fit-content;
  color: var(--color-accent);
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.2em;
}

/* ===== 功能標題列：控制 icon 與標題同列 ===== */
.feature-heading-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* ===== 功能展示 icon：控制圓形圖示 ===== */
.feature-showcase-icon {
  width: 4.2rem;
  height: 4.2rem;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border: 1px solid rgba(217, 178, 111, 0.72);
  border-radius: 999px;
  color: var(--color-primary);
  background: linear-gradient(
    135deg,
    rgba(255, 250, 240, 0.98) 0%,
    rgba(248, 247, 243, 0.98) 100%
  );
  font-size: 1.55rem;
  box-shadow:
    0 12px 28px rgba(15, 37, 56, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

/* ===== 功能英文標籤：控制 Appointment 等文字 ===== */
.feature-label {
  color: var(--color-accent);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

/* ===== 功能標題：控制功能名稱 ===== */
.feature-heading-row h3 {
  color: var(--color-primary);
  font-size: clamp(1.8rem, 6vw, 3rem);
  font-weight: 900;
  line-height: 1.2;
}

/* ===== 功能描述：控制每區說明文字 ===== */
.feature-showcase-desc {
  max-width: 34rem;
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.9;
  margin: 0;
}

/* ===== 功能重點列表：控制三個重點 ===== */
.feature-point-list {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

/* ===== 功能重點項目：控制勾勾文字 ===== */
.feature-point-list li {
  position: relative;
  padding-left: 1.45rem;
  color: var(--color-text);
  font-size: 0.98rem;
  line-height: 1.7;
}

/* ===== 功能重點勾勾：控制項目前方符號 ===== */
.feature-point-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: 900;
}

/* ===== 功能圖片區：取消卡片感，改成滿版展示感 ===== */
.feature-showcase-visual {
  position: relative;
}

/* ===== 功能圖片外層裝飾：控制淡金色大底框 ===== */
.feature-showcase-visual::before {
  content: "";
  position: absolute;
  inset: 1.2rem -1rem -1rem 1rem;
  z-index: -1;
  border-radius: 2rem;
  background: linear-gradient(
    135deg,
    rgba(217, 178, 111, 0.12) 0%,
    rgba(255, 250, 240, 0.72) 100%
  );
}

/* ===== 功能圖片：控制示意圖顯示 ===== */
.feature-showcase-visual img {
  width: 100%;
  display: block;
  border-radius: 1.4rem;
  object-fit: cover;
  box-shadow: 0 24px 70px rgba(15, 37, 56, 0.13);
}

/* ===== 功能編號：控制 01 02 03 樣式 ===== */
.feature-number {
  width: fit-content;
  color: var(--color-accent);
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.18em;
}

/* ===== 功能標題列：控制 icon 與標題同列 ===== */
.feature-heading-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* ===== 功能展示 icon：控制圓形圖示 ===== */
.feature-showcase-icon {
  width: 4.2rem;
  height: 4.2rem;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border: 1px solid rgba(217, 178, 111, 0.72);
  border-radius: 999px;
  color: var(--color-primary);
  background: linear-gradient(
    135deg,
    rgba(255, 250, 240, 0.98) 0%,
    rgba(248, 247, 243, 0.98) 100%
  );
  font-size: 1.55rem;
  box-shadow:
    0 12px 28px rgba(15, 37, 56, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

/* ===== 功能英文標籤：控制 Appointment 等文字 ===== */
.feature-label {
  color: var(--color-accent);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

/* ===== 功能標題：控制預約排程等文字 ===== */
.feature-heading-row h3 {
  color: var(--color-primary);
  font-size: clamp(1.55rem, 6vw, 2.4rem);
  font-weight: 900;
  line-height: 1.25;
}

/* ===== 功能描述：控制每區說明文字 ===== */
.feature-showcase-desc {
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.85;
  margin: 0;
}

/* ===== 功能重點列表：控制三個重點 ===== */
.feature-point-list {
  display: grid;
  gap: 0.65rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

/* ===== 功能重點項目：控制勾勾文字 ===== */
.feature-point-list li {
  position: relative;
  padding-left: 1.35rem;
  color: var(--color-text);
  font-size: 0.96rem;
  line-height: 1.65;
}

/* ===== 功能重點勾勾：控制項目前方符號 ===== */
.feature-point-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: 900;
}

/* ===== 功能圖片區：控制示意圖外框 ===== */
.feature-showcase-visual {
  position: relative;
  z-index: 2;
  padding: 0.6rem;

  border-radius: 1.35rem;
  background-color: rgba(255, 255, 255, 0.72);
  box-shadow: 0 16px 40px rgba(15, 37, 56, 0.08);
}

/* ===== 功能圖片：控制 Image3-8 顯示 ===== */
.feature-showcase-visual img {
  width: 100%;
  display: block;
  border-radius: 1rem;
  object-fit: cover;
}

/* ===== 平板以上：控制功能區塊留白 ===== */
@media (min-width: 48em) {
  .feature-overview-section {
    padding-top: 0rem;
  }

  .feature-showcase-item {
    padding: 5rem 0;
  }
  .feature-anchor-panel {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .feature-anchor-item:nth-child(2n) {
    border-right: 1px solid rgba(230, 216, 189, 0.78);
  }

  .feature-anchor-item:nth-child(4n) {
    border-right: none;
  }

  .feature-anchor-item:nth-last-child(-n + 4) {
    border-bottom: none;
  }
}

/* ===== 桌機以上：縮短一區一功能的上下高度 ===== */
@media (min-width: 64em) {
  .feature-showcase-item {
    min-height: 28rem;
    display: flex;
    align-items: center;
    padding: 1.5rem 0;
  }

  .feature-showcase-item:first-child {
    padding-top: 0.75rem;
  }

  .feature-showcase-inner {
    grid-template-columns: 0.72fr 1.28fr;
    align-items: center;
    gap: 2rem;
  }

  .feature-showcase-inner-reverse {
    grid-template-columns: 1.28fr 0.72fr;
  }

  .feature-showcase-inner-reverse .feature-showcase-content {
    order: 2;
  }

  .feature-showcase-inner-reverse .feature-showcase-visual {
    order: 1;
  }

  .feature-showcase-visual img {
    border-radius: 1.65rem;
  }
}

/* ===== 大螢幕：縮短每個功能區塊的上下間距 ===== */
@media (min-width: 80em) {
  .feature-showcase-item {
    min-height: 32rem;
    padding: 2.75rem 0;
  }

  .feature-showcase-inner {
    width: min(100% - 2rem, 88rem);
    gap: 2.2rem;
  }

  .feature-showcase-desc {
    font-size: 1rem;
  }
}

/* ===== 流程整合區：控制區塊上下留白 ===== */
.workflow-section {
  padding: 2rem 0 3rem;
}

/* ===== 流程面板：控制看診前中後大卡片 ===== */
.workflow-panel {
  display: grid;
  gap: 2rem;
  padding: 2rem;
  border: 1px solid rgba(230, 216, 189, 0.92);
  border-radius: 1.65rem;
  background-color: rgba(255, 255, 255, 0.66);
  box-shadow: 0 20px 58px rgba(15, 37, 56, 0.08);
}

/* ===== 流程介紹標題：控制左側標題 ===== */
.workflow-intro h2 {
  color: var(--color-primary);
  font-size: clamp(1.8rem, 7vw, 3rem);
  font-weight: 900;
  line-height: 1.25;
  margin-bottom: 1rem;
}

/* ===== 流程介紹文字：控制說明段落 ===== */
.workflow-intro p:last-child {
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.8;
  margin: 0;
}

/* ===== 流程清單：控制三個流程排列 ===== */
.workflow-list {
  display: grid;
  gap: 1rem;
}

/* ===== 流程項目：控制單一流程卡片 ===== */
.workflow-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid rgba(230, 216, 189, 0.9);
  border-radius: 1.15rem;
  background-color: rgba(255, 250, 240, 0.55);
}

/* ===== 流程數字：控制 01 02 03 樣式 ===== */
.workflow-item span {
  width: 2.75rem;
  height: 2.75rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: #ffffff;
  background-color: var(--color-primary);
  font-size: 0.9rem;
  font-weight: 900;
}

/* ===== 流程標題：控制看診前中後文字 ===== */
.workflow-item h3 {
  color: var(--color-primary);
  font-size: 1.05rem;
  font-weight: 900;
  margin-bottom: 0.35rem;
}

/* ===== 流程描述：控制說明文字 ===== */
.workflow-item p {
  color: var(--color-muted);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}

/* ===== 權限安全區：控制區塊上下距離 ===== */
.security-section {
  padding: 2rem 0 3rem;
}

/* ===== 權限安全容器：控制左右排版 ===== */
.security-container {
  display: grid;
  gap: 2rem;
}

/* ===== 權限安全標題：控制左側文字 ===== */
.security-content h2 {
  color: var(--color-primary);
  font-size: clamp(1.8rem, 7vw, 3rem);
  font-weight: 900;
  line-height: 1.25;
  margin-bottom: 1rem;
}

/* ===== 權限安全描述：控制段落 ===== */
.security-content p:last-child {
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.8;
  margin: 0;
}

/* ===== 安全卡片排列：控制三張小卡 ===== */
.security-card-grid {
  display: grid;
  gap: 1rem;
}

/* ===== 安全卡片：控制單張小卡樣式 ===== */
.security-card {
  padding: 1.35rem;
  border: 1px solid rgba(230, 216, 189, 0.92);
  border-radius: 1.15rem;
  background-color: rgba(255, 255, 255, 0.72);
}

/* ===== 安全卡片標題：控制標題文字 ===== */
.security-card h3 {
  color: var(--color-primary);
  font-size: 1.05rem;
  font-weight: 900;
  margin-bottom: 0.55rem;
}

/* ===== 安全卡片文字：控制說明文字 ===== */
.security-card p {
  color: var(--color-muted);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}

/* ===== CTA 區塊：控制底部導購區 ===== */
.function-cta-section {
  padding: 2rem 0 4rem;
}

/* ===== CTA 卡片：控制底部大卡片 ===== */
.function-cta {
  padding: 2rem;
  border: 1px solid rgba(217, 178, 111, 0.85);
  border-radius: 1.65rem;
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba(46, 74, 98, 0.98) 0%,
    rgba(31, 53, 72, 0.98) 100%
  );
  box-shadow: 0 24px 68px rgba(15, 37, 56, 0.16);
}

/* ===== CTA 標題：控制選擇適合院所方案 ===== */
.function-cta h2 {
  color: #ffffff;
  font-size: clamp(1.8rem, 7vw, 3rem);
  font-weight: 900;
  line-height: 1.25;
  margin-bottom: 1rem;
}

/* ===== CTA 描述：控制底部說明文字 ===== */
.function-cta p:not(.section-eyebrow) {
  max-width: 36rem;
  margin: 0 auto 1.5rem;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1rem;
  line-height: 1.8;
}

/* ===== CTA 按鈕：控制查看價格方案按鈕 ===== */
.cta-button {
  min-height: 3.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.65rem;
  border: 2px solid var(--color-accent);
  border-radius: 999px;
  color: var(--color-primary);
  background-color: #fffaf0;
  font-size: 1rem;
  font-weight: 900;
  text-decoration: none;
  transition: 0.2s ease;
}

/* ===== CTA 按鈕 hover：控制互動效果 ===== */
.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.22);
}

/* ===== 功能標題 icon：改成只顯示圖片，移除圓形外框 ===== */
.feature-showcase-icon {
  width: 5.2rem;
  height: 5.2rem;
  flex: 0 0 auto;
  display: grid;
  place-items: center;

  /* ===== 移除圓圈外框、背景與陰影 ===== */
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

/* ===== 功能標題圖片 icon：控制每區標題旁圖片大小 ===== */
.feature-showcase-icon-img {
  width: 5rem;
  height: 5rem;
  display: block;
  object-fit: contain;
}

/* ===== 平板以上：控制卡片雙欄與留白 ===== */
@media (min-width: 48em) {
  .function-hero {
    min-height: 38rem;
    padding: 8rem 0 6rem;
  }

  .workflow-panel {
    padding: 2.5rem;
  }

  .function-cta {
    padding: 3rem;
  }
}

/* ===== 桌機以上：控制三欄卡片與左右區塊 ===== */
@media (min-width: 64em) {
  .function-hero {
    min-height: 42rem;
    padding: 9rem 0 7rem;
  }

  .function-hero-image {
    object-position: center;
  }

  .feature-card {
    min-height: 25rem;
  }

  .workflow-panel {
    grid-template-columns: 0.9fr 1.1fr;
    align-items: center;
  }

  .security-container {
    grid-template-columns: 0.8fr 1.2fr;
    align-items: center;
  }

  .security-card-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .feature-anchor-section {
    padding-bottom: 0rem;
  }

  .feature-anchor-panel {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  .feature-anchor-item {
    min-height: 6.25rem;
    border-bottom: none;
    border-right: 1px solid rgba(230, 216, 189, 0.78);
  }

  .feature-anchor-item:nth-child(4n) {
    border-right: 1px solid rgba(230, 216, 189, 0.78);
  }

  .feature-anchor-item:last-child {
    border-right: none;
  }

  /* ===== 桌機版快捷 icon：控制圖片 icon 大小 ===== */
  .feature-anchor-icon {
    width: 5.2rem;
    height: 5.2rem;
  }

  .feature-anchor-icon-img {
    width: 4.9rem;
    height: 4.9rem;
  }

  .feature-anchor-text {
    font-size: 0.9rem;
  }
}

/* ===== 大螢幕：控制整體比例更寬鬆 ===== */
@media (min-width: 80em) {
  .feature-card {
    padding: 2rem;
  }

  .workflow-panel {
    padding: 3rem;
  }
}
</style>
