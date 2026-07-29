<template>
  <main class="activation-page">
    <!-- ===== 背景裝飾：控制員工啟用頁的品牌視覺 ===== -->
    <div class="activation-page__glow activation-page__glow--left" aria-hidden="true"></div>
    <div class="activation-page__glow activation-page__glow--right" aria-hidden="true"></div>

    <!-- ===== 啟用卡片：控制 Token 驗證、表單與完成狀態 ===== -->
    <section class="activation-card" aria-labelledby="activation-title">
      <div class="brand-mark" aria-hidden="true">
        <Icon name="fa6-solid:paw" />
      </div>

      <p class="eyebrow">PETCARE STAFF ACTIVATION</p>
      <h1 id="activation-title">啟用員工帳號</h1>

      <!-- ===== 載入狀態：驗證邀請 Token 時顯示 ===== -->
      <div v-if="validating" class="state-panel" role="status">
        <Icon name="fa6-solid:spinner" class="spin" />
        <div>
          <strong>正在驗證邀請連結</strong>
          <p>請稍候，不要關閉此頁面。</p>
        </div>
      </div>

      <!-- ===== 無效狀態：Token 過期、已使用或格式錯誤 ===== -->
      <div v-else-if="invalidMessage" class="state-panel state-panel--error" role="alert">
        <Icon name="fa6-solid:triangle-exclamation" />
        <div>
          <strong>無法啟用帳號</strong>
          <p>{{ invalidMessage }}</p>
        </div>
      </div>

      <!-- ===== 完成狀態：帳號與密碼設定成功 ===== -->
      <div v-else-if="completed" class="completed-panel" role="status">
        <div class="completed-icon">
          <Icon name="fa6-solid:check" />
        </div>
        <h2>帳號啟用完成</h2>
        <p>
          您已完成登入帳號與密碼設定。請使用剛設定的帳號，前往院所提供的 PetCare 醫療後台登入。
        </p>
        <NuxtLink class="secondary-button" to="/">
          返回 PetCare 官網
        </NuxtLink>
      </div>

      <!-- ===== 員工綁定表單：設定登入帳號與密碼 ===== -->
      <form v-else class="activation-form" @submit.prevent="submitActivation">
        <p class="description">
          請確認員工資料，並自行設定日後登入醫療後台使用的帳號與密碼。
        </p>

        <div class="identity-grid">
          <label class="field-group">
            <span>員工姓名</span>
            <input :value="inviteInfo.fullName" type="text" readonly>
          </label>

          <label class="field-group">
            <span>Email</span>
            <input :value="inviteInfo.email" type="email" readonly>
          </label>
        </div>

        <label class="field-group">
          <span>登入帳號 <em>*</em></span>
          <input
            v-model.trim="form.account"
            type="text"
            autocomplete="username"
            minlength="4"
            maxlength="50"
            pattern="[A-Za-z0-9._-]+"
            required
            placeholder="例如 doctor.chen、nurse_001"
          >
          <small>4～50 碼，只能使用英文字母、數字、句點、底線與連字號。</small>
        </label>

        <label class="field-group">
          <span>登入密碼 <em>*</em></span>
          <div class="password-field">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              minlength="8"
              maxlength="200"
              required
              placeholder="至少 8 個字元"
            >
            <button
              type="button"
              class="password-toggle"
              :aria-label="showPassword ? '隱藏密碼' : '顯示密碼'"
              @click="showPassword = !showPassword"
            >
              <Icon :name="showPassword ? 'fa6-solid:eye-slash' : 'fa6-solid:eye'" />
            </button>
          </div>
        </label>

        <label class="field-group">
          <span>確認密碼 <em>*</em></span>
          <input
            v-model="form.confirmPassword"
            type="password"
            autocomplete="new-password"
            minlength="8"
            maxlength="200"
            required
            placeholder="再次輸入登入密碼"
          >
        </label>

        <button class="primary-button" type="submit" :disabled="submitting">
          <Icon v-if="submitting" name="fa6-solid:spinner" class="spin" />
          <span>{{ submitting ? "正在啟用…" : "設定帳號密碼並啟用" }}</span>
        </button>
      </form>

      <p class="support-text">
        連結已過期或已使用時，請聯絡院所管理者重新寄送員工啟用信。
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { staffInviteAPI } from "~/composables/utils/api"
import { showCustom } from "~/composables/utils/alert"

