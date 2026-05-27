<template>
  <!-- ===== Email 綁定頁面：控制整個頁面背景與版面 ===== -->
  <main class="bind-page">
    <!-- ===== 背景裝飾：控制頁面淡色光影與品牌感 ===== -->
    <div class="bind-bg-decoration" aria-hidden="true"></div>

    <!-- ===== 綁定卡片：控制主要內容區域 ===== -->
    <section class="bind-card">

      <!-- ===== 狀態一：驗證中 ===== -->
      <div v-if="status === 'loading'" class="bind-status">
        <div class="bind-icon-wrap bind-icon-loading">
          <div class="loading-spinner-large"></div>
        </div>
        <h1 class="bind-title">{{ t('page.emailBind.loadingTitle') }}</h1>
        <p class="bind-desc">{{ t('page.emailBind.loadingDesc') }}</p>
      </div>

      <!-- ===== 狀態二：綁定成功 ===== -->
      <div v-else-if="status === 'success'" class="bind-status">
        <div class="bind-icon-wrap bind-icon-success">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p class="bind-eyebrow">{{ t('page.emailBind.successEyebrow') }}</p>
        <h1 class="bind-title">{{ t('page.emailBind.successTitle') }}</h1>
        <p class="bind-desc">{{ successMessage }}</p>
        <div class="bind-actions">
          <NuxtLink to="/" class="bind-btn-primary">
            {{ t('page.emailBind.backHome') }}
          </NuxtLink>
        </div>
      </div>

      <!-- ===== 狀態三：綁定失敗 ===== -->
      <div v-else-if="status === 'error'" class="bind-status">
        <div class="bind-icon-wrap bind-icon-error">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <p class="bind-eyebrow">{{ t('page.emailBind.errorEyebrow') }}</p>
        <h1 class="bind-title">{{ t('page.emailBind.errorTitle') }}</h1>
        <p class="bind-desc">{{ errorMessage }}</p>
        <div class="bind-actions">
          <NuxtLink to="/" class="bind-btn-secondary">
            {{ t('page.emailBind.backHome') }}
          </NuxtLink>
        </div>
      </div>

    </section>
  </main>
</template>

<script setup lang="ts">

// ===== 頁面設定：關閉預設 Layout，讓此頁不顯示 Header 與 Footer =====
definePageMeta({
  layout: false,
})

import { onMounted, ref } from 'vue'
import { useRoute } from '#imports'
import { authAPI } from '~/composables/utils/api'

const { t } = useI18n()

useHead(() => ({
  title: t('page.emailBind.title'),
}))

/* ===== 路由功能：取得信箱連結帶過來的 token 參數 ===== */
const route = useRoute()

/* ===== 頁面狀態：loading / success / error ===== */
const status = ref<'loading' | 'success' | 'error'>('loading')

/* ===== 成功訊息 ===== */
const successMessage = ref('')

/* ===== 錯誤訊息 ===== */
const errorMessage = ref('')

successMessage.value = t('page.emailBind.successDefault')
errorMessage.value = t('page.emailBind.errorDefault')

/* ===== 頁面初始化：自動呼叫綁定 API ===== */
onMounted(async () => {
  const token = String(route.query.token ?? '')

  if (!token) {
    errorMessage.value = t('page.emailBind.errorMissingToken')
    status.value = 'error'
    return
  }

  try {
    const result = await authAPI.emailBind(token)

    if (result.success || result.isSuccess) {
      successMessage.value = result.message || t('page.emailBind.successDefault')
      status.value = 'success'
    } else {
      errorMessage.value = result.message || t('page.emailBind.errorDefault')
      status.value = 'error'
    }
  } catch (error: any) {
    const detail = error.response?.data?.detail || ''
    const message = error.response?.data?.message || ''
    errorMessage.value = detail || message || t('page.emailBind.errorDefault')
    status.value = 'error'
  }
})
</script>

<style scoped>
/* ===== Email 綁定頁面：控制整頁背景與置中排版 ===== */
.bind-page {
  --color-primary: #2e4a62;
  --color-primary-dark: #1f3548;
  --color-accent: #d9b26f;
  --color-success: #4caf89;
  --color-error: #e05a5a;
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
.bind-bg-decoration {
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
.bind-page::after {
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

/* ===== 綁定卡片：控制內容卡片外觀 ===== */
.bind-card {
  position: relative;
  z-index: 2;
  width: min(100%, 38rem);
  padding: 3rem 2.5rem;
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

/* ===== 狀態容器：控制各狀態的置中排版 ===== */
.bind-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

/* ===== 圖示容器：控制圓形圖示背景 ===== */
.bind-icon-wrap {
  width: 5rem;
  height: 5rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
}

/* ===== Loading 圖示容器：金色調 ===== */
.bind-icon-loading {
  background: rgba(217, 178, 111, 0.12);
}

/* ===== 成功圖示容器：綠色調 ===== */
.bind-icon-success {
  background: rgba(76, 175, 137, 0.12);
  color: var(--color-success);
}

/* ===== 成功圖示 SVG：控制大小 ===== */
.bind-icon-success svg {
  width: 2.5rem;
  height: 2.5rem;
}

/* ===== 錯誤圖示容器：紅色調 ===== */
.bind-icon-error {
  background: rgba(224, 90, 90, 0.1);
  color: var(--color-error);
}

/* ===== 錯誤圖示 SVG：控制大小 ===== */
.bind-icon-error svg {
  width: 2.5rem;
  height: 2.5rem;
}

/* ===== 大型 Loading Spinner：控制驗證時的旋轉動畫 ===== */
.loading-spinner-large {
  width: 2.75rem;
  height: 2.75rem;
  border: 4px solid rgba(217, 178, 111, 0.3);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ===== Spinner 動畫：控制旋轉效果 ===== */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== 英文小標：控制狀態標籤樣式 ===== */
.bind-eyebrow {
  color: var(--color-accent);
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin: 0;
}

/* ===== 主標題：控制狀態標題文字 ===== */
.bind-title {
  color: var(--color-primary);
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.25;
  margin: 0;
}

/* ===== 說明文字：控制狀態描述 ===== */
.bind-desc {
  color: var(--color-muted);
  font-size: 0.98rem;
  line-height: 1.75;
  max-width: 26rem;
  margin: 0;
}

/* ===== 按鈕區：控制操作按鈕排版 ===== */
.bind-actions {
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.75rem;
}

/* ===== 主要按鈕：控制成功狀態的返回按鈕 ===== */
.bind-btn-primary {
  min-height: 3.1rem;
  padding: 0 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
  );
  border: 2px solid var(--color-accent);
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-decoration: none;
  transition: 0.2s ease;
}

/* ===== 主要按鈕 hover：控制互動效果 ===== */
.bind-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(31, 53, 72, 0.24);
}

/* ===== 次要按鈕：控制失敗狀態的返回按鈕 ===== */
.bind-btn-secondary {
  min-height: 3.1rem;
  padding: 0 2rem;
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

/* ===== 次要按鈕 hover：控制互動效果 ===== */
.bind-btn-secondary:hover {
  background-color: #fffaf0;
  transform: translateY(-2px);
}

/* ===== 平板以上：控制卡片內距 ===== */
@media (min-width: 48em) {
  .bind-card {
    padding: 4rem 3.5rem;
  }
}
</style>
