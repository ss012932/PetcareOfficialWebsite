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
          <!-- ===== Modal 背景裝飾：控制淡淡爪印與曲線 ===== -->
          <div class="login-modal-decoration" aria-hidden="true"></div>

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
            <div class="login-modal-eyebrow">
              <span></span>
              <strong>WELCOME BACK</strong>
              <span></span>
            </div>

            <h2 id="login-modal-title" class="login-modal-title">
              會員登入
            </h2>

            <p class="login-modal-desc">
              登入您的帳號，開始管理預約、病歷與院所營運。
            </p>
          </header>

          <!-- ===== 登入表單：控制帳號、密碼與登入送出 ===== -->
          <form class="login-form" @submit.prevent="handleSubmit">
            <!-- ===== 電子郵件欄位：控制使用者輸入帳號 ===== -->
            <div class="form-group">
              <label for="login-account" class="form-label">
                電子郵件
              </label>

              <div class="input-wrap">
                <Icon
                  name="fa6-regular:envelope"
                  class="input-icon"
                  aria-hidden="true"
                />

                <input
                  id="login-account"
                  v-model.trim="form.account"
                  type="text"
                  class="form-control"
                  placeholder="請輸入電子郵件"
                  autocomplete="username"
                  required
                />
              </div>
            </div>

            <!-- ===== 密碼欄位：控制使用者輸入密碼 ===== -->
            <div class="form-group">
              <label for="login-password" class="form-label">
                密碼
              </label>

              <div class="input-wrap">
                <Icon
                  name="fa6-solid:lock"
                  class="input-icon"
                  aria-hidden="true"
                />

                <input
                  id="login-password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="請輸入密碼"
                  autocomplete="current-password"
                  required
                />

                <button
                  type="button"
                  class="password-toggle"
                  aria-label="切換密碼顯示"
                  @click="togglePasswordVisibility"
                >
                  <Icon
                    :name="showPassword ? 'fa6-regular:eye-slash' : 'fa6-regular:eye'"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <!-- ===== 登入選項列：控制記住我與忘記密碼 ===== -->
            <div class="login-options">
              <label class="remember-check">
                <input
                  v-model="rememberMe"
                  type="checkbox"
                />

                <span class="custom-checkbox">
                  <Icon
                    v-if="rememberMe"
                    name="fa6-solid:check"
                    aria-hidden="true"
                  />
                </span>

                <span>記住我</span>
              </label>

              <button
                type="button"
                class="forgot-link"
                @click="emitForgotPassword"
              >
                忘記密碼
              </button>
            </div>

            <!-- ===== 登入按鈕：控制送出登入表單 ===== -->
            <button type="submit" class="login-submit">
              <Icon
                name="fa6-solid:paw"
                class="login-submit-icon"
                aria-hidden="true"
              />

              <span>登入</span>
            </button>
          </form>

          <!-- ===== 裝飾分隔線：控制底部爪印分隔 ===== -->
          <div class="login-divider" aria-hidden="true">
            <span></span>
            <Icon name="fa6-solid:paw" />
            <span></span>
          </div>

          <!-- ===== Modal 底部註冊入口：控制註冊帳號入口 ===== -->
          <footer class="login-modal-footer">
            <span>還沒有帳號？</span>

            <button
              type="button"
              class="register-link"
              @click="emitRegister"
            >
              立即註冊
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
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

/* ===== 記住我狀態：控制登入表單記住我勾選 ===== */
const rememberMe = ref(true);

/* ===== 密碼顯示狀態：控制密碼欄位是否顯示明文 ===== */
const showPassword = ref(false);

/* ===== 切換密碼顯示：控制眼睛按鈕切換密碼可見狀態 ===== */
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

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
  background:
    radial-gradient(circle at 20% 10%, rgba(217, 178, 111, 0.16), transparent 22rem),
    rgba(15, 37, 56, 0.58);
  backdrop-filter: blur(0.45rem);
}

/* ===== Modal 主體：控制登入視窗外觀 ===== */
.login-modal {
  position: relative;
  width: min(100%, 31.5rem);
  padding: 2.5rem 1.2rem 1.8rem;
  border: 1px solid rgba(230, 216, 189, 0.92);
  border-radius: 1.5rem;
  background:
    radial-gradient(circle at 92% 0%, rgba(217, 178, 111, 0.08), transparent 14rem),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(248, 247, 243, 0.98) 100%
    );
  box-shadow:
    0 20px 56px rgba(15, 37, 56, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  overflow: hidden;
}

