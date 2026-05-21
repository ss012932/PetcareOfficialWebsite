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
                <strong>{{ buyer.name }}</strong>
              </p>

              <p>
                <span>電子郵件</span>
                <strong>{{ buyer.email }}</strong>
              </p>

              <p>
                <span>手機號碼</span>
                <strong>{{ buyer.phone }}</strong>
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
// ===== 路由資料：取得付款狀態與方案代碼 =====
const route = useRoute()

// ===== 頁面 SEO：控制付款結果頁標題 =====
useHead({
  title: '付款結果｜PetCare System',
  meta: [
    {
      name: 'description',
      content: 'PetCare System 付款結果頁面，顯示訂單付款成功或失敗狀態。',
    },
  ],
})

// ===== 方案型別：限制方案資料格式 =====
interface PlanInfo {
  code: string
  name: string
  description: string
  priceText: string
}

// ===== 方案代碼型別：限制可用方案 =====
type PlanCode = 'basic' | 'pro' | 'enterprise'

// ===== 付款狀態型別：限制成功或失敗 =====
type PaymentStatus = 'success' | 'failed'

// ===== 方案資料：依照 order.vue 傳來的 plan query 顯示 =====
const plans: Record<PlanCode, PlanInfo> = {
  basic: {
    code: 'basic',
    name: '基本版',
    description: '適合小型動物診所，提供預約排程、電子病歷與基本收費功能。',
    priceText: 'NT$1,980 / 月',
  },
  pro: {
    code: 'pro',
    name: '專業版',
    description: '適合成長中的動物醫院，包含庫存管理、報表分析與進階營運功能。',
    priceText: 'NT$3,980 / 月',
  },
  enterprise: {
    code: 'enterprise',
    name: '企業版',
    description: '適合多分院與大型院所，提供客製管理、專屬支援與進階報表。',
    priceText: '客製報價',
  },
}

// ===== 判斷方案代碼是否有效 =====
function isPlanCode(value: string): value is PlanCode {
  return ['basic', 'pro', 'enterprise'].includes(value)
}

// ===== 判斷付款狀態是否有效 =====
function isPaymentStatus(value: string): value is PaymentStatus {
  return ['success', 'failed'].includes(value)
}

// ===== 目前付款狀態：從網址 query 判斷，預設成功 =====
const paymentStatus = computed<PaymentStatus>(() => {
  const status = String(route.query.status ?? 'success')

  return isPaymentStatus(status) ? status : 'success'
})

// ===== 是否付款成功：控制畫面文字與按鈕 =====
const isSuccess = computed(() => paymentStatus.value === 'success')

// ===== 目前選擇方案：從網址 query 判斷方案，預設專業版 =====
const selectedPlan = computed<PlanInfo>(() => {
  const queryPlan = String(route.query.plan ?? 'pro')
  const planCode: PlanCode = isPlanCode(queryPlan) ? queryPlan : 'pro'

  return plans[planCode]
})

// ===== 訂單編號：正式串接金流後可由 API 回傳 =====
const orderNumber = computed(() => {
  return String(route.query.orderNo ?? 'ORDER20260520001')
})

// ===== 付款方式：正式串接金流後可由 API 回傳 =====
const paymentMethod = computed(() => {
  return String(route.query.method ?? '信用卡')
})

// ===== 付款時間：目前先顯示本機時間 =====
const paymentTime = computed(() => {
  return new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
})

// ===== 購買人資料：正式串接登入會員後可由會員資料帶入 =====
const buyer = {
  name: '王小明',
  email: 'customer@example.com',
  phone: '0912-345-678',
}

// ===== 購買人頭像文字：取姓名第一個字 =====
const buyerInitial = computed(() => buyer.name.slice(0, 1))

// ===== 狀態小標：控制 PAYMENT SUCCESSFUL / PAYMENT FAILED =====
const statusEyebrow = computed(() => {
  return isSuccess.value ? 'PAYMENT SUCCESSFUL' : 'PAYMENT FAILED'
})

// ===== 狀態標題：控制付款成功 / 付款失敗 =====
const statusTitle = computed(() => {
  return isSuccess.value ? '付款成功！' : '付款失敗'
})

