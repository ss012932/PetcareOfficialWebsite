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

              <div v-if="coupon" class="discount-row">
                <dt>
                  優惠券折抵
                  <span class="coupon-code-tag">{{ coupon.Code }}</span>
                </dt>
                <dd class="discount-amount">
                  -NT$ {{ couponDiscount.toLocaleString() }}
                </dd>
              </div>

              <div class="total-row">
                <dt>應付金額</dt>
                <dd>NT$ {{ discountedPrice.toLocaleString() }}</dd>
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

          <!-- ===== 品牌選擇：若無品牌則提示新增 ===== -->
          <div v-if="!hasBrand" class="no-brand-notice">
            <p class="no-brand-text">您目前尚未建立任何品牌，請先前往會員中心新增品牌後再進行訂購。</p>
            <NuxtLink to="/member/brand" class="go-brand-link">前往新增品牌 →</NuxtLink>
          </div>

          <div v-else class="form-grid">
            <div class="form-group form-group-full">
              <label for="brand-select" class="form-label"> 選擇購買品牌 </label>

              <select
                id="brand-select"
                v-model="form.brandId"
                class="form-control form-select"
                required
              >
                <option value="" disabled>請選擇品牌</option>
                <option
                  v-for="brand in brands"
                  :key="brand.Id"
                  :value="brand.Id"
                >
                  {{ brand.BrandName }}（{{ brand.CompanyName }}）
                </option>
              </select>
            </div>

            <!-- ===== 備註需求（暫時關閉，未開放給用戶）=====
            <div class="form-group form-group-full">
              <label for="remark" class="form-label"> 備註需求 </label>

              <textarea
                id="remark"
                v-model.trim="form.remark"
                class="form-control form-textarea"
                placeholder="可填寫導入需求、分院數、預計使用人數或希望聯繫時間"
              ></textarea>
            </div>
            ===== -->
          </div>

          <!-- ===== 優惠券輸入：控制優惠券驗證與顯示 ===== -->
          <div class="coupon-section">
            <p class="coupon-label">優惠券</p>

            <div v-if="!coupon" class="coupon-input-row">
              <input
                v-model.trim="couponCode"
                type="text"
                class="form-control coupon-input"
                placeholder="請輸入優惠券代碼"
                :disabled="couponLoading"
                @keydown.enter.prevent="applyCoupon"
              />
              <button
                type="button"
                class="coupon-apply-btn"
                :disabled="!couponCode || couponLoading"
                @click="applyCoupon"
              >
                {{ couponLoading ? '驗證中…' : '套用' }}
              </button>
            </div>

            <p v-if="couponError" class="coupon-error">{{ couponError }}</p>

            <div v-if="coupon" class="coupon-result">
              <div class="coupon-result-header">
                <span class="coupon-result-code">{{ coupon.Code }}</span>
                <button type="button" class="coupon-remove-btn" @click="removeCoupon">移除</button>
              </div>

              <p class="coupon-result-discount">
                折抵
                <strong>
                  <template v-if="coupon.DiscountType === 'Amount'">NT$ {{ coupon.DiscountValue.toLocaleString() }}</template>
                  <template v-else>{{ coupon.DiscountValue }}%</template>
                </strong>
              </p>

              <p class="coupon-result-expire">
                有效期限：{{ new Date(coupon.ExpireDate).toLocaleDateString('zh-TW') }}
              </p>

              <ul v-if="coupon.GiftItems?.length" class="coupon-gifts">
                <li v-for="gift in coupon.GiftItems" :key="gift">{{ gift }}</li>
              </ul>
            </div>
          </div>

          <!-- ===== 訂閱選項：控制是否開啟自動續訂 ===== -->
          <label class="subscription-check">
            <input
              v-model="form.isSubscription"
              type="checkbox"
              class="subscription-checkbox"
            />
            <span class="subscription-check-text">
              開啟自動續訂（到期前自動依原方案續費）
            </span>
          </label>

          <!-- ===== 訂單提醒：控制送出前提醒文字 ===== -->
          <div class="buyer-notice">
            訂單將以上方帳號資訊建立。送出後系統會保留您的方案申請，後續由專人協助付款與開通流程。
          </div>

          <!-- ===== 操作按鈕：控制返回與送出訂單 ===== -->
          <div class="order-actions">
            <NuxtLink to="/price" class="back-link"> 返回價格方案 </NuxtLink>

            <button type="submit" class="submit-button" :disabled="!hasBrand">
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

const { t } = useI18n();

// ===== Middleware：限制此頁面需登入才可進入 =====
definePageMeta({
  middleware: "auth",
});

// ===== 頁面 SEO：控制瀏覽器標題與描述 =====
useHead(() => ({
  title: t("seo.order.title"),
  meta: [
    {
      name: "description",
      content: t("seo.order.description"),
    },
  ],
}));

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

