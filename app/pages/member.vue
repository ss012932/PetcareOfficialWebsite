<template>
  <!-- ===== 後台 Shell：側欄 + 子頁面渲染區 ===== -->
  <div class="bo-shell">
    <MemberSidebar />

    <!-- ===== 主內容區 ===== -->
    <div class="bo-content">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== 整個 /member 路由樹都需要登入 =====
definePageMeta({
  middleware: "backoffice-auth",
  layout: false,
});

const { t } = useI18n();

useHead(() => ({
  titleTemplate: t("seo.member.titleTemplate"),
}));
</script>

<style>
/* ===== Reset & 全域基準（scoped=false 讓子頁也繼承） ===== */
*,
*::before,
*::after {
  box-sizing: border-box;
}

.bo-shell {
  --bo-primary: #17334a;
  --bo-primary-soft: #edf4f8;
  --bo-accent: #d9b26f;
  --bo-border: #dfe7ec;
  --bo-text: #20303c;
  --bo-muted: #6b7882;
  --bo-bg: #f5f7f8;
  --bo-sidebar-w: 15rem;

  display: grid;
  grid-template-columns: var(--bo-sidebar-w) minmax(0, 1fr);
  min-height: 100vh;
  color: var(--bo-text);
  background: var(--bo-bg);
}

/* ===== 側欄 ===== */
.bo-sidebar {
  position: sticky;
  top: 0;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--bo-border);
  background: var(--bo-primary);
  overflow-y: auto;
}

/* ===== 使用者資訊 ===== */
.bo-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.bo-avatar {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  color: var(--bo-primary);
  background: var(--bo-accent);
  font-weight: 900;
  font-size: 1.1rem;
}

.bo-profile-info {
  min-width: 0;
}

.bo-profile-label {
  color: var(--bo-accent);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 0.2rem;
}

.bo-profile-name {
  display: block;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bo-profile-email {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.78rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== 導覽 ===== */
.bo-nav {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.75rem 0.6rem;
  flex: 1;
}

.bo-nav-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.72);
  font-weight: 800;
  font-size: 0.92rem;
  text-decoration: none;
  transition:
    background 0.15s,
    color 0.15s;
}

.bo-nav-item:hover,
.bo-nav-item.is-active {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.bo-nav-item.is-active {
  background: rgba(217, 178, 111, 0.2);
  color: var(--bo-accent);
}

.bo-nav-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.bo-nav-label {
  flex: 1;
}

/* ===== 底部回官網按鈕 ===== */
.bo-sidebar-footer {
  padding: 0.75rem 0.6rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.bo-back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.88rem;
  font-weight: 800;
  text-decoration: none;
  transition: color 0.15s;
}

.bo-back-link:hover {
  color: #fff;
}

/* ===== 主內容區 ===== */
.bo-content {
  min-height: 100dvh;
  padding: 2rem;
  overflow-y: auto;
}

/* ===== 手機版：側欄收折（底部 tab bar 模式） ===== */
@media (max-width: 47.99em) {
  .bo-shell {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }

  .bo-sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    height: auto;
    flex-direction: row;
    border-right: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 100;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .bo-profile,
  .bo-sidebar-footer {
    display: none;
  }

  .bo-nav {
    flex-direction: row;
    gap: 0;
    padding: 0;
    width: 100%;
    justify-content: space-around;
  }

  .bo-nav-item {
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.5rem 0.4rem;
    border-radius: 0;
    font-size: 0.7rem;
    text-align: center;
    flex: 1;
  }

  .bo-nav-icon {
    width: auto;
    font-size: 1.2rem;
  }

  .bo-content {
    padding: 1rem 1rem 5rem;
  }
}
</style>
