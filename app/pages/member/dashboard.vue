<template>
  <div class="bo-page">
    <!-- ===== 頁面標題 ===== -->
    <header class="bo-page-header">
      <div>
        <p class="bo-kicker">Overview</p>
        <h1 class="bo-page-title">{{ t('page.member.dashboard') }}</h1>
      </div>
      <time class="bo-date" :datetime="today">{{ todayDisplay }}</time>
    </header>

    <!-- ===== 指標卡片 ===== -->
    <section class="metric-grid" aria-label="數據摘要">
      <article v-for="m in metrics" :key="m.label" class="metric-card">
        <Icon :name="m.icon" class="metric-icon" aria-hidden="true" />
        <div class="metric-body">
          <span class="metric-label">{{ m.label }}</span>
          <strong class="metric-value">{{ m.value }}</strong>
        </div>
        <span class="metric-note">{{ m.note }}</span>
      </article>
    </section>

    <!-- ===== 主內容格線 ===== -->
    <div class="dashboard-grid">
      <!-- 訂閱狀態 -->
      <section class="bo-panel">
        <header class="bo-panel-header">
          <h2>訂閱狀態</h2>
          <span class="bo-pill" :class="subscriptionPillClass(subscriptionStatusText)">
            {{ subscriptionStatusText }}
          </span>
        </header>
        <dl class="bo-data-list">
          <div><dt>目前方案</dt><dd>{{ currentPlanText }}</dd></div>
          <div><dt>下次扣款日</dt><dd>{{ nextBillingText }}</dd></div>
          <div><dt>自動續約</dt><dd>{{ autoRenewText }}</dd></div>
        </dl>
        <NuxtLink to="/member/orders" class="bo-panel-link">查看訂單 <Icon name="fa6-solid:arrow-right" class="link-icon" /></NuxtLink>
      </section>

      <!-- 已開啟功能 -->
      <section class="bo-panel">
        <header class="bo-panel-header">
          <h2>已開啟功能</h2>
        </header>
        <ul v-if="enabledFeatures.length > 0" class="bo-feature-list" role="list">
          <li v-for="feature in enabledFeatures" :key="feature.key">
            {{ feature.label }}
          </li>
        </ul>
        <div v-else class="bo-empty is-inline">
          <p>目前沒有已開啟功能</p>
        </div>
      </section>

      <!-- 快速入口 -->
      <section class="bo-panel shortcut-panel">
        <header class="bo-panel-header">
          <h2>快速入口</h2>
        </header>
        <div class="shortcut-grid">
          <NuxtLink v-for="s in shortcuts" :key="s.to" :to="s.to" class="shortcut-item">
            <Icon :name="s.icon" class="shortcut-icon" aria-hidden="true" />
            <span>{{ s.label }}</span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import api from '~/composables/utils/api'
import {
  usePermissionStore,
  type BrandFeatureKey,
} from '~/composables/usePermissionStore'

const { t, locale } = useI18n()
const permStore = usePermissionStore()
const activeBrandId = computed(() => permStore.brandId)

await permStore.load()

useHead(() => ({ title: t('page.member.dashboard') }))

const today = new Date().toISOString().slice(0, 10)
const todayDisplay = new Date().toLocaleDateString(locale.value, {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
})

interface CurrentSubscription {
  BrandId: number
  PlanName: string
  Period: string
  Status: string
  AutoRenew: boolean
  NextBillingDate: string | null
}

interface OrderSummary {
  BrandId: number
  Status: string
  PayTime: string | null
  CreateDate: string | null
}

interface StoreSummary {
  Id: number
  IsActive: boolean
}

const FEATURE_LABELS: Record<BrandFeatureKey, string> = {
  Dashboard: '主控台',
  BrandManagement: '品牌管理',
  StoreManagement: '院所管理',
  CustomerManagement: '飼主管理',
  PetManagement: '寵物管理',
  AppointmentManagement: '預約管理',
  VisitManagement: '門診管理',
  MedicalRecordManagement: '病歷管理',
  BillingManagement: '批價收費管理',
  StaffManagement: '人事管理',
  RolePermissionManagement: '角色權限管理',
  ShiftManagement: '排班管理',
  HospitalizationManagement: '住院管理',
  InpatientCareManagement: '住院照護管理',
  PurchaseManagement: '採購管理',
  GeneralInventoryManagement: '一般庫存管理',
  DrugInventoryManagement: '藥品庫存管理',
  PharmacyManagement: '藥局管理',
  BatchExpireManagement: '批號效期管理',
  MultiStoreManagement: '多分店管理',
  CrossStoreInventory: '跨店庫存管理',
  BasicReport: '基本報表',
  AdvancedReport: '進階報表',
}

