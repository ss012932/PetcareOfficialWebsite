<template>
  <!-- ===== Header 區塊：控制整個網站上方導覽列 ===== -->
  <header class="app-header">
    <!-- ===== Navbar 區塊：控制導覽列結構 ===== -->
    <nav class="navbar" :aria-label="t('header.aria.mainNav')">
      <div class="navbar-inner">
        <!-- ===== Logo 區塊：控制網站品牌名稱 ===== -->
        <NuxtLink to="/" class="logo" :aria-label="t('header.aria.home')">
          <span class="logo-mark" aria-hidden="true">
            <Icon name="fa6-solid:paw" class="logo-icon" />
          </span>

          <span class="logo-text-group">
            <span class="logo-text logo-text--zh">{{ t("header.brand.zh") }}</span>
            <span class="logo-text logo-text--en">{{ t("header.brand.en") }}</span>
          </span>
        </NuxtLink>

        <!-- ===== 手機選單按鈕：控制手機版導覽列開關 ===== -->
        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="isMobileMenuOpen"
          :aria-label="t('header.aria.toggleMenu')"
          @click="toggleMobileMenu"
        >
          <Icon
            name="fa6-solid:bars"
            class="hamburger-icon"
            aria-hidden="true"
          />
        </button>

        <!-- ===== 導覽選單：控制首頁、功能介紹、價格方案、登入 ===== -->
        <ul
          class="nav-menu"
          :class="{ 'is-open': isMobileMenuOpen }"
          role="list"
        >
          <li>
            <NuxtLink to="/" class="nav-link" @click="closeMobileMenu">
              {{ t("header.nav.home") }}
            </NuxtLink>
          </li>

          <li>
            <!-- ===== 功能介紹連結：導向獨立功能介紹頁 ===== -->
            <NuxtLink to="/function" class="nav-link" @click="closeMobileMenu">
              {{ t("header.nav.features") }}
            </NuxtLink>
          </li>

          <li>
            <!-- ===== 價格方案連結：導向獨立 price.vue 頁面 ===== -->
            <NuxtLink to="/price" class="nav-link" @click="closeMobileMenu">
              {{ t("header.nav.pricing") }}
            </NuxtLink>
          </li>

          <li class="locale-switcher">
            <label for="header-locale" class="sr-only">{{ t("header.locale.label") }}</label>
            <select
              id="header-locale"
              class="locale-select"
              :value="locale"
              @change="handleLocaleChange"
            >
              <option
                v-for="item in localeOptions"
                :key="item.code"
                :value="item.code"
              >
                {{ item.name }}
              </option>
            </select>
          </li>

          <!-- ===== 登入按鈕：未登入時顯示 ===== -->
          <li v-if="!isLoggedIn">
            <button
              type="button"
              class="nav-link nav-link--login"
              @click="openLoginModal"
            >
              {{ t("header.nav.login") }}
            </button>
          </li>

          <!-- ===== 會員選單：已登入時顯示 ===== -->
          <li v-else class="user-menu-wrapper">
            <button
              type="button"
              class="user-menu-toggle"
              :aria-expanded="isUserMenuOpen"
              :aria-label="t('header.aria.userMenu')"
              @click="toggleUserMenu"
            >
              <Icon
                name="fa6-solid:user"
                class="user-icon"
                aria-hidden="true"
              />
              <span class="user-name">{{ userInfo?.Name || t("header.user.member") }}</span>
              <Icon
                name="fa6-solid:chevron-down"
                class="dropdown-arrow"
                aria-hidden="true"
              />
            </button>

            <!-- ===== 下拉選單 ===== -->
            <div v-show="isUserMenuOpen" class="user-dropdown">
              <NuxtLink
                to="/member/dashboard"
                class="dropdown-item"
                @click="
                  closeMobileMenu();
                  isUserMenuOpen = false;
                "
              >
                <Icon
                  name="fa6-solid:house"
                  class="dropdown-icon"
                  aria-hidden="true"
                />
                {{ t("header.user.center") }}
              </NuxtLink>
              <button type="button" class="dropdown-item" @click="handleLogout">
                <Icon
                  name="fa6-solid:arrow-right-from-bracket"
                  class="dropdown-icon"
                  aria-hidden="true"
                />
                {{ t("header.user.logout") }}
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
    <ForgotModal v-model="isForgotModalOpen" @login="openLoginModal" />
  </header>
