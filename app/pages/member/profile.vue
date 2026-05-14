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
            <input
              v-model="form.name"
              type="text"
              autocomplete="name"
              placeholder="請輸入姓名"
            />
          </label>
          <label class="bo-field">
            <span>Email</span>
            <div class="email-wrap">
              <input
                v-model="form.email"
                type="email"
                autocomplete="email"
                placeholder="請輸入 Email"
                :readonly="form.isEmailConfirmed"
                :class="{ 'is-locked': form.isEmailConfirmed }"
              />
              <span
                v-if="!profileLoading"
                class="email-status"
                :class="form.isEmailConfirmed ? 'is-verified' : 'is-unverified'"
              >
                <span class="email-status-mark" aria-hidden="true"></span>
                {{ form.isEmailConfirmed ? "信箱已驗證" : "信箱尚未驗證" }}
              </span>
            </div>
            <button
              v-if="!profileLoading && !form.isEmailConfirmed"
              type="button"
              class="bo-btn is-ghost resend-btn"
              :disabled="resendLoading || cooldownSeconds > 0"
              @click="handleResendVerification"
            >
              <template v-if="resendLoading">寄送中⋯</template>
              <template v-else-if="cooldownSeconds > 0"
                >請等待 {{ cooldownSeconds }} 秒後再寄</template
              >
              <template v-else>重新寄送驗證信</template>
            </button>
          </label>
          <label class="bo-field">
            <span>手機</span>
            <input
              v-model="form.phone"
              type="tel"
              autocomplete="tel"
              placeholder="請輸入手機號碼"
            />
          </label>

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
            <input
              v-model="pwd.current"
              type="password"
              autocomplete="current-password"
              placeholder="請輸入目前密碼"
            />
          </label>
          <label class="bo-field">
            <span>新密碼</span>
            <input
              v-model="pwd.next"
              type="password"
              autocomplete="new-password"
              placeholder="請輸入新密碼"
            />
          </label>
          <label class="bo-field">
            <span>確認新密碼</span>
            <input
              v-model="pwd.confirm"
              type="password"
              autocomplete="new-password"
              placeholder="再次輸入新密碼"
            />
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
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import Swal from "sweetalert2";
import api from "~/composables/utils/api";
import { showCustom } from "~/composables/utils/alert";
import { useAuthStore } from "~/composables/auth";

useHead({ title: "會員設定" });
const authStore = useAuthStore();

/**
 * 個人資料表單
 * 用途：先給畫面穩定的預設值，等瀏覽器端載入會員資料後再更新
 */
const form = reactive({
  name: "",
  email: "",
  phone: "",
  isEmailConfirmed: false,
});

/**
 * 頁面載入狀態
 * 用途：避免會員資料還沒載入前，就先顯示錯誤的信箱狀態
 */
const profileLoading = ref(true);

/**
 * 載入會員資料
 * 用途：從 AuthMe 取得後端最新會員資料，寫入表單
 */
async function loadProfile() {
  try {
    profileLoading.value = true;

    // 從 Auth Store 重新載入後端最新會員資料
    await authStore.loadUser();

    // 從共用 Store 取出會員資料
    const user = authStore.user;

    // 把會員資料寫入表單
    form.name = user.Name;
    form.email = user.Email;
    form.phone = user.Phone;
    form.isEmailConfirmed = user.IsEmailConfirmed;
  } catch (error) {
    console.error("取得會員資料失敗:", error);
  } finally {
    profileLoading.value = false;
  }
}

onMounted(async () => {
  await loadProfile();

  const until = localStorage.getItem(COOLDOWN_KEY);
  if (until) {
    const remaining = Math.ceil((Number(until) - Date.now()) / 1000);
    if (remaining > 0) {
      cooldownSeconds.value = remaining;
      startCooldownTimer();
    } else {
      localStorage.removeItem(COOLDOWN_KEY);
    }
  }
});

const pwd = reactive({ current: "", next: "", confirm: "" });

const resendLoading = ref(false);
const cooldownSeconds = ref(0);
const COOLDOWN_KEY = "petcare_resend_email_until";
let cooldownTimer: ReturnType<typeof setInterval> | null = null;

function startCooldownTimer() {
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    cooldownSeconds.value--;
    if (cooldownSeconds.value <= 0) {
      clearInterval(cooldownTimer!);
      cooldownTimer = null;
      if (import.meta.client) localStorage.removeItem(COOLDOWN_KEY);
    }
  }, 1000);
}

function startCooldown() {
  const until = Date.now() + 60_000;
  if (import.meta.client) localStorage.setItem(COOLDOWN_KEY, String(until));
  cooldownSeconds.value = 60;
  startCooldownTimer();
}



onBeforeUnmount(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});

