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
import { reactive, ref } from "vue";
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

const confirmPassword = ref("");

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
  if (form.password !== confirmPassword.value) {
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
      confirmPassword.value = "";

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
  padding: 1rem;
  background:
    radial-gradient(circle at 20% 10%, rgba(217, 178, 111, 0.16), transparent 22rem),
    rgba(15, 37, 56, 0.58);
  backdrop-filter: blur(0.45rem);
}

/* ===== Modal 主體：控制註冊視窗大小與外觀 ===== */
.register-modal {
  position: relative;
  width: min(100%, 30rem);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  padding: 2.1rem 1.15rem 1.5rem;
  border: 1px solid rgba(230, 216, 189, 0.92);
  border-radius: 1.45rem;
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
}

/* ===== 自訂滾輪：手機高度不足時保持乾淨 ===== */
.register-modal::-webkit-scrollbar {
  width: 0;
}

/* ===== 關閉按鈕：控制右上角 X 按鈕 ===== */
.register-modal-close {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  z-index: 3;
  width: 2.35rem;
  height: 2.35rem;
  border: none;
  border-radius: 999px;
  color: #b98b42;
  background-color: rgba(255, 250, 240, 0.92);
  font-size: 1.35rem;
  line-height: 1;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease;
}

/* ===== 關閉按鈕 hover：控制互動效果 ===== */
.register-modal-close:hover {
  color: #10283a;
  background-color: rgba(217, 178, 111, 0.18);
  transform: rotate(90deg);
}

/* ===== Modal 標題區：壓縮標題與表單距離 ===== */
.register-modal-header {
  text-align: center;
  margin-bottom: 0.85rem;
}

/* ===== Modal 小標：壓縮 CREATE ACCOUNT 高度 ===== */
.register-modal-eyebrow {
  color: #d9b26f;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 0.45rem;
}

/* ===== Modal 主標題：縮小註冊帳號字體與下方距離 ===== */
.register-modal-title {
  color: #10283a;
  font-size: clamp(1.7rem, 6vw, 2.25rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: 0.05em;
  margin-bottom: 0.35rem;
}

/* ===== Modal 描述文字：縮小說明文字高度 ===== */
.register-modal-desc {
  color: #6f7a80;
  font-size: 0.82rem;
  font-weight: 400;
  line-height: 1.45;
  margin: 0;
}

/* ===== 表單區塊：縮小每個欄位之間的距離 ===== */
.register-form {
  display: grid;
  gap: 0.55rem;
}

/* ===== 表單列：縮小姓名與手機欄位間距 ===== */
.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.55rem;
}

/* ===== 表單群組：縮小 label 與輸入框距離 ===== */
.form-group {
  display: grid;
  gap: 0.25rem;
}

/* ===== 表單標籤：縮小欄位名稱高度 ===== */
.form-label {
  color: #263238;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

/* ===== 表單輸入框：縮小輸入框高度，讓電腦版不需要滾動 ===== */
.form-control {
  width: 100%;
  min-height: 2.45rem;
  padding: 0 0.8rem;
  border: 1.5px solid rgba(217, 178, 111, 0.62);
  border-radius: 0.48rem;
  color: #263238;
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 0.86rem;
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
  box-shadow: 0 0 0 4px rgba(217, 178, 111, 0.14);
}

/* ===== 註冊按鈕：縮小按鈕高度與上方距離 ===== */
.register-submit {
  min-height: 2.75rem;
  margin-top: 0.1rem;
  border: none;
  border-radius: 0.58rem;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      #10283a 0%,
      #0b2233 100%
    );
  box-shadow: 0 12px 24px rgba(15, 37, 56, 0.18);
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

/* ===== 註冊按鈕 hover：控制按鈕互動效果 ===== */
.register-submit:hover {
  transform: translateY(-2px);
  filter: brightness(1.04);
  box-shadow: 0 18px 38px rgba(15, 37, 56, 0.26);
}

/* ===== Modal 底部：縮小立即登入區塊高度 ===== */
.register-modal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

/* ===== 底部提示文字：控制已經有帳號文字 ===== */
.footer-text {
  color: #263238;
  font-size: 0.86rem;
  font-weight: 500;
}

.text-link {
  border: none;
  color: #10283a;
  background: transparent;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

/* ===== 底部文字連結 hover：控制互動效果 ===== */
.text-link:hover {
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

/* ===== 小手機：控制視窗更緊湊 ===== */
@media (max-width: 30em) {
  .register-modal {
    width: min(100%, 25rem);
    padding: 2rem 1rem 1.4rem;
    border-radius: 1.35rem;
  }

  .register-modal-title {
    font-size: 2rem;
    letter-spacing: 0.05em;
  }

  .register-modal-desc {
    font-size: 0.88rem;
  }

  .register-form {
    gap: 0.78rem;
  }

  .form-control {
    min-height: 2.85rem;
  }
}

/* ===== 平板以上：控制姓名與手機同一行，並縮小電腦版視窗 ===== */
@media (min-width: 48em) {
   .register-modal {
    width: min(100%, 31rem);
    padding: 1.75rem 2rem 1.35rem;
    border-radius: 1.55rem;
  }

  .form-row {
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem;
  }
}

/* ===== 電腦版：避免視窗過大，但保留可滾動防止小高度被切掉 ===== */
@media (min-width: 64em) {
    .register-modal {
    width: min(100%, 31rem);
    max-height: calc(100vh - 1.5rem);
    overflow-y: visible;
    padding: 1.55rem 2rem 1.35rem;
  }
}
</style>
