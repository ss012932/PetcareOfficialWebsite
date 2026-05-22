<template>
  <!-- ===== 付款結果頁面：控制整個付款成功 / 失敗畫面 ===== -->
  <main class="payment-page">
    <section class="payment-hero">
      <div class="payment-status-icon" :class="statusIconClass">
        <Icon :name="statusIconName" aria-hidden="true" />
      </div>

      <p class="payment-eyebrow">
        {{ statusEyebrow }}
      </p>

      <h1 class="payment-title">
        {{ statusTitle }}
      </h1>

      <p class="payment-desc">
        {{ statusDescription }}
      </p>
    </section>

    <!-- ===== 付款資訊區：控制訂單資訊與購買人資訊 ===== -->
    <section class="payment-section">
      <div class="payment-container">
        <!-- ===== 左側訂單資訊：顯示訂單狀態與方案內容 ===== -->
        <article class="payment-card">
          <header class="payment-card-header">
            <div>
              <p class="payment-card-eyebrow">
                ORDER INFORMATION
              </p>

              <h2>
                訂單資訊
              </h2>
            </div>

            <span class="payment-badge" :class="statusBadgeClass">
              {{ statusBadgeText }}
            </span>
          </header>

          <div class="payment-info-list">
            <div class="payment-info-row">
              <span>訂單編號</span>
              <strong>{{ orderNumber }}</strong>
            </div>

            <div class="payment-info-row">
              <span>付款狀態</span>
              <strong>{{ statusBadgeText }}</strong>
            </div>

            <div class="payment-info-row">
              <span>付款方式</span>
              <strong>{{ paymentMethod }}</strong>
            </div>

            <div class="payment-info-row">
              <span>付款時間</span>
              <strong>{{ paymentTime }}</strong>
            </div>
          </div>

          <div class="payment-plan-box">
            <p class="payment-plan-label">
              購買方案
            </p>

            <h3>
              {{ selectedPlan.name }}
            </h3>

            <p>
              {{ selectedPlan.description }}
            </p>
          </div>

          <div class="payment-total-row">
            <span>實付金額</span>
            <strong>{{ selectedPlan.priceText }}</strong>
          </div>
        </article>

        <!-- ===== 右側購買人資訊：顯示會員與後續操作 ===== -->
        <article class="payment-card">
          <header class="payment-card-header">
            <div>
              <p class="payment-card-eyebrow">
                PURCHASER INFO
              </p>

              <h2>
                購買人資訊
              </h2>
            </div>

            <span class="payment-badge payment-badge-member">
              會員
            </span>
          </header>

          <div class="buyer-box">
            <div class="buyer-avatar">
              {{ buyerInitial }}
            </div>

            <div class="buyer-info">
              <p>
                <span>姓名</span>
                <strong>{{ buyer.Name || '—' }}</strong>
              </p>

              <p>
                <span>電子郵件</span>
                <strong>{{ buyer.Email || '—' }}</strong>
              </p>

              <p>
                <span>手機號碼</span>
                <strong>{{ buyer.Phone || '—' }}</strong>
              </p>
            </div>
          </div>

          <div class="payment-notice" :class="noticeClass">
            <Icon :name="noticeIcon" aria-hidden="true" />

            <p>
              {{ noticeText }}
            </p>
          </div>

          <div class="payment-actions">
            <NuxtLink
              v-if="isSuccess"
              to="/dashboard"
              class="payment-button payment-button-primary"
            >
              進入會員中心
              <Icon name="fa6-solid:arrow-right" aria-hidden="true" />
            </NuxtLink>

            <NuxtLink
              v-else
              :to="retryUrl"
              class="payment-button payment-button-primary"
            >
              重新付款
              <Icon name="fa6-solid:credit-card" aria-hidden="true" />
            </NuxtLink>

            <NuxtLink to="/" class="payment-button payment-button-outline">
              返回首頁
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import api from '~/composables/utils/api'
import { useAuthStore } from '~/composables/auth'