const { data: ordersData } = await useAsyncData(
  'member-dashboard-orders-summary',
  async () => {
    const res = await api.get('/member/myorders')
    return res.data?.data ?? null
  },
  { server: false },
)

const { data: storesData } = await useAsyncData(
  'member-dashboard-stores-summary',
  async () => {
    const brandId = activeBrandId.value
    if (!brandId) return [] as StoreSummary[]

    const res = await api.get(`/stores/my/brand/${brandId}`)
    return (res.data?.stores as StoreSummary[]) ?? []
  },
  {
    server: false,
    watch: [activeBrandId],
  },
)

const currentSubscriptions = computed<CurrentSubscription[]>(
  () => ordersData.value?.CurrentSubscriptions ?? [],
)

const orders = computed<OrderSummary[]>(() => ordersData.value?.Orders ?? [])

const monthOrderStats = computed(() => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const brandId = permStore.brandId

  const brandOrders = brandId
    ? orders.value.filter((order) => order.BrandId === brandId)
    : orders.value

  const monthlyOrders = brandOrders.filter((order) => {
    const timeSource = order.PayTime || order.CreateDate
    if (!timeSource) return false
    const date = new Date(timeSource)
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth
  })

  const paidCount = monthlyOrders.filter((order) => order.Status === '已付款').length

  return {
    monthlyCount: monthlyOrders.length,
    paidCount,
  }
})

const storeStats = computed(() => {
  const stores = storesData.value ?? []
  const activeCount = stores.filter((store) => store.IsActive).length

  return {
    totalCount: stores.length,
    activeCount,
  }
})

const enabledFeatures = computed(() =>
  (Object.entries(permStore.features) as Array<[BrandFeatureKey, boolean]>)
    .filter(([, enabled]) => enabled)
    .map(([key]) => ({
      key,
      label: FEATURE_LABELS[key],
    }))
    .filter((feature) => Boolean(feature.label)),
)

const currentSubscription = computed<CurrentSubscription | null>(() => {
  const brandId = permStore.brandId
  if (!brandId) return currentSubscriptions.value[0] ?? null
  return (
    currentSubscriptions.value.find((sub) => sub.BrandId === brandId) ??
    currentSubscriptions.value[0] ??
    null
  )
})

const currentPlanText = computed(() => {
  const sub = currentSubscription.value
  if (!sub) return '尚無有效方案'
  return `${sub.PlanName}${sub.Period}`
})

const nextBillingText = computed(() => {
  const sub = currentSubscription.value
  if (!sub) return '—'
  if (!sub.AutoRenew) return '已關閉自動續訂'
  return formatDate(sub.NextBillingDate)
})

const autoRenewText = computed(() => {
  const sub = currentSubscription.value
  if (!sub) return '未設定'
  return sub.AutoRenew ? '已啟用' : '已關閉'
})

const subscriptionStatusText = computed(() => {
  const sub = currentSubscription.value
  if (!sub) return '未訂閱'
  return sub.Status || '未訂閱'
})

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('zh-TW')
}

function subscriptionPillClass(status: string) {
  if (status === '使用中') return 'is-success'
  if (status === '已到期' || status === '未訂閱') return 'is-danger'
  return 'is-warn'
}

const metrics = computed(() => [
  {
    icon: 'fa6-solid:receipt',
    label: '本月訂單',
    value: `${monthOrderStats.value.monthlyCount} 筆`,
    note: `已付款 ${monthOrderStats.value.paidCount} 筆`,
  },
  { icon: 'fa6-solid:users', label: '啟用員工', value: '2 人', note: '在職中' },
  {
    icon: 'fa6-solid:store',
    label: '分店數',
    value: `${storeStats.value.totalCount} 間`,
    note: `正常營運 ${storeStats.value.activeCount} 間`,
  },
  { icon: 'fa6-solid:tag', label: '品牌狀態', value: '啟用', note: '目前可正常使用' },
])

interface ShortcutItem {
  to: string
  icon: string
  label: string
  requiredFeature?: BrandFeatureKey | 'subscription'
}

