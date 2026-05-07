<template>
  <!-- ===== 登入 Modal 遮罩：控制背景半透明與點擊關閉 ===== -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="login-modal-backdrop"
      >
        <!-- ===== 登入 Modal 主體：控制登入表單內容 ===== -->
        <section
          class="login-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
        >
          <!-- ===== Modal 關閉按鈕：控制右上角關閉 ===== -->
          <button
            type="button"
            class="login-modal-close"
            aria-label="關閉登入視窗"
            @click="closeModal"
          >
            ×
          </button>

          <!-- ===== Modal 標題區：控制登入標題與說明文字 ===== -->
          <header class="login-modal-header">
            <p class="login-modal-eyebrow">Member Login</p>

            <h2 id="login-modal-title" class="login-modal-title">
              會員登入
            </h2>

            <p class="login-modal-desc">
              登入後即可管理預約、查看紀錄與使用會員服務。
            </p>
          </header>

          <!-- ===== 登入表單：控制帳號、密碼與登入送出 ===== -->
          <form class="login-form" @submit.prevent="handleSubmit">
            <!-- ===== 帳號欄位：控制使用者輸入帳號 ===== -->
            <div class="form-group">
              <label for="login-account" class="form-label">
                帳號
              </label>

              <input
                id="login-account"
                v-model.trim="form.account"
                type="text"
                class="form-control"
                placeholder="請輸入帳號"
                autocomplete="username"
                required
              />
            </div>

            <!-- ===== 密碼欄位：控制使用者輸入密碼 ===== -->
            <div class="form-group">
              <label for="login-password" class="form-label">
                密碼
              </label>

              <input
                id="login-password"
                v-model="form.password"
                type="password"
                class="form-control"
                placeholder="請輸入密碼"
                autocomplete="current-password"
                required
              />
            </div>

            <!-- ===== 登入按鈕：控制送出登入表單 ===== -->
            <button type="submit" class="login-submit">
              登入
            </button>
          </form>

          <!-- ===== Modal 底部連結：控制忘記密碼與註冊帳號入口 ===== -->
          <footer class="login-modal-footer">
            <button
              type="button"
              class="text-link"
              @click="emitForgotPassword"
            >
              忘記密碼
            </button>

            <span class="footer-divider">/</span>

            <button
              type="button"
              class="text-link"
              @click="emitRegister"
            >
              註冊帳號
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import Swal from "sweetalert2";
import api from "~/composables/utils/api";
import { showCustom } from "~/composables/utils/alert";

/* ===== 登入資料型別：控制後端 API 需要的登入資料格式 ===== */
interface LoginPayload {
  account: string;
  password: string;
  deviceId: string;
  browserInfo: string;
  osInfo: string;
  screenResolution: string;
}

/* ===== Props：控制 Modal 是否開啟與預填充帳號 ===== */
const props = defineProps<{
  modelValue: boolean;
  prefillAccount?: string;
}>();

/* ===== Emits：通知父層關閉、忘記密碼、註冊帳號、登入成功 ===== */
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  forgotPassword: [];
  register: [];
  loginSuccess: [];
}>();

/* ===== 表單資料：控制帳號與密碼輸入內容 ===== */
const form = reactive<Omit<LoginPayload, "deviceId" | "browserInfo" | "osInfo" | "screenResolution">>({
  account: "",
  password: "",
});

/* ===== 監聽預填充帳號：當父層傳入帳號時自動填入 ===== */
watch(
  () => props.prefillAccount,
  (newAccount) => {
    if (newAccount) {
      form.account = newAccount;
    }
  },
  { immediate: true }
);

/* ===== 關閉 Modal：通知父層把 v-model 改成 false ===== */
const closeModal = () => {
  emit("update:modelValue", false);
};