// ===== 路由資料：取得金流回傳的 merchantTradeNo =====
const route = useRoute()

// ===== 頁面 SEO =====
useHead({
  title: '付款結果｜PetCare System',
  meta: [
    {
      name: 'description',
      content: 'PetCare System 付款結果頁面，顯示訂單付款成功或失敗狀態。',
    },
  ],
})

// ===== API 回傳型別 =====
interface PaymentResultData {
  OrderId: number
  BrandId: number
  BrandName: string
  PlanId: number
  PlanName: string
  Period: string
  SubscriptionMonth: number
  Amount: number
  DiscountCode: string | null
  MerchantTradeNo: string
  TradeNo: string
  Status: string
  PaymentType: string
  PaymentName: string
  PayTime: string | null
  ExpireDate: string
  CreateDate: string
  UpdateDate: string
  IsRecurring: boolean
}

// ===== 查詢訂單結果：使用 merchantTradeNo =====
const merchantTradeNo = computed(() => String(route.query.merchantTradeNo ?? ''))

const { data: resultData } = await useAsyncData(
  'payment-result',
  async () => {
    if (!merchantTradeNo.value) return null
    try {
      const res = await api.get('/orders/payment-result', { merchantTradeNo: merchantTradeNo.value })
      return (res.data?.data as PaymentResultData) ?? null
    } catch {
      return null
    }
  },
  { server: false },
)

// ===== 購買人資料：來自 Auth Store =====
const authStore = useAuthStore()
if (!authStore.isLogin) {
  await authStore.loadUser()
}
const buyer = computed(() => authStore.user)
const buyerInitial = computed(() => buyer.value.Name?.slice(0, 1) || '?')

// ===== 付款是否成功：Status === '已付款' =====
const isSuccess = computed(() => resultData.value?.Status === '已付款')

// ===== 訂單資訊 =====
const orderNumber = computed(() => resultData.value?.MerchantTradeNo ?? merchantTradeNo.value)

const paymentMethod = computed(() => resultData.value?.PaymentName ?? '—')

const paymentTime = computed(() => {
  const raw = resultData.value?.PayTime
  if (!raw) return '—'
  return new Date(raw).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
})

// ===== 方案資訊 =====
const selectedPlan = computed(() => ({
  name: resultData.value?.PlanName ?? '—',
  description: `訂閱週期：${resultData.value?.SubscriptionMonth ?? '—'} 個月${resultData.value?.Period ?? ''}`,
  priceText: resultData.value?.Amount != null
    ? `NT$ ${resultData.value.Amount.toLocaleString()}`
    : '—',
}))

// ===== 狀態文字 / 樣式 =====
const statusEyebrow = computed(() => isSuccess.value ? 'PAYMENT SUCCESSFUL' : 'PAYMENT FAILED')
const statusTitle = computed(() => isSuccess.value ? '付款成功！' : '付款失敗')
const statusDescription = computed(() =>
  isSuccess.value
    ? '感謝您的購買，您的方案已成立，系統將協助您完成後續開通流程。'
    : '很抱歉，本次付款未完成，您可以重新付款或返回訂單頁確認資料。'
)
const statusIconName = computed(() => isSuccess.value ? 'fa6-solid:check' : 'fa6-solid:xmark')
const statusIconClass = computed(() => isSuccess.value ? 'payment-status-icon-success' : 'payment-status-icon-failed')
const statusBadgeText = computed(() => resultData.value?.Status ?? (isSuccess.value ? '付款成功' : '付款失敗'))
const statusBadgeClass = computed(() => isSuccess.value ? 'payment-badge-success' : 'payment-badge-failed')
const noticeIcon = computed(() => isSuccess.value ? 'fa6-solid:circle-info' : 'fa6-solid:triangle-exclamation')
const noticeClass = computed(() => isSuccess.value ? 'payment-notice-success' : 'payment-notice-failed')
const noticeText = computed(() =>
  isSuccess.value
    ? '訂單確認信已寄送至您的電子郵件，後續將由客服協助完成系統開通。'
    : '付款未完成，請重新確認付款資訊，或稍後再次嘗試。'
)