</template>

<script setup lang="ts">
// ===== Vue 功能引入：控制響應式狀態 =====
import { computed, ref, onMounted, watch } from "vue";

// ===== LoginModal 元件引入：控制登入彈窗 =====
import LoginModal from "~/components/LoginModal.vue";

// ===== RegisterModal 元件引入：控制註冊彈窗 =====
import RegisterModal from "~/components/RegisterModal.vue";

import ForgotModal from "~/components/ForgotModal.vue";

// ===== API 引入：控制登入狀態檢查與登出 =====
import { authAPI } from "~/composables/utils/api";

const { t, locale, setLocale } = useI18n();

// ===== 手機選單狀態：控制選單是否開啟 =====
const isMobileMenuOpen = ref(false);

// ===== 登入 Modal 狀態：使用共享 useState，讓任何頁面都能遠端開啟 =====
const { isOpen: isLoginModalOpen } = useLoginModal();

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

// ===== 受保護路由前綴：登入失效時需強制離開的路徑 =====
const PROTECTED_PREFIXES = ["/member", "/order"];
const SUPPORTED_LOCALES = ["zh-TW", "zh-CN", "ja-JP", "ko-KR", "en-US", "th-TH", "vi-VN"] as const;
const SUPPORTED_LOCALE_OPTIONS = [
  { code: "zh-TW", name: "繁體中文" },
  { code: "zh-CN", name: "简体中文" },
  { code: "ja-JP", name: "日本語" },
  { code: "ko-KR", name: "한국어" },
  { code: "en-US", name: "English" },
  { code: "th-TH", name: "ไทย" },
  { code: "vi-VN", name: "Tiếng Việt" },
] as const;

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

const localeOptions = computed(() => SUPPORTED_LOCALE_OPTIONS);

// ===== 檢查登入狀態：元件載入時執行 =====
async function checkLoginStatus() {
  const result = await authAPI.checkLoginStatus();
  if (result.success && result.isLogin) {
    isLoggedIn.value = true;
    userInfo.value = result.user;
  } else {
    isLoggedIn.value = false;
    userInfo.value = null;

    // ===== 若目前在受保護頁面，強制導回首頁並帶出登入視窗 =====
    const isProtected = PROTECTED_PREFIXES.some((prefix) =>
      route.path.startsWith(prefix),
    );
    if (isProtected) {
      await router.replace("/?login=1");
    }
  }
}

// ===== 路由：用於監聽 query 參數變化 =====
const route = useRoute();
const router = useRouter();

// ===== 元件載入：先確認登入狀態，才決定是否自動開啟登入視窗 =====
onMounted(async () => {
  await checkLoginStatus();

  // ===== 已確認未登入且帶有 login=1，才自動開啟登入 Modal =====
  if (route.query.login === "1" && !isLoggedIn.value) {
    openLoginModal();
  }
});

// ===== 監聽路由 query：SPA 切換時也能偵測到 login=1 =====
watch(
  () => route.query.login,
  (val) => {
    if (val === "1" && !isLoggedIn.value) {
      openLoginModal();
    }
  },
);

// ===== 切換手機選單：控制漢堡選單開關 =====
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

// ===== 關閉手機選單：點擊選單後自動收合 =====
function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

function handleLocaleChange(event: Event) {
  const nextLocale = (event.target as HTMLSelectElement).value;
  if (isSupportedLocale(nextLocale) && nextLocale !== locale.value) {
    setLocale(nextLocale as Parameters<typeof setLocale>[0]);
  }
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

// ===== 登入成功處理：重新檢查登入狀態並清除 URL 的 login=1 =====
async function handleLoginSuccess() {
  await checkLoginStatus();

  // ===== 清掉 ?login=1，避免頁面重整再度彈出登入視窗 =====
  if (route.query.login) {
    await router.replace({ query: {} });
  }
}
</script>

<style scoped>
/* ===== Header 色系設定：控制整個導覽列主題 ===== */
.app-header {
  --color-primary: #10283a;
  --color-primary-light: #17334a;
  --color-accent: #d9b26f;
  --color-header-bg: rgba(255, 250, 240, 0.92);
  --color-header-bg-scroll: rgba(255, 250, 240, 0.78);
  --color-text: #10283a;
  --color-muted: rgba(16, 40, 58, 0.72);
  --color-border: rgba(217, 178, 111, 0.22);

  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-header-bg);
  border-bottom: 1px solid rgba(217, 178, 111, 0.16);
  box-shadow: 0 0.75rem 2rem rgba(15, 37, 56, 0.06);
  backdrop-filter: blur(0.9rem);
  -webkit-backdrop-filter: blur(0.9rem);
}

