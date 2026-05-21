<template>
  <div class="bo-page">
    <header class="bo-page-header">
      <div>
        <p class="bo-kicker">Billing</p>
        <h1 class="bo-page-title">訂單資訊</h1>
      </div>
      <span class="bo-pill">{{ orders.length }} 筆訂單</span>
    </header>

    <!-- ===== 載入中 ===== -->
    <div v-if="pending" class="bo-loading">載入中…</div>

    <!-- ===== 無資料 ===== -->
    <div v-else-if="orders.length === 0" class="bo-empty">
      <p>目前尚無訂單紀錄。</p>
    </div>

    <template v-else>
      <!-- ===== 訂閱狀態摘要卡片 ===== -->
      <div v-if="currentSubscriptions.length" class="subscription-cards">
        <div
          v-for="sub in currentSubscriptions"
          :key="sub.BrandSubscriptionId"
          class="subscription-card"
        >
          <div class="subscription-card-top">
            <div>
              <p class="subscription-brand">{{ sub.BrandName }}</p>
              <p class="subscription-plan">{{ sub.PlanName }}{{ sub.Period }}</p>
            </div>
            <span class="bo-pill" :class="subscriptionPillClass(sub.Status)">
              {{ sub.Status }}
            </span>
          </div>
          <dl class="subscription-meta">
            <div>
              <dt>服務到期</dt>
              <dd>{{ formatDate(sub.EndDate) }}</dd>
            </div>
            <div>
              <dt>下次扣款</dt>
              <dd>{{ sub.AutoRenew ? formatDate(sub.NextBillingDate) : '已關閉自動續訂' }}</dd>
            </div>
            <div>
              <dt>上次扣款</dt>
              <dd>{{ formatDate(sub.LastBillingDate) }}</dd>
            </div>
            <div>
              <dt>自動續訂</dt>
              <dd>
                <span class="bo-pill" :class="sub.AutoRenew ? 'is-success' : 'is-warn'">
                  {{ sub.AutoRenew ? '開啟' : '關閉' }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- ===== 交易紀錄表格 ===== -->
      <section class="bo-panel">
        <header class="bo-panel-header">
          <h2>交易紀錄</h2>
          <span class="bo-pill">Orders</span>
        </header>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>訂單編號</th>
                <th>品牌</th>
                <th>方案</th>
                <th>週期</th>
                <th>金額</th>
                <th>優惠券</th>
                <th>付款方式</th>
                <th>狀態</th>
                <th>付款時間</th>
                <th>定期扣款</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="order in orders" :key="order.MerchantTradeNo">
                <!-- ===== 主訂單列 ===== -->
                <tr
                  :class="{ 'tr-expanded': expandedOrders.has(order.OrderId) }"
                >
                  <td class="td-mono">{{ order.MerchantTradeNo }}</td>
                  <td>{{ order.BrandName }}</td>
                  <td>{{ order.PlanName }}</td>
                  <td>{{ order.Period }}</td>
                  <td>NT$ {{ order.Amount.toLocaleString() }}</td>
                  <td class="td-muted">{{ order.DiscountCode ?? "—" }}</td>
                  <td>{{ order.PaymentName }}</td>
                  <td>
                    <span
                      class="bo-pill"
                      :class="statusPillClass(order.Status)"
                    >
                      {{ order.Status }}
                    </span>
                  </td>
                  <td class="td-muted">{{ formatDateTime(order.PayTime) }}</td>
                  <td>
                    <button
                      v-if="order.RecurringBillingLogs.length > 0"
                      type="button"
                      class="expand-btn"
                      :class="{ 'is-open': expandedOrders.has(order.OrderId) }"
                      @click="toggleExpand(order.OrderId)"
                    >
                      定期扣款 ({{ order.RecurringBillingLogs.length }})
                      <span class="expand-arrow" aria-hidden="true">▾</span>
                    </button>
                    <span v-else class="td-muted">—</span>
                  </td>
                </tr>

                <!-- ===== 定期扣款紀錄子列 ===== -->
                <template v-if="expandedOrders.has(order.OrderId)">
                  <tr class="tr-log-header">
                    <td colspan="2" class="td-log-header">類型</td>
                    <td colspan="2" class="td-log-header">方案</td>
                    <td class="td-log-header">金額</td>
                    <td class="td-log-header">付款方式</td>
                    <td class="td-log-header">狀態</td>
                    <td class="td-log-header">扣款時間</td>
                    <td colspan="2" class="td-log-header">金流編號</td>
                  </tr>
                  <!-- ===== 定期扣款紀錄子列 ===== -->
                  <tr
                    v-for="log in order.RecurringBillingLogs"
                    :key="log.Id"
                    class="tr-log"
                  >
                    <!-- 控制定期扣款類型欄位 -->
                    <td class="td-log-indent" colspan="2">定期扣款</td>

                    <!-- 控制方案欄位 -->
                    <td colspan="2">
                      {{ order.PlanName }}
                    </td>

                    <!-- 控制金額欄位 -->
                    <td>NT$ {{ log.Amount.toLocaleString() }}</td>

                    <!-- 控制付款方式欄位 -->
                    <td>
                      {{ log.PaymentType }}
                    </td>

                    <!-- 控制狀態欄位 -->
                    <td>
                      <span
                        class="bo-pill"
                        :class="
                          log.Status === 'Success' ? 'is-success' : 'is-danger'
                        "
                      >
                        {{ log.Status === "Success" ? "成功" : "失敗" }}
                      </span>
                    </td>

                    <!-- 控制扣款時間欄位：使用 BillingDate -->
                    <td>
                      {{ formatDateTime(log.BillingDate) }}
                    </td>

                    <!-- 控制金流交易編號欄位 -->
                    <td class="td-mono" colspan="2">
                      {{ log.TradeNo ?? "—" }}
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import api from "~/composables/utils/api";

useHead({ title: "訂單資訊" });

// ===== 訂單型別 =====
interface RecurringBillingLog {
  Id: number;
  BrandSubscriptionId: number;
  OrderId: number;
  Amount: number;
  BillingDate: string;
  Status: string;
  TradeNo: string;
  PaymentType: string;
  Message: string;
  CreateDate: string;
}

interface Order {
  OrderId: number;
  BrandId: number;
  BrandName: string;
  PlanId: number;
  PlanName: string;
  Period: string;
  SubscriptionMonth: number;
  Amount: number;
  DiscountCodeId: number | null;
  DiscountCode: string | null;
  MerchantTradeNo: string;
  TradeNo: string;
  Status: string;
  PaymentType: string;
  PaymentName: string;
  PayTime: string;
  ExpireDate: string;
  CreateDate: string;
  UpdateDate: string;
  IsRecurring: boolean;
  PeriodType: string;
  Frequency: number;
  ExecTimes: number;
  ExecTimesCompleted: number;
  RecurringBillingLogs: RecurringBillingLog[];
}

interface CurrentSubscription {
  BrandSubscriptionId: number;
  BrandId: number;
  BrandName: string;
  PlanId: number;
  PlanName: string;
  Period: string;
  SubscriptionMonth: number;
  OrderId: number;
  Status: string;
  AutoRenew: boolean;
  IsActive: boolean;
  IsTrial: boolean;
  TrialUsed: boolean;
  TrialCreator: string | null;
  StartDate: string;
  EndDate: string | null;
  NextBillingDate: string | null;
  GraceEndDate: string | null;
  LastBillingDate: string | null;
  LastRenewOrderId: number | null;
  BillingRetryCount: number;
  CancelRenewDate: string | null;
  CreateDate: string;
  UpdateDate: string;
}

// ===== 從 API 取得訂單，僅在客戶端執行 =====
const { data: pageData, pending } = await useAsyncData(
  "member-orders",
  async () => {
    const res = await api.get("/member/myorders");
    return res.data?.data ?? null;
  },
  { server: false },
);

const currentSubscriptions = computed<CurrentSubscription[]>(
  () => pageData.value?.CurrentSubscriptions ?? [],
);

const orders = computed<Order[]>(() => pageData.value?.Orders ?? []);

// ===== 展開狀態：控制哪些訂單顯示定期扣款紀錄 =====
const expandedOrders = ref<Set<number>>(new Set());

function toggleExpand(orderId: number) {
  if (expandedOrders.value.has(orderId)) {
    expandedOrders.value.delete(orderId);
  } else {
    expandedOrders.value.add(orderId);
  }
  // 觸發 Vue 響應式更新
  expandedOrders.value = new Set(expandedOrders.value);
}

// ===== 日期格式化 =====
function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("zh-TW");
}

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// ===== 付款狀態 pill 樣式 =====
function statusPillClass(status: string) {
  if (status === "已付款") return "is-success";
  if (status === "待付款") return "is-warn";
  if (status === "已取消") return "is-danger";
  return "";
}