// ===== 重新付款網址 =====
const retryUrl = computed(() => '/order')
</script>

<style scoped>
/* ===== 付款頁面：控制整頁背景與主色系 ===== */
.payment-page {
  --color-primary: #10283a;
  --color-primary-soft: #2e4a62;
  --color-accent: #d9b26f;
  --color-bg: #f8f7f3;
  --color-text: #263238;
  --color-muted: #6f7a80;
  --color-border: #e6d8bd;
  --color-success: #4bb67a;
  --color-error: #d86c6c;

  min-height: 100vh;
  color: var(--color-text);
  background:
    radial-gradient(circle at 16% 8%, rgba(217, 178, 111, 0.14), transparent 24rem),
    radial-gradient(circle at 88% 18%, rgba(46, 74, 98, 0.08), transparent 26rem),
    linear-gradient(135deg, #ffffff 0%, #f8f7f3 100%);
}

/* ===== 付款結果主視覺：控制上方成功 / 失敗區塊 ===== */
.payment-hero {
  max-width: 46rem;
  margin: 0 auto;
  padding: 4.6rem 1.25rem 2.4rem;
  text-align: center;
}

/* ===== 狀態圓形 icon：控制成功 / 失敗圖示大小 ===== */
.payment-status-icon {
  width: 4.25rem;
  height: 4.25rem;
  display: grid;
  place-items: center;
  margin: 0 auto 1.35rem;
  border-radius: 999px;
  color: #ffffff;
  background-color: var(--color-success);
  box-shadow: 0 16px 36px rgba(75, 182, 122, 0.22);
}

/* ===== 狀態 icon 尺寸 ===== */
.payment-status-icon svg {
  width: 1.45rem;
  height: 1.45rem;
}

/* ===== 付款失敗 icon 狀態 ===== */
.payment-status-icon-failed,
.payment-status-icon-error {
  background-color: var(--color-error);
  box-shadow: 0 16px 36px rgba(216, 108, 108, 0.22);
}

/* ===== 英文小標：控制 PAYMENT SUCCESSFUL 字體 ===== */
.payment-eyebrow {
  margin: 0 0 0.55rem;
  color: var(--color-accent);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

/* ===== 主標題：控制付款成功文字，不要太大 ===== */
.payment-title {
  margin: 0 0 0.8rem;
  color: var(--color-primary);
  font-size: clamp(2.15rem, 5vw, 3.35rem);
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: 0.05em;
}

/* ===== 描述文字：控制標題下方說明 ===== */
.payment-desc {
  max-width: 34rem;
  margin: 0 auto;
  color: var(--color-muted);
  font-size: 0.94rem;
  line-height: 1.75;
}

/* ===== 付款資訊區：控制卡片區上下距離 ===== */
.payment-section {
  padding: 0 1.25rem 4rem;
}

/* ===== 付款卡片容器：控制左右兩欄寬度 ===== */
.payment-container {
  width: min(100%, 74rem);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

/* ===== 付款資訊卡片：控制訂單資訊與購買人資訊外觀 ===== */
.payment-card {
  overflow: hidden;
  border: 1px solid rgba(230, 216, 189, 0.9);
  border-radius: 1.15rem;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.86) 0%,
      rgba(255, 250, 240, 0.62) 100%
    );
  box-shadow: 0 18px 44px rgba(15, 37, 56, 0.08);
}

/* ===== 卡片標題區：控制標題與 badge 排列 ===== */
.payment-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.35rem 1.55rem 1.1rem;
  border-bottom: 1px solid rgba(230, 216, 189, 0.9);
}

