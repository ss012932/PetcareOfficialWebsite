<template>
  <!-- ===== 訂單頁面：控制整個訂單資訊頁背景與版面 ===== -->
  <main class="order-page">
    <div class="container order-container">
      <!-- ===== 訂單摘要區：控制左側方案與金額資訊 ===== -->
      <section class="order-panel" aria-labelledby="order-summary-title">
        <header class="panel-header">
          <div>
            <p class="panel-eyebrow">
              ORDER SUMMARY
            </p>

            <h1 id="order-summary-title" class="panel-title">
              訂單摘要
            </h1>
          </div>

          <span class="status-badge">
            待付款
          </span>
        </header>

        <div class="panel-body">
          <!-- ===== 方案卡片：控制目前選擇方案資訊 ===== -->
          <article class="selected-plan-card">
            <div>
              <h2 class="selected-plan-name">
                {{ selectedPlan.name }}
              </h2>

              <p class="selected-plan-desc">
                {{ selectedPlan.description }}
              </p>
            </div>

            <div class="selected-plan-tags">
              <span
                v-for="tag in selectedPlan.tags"
                :key="tag"
              >
                {{ tag }}
              </span>
            </div>
          </article>

          <!-- ===== 訂單明細：控制方案名稱、數量與小計 ===== -->
          <div class="order-detail">
            <div class="order-item">
              <div>
                <h3>{{ selectedPlan.name }}</h3>
                <p>{{ selectedPlan.subtitle }}</p>
              </div>

              <div class="order-item-price">
                <span>x 1</span>
                <strong>{{ selectedPlan.priceText }}</strong>
              </div>
            </div>

            <dl class="order-total-list">
              <div>
                <dt>小計</dt>
                <dd>{{ selectedPlan.priceText }}</dd>
              </div>

              <div>
                <dt>專案數量</dt>
                <dd>1 個</dd>
              </div>

              <div class="total-row">
                <dt>應付金額</dt>
                <dd>{{ selectedPlan.priceText }}</dd>
              </div>
            </dl>
          </div>

          <!-- ===== 下單流程說明：控制付款後流程提示 ===== -->
          <div class="order-note">
            <h3>送出訂單後流程</h3>

            <ol>
              <li>送出訂單後，系統會建立方案申請紀錄。</li>
              <li>專人將與您聯繫，確認院所資料與導入需求。</li>
              <li>完成付款與開通後，即可開始使用系統服務。</li>
            </ol>
          </div>
        </div>
      </section>

      <!-- ===== 購買人資訊區：控制右側使用者資料與送出按鈕 ===== -->
      <section class="order-panel" aria-labelledby="buyer-info-title">
        <header class="panel-header">
          <div>
            <p class="panel-eyebrow">
              PURCHASER INFO
            </p>

            <h2 id="buyer-info-title" class="panel-title">
              購買人資訊
            </h2>
          </div>

          <span class="status-badge status-badge-login">
            已登入
          </span>
        </header>

        <form class="panel-body buyer-form" @submit.prevent="handleSubmitOrder">
          <!-- ===== 購買人資料卡：控制登入會員資料顯示 ===== -->
          <div class="buyer-info-card">
            <div class="buyer-info-item">
              <span>姓名</span>
              <strong>{{ buyer.name }}</strong>
            </div>

            <div class="buyer-info-item">
              <span>Email</span>
              <strong>{{ buyer.email }}</strong>
            </div>

            <div class="buyer-info-item">
              <span>身分</span>
              <strong>{{ buyer.role }}</strong>
            </div>
          </div>

          <!-- ===== 院所資訊欄位：控制購買方案需要的基本資料 ===== -->
          <div class="form-grid">
            <div class="form-group">
              <label for="clinic-name" class="form-label">
                院所名稱
              </label>

              <input
                id="clinic-name"
                v-model.trim="form.clinicName"
                type="text"
                class="form-control"
                placeholder="請輸入院所名稱"
                required
              />
            </div>

            <div class="form-group">
              <label for="contact-phone" class="form-label">
                聯絡電話
              </label>

              <input
                id="contact-phone"
                v-model.trim="form.phone"
                type="tel"
                class="form-control"
                placeholder="請輸入聯絡電話"
                required
              />
            </div>

            <div class="form-group form-group-full">
              <label for="remark" class="form-label">
                備註需求
              </label>

              <textarea
                id="remark"
                v-model.trim="form.remark"
                class="form-control form-textarea"
                placeholder="可填寫導入需求、分院數、預計使用人數或希望聯繫時間"
              ></textarea>
            </div>
          </div>

          <!-- ===== 訂單提醒：控制送出前提醒文字 ===== -->
          <div class="buyer-notice">
            訂單將以上方帳號資訊建立。送出後系統會保留您的方案申請，後續由專人協助付款與開通流程。
          </div>

          <!-- ===== 操作按鈕：控制返回與送出訂單 ===== -->
          <div class="order-actions">
            <NuxtLink to="/price" class="back-link">
              返回價格方案
            </NuxtLink>

            <button type="submit" class="submit-button">
              確認送出訂單
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import Swal from 'sweetalert2'

