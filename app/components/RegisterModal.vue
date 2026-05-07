<template>
  <!-- ===== 註冊 Modal 遮罩：控制背景半透明與點擊空白處關閉 ===== -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="register-modal-backdrop"
      >
        <!-- ===== 註冊 Modal 主體：控制註冊表單內容 ===== -->
        <section
          class="register-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-modal-title"
        >
          <!-- ===== Modal 關閉按鈕：控制右上角關閉 ===== -->
          <button
            type="button"
            class="register-modal-close"
            aria-label="關閉註冊視窗"
            @click="closeModal"
          >
            ×
          </button>

          <!-- ===== Modal 標題區：控制註冊標題與說明文字 ===== -->
          <header class="register-modal-header">
            <p class="register-modal-eyebrow">Create Account</p>

            <h2 id="register-modal-title" class="register-modal-title">
              註冊帳號
            </h2>

            <p class="register-modal-desc">
              建立帳號後即可使用預約、紀錄查詢與會員服務。
            </p>
          </header>

          <!-- ===== 註冊表單：控制帳號、姓名、手機、Email、密碼與確認密碼 ===== -->
          <form class="register-form" @submit.prevent="handleSubmit">
            <!-- ===== 帳號欄位：控制使用者輸入帳號 ===== -->
            <div class="form-group">
              <label for="register-account" class="form-label"> 帳號 </label>

              <input
                id="register-account"
                v-model.trim="form.account"
                type="text"
                class="form-control"
                placeholder="請輸入帳號"
                autocomplete="username"
                required
              />
            </div>

            <!-- ===== 第一列欄位：控制姓名與手機號碼同一行 ===== -->
            <div class="form-row">
              <!-- ===== 姓名欄位：控制使用者輸入姓名 ===== -->
              <div class="form-group">
                <label for="register-name" class="form-label"> 姓名 </label>

                <input
                  id="register-name"
                  v-model.trim="form.fullName"
                  type="text"
                  class="form-control"
                  placeholder="請輸入姓名"
                  autocomplete="name"
                  required
                />
              </div>

              <!-- ===== 手機號碼欄位：控制使用者輸入手機號碼 ===== -->
              <div class="form-group">
                <label for="register-phone" class="form-label">
                  手機號碼
                </label>

                <input
                  id="register-phone"
                  v-model.trim="form.phone"
                  type="tel"
                  class="form-control"
                  placeholder="請輸入手機號碼"
                  autocomplete="tel"
                  required
                />
              </div>
            </div>
            <!-- ===== 電子郵件欄位：控制使用者輸入 Email ===== -->
            <div class="form-group">
              <label for="register-email" class="form-label"> 電子郵件 </label>

              <input
                id="register-email"
                v-model.trim="form.email"
                type="email"
                class="form-control"
                placeholder="請輸入電子郵件"
                autocomplete="email"
                required
              />
            </div>

            <!-- ===== 密碼欄位：控制使用者輸入密碼 ===== -->
            <div class="form-group">
              <label for="register-password" class="form-label"> 密碼 </label>

              <input
                id="register-password"
                v-model="form.password"
                type="password"
                class="form-control"
                placeholder="請輸入密碼"
                autocomplete="new-password"
                required
              />
            </div>

            <!-- ===== 確認密碼欄位：控制使用者再次輸入密碼 ===== -->
            <div class="form-group">
              <label for="register-confirm-password" class="form-label">
                確認密碼
              </label>

              <input
                id="register-confirm-password"
                v-model="confirmPassword"
                type="password"
                class="form-control"
                placeholder="請再次輸入密碼"
                autocomplete="new-password"
                required
              />
            </div>

            <!-- ===== 註冊按鈕：控制送出註冊表單 ===== -->
            <button type="submit" class="register-submit">立即註冊</button>
          </form>

          <!-- ===== Modal 底部連結：控制切換到登入流程 ===== -->
          <footer class="register-modal-footer">
            <span class="footer-text">已經有帳號了嗎？</span>

            <button type="button" class="text-link" @click="emitLogin">
              立即登入
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import Swal from "sweetalert2";
import api from "~/composables/utils/api";
import { showCustom } from "~/composables/utils/alert";

/* ===== 註冊資料型別：控制父層收到的註冊資料格式 ===== */
interface RegisterPayload {
  account: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  deviceId: string;
  browserInfo: string;
  osInfo: string;
  screenResolution: string;
}

/* ===== Props：控制 Modal 是否開啟 ===== */
defineProps<{
  modelValue: boolean;
}>();

/* ===== Emits：通知父層關閉、切換登入 ===== */
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  login: [account?: string];
}>();