/* ===== 卡片英文小標 ===== */
.payment-card-eyebrow {
  margin: 0 0 0.35rem;
  color: var(--color-accent);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

/* ===== 卡片標題：控制訂單資訊 / 購買人資訊 ===== */
.payment-card-header h2 {
  margin: 0;
  color: var(--color-primary);
  font-size: 1.28rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 0.04em;
}

/* ===== 狀態 badge 共用 ===== */
.payment-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2rem;
  padding: 0 1rem;
  border-radius: 999px;
  color: #1f6f45;
  background-color: rgba(75, 182, 122, 0.14);
  border: 1px solid rgba(75, 182, 122, 0.28);
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
}

/* ===== 付款失敗 badge ===== */
.payment-badge-failed,
.payment-badge-error {
  color: #a23e3e;
  background-color: rgba(216, 108, 108, 0.12);
  border-color: rgba(216, 108, 108, 0.28);
}

/* ===== 會員 badge ===== */
.payment-badge-member {
  color: var(--color-primary);
  background-color: rgba(217, 178, 111, 0.13);
  border-color: rgba(217, 178, 111, 0.32);
}

/* ===== 訂單資訊列表 ===== */
.payment-info-list {
  padding: 1.25rem 1.55rem 0.75rem;
}

/* ===== 訂單資訊單列 ===== */
.payment-info-row {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 1rem;
  align-items: center;
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(230, 216, 189, 0.75);
}

/* ===== 訂單資訊 label ===== */
.payment-info-row span {
  color: var(--color-muted);
  font-size: 0.88rem;
  font-weight: 500;
}

/* ===== 訂單資訊內容 ===== */
.payment-info-row strong {
  color: var(--color-primary);
  font-size: 0.92rem;
  font-weight: 650;
  text-align: right;
  word-break: break-word;
}

/* ===== 購買方案區塊 ===== */
.payment-plan-box {
  margin: 0.85rem 1.55rem 1rem;
  padding: 1rem 1.15rem;
  border: 1px solid rgba(230, 216, 189, 0.78);
  border-radius: 0.95rem;
  background-color: rgba(255, 255, 255, 0.55);
}

/* ===== 購買方案 label ===== */
.payment-plan-label {
  margin: 0 0 0.4rem;
  color: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

/* ===== 方案名稱 ===== */
.payment-plan-box h3 {
  margin: 0 0 0.45rem;
  color: var(--color-primary);
  font-size: 1.15rem;
  font-weight: 700;
}

/* ===== 方案描述 ===== */
.payment-plan-box p {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.88rem;
  line-height: 1.65;
}

/* ===== 實付金額列 ===== */
.payment-total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 0 1.55rem 1.45rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(230, 216, 189, 0.85);
}

/* ===== 實付金額 label ===== */
.payment-total-row span {
  color: var(--color-muted);
  font-size: 0.9rem;
  font-weight: 500;
}

/* ===== 實付金額數字 ===== */
.payment-total-row strong {
  color: var(--color-primary);
  font-size: 1.2rem;
  font-weight: 700;
}

/* ===== 購買人資訊框 ===== */
.buyer-box {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  margin: 1.45rem 1.55rem 1rem;
  padding: 1.2rem;
  border: 1px solid rgba(230, 216, 189, 0.78);
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.55);
}

/* ===== 購買人頭像 ===== */
.buyer-avatar {
  width: 3.3rem;
  height: 3.3rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: #ffffff;
  background-color: var(--color-primary);
  font-size: 1.15rem;
  font-weight: 700;
}

/* ===== 購買人文字區 ===== */
.buyer-info {
  display: grid;
  gap: 0.7rem;
}

/* ===== 購買人單項資料 ===== */
.buyer-info p {
  margin: 0;
  display: grid;
  gap: 0.25rem;
}

