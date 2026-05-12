<template>
  <!-- ===== Header 區塊：控制整個網站上方導覽列 ===== -->
  <header class="app-header">
    <!-- ===== Navbar 區塊：控制導覽列結構 ===== -->
    <nav class="navbar" aria-label="主導覽">
      <div class="navbar-inner">
        <!-- ===== Logo 區塊：控制網站品牌名稱 ===== -->
        <NuxtLink to="/#home" class="logo" aria-label="PetCare System 首頁">
          <span class="logo-icon">🐾</span>
          <span class="logo-text">PetCare System</span>
        </NuxtLink>

        <!-- ===== 手機選單按鈕：控制手機版導覽列開關 ===== -->
        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="isMobileMenuOpen"
          aria-label="切換導覽選單"
          @click="toggleMobileMenu"
        >
          <span class="hamburger"></span>
          <span class="hamburger"></span>
          <span class="hamburger"></span>
        </button>

        <!-- ===== 導覽選單：控制首頁、功能介紹、價格方案、登入 ===== -->
        <ul
          class="nav-menu"
          :class="{ 'is-open': isMobileMenuOpen }"
          role="list"
        >
          <li>
            <NuxtLink to="/#home" class="nav-link" @click="closeMobileMenu">
              首頁
            </NuxtLink>
          </li>

          <li>
            <NuxtLink to="/#features" class="nav-link" @click="closeMobileMenu">
              功能介紹
            </NuxtLink>
          </li>

          <li>
           
            <!-- ===== 價格方案連結：導向獨立 price.vue 頁面 ===== -->
<NuxtLink
  to="/price"
  class="nav-link nav-link--cta"
  @click="closeMobileMenu"
>
  價格方案
</NuxtLink>
          </li>

          <!-- ===== 登入按鈕：未登入時顯示 ===== -->
          <li v-if="!isLoggedIn">
            <button
              type="button"
              class="nav-link nav-link--login"
              @click="openLoginModal"
            >
              登入
            </button>
          </li>

          <!-- ===== 會員選單：已登入時顯示 ===== -->
          <li v-else class="user-menu-wrapper">
            <button
              type="button"
              class="user-menu-toggle"
              :aria-expanded="isUserMenuOpen"
              aria-label="會員選單"
              @click="toggleUserMenu"
            >
              <span class="user-icon">👤</span>
              <span class="user-name">{{ userInfo?.Name || "會員" }}</span>
              <span class="dropdown-arrow">▼</span>
            </button>

            <!-- ===== 下拉選單 ===== -->
            <div v-show="isUserMenuOpen" class="user-dropdown">
              <NuxtLink
                to="/member"
                class="dropdown-item"
                @click="closeMobileMenu(); isUserMenuOpen = false"
              >
                <span class="dropdown-icon">🏠</span>
                會員中心
              </NuxtLink>
              <button
                type="button"
                class="dropdown-item"
                @click="handleLogout"
              >
                <span class="dropdown-icon">🚪</span>
                登出
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>

    <!-- ===== 登入 Modal：控制會員登入視窗 ===== -->
    <LoginModal
      v-model="isLoginModalOpen"
      :prefill-account="prefillAccount"
      @forgot-password="openForgotModal"
      @register="openRegisterModal"
      @login-success="handleLoginSuccess"
    />

    <!-- ===== 註冊 Modal：控制會員註冊視窗 ===== -->
    <RegisterModal
      v-model="isRegisterModalOpen"
      @login="openLoginModalFromRegister"
    />

    <!-- ===== 忘記密碼 Modal：控制密碼重置連結寄送視窗 ===== -->
    <ForgotModal
      v-model="isForgotModalOpen"
      @login="openLoginModal"
    />
  </header>
</template>

<script setup lang="ts">
// ===== Vue 功能引入：控制響應式狀態 =====
import { ref, onMounted } from "vue";

// ===== LoginModal 元件引入：控制登入彈窗 =====
import LoginModal from "~/components/LoginModal.vue";

// ===== RegisterModal 元件引入：控制註冊彈窗 =====
import RegisterModal from "~/components/RegisterModal.vue";

import ForgotModal from "~/components/ForgotModal.vue";

// ===== API 引入：控制登入狀態檢查與登出 =====
import { authAPI } from "~/composables/utils/api";

// ===== 手機選單狀態：控制選單是否開啟 =====
const isMobileMenuOpen = ref(false);