// ===== 狀態描述：控制標題下方說明文字 =====
const statusDescription = computed(() => {
  return isSuccess.value
    ? '感謝您的購買，您的方案已成立，系統將協助您完成後續開通流程。'
    : '很抱歉，本次付款未完成，您可以重新付款或返回訂單頁確認資料。'
})

// ===== 狀態 icon 名稱：控制成功 / 失敗 icon =====
const statusIconName = computed(() => {
  return isSuccess.value ? 'fa6-solid:check' : 'fa6-solid:xmark'
})

// ===== 狀態 icon class：控制成功 / 失敗顏色 =====
const statusIconClass = computed(() => {
  return isSuccess.value ? 'payment-status-icon-success' : 'payment-status-icon-failed'
})

// ===== 狀態 badge 文字 =====
const statusBadgeText = computed(() => {
  return isSuccess.value ? '付款成功' : '付款失敗'
})

// ===== 狀態 badge class =====
const statusBadgeClass = computed(() => {
  return isSuccess.value ? 'payment-badge-success' : 'payment-badge-failed'
})

// ===== 提示訊息 icon =====
const noticeIcon = computed(() => {
  return isSuccess.value ? 'fa6-solid:circle-info' : 'fa6-solid:triangle-exclamation'
})

// ===== 提示訊息 class =====
const noticeClass = computed(() => {
  return isSuccess.value ? 'payment-notice-success' : 'payment-notice-failed'
})

// ===== 提示訊息文字 =====
const noticeText = computed(() => {
  return isSuccess.value
    ? '訂單確認信已寄送至您的電子郵件，後續將由客服協助完成系統開通。'
    : '付款未完成，請重新確認付款資訊，或稍後再次嘗試。'
})

// ===== 重新付款網址：保留目前方案回到訂單頁 =====
const retryUrl = computed(() => {
  return `/order?plan=${selectedPlan.value.code}`
})
</script>

<style scoped>
/* ===== 付款頁主容器：控制整頁背景與主色 ===== */
.payment-page {
  --color-primary: #2e4a62;
  --color-primary-dark: #1f3548;
  --color-accent: #d9b26f;
  --color-bg: #f8f7f3;
  --color-card: #ffffff;
  --color-text: #263238;
  --color-muted: #6f7a80;
  --color-border: #e6d8bd;
  --color-success: #3aa875;
  --color-danger: #d85c5c;

  min-height: 100vh;
  padding: 5rem 1rem 4rem;
  color: var(--color-text);
  background:
    radial-gradient(circle at 18% 0%, rgba(217, 178, 111, 0.14), transparent 24rem),
    radial-gradient(circle at 85% 20%, rgba(46, 74, 98, 0.07), transparent 26rem),
    linear-gradient(135deg, #ffffff 0%, var(--color-bg) 100%);
}

/* ===== 頂部結果區：控制付款成功 / 失敗標題 ===== */
.payment-hero {
  max-width: 44rem;
  margin: 0 auto 3rem;
  text-align: center;
}

/* ===== 狀態 icon 外圈：控制成功或失敗圓形圖示 ===== */
.payment-status-icon {
  width: 4.6rem;
  height: 4.6rem;
  display: grid;
  place-items: center;
  margin: 0 auto 1.25rem;
  border-radius: 999px;
  color: #ffffff;
  font-size: 1.55rem;
  box-shadow: 0 18px 42px rgba(15, 37, 56, 0.16);
}

/* ===== 成功 icon：控制綠色狀態 ===== */
.payment-status-icon-success {
  background:
    linear-gradient(
      135deg,
      #6bcda0 0%,
      var(--color-success) 100%
    );
}

/* ===== 失敗 icon：控制紅色狀態 ===== */
.payment-status-icon-failed {
  background:
    linear-gradient(
      135deg,
      #ee8989 0%,
      var(--color-danger) 100%
    );
}

/* ===== 付款頁小標：控制 PAYMENT SUCCESSFUL ===== */
.payment-eyebrow {
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.28em;
  margin-bottom: 0.65rem;
}

/* ===== 付款頁主標題：控制付款成功文字 ===== */
.payment-title {
  color: var(--color-primary);
  font-size: clamp(2.3rem, 8vw, 4rem);
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 0.8rem;
}

/* ===== 付款頁描述：控制標題下方說明 ===== */
.payment-desc {
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.8;
  margin: 0;
}

/* ===== 付款資訊區：控制卡片容器 ===== */
.payment-section {
  width: min(100%, 88rem);
  margin: 0 auto;
}

/* ===== 付款資訊排版：手機版單欄 ===== */
.payment-container {
  display: grid;
  gap: 1.25rem;
}

/* ===== 付款卡片：控制訂單資訊與購買人資訊外觀 ===== */
.payment-card {
  overflow: hidden;
  border: 1px solid rgba(230, 216, 189, 0.95);
  border-radius: 1.35rem;
  background-color: rgba(255, 255, 255, 0.82);
  box-shadow: 0 20px 54px rgba(15, 37, 56, 0.08);
}

/* ===== 卡片標題列：控制粉米色 header ===== */
.payment-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.45rem 1.55rem;
  border-bottom: 1px solid rgba(230, 216, 189, 0.9);
  background:
    linear-gradient(
      135deg,
      rgba(255, 250, 240, 0.78) 0%,
      rgba(248, 247, 243, 0.92) 100%
    );
}