/* ===== 表單資料：控制註冊欄位輸入內容 ===== */
const form = reactive<Omit<RegisterPayload, 'deviceId' | 'browserInfo' | 'osInfo' | 'screenResolution' | 'confirmPassword'>>({
  account: "",
  fullName: "",
  phone: "",
  email: "",
  password: "",
});

let confirmPassword = "";

/* ===== 關閉 Modal：通知父層把 v-model 改成 false ===== */
const closeModal = () => {
  emit("update:modelValue", false);
};

/* ===== 收集系統資訊：為註冊收集裝置、瀏覽器、作業系統、螢幕解析度 ===== */
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
    // Windows 10 和 11 都是 NT 10.0，用 build 判斷
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
  // ===== localStorage 鍵名：控制 deviceId 存在瀏覽器的位置 =====
  const storageKey = "petcare_device_id";

  // ===== 從瀏覽器取得已存在的 deviceId =====
  const existingDeviceId = localStorage.getItem(storageKey);

  // ===== 如果已經有 deviceId，就直接回傳，避免每次重新產生 =====
  if (existingDeviceId) {
    return existingDeviceId;
  }

  // ===== 產生新的 UUID：優先使用瀏覽器 crypto，比 Math.random 更適合產生識別碼 =====
  let newDeviceId: string;
  
  if (crypto.randomUUID) {
    newDeviceId = crypto.randomUUID();
  } else {
    // ===== Fallback：為舊版瀏覽器產生 UUID v4 格式 =====
    newDeviceId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const array = new Uint8Array(1);
      crypto.getRandomValues(array);
      const r = array[0]! % 16;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // ===== 儲存 deviceId：讓下次開啟同一個網站時還能使用同一組 =====
  localStorage.setItem(storageKey, newDeviceId);

  return newDeviceId;
};


/* ===== 送出註冊：檢查密碼一致後，呼叫 API =====  */
const handleSubmit = async () => {
  // ===== 密碼一致性檢查：避免使用者兩次密碼輸入不同 =====
  if (form.password !== confirmPassword) {
    await Swal.fire({
      icon: "warning",
      title: "密碼不一致",
      text: "請確認密碼與確認密碼是否相同。",
      confirmButtonText: "確定",
      confirmButtonColor: "#2e4a62",
      didOpen: () => {
        // ===== 設定 SweetAlert2 所有層級的 z-index，確保在 modal 上方 =====
        const container = Swal.getContainer();
        const popup = Swal.getPopup();
        
        if (container) {
          container.style.zIndex = "99999";
        }
        if (popup) {
          popup.style.zIndex = "99999";
        }
        
        // ===== 設定 backdrop（背景遮罩）的 z-index =====
        const backdrop = document.querySelector('.swal2-container');
        if (backdrop instanceof HTMLElement) {
          backdrop.style.zIndex = "99999";
        }
      },
    });

    return;
  }

  try {
    // ===== 顯示 Loading 提示：通知使用者正在處理註冊與發送驗證信 =====
    Swal.fire({
      title: "處理中...",
      html: "正在建立帳號並發送驗證信件，請稍候",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
        
        // ===== 設定 Loading 的 z-index，確保在 modal 上方 =====
        const container = Swal.getContainer();
        const popup = Swal.getPopup();
        
        if (container) {
          container.style.zIndex = "99999";
        }
        if (popup) {
          popup.style.zIndex = "99999";
        }
        
        const backdrop = document.querySelector('.swal2-container');
        if (backdrop instanceof HTMLElement) {
          backdrop.style.zIndex = "99999";
        }
      },
    });

    const systemInfo = collectSystemInfo();

    const payload: RegisterPayload = {
      account: form.account,
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      phone: form.phone,
      deviceId: systemInfo.deviceId,
      browserInfo: systemInfo.browserInfo,
      osInfo: systemInfo.osInfo,
      screenResolution: systemInfo.screenResolution,
    };

    const response = await api.post("/Register", payload);

    // ===== 註冊成功 =====
    if (response.data.success !== false) {
      // ===== 儲存帳號，等等要傳給登入 Modal =====
      const registeredAccount = form.account;

      // ===== 清空表單 =====
      form.account = "";
      form.fullName = "";
      form.phone = "";
      form.email = "";
      form.password = "";
      confirmPassword = "";

      // ===== 倒計時 3 秒後跳轉到登入 =====
      let timerInterval: number;
      await Swal.fire({
        icon: "success",
        title: "註冊成功",
        html: "帳號註冊成功，<b>3</b> 秒後自動跳轉到登入頁面",
        timer: 3000,
        timerProgressBar: true,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          // ===== 設定 SweetAlert2 所有層級的 z-index，確保在 modal 上方 =====
          const container = Swal.getContainer();
          const popup = Swal.getPopup();
          
          if (container) {
            container.style.zIndex = "99999";
          }
          if (popup) {
            popup.style.zIndex = "99999";
          }
          
          // ===== 設定 backdrop（背景遮罩）的 z-index =====
          const backdrop = document.querySelector('.swal2-container');
          if (backdrop instanceof HTMLElement) {
            backdrop.style.zIndex = "99999";
          }

          // ===== 倒計時更新 =====
          const content = Swal.getHtmlContainer();
          const b = content?.querySelector("b");
          if (b) {
            timerInterval = setInterval(() => {
              const timeLeft = Math.ceil((Swal.getTimerLeft() || 0) / 1000);
              b.textContent = timeLeft.toString();
            }, 100);
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });

      // ===== 關閉 Modal 並跳轉到登入，傳遞帳號 =====
      emit("update:modelValue", false);
      emit("login", registeredAccount);
    }
  } catch (error: any) {
    const detail = error.response?.data?.detail || "";
    const message = error.response?.data?.message || "註冊失敗，請稍後重試";

    // ===== 顯示後端的 detail 訊息（優先），否則顯示 message =====
    await showCustom(
      "註冊失敗",
      detail || message,
      "error",
    );
  }
};