// ===== 登入 Modal 狀態：控制登入彈窗是否開啟 =====
const isLoginModalOpen = ref(false);

// ===== 註冊 Modal 狀態：控制註冊彈窗是否開啟 =====
const isRegisterModalOpen = ref(false);

// ===== 忘記密碼 Modal 狀態：控制忘記密碼彈窗是否開啟 =====
const isForgotModalOpen = ref(false);

// ===== 預填充帳號：控制從註冊跳轉到登入時自動填入帳號 =====
const prefillAccount = ref<string | undefined>(undefined);

// ===== 登入狀態：控制是否已登入 =====
const isLoggedIn = ref(false);

// ===== 會員資訊：控制已登入會員資料 =====
const userInfo = ref<{
  Email: string;
  Name: string;
  Phone: string;
  IsEmailConfirmed: boolean;
} | null>(null);

// ===== 會員選單狀態：控制下拉選單是否開啟 =====
const isUserMenuOpen = ref(false);

// ===== 檢查登入狀態：元件載入時執行 =====
async function checkLoginStatus() {
  const result = await authAPI.checkLoginStatus();
  if (result.success && result.isLogin) {
    isLoggedIn.value = true;
    userInfo.value = result.user;
  } else {
    isLoggedIn.value = false;
    userInfo.value = null;
  }
}

// ===== 元件載入：檢查登入狀態 =====
onMounted(() => {
  checkLoginStatus();
});

// ===== 切換手機選單：控制漢堡選單開關 =====
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

// ===== 關閉手機選單：點擊選單後自動收合 =====
function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

// ===== 切換會員選單：控制會員下拉選單開關 =====
function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value;
}

// ===== 開啟登入 Modal：控制點擊登入按鈕或從其他 Modal 切回登入 =====
function openLoginModal() {
  closeMobileMenu();

  // ===== Modal 切換：開啟登入前，先關閉註冊與忘記密碼 =====
  isRegisterModalOpen.value = false;
  isForgotModalOpen.value = false;
  
  // ===== 清空預填充帳號：一般登入不需要預填 =====
  prefillAccount.value = undefined;
  
  isLoginModalOpen.value = true;
}

// ===== 從註冊跳轉到登入：控制註冊成功後自動填入帳號 =====
function openLoginModalFromRegister(account?: string) {
  closeMobileMenu();

  // ===== Modal 切換：開啟登入前，先關閉註冊 =====
  isRegisterModalOpen.value = false;
  
  // ===== 設定預填充帳號：讓登入 Modal 自動填入剛註冊的帳號 =====
  prefillAccount.value = account;
  
  isLoginModalOpen.value = true;
}

// ===== 開啟註冊 Modal：控制從登入切到註冊 =====
function openRegisterModal() {
  closeMobileMenu();

  // ===== Modal 切換：開啟註冊前，先關閉登入 =====
  isLoginModalOpen.value = false;
  isRegisterModalOpen.value = true;
}

// ===== 開啟忘記密碼 Modal：控制從登入切到忘記密碼 =====
function openForgotModal() {
  closeMobileMenu();

  // ===== Modal 切換：開啟忘記密碼前，先關閉登入與註冊 =====
  isLoginModalOpen.value = false;
  isRegisterModalOpen.value = false;
  isForgotModalOpen.value = true;
}

// ===== 登出處理：執行登出並刷新狀態 =====
async function handleLogout() {
  await authAPI.logout();
  
  // 清除前端狀態
  isLoggedIn.value = false;
  userInfo.value = null;
  isUserMenuOpen.value = false;
  
  // 刷新頁面回首頁
  window.location.href = "/";
}

// ===== 登入成功處理：重新檢查登入狀態 =====
function handleLoginSuccess() {
  checkLoginStatus();
}
</script>

<style scoped>
/* ===== Header 色系設定：控制 AppHeader 使用深藍精品底色 ===== */
.app-header {
  --color-primary: #17334a;
  --color-primary-dark: #0f2538;
  --color-accent: #d9b26f;
  --color-text: #ffffff;
  --color-muted: rgba(255, 255, 255, 0.78);
  --color-border: rgba(217, 178, 111, 0.28);

  background: linear-gradient(135deg, #10283c 0%, #17334a 48%, #0f2538 100%);
  box-shadow: 0 4px 18px rgba(15, 37, 56, 0.22);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--color-border);
}