const ALL_SHORTCUTS: ShortcutItem[] = [
  { to: '/member/profile', icon: 'fa6-solid:circle-user', label: '會員設定' },
  { to: '/member/orders', icon: 'fa6-solid:receipt', label: '訂單資訊' },
  { to: '/member/brand', icon: 'fa6-solid:tag', label: '品牌設定' },
  {
    to: '/member/staff',
    icon: 'fa6-solid:users',
    label: '人事系統',
    requiredFeature: 'subscription',
  },
  {
    to: '/member/clinics',
    icon: 'fa6-solid:house-medical',
    label: '院所設定',
    requiredFeature: 'StoreManagement',
  },
  {
    to: '/member/stores',
    icon: 'fa6-solid:store',
    label: '分店設定',
    requiredFeature: 'MultiStoreManagement',
  },
]

const shortcuts = computed(() =>
  ALL_SHORTCUTS.filter((item) => {
    if (!item.requiredFeature) return true
    return permStore.canAccess(item.requiredFeature)
  }),
)
</script>

<style scoped>
.bo-page { display: grid; gap: 1.5rem; }

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

.bo-date {
  color: var(--bo-muted, #6b7882);
  font-size: 0.9rem;
  font-weight: 800;
}

/* 指標卡片 */
.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.metric-card {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 0.75rem;
  row-gap: 0.2rem;
  padding: 1.1rem 1rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 10px;
  background: #fff;
}

.metric-icon {
  grid-row: 1 / 3;
  display: flex;
  align-items: center;
  width: 1.6rem;
  height: 1.6rem;
  color: var(--bo-accent, #d9b26f);
}

.metric-body { display: contents; }

.metric-label {
  color: var(--bo-muted, #6b7882);
  font-size: 0.82rem;
  font-weight: 800;
}

.metric-value {
  color: var(--bo-primary, #17334a);
  font-size: 1.55rem;
  font-weight: 900;
  line-height: 1.2;
}

.metric-note {
  grid-column: 2;
  color: var(--bo-muted, #6b7882);
  font-size: 0.78rem;
}

/* 主格線 */
.dashboard-grid {
  display: grid;
  gap: 1rem;
}

/* Panel */
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
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--bo-border, #dfe7ec);
}

.bo-panel-header h2 {
  color: var(--bo-primary, #17334a);
  font-size: 1rem;
  font-weight: 900;
}

.bo-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  color: var(--bo-primary, #17334a);
  background: var(--bo-primary-soft, #edf4f8);
  font-size: 0.78rem;
  font-weight: 900;
}

.bo-pill.is-success { color: #14633f; background: #e7f6ee; }
.bo-pill.is-danger { color: #a51d2d; background: #fdecef; }
.bo-pill.is-warn { color: #8a5b00; background: #fff5dd; }

.bo-data-list { display: grid; gap: 0.7rem; }
.bo-data-list div { display: flex; justify-content: space-between; gap: 1rem; }
.bo-data-list dt { color: var(--bo-muted, #6b7882); font-size: 0.9rem; }
.bo-data-list dd { color: var(--bo-text, #20303c); font-weight: 800; margin: 0; }

.bo-empty.is-inline {
  padding: 1rem 0;
}

.bo-panel-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--bo-accent, #d9b26f);
  font-size: 0.88rem;
  font-weight: 900;
  text-decoration: none;
}
.bo-panel-link:hover { text-decoration: underline; }

.bo-feature-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  padding: 0;
  margin: 0;
  list-style: none;
}
.bo-feature-list li {
  padding: 0.35rem 0.65rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 6px;
  color: var(--bo-primary, #17334a);
  background: #fafbfc;
  font-size: 0.85rem;
  font-weight: 800;
}

/* 快速入口 */
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
}

.shortcut-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.85rem 0.5rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 8px;
  color: var(--bo-primary, #17334a);
  background: #fafbfc;
  font-size: 0.82rem;
  font-weight: 800;
  text-decoration: none;
  text-align: center;
  transition: background 0.15s, color 0.15s;
}
.shortcut-item:hover { background: var(--bo-primary-soft, #edf4f8); }

.shortcut-icon { width: 1.35rem; height: 1.35rem; color: var(--bo-accent, #d9b26f); }

.link-icon { width: 0.75rem; height: 0.75rem; vertical-align: middle; margin-left: 0.2rem; }

@media (min-width: 48em) {
  .metric-grid { grid-template-columns: repeat(4, 1fr); }
  .dashboard-grid { grid-template-columns: repeat(2, 1fr); }
  .shortcut-panel { grid-column: 1 / -1; }
}
</style>