/* ===== Modal 背景裝飾：控制淡淡爪印與線條 ===== */
.login-modal-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

/* ===== 右上淡爪印裝飾 ===== */
.login-modal-decoration::before {
  content: "🐾";
  position: absolute;
  top: -1.6rem;
  right: -0.9rem;
  color: rgba(217, 178, 111, 0.1);
  font-size: 7.5rem;
  transform: rotate(-12deg);
}

/* ===== 底部金色曲線裝飾 ===== */
.login-modal-decoration::after {
  content: "";
  position: absolute;
  left: -8%;
  right: -8%;
  bottom: -2.4rem;
  height: 5rem;
  border-top: 1px solid rgba(217, 178, 111, 0.32);
  border-radius: 50% 50% 0 0;
}

/* ===== 關閉按鈕：控制右上角 X 按鈕 ===== */
.login-modal-close {
  position: absolute;
  top: 1.35rem;
  right: 1.35rem;
  z-index: 3;
  width: 2.75rem;
  height: 2.75rem;
  border: none;
  border-radius: 999px;
  color: #b98b42;
  background-color: rgba(255, 250, 240, 0.92);
  font-size: 1.65rem;
  line-height: 1;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease;
}

/* ===== 關閉按鈕 hover：控制互動效果 ===== */
.login-modal-close:hover {
  color: #2e4a62;
  background-color: rgba(217, 178, 111, 0.18);
  transform: rotate(90deg);
}

/* ===== Modal 標題區：控制標題與說明間距 ===== */
.login-modal-header {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-bottom: 1.5rem;
}

/* ===== Modal 小標：控制 WELCOME BACK 與左右線條 ===== */
.login-modal-eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #d9b26f;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.28em;
  margin-bottom: 1rem;
}

/* ===== Modal 小標線條：控制左右金色細線 ===== */
.login-modal-eyebrow span {
  width: 3.2rem;
  height: 1px;
  background-color: rgba(217, 178, 111, 0.72);
}