/* ===== Header 霧面效果：瀏覽器支援時讓導覽列有透明霧面感 ===== */
@supports (backdrop-filter: blur(1rem)) {
  .app-header {
    background-color: var(--color-header-bg-scroll);
  }
}

/* ===== Navbar 外層：控制導覽列高度 ===== */
.navbar {
  padding: 0;
}

/* ===== Navbar 內容：桌機版使用三欄，Logo 左、選單中、登入右 ===== */
.navbar-inner {
  position: relative;
  width: min(100% - 3rem, 78rem);
  min-height: 4.75rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1.5rem;
  margin-inline: auto;
}

/* ===== Logo：控制品牌連結排列 ===== */
.logo {
  grid-column: 1;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--color-text);
  text-decoration: none;
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

/* ===== Logo hover：控制品牌滑過效果 ===== */
.logo:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* ===== Logo 外框：控制品牌 Logo 放置區 ===== */
.logo-mark {
  width: 2.15rem;
  height: 2.15rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(217, 178, 111, 0.5);
  border-radius: 0.72rem;
  background-color: rgba(255, 250, 240, 0.9);
}

/* ===== Logo 圖示：控制 logo 區內 icon ===== */
.logo-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-primary);
}

/* ===== Logo 文字群：控制中英文上下排列 ===== */
.logo-text-group {
  display: grid;
  gap: 0.1rem;
  line-height: 1.1;
}

/* ===== Logo 文字：控制品牌字體 ===== */
.logo-text {
  color: var(--color-primary);
  display: block;
  white-space: nowrap;
}

