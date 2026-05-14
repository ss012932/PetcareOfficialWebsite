<template>
  <div class="bo-page">
    <header class="bo-page-header">
      <div>
        <p class="bo-kicker">Billing</p>
        <h1 class="bo-page-title">訂單資訊</h1>
      </div>
      <span class="bo-pill">{{ orders.length }} 筆訂單</span>
    </header>

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
              <th>方案</th>
              <th>週期</th>
              <th>金額</th>
              <th>付款方式</th>
              <th>狀態</th>
              <th>付款時間</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.merchantTradeNo">
              <td class="td-mono">{{ order.merchantTradeNo }}</td>
              <td>{{ order.planName }}</td>
              <td>{{ order.period }}</td>
              <td>NT$ {{ order.amount.toLocaleString() }}</td>
              <td>{{ order.paymentName }}</td>
              <td>
                <span class="bo-pill is-success">{{ order.status }}</span>
              </td>
              <td class="td-muted">{{ order.payTime }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '訂單資訊' })

const orders = [
  { merchantTradeNo: 'PC202605140001', planName: '專業版', period: '月繳', amount: 3980, paymentName: '信用卡', status: '已付款', payTime: '2026-05-14 10:30' },
  { merchantTradeNo: 'PC202604140001', planName: '專業版', period: '月繳', amount: 3980, paymentName: '信用卡', status: '已付款', payTime: '2026-04-14 10:30' },
]
</script>

<style scoped>
.bo-page { display: grid; gap: 1.5rem; }
.bo-page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.bo-kicker { color: var(--bo-accent, #d9b26f); font-size: 0.75rem; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 0.25rem; }
.bo-page-title { color: var(--bo-primary, #17334a); font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900; }

.bo-panel { padding: 1.25rem; border: 1px solid var(--bo-border, #dfe7ec); border-radius: 10px; background: #fff; }
.bo-panel-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--bo-border, #dfe7ec); }
.bo-panel-header h2 { color: var(--bo-primary, #17334a); font-size: 1rem; font-weight: 900; }
.bo-pill { display: inline-flex; align-items: center; padding: 0.25rem 0.65rem; border-radius: 999px; color: var(--bo-primary, #17334a); background: var(--bo-primary-soft, #edf4f8); font-size: 0.78rem; font-weight: 900; }
.bo-pill.is-success { color: #14633f; background: #e7f6ee; }

.table-wrap { overflow-x: auto; }
table { width: 100%; min-width: 700px; border-collapse: collapse; }
th, td { padding: 0.85rem 0.75rem; border-bottom: 1px solid var(--bo-border, #dfe7ec); text-align: left; white-space: nowrap; }
th { color: var(--bo-primary, #17334a); background: #fafbfc; font-size: 0.82rem; font-weight: 900; }
.td-mono { font-size: 0.85rem; font-family: monospace; }
.td-muted { color: var(--bo-muted, #6b7882); font-size: 0.88rem; }
</style>