/* ===== Modal 主標題：控制會員登入文字 ===== */
.login-modal-title {
  color: #10283a;
  font-size: clamp(1.9rem, 7vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.06em;
  margin-bottom: 0.75rem;
}

/* ===== Modal 描述文字：控制登入說明 ===== */
.login-modal-desc {
  color: #6f7a80;
  font-size: 0.95rem;
  line-height: 1.65;
  margin: 0;
}

/* ===== 表單區塊：控制欄位垂直排列 ===== */
.login-form {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 1.25rem;
}

/* ===== 表單群組：控制 label 與 input 間距 ===== */
.form-group {
  display: grid;
  gap: 0.6rem;
}

/* ===== 表單標籤：控制欄位名稱樣式 ===== */
.form-label {
  color: #263238;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

/* ===== 輸入框外層：控制 icon 與 input 同列 ===== */
.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

/* ===== 輸入框左側 icon：控制信封與鎖頭圖示 ===== */
.input-icon {
  position: absolute;
  left: 1rem;
  width: 1rem;
  height: 1rem;
  color: rgba(38, 50, 56, 0.5);
  pointer-events: none;
}

/* ===== 表單輸入框：控制 Email 與密碼輸入框 ===== */
.form-control {
  width: 100%;
  min-height: 3rem;
  padding: 0 2.9rem;
  border: 1.5px solid rgba(217, 178, 111, 0.72);
  border-radius: 0.55rem;
  color: #263238;
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

/* ===== 表單 placeholder：控制提示字顏色 ===== */
.form-control::placeholder {
  color: rgba(38, 50, 56, 0.42);
}

/* ===== 表單輸入框 focus：控制聚焦時的外框效果 ===== */
.form-control:focus {
  border-color: #d9b26f;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(217, 178, 111, 0.16);
}

/* ===== 密碼顯示按鈕：控制眼睛按鈕 ===== */
.password-toggle {
  position: absolute;
  right: 0.9rem;
  width: 1.8rem;
  height: 1.8rem;
  display: grid;
  place-items: center;
  border: none;
  color: rgba(38, 50, 56, 0.52);
  background: transparent;
  cursor: pointer;
  transition: color 0.2s ease;
}

/* ===== 密碼顯示按鈕 hover：控制互動效果 ===== */
.password-toggle:hover {
  color: #2e4a62;
}

/* ===== 登入選項列：控制記住我與忘記密碼 ===== */
.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: -0.15rem;
}

/* ===== 記住我 label：控制 checkbox 與文字排列 ===== */
.remember-check {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: #263238;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
}

/* ===== 原生 checkbox：隱藏原本樣式 ===== */
.remember-check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* ===== 自訂 checkbox：控制方形勾選框 ===== */
.custom-checkbox {
  width: 1.35rem;
  height: 1.35rem;
  display: grid;
  place-items: center;
  border: 1px solid rgba(217, 178, 111, 0.78);
  border-radius: 0.25rem;
  color: #ffffff;
  background-color: #10283a;
  font-size: 0.75rem;
}

/* ===== 忘記密碼：控制右側連結 ===== */
.forgot-link {
  border: none;
  color: #10283a;
  background: transparent;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

/* ===== 忘記密碼 hover：控制互動效果 ===== */
.forgot-link:hover {
  color: #b98b42;
  transform: translateX(0.15rem);
}

/* ===== 登入按鈕：控制登入送出按鈕 ===== */
.login-submit {
  min-height: 3.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  margin-top: 0.2rem;
  border: none;
  border-radius: 0.65rem;
  color: #ffffff;
  background: linear-gradient(135deg, #10283a 0%, #0b2233 100%);
  box-shadow: 0 14px 28px rgba(15, 37, 56, 0.2);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

/* ===== 登入按鈕 icon：控制 paw icon ===== */
.login-submit-icon {
  width: 1rem;
  height: 1rem;
  color: #d9b26f;
}

/* ===== 登入按鈕 hover：控制按鈕互動效果 ===== */
.login-submit:hover {
  transform: translateY(-2px);
  filter: brightness(1.04);
  box-shadow: 0 22px 48px rgba(15, 37, 56, 0.3);
}

/* ===== 分隔線：控制底部爪印與左右線條 ===== */
.login-divider {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1.25rem;
  margin: 2rem 0 1.25rem;
  color: #d9b26f;
}

/* ===== 分隔線左右線條 ===== */
.login-divider span {
  height: 1px;
  background-color: rgba(217, 178, 111, 0.42);
}

/* ===== 分隔線爪印 icon ===== */
.login-divider svg {
  width: 1.1rem;
  height: 1.1rem;
}

/* ===== Modal 底部：控制註冊帳號排列 ===== */
.login-modal-footer {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  color: #263238;
  font-size: 0.98rem;
  font-weight: 500;
}

/* ===== 註冊連結：控制立即註冊按鈕 ===== */
.register-link {
  border: none;
  color: #10283a;
  background: transparent;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

/* ===== 註冊連結 hover：控制互動效果 ===== */
.register-link:hover {
  color: #b98b42;
  transform: translateX(0.15rem);
}

/* ===== Modal 動畫：控制淡入淡出 ===== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease;
}

/* ===== Modal 動畫狀態：控制透明度 ===== */
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* ===== 手機版：控制 Modal 不要太擠 ===== */
@media (max-width: 30em) {
  .login-modal {
    width: min(100%, 25rem);
    padding: 2.1rem 1rem 1.5rem;
    border-radius: 1.35rem;
  }

  .login-modal-close {
    top: 0.9rem;
    right: 0.9rem;
    width: 2.35rem;
    height: 2.35rem;
    font-size: 1.35rem;
  }

  .login-modal-title {
    font-size: 2.1rem;
    letter-spacing: 0.06em;
  }

  .login-modal-desc {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .login-modal-eyebrow {
    gap: 0.6rem;
    margin-bottom: 0.8rem;
    letter-spacing: 0.16em;
  }

  .login-modal-eyebrow span {
    width: 1.8rem;
  }

  .login-options {
    align-items: center;
  }

  .login-divider {
    margin: 1.5rem 0 1rem;
  }

  .login-modal-footer {
    font-size: 0.92rem;
  }
}

/* ===== 平板以上：控制 Modal 尺寸與內距 ===== */
@media (min-width: 48em) {
   .login-modal {
    width: min(100%, 33rem);
    padding: 3rem 2.4rem 2.2rem;
    border-radius: 1.75rem;
  }
}
</style>