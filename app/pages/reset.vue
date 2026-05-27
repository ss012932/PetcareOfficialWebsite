<template>
  <!-- ===== 重置密碼頁面：控制整個重置密碼頁背景與版面 ===== -->
  <main class="reset-page">
    <!-- ===== 背景裝飾：控制頁面淡色光影與品牌感 ===== -->
    <div class="reset-bg-decoration" aria-hidden="true"></div>

    <!-- ===== 重置密碼卡片：控制主要表單內容 ===== -->
    <section class="reset-card" aria-labelledby="reset-title">
      <!-- ===== Loading 狀態：驗證 Token 時顯示 ===== -->
      <div v-if="isValidating" class="reset-loading">
        <div class="loading-spinner-large"></div>
        <p class="loading-text">{{ t('page.reset.loading') }}</p>
      </div>

      <!-- ===== 表單內容：Token 有效時顯示 ===== -->
      <template v-else-if="isTokenValid">
        <!-- ===== 標題區塊：控制頁面標題與說明文字 ===== -->
        <header class="reset-header">
        <p class="reset-eyebrow">{{ t('page.reset.eyebrow') }}</p>

        <h1 id="reset-title" class="reset-title">
          {{ t('page.reset.title') }}
        </h1>

        <p class="reset-desc">
          {{ t('page.reset.desc') }}
        </p>
      </header>

      <!-- ===== 重置密碼表單：控制姓名、Email、新密碼與確認密碼 ===== -->
      <form class="reset-form" @submit.prevent="handleSubmit">
        <!-- ===== 帳號資料列：控制姓名與電子郵件唯讀欄位 ===== -->
        <div class="form-row">
          <!-- ===== 姓名欄位：從重置連結自動帶入且不可修改 ===== -->
          <div class="form-group">
            <label for="reset-name" class="form-label">
              {{ t('page.reset.name') }}
            </label>

            <input
              id="reset-name"
              v-model="form.name"
              type="text"
              class="form-control form-control-readonly"
              placeholder="系統自動帶入姓名"
              readonly
            />
          </div>

          <!-- ===== 電子郵件欄位：從重置連結自動帶入且不可修改 ===== -->
          <div class="form-group">
            <label for="reset-email" class="form-label">
              {{ t('page.reset.email') }}
            </label>

            <input
              id="reset-email"
              v-model="form.email"
              type="email"
              class="form-control form-control-readonly"
              placeholder="系統自動帶入電子郵件"
              readonly
            />
          </div>
        </div>

        <!-- ===== 新密碼欄位：控制使用者輸入新密碼 ===== -->
        <div class="form-group">
          <label for="reset-password" class="form-label">
            {{ t('page.reset.newPassword') }}
          </label>

          <input
            id="reset-password"
            v-model="form.newPassword"
            type="password"
            class="form-control"
            placeholder="請輸入新密碼"
            autocomplete="new-password"
            required
          />
        </div>

        <!-- ===== 再次輸入密碼欄位：控制使用者確認新密碼 ===== -->
        <div class="form-group">
          <label for="reset-confirm-password" class="form-label">
            {{ t('page.reset.confirmPassword') }}
          </label>

          <input
            id="reset-confirm-password"
            v-model="form.confirmPassword"
            type="password"
            class="form-control"
            placeholder="請再次輸入新密碼"
            autocomplete="new-password"
            required
          />
        </div>

        <!-- ===== 操作按鈕區：控制確認重置與返回首頁 ===== -->
        <div class="reset-actions">
          <button 
            type="submit" 
            class="reset-submit"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="loading-spinner"></span>
            <span>{{ isSubmitting ? t('page.reset.submitting') : t('page.reset.submit') }}</span>
          </button>

          <NuxtLink to="/" class="reset-home-link">
            {{ t('page.reset.backHome') }}
          </NuxtLink>
        </div>
      </form>
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">

// ===== 頁面設定：關閉預設 Layout，讓此頁不顯示 Header 與 Footer =====
definePageMeta({
  layout: false,
})


import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from '#imports'
import { authAPI } from '~/composables/utils/api'
import { showCustom } from '~/composables/utils/alert'

const { t } = useI18n()

useHead(() => ({
  title: t('page.reset.title'),
}))

/* ===== 路由功能：取得信箱連結帶過來的 query 參數 ===== */
const route = useRoute()

/* ===== 路由導向：重置成功後可返回首頁 ===== */
const router = useRouter()

/* ===== Loading 狀態：控制驗證 token 時的載入效果 ===== */
const isValidating = ref(true)

/* ===== Token 有效性：控制是否顯示表單 ===== */
const isTokenValid = ref(false)

