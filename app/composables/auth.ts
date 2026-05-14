import { defineStore } from 'pinia'
import { authAPI } from '~/composables/utils/api'

/**
 * 使用者資料型別
 * 用途：統一管理登入者在前端會使用到的欄位
 */
type AuthUser = {
  Name: string
  Email: string
  Phone: string
  IsEmailConfirmed: boolean
}

/**
 * Auth Store
 * 用途：集中管理目前登入者資料，讓側欄與會員設定頁共用同一份狀態
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      Name: '',
      Email: '',
      Phone: '',
      IsEmailConfirmed: false,
    } as AuthUser,

    isLogin: false,
    loading: false,
  }),

  actions: {
    /**
     * 載入目前登入者資料
     * 用途：呼叫 AuthMe，取得後端最新會員資料
     */
    async loadUser() {
      this.loading = true

      try {
        const result = await authAPI.checkLoginStatus()

        this.isLogin = Boolean(result?.isLogin)

        const user = result?.user ?? {}

        this.user = {
          Name: user.Name ?? user.name ?? '',
          Email: user.Email ?? user.email ?? '',
          Phone: user.Phone ?? user.phone ?? '',
          IsEmailConfirmed: Boolean(
            user.IsEmailConfirmed ?? user.isEmailConfirmed
          ),
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * 清空登入者資料
     * 用途：登出時使用
     */
    clearUser() {
      this.isLogin = false
      this.user = {
        Name: '',
        Email: '',
        Phone: '',
        IsEmailConfirmed: false,
      }
    },
  },
})