/**
 * 這個頁面控制員工首次啟用流程。
 * 與官網會員 reset.vue 分開，避免兩種身分共用錯誤的 API 與資料模型。
 */
definePageMeta({ layout: false })

useHead({
  title: "啟用員工帳號 | PetCare",
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    { name: "description", content: "PetCare 員工首次設定登入帳號與密碼" },
  ],
})

interface StaffInviteInfo {
  fullName: string
  email: string
}

const route = useRoute()
const token = computed(() => String(route.query.token ?? "").trim())

const validating = ref(true)
const submitting = ref(false)
const completed = ref(false)
const invalidMessage = ref("")
const showPassword = ref(false)

const inviteInfo = reactive<StaffInviteInfo>({
  fullName: "",
  email: "",
})

const form = reactive({
  account: "",
  password: "",
  confirmPassword: "",
})

/**
 * 從 Axios 或後端統一錯誤格式中取得可顯示訊息。
 */
function getErrorMessage(error: any, fallback: string): string {
  return error?.response?.data?.message
    ?? error?.response?.data?.detail
    ?? error?.message
    ?? fallback
}

/**
 * 驗證 Email 內的邀請 Token，並讀取員工姓名與 Email。
 */
async function validateInvite(): Promise<void> {
  if (!token.value) {
    invalidMessage.value = "邀請連結缺少 Token，請重新開啟完整信件連結。"
    validating.value = false
    return
  }

  try {
    const response = await staffInviteAPI.validateInvite(token.value)
    const data = response.data?.data ?? response.data

    inviteInfo.fullName = String(data?.FullName ?? data?.fullName ?? "")
    inviteInfo.email = String(data?.Email ?? data?.email ?? "")

    if (!inviteInfo.fullName || !inviteInfo.email) {
      throw new Error("邀請資料不完整，請聯絡院所管理者重新寄送。")
    }
  } catch (error) {
    invalidMessage.value = getErrorMessage(
      error,
      "邀請連結無效、已使用或已超過 24 小時。",
    )
  } finally {
    validating.value = false
  }
}

/**
 * 驗證表單並送出員工自行設定的登入帳號與密碼。
 */
async function submitActivation(): Promise<void> {
  const accountPattern = /^[A-Za-z0-9._-]{4,50}$/

  if (!accountPattern.test(form.account)) {
    await showCustom(
      "帳號格式不正確",
      "帳號需為 4～50 碼，只能使用英文字母、數字、句點、底線與連字號。",
      "warning",
    )
    return
  }

  if (form.password.length < 8) {
    await showCustom("密碼長度不足", "登入密碼至少需要 8 個字元。", "warning")
    return
  }

  if (form.password !== form.confirmPassword) {
    await showCustom("密碼不一致", "兩次輸入的密碼不同，請重新確認。", "warning")
    return
  }

  submitting.value = true
  try {
    await staffInviteAPI.setupCredentials(
      token.value,
      form.account,
      form.password,
    )

    completed.value = true
    form.password = ""
    form.confirmPassword = ""

    await showCustom(
      "啟用成功",
      "登入帳號與密碼已設定完成。",
      "success",
    )
  } catch (error) {
    await showCustom(
      "啟用失敗",
      getErrorMessage(error, "無法設定員工帳號與密碼，請稍後再試。"),
      "error",
    )
  } finally {
    submitting.value = false
  }
}

onMounted(validateInvite)
</script>

