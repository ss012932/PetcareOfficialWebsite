<template>
  <!-- ===== 訂單頁面：控制整個訂單資訊頁背景與版面 ===== -->
  <main class="order-page">
    <div class="container order-container">
      <!-- ===== 訂單摘要區：控制左側方案與金額資訊 ===== -->
      <section class="order-panel" aria-labelledby="order-summary-title">
        <header class="panel-header">
          <div>
            <p class="panel-eyebrow">ORDER SUMMARY</p>

            <h1 id="order-summary-title" class="panel-title">訂單摘要</h1>
          </div>

          <span class="status-badge"> 待付款 </span>
        </header>

        <div class="panel-body">
          <!-- ===== 方案卡片：控制目前選擇方案資訊 ===== -->
          <article class="selected-plan-card">
            <div>
              <h2 class="selected-plan-name">
                {{ selectedPlan?.PlanName }}
              </h2>

              <p class="selected-plan-desc">
                {{ selectedPlan?.Description }}
              </p>
            </div>

            <div class="selected-plan-tags">
              <span v-for="tag in selectedPlan?.SuitableTags" :key="tag">
                {{ tag }}
              </span>
            </div>
          </article>

          <!-- ===== 訂單明細：控制方案名稱、數量與小計 ===== -->
          <div class="order-detail">
            <div class="order-item">
              <div>
                <h3>{{ selectedPlan?.PlanName }}</h3>
                <p>{{ selectedPlan?.Tagline }}</p>
              </div>

              <div class="order-item-price">
                <span>x 1</span>
                <strong
                  >NT$ {{ selectedPlan?.Price.toLocaleString()
                  }}{{ selectedPlan?.Period }}</strong
                >
              </div>
            </div>

            <dl class="order-total-list">
              <div>
                <dt>小計</dt>
                <dd>NT$ {{ selectedPlan?.Price.toLocaleString() }}</dd>
              </div>

              <div>
                <dt>訂閱期間</dt>
                <dd>{{ selectedPlan?.SubscriptionMonth }} 個月</dd>
              </div>

              <div class="total-row">
                <dt>應付金額</dt>
                <dd>NT$ {{ selectedPlan?.Price.toLocaleString() }}</dd>
              </div>
            </dl>
          </div>

          <!-- ===== 下單流程說明：控制付款後流程時間軸 ===== -->
          <div class="order-note">
            <h3 class="order-note-title">送出訂單後流程</h3>


            <ol class="order-steps" role="list">
              <li class="order-step">
                <div class="step-indicator" aria-hidden="true">
                  <span class="step-num">1</span>
                  <span class="step-connector"></span>
                </div>
                <div class="step-body">
                  <strong class="step-title">建立申請紀錄</strong>
                  <p class="step-desc">送出訂單後，系統會先建立方案申請紀錄，尚不代表購買已完成或服務已正式開通。</p>
                </div>
              </li>

              <li class="order-step">
                <div class="step-indicator" aria-hidden="true">
                  <span class="step-num">2</span>
                  <span class="step-connector"></span>
                </div>
                <div class="step-body">
                  <strong class="step-title">專人聯繫確認</strong>
                  <p class="step-desc">專人將與您聯繫，確認院所資料、所選方案、導入需求、加購項目與付款方式。</p>
                </div>
              </li>

              <li class="order-step">
                <div class="step-indicator" aria-hidden="true">
                  <span class="step-num">3</span>
                  <span class="step-connector"></span>
                </div>
                <div class="step-body">
                  <strong class="step-title">確認付款資訊</strong>
                  <p class="step-desc">雙方確認方案內容、金額、使用期間與付款方式後，將提供付款資訊或報價內容。</p>
                </div>
              </li>

              <li class="order-step">
                <div class="step-indicator" aria-hidden="true">
                  <span class="step-num">4</span>
                  <span class="step-connector"></span>
                </div>
                <div class="step-body">
                  <strong class="step-title">完成付款與開通</strong>
                  <p class="step-desc">完成付款並經本平台確認必要資料後，將依所選方案進行帳號建立、權限設定與系統開通。</p>
                </div>
              </li>

              <li class="order-step">
                <div class="step-indicator" aria-hidden="true">
                  <span class="step-num">5</span>
                  <span class="step-connector"></span>
                </div>
                <div class="step-body">
                  <strong class="step-title">開始使用服務</strong>
                  <p class="step-desc">服務開通完成後，即可開始使用系統服務；若涉及資料匯入、客製化設定、分院設定或第三方服務串接，實際啟用時間將依雙方確認內容辦理。</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <!-- ===== 購買人資訊區：控制右側使用者資料與送出按鈕 ===== -->
      <section class="order-panel" aria-labelledby="buyer-info-title">
        <header class="panel-header">
          <div>
            <p class="panel-eyebrow">PURCHASER INFO</p>

            <h2 id="buyer-info-title" class="panel-title">購買人資訊</h2>
          </div>


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
              <span>聯絡電話</span>
              <strong>{{ buyer.phone || '未設定' }}</strong>
            </div>
          </div>

          <!-- ===== 院所資訊欄位：控制購買方案需要的基本資料 ===== -->
          <div class="form-grid">
            <div class="form-group">
              <label for="clinic-name" class="form-label"> 院所名稱 </label>

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
              <label for="contact-phone" class="form-label"> 聯絡電話 </label>

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
              <label for="remark" class="form-label"> 備註需求 </label>

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
            <NuxtLink to="/price" class="back-link"> 返回價格方案 </NuxtLink>

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
import { computed, reactive, ref } from "vue";
import Swal from "sweetalert2";
import api, { authAPI } from "~/composables/utils/api";