/* ===== 卡片英文小標：控制 ORDER INFORMATION ===== */
.payment-card-eyebrow {
  color: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  margin-bottom: 0.3rem;
}

/* ===== 卡片標題：控制訂單資訊文字 ===== */
.payment-card-header h2 {
  color: var(--color-primary);
  font-size: 1.35rem;
  font-weight: 900;
  margin: 0;
}

/* ===== 狀態徽章：控制付款狀態小膠囊 ===== */
.payment-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.5rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 900;
  white-space: nowrap;
}

/* ===== 成功徽章 ===== */
.payment-badge-success {
  color: #277254;
  background-color: rgba(58, 168, 117, 0.12);
  border: 1px solid rgba(58, 168, 117, 0.25);
}

/* ===== 失敗徽章 ===== */
.payment-badge-failed {
  color: #a53737;
  background-color: rgba(216, 92, 92, 0.12);
  border: 1px solid rgba(216, 92, 92, 0.25);
}

/* ===== 會員徽章 ===== */
.payment-badge-member {
  color: var(--color-primary);
  background-color: rgba(217, 178, 111, 0.16);
  border: 1px solid rgba(217, 178, 111, 0.34);
}

/* ===== 訂單資料列表 ===== */
.payment-info-list {
  display: grid;
  padding: 1.35rem 1.55rem 0;
}

/* ===== 單行訂單資料 ===== */
.payment-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(230, 216, 189, 0.7);
}

/* ===== 訂單資料 label ===== */
.payment-info-row span {
  color: var(--color-muted);
  font-size: 0.95rem;
  font-weight: 700;
}

/* ===== 訂單資料 value ===== */
.payment-info-row strong {
  color: var(--color-primary);
  font-size: 0.95rem;
  font-weight: 900;
  text-align: right;
}

/* ===== 方案資訊盒：控制購買方案區塊 ===== */
.payment-plan-box {
  margin: 1.35rem 1.55rem;
  padding: 1.2rem;
  border: 1px solid rgba(230, 216, 189, 0.9);
  border-radius: 1rem;
  background-color: rgba(255, 250, 240, 0.45);
}

/* ===== 方案小標 ===== */
.payment-plan-label {
  color: var(--color-accent);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  margin-bottom: 0.45rem;
}

/* ===== 方案名稱 ===== */
.payment-plan-box h3 {
  color: var(--color-primary);
  font-size: 1.2rem;
  font-weight: 900;
  margin-bottom: 0.4rem;
}

/* ===== 方案描述 ===== */
.payment-plan-box p:last-child {
  color: var(--color-muted);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}

/* ===== 實付金額列 ===== */
.payment-total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.55rem 1.55rem;
}