/* ===== 提交中狀態：控制重設密碼按鈕的 loading ===== */
const isSubmitting = ref(false)

/* ===== 重置密碼表單資料：控制頁面所有欄位狀態 ===== */
const form = reactive({
  name: '',
  email: '',
  newPassword: '',
  confirmPassword: '',
  token: '',
})

/* ===== 頁面初始化：驗證 token 並從 API 回應帶入資料 ===== */
onMounted(async () => {
  // ===== 取得網址上的 token =====
  const token = String(route.query.token ?? '')

  if (!token) {
    await showCustom(
      '重置連結無效',
      '缺少驗證資訊，請重新申請忘記密碼',
      'error'
    )
    await router.push('/')
    return
  }

  form.token = token

  try {
    // ===== 呼叫驗證 Token API =====
    const result = await authAPI.validateResetToken(token)

    if (result.success && result.valid && !result.expired) {
      // ===== Token 有效：顯示表單並自動帶入資料 =====
      isTokenValid.value = true
      form.email = result.data?.email || ''
      form.name = result.data?.fullName || ''
    } else {
      // ===== Token 無效或過期 =====
      const message = result.message || '重置連結已失效，請重新申請'
      await showCustom(
        '重置連結無效',
        message,
        'error'
      )
      await router.push('/')
    }
  } catch (error: any) {
    const detail = error.response?.data?.detail || ''
    const message = error.response?.data?.message || '驗證失敗，請重新申請忘記密碼'

    await showCustom(
      '驗證失敗',
      detail || message,
      'error'
    )
    await router.push('/')
  } finally {
    isValidating.value = false
  }
})

/* ===== 表單送出：檢查密碼後送出重置密碼資料 ===== */
async function handleSubmit() {
  if (isSubmitting.value) return

  // ===== 密碼長度檢查：避免密碼過短 =====
  if (form.newPassword.length < 8) {
    await showCustom(
      '密碼長度不足',
      '新密碼至少需要 8 個字元',
      'warning'
    )
    return
  }

  // ===== 密碼一致性檢查：確認兩次密碼相同 =====
  if (form.newPassword !== form.confirmPassword) {
    await showCustom(
      '密碼不一致',
      '請確認新密碼與再次輸入密碼是否相同',
      'warning'
    )
    return
  }

  try {
    isSubmitting.value = true

    // ===== 呼叫重設密碼 API =====
    await authAPI.resetPassword(form.token, form.newPassword)

    await showCustom(
      '密碼已重置',
      '請使用新密碼重新登入',
      'success'
    )

    await router.push('/')
  } catch (error: any) {
    const detail = error.response?.data?.detail || ''
    const message = error.response?.data?.message || '重設密碼失敗，請稍後再試'

    await showCustom(
      '重設失敗',
      detail || message,
      'error'
    )
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* ===== 重置密碼頁面：控制整頁背景與置中排版 ===== */
.reset-page {
  --color-primary: #2e4a62;
  --color-primary-dark: #1f3548;
  --color-accent: #d9b26f;
  --color-bg: #f8f7f3;
  --color-text: #263238;
  --color-muted: #6f7a80;
  --color-border: #e6d8bd;

  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1.25rem;
  color: var(--color-text);
  background:
    radial-gradient(circle at top left, rgba(217, 178, 111, 0.16), transparent 28rem),
    radial-gradient(circle at bottom right, rgba(156, 191, 167, 0.14), transparent 26rem),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(248, 247, 243, 0.98) 100%
    );
  overflow: hidden;
}

/* ===== 背景裝飾：控制右上角淡金色光影 ===== */
.reset-bg-decoration {
  position: absolute;
  top: -8rem;
  right: -8rem;
  width: 24rem;
  height: 24rem;
  border-radius: 999px;
  background: rgba(217, 178, 111, 0.16);
  filter: blur(0.2rem);
  pointer-events: none;
}

/* ===== 背景裝飾線條：控制底部金色弧線 ===== */
.reset-page::after {
  content: '';
  position: absolute;
  left: -8%;
  right: -8%;
  bottom: 2rem;
  height: 6rem;
  border-bottom: 1.5px solid rgba(217, 178, 111, 0.42);
  border-radius: 0 0 50% 50%;
  pointer-events: none;
}

/* ===== 重置密碼卡片：控制表單外觀 ===== */
.reset-card {
  position: relative;
  z-index: 2;
  width: min(100%, 42rem);
  padding: 2rem;
  border-radius: 1.75rem;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(248, 247, 243, 0.98) 100%
    );
  border: 1px solid rgba(230, 216, 189, 0.9);
  box-shadow: 0 24px 70px rgba(15, 37, 56, 0.16);
}