/* ===== 收集系統資訊：為登入收集裝置、瀏覽器、作業系統、螢幕解析度 ===== */
const collectSystemInfo = () => {
  // ===== 取得瀏覽器資訊：優先檢查 Edge，因為 Edge 的 UA 也包含 Chrome =====
  const userAgent = navigator.userAgent;
  let browserInfo = "Unknown";

  if (userAgent.includes("Edg/")) {
    const match = userAgent.match(/Edg\/([\d.]+)/);
    browserInfo = match ? `Edge ${match[1]}` : "Edge";
  } else if (userAgent.includes("Chrome/")) {
    const match = userAgent.match(/Chrome\/([\d.]+)/);
    browserInfo = match ? `Chrome ${match[1]}` : "Chrome";
  } else if (userAgent.includes("Firefox/")) {
    const match = userAgent.match(/Firefox\/([\d.]+)/);
    browserInfo = match ? `Firefox ${match[1]}` : "Firefox";
  } else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome")) {
    const match = userAgent.match(/Version\/([\d.]+)/);
    browserInfo = match ? `Safari ${match[1]}` : "Safari";
  }

  // ===== 取得作業系統資訊：根據 userAgent 和 platform 判斷 =====
  let osInfo = "Unknown";

  if (userAgent.includes("Windows NT 10.0")) {
    osInfo = "Windows 10";
  } else if (userAgent.includes("Windows NT 6.3")) {
    osInfo = "Windows 8.1";
  } else if (userAgent.includes("Windows NT 6.2")) {
    osInfo = "Windows 8";
  } else if (userAgent.includes("Windows NT 6.1")) {
    osInfo = "Windows 7";
  } else if (userAgent.includes("Mac OS X")) {
    const match = userAgent.match(/Mac OS X ([\d_]+)/);
    if (match?.[1]) {
      const version = match[1].replace(/_/g, ".");
      osInfo = `macOS ${version}`;
    } else {
      osInfo = "macOS";
    }
  } else if (userAgent.includes("Android")) {
    const match = userAgent.match(/Android ([\d.]+)/);
    osInfo = match ? `Android ${match[1]}` : "Android";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    const match = userAgent.match(/OS ([\d_]+)/);
    if (match?.[1]) {
      const version = match[1].replace(/_/g, ".");
      osInfo = `iOS ${version}`;
    } else {
      osInfo = "iOS";
    }
  } else if (userAgent.includes("Linux")) {
    osInfo = "Linux";
  }

  // ===== 取得螢幕解析度：使用實際的螢幕尺寸 =====
  const screenResolution = `${window.screen.width}x${window.screen.height}`;

  // ===== 取得持久化的 deviceId：同一台電腦同一瀏覽器固定使用同一組 =====
  const deviceId = getOrCreateDeviceId();

  return {
    deviceId,
    browserInfo,
    osInfo,
    screenResolution,
  };
};

/* ===== 取得或建立裝置識別碼：控制同一個瀏覽器固定使用同一組 deviceId ===== */
const getOrCreateDeviceId = (): string => {
  const storageKey = "petcare_device_id";
  const existingDeviceId = localStorage.getItem(storageKey);

  if (existingDeviceId) {
    return existingDeviceId;
  }

  let newDeviceId: string;
  
  if (crypto.randomUUID) {
    newDeviceId = crypto.randomUUID();
  } else {
    newDeviceId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const array = new Uint8Array(1);
      crypto.getRandomValues(array);
      const r = array[0]! % 16;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  localStorage.setItem(storageKey, newDeviceId);
  return newDeviceId;
};

/* ===== 送出登入：檢查欄位後呼叫 API ===== */
const handleSubmit = async () => {
  try {
    const systemInfo = collectSystemInfo();

    const payload: LoginPayload = {
      account: form.account,
      password: form.password,
      deviceId: systemInfo.deviceId,
      browserInfo: systemInfo.browserInfo,
      osInfo: systemInfo.osInfo,
      screenResolution: systemInfo.screenResolution,
    };

    const response = await api.post("/Login", payload);

    // ===== 登入成功 =====
    if (response.data.success !== false) {
      await showCustom(
        "登入成功",
        "歡迎回來！",
        "success",
      );

      // ===== 清空表單 =====
      form.account = "";
      form.password = "";

      // ===== 關閉 Modal =====
      emit("update:modelValue", false);

      // ===== 通知父層登入成功，重新檢查登入狀態 =====
      emit("loginSuccess");

      // TODO: 儲存 token 或使用者資訊到 localStorage/store
    }
  } catch (error: any) {
    const detail = error.response?.data?.detail || "";
    const message = error.response?.data?.message || "登入失敗，請確認帳號密碼";

    // ===== 顯示後端的 detail 訊息（優先），否則顯示 message =====
    await showCustom(
      "登入失敗",
      detail || message,
      "error",
    );
  }
};

/* ===== 忘記密碼：通知父層切換到忘記密碼流程 ===== */
const emitForgotPassword = () => {
  emit("forgotPassword");
};

/* ===== 註冊帳號：通知父層切換到註冊流程 ===== */
const emitRegister = () => {
  emit("register");
};
</script>

<style scoped>
/* ===== Modal 背景遮罩：控制整個畫面半透明背景 ===== */
.login-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  background-color: rgba(15, 37, 56, 0.55);
  backdrop-filter: blur(0.35rem);
}