.logo-text--zh {
  font-size: 0.94rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.logo-text--en {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(16, 40, 58, 0.72);
}

/* ===== 手機選單按鈕：桌機版隱藏 ===== */
.menu-toggle {
  display: none;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border: 1px solid rgba(16, 40, 58, 0.16);
  border-radius: 999px;
  color: var(--color-primary);
  background-color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition:
    color 0.22s ease,
    background-color 0.22s ease,
    border-color 0.22s ease;
}

/* ===== 手機選單按鈕 hover：控制互動效果 ===== */
.menu-toggle:hover {
  color: var(--color-primary);
  border-color: rgba(217, 178, 111, 0.55);
  background-color: rgba(255, 250, 240, 0.95);
}

/* ===== 手機選單按鈕聚焦：控制鍵盤操作外框 ===== */
.menu-toggle:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

/* ===== 漢堡 Icon：控制圖示尺寸 ===== */
.hamburger-icon {
  width: 1rem;
  height: 1rem;
}

/* ===== 導覽選單：桌機版讓一般選單保持在正中間 ===== */
.nav-menu {
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

/* ===== 桌機版：把語言與登入 / 會員選單推到右側 ===== */
@media (min-width: 48em) {
  .locale-switcher {
    position: absolute;
    right: 7.1rem;
  }

  .nav-menu > li:has(.nav-link--login),
  .nav-menu > li.user-menu-wrapper {
    position: absolute;
    right: 0;
  }
}

/* ===== 語言切換容器 ===== */
.locale-switcher {
  display: inline-flex;
  align-items: center;
}

/* ===== 語言選單：允許有底框，樣式維持淺色系 ===== */
.locale-select {
  min-height: 2.45rem;
  padding: 0 0.85rem;
  border: 1px solid rgba(217, 178, 111, 0.38);
  border-radius: 0.65rem;
  color: var(--color-muted);
  background-color: rgba(255, 255, 255, 0.58);
  font-size: 0.86rem;
  font-family: inherit;
  cursor: pointer;
  transition:
    color 0.22s ease,
    border-color 0.22s ease,
    background-color 0.22s ease,
    box-shadow 0.22s ease;
}

/* ===== 語言選單 hover / focus：控制互動效果 ===== */
.locale-select:hover,
.locale-select:focus-visible {
  color: var(--color-primary);
  border-color: rgba(217, 178, 111, 0.75);
  background-color: rgba(255, 250, 240, 0.95);
  box-shadow: 0 0.45rem 1.25rem rgba(15, 37, 56, 0.08);
}

/* ===== 無障礙隱藏文字 ===== */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ===== 導覽連結：控制首頁、功能介紹、價格方案樣式 ===== */
.nav-link {
  position: relative;
  min-height: 2.45rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.55rem;
  border: 1px solid transparent;
  border-radius: 999px;
  color: rgba(16, 40, 58, 0.72);
  background-color: transparent;
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 0.22s ease,
    background-color 0.22s ease,
    border-color 0.22s ease,
    transform 0.22s ease;
}

/* ===== button 導覽連結：清除 button 預設外觀 ===== */
button.nav-link {
  font-family: inherit;
}

/* ===== 一般導覽連結 hover：只有文字變深，不加外框 ===== */
.nav-link:hover,
.nav-link:focus-visible {
  color: var(--color-primary);
  background-color: transparent;
  border-color: transparent;
  transform: translateY(-1px);
}

/* ===== 目前所在頁面：不要出現金色膠囊，只保留深色文字 ===== */
.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  color: var(--color-primary);
  background-color: transparent;
  border-color: transparent;
  font-weight: 800;
}

/* ===== 移除舊版底線：避免 hover 出現底線 ===== */
.nav-link::after {
  display: none;
}

/* ===== 登入按鈕：唯一藍色圓角按鈕，文字仍維持登入 ===== */
.nav-link--login {
  min-height: 2.6rem;
  padding: 0 1.25rem;
  color: #ffffff;
  border-color: rgba(16, 40, 58, 0.9);
  background-color: var(--color-primary);
  font-weight: 800;
  box-shadow:
    0 0.75rem 1.6rem rgba(16, 40, 58, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

/* ===== 登入按鈕 hover：維持藍色按鈕感 ===== */
.nav-link--login:hover,
.nav-link--login:focus-visible {
  color: #ffffff;
  background-color: var(--color-primary-light);
  border-color: var(--color-primary-light);
  transform: translateY(-1px);
}

/* ===== 會員選單容器：控制下拉選單定位 ===== */
.user-menu-wrapper {
  position: relative;
}

/* ===== 會員選單按鈕：登入後同樣維持右側藍色圓角按鈕感 ===== */
.user-menu-toggle {
  min-height: 2.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0 1.15rem;
  border: 1px solid rgba(16, 40, 58, 0.9);
  border-radius: 999px;
  color: #ffffff;
  background-color: var(--color-primary);
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow:
    0 0.75rem 1.6rem rgba(16, 40, 58, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  transition:
    color 0.22s ease,
    background-color 0.22s ease,
    border-color 0.22s ease,
    transform 0.22s ease;
}

/* ===== 會員選單按鈕 hover：控制互動效果 ===== */
.user-menu-toggle:hover,
.user-menu-toggle:focus-visible {
  color: #ffffff;
  background-color: var(--color-primary-light);
  border-color: var(--color-primary-light);
  transform: translateY(-1px);
}

/* ===== 會員圖示：控制 user icon ===== */
.user-icon {
  width: 0.95rem;
  height: 0.95rem;
  flex-shrink: 0;
}

/* ===== 會員名稱：控制文字過長時省略 ===== */
.user-name {
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== 下拉箭頭：控制箭頭尺寸 ===== */
.dropdown-arrow {
  width: 0.65rem;
  height: 0.65rem;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

/* ===== 下拉箭頭旋轉：控制選單開啟狀態 ===== */
.user-menu-toggle[aria-expanded="true"] .dropdown-arrow {
  transform: rotate(180deg);
}

/* ===== 下拉選單：控制會員下拉外觀 ===== */
.user-dropdown {
  position: absolute;
  top: calc(100% + 0.7rem);
  right: 0;
  min-width: 10.5rem;
  padding: 0.45rem;
  border: 1px solid rgba(217, 178, 111, 0.22);
  border-radius: 1rem;
  background-color: rgba(255, 250, 240, 0.96);
  backdrop-filter: blur(0.8rem);
  -webkit-backdrop-filter: blur(0.8rem);
  box-shadow: 0 1.25rem 3rem rgba(15, 37, 56, 0.16);
  z-index: 1000;
}

/* ===== 下拉選單項目：控制會員中心與登出 ===== */
.dropdown-item {
  width: 100%;
  min-height: 2.55rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0 0.85rem;
  border: none;
  border-radius: 0.75rem;
  color: var(--color-muted);
  background-color: transparent;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition:
    color 0.22s ease,
    background-color 0.22s ease;
}

/* ===== 下拉選單 hover：控制滑過效果 ===== */
.dropdown-item:hover,
.dropdown-item:focus-visible {
  color: var(--color-primary);
  background-color: rgba(217, 178, 111, 0.12);
}

/* ===== 下拉選單圖示：控制 icon 尺寸 ===== */
.dropdown-icon {
  width: 0.95rem;
  height: 0.95rem;
  flex-shrink: 0;
}

/* ===== 桌機版：控制導覽列更接近參考圖比例 ===== */
@media (min-width: 64em) {
  .navbar-inner {
    width: min(100% - 4rem, 82rem);
    min-height: 4.85rem;
  }

  .nav-menu {
    gap: 1.05rem;
  }
}

/* ===== 手機版：控制導覽列收合樣式 ===== */
@media (max-width: 47.9em) {
  .app-header {
    background-color: rgba(255, 250, 240, 0.92);
    border-bottom: 1px solid rgba(217, 178, 111, 0.18);
  }

  .navbar-inner {
    width: min(100% - 1.5rem, 78rem);
    min-height: 4.15rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .logo-text {
    font-size: 0.92rem;
  }

  .logo-mark {
    width: 1.95rem;
    height: 1.95rem;
  }

  .logo-text--zh {
    font-size: 0.82rem;
    letter-spacing: 0.03em;
  }

  .logo-text--en {
    font-size: 0.66rem;
    letter-spacing: 0.14em;
  }

  .menu-toggle {
    display: grid;
  }

  .nav-menu {
    position: absolute;
    top: calc(100% + 0.7rem);
    left: 0.75rem;
    right: 0.75rem;
    display: grid;
    gap: 0.35rem;
    padding: 0.75rem;
    border: 1px solid rgba(217, 178, 111, 0.22);
    border-radius: 1.1rem;
    background-color: rgba(255, 250, 240, 0.96);
    backdrop-filter: blur(0.9rem);
    -webkit-backdrop-filter: blur(0.9rem);
    box-shadow: 0 1.25rem 3rem rgba(15, 37, 56, 0.16);
    opacity: 0;
    transform: translateY(-0.4rem);
    pointer-events: none;
    transition:
      opacity 0.22s ease,
      transform 0.22s ease;
  }

  .nav-menu.is-open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .nav-menu li {
    width: 100%;
  }

  .locale-switcher {
    position: static;
    width: 100%;
  }

  .nav-menu > li:has(.nav-link--login),
  .nav-menu > li.user-menu-wrapper {
    position: static;
  }

  .nav-link,
  .user-menu-toggle,
  .locale-select {
    width: 100%;
    min-height: 2.75rem;
    justify-content: flex-start;
    padding: 0 1rem;
    border-radius: 0.8rem;
    font-size: 0.94rem;
  }

  .nav-link:hover,
  .nav-link:focus-visible,
  .nav-link.router-link-active,
  .nav-link.router-link-exact-active {
    color: var(--color-primary);
    background-color: rgba(217, 178, 111, 0.12);
    border-color: transparent;
  }

  .nav-link--login,
  .user-menu-toggle {
    justify-content: center;
    color: #ffffff;
    background-color: var(--color-primary);
    border-color: var(--color-primary);
  }

  .nav-link--login:hover,
  .nav-link--login:focus-visible,
  .user-menu-toggle:hover,
  .user-menu-toggle:focus-visible {
    color: #ffffff;
    background-color: var(--color-primary-light);
    border-color: var(--color-primary-light);
  }

  .user-menu-wrapper {
    width: 100%;
  }

  .user-dropdown {
    position: static;
    width: 100%;
    min-width: 0;
    margin-top: 0.45rem;
    box-shadow: none;
  }

  .dropdown-item {
    min-height: 2.45rem;
  }
}
</style>
