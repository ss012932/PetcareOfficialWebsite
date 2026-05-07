<template>
  <!-- ===== 重置密碼頁面：控制整個重置密碼頁背景與版面 ===== -->
  <main class="reset-page">
    <!-- ===== 背景裝飾：控制頁面淡色光影與品牌感 ===== -->
    <div class="reset-bg-decoration" aria-hidden="true"></div>

    <!-- ===== 重置密碼卡片：控制主要表單內容 ===== -->
    <section class="reset-card" aria-labelledby="reset-title">
     

      <!-- ===== 標題區塊：控制頁面標題與說明文字 ===== -->
      <header class="reset-header">
        <p class="reset-eyebrow">Reset Password</p>

        <h1 id="reset-title" class="reset-title">
          重置密碼
        </h1>

        <p class="reset-desc">
          請確認帳號資訊，並設定新的登入密碼。
        </p>
      </header>

      <!-- ===== 重置密碼表單：控制姓名、Email、新密碼與確認密碼 ===== -->
      <form class="reset-form" @submit.prevent="handleSubmit">
        <!-- ===== 帳號資料列：控制姓名與電子郵件唯讀欄位 ===== -->
        <div class="form-row">
          <!-- ===== 姓名欄位：從重置連結自動帶入且不可修改 ===== -->
          <div class="form-group">
            <label for="reset-name" class="form-label">
              姓名
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
              電子郵件
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
            新密碼
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
            再次輸入密碼
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
          <button type="submit" class="reset-submit">
            確認重置密碼
          </button>

          <NuxtLink to="/" class="reset-home-link">
            返回首頁
          </NuxtLink>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">

// ===== 頁面設定：關閉預設 Layout，讓此頁不顯示 Header 與 Footer =====
definePageMeta({
  layout: false,
})


import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from '#imports'
import Swal from 'sweetalert2'

/* ===== 路由功能：取得信箱連結帶過來的 query 參數 ===== */
const route = useRoute()

/* ===== 路由導向：重置成功後可返回首頁 ===== */
const router = useRouter()

/* ===== 重置密碼表單資料：控制頁面所有欄位狀態 ===== */
const form = reactive({
  name: '',
  email: '',
  newPassword: '',
  confirmPassword: '',
  token: '',
})

/* ===== 頁面初始化：從網址 query 自動帶入姓名、Email 與 token ===== */
onMounted(() => {
  form.name = String(route.query.name ?? '')
  form.email = String(route.query.email ?? '')
  form.token = String(route.query.token ?? '')
})

/* ===== 表單送出：檢查密碼後送出重置密碼資料 ===== */
async function handleSubmit() {
  // ===== 基本檢查：確認重置連結是否有 token =====
  if (!form.token) {
    await Swal.fire({
      icon: 'error',
      title: '重置連結無效',
      text: '缺少重置密碼驗證資訊，請重新申請忘記密碼。',
      confirmButtonText: '確定',
      confirmButtonColor: '#2e4a62',
    })

    return
  }

  // ===== 基本檢查：確認姓名與電子郵件是否存在 =====
  if (!form.name || !form.email) {
    await Swal.fire({
      icon: 'warning',
      title: '帳號資訊不完整',
      text: '請重新從信箱中的重置密碼連結進入。',
      confirmButtonText: '確定',
      confirmButtonColor: '#2e4a62',
    })

    return
  }

  // ===== 密碼長度檢查：避免密碼過短 =====
  if (form.newPassword.length < 8) {
    await Swal.fire({
      icon: 'warning',
      title: '密碼長度不足',
      text: '新密碼至少需要 8 個字元。',
      confirmButtonText: '確定',
      confirmButtonColor: '#2e4a62',
    })

    return
  }

  // ===== 密碼一致性檢查：確認兩次密碼相同 =====
  if (form.newPassword !== form.confirmPassword) {
    await Swal.fire({
      icon: 'warning',
      title: '密碼不一致',
      text: '請確認新密碼與再次輸入密碼是否相同。',
      confirmButtonText: '確定',
      confirmButtonColor: '#2e4a62',
    })

    return
  }

  // ===== 這裡之後可改成呼叫後端 API =====
  console.log('重置密碼資料：', {
    token: form.token,
    email: form.email,
    newPassword: form.newPassword,
  })

  await Swal.fire({
    icon: 'success',
    title: '密碼已重置',
    text: '請使用新密碼重新登入。',
    confirmButtonText: '返回首頁',
    confirmButtonColor: '#2e4a62',
  })

  await router.push('/')
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
}

/* ===== 確認按鈕 hover：控制按鈕互動效果 ===== */
.reset-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(31, 53, 72, 0.24);
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