/* ===== Navbar 外層：控制導覽列上下間距 ===== */
.navbar {
  padding: 1rem 0;
}

/* ===== Navbar 內容：控制 Logo 與選單左右排列 ===== */
.navbar-inner {
  max-width: 75rem;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ===== Logo：控制品牌連結排列 ===== */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
  text-decoration: none;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

/* ===== Logo 滑過：控制滑鼠移入效果 ===== */
.logo:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* ===== Logo 圖示：控制左側寵物圖示大小與金色質感 ===== */
.logo-icon {
  font-size: 1.35rem;
  line-height: 1;
  filter: sepia(1) saturate(1.4) hue-rotate(350deg) brightness(1.1)
    drop-shadow(0 4px 8px rgba(217, 178, 111, 0.28));
}

/* ===== Logo 文字：控制品牌名稱樣式 ===== */
.logo-text {
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: var(--color-text);
}

/* ===== 漢堡選單按鈕：控制手機版按鈕外觀 ===== */
.menu-toggle {
  display: none;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--color-border);
  cursor: pointer;
  gap: 0.35rem;
  padding: 0.55rem;
  border-radius: 0.85rem;
}

/* ===== 漢堡選單聚焦：控制鍵盤操作外框 ===== */
.menu-toggle:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* ===== 漢堡線條：控制三條線外觀 ===== */
.hamburger {
  width: 1.5rem;
  height: 0.18rem;
  background-color: var(--color-accent);
  display: block;
  transition: all 0.3s ease;
  border-radius: 999px;
}

/* ===== 導覽選單：控制桌機版選單排列 ===== */
.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  align-items: center;
  padding: 0;
  margin: 0;
}

/* ===== 導覽連結：控制一般選單文字 ===== */
.nav-link {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-muted);
  text-decoration: none;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
  position: relative;
}

/* ===== button 導覽連結：清除 button 預設外觀 ===== */
button.nav-link {
  font-family: inherit;
  border: none;
  cursor: pointer;
}

/* ===== 導覽連結滑過：控制滑鼠移入文字色 ===== */
.nav-link:hover {
  color: var(--color-text);
}

/* ===== 導覽底線：控制選單 hover 底線 ===== */
.nav-link::after {
  content: "";
  position: absolute;
  bottom: -0.45rem;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-accent);
  transition: width 0.2s ease;
}

/* ===== 導覽底線顯示：控制 hover 與 focus 效果 ===== */
.nav-link:hover::after,
.nav-link:focus-visible::after {
  width: 100%;
}

/* ===== CTA 連結：控制價格方案按鈕樣式 ===== */
.nav-link--cta {
  color: var(--color-primary-dark);
  background-color: var(--color-accent);
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 10px 24px rgba(217, 178, 111, 0.2);
}

/* ===== CTA 滑過：控制價格方案按鈕互動 ===== */
.nav-link--cta:hover,
.nav-link--cta:focus-visible {
  color: var(--color-primary-dark);
  background-color: #e7c98d;
  transform: translateY(-2px);
}

/* ===== CTA 底線移除：避免按鈕出現底線 ===== */
.nav-link--cta::after {
  display: none;
}

/* ===== 登入按鈕：控制價格方案右側的登入按鈕 ===== */
.nav-link--login {
  color: var(--color-accent);
  background-color: transparent;
  padding: 0.6rem 1rem;
  border: 1px solid rgba(217, 178, 111, 0.5) !important;
  border-radius: 999px;
  box-shadow: none;
}

/* ===== 登入按鈕滑過：控制登入按鈕互動效果 ===== */
.nav-link--login:hover,
.nav-link--login:focus-visible {
  color: var(--color-primary-dark);
  background-color: var(--color-accent);
  transform: translateY(-2px);
}

/* ===== 登入按鈕底線移除：避免 button 出現導覽底線 ===== */
.nav-link--login::after {
  display: none;
}

/* ===== 會員選單容器：控制下拉選單定位 ===== */
.user-menu-wrapper {
  position: relative;
}

/* ===== 會員選單按鈕：控制會員名稱顯示 ===== */
.user-menu-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
  background-color: transparent;
  padding: 0.6rem 1rem;
  border: 1px solid rgba(217, 178, 111, 0.5);
  border-radius: 999px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

