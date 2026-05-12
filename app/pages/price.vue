<template>
  <!-- ===== 價格方案頁面：控制整頁價格方案內容 ===== -->
  <main class="price-page">
    <!-- ===== 頁面主視覺：控制價格方案標題與說明 ===== -->
    <section class="price-hero">
      <div class="container price-hero-container">
        <p class="section-eyebrow">PRICING</p>

        <h1 class="price-title">價格方案</h1>

        <p class="price-desc">
          可依照診所規模選擇適合的方案，未來也能彈性升級。
        </p>
      </div>
    </section>

    <!-- ===== 方案卡片區：控制三種價格方案排列 ===== -->
    <section class="pricing-section" aria-label="價格方案列表">
      <div class="container pricing-container">
        <div class="pricing-grid">
          <!-- ===== 基本版方案：適合小型動物診所 ===== -->
          <article class="pricing-card">
            <div class="pricing-card-content">
              <header class="pricing-header">
                <h2 class="pricing-name">基本版</h2>

                <p class="pricing-subtitle">適合小型動物診所</p>
              </header>

              <div class="pricing-price">
                <span class="pricing-currency">NT$</span>
                <strong>1,980</strong>
                <span class="pricing-period">/ 月</span>
              </div>

              <ul class="pricing-list" role="list">
                <li>預約排程管理</li>
                <li>電子病歷管理</li>
                <li>基本收費功能</li>
                <li>3 個員工帳號</li>
              </ul>
            </div>

            <!-- ===== 基本版按鈕：點擊後開啟服務條款 Modal ===== -->
            <button
              type="button"
              class="pricing-button pricing-button-secondary"
              @click="openTermsModal('基本版')"
            >
              選擇方案
            </button>
          </article>

          <!-- ===== 專業版方案：主推薦方案 ===== -->
          <article class="pricing-card pricing-card-featured">
            <div class="pricing-badge">最推薦</div>

            <div class="pricing-card-content">
              <header class="pricing-header">
                <h2 class="pricing-name">專業版</h2>

                <p class="pricing-subtitle">適合成長中的動物醫院</p>
              </header>

              <div class="pricing-price">
                <span class="pricing-currency">NT$</span>
                <strong>3,980</strong>
                <span class="pricing-period">/ 月</span>
              </div>

              <ul class="pricing-list" role="list">
                <li>包含基本版所有功能</li>
                <li>藥品與庫存管理</li>
                <li>營運報表分析</li>
                <li>10 個員工帳號</li>
              </ul>
            </div>

            <button
              type="button"
              class="pricing-button pricing-button-primary"
              @click="openTermsModal('專業版')"
            >
              選擇方案
            </button>
          </article>

          <!-- ===== 企業版方案：適合大型或多分院診所 ===== -->
          <article class="pricing-card">
            <div class="pricing-card-content">
              <header class="pricing-header">
                <h2 class="pricing-name">企業版</h2>

                <p class="pricing-subtitle">適合多分院與大型院所</p>
              </header>

              <div class="pricing-price pricing-price-custom">
                <strong>客製報價</strong>
              </div>

              <ul class="pricing-list" role="list">
                <li>包含專業版所有功能</li>
                <li>多分院管理</li>
                <li>客製化報表</li>
                <li>專屬技術支援</li>
              </ul>
            </div>

            <!-- ===== 企業版按鈕：點擊後開啟服務條款 Modal ===== -->
            <button
              type="button"
              class="pricing-button pricing-button-secondary"
              @click="openTermsModal('企業版')"
            >
              聯絡我們
            </button>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== 補充說明區：控制付款與升級提醒 ===== -->
    <section class="pricing-note-section">
      <div class="container">
        <div class="pricing-note">
          <span class="pricing-note-icon" aria-hidden="true">🐾</span>

          <p>所有方案皆可依院所需求彈性調整，正式導入前可先由專人協助評估。</p>
        </div>
      </div>
    </section>

    <!-- ===== 服務條款 Modal：控制選擇方案前的條款確認 ===== -->
    <TermsModal
      v-model="isTermsModalOpen"
      :plan-name="selectedPlanName"
      @confirm="handleConfirmTerms"
    />
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TermsModal from "~/components/TermsModal.vue";

/* ===== 頁面 SEO：控制瀏覽器標題與描述 ===== */
useHead({
  title: "價格方案｜PetCare System",
  meta: [
    {
      name: "description",
      content: "PetCare System 提供基本版、專業版與企業版價格方案。",
    },
  ],
});

