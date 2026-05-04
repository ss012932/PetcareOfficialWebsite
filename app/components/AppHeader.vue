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

        <!-- ===== 導覽選單：控制首頁、功能介紹、價格方案 ===== -->
        <ul
          class="nav-menu"
          :class="{ 'is-open': isMobileMenuOpen }"
          role="list"
        >
          <li>
            <NuxtLink
              to="/#home"
              class="nav-link"
              @click="closeMobileMenu"
            >
              首頁
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/#features"
              class="nav-link"
              @click="closeMobileMenu"
            >
              功能介紹
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/#pricing"
              class="nav-link nav-link--cta"
              @click="closeMobileMenu"
            >
              價格方案
            </NuxtLink>
          </li>
        </ul>

      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
// ===== Vue 功能引入：控制響應式狀態 =====
import { ref } from 'vue'

// ===== 手機選單狀態：控制選單是否開啟 =====
const isMobileMenuOpen = ref(false)

// ===== 切換手機選單：控制漢堡選單開關 =====
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// ===== 關閉手機選單：點擊選單後自動收合 =====
function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
/* ===== Header 色系設定：控制 AppHeader 使用深藍精品底色 ===== */
.app-header {
  --color-primary: #17334a;        /* 主色：深藍色，控制 Header 背景 */
  --color-primary-dark: #0f2538;   /* 深主色：控制 hover 與加深狀態 */
  --color-accent: #d9b26f;         /* 強調色：金色，控制底線與重點 */
  --color-text: #ffffff;           /* 文字色：控制導覽列文字 */
  --color-muted: rgba(255, 255, 255, 0.78); /* 次要白色：控制一般文字透明感 */
  --color-border: rgba(217, 178, 111, 0.28); /* 邊框色：淡金色 */

  background:
    linear-gradient(
      135deg,
      #10283c 0%,
      #17334a 48%,
      #0f2538 100%
    );
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
  transition: opacity 0.2s ease, transform 0.2s ease;
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
  transition: color 0.2s ease;
  position: relative;
}

/* ===== 導覽連結滑過：控制滑鼠移入文字色 ===== */
.nav-link:hover {
  color: var(--color-text);
}

/* ===== 導覽底線：控制選單 hover 底線 ===== */
.nav-link::after {
  content: '';
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

/* ===== CTA 連結：控制價格方案按鈕樣式，維持內容不變但改成金色精品感 ===== */
.nav-link--cta {
  color: var(--color-primary-dark);
  background-color: var(--color-accent);
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 10px 24px rgba(217, 178, 111, 0.2);
  transition: background-color 0.2s ease, transform 0.2s ease;
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
    gap: 0;
    background:
      linear-gradient(
        135deg,
        #10283c 0%,
        #17334a 48%,
        #0f2538 100%
      );
    border: 1px solid var(--color-border);
    border-radius: 1.25rem;
    box-shadow: 0 18px 42px rgba(15, 37, 56, 0.28);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .nav-menu.is-open {
    max-height: 18rem;
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
    padding: 1rem 1.25rem;
    width: 100%;
    color: var(--color-muted);
  }

  .nav-link:hover {
    color: var(--color-text);
  }

  .nav-link::after {
    display: none;
  }

  .nav-link--cta {
    display: inline-flex;
    width: auto;
    margin: 1rem 1.25rem;
    padding: 0.75rem 1.25rem;
    color: var(--color-primary-dark);
  }
}
</style>