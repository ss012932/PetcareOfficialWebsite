import { authAPI } from '~/composables/utils/api'

// ===== 認證 Middleware：需登入才可進入的頁面 =====
export default defineNuxtRouteMiddleware(async () => {
  // ===== SSR 階段跳過：認證依賴 HttpOnly Cookie，需在客戶端驗證 =====
  if (import.meta.server) return

  // ===== 呼叫 AuthMe 檢查登入狀態 =====
  const result = await authAPI.checkLoginStatus()

  if (!result.isLogin) {
    // ===== 未登入：導回首頁並帶上 login=1，讓 Header 自動開啟登入視窗 =====
    return navigateTo({ path: '/', query: { login: '1' } })
  }
})