// ===== Middleware：限制此頁面需登入才可進入 =====
definePageMeta({
  middleware: "auth",
});

// ===== 頁面 SEO：控制瀏覽器標題與描述 =====
useHead({
  title: "訂單資訊｜PetCare System",
  meta: [
    {
      name: "description",
      content: "確認 PetCare System 方案訂單摘要與購買人資訊。",
    },
  ],
});

// ===== 路由功能：取得價格頁帶過來的方案代碼 =====
const route = useRoute();

// ===== 路由功能：送出訂單後可導回首頁或其他頁面 =====
const router = useRouter();

// ===== 方案資料型別：對應 API 回傳格式 =====
interface ApiPlan {
  Id: number;
  PlanCode: string;
  PlanName: string;
  Tagline: string;
  Description: string;
  Price: number;
  OriginalPrice: number;
  Period: string;
  SubscriptionMonth: number;
  Features: string[];
  SuitableTags: string[];
  IsFeatured: boolean;
  IsActive: boolean;
  Badge: string | null;
  SaveAmount: number;
  SaveText: string;
}

interface PlansResponse {
  success: boolean;
  data: ApiPlan[];
}

// ===== 方案清單：從 API 取得 =====
const plansRes = await api.get("/plans");
const plansData = ref<PlansResponse | null>(plansRes.data ?? null);

// ===== 目前選擇方案：從網址 query 的 PlanCode 對應 API 資料 =====
const selectedPlan = computed<ApiPlan | null>(() => {
  const queryPlan = String(route.query.plan ?? "").toUpperCase();
  const list = plansData.value?.data ?? [];

  // ===== 依 PlanCode 比對，找不到就取第一筆 =====
  return list.find((p) => p.PlanCode === queryPlan) ?? list[0] ?? null;
});

// ===== 購買人資料：透過 authAPI.checkLoginStatus() 取得真實會員資訊 =====
const authResult = await authAPI.checkLoginStatus();

const buyer = computed(() => ({
  name: authResult?.user?.Name ?? "",
  email: authResult?.user?.Email ?? "",
  phone: authResult?.user?.Phone ?? "",
}));

