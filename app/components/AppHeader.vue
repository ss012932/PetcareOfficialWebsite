<template>
  <header class="app-header">
    <nav class="navbar" aria-label="主導覽">
      <div class="navbar-inner">
        <NuxtLink to="/" class="logo" aria-label="寵物醫療中心首頁">
          <span class="logo-text">寵物醫療中心</span>
        </NuxtLink>

        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="isMobileMenuOpen"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          aria-label="切換導覽選單"
        >
          <span class="hamburger"></span>
        </button>

        <ul
          class="nav-menu"
          :class="{ 'is-open': isMobileMenuOpen }"
          role="list"
        >
          <li>
            <NuxtLink to="/" class="nav-link" @click="isMobileMenuOpen = false">
              首頁
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#services" class="nav-link" @click="isMobileMenuOpen = false">
              服務項目
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#doctors" class="nav-link" @click="isMobileMenuOpen = false">
              醫療團隊
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#about" class="nav-link" @click="isMobileMenuOpen = false">
              關於我們
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#contact" class="nav-link nav-link--cta" @click="isMobileMenuOpen = false">
              聯絡我們
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)
</script>

<style scoped>
/* ===== 標頭基礎 ===== */
.app-header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

/* ===== 導覽列 ===== */
.navbar {
  padding: 1rem 0;
}

.navbar-inner {
  max-width: 75rem;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ===== Logo ===== */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c5f2d;
  transition: opacity 0.2s ease;
}

.logo:hover {
  opacity: 0.8;
}

.logo-text {
  font-family: 'Cormorant Garamond', serif;
  letter-spacing: 0.05em;
}

/* ===== 漢堡選單按鈕 ===== */
.menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  gap: 0.35rem;
  padding: 0.5rem;
}

.menu-toggle:focus-visible {
  outline: 2px solid #2c5f2d;
  outline-offset: 2px;
}

.hamburger {
  width: 1.5rem;
  height: 0.2rem;
  background-color: #333;
  display: block;
  transition: all 0.3s ease;
  border-radius: 0.1rem;
}

/* ===== 導覽選單 ===== */
.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  transition: color 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #2c5f2d;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -0.25rem;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #2c5f2d;
  transition: width 0.2s ease;
}

.nav-link:hover::after,
.nav-link:focus-visible::after {
  width: 100%;
}

.nav-link--cta {
  background-color: #2c5f2d;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
}

.nav-link--cta:hover,
.nav-link--cta:focus-visible {
  background-color: #1e4620;
}

.nav-link--cta::after {
  display: none;
}

/* ===== 平板（768px 以上）===== */
@media (min-width: 48em) {
  .navbar-inner {
    padding: 0 2rem;
  }

  .nav-menu {
    gap: 2.5rem;
  }
}

/* ===== 桌機（1024px 以上）===== */
@media (min-width: 64em) {
  .navbar-inner {
    padding: 0 3rem;
  }

  .nav-menu {
    gap: 3rem;
  }
}

/* ===== 手機（< 768px）===== */
@media (max-width: 47.9em) {
  .menu-toggle {
    display: flex;
  }

  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .nav-menu.is-open {
    max-height: 20rem;
  }

  .nav-menu li {
    width: 100%;
    border-bottom: 1px solid #eee;
  }

  .nav-menu li:last-child {
    border-bottom: none;
  }

  .nav-link {
    display: block;
    padding: 1rem 1.25rem;
    width: 100%;
  }

  .nav-link::after {
    display: none;
  }

  .nav-link--cta {
    margin: 1rem 1.25rem;
    width: auto;
  }
}
</style>
