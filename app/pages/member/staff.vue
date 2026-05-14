<template>
  <div class="bo-page">
    <header class="bo-page-header">
      <div>
        <p class="bo-kicker">Human Resources</p>
        <h1 class="bo-page-title">人事系統</h1>
      </div>
      <span class="bo-pill">{{ staffs.filter(s => s.isActive).length }} / {{ staffs.length }} 位在職</span>
    </header>

    <div class="staff-layout">
      <!-- 員工列表 -->
      <section class="bo-panel">
        <header class="bo-panel-header">
          <h2>員工帳號</h2>
          <span class="bo-pill">Staffs</span>
        </header>
        <ul class="staff-list" role="list">
          <li v-for="staff in staffs" :key="staff.email" class="staff-row">
            <div class="staff-meta">
              <strong>{{ staff.fullName }}</strong>
              <span>{{ staff.jobTitle }} · {{ staff.email }}</span>
            </div>
            <div class="staff-actions">
              <span class="bo-pill" :class="{ 'is-success': staff.isActive, 'is-muted': !staff.isActive }">
                {{ staff.isActive ? '在職' : '停用' }}
              </span>
            </div>
          </li>
        </ul>
      </section>

      <!-- 班別設定 -->
      <section class="bo-panel">
        <header class="bo-panel-header">
          <h2>班別設定</h2>
          <span class="bo-pill">Shifts</span>
        </header>
        <form class="bo-form" @submit.prevent="handleSaveShift">
          <label class="bo-field">
            <span>班別名稱</span>
            <input v-model="shiftForm.name" type="text" placeholder="例：早班" />
          </label>
          <label class="bo-field">
            <span>開始時間</span>
            <input v-model="shiftForm.startTime" type="time" />
          </label>
          <label class="bo-field">
            <span>結束時間</span>
            <input v-model="shiftForm.endTime" type="time" />
          </label>
          <label class="bo-field">
            <span>適用分店</span>
            <select v-model="shiftForm.store">
              <option>信義總院</option>
              <option>板橋分院</option>
            </select>
          </label>
          <div class="bo-form-actions">
            <button type="submit" class="bo-btn is-primary">新增班別</button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { showCustom } from '~/composables/utils/alert'

useHead({ title: '人事系統' })

const staffs = reactive([
  { fullName: '陳院長', email: 'doctor@petcare.local', jobTitle: '院長',   isActive: true  },
  { fullName: '林護理師', email: 'nurse@petcare.local', jobTitle: '護理師', isActive: true  },
  { fullName: '王行政',  email: 'admin@petcare.local',  jobTitle: '行政',   isActive: false },
])

const shiftForm = reactive({ name: '早班', startTime: '09:00', endTime: '18:00', store: '信義總院' })

async function handleSaveShift() {
  // TODO: 串接班別 API
  await showCustom('班別已新增', `${shiftForm.name} 已成功建立。`, 'success')
}
</script>

<style scoped>
.bo-page { display: grid; gap: 1.5rem; }
.bo-page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.bo-kicker { color: var(--bo-accent, #d9b26f); font-size: 0.75rem; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 0.25rem; }
.bo-page-title { color: var(--bo-primary, #17334a); font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900; }

.staff-layout { display: grid; gap: 1rem; }

.bo-panel { padding: 1.25rem; border: 1px solid var(--bo-border, #dfe7ec); border-radius: 10px; background: #fff; }
.bo-panel-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--bo-border, #dfe7ec); }
.bo-panel-header h2 { color: var(--bo-primary, #17334a); font-size: 1rem; font-weight: 900; }

.bo-pill { display: inline-flex; align-items: center; padding: 0.25rem 0.65rem; border-radius: 999px; color: var(--bo-primary, #17334a); background: var(--bo-primary-soft, #edf4f8); font-size: 0.78rem; font-weight: 900; white-space: nowrap; }
.bo-pill.is-success { color: #14633f; background: #e7f6ee; }
.bo-pill.is-muted   { color: var(--bo-muted, #6b7882); background: #f0f0f0; }

.staff-list { display: grid; gap: 0.6rem; padding: 0; margin: 0; list-style: none; }
.staff-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.85rem 1rem; border: 1px solid var(--bo-border, #dfe7ec); border-radius: 8px; background: #fafbfc; }
.staff-meta strong { display: block; color: var(--bo-primary, #17334a); font-weight: 900; margin-bottom: 0.15rem; }
.staff-meta span { color: var(--bo-muted, #6b7882); font-size: 0.85rem; }
.staff-actions { flex-shrink: 0; }

.bo-form { display: grid; gap: 1rem; }
.bo-field { display: grid; gap: 0.4rem; font-weight: 800; color: var(--bo-primary, #17334a); font-size: 0.92rem; }
.bo-field input, .bo-field select { width: 100%; min-height: 2.75rem; padding: 0 0.8rem; border: 1px solid var(--bo-border, #dfe7ec); border-radius: 7px; color: var(--bo-text, #20303c); background: #fff; font: inherit; }
.bo-field input:focus, .bo-field select:focus { border-color: var(--bo-accent, #d9b26f); outline: 3px solid rgba(217,178,111,0.18); }

.bo-form-actions { padding-top: 0.25rem; }
.bo-btn { min-height: 2.75rem; padding: 0 1.5rem; border: none; border-radius: 7px; font: inherit; font-weight: 900; cursor: pointer; transition: opacity 0.15s; }
.bo-btn.is-primary { color: #fff; background: var(--bo-primary, #17334a); }
.bo-btn.is-primary:hover { opacity: 0.85; }

@media (min-width: 48em) {
  .staff-layout { grid-template-columns: 1fr 1fr; }
}
</style>