// ===== 品牌型別：對應 API 回傳格式 =====
interface Brand {
  Id: number;
  BrandName: string;
  CompanyName: string;
  TaxId: string;
  LogoUrl: string;
  Phone: string;
  Email: string;
  Address: string;
  City: string | null;
  IsMultiStore: boolean;
  CreateDate: string;
  UpdateDate: string;
}

interface HasBrandResponse {
  Success: boolean;
  Message: string;
  HasBrand: boolean;
}

interface BrandsResponse {
  Success: boolean;
  Message: string;
  Brands: Brand[];
}

// ===== 品牌資料：僅在客戶端執行，避免 SSR 無 Cookie 導致 401 =====
const { data: hasBrandData } = await useAsyncData(
  "order-has-brand",
  async () => {
    const res = await api.get("/brands/has-brand");
    return res.data as HasBrandResponse;
  },
  { server: false },
);

const hasBrand = computed(() => hasBrandData.value?.HasBrand ?? false);

const { data: brandsData } = await useAsyncData(
  "order-my-brands",
  async () => {
    const res = await api.get("/brands/my");
    return res.data as BrandsResponse;
  },
  { server: false },
);

const brands = computed(() => brandsData.value?.Brands ?? []);

// ===== 優惠券型別：對應 API 回傳格式 =====
interface CouponData {
  CouponId: number;
  PlanId: number;
  Code: string;
  DiscountType: "Amount" | "Percentage";
  DiscountValue: number;
  GiftItems: string[];
  ExpireDate: string;
}

// ===== 優惠券狀態 =====
const couponCode = ref("");
const coupon = ref<CouponData | null>(null);
const couponError = ref("");
const couponLoading = ref(false);

// ===== 折扣金額與最終價格 =====
const couponDiscount = computed(() => {
  if (!coupon.value || !selectedPlan.value) return 0;
  if (coupon.value.DiscountType === "Amount") return coupon.value.DiscountValue;
  return Math.round(selectedPlan.value.Price * (coupon.value.DiscountValue / 100));
});

const discountedPrice = computed(() => {
  if (!selectedPlan.value) return 0;
  return Math.max(0, selectedPlan.value.Price - couponDiscount.value);
});

// ===== 套用優惠券：呼叫 API 驗證 =====
async function applyCoupon() {
  if (!couponCode.value) return;
  couponError.value = "";
  couponLoading.value = true;
  try {
    const res = await api.get(`/coupons/${couponCode.value}`, { planId: selectedPlan.value?.Id });
    const data = res.data;
    if (data?.success && data?.data) {
      coupon.value = data.data as CouponData;
    } else {
      couponError.value = data?.message || "優惠券無效";
    }
  } catch (e: any) {
    couponError.value = e?.response?.data?.message || "優惠券代碼錯誤或不適用此方案。";
  } finally {
    couponLoading.value = false;
  }
}

// ===== 移除優惠券 =====
function removeCoupon() {
  coupon.value = null;
  couponCode.value = "";
  couponError.value = "";
}

// ===== 訂單表單資料：控制品牌選擇與備註需求 =====
const form = reactive({
  brandId: "" as number | "",
  remark: "",
  isSubscription: true,
});

// ===== 送出訂單：呼叫 /api/orders/create =====
async function handleSubmitOrder() {
  try {
    const payload: Record<string, any> = {
      planId: selectedPlan.value?.Id,
      brandid: form.brandId,
      isSubscription: form.isSubscription,
      customField2: form.remark || "",
      customField3: "",
      customField4: "",
    };

    if (coupon.value?.Code) {
      payload.couponCode = coupon.value.Code;
    }

    const res = await api.post("/orders/create", payload);
    const data = res.data;

    // ===== 若 API 回傳 ECPay 付款表單，直接注入頁面讓瀏覽器自動跳轉 =====
    if (data?.Success && data?.PaymentFormHtml) {
      document.open();
      document.write(data.PaymentFormHtml);
      document.close();
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "訂單已送出",
      text: "我們已收到您的方案申請，後續將由專人與您聯繫。",
      confirmButtonText: "返回首頁",
      confirmButtonColor: "#2e4a62",
    });

    await router.push("/");
  } catch (e: any) {
    const msg = e?.response?.data?.Message || "訂單送出失敗，請稍後再試。";
    await Swal.fire({
      icon: "error",
      title: "送出失敗",
      text: msg,
      confirmButtonText: "確認",
      confirmButtonColor: "#2e4a62",
    });
  }
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
.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(31, 53, 72, 0.22);
}

/* ===== 送出按鈕 disabled：無品牌時不可點擊 ===== */
.submit-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ===== 無品牌提示框：引導用戶前往新增品牌 ===== */
.no-brand-notice {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(217, 178, 111, 0.65);
  border-radius: 1.25rem;
  background-color: rgba(255, 250, 240, 0.6);
  text-align: center;
}

/* ===== 無品牌提示文字 ===== */
.no-brand-text {
  color: var(--color-muted);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}

