<template>
  <!-- ===== 忘記密碼 Modal 遮罩：控制背景半透明與點擊空白處關閉 ===== -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="forgot-modal-backdrop"
        @click.self="closeModal"
      >
        <!-- ===== 忘記密碼 Modal 主體：控制忘記密碼與寄送成功畫面 ===== -->
        <section
          class="forgot-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-modal-title"
        >
          <!-- ===== Modal 關閉按鈕：控制右上角關閉 ===== -->
          <button
            type="button"
            class="forgot-modal-close"
            aria-label="關閉忘記密碼視窗"
            @click="closeModal"
          >
            ×
          </button>

          <!-- ===== 狀態一：輸入電子郵件畫面 ===== -->
          <template v-if="!isSent">
            <!-- ===== Modal 標題區：控制忘記密碼標題與說明文字 ===== -->
            <header class="forgot-modal-header">
              <p class="forgot-modal-eyebrow">Reset Password</p>

              <h2 id="forgot-modal-title" class="forgot-modal-title">
                忘記密碼
              </h2>

              <p class="forgot-modal-desc">
                請輸入註冊時使用的電子郵件，我們會寄送密碼重置連結給你。
              </p>
            </header>

            <!-- ===== 忘記密碼表單：控制電子郵件輸入與送出 ===== -->
            <form class="forgot-form" @submit.prevent="handleSubmit">
              <!-- ===== 電子郵件欄位：控制使用者輸入 Email ===== -->
              <div class="form-group">
                <label for="forgot-email" class="form-label">
                  電子郵件
                </label>

                <input
                  id="forgot-email"
                  v-model.trim="form.email"
                  type="email"
                  class="form-control"
                  placeholder="請輸入電子郵件"
                  autocomplete="email"
                  required
                />
              </div>

              <!-- ===== 寄送按鈕：控制送出重置密碼連結 ===== -->
              <button type="submit" class="forgot-submit">
                寄送重置連結
              </button>
            </form>

            <!-- ===== Modal 底部連結：控制返回登入流程 ===== -->
            <footer class="forgot-modal-footer">
              <button
                type="button"
                class="text-link"
                @click="emitLogin"
              >
                返回登入
              </button>
            </footer>
          </template>

          <!-- ===== 狀態二：信件已寄送畫面 ===== -->
          <template v-else>
            <!-- ===== 寄送成功圖示：控制成功狀態視覺 ===== -->
            <div class="sent-icon" aria-hidden="true">
              ✓
            </div>

            <!-- ===== 寄送成功內容：控制信件已寄送說明 ===== -->
            <header class="forgot-modal-header">
              <p class="forgot-modal-eyebrow">Email Sent</p>

              <h2 class="forgot-modal-title">
                信件已寄送
              </h2>

              <p class="forgot-modal-desc">
                重置連結已發送至：
              </p>

              <p class="sent-email">
                {{ form.email }}
              </p>

              <div class="sent-message">
                <p>
                  請至信箱查收，並於
                  <strong>30 分鐘內</strong>
                  點擊連結完成密碼重置。
                </p>

                <p>
                  若未收到信件，請檢查垃圾郵件資料夾。
                </p>
              </div>
            </header>

            <!-- ===== 寄送成功操作區：控制重新寄送與返回登入 ===== -->
            <div class="sent-actions">
              <button
                type="button"
                class="forgot-submit"
                @click="handleResend"
              >
                重新寄送
              </button>

              <button
                type="button"
                class="forgot-login-button"
                @click="emitLogin"
              >
                返回登入
              </button>
            </div>
          </template>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

/* ===== 忘記密碼資料型別：控制父層收到的資料格式 ===== */
interface ForgotPasswordPayload {
  email: string
}

/* ===== Props：控制 Modal 是否開啟 ===== */
const props = defineProps<{
  modelValue: boolean
}>()

/* ===== Emits：通知父層關閉、送出重置密碼、切換登入 ===== */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: ForgotPasswordPayload]
  login: []
}>()

/* ===== 表單資料：控制電子郵件輸入內容 ===== */
const form = reactive<ForgotPasswordPayload>({
  email: '',
})

/* ===== 寄送狀態：控制是否顯示信件已寄送畫面 ===== */
const isSent = ref(false)

/* ===== 關閉 Modal：通知父層把 v-model 改成 false ===== */
const closeModal = () => {
  emit('update:modelValue', false)
}

