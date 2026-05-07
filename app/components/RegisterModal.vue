<template>
  <!-- ===== 註冊 Modal 遮罩：控制背景半透明與點擊空白處關閉 ===== -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="register-modal-backdrop"
        @click.self="closeModal"
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

          <!-- ===== 註冊表單：控制姓名、手機、Email、密碼與確認密碼 ===== -->
          <form class="register-form" @submit.prevent="handleSubmit">
            <!-- ===== 第一列欄位：控制姓名與手機號碼同一行 ===== -->
            <div class="form-row">
              <!-- ===== 姓名欄位：控制使用者輸入姓名 ===== -->
              <div class="form-group">
                <label for="register-name" class="form-label"> 姓名 </label>

                <input
                  id="register-name"
                  v-model.trim="form.name"
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
                v-model="form.confirmPassword"
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

/* ===== 註冊資料型別：控制父層收到的註冊資料格式 ===== */
interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/* ===== Props：控制 Modal 是否開啟 ===== */
defineProps<{
  modelValue: boolean;
}>();

/* ===== Emits：通知父層關閉、註冊、切換登入 ===== */
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  register: [payload: RegisterPayload];
  login: [];
}>();

/* ===== 表單資料：控制註冊欄位輸入內容 ===== */
const form = reactive<RegisterPayload>({
  name: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
});

/* ===== 關閉 Modal：通知父層把 v-model 改成 false ===== */
const closeModal = () => {
  emit("update:modelValue", false);
};

/* ===== 送出註冊：檢查密碼一致後，把資料傳給父層處理 ===== */
const handleSubmit = async () => {
  // ===== 密碼一致性檢查：避免使用者兩次密碼輸入不同 =====
  if (form.password !== form.confirmPassword) {
    await Swal.fire({
      icon: "warning",
      title: "密碼不一致",
      text: "請確認密碼與確認密碼是否相同。",
      confirmButtonText: "確定",
      confirmButtonColor: "#2e4a62",
    });

    return;
  }

  // ===== 註冊資料送出：把表單資料傳給父層處理 API =====
  emit("register", {
    name: form.name,
    phone: form.phone,
    email: form.email,
    password: form.password,
    confirmPassword: form.confirmPassword,
  });
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
