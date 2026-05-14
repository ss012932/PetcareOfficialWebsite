<template>
  <div class="bo-page">
    <header class="bo-page-header">
      <div>
        <p class="bo-kicker">Account</p>
        <h1 class="bo-page-title">會員設定</h1>
      </div>
    </header>

    <div class="profile-grid">
      <!-- 基本資料 -->
      <section class="bo-panel">
        <header class="bo-panel-header">
          <h2>基本資料</h2>
          <span class="bo-pill">Profile</span>
        </header>
        <form class="bo-form" @submit.prevent="handleSaveProfile">
          <label class="bo-field">
            <span>姓名</span>
            <input v-model="form.name" type="text" autocomplete="name" placeholder="請輸入姓名" />
          </label>
          <label class="bo-field">
            <span>Email</span>
            <input v-model="form.email" type="email" autocomplete="email" placeholder="請輸入 Email" />
          </label>
          <label class="bo-field">
            <span>手機</span>
            <input v-model="form.phone" type="tel" autocomplete="tel" placeholder="請輸入手機號碼" />
          </label>

          <div class="bo-field-row">
            <label class="bo-switch">
              <input v-model="form.isEmailConfirmed" type="checkbox" disabled />
              <span>電子信箱已驗證</span>
            </label>
          </div>

          <div class="bo-form-actions">
            <button type="submit" class="bo-btn is-primary">儲存變更</button>
          </div>
        </form>
      </section>

      <!-- 修改密碼 -->
      <section class="bo-panel">
        <header class="bo-panel-header">
          <h2>修改密碼</h2>
          <span class="bo-pill">Security</span>
        </header>
        <form class="bo-form" @submit.prevent="handleChangePassword">
          <label class="bo-field">
            <span>目前密碼</span>
            <input v-model="pwd.current" type="password" autocomplete="current-password" placeholder="請輸入目前密碼" />
          </label>
          <label class="bo-field">
            <span>新密碼</span>
            <input v-model="pwd.next" type="password" autocomplete="new-password" placeholder="請輸入新密碼" />
          </label>
          <label class="bo-field">
            <span>確認新密碼</span>
            <input v-model="pwd.confirm" type="password" autocomplete="new-password" placeholder="再次輸入新密碼" />
          </label>
          <div class="bo-form-actions">
            <button type="submit" class="bo-btn is-primary">更新密碼</button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { authAPI } from '~/composables/utils/api'
import { showCustom } from '~/composables/utils/alert'

useHead({ title: '會員設定' })

const authResult = await authAPI.checkLoginStatus()
const user = authResult?.user ?? {}

const form = reactive({
  name:             user.Name ?? '',
  email:            user.Email ?? '',
  phone:            user.Phone ?? '',
  isEmailConfirmed: user.IsEmailConfirmed ?? false,
})

const pwd = reactive({ current: '', next: '', confirm: '' })

async function handleSaveProfile() {
  // TODO: 串接更新會員資料 API
  await showCustom('儲存成功', '會員資料已更新。', 'success')
}

async function handleChangePassword() {
  if (pwd.next !== pwd.confirm) {
    await showCustom('密碼不一致', '兩次輸入的新密碼不相同，請重新確認。', 'error')
    return
  }
  // TODO: 串接更新密碼 API
  await showCustom('密碼已更新', '請使用新密碼重新登入。', 'success')
  pwd.current = pwd.next = pwd.confirm = ''
}
</script>

<style scoped>
.bo-page { display: grid; gap: 1.5rem; }

.bo-page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.bo-kicker { color: var(--bo-accent, #d9b26f); font-size: 0.75rem; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 0.25rem; }
.bo-page-title { color: var(--bo-primary, #17334a); font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900; }

.profile-grid { display: grid; gap: 1rem; }

.bo-panel { padding: 1.25rem; border: 1px solid var(--bo-border, #dfe7ec); border-radius: 10px; background: #fff; }
.bo-panel-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--bo-border, #dfe7ec); }
.bo-panel-header h2 { color: var(--bo-primary, #17334a); font-size: 1rem; font-weight: 900; }

.bo-pill { display: inline-flex; align-items: center; padding: 0.25rem 0.65rem; border-radius: 999px; color: var(--bo-primary, #17334a); background: var(--bo-primary-soft, #edf4f8); font-size: 0.78rem; font-weight: 900; }

.bo-form { display: grid; gap: 1rem; }
.bo-field { display: grid; gap: 0.4rem; font-weight: 800; color: var(--bo-primary, #17334a); font-size: 0.92rem; }
.bo-field input { width: 100%; min-height: 2.75rem; padding: 0 0.8rem; border: 1px solid var(--bo-border, #dfe7ec); border-radius: 7px; color: var(--bo-text, #20303c); background: #fff; font: inherit; }
.bo-field input:focus { border-color: var(--bo-accent, #d9b26f); outline: 3px solid rgba(217,178,111,0.18); }

.bo-field-row { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.bo-switch { display: flex; align-items: center; gap: 0.55rem; font-weight: 800; color: var(--bo-primary, #17334a); }
.bo-switch input { width: 1.1rem; height: 1.1rem; accent-color: var(--bo-primary, #17334a); }

.bo-form-actions { padding-top: 0.25rem; }
.bo-btn { min-height: 2.75rem; padding: 0 1.5rem; border: none; border-radius: 7px; font: inherit; font-weight: 900; cursor: pointer; transition: opacity 0.15s; }
.bo-btn.is-primary { color: #fff; background: var(--bo-primary, #17334a); }
.bo-btn.is-primary:hover { opacity: 0.85; }

@media (min-width: 48em) {
  .profile-grid { grid-template-columns: 1fr 1fr; }
}
</style>
