<template>
  <div class="bo-page">
    <!-- ===== 頁面標題 ===== -->
    <header class="bo-page-header">
      <div>
        <p class="bo-kicker">Overview</p>
        <h1 class="bo-page-title">主控台</h1>
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
          <span class="bo-pill is-success">使用中</span>
        </header>
        <dl class="bo-data-list">
          <div><dt>目前方案</dt><dd>專業版 / 月繳</dd></div>
          <div><dt>下次扣款日</dt><dd>2026-06-14</dd></div>
          <div><dt>自動續約</dt><dd>已啟用</dd></div>
        </dl>
        <NuxtLink to="/member/orders" class="bo-panel-link">查看訂單 <Icon name="fa6-solid:arrow-right" class="link-icon" /></NuxtLink>
      </section>

      <!-- 已開啟功能 -->
      <section class="bo-panel">
        <header class="bo-panel-header">
          <h2>已開啟功能</h2>
        </header>
        <ul class="bo-feature-list" role="list">
          <li v-for="f in features" :key="f">{{ f }}</li>
        </ul>
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

useHead({ title: '主控台' })

const today = new Date().toISOString().slice(0, 10)
const todayDisplay = new Date().toLocaleDateString('zh-TW', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
})

const metrics = [
  { icon: 'fa6-solid:receipt',    label: '本月訂單', value: '2 筆',  note: '已付款' },
  { icon: 'fa6-solid:users',      label: '啟用員工', value: '2 人',  note: '在職中' },
  { icon: 'fa6-solid:store',      label: '分店數',   value: '2 間',  note: '正常營運' },
  { icon: 'fa6-solid:tag',        label: '品牌狀態', value: '啟用',  note: 'IsActive = 1' },
]

const features = ['主控台', '品牌管理', '分店管理', '員工管理', '班別管理', '訂單與訂閱管理']

const shortcuts = [
  { to: '/member/profile',   icon: 'fa6-solid:circle-user', label: '會員設定' },
  { to: '/member/orders',    icon: 'fa6-solid:receipt',     label: '訂單資訊' },
  { to: '/member/brand',     icon: 'fa6-solid:tag',         label: '品牌設定' },
  { to: '/member/staff',     icon: 'fa6-solid:users',       label: '人事系統' },
  { to: '/member/stores',    icon: 'fa6-solid:store',       label: '分店設定' },
]
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

.bo-data-list { display: grid; gap: 0.7rem; }
.bo-data-list div { display: flex; justify-content: space-between; gap: 1rem; }
.bo-data-list dt { color: var(--bo-muted, #6b7882); font-size: 0.9rem; }
.bo-data-list dd { color: var(--bo-text, #20303c); font-weight: 800; margin: 0; }

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
