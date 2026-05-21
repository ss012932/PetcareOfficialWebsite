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

    <!-- ===== 方案卡片區：控制四種價格方案排列 ===== -->
    <section class="pricing-section" aria-label="價格方案列表">
      <div class="container pricing-container">

        <!-- ===== 載入中狀態 ===== -->
        <div v-if="pending" class="pricing-loading" aria-live="polite">
          <span class="pricing-loading-spinner" aria-hidden="true"></span>
          <p>載入方案中…</p>
        </div>

        <!-- ===== API 錯誤狀態 ===== -->
        <div v-else-if="error" class="pricing-error" role="alert">
          <p>方案資料載入失敗，請稍後再試。</p>
        </div>

        <!-- ===== 方案卡片網格 ===== -->
        <div v-else class="pricing-grid">
          <article
            v-for="plan in plans"
            :key="plan.Id"
            :class="[
              'pricing-card',
              { 'pricing-card-featured': plan.IsFeatured },
              { 'pricing-card-inactive': !plan.IsActive },
            ]"
          >
            <!-- ===== Badge 標籤：推薦、最高階等 ===== -->
            <div v-if="plan.Badge" class="pricing-badge">
              {{ plan.Badge }}
            </div>

            <!-- ===== 卡片內容 ===== -->
            <div class="pricing-card-content">
              <!-- ===== 方案標題區 ===== -->
              <header class="pricing-header">
                <h2 class="pricing-name">{{ plan.PlanName }}</h2>
                <p class="pricing-subtitle">{{ plan.Tagline }}</p>
              </header>

              <!-- ===== 價格區：顯示原價、優惠價與節省金額 ===== -->
              <div class="pricing-price-block">
                <div class="pricing-original-row">
                  <span class="pricing-original">
                    NT$ {{ plan.OriginalPrice.toLocaleString() }}
                  </span>
                  <span class="pricing-save-badge">{{ plan.SaveText }}</span>
                </div>

                <div class="pricing-price">
                  <span class="pricing-currency">NT$</span>
                  <strong>{{ plan.Price.toLocaleString() }}</strong>
                  <span class="pricing-period">{{ plan.Period }}</span>
                </div>
              </div>

              <!-- ===== 方案描述 ===== -->
              <p class="pricing-description">{{ plan.Description }}</p>

              <!-- ===== 功能列表 ===== -->
              <ul class="pricing-list" role="list">
                <li v-for="feature in plan.Features" :key="feature">
                  {{ feature }}
                </li>
              </ul>

              <!-- ===== 適合對象標籤 ===== -->
              <div class="pricing-tags" aria-label="適合對象">
                <span
                  v-for="tag in plan.SuitableTags"
                  :key="tag"
                  class="pricing-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- ===== 啟用中方案按鈕 ===== -->
            <div v-if="plan.IsActive" class="pricing-button-group">
              <button
                type="button"
                :class="[
                  'pricing-button',
                  plan.IsFeatured ? 'pricing-button-primary' : 'pricing-button-secondary',
                ]"
                @click="openTermsModal(plan)"
              >
                選擇方案
              </button>

              <!-- ===== 登入提示：告知未登入才能選擇 ===== -->
              <p class="pricing-login-hint">
                <span aria-hidden="true">🔐</span> 需登入後才能選擇方案
              </p>
            </div>

            <!-- ===== 停售方案：顯示敬請期待 ===== -->
            <div v-else class="pricing-coming-soon" aria-label="即將推出">
              <Icon name="fa6-solid:lock" class="pricing-coming-soon-icon" aria-hidden="true" />
              敬請期待
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== 補充說明區：控制付款與升級提醒 ===== -->
    <section class="pricing-note-section">
      <div class="container">
        <div class="pricing-note">
          <Icon name="fa6-solid:paw" class="pricing-note-icon" aria-hidden="true" />

          <p>所有方案皆為六個月訂閱制，可依院所需求彈性調整，正式導入前由專人協助評估。</p>
        </div>
      </div>
    </section>

    <!-- ===== 服務條款 Modal：控制選擇方案前的條款確認 ===== -->
    <TermsModal
      v-model="isTermsModalOpen"
      :plan-name="selectedPlan?.PlanName ?? ''"
      :plan-code="selectedPlan?.PlanCode ?? ''"
      @confirm="handleConfirmTerms"
    />
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Swal from "sweetalert2";
import TermsModal from "~/components/TermsModal.vue";
import api, { authAPI } from "~/composables/utils/api";

/* ===== 登入 Modal：共享狀態，可直接開啟 Header 的登入視窗 ===== */
const { openLoginModal } = useLoginModal()

/* ===== 頁面 SEO：控制瀏覽器標題與描述 ===== */
useHead({
  title: "價格方案｜PetCare System",
  meta: [
    {
      name: "description",
      content: "PetCare System 提供多種獸醫診所管理方案，依診所規模選擇最適合的訂閱方案。",
    },
  ],
});