/* ===== 送出忘記密碼：把電子郵件傳給父層，並切換成功畫面 ===== */
const handleSubmit = () => {
  emit('submit', {
    email: form.email,
  })

  // ===== 畫面切換：送出後顯示信件已寄送畫面 =====
  isSent.value = true
}

/* ===== 重新寄送：使用同一個 Email 再次送出 ===== */
const handleResend = () => {
  emit('submit', {
    email: form.email,
  })
}

/* ===== 返回登入：通知父層切換成 LoginModal ===== */
const emitLogin = () => {
  emit('login')
}

/* ===== Modal 重開時重置狀態：避免下次打開還停在寄送成功畫面 ===== */
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      isSent.value = false
    }
  }
)
</script>

<style scoped>
/* ===== Modal 背景遮罩：控制整個畫面半透明背景 ===== */
.forgot-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  background-color: rgba(15, 37, 56, 0.55);
  backdrop-filter: blur(0.35rem);
}

/* ===== Modal 主體：控制忘記密碼視窗外觀 ===== */
.forgot-modal {
  position: relative;
  width: min(100%, 28rem);
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
.forgot-modal-close {
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
.forgot-modal-close:hover {
  color: #ffffff;
  background-color: #2e4a62;
}

/* ===== Modal 標題區：控制標題與說明間距 ===== */
.forgot-modal-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

/* ===== Modal 小標：控制英文小標樣式 ===== */
.forgot-modal-eyebrow {
  color: #d9b26f;
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

/* ===== Modal 主標題：控制忘記密碼與信件已寄送標題 ===== */
.forgot-modal-title {
  color: #2e4a62;
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.25;
  margin-bottom: 0.75rem;
}

/* ===== Modal 描述文字：控制說明內容 ===== */
.forgot-modal-desc {
  color: #6f7a80;
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}

/* ===== 表單區塊：控制欄位垂直排列 ===== */
.forgot-form {
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

/* ===== 表單輸入框：控制電子郵件輸入框 ===== */
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

/* ===== 寄送按鈕：控制重置連結送出與重新寄送按鈕 ===== */
.forgot-submit {
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

/* ===== 寄送按鈕 hover：控制按鈕互動效果 ===== */
.forgot-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(31, 53, 72, 0.24);
}

/* ===== Modal 底部：控制返回登入排列 ===== */
.forgot-modal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
}

/* ===== 底部文字連結：控制返回登入按鈕 ===== */
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

/* ===== 寄送成功圖示：控制成功勾勾樣式 ===== */
.sent-icon {
  width: 4.5rem;
  height: 4.5rem;
  display: grid;
  place-items: center;
  margin: 0 auto 1.25rem;
  color: #ffffff;
  background:
    linear-gradient(
      135deg,
      #2e4a62 0%,
      #1f3548 100%
    );
  border: 2px solid #d9b26f;
  border-radius: 999px;
  font-size: 2rem;
  font-weight: 900;
  box-shadow: 0 14px 32px rgba(31, 53, 72, 0.18);
}

/* ===== 寄送 Email：控制顯示重置連結寄送到哪個信箱 ===== */
.sent-email {
  width: fit-content;
  max-width: 100%;
  margin: 0.75rem auto 1.25rem;
  padding: 0.65rem 1rem;
  color: #2e4a62;
  background-color: #fffaf0;
  border: 1px solid rgba(217, 178, 111, 0.55);
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 900;
  word-break: break-all;
}

/* ===== 寄送說明文字：控制 30 分鐘與垃圾郵件提醒 ===== */
.sent-message {
  display: grid;
  gap: 0.65rem;
  color: #6f7a80;
  font-size: 0.95rem;
  line-height: 1.75;
}

/* ===== 寄送說明重點：控制 30 分鐘強調文字 ===== */
.sent-message strong {
  color: #2e4a62;
}

/* ===== 寄送成功操作區：控制重新寄送與返回登入排列 ===== */
.sent-actions {
  display: grid;
  gap: 0.85rem;
}

/* ===== 返回登入按鈕：控制寄送成功畫面的次要按鈕 ===== */
.forgot-login-button {
  min-height: 3.1rem;
  border: 1px solid rgba(217, 178, 111, 0.65);
  border-radius: 999px;
  color: #2e4a62;
  background-color: rgba(255, 255, 255, 0.82);
  font-size: 1rem;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
}

/* ===== 返回登入按鈕 hover：控制互動效果 ===== */
.forgot-login-button:hover {
  background-color: #fffaf0;
  transform: translateY(-2px);
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
  .forgot-modal {
    width: min(100%, 30rem);
    padding: 2.5rem;
  }
}
</style>