async function handleResendVerification() {
  resendLoading.value = true;

  Swal.fire({
    title: "寄送中…",
    text: "正在寄送驗證信，請稍候",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    await api.post("/email-bind/resend", {});
    startCooldown();
    await showCustom(
      "驗證信已寄出",
      "請至信箱點擊驗證連結完成綁定。",
      "success",
    );
  } catch (error: any) {
    const detail = error.response?.data?.detail || "寄送失敗，請稍後再試";
    await showCustom("寄送失敗", detail, "error");
  } finally {
    resendLoading.value = false;
  }
}

async function handleSaveProfile() {
  const payload: Record<string, string> = {
    fullName: form.name,
    email: form.email,
    phone: form.phone,
  }

  try {
    await api.patch('/user/profile', payload)

    // 更新成功後重新取得後端最新資料
    await loadProfile()

    await showCustom('儲存成功', '會員資料已更新。', 'success')

  } catch (error: any) {
    const detail = error.response?.data?.detail || '儲存失敗，請稍後再試'
    await showCustom('儲存失敗', detail, 'error')
  }
}

async function handleChangePassword() {
  // =========================
  // 1. 驗證目前密碼
  // =========================
  if (!pwd.current.trim()) {
    await showCustom(
      "請輸入目前密碼",
      "目前密碼不可空白。",
      "warning",
    );
    return;
  }

  // =========================
  // 2. 驗證新密碼
  // =========================
  if (!pwd.next.trim()) {
    await showCustom(
      "請輸入新密碼",
      "新密碼不可空白。",
      "warning",
    );
    return;
  }

  // =========================
  // 3. 新密碼長度至少 10 碼
  // =========================
  if (pwd.next.length < 10) {
    await showCustom(
      "新密碼太短",
      "新密碼長度至少需要 10 個字元。",
      "warning",
    );
    return;
  }

  // =========================
  // 4. 驗證兩次新密碼是否一致
  // =========================
  if (pwd.next !== pwd.confirm) {
    await showCustom(
      "密碼不一致",
      "兩次輸入的新密碼不相同，請重新確認。",
      "error",
    );
    return;
  }

  try {
    // =========================
    // 5. 呼叫後端更換密碼 API
    // =========================
    await api.patch("/user/password", {
      currentPassword: pwd.current,
      newPassword: pwd.next,
    });

    // =========================
    // 6. 成功後清空欄位
    // =========================
    pwd.current = "";
    pwd.next = "";
    pwd.confirm = "";

    await showCustom(
      "密碼已更新",
      "下次登入請使用新密碼。",
      "success",
    );
  } catch (error: any) {
    // =========================
    // 7. 顯示後端回傳錯誤
    // =========================
    const detail =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "密碼更新失敗，請稍後再試";

    await showCustom(
      "更新失敗",
      detail,
      "error",
    );
  }
}
</script>

<style scoped>
.bo-page {
  display: grid;
  gap: 1.5rem;
}

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

.profile-grid {
  display: grid;
  gap: 1rem;
}

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
  margin-bottom: 1.25rem;
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

.bo-form {
  display: grid;
  gap: 1rem;
}
.bo-field {
  display: grid;
  gap: 0.4rem;
  font-weight: 800;
  color: var(--bo-primary, #17334a);
  font-size: 0.92rem;
}
.bo-field input {
  width: 100%;
  min-height: 2.75rem;
  padding: 0 0.8rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 7px;
  color: var(--bo-text, #20303c);
  background: #fff;
  font: inherit;
}
.bo-field input:focus {
  border-color: var(--bo-accent, #d9b26f);
  outline: 3px solid rgba(217, 178, 111, 0.18);
}
.bo-field input.is-locked {
  background: var(--bo-primary-soft, #edf4f8);
  color: var(--bo-muted, #6b7882);
  cursor: not-allowed;
  user-select: none;
}

.email-wrap {
  display: grid;
  gap: 0.4rem;
}

.email-status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 800;
}
.email-status.is-verified {
  color: #2e7d32;
}
.email-status.is-unverified {
  color: #b94a48;
}

.email-status-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  font-size: 0.58rem;
  font-weight: 900;
  line-height: 1;
  flex-shrink: 0;
}
.is-verified .email-status-mark {
  background: #2e7d32;
  color: #fff;
}
.is-verified .email-status-mark::before {
  content: "\2713";
}
.is-unverified .email-status-mark {
  background: #b94a48;
  color: #fff;
}
.is-unverified .email-status-mark::before {
  content: "\2717";
}

.resend-btn {
  align-self: start;
  min-height: 2.1rem;
  padding: 0 1rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 6px;
  color: var(--bo-primary, #17334a);
  background: var(--bo-primary-soft, #edf4f8);
  font-size: 0.82rem;
  font-weight: 900;
  cursor: pointer;
  transition: opacity 0.15s;
  width: fit-content;
}
.resend-btn:hover:not(:disabled) {
  opacity: 0.75;
}
.resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bo-form-actions {
  padding-top: 0.25rem;
}
.bo-btn {
  min-height: 2.75rem;
  padding: 0 1.5rem;
  border: none;
  border-radius: 7px;
  font: inherit;
  font-weight: 900;
  cursor: pointer;
  transition: opacity 0.15s;
}
.bo-btn.is-primary {
  color: #fff;
  background: var(--bo-primary, #17334a);
}
.bo-btn.is-primary:hover {
  opacity: 0.85;
}

@media (min-width: 48em) {
  .profile-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