/* ===== 方案資料型別 ===== */
interface Plan {
  Id: number
  PlanCode: string
  PlanName: string
  Tagline: string
  Description: string
  Price: number
  OriginalPrice: number
  Period: string
  SubscriptionMonth: number
  Features: string[]
  SuitableTags: string[]
  IsFeatured: boolean
  IsActive: boolean
  Badge: string | null
  SaveAmount: number
  SaveText: string
}

interface PlansResponse {
  success: boolean
  data: Plan[]
}

/* ===== API 呼叫：取得所有方案 ===== */
const { data, pending, error } = await useAsyncData<PlansResponse>(
  "price-plans",
  () => api.get("/plans").then((res) => res.data),
  { server: false },
)

/* ===== 方案列表：從 API 回傳資料取得 ===== */
const plans = computed<Plan[]>(() => data.value?.data ?? [])

/* ===== 條款 Modal 狀態：控制服務條款視窗是否開啟 ===== */
const isTermsModalOpen = ref(false)

/* ===== 目前選擇方案：記錄使用者點擊的方案物件 ===== */
const selectedPlan = ref<Plan | null>(null)

/* ===== 路由功能：控制同意條款後導向訂單頁 ===== */
const router = useRouter()

/* ===== 開啟條款 Modal：點選方案前先確認登入狀態 ===== */
async function openTermsModal(plan: Plan) {
  // ===== 檢查登入狀態：未登入則直接開啟登入視窗（不離開此頁）=====
  const result = await authAPI.checkLoginStatus()

  if (!result.isLogin) {
    await Swal.fire({
      icon: 'info',
      title: '請先登入',
      text: '選擇方案需要先登入會員，請登入後再繼續。',
      confirmButtonText: '前往登入',
      confirmButtonColor: '#2e4a62',
      showCancelButton: true,
      cancelButtonText: '取消',
    }).then((res) => {
      if (res.isConfirmed) {
        // ===== 直接開啟 Header 的登入 Modal，不導頁 =====
        openLoginModal()
      }
    })
    return
  }

  selectedPlan.value = plan
  isTermsModalOpen.value = true
}

/* ===== 同意條款後處理：導向訂單資訊頁，帶上方案代碼 ===== */
async function handleConfirmTerms(planCode?: string) {
  if (!planCode) return

  await router.push({
    path: '/order',
    query: { plan: planCode },
  })
}
</script>

<style scoped>
/* ===== 共用容器：控制內容最大寬度 ===== */
.container {
  width: min(100% - 2rem, 88rem);
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

/* ===== 載入中狀態：控制讀取提示置中 ===== */
.pricing-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  color: var(--color-muted);
  font-size: 0.98rem;
}

/* ===== 載入 spinner：控制旋轉圓圈動畫 ===== */
.pricing-loading-spinner {
  display: block;
  width: 2.2rem;
  height: 2.2rem;
  border: 3px solid rgba(217, 178, 111, 0.3);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== 錯誤狀態：控制 API 失敗提示 ===== */
.pricing-error {
  padding: 3rem 0;
  text-align: center;
  color: #b94040;
  font-size: 1rem;
}

/* ===== 方案卡片排列：手機版單欄排列 ===== */
.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  align-items: start;
}

/* ===== 方案卡片：控制單張方案卡外觀 ===== */
.pricing-card {
  position: relative;
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
.pricing-card:hover:not(.pricing-card-inactive) {
  transform: translateY(-0.35rem);
  border-color: rgba(217, 178, 111, 0.85);
  box-shadow: 0 26px 60px rgba(15, 37, 56, 0.13);
}

/* ===== 推薦方案卡片：控制主推薦樣式 ===== */
.pricing-card-featured {
  border-color: rgba(217, 178, 111, 0.98);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 250, 240, 0.88) 100%
  );
  box-shadow: 0 26px 68px rgba(217, 178, 111, 0.16);
}

/* ===== 停售方案卡片：控制未上架樣式 ===== */
.pricing-card-inactive {
  opacity: 0.6;
  filter: grayscale(0.35);
  cursor: default;
}

/* ===== Badge 標籤：控制推薦、最高階等標示 ===== */
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
  gap: 1.35rem;
  flex: 1;
}

/* ===== 方案標題區：控制方案名稱與副標間距 ===== */
.pricing-header {
  display: grid;
  gap: 0.5rem;
}

/* ===== 方案名稱：控制方案主標題 ===== */
.pricing-name {
  color: var(--color-primary);
  font-size: 1.45rem;
  font-weight: 900;
  letter-spacing: 0.04em;
}

/* ===== 方案副標：控制適用對象 tagline ===== */
.pricing-subtitle {
  color: var(--color-muted);
  font-size: 0.95rem;
  line-height: 1.65;
  margin: 0;
}