// ===== 頁面 SEO：控制瀏覽器標題與描述 =====
useHead({
  title: '訂單資訊｜PetCare System',
  meta: [
    {
      name: 'description',
      content: '確認 PetCare System 方案訂單摘要與購買人資訊。',
    },
  ],
})

// ===== 路由功能：取得價格頁帶過來的方案代碼 =====
const route = useRoute()

// ===== 路由功能：送出訂單後可導回首頁或其他頁面 =====
const router = useRouter()

// ===== 方案資料型別：控制方案內容格式 =====
interface PlanInfo {
  code: string
  name: string
  subtitle: string
  description: string
  price: number | null
  priceText: string
  tags: string[]
}

// ===== 方案資料：依照 price.vue 的 plan query 對應顯示內容 =====
const plans: Record<PlanCode, PlanInfo> = {
  basic: {
    code: 'basic',
    name: '基本版',
    subtitle: '適合小型動物診所',
    description: '提供預約排程、電子病歷與基本收費功能，適合剛開始數位化管理的院所。',
    price: 1980,
    priceText: 'NT$1,980 / 月',
    tags: ['預約排程', '電子病歷', '3 個員工帳號'],
  },
  pro: {
    code: 'pro',
    name: '專業版',
    subtitle: '適合成長中的動物醫院',
    description: '包含基本版所有功能，並加入庫存管理、報表分析與進階營運管理。',
    price: 3980,
    priceText: 'NT$3,980 / 月',
    tags: ['庫存管理', '報表分析', '10 個員工帳號'],
  },
  enterprise: {
    code: 'enterprise',
    name: '企業版',
    subtitle: '適合多分院與大型院所',
    description: '提供多分院管理、客製報表、專屬導入協助與技術支援服務。',
    price: null,
    priceText: '客製報價',
    tags: ['多分院管理', '客製報表', '專屬支援'],
  },
}

// ===== 方案代碼型別：限制只能使用這三種方案代碼 =====
type PlanCode = 'basic' | 'pro' | 'enterprise'

// ===== 判斷方案代碼是否有效：避免 query 傳入不存在的方案 =====
function isPlanCode(value: string): value is PlanCode {
  return ['basic', 'pro', 'enterprise'].includes(value)
}

// ===== 目前選擇方案：從網址 query 判斷方案，沒有就預設基本版 =====
const selectedPlan = computed<PlanInfo>(() => {
  const queryPlan = String(route.query.plan ?? 'basic')

  // ===== 如果網址方案代碼有效，就使用該方案；否則預設基本版 =====
  const planCode: PlanCode = isPlanCode(queryPlan) ? queryPlan : 'basic'

  return plans[planCode]
})