<style scoped>
.activation-page {
  position: relative;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: clamp(1rem, 4vw, 3rem);
  background:
    linear-gradient(145deg, #f4f8f7 0%, #fffdf9 48%, #eef4f5 100%);
}

.activation-page__glow {
  position: absolute;
  width: clamp(18rem, 38vw, 34rem);
  aspect-ratio: 1;
  border-radius: 999px;
  filter: blur(3rem);
  pointer-events: none;
}

.activation-page__glow--left {
  left: -12rem;
  top: -12rem;
  background: rgba(70, 137, 139, 0.18);
}

.activation-page__glow--right {
  right: -13rem;
  bottom: -15rem;
  background: rgba(201, 169, 110, 0.17);
}

.activation-card {
  position: relative;
  z-index: 1;
  width: min(100%, 42rem);
  display: grid;
  gap: 1rem;
  padding: clamp(1.35rem, 5vw, 2.6rem);
  border: 1px solid rgba(45, 36, 32, 0.1);
  border-radius: clamp(1rem, 3vw, 1.65rem);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 1.6rem 4.5rem rgba(40, 54, 58, 0.14);
  backdrop-filter: blur(1rem);
}

.brand-mark {
  width: 3.5rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 1rem;
  background: #2d494f;
  color: #fff;
  font-size: 1.35rem;
  box-shadow: 0 0.7rem 1.7rem rgba(45, 73, 79, 0.22);
}

.eyebrow {
  margin: 0;
  color: #61868a;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.16em;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  color: #263c43;
  font-size: clamp(1.65rem, 5vw, 2.35rem);
  line-height: 1.2;
}

.description,
.support-text {
  color: #6b797e;
  line-height: 1.75;
}

.activation-form {
  display: grid;
  gap: 1rem;
}

.identity-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

.field-group {
  display: grid;
  gap: 0.45rem;
  color: #32474e;
  font-weight: 800;
}

.field-group em {
  color: #b44747;
  font-style: normal;
}

.field-group small {
  color: #77878c;
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1.6;
}

input {
  width: 100%;
  min-height: 3.15rem;
  padding: 0.78rem 0.92rem;
  border: 1px solid #cfdbde;
  border-radius: 0.78rem;
  background: #fff;
  color: #263c43;
  font: inherit;
  font-weight: 600;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input[readonly] {
  background: #f2f5f5;
  color: #68787d;
  cursor: not-allowed;
}

input:focus {
  outline: none;
  border-color: #4f8589;
  box-shadow: 0 0 0 3px rgba(79, 133, 137, 0.16);
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 3.3rem;
}

.password-toggle {
  position: absolute;
  inset-block: 0;
  right: 0.35rem;
  width: 2.7rem;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: #6b7d82;
  cursor: pointer;
}

.primary-button,
.secondary-button {
  min-height: 3.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border-radius: 0.82rem;
  font: inherit;
  font-weight: 900;
  text-decoration: none;
  cursor: pointer;
}

.primary-button {
  border: 0;
  background: linear-gradient(135deg, #2d494f, #46777d);
  color: #fff;
  box-shadow: 0 0.7rem 1.6rem rgba(45, 73, 79, 0.22);
}

.primary-button:disabled {
  opacity: 0.58;
  cursor: wait;
}

.secondary-button {
  width: 100%;
  border: 1px solid #cfdadc;
  color: #365b61;
  background: #fff;
}

.state-panel {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 1rem;
  border-radius: 0.85rem;
  background: #eef7f6;
  color: #376c70;
}

.state-panel strong,
.state-panel p {
  display: block;
  line-height: 1.6;
}

.state-panel p {
  color: inherit;
  opacity: 0.82;
}

.state-panel--error {
  background: #fff0ef;
  color: #9b4141;
}

.completed-panel {
  display: grid;
  justify-items: center;
  gap: 0.9rem;
  padding: 1rem 0;
  text-align: center;
}

.completed-panel p {
  max-width: 32rem;
  color: #68787d;
  line-height: 1.75;
}

.completed-icon {
  width: 4rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #e7f5ef;
  color: #2e8a66;
  font-size: 1.45rem;
}

.support-text {
  padding-top: 0.2rem;
  text-align: center;
  font-size: 0.8rem;
}

.spin {
  animation: spin 0.85s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 42rem) {
  .activation-page {
    place-items: stretch;
    padding: 0;
  }

  .activation-card {
    width: 100%;
    min-height: 100dvh;
    align-content: center;
    border: 0;
    border-radius: 0;
    padding: clamp(1.2rem, 6vw, 2rem);
  }

  .identity-grid {
    grid-template-columns: 1fr;
  }
}
</style>