/* ===== 條款 Modal 狀態：控制服務條款視窗是否開啟 ===== */
const isTermsModalOpen = ref(false);

/* ===== 目前選擇方案：記錄使用者點擊哪個方案 ===== */
const selectedPlanName = ref("");

/* ===== 開啟條款 Modal：點選方案前先閱讀服務條款 ===== */
function openTermsModal(planName: string) {
  selectedPlanName.value = planName;
  isTermsModalOpen.value = true;
}

// ===== 路由功能：控制同意條款後導向訂單頁 =====
const router = useRouter()

// ===== 同意條款後處理：導向訂單資訊頁 =====
async function handleConfirmTerms(planName?: string) {
  // ===== 方案代碼對應：讓網址比較乾淨 =====
  const planMap: Record<string, string> = {
    基本版: 'basic',
    專業版: 'pro',
    企業版: 'enterprise',
  }

  // ===== 取得目前選擇的方案名稱 =====
  const currentPlanName = planName ?? selectedPlanName.value

  // ===== 導向訂單頁，並把方案帶到 query =====
  await router.push({
    path: '/order',
    query: {
      plan: planMap[currentPlanName] ?? 'basic',
    },
  })
}
</script>

<style scoped>
/* ===== 共用容器：控制內容最大寬度 ===== */
.container {
  width: min(100% - 2rem, 80rem);
  margin-inline: auto;
}

/* ===== 價格頁面：控制整頁背景與基本顏色 ===== */
.price-page {
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

/* ===== 頁面主視覺：控制標題區上下距離 ===== */
.price-hero {
  position: relative;
  padding: 5rem 0 2.75rem;
  text-align: center;
  overflow: hidden;
}

/* ===== 頁面主視覺裝飾線：控制淡金色弧線 ===== */
.price-hero::after {
  content: "";
  position: absolute;
  left: -8%;
  right: -8%;
  bottom: 0.5rem;
  height: 4rem;
  border-bottom: 1.5px solid rgba(217, 178, 111, 0.28);
  border-radius: 0 0 50% 50%;
  pointer-events: none;
}

/* ===== 標題容器：控制主視覺內容層級 ===== */
.price-hero-container {
  position: relative;
  z-index: 2;
}

/* ===== 英文小標：控制 PRICING 樣式 ===== */
.section-eyebrow {
  color: var(--color-accent);
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  margin-bottom: 0.65rem;
}

/* ===== 價格頁標題：控制價格方案文字 ===== */
.price-title {
  color: var(--color-primary);
  font-size: clamp(2.4rem, 7vw, 4.5rem);
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}

/* ===== 價格頁描述：控制標題下方說明 ===== */
.price-desc {
  max-width: 38rem;
  margin: 0 auto;
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.8;
}

/* ===== 方案區塊：控制卡片區上下留白 ===== */
.pricing-section {
  padding: 1.5rem 0 3rem;
}

/* ===== 方案卡片排列：手機版單欄排列 ===== */
.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

/* ===== 方案卡片：控制單張方案卡外觀 ===== */
.pricing-card {
  position: relative;
  min-height: 26rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  border: 1px solid rgba(230, 216, 189, 0.92);
  border-radius: 1.45rem;
  background-color: rgba(255, 255, 255, 0.72);
  box-shadow: 0 18px 48px rgba(15, 37, 56, 0.08);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

/* ===== 方案卡片 hover：控制滑過互動效果 ===== */
.pricing-card:hover {
  transform: translateY(-0.35rem);
  border-color: rgba(217, 178, 111, 0.85);
  box-shadow: 0 26px 60px rgba(15, 37, 56, 0.13);
}

/* ===== 推薦方案卡片：控制中間主推薦樣式 ===== */
.pricing-card-featured {
  border-color: rgba(217, 178, 111, 0.98);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 250, 240, 0.88) 100%
  );
  box-shadow: 0 26px 68px rgba(217, 178, 111, 0.16);
}

/* ===== 推薦標籤：控制最推薦 badge ===== */
.pricing-badge {
  position: absolute;
  top: -1rem;
  right: 2rem;
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  color: #ffffff;
  background-color: var(--color-primary);
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  box-shadow: 0 12px 28px rgba(31, 53, 72, 0.22);
}

/* ===== 方案內容：控制卡片內文字區塊 ===== */
.pricing-card-content {
  display: grid;
  gap: 1.55rem;
}

/* ===== 方案標題區：控制方案名稱與副標間距 ===== */
.pricing-header {
  display: grid;
  gap: 0.65rem;
}