/* ===== 購買人 label ===== */
.buyer-info span {
  color: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

/* ===== 購買人內容 ===== */
.buyer-info strong {
  color: var(--color-primary);
  font-size: 0.95rem;
  font-weight: 650;
  word-break: break-word;
}

/* ===== 提醒訊息 ===== */
.payment-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  margin: 0 1.55rem 1.2rem;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  color: #1f6f45;
  background-color: rgba(75, 182, 122, 0.1);
  border: 1px solid rgba(75, 182, 122, 0.2);
}

/* ===== 提醒 icon ===== */
.payment-notice svg {
  width: 1rem;
  height: 1rem;
  margin-top: 0.15rem;
  flex-shrink: 0;
}

/* ===== 提醒文字 ===== */
.payment-notice p {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.6;
}

/* ===== 失敗提醒 ===== */
.payment-notice-failed,
.payment-notice-error {
  color: #a23e3e;
  background-color: rgba(216, 108, 108, 0.1);
  border-color: rgba(216, 108, 108, 0.2);
}

/* ===== 按鈕區 ===== */
.payment-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0 1.55rem 1.55rem;
}

/* ===== 按鈕共用 ===== */
.payment-button {
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0 1.1rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 650;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

/* ===== 主要按鈕 ===== */
.payment-button-primary {
  color: #ffffff;
  background: linear-gradient(135deg, var(--color-primary) 0%, #0b2233 100%);
  box-shadow: 0 12px 24px rgba(15, 37, 56, 0.18);
}

/* ===== 外框按鈕 ===== */
.payment-button-outline {
  color: var(--color-primary);
  border: 1px solid rgba(217, 178, 111, 0.58);
  background-color: rgba(255, 255, 255, 0.58);
}

/* ===== 按鈕 hover ===== */
.payment-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(15, 37, 56, 0.16);
}

/* ===== 平板以上：左右兩欄排列 ===== */
@media (min-width: 48em) {
  .payment-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* ===== 電腦版：整體縮小，避免字體太大 ===== */
@media (min-width: 64em) {
  .payment-hero {
    padding: 4.2rem 1.25rem 2.1rem;
  }

  .payment-container {
    width: min(100%, 72rem);
    gap: 1.15rem;
  }

  .payment-card-header {
    padding: 1.25rem 1.45rem 1rem;
  }

  .payment-info-list {
    padding-inline: 1.45rem;
  }

  .payment-plan-box,
  .payment-total-row,
  .buyer-box,
  .payment-notice,
  .payment-actions {
    margin-left: 1.45rem;
    margin-right: 1.45rem;
  }
}

/* ===== 大螢幕：避免卡片被拉太寬 ===== */
@media (min-width: 88em) {
  .payment-container {
    width: min(100%, 68rem);
  }

  .payment-title {
    font-size: 3rem;
  }
}

/* ===== 手機版：單欄與文字縮小 ===== */
@media (max-width: 36em) {
  .payment-hero {
    padding: 3.4rem 1rem 1.8rem;
  }

  .payment-status-icon {
    width: 3.7rem;
    height: 3.7rem;
    margin-bottom: 1rem;
  }

  .payment-title {
    font-size: 2rem;
  }

  .payment-desc {
    font-size: 0.9rem;
  }

  .payment-section {
    padding: 0 1rem 3rem;
  }

  .payment-card-header {
    padding: 1.15rem 1.1rem 0.95rem;
  }

  .payment-card-header h2 {
    font-size: 1.15rem;
  }

  .payment-info-list {
    padding: 1rem 1.1rem 0.65rem;
  }

  .payment-info-row {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }

  .payment-info-row strong {
    text-align: left;
  }

  .payment-plan-box,
  .payment-total-row,
  .buyer-box,
  .payment-notice,
  .payment-actions {
    margin-left: 1.1rem;
    margin-right: 1.1rem;
  }

  .buyer-box {
    grid-template-columns: 1fr;
  }

  .payment-actions {
    display: grid;
  }

  .payment-button {
    width: 100%;
  }
}
</style>