/* ===== 登入 Modal 共享狀態：讓任何頁面都能觸發 Header 的登入視窗 ===== */
export function useLoginModal() {
  // ===== 共享狀態：useState 在同一 SPA 實例中跨元件共享 =====
  const isOpen = useState<boolean>('loginModal:open', () => false)

  /* ===== 開啟登入視窗 ===== */
  function openLoginModal() {
    isOpen.value = true
  }

  /* ===== 關閉登入視窗 ===== */
  function closeLoginModal() {
    isOpen.value = false
  }

  return { isOpen, openLoginModal, closeLoginModal }
}