// ===== 購買人資料：之後可改成從登入會員 API 或 Pinia store 取得 =====
const buyer = reactive({
  name: '目前登入會員',
  email: 'member@example.com',
  role: '會員',
})

// ===== 訂單表單資料：控制院所資料與備註需求 =====
const form = reactive({
  clinicName: '',
  phone: '',
  remark: '',
})

// ===== 送出訂單：目前先示範前端流程，之後可改成呼叫訂單 API =====
async function handleSubmitOrder() {
  console.log('送出訂單資料：', {
    plan: selectedPlan.value,
    buyer,
    form,
  })

  await Swal.fire({
    icon: 'success',
    title: '訂單已送出',
    text: '我們已收到您的方案申請，後續將由專人與您聯繫。',
    confirmButtonText: '返回首頁',
    confirmButtonColor: '#2e4a62',
  })

  await router.push('/')
}
</script>

<style scoped>
/* ===== 共用容器：控制頁面最大寬度 ===== */
.container {
  width: min(100% - 2rem, 92rem);
  margin-inline: auto;
}

/* ===== 訂單頁面：控制整頁背景與基本色系 ===== */
.order-page {
  --color-primary: #2e4a62;
  --color-primary-dark: #1f3548;
  --color-accent: #d9b26f;
  --color-bg: #f8f7f3;
  --color-text: #263238;
  --color-muted: #6f7a80;
  --color-border: #e6d8bd;

  min-height: 100vh;
  padding: 3rem 0;
  color: var(--color-text);
  background:
    radial-gradient(circle at top left, rgba(217, 178, 111, 0.16), transparent 28rem),
    radial-gradient(circle at bottom right, rgba(156, 191, 167, 0.12), transparent 26rem),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(248, 247, 243, 0.98) 100%
    );
}

/* ===== 訂單雙欄容器：手機版單欄排列 ===== */
.order-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* ===== 訂單面板：控制左右卡片外觀 ===== */
.order-panel {
  overflow: hidden;
  border: 1px solid rgba(230, 216, 189, 0.95);
  border-radius: 1.5rem;
  background-color: rgba(255, 255, 255, 0.72);
  box-shadow: 0 18px 50px rgba(15, 37, 56, 0.08);
}

/* ===== 面板標題列：控制標題與狀態 badge ===== */
.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(230, 216, 189, 0.82);
  background-color: rgba(255, 250, 240, 0.65);
}

/* ===== 面板英文小標：控制 ORDER SUMMARY / PURCHASER INFO ===== */
.panel-eyebrow {
  color: var(--color-accent);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}

/* ===== 面板標題：控制訂單摘要與購買人資訊文字 ===== */
.panel-title {
  color: var(--color-primary);
  font-size: 1.55rem;
  font-weight: 900;
  letter-spacing: 0.06em;
}

/* ===== 狀態標籤：控制待付款與已登入 badge ===== */
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.5rem;
  padding: 0.45rem 0.9rem;
  border: 1px solid rgba(217, 178, 111, 0.55);
  border-radius: 999px;
  color: var(--color-primary);
  background-color: #fffaf0;
  font-size: 0.82rem;
  font-weight: 900;
  white-space: nowrap;
}

/* ===== 已登入標籤：控制購買人資訊狀態顏色 ===== */
.status-badge-login {
  color: #ffffff;
  background-color: var(--color-primary);
  border-color: var(--color-accent);
}

/* ===== 面板內容：控制卡片內距 ===== */
.panel-body {
  padding: 1.5rem;
}

/* ===== 選擇方案卡片：控制方案摘要視覺 ===== */
.selected-plan-card {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(230, 216, 189, 0.92);
  border-radius: 1.25rem;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.92) 0%,
      rgba(255, 250, 240, 0.74) 100%
    );
}