// ===== 訂單表單資料：控制院所資料與備註需求 =====
const form = reactive({
  clinicName: "",
  phone: "",
  remark: "",
});

// ===== 送出訂單：目前先示範前端流程，之後可改成呼叫訂單 API =====
async function handleSubmitOrder() {
  console.log("送出訂單資料：", {
    plan: selectedPlan.value,
    buyer,
    form,
  });

  await Swal.fire({
    icon: "success",
    title: "訂單已送出",
    text: "我們已收到您的方案申請，後續將由專人與您聯繫。",
    confirmButtonText: "返回首頁",
    confirmButtonColor: "#2e4a62",
  });

  await router.push("/");
}
</script>

<style scoped>
/* ===== 共用容器：控制頁面最大寬度 ===== */
.container {
  width: min(100% - 3rem, 160rem);
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
  padding: 1.5rem 0;
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
  padding: 1rem 1.25rem;
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
  font-size: clamp(1.2rem, 4vw, 1.55rem);
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



/* ===== 面板內容：控制卡片內距（手機為緊湊） ===== */
.panel-body {
  padding: 1.25rem;
}

/* ===== 選擇方案卡片：控制方案摘要視覺 ===== */
.selected-plan-card {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(230, 216, 189, 0.92);
  border-radius: 1.25rem;
  background: linear-gradient(
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

/* ===== 流程說明容器：控制時間軸區塊 ===== */
.order-note {
  margin-top: 2rem;
  padding: 1.1rem 0.5rem;
}

/* ===== 流程說明標題：控制時間軸上方 label ===== */
.order-note-title {
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1.35rem;
  padding-left: 0.65rem;
  border-left: 3px solid var(--color-accent);
}

/* ===== 步驟列表：控制時間軸整體 ===== */
.order-steps {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* ===== 單一步驟：控制數字圓圈與內容並排 ===== */
.order-step {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: 0 0.85rem;
}

/* ===== 步驟指示器：控制數字圓圈與連接線 ===== */
.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ===== 步驟數字圓圈：控制數字標記 ===== */
.step-num {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: 50%;
  color: #ffffff;
  background-color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== 步驟連接線：控制圓圈之間的垂直線 ===== */
.step-connector {
  flex: 1;
  width: 2px;
  min-height: 0.75rem;
  background: linear-gradient(
    to bottom,
    rgba(46, 74, 98, 0.25),
    rgba(217, 178, 111, 0.45)
  );
  margin: 0.3rem 0;
}

/* ===== 最後一步不顯示連接線 ===== */
.order-step:last-child .step-connector {
  display: none;
}

/* ===== 步驟內容：控制標題與說明文字 ===== */
.step-body {
  padding-bottom: 1.25rem;
}

.order-step:last-child .step-body {
  padding-bottom: 0;
}

/* ===== 步驟標題：控制步驟名稱，與圓圈垂直對齊 ===== */
.step-title {
  display: block;
  color: var(--color-primary);
  font-size: 0.92rem;
  font-weight: 900;
  line-height: 2rem;
  margin-bottom: 0.2rem;
}

/* ===== 步驟說明：控制步驟詳細描述 ===== */
.step-desc {
  color: var(--color-muted);
  font-size: 0.85rem;
  line-height: 1.72;
  margin: 0;
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
  background: linear-gradient(
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

/* ===== 平板以上：表單雙欄、品項橫排、按鈕並排 ===== */
@media (min-width: 48em) {
  .order-page {
    padding: 2.5rem 0;
  }

  .panel-header,
  .panel-body {
    padding-inline: 1.75rem;
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
    min-width: 10rem;
  }

  .order-actions {
    grid-template-columns: 1fr 1.3fr;
  }
}

/* ===== 桌機以上：左右雙欄，左側 sticky ===== */
@media (min-width: 64em) {
  .order-page {
    padding: 4rem 0;
  }

  .order-container {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  .panel-header,
  .panel-body {
    padding-inline: 2rem;
  }
}
</style>