/* ===== 立即登入：通知父層切換成登入 Modal ===== */
const emitLogin = () => {
  emit("login");
};
</script>

<style scoped>
/* ===== Modal 背景遮罩：控制整個畫面半透明背景 ===== */
.register-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  background-color: rgba(15, 37, 56, 0.55);
  backdrop-filter: blur(0.35rem);
}

/* ===== Modal 主體：控制註冊視窗外觀與寬度 ===== */
.register-modal {
  position: relative;

  /* ===== 寬度設定：讓註冊表單比原本更寬 ===== */
  width: min(100%, 34rem);

  max-height: calc(100vh - 2.5rem);
  overflow-y: auto;
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
.register-modal-close {
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
.register-modal-close:hover {
  color: #ffffff;
  background-color: #2e4a62;
}

/* ===== Modal 標題區：控制標題與說明間距 ===== */
.register-modal-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

/* ===== Modal 小標：控制英文小標樣式 ===== */
.register-modal-eyebrow {
  color: #d9b26f;
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

/* ===== Modal 主標題：控制註冊帳號文字 ===== */
.register-modal-title {
  color: #2e4a62;
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.25;
  margin-bottom: 0.75rem;
}

/* ===== Modal 描述文字：控制註冊說明 ===== */
.register-modal-desc {
  color: #6f7a80;
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}

/* ===== 表單區塊：控制欄位垂直排列 ===== */
.register-form {
  display: grid;
  gap: 1rem;
}

/* ===== 表單列：控制姓名與手機號碼在同一行 ===== */
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
  color: #2e4a62;
  font-size: 0.95rem;
  font-weight: 800;
}

/* ===== 表單輸入框：控制註冊輸入欄位 ===== */
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

/* ===== 註冊按鈕：控制立即註冊送出按鈕 ===== */
.register-submit {
  min-height: 3.25rem;
  margin-top: 0.5rem;
  border: 2px solid #d9b26f;
  border-radius: 999px;
  color: #ffffff;
  background: linear-gradient(135deg, #2e4a62 0%, #1f3548 100%);
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: 0.2s ease;
}

/* ===== 註冊按鈕 hover：控制按鈕互動效果 ===== */
.register-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(31, 53, 72, 0.24);
}

/* ===== Modal 底部：控制立即登入文字排列 ===== */
.register-modal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

/* ===== 底部提示文字：控制已經有帳號文字 ===== */
.footer-text {
  color: #6f7a80;
  font-size: 0.95rem;
  font-weight: 700;
}

/* ===== 底部文字連結：控制立即登入按鈕 ===== */
.text-link {
  border: none;
  color: #b98b42;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
}

/* ===== 底部文字連結 hover：控制互動效果 ===== */
.text-link:hover {
  color: #2e4a62;
  text-decoration: underline;
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

/* ===== 平板以上：控制 Modal 尺寸、內距與表單欄位排列 ===== */
@media (min-width: 48em) {
  .register-modal {
    width: min(100%, 38rem);
    padding: 2.5rem 3rem;
  }

  /* ===== 平板以上表單列：控制姓名與手機號碼左右排列 ===== */
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}

/* ===== 電腦版 Modal：移除滾輪並控制表單高度 ===== */
@media (min-width: 64em) {
  .register-modal {
    max-height: none;
    overflow-y: visible;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}
</style>