/* ===== 方案名稱：控制選中方案標題 ===== */
.selected-plan-name {
  color: var(--color-primary);
  font-size: 1.25rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

/* ===== 方案描述：控制方案說明文字 ===== */
.selected-plan-desc {
  color: var(--color-muted);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}

/* ===== 方案標籤：控制功能標籤排列 ===== */
.selected-plan-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* ===== 方案標籤文字：控制小膠囊樣式 ===== */
.selected-plan-tags span {
  padding: 0.35rem 0.75rem;
  border: 1px solid rgba(217, 178, 111, 0.55);
  border-radius: 999px;
  color: var(--color-primary);
  background-color: #fffaf0;
  font-size: 0.82rem;
  font-weight: 800;
}

/* ===== 訂單明細：控制項目與總計區距離 ===== */
.order-detail {
  margin-top: 2rem;
}

/* ===== 訂單項目：控制方案品項左右排列 ===== */
.order-item {
  display: grid;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(230, 216, 189, 0.92);
}

/* ===== 訂單品項標題：控制方案名稱 ===== */
.order-item h3 {
  color: var(--color-text);
  font-size: 1.05rem;
  font-weight: 900;
  margin-bottom: 0.45rem;
}

/* ===== 訂單品項說明：控制方案副標 ===== */
.order-item p {
  color: var(--color-muted);
  font-size: 0.95rem;
  margin: 0;
}

/* ===== 訂單品項價格：控制數量與價格 ===== */
.order-item-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* ===== 訂單品項數量：控制 x 1 ===== */
.order-item-price span {
  color: var(--color-muted);
  font-size: 0.9rem;
  font-weight: 800;
}

/* ===== 訂單品項金額：控制價格文字 ===== */
.order-item-price strong {
  color: var(--color-primary);
  font-size: 1.15rem;
  font-weight: 900;
}

/* ===== 訂單總計列表：控制小計與應付金額 ===== */
.order-total-list {
  display: grid;
  gap: 0.8rem;
  margin: 1.5rem 0 0;
}

/* ===== 訂單總計列：控制左右排列 ===== */
.order-total-list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* ===== 總計標籤：控制小計文字 ===== */
.order-total-list dt {
  color: var(--color-muted);
  font-size: 0.95rem;
  font-weight: 800;
}

/* ===== 總計金額：控制右側文字 ===== */
.order-total-list dd {
  color: var(--color-text);
  font-size: 0.95rem;
  font-weight: 800;
  margin: 0;
}

/* ===== 應付金額列：控制最後一列強調 ===== */
.total-row {
  padding-top: 1rem;
  border-top: 1px solid rgba(230, 216, 189, 0.92);
}

/* ===== 應付金額標題：控制應付金額文字 ===== */
.total-row dt {
  color: var(--color-primary);
  font-size: 1.05rem;
  font-weight: 900;
}

/* ===== 應付金額金額：控制大金額 ===== */
.total-row dd {
  color: var(--color-primary);
  font-size: 1.35rem;
  font-weight: 900;
}

/* ===== 流程說明：控制送出訂單後流程框 ===== */
.order-note {
  margin-top: 2rem;
  padding: 1.25rem;
  border: 1px solid rgba(230, 216, 189, 0.92);
  border-radius: 1rem;
  background-color: rgba(255, 250, 240, 0.55);
}

/* ===== 流程說明標題：控制小標 ===== */
.order-note h3 {
  color: var(--color-primary);
  font-size: 1rem;
  font-weight: 900;
  margin-bottom: 0.75rem;
}

/* ===== 流程說明列表：控制數字列表 ===== */
.order-note ol {
  display: grid;
  gap: 0.5rem;
  padding-left: 1.2rem;
  margin: 0;
}

/* ===== 流程說明項目：控制文字 ===== */
.order-note li {
  color: var(--color-muted);
  font-size: 0.92rem;
  line-height: 1.7;
}

/* ===== 購買人表單：控制右側內容排列 ===== */
.buyer-form {
  display: grid;
  gap: 1.5rem;
}

/* ===== 購買人資料卡：控制登入資訊框 ===== */
.buyer-info-card {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(230, 216, 189, 0.92);
  border-radius: 1.25rem;
  background-color: rgba(255, 250, 240, 0.5);
}

/* ===== 購買人資料項目：控制姓名 Email 身分 ===== */
.buyer-info-item {
  display: grid;
  gap: 0.3rem;
}

/* ===== 購買人資料 label：控制小標文字 ===== */
.buyer-info-item span {
  color: var(--color-accent);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

/* ===== 購買人資料值：控制顯示文字 ===== */
.buyer-info-item strong {
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 900;
  word-break: break-all;
}

/* ===== 表單格線：控制院所名稱與電話排列 ===== */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* ===== 表單群組：控制 label 與 input 間距 ===== */
.form-group {
  display: grid;
  gap: 0.45rem;
}

/* ===== 表單 label：控制欄位名稱樣式 ===== */
.form-label {
  color: var(--color-primary);
  font-size: 0.95rem;
  font-weight: 900;
}

/* ===== 表單欄位：控制 input 與 textarea 樣式 ===== */
.form-control {
  width: 100%;
  min-height: 3.1rem;
  padding: 0 1rem;
  border: 1px solid rgba(230, 216, 189, 0.95);
  border-radius: 0.9rem;
  color: var(--color-text);
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  outline: none;
  transition: 0.2s ease;
}

/* ===== 表單欄位 focus：控制聚焦外框 ===== */
.form-control:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(217, 178, 111, 0.16);
}

/* ===== 備註欄位：控制 textarea 高度 ===== */
.form-textarea {
  min-height: 7rem;
  padding-top: 0.9rem;
  resize: vertical;
}

/* ===== 訂單提醒：控制提示框 ===== */
.buyer-notice {
  padding: 1rem 1.1rem;
  border: 1px solid rgba(230, 216, 189, 0.92);
  border-radius: 1rem;
  color: var(--color-muted);
  background-color: rgba(255, 250, 240, 0.55);
  font-size: 0.95rem;
  line-height: 1.7;
}

/* ===== 操作按鈕區：控制返回與送出排列 ===== */
.order-actions {
  display: grid;
  gap: 0.85rem;
}

/* ===== 返回連結：控制次要按鈕 ===== */
.back-link {
  min-height: 3.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  border: 1px solid rgba(217, 178, 111, 0.65);
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.75);
  font-size: 1rem;
  font-weight: 900;
  text-decoration: none;
  transition: 0.2s ease;
}