/* ===== 前往新增品牌連結 ===== */
.go-brand-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.8rem;
  padding: 0 1.5rem;
  border: 2px solid var(--color-accent);
  border-radius: 999px;
  color: var(--color-primary);
  background-color: #fffaf0;
  font-size: 0.95rem;
  font-weight: 900;
  text-decoration: none;
  transition: 0.2s ease;
  justify-self: center;
}

/* ===== 前往新增品牌連結 hover ===== */
.go-brand-link:hover {
  background-color: var(--color-accent);
  color: #ffffff;
  transform: translateY(-2px);
}

/* ===== 品牌下拉選單：繼承 form-control 並加 appearance ===== */
.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232e4a62' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.75rem;
  cursor: pointer;
}

/* ===== 折扣列：控制優惠券折抵顯示 ===== */
.discount-row dt {
  color: #22863a;
  font-size: 0.95rem;
  font-weight: 800;
}

.discount-row dd {
  margin: 0;
}

/* ===== 優惠券代碼標籤：折扣列旁的小膠囊 ===== */
.coupon-code-tag {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background-color: rgba(34, 134, 58, 0.1);
  color: #22863a;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  vertical-align: middle;
}

/* ===== 折扣金額：控制綠色文字 ===== */
.discount-amount {
  color: #22863a !important;
  font-weight: 900 !important;
}

/* ===== 優惠券區塊：控制輸入與結果整體 ===== */
.coupon-section {
  display: grid;
  gap: 0.65rem;
}

/* ===== 優惠券小標 ===== */
.coupon-label {
  color: var(--color-primary);
  font-size: 0.95rem;
  font-weight: 900;
  margin: 0;
}

/* ===== 優惠券輸入列：input + 套用按鈕並排 ===== */
.coupon-input-row {
  display: flex;
  gap: 0.6rem;
}

/* ===== 優惠券輸入框 ===== */
.coupon-input {
  flex: 1;
  min-height: 2.8rem;
  letter-spacing: 0.08em;
}

/* ===== 套用按鈕 ===== */
.coupon-apply-btn {
  flex-shrink: 0;
  min-height: 2.8rem;
  padding: 0 1.25rem;
  border: 2px solid var(--color-accent);
  border-radius: 999px;
  color: var(--color-primary);
  background-color: #fffaf0;
  font-size: 0.92rem;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
  white-space: nowrap;
}

/* ===== 套用按鈕 hover ===== */
.coupon-apply-btn:hover:not(:disabled) {
  background-color: var(--color-accent);
  color: #ffffff;
}

/* ===== 套用按鈕 disabled ===== */
.coupon-apply-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ===== 優惠券錯誤訊息 ===== */
.coupon-error {
  color: #c0392b;
  font-size: 0.88rem;
  font-weight: 800;
  margin: 0;
}

/* ===== 優惠券結果卡片 ===== */
.coupon-result {
  display: grid;
  gap: 0.55rem;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(34, 134, 58, 0.35);
  border-radius: 1rem;
  background-color: rgba(34, 134, 58, 0.05);
}

/* ===== 優惠券結果標頭：代碼 + 移除按鈕 ===== */
.coupon-result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

/* ===== 優惠券代碼顯示 ===== */
.coupon-result-code {
  color: #22863a;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

/* ===== 移除優惠券按鈕 ===== */
.coupon-remove-btn {
  border: none;
  background: none;
  color: var(--color-muted);
  font-size: 0.82rem;
  font-weight: 900;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: color 0.15s;
}

.coupon-remove-btn:hover {
  color: #c0392b;
}

/* ===== 優惠券折扣說明 ===== */
.coupon-result-discount {
  color: var(--color-text);
  font-size: 0.92rem;
  margin: 0;
}

.coupon-result-discount strong {
  color: #22863a;
  font-size: 1rem;
}

/* ===== 優惠券到期日 ===== */
.coupon-result-expire {
  color: var(--color-muted);
  font-size: 0.82rem;
  margin: 0;
}

/* ===== 優惠贈品清單 ===== */
.coupon-gifts {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.coupon-gifts li {
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background-color: rgba(34, 134, 58, 0.12);
  color: #22863a;
  font-size: 0.8rem;
  font-weight: 800;
}

/* ===== 訂閱 Checkbox 列：控制整列點擊區域 ===== */
.subscription-check {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  cursor: pointer;
  user-select: none;
}

/* ===== 訂閱 Checkbox：隱藏原生樣式、用自訂外觀 ===== */
.subscription-checkbox {
  appearance: none;
  flex-shrink: 0;
  width: 1.2rem;
  height: 1.2rem;
  margin-top: 0.12rem;
  border: 2px solid rgba(217, 178, 111, 0.8);
  border-radius: 0.3rem;
  background-color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: 0.15s ease;
  position: relative;
}

/* ===== Checkbox 勾選狀態 ===== */
.subscription-checkbox:checked {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

/* ===== Checkbox 勾號（::after 偽元素） ===== */
.subscription-checkbox:checked::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='2.5 8 6.5 12 13.5 4'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 0.8rem;
}

/* ===== 訂閱說明文字 ===== */
.subscription-check-text {
  color: var(--color-text);
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.5;
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
