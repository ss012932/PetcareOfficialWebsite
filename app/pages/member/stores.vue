<template>
  <div class="bo-page">
    <header class="bo-page-header">
      <div>
        <p class="bo-kicker">Locations</p>
        <h1 class="bo-page-title">{{ t('page.member.stores') }}</h1>
      </div>
      <span class="bo-pill">{{ stores.length }} 間分店</span>
    </header>

    <div class="stores-grid">
      <article v-for="store in stores" :key="store.id" class="store-card">
        <header class="store-card-header">
          <strong>{{ store.name }}</strong>
          <span class="bo-pill" :class="{ 'is-success': store.isActive, 'is-muted': !store.isActive }">
            {{ store.isActive ? '營運中' : '停止營運' }}
          </span>
        </header>
        <dl class="store-info">
          <div>
            <dt>城市</dt>
            <dd>{{ store.city }}</dd>
          </div>
          <div>
            <dt>地址</dt>
            <dd>{{ store.address }}</dd>
          </div>
          <div>
            <dt>電話</dt>
            <dd>{{ store.phone }}</dd>
          </div>
          <div>
            <dt>統一編號</dt>
            <dd>{{ store.taxId || '—' }}</dd>
          </div>
        </dl>
        <div class="store-card-footer">
          <button class="bo-btn is-ghost" @click="editStore(store.id)">編輯</button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const { t } = useI18n()

definePageMeta({
  middleware: ['backoffice-auth', 'brand-feature'],
  brandFeature: 'MultiStoreManagement',
})

useHead(() => ({ title: t('page.member.stores') }))

const stores = reactive([
  { id: 1, name: '信義總院',  city: '台北市', address: '信義區松仁路 100 號', phone: '02-2345-6789', taxId: '12345678', isActive: true  },
  { id: 2, name: '板橋分院',  city: '新北市', address: '板橋區縣民大道 50 號', phone: '02-8765-4321', taxId: '',         isActive: true  },
])

function editStore(id: number) {
  console.log('edit store', id)
  // TODO: 開啟編輯分店 Modal 或導向編輯頁
}
</script>

<style scoped>
.bo-page { display: grid; gap: 1.5rem; }
.bo-page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.bo-kicker { color: var(--bo-accent, #d9b26f); font-size: 0.75rem; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 0.25rem; }
.bo-page-title { color: var(--bo-primary, #17334a); font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900; }

.stores-grid { display: grid; gap: 1rem; }

.bo-pill { display: inline-flex; align-items: center; padding: 0.25rem 0.65rem; border-radius: 999px; color: var(--bo-primary, #17334a); background: var(--bo-primary-soft, #edf4f8); font-size: 0.78rem; font-weight: 900; white-space: nowrap; }
.bo-pill.is-success { color: #14633f; background: #e7f6ee; }
.bo-pill.is-muted   { color: var(--bo-muted, #6b7882); background: #f0f0f0; }

.store-card { display: grid; gap: 1rem; padding: 1.25rem; border: 1px solid var(--bo-border, #dfe7ec); border-radius: 10px; background: #fff; }
.store-card-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
.store-card-header strong { color: var(--bo-primary, #17334a); font-size: 1rem; font-weight: 900; }

.store-info { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem 1rem; }
.store-info div { display: grid; gap: 0.15rem; }
.store-info dt { color: var(--bo-muted, #6b7882); font-size: 0.78rem; font-weight: 700; }
.store-info dd { color: var(--bo-text, #20303c); font-size: 0.92rem; font-weight: 600; }

.store-card-footer { display: flex; justify-content: flex-end; border-top: 1px solid var(--bo-border, #dfe7ec); padding-top: 0.75rem; }
.bo-btn { min-height: 2.5rem; padding: 0 1.25rem; border: none; border-radius: 7px; font: inherit; font-weight: 900; cursor: pointer; transition: opacity 0.15s; }
.bo-btn.is-ghost { color: var(--bo-primary, #17334a); background: transparent; border: 1px solid var(--bo-border, #dfe7ec); }
.bo-btn.is-ghost:hover { background: var(--bo-primary-soft, #edf4f8); }

@media (min-width: 48em) {
  .stores-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 72em) {
  .stores-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