// ===== 訂閱狀態 pill 樣式 =====
function subscriptionPillClass(status: string | null) {
  if (status === "使用中") return "is-success";
  if (status === "已到期") return "is-danger";
  return "is-warn";
}
</script>

<style scoped>
.bo-page {
  display: grid;
  gap: 1.5rem;
}
.bo-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.bo-kicker {
  color: var(--bo-accent, #d9b26f);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}
.bo-page-title {
  color: var(--bo-primary, #17334a);
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 900;
}

/* ===== 載入 / 空狀態 ===== */
.bo-loading,
.bo-empty {
  color: var(--bo-muted, #6b7882);
  font-size: 0.95rem;
  padding: 2rem 0;
  text-align: center;
}

/* ===== 訂閱摘要卡片群 ===== */
.subscription-cards {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 26rem), 1fr));
}

.subscription-card {
  display: grid;
  gap: 1rem;
  padding: 1.25rem 1.35rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 12px;
  background: #fff;
}

.subscription-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}
.subscription-brand {
  color: var(--bo-muted, #6b7882);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  margin-bottom: 0.2rem;
}
.subscription-plan {
  color: var(--bo-primary, #17334a);
  font-size: 1.05rem;
  font-weight: 900;
}

.subscription-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  margin: 0;
}
.subscription-meta div {
  display: grid;
  gap: 0.2rem;
}
.subscription-meta dt {
  color: var(--bo-muted, #6b7882);
  font-size: 0.75rem;
  font-weight: 900;
}
.subscription-meta dd {
  color: var(--bo-primary, #17334a);
  font-size: 0.9rem;
  font-weight: 800;
  margin: 0;
}

/* ===== 面板 ===== */
.bo-panel {
  padding: 1.25rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 10px;
  background: #fff;
}
.bo-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--bo-border, #dfe7ec);
}
.bo-panel-header h2 {
  color: var(--bo-primary, #17334a);
  font-size: 1rem;
  font-weight: 900;
}

/* ===== pill ===== */
.bo-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  color: var(--bo-primary, #17334a);
  background: var(--bo-primary-soft, #edf4f8);
  font-size: 0.78rem;
  font-weight: 900;
  white-space: nowrap;
}
.bo-pill.is-success {
  color: #14633f;
  background: #e7f6ee;
}
.bo-pill.is-warn {
  color: #92550a;
  background: #fef3e2;
}
.bo-pill.is-danger {
  color: #8b1a1a;
  background: #fdeaea;
}

/* ===== 表格 ===== */
.table-wrap {
  overflow-x: auto;
}
table {
  width: 100%;
  min-width: 880px;
  border-collapse: collapse;
}
th,
td {
  padding: 0.85rem 0.75rem;
  border-bottom: 1px solid var(--bo-border, #dfe7ec);
  text-align: left;
  white-space: nowrap;
}
th {
  color: var(--bo-primary, #17334a);
  background: #fafbfc;
  font-size: 0.82rem;
  font-weight: 900;
}
.td-mono {
  font-size: 0.8rem;
  font-family: monospace;
}
.td-muted {
  color: var(--bo-muted, #6b7882);
  font-size: 0.88rem;
}

/* ===== 展開按鈕 ===== */
.expand-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 999px;
  background: #fafbfc;
  color: var(--bo-primary, #17334a);
  font-size: 0.78rem;
  font-weight: 900;
  cursor: pointer;
  transition: background 0.15s;
}
.expand-btn:hover {
  background: var(--bo-primary-soft, #edf4f8);
}
.expand-arrow {
  display: inline-block;
  transition: transform 0.2s;
}
.expand-btn.is-open .expand-arrow {
  transform: rotate(180deg);
}

/* ===== 展開後主列樣式 ===== */
.tr-expanded > td {
  border-bottom: none;
}

/* ===== 定期扣款紀錄 header 列 ===== */
.tr-log-header > .td-log-header {
  padding: 0.4rem 0.75rem;
  background: #f0f5f8;
  color: var(--bo-muted, #6b7882);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ===== 定期扣款紀錄子列 ===== */
.tr-log > td {
  background: #f8fbfd;
  font-size: 0.88rem;
  padding-top: 0.65rem;
  padding-bottom: 0.65rem;
}
.td-log-indent {
  padding-left: 1.75rem !important;
}
</style>