/* ===== 會員選單按鈕滑過：控制 hover 效果 ===== */
.user-menu-toggle:hover,
.user-menu-toggle:focus-visible {
  background-color: rgba(217, 178, 111, 0.1);
  transform: translateY(-2px);
}

/* ===== 會員圖示：控制圖示樣式 ===== */
.user-icon {
  font-size: 1.2rem;
  line-height: 1;
}

/* ===== 會員名稱：控制文字樣式 ===== */
.user-name {
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== 下拉箭頭：控制箭頭樣式 ===== */
.dropdown-arrow {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

/* ===== 下拉箭頭旋轉：控制選單開啟時箭頭方向 ===== */
.user-menu-toggle[aria-expanded="true"] .dropdown-arrow {
  transform: rotate(180deg);
}

/* ===== 下拉選單：控制選單外觀 ===== */
.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 10rem;
  background: linear-gradient(135deg, #10283c 0%, #17334a 48%, #0f2538 100%);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  box-shadow: 0 12px 32px rgba(15, 37, 56, 0.35);
  overflow: hidden;
  z-index: 1000;
}

/* ===== 下拉選單項目：控制選單內容樣式 ===== */
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.85rem 1.25rem;
  color: var(--color-muted);
  background-color: transparent;
  border: none;
  border-bottom: 1px solid rgba(217, 178, 111, 0.15);
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

/* ===== 下拉選單項目最後一個：移除下邊框 ===== */
.dropdown-item:last-child {
  border-bottom: none;
}

/* ===== 下拉選單項目滑過：控制 hover 效果 ===== */
.dropdown-item:hover,
.dropdown-item:focus-visible {
  background-color: rgba(217, 178, 111, 0.12);
  color: var(--color-text);
}

/* ===== 下拉選單圖示：控制圖示樣式 ===== */
.dropdown-icon {
  font-size: 1.1rem;
  line-height: 1;
}

/* ===== 平板以上：控制左右內距 ===== */
@media (min-width: 48em) {
  .navbar-inner {
    padding: 0 2rem;
  }

  .nav-menu {
    gap: 2.5rem;
  }
}

/* ===== 桌機以上：控制桌機左右內距 ===== */
@media (min-width: 64em) {
  .navbar-inner {
    padding: 0 3rem;
  }

  .nav-menu {
    gap: 3rem;
  }
}

/* ===== 手機版：控制小螢幕導覽列 ===== */
@media (max-width: 47.9em) {
  .menu-toggle {
    display: flex;
  }

  .nav-menu {
    position: absolute;
    top: 100%;
    left: 1rem;
    right: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    background: linear-gradient(135deg, #10283c 0%, #17334a 48%, #0f2538 100%);
    border: 1px solid var(--color-border);
    border-radius: 1.25rem;
    box-shadow: 0 18px 42px rgba(15, 37, 56, 0.28);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .nav-menu.is-open {
    max-height: 24rem;
  }

  .nav-menu li {
    width: 100%;
    border-bottom: 1px solid rgba(217, 178, 111, 0.22);
  }

  .nav-menu li:last-child {
    border-bottom: none;
  }

  .nav-link {
    display: block;
    width: 100%;
    padding: 1rem 1.25rem;
    color: var(--color-muted);
  }

  .nav-link:hover {
    color: var(--color-text);
  }

  .nav-link::after {
    display: none;
  }

  .nav-link--cta,
  .nav-link--login {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;
    margin: 1rem 1.25rem;
    padding: 0.75rem 1.25rem;
  }

  .nav-link--cta {
    color: var(--color-primary-dark);
  }

  .nav-link--login {
    color: var(--color-accent);
  }

  .nav-link--login:hover,
  .nav-link--login:focus-visible {
    color: var(--color-primary-dark);
  }

  /* ===== 會員選單容器：手機版調整 ===== */
  .user-menu-wrapper {
    width: 100%;
  }

  /* ===== 會員選單按鈕：手機版全寬 ===== */
  .user-menu-toggle {
    width: auto;
    margin: 1rem 1.25rem;
    justify-content: center;
  }

  /* ===== 下拉選單：手機版調整 ===== */
  .user-dropdown {
    position: static;
    width: calc(100% - 2.5rem);
    margin: 0 1.25rem 1rem;
    border-radius: 0.75rem;
  }

  /* ===== 下拉選單項目：手機版調整 ===== */
  .dropdown-item {
    padding: 0.75rem 1rem;
  }
}
</style>
