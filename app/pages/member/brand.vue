<template>
  <div class="bo-page">
    <header class="bo-page-header">
      <div>
        <p class="bo-kicker">Organization</p>
        <h1 class="bo-page-title">品牌設定</h1>
      </div>
    </header>

    <section class="bo-panel">
      <header class="bo-panel-header">
        <h2>品牌資訊</h2>
        <span class="bo-pill">Brands</span>
      </header>

      <form class="bo-form" @submit.prevent="handleSave">
        <div class="form-grid">
          <label class="bo-field">
            <span>品牌名稱</span>
            <input v-model="form.brandName" type="text" placeholder="請輸入品牌名稱" />
          </label>
          <label class="bo-field">
            <span>公司名稱</span>
            <input v-model="form.companyName" type="text" placeholder="請輸入公司全名" />
          </label>
          <label class="bo-field">
            <span>統一編號</span>
            <input v-model="form.taxId" type="text" maxlength="8" placeholder="8 碼統一編號" />
          </label>
          <label class="bo-field">
            <span>品牌電話</span>
            <input v-model="form.phone" type="tel" placeholder="請輸入聯絡電話" />
          </label>
          <label class="bo-field">
            <span>品牌信箱</span>
            <input v-model="form.email" type="email" placeholder="請輸入聯絡信箱" />
          </label>
          <label class="bo-field field-full">
            <span>總部地址</span>
            <input v-model="form.address" type="text" placeholder="請輸入地址" />
          </label>
        </div>

        <div class="bo-switches">
          <label class="bo-switch">
            <input v-model="form.isMultiStore" type="checkbox" />
            <span>啟用多分店系統</span>
          </label>
          <label class="bo-switch">
            <input v-model="form.isActive" type="checkbox" />
            <span>品牌啟用</span>
          </label>
        </div>

        <div class="bo-form-actions">
          <button type="submit" class="bo-btn is-primary">儲存品牌設定</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { showCustom } from '~/composables/utils/alert'

useHead({ title: '品牌設定' })

const form = reactive({
  brandName:   'PetCare 動物醫院',
  companyName: 'PetCare 事業有限公司',
  taxId:       '',
  phone:       '02-2345-6789',
  email:       'service@petcare.local',
  address:     '台北市信義區松仁路 100 號',
  isMultiStore: true,
  isActive:     true,
})

async function handleSave() {
  // TODO: 串接更新品牌 API
  await showCustom('儲存成功', '品牌資料已更新。', 'success')
}
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

.bo-form { display: grid; gap: 1.25rem; }
.form-grid { display: grid; gap: 1rem; }
.bo-field { display: grid; gap: 0.4rem; font-weight: 800; color: var(--bo-primary, #17334a); font-size: 0.92rem; }
.bo-field input { width: 100%; min-height: 2.75rem; padding: 0 0.8rem; border: 1px solid var(--bo-border, #dfe7ec); border-radius: 7px; color: var(--bo-text, #20303c); background: #fff; font: inherit; }
.bo-field input:focus { border-color: var(--bo-accent, #d9b26f); outline: 3px solid rgba(217,178,111,0.18); }

.bo-switches { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.bo-switch { display: flex; align-items: center; gap: 0.55rem; font-weight: 800; color: var(--bo-primary, #17334a); }
.bo-switch input { width: 1.1rem; height: 1.1rem; accent-color: var(--bo-primary, #17334a); }

.bo-form-actions { padding-top: 0.25rem; }
.bo-btn { min-height: 2.75rem; padding: 0 1.5rem; border: none; border-radius: 7px; font: inherit; font-weight: 900; cursor: pointer; transition: opacity 0.15s; }
.bo-btn.is-primary { color: #fff; background: var(--bo-primary, #17334a); }
.bo-btn.is-primary:hover { opacity: 0.85; }

@media (min-width: 48em) {
  .form-grid { grid-template-columns: repeat(2, 1fr); }
  .field-full { grid-column: 1 / -1; }
}
</style>
