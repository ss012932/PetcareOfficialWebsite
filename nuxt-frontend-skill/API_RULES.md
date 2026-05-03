# 🔗 API 呼叫規範（API_RULES）

> 從真實 `app/composables/utils/api.ts` 分析產出 ｜ 最後更新：2026-04

---

## ⛔ 核心規則

**所有 HTTP 請求必須透過 `api.ts`，禁止在任何 component / page / composable 直接使用 `axios`。**

---

## 📁 api.ts 完整架構（從專案分析）

```ts
// app/composables/utils/api.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { showCustom } from "~/composables/utils/alert.js"

// ===== 1. 建立 axios 實例 =====
const apiClient = axios.create({
  baseURL: "https://your-api.example.com/api",  // ⭐ 實際 API baseURL
  withCredentials: true,                          // ⭐ 攜帶 cookie（session auth）
})

// ===== 2. Request Interceptor =====
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 檔案上傳自動設定 Content-Type
    if (config.url?.includes("/upload")) {
      config.headers["Content-Type"] = "multipart/form-data"
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ===== 3. Response Interceptor（401 統一處理）=====
let isShowing401 = false
let isRedirecting = false

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const status = error.response?.status
    const data = error.response?.data
    const requestUrl = error.config?.url || ""

    // 跳過 401 處理的端點列表
    const skipAuth401APIs = ["/reset-password", "/cart", "/AuthMe"]
    const shouldSkip401 = skipAuth401APIs.some((api) => requestUrl.includes(api))

    if (isRedirecting || shouldSkip401) return Promise.reject(error)

    // 401 統一登出流程
    if (status === 401 && !isShowing401) {
      isShowing401 = true
      isRedirecting = true
      try {
        try { await apiClient.post("/Logout") } catch {}
        if (import.meta.client) {
          await showCustom("登入逾時", data?.detail || "請重新登入", "warning")
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          window.location.href = "/"
        }
      } finally {
        setTimeout(() => { isShowing401 = false; isRedirecting = false }, 1000)
      }
    }
    return Promise.reject(error)
  },
)

// ===== 4. 匯出統一介面 =====
export default {
  get(endpoint: string, params = {}, config = {}) {
    return apiClient.get(endpoint, { params, ...config })
  },
  post(endpoint: string, data: any, config = {}) {
    return apiClient.post(endpoint, data, config)
  },
  put(endpoint: string, data: any, config = {}) {
    return apiClient.put(endpoint, data, config)
  },
  delete(endpoint: string, data = {}, config = {}) {
    return apiClient.delete(endpoint, { data, ...config })
  },
}
```

---

## 📌 使用方式

### 引入方式（固定）

```ts
import api from "~/composables/utils/api"
```

### GET 請求

```ts
// 不帶參數
const res = await api.get('/users')

// 帶 query params（?page=1&size=10）
const res = await api.get('/users', { page: 1, size: 10 })

// 帶特殊 axios config
const res = await api.get('/file', {}, { responseType: 'blob' })
```

### POST 請求

```ts
// 一般 JSON
const res = await api.post('/Login', { email, password })

// 表單資料
const formData = new FormData()
formData.append('file', file)
const res = await api.post('/upload/image', formData)
// ⭐ api.ts 的 interceptor 會自動偵測 /upload 並設定 multipart/form-data
```

### PUT 請求

```ts
const res = await api.put('/users/1', { name: '新名稱' })
```

### DELETE 請求

```ts
// 帶 body（後端需要 id）
const res = await api.delete('/items', { id: 1 })

// 不帶 body
const res = await api.delete('/items/1')
```

---

## 📦 回應資料結構（本專案標準）

後端統一回傳格式：

```ts
interface ApiResponse<T = any> {
  success: boolean   // true = 成功
  data: T            // 實際資料
  message: string    // 說明訊息
}
```

### 讀取方式

```ts
const res = await api.get('/users')
if (res.data?.success) {
  const users = res.data.data  // 實際資料
}
```

---

## 🔄 完整 API 呼叫範式（Composable 內）

```ts
// composables/useAuth.ts
import { ref } from 'vue'
import api from '~/composables/utils/api'
import { showSuccess, showError } from '~/composables/utils/alert'

export function useAuth() {
  const isLoading = ref(false)
  const user = ref<UserType | null>(null)

  // ===== 登入 =====
  async function login(email: string, password: string) {
    isLoading.value = true
    try {
      const res = await api.post('/Login', { email, password })
      if (res.data?.success) {
        user.value = res.data.data
        showSuccess('登入成功')
        return true
      }
      showError(res.data?.message || '登入失敗')
      return false
    } catch (err: any) {
      const msg = err.response?.data?.message || '登入失敗，請稍後再試'
      showError(msg)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // ===== 登出 =====
  async function logout() {
    try {
      await api.post('/Logout', {})
    } finally {
      user.value = null
      if (import.meta.client) {
        localStorage.removeItem('user')
        window.location.href = '/'
      }
    }
  }

  // ===== 驗證登入狀態 =====
  async function checkAuth() {
    try {
      const res = await api.get('/AuthMe')
      return res.data?.success && res.data?.isLogin
    } catch {
      return false
    }
  }

  return { isLoading, user, login, logout, checkAuth }
}
```

---

## ⚠️ alert.ts 使用方式

```ts
import {
  showSuccess,    // 成功提示（1.5s 自動關閉）
  showError,      // 錯誤提示
  showConfirm,    // 確認對話框（回傳 isConfirmed）
  showPrompt,     // 輸入對話框
  showToast,      // 右上角 toast（2s 自動消失）
  showLoading,    // 讀取中遮罩
  hideLoading,    // 關閉讀取遮罩
  showCustom,     // 自訂對話框（title, message, icon）
} from "~/composables/utils/alert"
// 注意：引入時用 .js 副檔名（專案實際寫法）
// import { showCustom } from "~/composables/utils/alert.js"

// 確認對話框範例
const result = await showConfirm('確定要刪除嗎？')
if (result.isConfirmed) {
  await api.delete('/items', { id })
  showSuccess('刪除成功')
}
```

---

## 🔒 Middleware 中的 API 使用（auth.global.ts 範式）

```ts
// app/middleware/auth.global.ts
import api from "~/composables/utils/api"

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return  // SSR 跳過

  // 只攔截需要驗證的路由
  const isProtected = to.path.startsWith("/admin") || to.path.startsWith("/order")
  if (!isProtected) return

  try {
    const res = await api.get("/AuthMe")
    if (res.data?.success && res.data?.isLogin) return
    throw new Error("NotLogin")
  } catch {
    return navigateTo("/", { external: true })
  }
})
```

---

## 📋 端點命名慣例（本專案）

| 動作 | 端點範式 | Method |
|------|----------|--------|
| 取得列表 | `/Users` / `/Items` | GET |
| 取得單筆 | `/Users/1` | GET |
| 建立 | `/Users` | POST |
| 更新 | `/Users/1` | PUT |
| 刪除 | `/Users/1` 或 `/Users`（帶 body id） | DELETE |
| 登入 | `/Login` | POST |
| 登出 | `/Logout` | POST |
| 驗證 | `/AuthMe` | GET |
| 上傳 | `/upload/xxx` | POST（自動 multipart） |