/* ===== Modal 主體：控制登入視窗外觀 ===== */
.login-modal {
  position: relative;
  width: min(100%, 26rem);
  padding: 2rem;
  border-radius: 1.5rem;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(248, 247, 243, 0.98) 100%
    );
  border: 1px solid rgba(230, 216, 189, 0.9);
  box-shadow: 0 24px 70px rgba(15, 37, 56, 0.24);
}

/* ===== 關閉按鈕：控制右上角 X 按鈕 ===== */
.login-modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid rgba(217, 178, 111, 0.55);
  border-radius: 999px;
  color: #2e4a62;
  background-color: #fffaf0;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: 0.2s ease;
}

/* ===== 關閉按鈕 hover：控制互動效果 ===== */
.login-modal-close:hover {
  color: #ffffff;
  background-color: #2e4a62;
}

/* ===== Modal 標題區：控制標題與說明間距 ===== */
.login-modal-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

/* ===== Modal 小標：控制英文小標樣式 ===== */
.login-modal-eyebrow {
  color: #d9b26f;
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

/* ===== Modal 主標題：控制會員登入文字 ===== */
.login-modal-title {
  color: #2e4a62;
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.25;
  margin-bottom: 0.75rem;
}

/* ===== Modal 描述文字：控制登入說明 ===== */
.login-modal-desc {
  color: #6f7a80;
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}

/* ===== 表單區塊：控制欄位垂直排列 ===== */
.login-form {
  display: grid;
  gap: 1rem;
}

/* ===== 表單群組：控制 label 與 input 間距 ===== */
.form-group {
  display: grid;
  gap: 0.45rem;
}

/* ===== 表單標籤：控制欄位名稱樣式 ===== */
.form-label {
  color: #2e4a62;
  font-size: 0.95rem;
  font-weight: 800;
}

/* ===== 表單輸入框：控制 Email 與密碼輸入框 ===== */
.form-control {
  width: 100%;
  min-height: 3.1rem;
  padding: 0 1rem;
  border: 1px solid rgba(230, 216, 189, 0.95);
  border-radius: 0.9rem;
  color: #263238;
  background-color: rgba(255, 255, 255, 0.92);
  font-size: 1rem;
  outline: none;
  transition: 0.2s ease;
}

/* ===== 表單輸入框 focus：控制聚焦時的外框效果 ===== */
.form-control:focus {
  border-color: #d9b26f;
  box-shadow: 0 0 0 4px rgba(217, 178, 111, 0.16);
}

/* ===== 登入按鈕：控制登入送出按鈕 ===== */
.login-submit {
  min-height: 3.25rem;
  margin-top: 0.5rem;
  border: 2px solid #d9b26f;
  border-radius: 999px;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      #2e4a62 0%,
      #1f3548 100%
    );
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: 0.2s ease;
}

/* ===== 登入按鈕 hover：控制按鈕互動效果 ===== */
.login-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(31, 53, 72, 0.24);
}

/* ===== Modal 底部：控制忘記密碼與註冊帳號排列 ===== */
.login-modal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 1.5rem;
}

/* ===== 底部文字連結：控制忘記密碼與註冊帳號按鈕 ===== */
.text-link {
  border: none;
  color: #b98b42;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

/* ===== 底部文字連結 hover：控制互動效果 ===== */
.text-link:hover {
  color: #2e4a62;
  text-decoration: underline;
}

/* ===== 底部分隔線：控制 / 符號樣式 ===== */
.footer-divider {
  color: rgba(46, 74, 98, 0.45);
  font-weight: 800;
}

/* ===== Modal 動畫：控制淡入淡出 ===== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

/* ===== Modal 動畫狀態：控制透明度 ===== */
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* ===== 平板以上：控制 Modal 尺寸與內距 ===== */
@media (min-width: 48em) {
  .login-modal {
    padding: 2.5rem;
  }
}
</style>