/* ===== 方案名稱：控制基本版、專業版、企業版文字 ===== */
.pricing-name {
  color: var(--color-primary);
  font-size: 1.55rem;
  font-weight: 900;
  letter-spacing: 0.06em;
}

/* ===== 方案副標：控制適用對象文字 ===== */
.pricing-subtitle {
  color: var(--color-muted);
  font-size: 0.98rem;
  line-height: 1.7;
  margin: 0;
}

/* ===== 價格文字：控制金額排列 ===== */
.pricing-price {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  color: var(--color-primary);
}

/* ===== 幣別：控制 NT$ 樣式 ===== */
.pricing-currency {
  font-size: 1rem;
  font-weight: 900;
}

/* ===== 金額：控制價格主要數字 ===== */
.pricing-price strong {
  font-size: clamp(2rem, 8vw, 2.6rem);
  font-weight: 900;
  letter-spacing: 0.06em;
}

/* ===== 週期：控制 / 月 樣式 ===== */
.pricing-period {
  color: var(--color-muted);
  font-size: 1rem;
  font-weight: 800;
}

/* ===== 客製報價：控制企業版價格文字 ===== */
.pricing-price-custom strong {
  font-size: clamp(1.9rem, 7vw, 2.35rem);
}

/* ===== 功能列表：控制方案功能垂直排列 ===== */
.pricing-list {
  display: grid;
  gap: 0.85rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

/* ===== 功能項目：控制每個勾選項目 ===== */
.pricing-list li {
  position: relative;
  padding-left: 1.35rem;
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.6;
}

/* ===== 功能項目前方勾勾：控制 check 樣式 ===== */
.pricing-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-primary);
  font-weight: 900;
}

/* ===== 方案按鈕共用：控制卡片底部按鈕 ===== */
.pricing-button {
  width: fit-content;
  min-width: 8.5rem;
  min-height: 3.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  padding: 0 1.55rem;
  border-radius: 999px;
  font-size: 0.98rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: 0.25s ease;
}

/* ===== 次要按鈕：控制基本版與企業版按鈕 ===== */
.pricing-button-secondary {
  color: var(--color-primary);
  border: 1px solid rgba(217, 178, 111, 0.65);
  background-color: rgba(255, 255, 255, 0.72);
}

/* ===== 主要按鈕：控制專業版按鈕 ===== */
.pricing-button-primary {
  color: #ffffff;
  border: 2px solid var(--color-accent);
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
  );
}

/* ===== 方案按鈕 hover：控制互動效果 ===== */
.pricing-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(31, 53, 72, 0.18);
}

/* ===== 補充說明區：控制底部說明位置 ===== */
.pricing-note-section {
  padding: 0 0 4rem;
}

/* ===== 補充說明卡：控制底部提示樣式 ===== */
.pricing-note {
  max-width: 48rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 0 auto;
  padding: 1rem 1.25rem;
  border: 1px solid rgba(230, 216, 189, 0.9);
  border-radius: 999px;
  color: var(--color-muted);
  background-color: rgba(255, 255, 255, 0.62);
  text-align: center;
}

/* ===== 補充說明圖示：控制 paw icon ===== */
.pricing-note-icon {
  color: var(--color-accent);
  font-size: 1.15rem;
}

/* ===== 補充說明文字：控制段落預設間距 ===== */
.pricing-note p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.7;
}

/* ===== 方案按鈕 button reset：避免 button 預設樣式影響設計 ===== */
button.pricing-button {
  border-style: solid;
  cursor: pointer;
  font-family: inherit;
}

/* ===== 平板以上：控制方案卡片雙欄排列 ===== */
@media (min-width: 48em) {
  .price-hero {
    padding-top: 6rem;
  }

  .pricing-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pricing-card-featured {
    grid-column: span 2;
  }
}

/* ===== 桌機以上：控制方案卡片三欄排列，接近參考圖樣式 ===== */
@media (min-width: 64em) {
  .price-hero {
    padding: 6.5rem 0 3.25rem;
  }

  .pricing-section {
    padding-top: 2rem;
  }

  .pricing-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: stretch;
  }

  .pricing-card-featured {
    grid-column: auto;
    transform: translateY(-0.75rem);
  }

  .pricing-card-featured:hover {
    transform: translateY(-1.1rem);
  }

  .pricing-card {
    padding: 2.1rem;
  }
}

/* ===== 大螢幕：控制卡片留白更接近精品版面 ===== */
@media (min-width: 80em) {
  .pricing-card {
    min-height: 28rem;
    padding: 2.4rem;
  }
}
</style>