/* ===== 價格區塊：控制原價、優惠價與節省金額 ===== */
.pricing-price-block {
  display: grid;
  gap: 0.35rem;
}

/* ===== 原價列：控制原價與省錢標籤並排 ===== */
.pricing-original-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

/* ===== 原價：控制劃線原價 ===== */
.pricing-original {
  color: var(--color-muted);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: line-through;
  opacity: 0.75;
}

/* ===== 省錢標籤：控制現省金額標示 ===== */
.pricing-save-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background-color: rgba(217, 178, 111, 0.18);
  color: #a0762a;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

/* ===== 優惠價格：控制金額排列 ===== */
.pricing-price {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  color: var(--color-primary);
}

/* ===== 幣別：控制 NT$ 樣式 ===== */
.pricing-currency {
  font-size: 1rem;
  font-weight: 900;
}

/* ===== 金額：控制價格主要數字 ===== */
.pricing-price strong {
  font-size: clamp(1.9rem, 6vw, 2.4rem);
  font-weight: 900;
  letter-spacing: 0.04em;
}

/* ===== 週期：控制 /六個月 樣式 ===== */
.pricing-period {
  color: var(--color-muted);
  font-size: 0.9rem;
  font-weight: 700;
}

/* ===== 方案描述：控制方案詳細說明文字 ===== */
.pricing-description {
  color: var(--color-muted);
  font-size: 0.92rem;
  line-height: 1.75;
  margin: 0;
}

/* ===== 功能列表：控制方案功能垂直排列 ===== */
.pricing-list {
  display: grid;
  gap: 0.7rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

/* ===== 功能項目：控制每個勾選項目 ===== */
.pricing-list li {
  position: relative;
  padding-left: 1.35rem;
  color: var(--color-text);
  font-size: 0.95rem;
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

/* ===== 適合對象標籤區：控制 tag chips 排列 ===== */
.pricing-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

/* ===== 單個標籤：控制 chip 樣式 ===== */
.pricing-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.22rem 0.72rem;
  border: 1px solid rgba(217, 178, 111, 0.45);
  border-radius: 999px;
  color: var(--color-primary);
  background-color: rgba(217, 178, 111, 0.08);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

/* ===== 方案按鈕共用：控制卡片底部按鈕 ===== */
.pricing-button {
  width: fit-content;
  min-width: 8.5rem;
  min-height: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.75rem;
  padding: 0 1.55rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  cursor: pointer;
  font-family: inherit;
  border-style: solid;
  text-decoration: none;
  transition: 0.25s ease;
}

/* ===== 次要按鈕：控制一般方案按鈕 ===== */
.pricing-button-secondary {
  color: var(--color-primary);
  border: 1px solid rgba(217, 178, 111, 0.65);
  background-color: rgba(255, 255, 255, 0.72);
}

/* ===== 主要按鈕：控制推薦方案按鈕 ===== */
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

/* ===== 按鈕群組：控制按鈕與提示文字垂直排列 ===== */
.pricing-button-group {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin-top: 1.75rem;
}

/* ===== 登入提示：控制按鈕下方的登入說明文字 ===== */
.pricing-login-hint {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.78rem;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  opacity: 0.85;
}

/* ===== 敬請期待區塊：控制停售方案底部提示 ===== */
.pricing-coming-soon {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 1.75rem;
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  border: 1px dashed rgba(111, 122, 128, 0.45);
  color: var(--color-muted);
  background-color: rgba(248, 247, 243, 0.7);
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  width: fit-content;
}

/* ===== 敬請期待圖示 ===== */
.pricing-coming-soon-icon {
  width: 1rem;
  height: 1rem;
}

/* ===== 補充說明區：控制底部說明位置 ===== */
.pricing-note-section {
  padding: 0 0 4rem;
}

/* ===== 補充說明卡：控制底部提示樣式 ===== */
.pricing-note {
  max-width: 52rem;
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
  width: 1.15rem;
  height: 1.15rem;
  color: var(--color-accent);
  flex-shrink: 0;
}

/* ===== 補充說明文字：控制段落預設間距 ===== */
.pricing-note p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.7;
}

/* ===== 平板以上：控制方案卡片雙欄排列 ===== */
@media (min-width: 48em) {
  .price-hero {
    padding-top: 6rem;
  }

  .pricing-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* ===== 桌機以上：控制方案卡片四欄排列 ===== */
@media (min-width: 72em) {
  .price-hero {
    padding: 6.5rem 0 3.25rem;
  }

  .pricing-section {
    padding-top: 2rem;
  }

  .pricing-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .pricing-card-featured {
    transform: translateY(-0.75rem);
  }

  .pricing-card-featured:hover {
    transform: translateY(-1.1rem);
  }

  .pricing-card {
    padding: 2rem;
  }
}

/* ===== 大螢幕：控制卡片留白 ===== */
@media (min-width: 88em) {
  .pricing-card {
    padding: 2.25rem;
  }
}
</style>