/* ===== Loading 容器：控制驗證中的載入狀態 ===== */
.reset-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 3rem 2rem;
}

/* ===== 大型 Loading Spinner：控制驗證時的旋轉動畫 ===== */
.loading-spinner-large {
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(217, 178, 111, 0.3);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ===== Loading 文字：控制驗證提示文字 ===== */
.loading-text {
  color: var(--color-muted);
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

/* ===== 小型 Loading Spinner：控制按鈕內的載入動畫 ===== */
.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* ===== Spinner 動畫：控制旋轉效果 ===== */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== Logo 區塊：控制品牌連結樣式 ===== */
.reset-logo {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto 1.75rem;
  color: var(--color-primary);
  text-decoration: none;
}

/* ===== Logo 圖示：控制爪印圖示樣式 ===== */
.reset-logo-icon {
  color: var(--color-accent);
  font-size: 1.25rem;
  line-height: 1;
}

/* ===== Logo 文字：控制品牌名稱樣式 ===== */
.reset-logo-text {
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

/* ===== 標題區：控制標題與說明置中 ===== */
.reset-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

/* ===== 英文小標：控制 Reset Password 小字樣式 ===== */
.reset-eyebrow {
  color: var(--color-accent);
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

/* ===== 主標題：控制重置密碼文字 ===== */
.reset-title {
  color: var(--color-primary);
  font-size: 2.1rem;
  font-weight: 900;
  line-height: 1.25;
  margin-bottom: 0.75rem;
}

/* ===== 說明文字：控制標題下方描述 ===== */
.reset-desc {
  color: var(--color-muted);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}

/* ===== 表單區塊：控制欄位垂直排列 ===== */
.reset-form {
  display: grid;
  gap: 1rem;
}

/* ===== 表單列：手機版先上下排列 ===== */
.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* ===== 表單群組：控制 label 與 input 間距 ===== */
.form-group {
  display: grid;
  gap: 0.45rem;
}

/* ===== 表單標籤：控制欄位名稱樣式 ===== */
.form-label {
  color: var(--color-primary);
  font-size: 0.95rem;
  font-weight: 800;
}

/* ===== 表單輸入框：控制一般欄位樣式 ===== */
.form-control {
  width: 100%;
  min-height: 3.15rem;
  padding: 0 1rem;
  border: 1px solid rgba(230, 216, 189, 0.95);
  border-radius: 0.9rem;
  color: var(--color-text);
  background-color: rgba(255, 255, 255, 0.92);
  font-size: 1rem;
  outline: none;
  transition: 0.2s ease;
}

/* ===== 表單輸入框 focus：控制聚焦時外框效果 ===== */
.form-control:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(217, 178, 111, 0.16);
}

/* ===== 唯讀欄位：控制姓名與 Email 不可修改狀態 ===== */
.form-control-readonly {
  color: rgba(38, 50, 56, 0.72);
  background-color: rgba(243, 239, 230, 0.72);
  cursor: not-allowed;
}

/* ===== 按鈕區：控制確認與返回首頁排列 ===== */
.reset-actions {
  display: grid;
  gap: 0.85rem;
  margin-top: 0.5rem;
}

/* ===== 確認按鈕：控制送出重置密碼按鈕 ===== */
.reset-submit {
  min-height: 3.25rem;
  border: 2px solid var(--color-accent);
  border-radius: 999px;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      var(--color-primary) 0%,
      var(--color-primary-dark) 100%
    );
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* ===== 確認按鈕 hover：控制按鈕互動效果 ===== */
.reset-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(31, 53, 72, 0.24);
}

/* ===== 確認按鈕 disabled：控制提交中的禁用狀態 ===== */
.reset-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ===== 返回首頁連結：控制次要操作樣式 ===== */
.reset-home-link {
  min-height: 3.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  background-color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(217, 178, 111, 0.65);
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 900;
  text-decoration: none;
  transition: 0.2s ease;
}

/* ===== 返回首頁 hover：控制互動效果 ===== */
.reset-home-link:hover {
  color: var(--color-primary-dark);
  background-color: #fffaf0;
  transform: translateY(-2px);
}

/* ===== 平板以上：控制卡片寬度、內距與雙欄欄位 ===== */
@media (min-width: 48em) {
  .reset-card {
    padding: 2.75rem 3rem;
  }

  .form-row {
    grid-template-columns: 1fr 1fr;
  }

  .reset-actions {
    grid-template-columns: 1.15fr 0.85fr;
    align-items: center;
  }
}

/* ===== 桌機以上：控制桌機版視覺比例 ===== */
@media (min-width: 64em) {
  .reset-card {
    width: min(100%, 46rem);
  }
}
</style>