/* ===== 返回連結 hover：控制互動效果 ===== */
.back-link:hover {
  background-color: #fffaf0;
  transform: translateY(-2px);
}

/* ===== 送出按鈕：控制主要 CTA ===== */
.submit-button {
  min-height: 3.25rem;
  border: 2px solid var(--color-accent);
  border-radius: 999px;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      var(--color-primary) 0%,
      var(--color-primary-dark) 100%
    );
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: 0.2s ease;
}

/* ===== 送出按鈕 hover：控制互動效果 ===== */
.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(31, 53, 72, 0.22);
}

/* ===== 平板以上：控制表單雙欄與按鈕排列 ===== */
@media (min-width: 48em) {
  .order-page {
    padding: 4rem 0;
  }

  .panel-header,
  .panel-body {
    padding-inline: 2rem;
  }

  .form-grid {
    grid-template-columns: 1fr 1fr;
  }

  .form-group-full {
    grid-column: 1 / -1;
  }

  .order-item {
    grid-template-columns: 1fr auto;
    align-items: center;
  }

  .order-item-price {
    min-width: 11rem;
  }

  .order-actions {
    grid-template-columns: 0.8fr 1.2fr;
  }
}

/* ===== 桌機以上：控制左右雙欄排版 ===== */
@media (min-width: 64em) {
  .order-container {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  .order-panel {
    min-height: 35rem;
  }
}
</style>