/* ===== 實付金額 label ===== */
.payment-total-row span {
  color: var(--color-primary);
  font-size: 1rem;
  font-weight: 900;
}

/* ===== 實付金額數字 ===== */
.payment-total-row strong {
  color: var(--color-accent);
  font-size: 1.7rem;
  font-weight: 900;
}

/* ===== 購買人資料盒 ===== */
.buyer-box {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  margin: 1.35rem 1.55rem;
  padding: 1.2rem;
  border: 1px solid rgba(230, 216, 189, 0.9);
  border-radius: 1rem;
  background-color: rgba(255, 250, 240, 0.48);
}

/* ===== 購買人頭像 ===== */
.buyer-avatar {
  width: 3.4rem;
  height: 3.4rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      var(--color-primary) 0%,
      var(--color-primary-dark) 100%
    );
  font-size: 1.15rem;
  font-weight: 900;
}

/* ===== 購買人資訊排列 ===== */
.buyer-info {
  display: grid;
  gap: 0.65rem;
}

/* ===== 購買人資訊單行 ===== */
.buyer-info p {
  display: grid;
  gap: 0.15rem;
  margin: 0;
}

/* ===== 購買人資訊 label ===== */
.buyer-info span {
  color: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

/* ===== 購買人資訊 value ===== */
.buyer-info strong {
  color: var(--color-primary);
  font-size: 0.95rem;
  font-weight: 900;
  word-break: break-all;
}

/* ===== 提示訊息：控制成功 / 失敗提示盒 ===== */
.payment-notice {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: start;
  margin: 0 1.55rem 1.35rem;
  padding: 1rem;
  border-radius: 0.95rem;
  font-size: 0.92rem;
  line-height: 1.7;
}

/* ===== 提示訊息文字 ===== */
.payment-notice p {
  margin: 0;
}

/* ===== 成功提示盒 ===== */
.payment-notice-success {
  color: #277254;
  background-color: rgba(58, 168, 117, 0.08);
  border: 1px solid rgba(58, 168, 117, 0.18);
}

/* ===== 失敗提示盒 ===== */
.payment-notice-failed {
  color: #a53737;
  background-color: rgba(216, 92, 92, 0.08);
  border: 1px solid rgba(216, 92, 92, 0.18);
}

/* ===== 按鈕區 ===== */
.payment-actions {
  display: grid;
  gap: 0.75rem;
  padding: 0 1.55rem 1.55rem;
}

/* ===== 共用操作按鈕 ===== */
.payment-button {
  min-height: 3.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: 0.2s ease;
}

/* ===== 主要操作按鈕 ===== */
.payment-button-primary {
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      var(--color-primary) 0%,
      var(--color-primary-dark) 100%
    );
  box-shadow: 0 16px 36px rgba(31, 53, 72, 0.18);
}

/* ===== 主要操作按鈕 hover ===== */
.payment-button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 44px rgba(31, 53, 72, 0.24);
}

/* ===== 外框操作按鈕 ===== */
.payment-button-outline {
  color: var(--color-primary);
  border: 1px solid rgba(217, 178, 111, 0.85);
  background-color: rgba(255, 255, 255, 0.72);
}

/* ===== 外框操作按鈕 hover ===== */
.payment-button-outline:hover {
  transform: translateY(-2px);
  background-color: #fffaf0;
}

/* ===== 平板以上：調整卡片留白 ===== */
@media (min-width: 48em) {
  .payment-page {
    padding: 6rem 2rem 5rem;
  }

  .payment-card-header {
    padding: 1.65rem 1.8rem;
  }

  .payment-info-list {
    padding-inline: 1.8rem;
  }

  .payment-plan-box,
  .buyer-box {
    margin-inline: 1.8rem;
  }

  .payment-total-row,
  .payment-actions {
    padding-inline: 1.8rem;
  }

  .payment-notice {
    margin-inline: 1.8rem;
  }
}

/* ===== 桌機以上：左右兩欄排版 ===== */
@media (min-width: 64em) {
  .payment-container {
    grid-template-columns: 1.15fr 0.85fr;
    gap: 1.5rem;
    align-items: start;
  }
}
</style>