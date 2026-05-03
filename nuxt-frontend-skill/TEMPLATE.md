# 🧩 程式碼模板庫（TEMPLATE）

> 完整可用範本，直接複製調整即可 ｜ 最後更新：2026-04

---

## 📋 目錄

1. [Page 模板（含 SEO + RWD + API）](#1-page-模板)
2. [Component 模板（含 Props + Emits）](#2-component-模板)
3. [Modal Component 模板](#3-modal-component-模板)
4. [Composable 模板（含 API 呼叫）](#4-composable-模板)
5. [Pinia Store 模板](#5-pinia-store-模板)
6. [api.ts 模板](#6-apits-模板)
7. [Middleware 模板](#7-middleware-模板)
8. [登入頁完整範例](#8-登入頁完整範例)
9. [Mock 假資料注入模板](#9-mock-假資料注入模板)

---

## 1. Page 模板

> 適用：公開頁面（使用 default layout）

```vue
<!-- app/pages/[page-name].vue -->
<template>
  <div class="[page-name]-page">

    <!-- ======== HERO ======== -->
    <section class="hero">
      <div class="hero-content">
        <p class="hero-eyebrow">副標籤</p>
        <h1 class="hero-title">主標題</h1>
        <p class="hero-desc">頁面描述段落</p>
        <div class="hero-actions">
          <NuxtLink to="/target" class="btn btn-primary">主要按鈕</NuxtLink>
          <NuxtLink to="#section" class="btn btn-outline">次要按鈕</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ======== 主要內容 ======== -->
    <section class="main-section" id="main-section">
      <div class="section-inner">
        <header class="section-header">
          <h2>區塊標題</h2>
          <p class="section-desc">區塊描述</p>
        </header>

        <!-- 載入中 -->
        <div v-if="isLoading" class="loading-state">載入中...</div>

        <!-- 錯誤 -->
        <div v-else-if="error" class="error-state">{{ error }}</div>

        <!-- 資料列表 -->
        <ul v-else class="items-grid" role="list">
          <li v-for="item in items" :key="item.id" class="item-card">
            <article>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </article>
          </li>
        </ul>
      </div>
    </section>

    <!-- ======== FAQ（AEO 優化）======== -->
    <section class="faq-section" aria-label="常見問題">
      <div class="section-inner">
        <h2>常見問題</h2>
        <div class="faq-list">
          <details v-for="faq in faqs" :key="faq.id" class="faq-item">
            <summary class="faq-question">{{ faq.question }}</summary>
            <p class="faq-answer">{{ faq.answer }}</p>
          </details>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
// ===== SEO（必須放最前面）=====
useHead({
  title: '頁面標題',
  meta: [
    { name: 'description', content: '頁面描述，包含主要關鍵字，150字以內' },
    { name: 'keywords', content: '關鍵字1, 關鍵字2, 關鍵字3' },
    { property: 'og:title', content: '頁面標題 | 網站名稱' },
    { property: 'og:description', content: '頁面描述' },
    { property: 'og:url', content: 'https://example.com/page-name' },
  ],
  link: [{ rel: 'canonical', href: 'https://example.com/page-name' }],
})

// ===== 引入 composable =====
import { useXxx } from '~/composables/useXxx'

const { items, isLoading, error, fetchItems } = useXxx()

// ===== 靜態資料（FAQ）=====
const faqs = [
  { id: 1, question: '問題一？', answer: '答案一。' },
  { id: 2, question: '問題二？', answer: '答案二。' },
]

// ===== 初始化 =====
onMounted(async () => {
  await fetchItems()
})
</script>

<style scoped>
/* ======= Mobile First ======= */
.hero {
  padding: 5rem 1.25rem;
  text-align: center;
}

.hero-eyebrow {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

.hero-title {
  font-size: clamp(1.75rem, 5vw, 3rem);
  margin-bottom: 1rem;
}

.hero-desc {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  max-width: 40rem;
  margin: 0 auto 2rem;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.section-inner {
  max-width: 75rem;
  margin: 0 auto;
  padding: 3rem 1.25rem;
}

.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-header h2 {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  margin-bottom: 0.75rem;
}

.items-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.item-card {
  background: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.75rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}
.btn:hover { opacity: 0.85; }
.btn-primary { background: var(--color-primary, #c9a96e); color: #fff; }
.btn-outline { background: transparent; border: 2px solid currentColor; }

/* FAQ */
.faq-item {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}
.faq-question {
  font-weight: 600;
  cursor: pointer;
  list-style: none;
  padding: 0.25rem 0;
}
.faq-answer { margin-top: 0.75rem; color: #555; line-height: 1.7; }

/* Loading / Error */
.loading-state, .error-state {
  text-align: center;
  padding: 3rem;
  color: #888;
}

/* ======= 平板 ======= */
@media (min-width: 48em) {
  .hero-actions {
    flex-direction: row;
    justify-content: center;
  }

  .items-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ======= 桌機 ======= */
@media (min-width: 64em) {
  .items-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
```

---

## 2. Component 模板

> 適用：展示型元件（無直接 API 呼叫，資料由 props 傳入）

```vue
<!-- app/components/ProductCard.vue -->
<template>
  <article class="product-card" :class="{ 'product-card--featured': featured }">
    <div class="card-image">
      <img :src="image" :alt="title" loading="lazy" />
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-desc">{{ description }}</p>
      <div class="card-footer">
        <span class="card-price">{{ formattedPrice }}</span>
        <button
          class="card-btn"
          :disabled="isLoading"
          @click="handleAction"
        >
          {{ isLoading ? '處理中...' : actionLabel }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ===== Props =====
interface Props {
  id: number
  title: string
  description: string
  price: number
  image?: string
  featured?: boolean
  actionLabel?: string
}

// ===== Emits =====
interface Emits {
  (e: 'action', id: number): void
  (e: 'view', id: number): void
}

const props = withDefaults(defineProps<Props>(), {
  image: '/placeholder.jpg',
  featured: false,
  actionLabel: '立即選購',
})

const emit = defineEmits<Emits>()

// ===== 狀態 =====
const isLoading = ref(false)

// ===== Computed =====
const formattedPrice = computed(() =>
  new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(props.price)
)

// ===== 方法 =====
async function handleAction() {
  isLoading.value = true
  try {
    emit('action', props.id)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.product-card--featured {
  border: 2px solid var(--color-primary, #c9a96e);
}

.card-image img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.card-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.card-desc {
  font-size: 0.875rem;
  color: #666;
  flex: 1;
  line-height: 1.6;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.card-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary, #c9a96e);
}

.card-btn {
  padding: 0.5rem 1rem;
  background: var(--color-primary, #c9a96e);
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.2s;
}

.card-btn:hover:not(:disabled) { opacity: 0.85; }
.card-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
```

---

## 3. Modal Component 模板

> 從 LoginModal.vue 分析 — 使用 Teleport + Transition

```vue
<!-- app/components/ConfirmModal.vue -->
<template>
  <Teleport to="body">
    <!-- 背景遮罩 -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click="emit('close')"
      ></div>
    </Transition>

    <!-- 內容框 -->
    <Transition name="modal-slide">
      <div v-if="isOpen" class="modal-wrapper" role="dialog" :aria-label="title">
        <div class="modal-content">

          <!-- 關閉按鈕 -->
          <button class="close-btn" @click="emit('close')" aria-label="關閉">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
          </div>

          <!-- Body（slot 插槽） -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- Footer Actions -->
          <div class="modal-footer">
            <button class="btn btn-outline" @click="emit('close')">取消</button>
            <button
              class="btn btn-primary"
              :disabled="isLoading"
              @click="handleConfirm"
            >
              {{ isLoading ? '處理中...' : confirmLabel }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isOpen: boolean
  title: string
  subtitle?: string
  confirmLabel?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
}

withDefaults(defineProps<Props>(), {
  confirmLabel: '確認',
})

const emit = defineEmits<Emits>()
const isLoading = ref(false)

async function handleConfirm() {
  isLoading.value = true
  try {
    emit('confirm')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 1rem;
}

.modal-content {
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0;
}

.close-btn svg { width: 100%; height: 100%; }

.modal-header { margin-bottom: 1.5rem; }
.modal-title { font-size: 1.25rem; margin-bottom: 0.25rem; }
.modal-subtitle { color: #666; font-size: 0.875rem; }
.modal-body { margin-bottom: 1.5rem; }

.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.625rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}
.btn:hover:not(:disabled) { opacity: 0.85; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background: var(--color-primary, #c9a96e); color: #fff; }
.btn-outline { background: transparent; border: 2px solid #ddd; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.modal-slide-enter-active, .modal-slide-leave-active { transition: all 0.3s; }
.modal-slide-enter-from, .modal-slide-leave-to {
  opacity: 0;
  transform: translateY(-1rem) scale(0.97);
}
</style>
```

---

## 4. Composable 模板

> 包含完整狀態管理 + API 呼叫

```ts
// app/composables/useProducts.ts
import { ref, computed } from 'vue'
import api from '~/composables/utils/api'
import { showSuccess, showError, showConfirm } from '~/composables/utils/alert'

// ===== 型別定義 =====
interface Product {
  id: number
  name: string
  price: number
  description: string
  imageUrl?: string
}

interface CreateProductInput {
  name: string
  price: number
  description: string
}

export function useProducts() {
  // ===== 狀態 =====
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  // ===== Computed =====
  const totalCount = computed(() => products.value.length)
  const hasProducts = computed(() => products.value.length > 0)

  // ===== 取得列表 =====
  async function fetchProducts(params?: { page?: number; size?: number }) {
    isLoading.value = true
    error.value = null
    try {
      const res = await api.get('/products', params)
      if (res.data?.success) {
        products.value = res.data.data
      } else {
        error.value = res.data?.message || '載入失敗'
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '網路錯誤'
    } finally {
      isLoading.value = false
    }
  }

  // ===== 取得單筆 =====
  async function fetchProduct(id: number) {
    isLoading.value = true
    try {
      const res = await api.get(`/products/${id}`)
      if (res.data?.success) {
        currentProduct.value = res.data.data
      }
    } catch (err: any) {
      showError('取得資料失敗')
    } finally {
      isLoading.value = false
    }
  }

  // ===== 建立 =====
  async function createProduct(input: CreateProductInput) {
    isSaving.value = true
    try {
      const res = await api.post('/products', input)
      if (res.data?.success) {
        showSuccess('建立成功')
        await fetchProducts()
        return true
      }
      showError(res.data?.message || '建立失敗')
      return false
    } catch (err: any) {
      showError(err.response?.data?.message || '建立失敗')
      return false
    } finally {
      isSaving.value = false
    }
  }

  // ===== 更新 =====
  async function updateProduct(id: number, input: Partial<CreateProductInput>) {
    isSaving.value = true
    try {
      const res = await api.put(`/products/${id}`, input)
      if (res.data?.success) {
        showSuccess('更新成功')
        await fetchProducts()
        return true
      }
      showError(res.data?.message || '更新失敗')
      return false
    } catch {
      showError('更新失敗')
      return false
    } finally {
      isSaving.value = false
    }
  }

  // ===== 刪除 =====
  async function deleteProduct(id: number) {
    const result = await showConfirm('確定要刪除此商品嗎？')
    if (!result.isConfirmed) return false

    try {
      const res = await api.delete(`/products/${id}`)
      if (res.data?.success) {
        showSuccess('刪除成功')
        await fetchProducts()
        return true
      }
      showError(res.data?.message || '刪除失敗')
      return false
    } catch {
      showError('刪除失敗')
      return false
    }
  }

  return {
    // 狀態
    products,
    currentProduct,
    isLoading,
    isSaving,
    error,
    // Computed
    totalCount,
    hasProducts,
    // 方法
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
```

---

## 5. Pinia Store 模板

> 適用：需要跨元件共享的全域狀態

```ts
// app/composables/userStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from './utils/api'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

export const useUserStore = defineStore('user', () => {
  // ===== State =====
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  // ===== Getters =====
  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const displayName = computed(() => user.value?.name || '訪客')

  // ===== Actions =====
  async function fetchCurrentUser() {
    if (import.meta.server) return  // SSR 跳過

    isLoading.value = true
    try {
      const res = await api.get('/AuthMe')
      if (res.data?.success && res.data?.isLogin) {
        user.value = res.data.data
      }
    } catch {
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  function setUser(data: User | null) {
    user.value = data
  }

  function clearUser() {
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('user')
    }
  }

  return {
    user, isLoading,
    isLoggedIn, isAdmin, displayName,
    fetchCurrentUser, setUser, clearUser,
  }
})
```

---

## 6. api.ts 模板

> 完整版本，從真實專案複製

```ts
// app/composables/utils/api.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { showCustom } from "~/composables/utils/alert.js"

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://your-api.example.com/api",
  withCredentials: true,
})

// ===== Request Interceptor =====
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url?.includes("/upload")) {
      config.headers["Content-Type"] = "multipart/form-data"
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ===== Response Interceptor（401 全域處理）=====
let isShowing401 = false
let isRedirecting = false

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const status = error.response?.status
    const data = error.response?.data
    const requestUrl = error.config?.url || ""

    const skipAuth401APIs = ["/reset-password", "/cart", "/AuthMe"]
    const shouldSkip401 = skipAuth401APIs.some((path) => requestUrl.includes(path))

    if (isRedirecting || shouldSkip401) return Promise.reject(error)

    if (status === 401 && !isShowing401) {
      isShowing401 = true
      isRedirecting = true
      try {
        try { await apiClient.post("/Logout") } catch {}
        if (import.meta.client) {
          const msg = data?.detail || data?.message || "請重新登入"
          await showCustom("登入逾時", msg, "warning")
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

// ===== 統一介面 =====
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

## 7. Middleware 模板

### 核心概念

| 種類 | 檔名後綴 | 套用方式 | 適用場景 |
|------|---------|---------|---------|
| Global | `.global.ts` | 自動套用所有路由 | 認證檢查、路由分流 |
| 手動 | `.ts`（無 global） | 頁面 `definePageMeta` 指定 | 細粒度權限、付費檢查 |

**命名規則**：kebab-case，`definePageMeta` 裡的名稱與檔名對應
```
auth.global.ts      → 自動套用
check-permission.ts → middleware: ['check-permission']
admin-access.ts     → middleware: ['admin-access']
```

---

### 7-1. Global 認證守衛（通用版）

> 只保護指定前綴的路由，其他路由直接放行
> ⭐ **依專案修改**：`PROTECTED_PREFIXES`、`/auth-check` API 端點、失敗時的跳轉目標

```ts
// app/middleware/auth.global.ts
import api from "~/composables/utils/api"

// ✏️ 【依專案修改】需要登入才能進入的路由前綴
const PROTECTED_PREFIXES = ["/admin", "/dashboard", "/member", "/order"]

// ✏️ 【依專案修改】未登入時的預設跳轉目標（外部跳轉避免 SSR 快取問題）
const REDIRECT_ON_FAIL = "/"

// ✏️ 【依專案修改】特定路由失敗時改用「顯示 Modal 而非跳轉」
// 若無此需求可刪除整個 specialRoutes 段落
const SPECIAL_MODAL_ROUTES = ["/checkout", "/order"]

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return  // SSR 跳過（避免 cookie 帶不過去）

  // 非保護路由 → 直接放行
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => to.path === prefix || to.path.startsWith(prefix + "/")
  )
  if (!isProtected) return

  try {
    // ✏️ 【依專案修改】換成實際的認證確認 API
    const res = await api.get("/AuthMe")
    if (res.data?.success && res.data?.isLogin) return  // 已登入，放行
    throw new Error("Unauthenticated")
  } catch {
    // 特定路由：開 Modal 而非直接跳轉（可選）
    const isSpecialRoute = SPECIAL_MODAL_ROUTES.some(
      (r) => to.path === r || to.path.startsWith(r + "/")
    )
    if (isSpecialRoute) {
      // ✏️ 【依專案修改】useState key 與跳轉目標
      const loginModalOpen = useState("loginModalOpen", () => false)
      loginModalOpen.value = true
      return navigateTo("/")
    }

    // 其他路由：強制整頁跳轉（external: true 清除 SPA 狀態）
    return navigateTo(REDIRECT_ON_FAIL, { external: true })
  }
})
```

**若不需要 Modal 邏輯，精簡版如下：**

```ts
// app/middleware/auth.global.ts（精簡版）
import api from "~/composables/utils/api"

const PROTECTED_PREFIXES = ["/admin", "/member"]  // ✏️ 依專案修改

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => to.path === prefix || to.path.startsWith(prefix + "/")
  )
  if (!isProtected) return

  try {
    const res = await api.get("/AuthMe")  // ✏️ 依專案修改
    if (res.data?.success && res.data?.isLogin) return
    throw new Error("Unauthenticated")
  } catch {
    return navigateTo("/", { external: true })  // ✏️ 依專案修改
  }
})
```

---

### 7-2. 細粒度權限守衛（手動套用版，通用版）

> 適用：需要「路由 → 權限鍵」對應的細粒度存取控制
> ⭐ **依專案修改**：`routePermissionMap`、免檢查路由、API 端點、`fallbackRoute`

```ts
// app/middleware/check-permission.ts  ← ✏️ 檔名依專案命名
import api from '~/composables/utils/api'

// ✏️ 【依專案修改】路由 → 權限鍵 映射表
// key   = 完整路由路徑
// value = 後端 permissions 物件裡對應的 key 名稱
const routePermissionMap: Record<string, string> = {
  '/admin/dashboard':    'dashboard',      // ✏️ 換成實際路由與權限鍵
  '/admin/users':        'userManagement',
  '/admin/reports':      'reports',
  '/admin/settings':     'settings',
}

// ✏️ 【依專案修改】免檢查的路由（有路徑但不需要驗權限）
const ALWAYS_ALLOW: string[] = ['/admin/dashboard']

// ✏️ 【依專案修改】無權限時的跳轉目標
const FALLBACK_ROUTE = '/admin/dashboard'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const requiredPermission = routePermissionMap[to.path]

  // 不在映射表中 → 不需要此守衛管轄，放行
  if (!requiredPermission) return

  // 白名單路由 → 直接放行
  if (ALWAYS_ALLOW.includes(to.path)) return

  // ===== 取得識別資源 ID（若 API 需要）=====
  // ✏️ 如果 API 不需要額外 ID 參數，可刪除此段直接跳到下一節
  let resourceId: number | null = null
  if (import.meta.client) {
    // ✏️ 換成實際的 localStorage key
    const stored = localStorage.getItem('currentResourceId')
    if (stored) resourceId = parseInt(stored)
  }

  // 沒有 resourceId → 嘗試從 API 取得
  if (!resourceId) {
    try {
      // ✏️ 換成實際的 API 端點
      const res = await api.get('/resource/mine')
      if (!res.data?.success || !res.data?.data?.length) {
        return navigateTo(FALLBACK_ROUTE)
      }
      // ✏️ 換成實際的 ID 欄位名稱
      resourceId = res.data.data[0].id
    } catch {
      return navigateTo(FALLBACK_ROUTE)
    }
  }

  // ===== 呼叫權限驗證 API =====
  try {
    // ✏️ 換成實際的權限查詢 API 端點
    const res = await api.get(`/permission/check?resourceId=${resourceId}`)
    const data = res.data

    if (!data?.success) {
      return navigateTo(FALLBACK_ROUTE)
    }

    // ✏️ 若 API 回傳的 permissions 物件結構不同，調整此處判斷
    if (!data.permissions || !data.permissions[requiredPermission]) {
      return navigateTo(FALLBACK_ROUTE)
    }

    // ✅ 有權限，放行

  } catch {
    return navigateTo(FALLBACK_ROUTE)  // 任何錯誤 → 安全降級
  }
})
```

**在頁面手動套用：**

```vue
<!-- app/pages/admin/users.vue -->
<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['check-permission'],  // ✏️ 對應 middleware 檔名（kebab-case）
})
</script>
```

**同時套用多個 middleware（順序執行）：**

```vue
<script setup>
definePageMeta({
  middleware: ['auth', 'check-permission'],  // auth 先執行，通過後再執行 check-permission
})
</script>
```

---

## 8. 登入頁完整範例

> 整合 Page + Component + Composable + API 的完整範例

### composables/useAuth.ts

```ts
import { ref } from 'vue'
import api from '~/composables/utils/api'
import { showSuccess, showError } from '~/composables/utils/alert'

export function useAuth() {
  const isLoading = ref(false)

  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true
    try {
      const res = await api.post('/Login', { email, password })
      if (res.data?.success) {
        showSuccess('登入成功')
        return true
      }
      showError(res.data?.message || '登入失敗')
      return false
    } catch (err: any) {
      showError(err.response?.data?.message || '登入失敗，請稍後再試')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function register(payload: {
    name: string; email: string; password: string
  }): Promise<boolean> {
    isLoading.value = true
    try {
      const res = await api.post('/Register', payload)
      if (res.data?.success) {
        showSuccess('註冊成功，請登入')
        return true
      }
      showError(res.data?.message || '註冊失敗')
      return false
    } catch (err: any) {
      showError(err.response?.data?.message || '註冊失敗')
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, login, register }
}
```

### components/LoginForm.vue

```vue
<template>
  <form class="login-form" @submit.prevent="handleSubmit">

    <div v-if="errorMessage" class="error-alert" role="alert">
      {{ errorMessage }}
    </div>

    <div class="form-group">
      <label for="email" class="form-label">電子郵件</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        class="form-input"
        placeholder="請輸入電子郵件"
        autocomplete="email"
        required
      />
    </div>

    <div class="form-group">
      <label for="password" class="form-label">密碼</label>
      <div class="password-wrapper">
        <input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          class="form-input"
          placeholder="請輸入密碼"
          autocomplete="current-password"
          required
        />
        <button
          type="button"
          class="toggle-password"
          @click="showPassword = !showPassword"
          :aria-label="showPassword ? '隱藏密碼' : '顯示密碼'"
        >
          {{ showPassword ? '隱藏' : '顯示' }}
        </button>
      </div>
    </div>

    <button type="submit" class="submit-btn" :disabled="isLoading">
      {{ isLoading ? '登入中...' : '登入' }}
    </button>

  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

interface Emits {
  (e: 'success'): void
}

const emit = defineEmits<Emits>()
const { isLoading, login } = useAuth()

const form = ref({ email: '', password: '' })
const showPassword = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''
  const ok = await login(form.value.email, form.value.password)
  if (ok) {
    emit('success')
  } else {
    errorMessage.value = '登入失敗，請確認帳號密碼'
  }
}
</script>

<style scoped>
.login-form { display: flex; flex-direction: column; gap: 1.25rem; }

.form-group { display: flex; flex-direction: column; gap: 0.375rem; }

.form-label { font-size: 0.875rem; font-weight: 500; }

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.form-input:focus { border-color: var(--color-primary, #c9a96e); }

.password-wrapper { position: relative; }
.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8125rem;
  color: #888;
}

.error-alert {
  padding: 0.75rem 1rem;
  background: #fff0f0;
  border: 1px solid #ffcccc;
  border-radius: 0.375rem;
  color: #cc0000;
  font-size: 0.875rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-primary, #c9a96e);
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.submit-btn:hover:not(:disabled) { opacity: 0.85; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
```

### pages/login.vue

```vue
<template>
  <div class="login-page">
    <main class="login-main">
      <section class="login-section" aria-label="登入">
        <div class="login-card">
          <header class="login-header">
            <h1 class="login-title">登入帳戶</h1>
            <p class="login-subtitle">歡迎回來，請輸入您的帳號密碼</p>
          </header>

          <LoginForm @success="handleLoginSuccess" />

          <footer class="login-footer">
            <NuxtLink to="/forgot-password">忘記密碼？</NuxtLink>
            <span>還沒有帳號？</span>
            <NuxtLink to="/register">立即註冊</NuxtLink>
          </footer>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
// ===== SEO =====
useHead({
  title: '登入',
  meta: [
    { name: 'description', content: '登入您的帳戶，開始使用完整服務。' },
  ],
})

// ===== 不需要 Header/Footer =====
definePageMeta({
  hideHeader: true,
  hideFooter: true,
})

// ===== 登入成功後跳轉 =====
function handleLoginSuccess() {
  navigateTo('/dashboard')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 1.25rem;
}

.login-card {
  width: 100%;
  max-width: 26rem;
  background: #fff;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.login-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

.login-title {
  font-size: 1.5rem;
  margin-bottom: 0.375rem;
}

.login-subtitle {
  color: #666;
  font-size: 0.875rem;
}

.login-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #666;
}

.login-footer a {
  color: var(--color-primary, #c9a96e);
  text-decoration: none;
}
.login-footer a:hover { text-decoration: underline; }

@media (min-width: 48em) {
  .login-card {
    padding: 2.5rem;
  }
}
</style>
```

---

## 9. Mock 假資料注入模板

> 用途：串接後端前，用 JS 假資料快速開發 UI ｜ **一行開關切換**，無需改動任何其他程式碼

---

### 9-0. 核心概念

```
USE_MOCK = true   →  直接用 MOCK_XXX 常數，不打 API
USE_MOCK = false  →  呼叫真實後端 API（api.ts）
```

**原則：**
- `USE_MOCK` 開關與假資料定義 **只放在 composable**，Page / Component 完全不知道差別
- 假資料結構必須與後端 API response 結構 **完全一致**（型別共用同一個 interface）
- 假資料用 `as const` 確保型別推斷精確，加 `satisfies` 驗證結構

---

### 9-1. 型別定義（共用）

> 放在 `app/composables/types.ts` 或各 composable 頂部

```ts
// ✏️ 依產品欄位調整
export interface Product {
  id: number
  name: string
  description: string
  price: number           // 單位：元（整數）
  imageUrl: string
  badge?: string          // 選填：'推薦' | '熱門' | '新品'
  isActive: boolean
}

// 方案型（Pricing 頁常用）
export interface PricingPlan {
  id: number
  name: string
  price: number
  period: string          // '/ 月' | '/ 年' | '一次性'
  description: string
  features: string[]      // 功能清單
  isFeatured: boolean     // 是否為推薦方案（樣式突出）
  ctaText: string
  ctaLink: string
}

// 通用列表型（文章/案例/客戶評價）
export interface ListItem {
  id: number
  title: string
  subtitle?: string
  body: string
  imageUrl?: string
  tags?: string[]
  createdAt: string       // ISO 8601
}
```

---

### 9-2. 假資料常數（定義規則）

```ts
// ✏️ 命名規則：MOCK_ + 大寫資源名稱（複數）
// ✏️ 結構必須與 API response 的 data 陣列完全一致
// ✏️ 放在對應 composable 的頂部（USE_MOCK 下方）

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: '基礎方案',
    description: '適合小型活動，完整的基本功能',
    price: 3990,
    imageUrl: '/images/mock/product-1.jpg',   // 放 public/images/mock/
    badge: '入門',
    isActive: true,
  },
  {
    id: 2,
    name: '專業方案',
    description: '適合中型婚禮，含進階座位管理',
    price: 7990,
    imageUrl: '/images/mock/product-2.jpg',
    badge: '推薦',
    isActive: true,
  },
  {
    id: 3,
    name: '尊榮方案',
    description: '完整功能無限制，專屬客服支援',
    price: 14990,
    imageUrl: '/images/mock/product-3.jpg',
    badge: '熱門',
    isActive: true,
  },
]

// 分頁型 Mock（若 API 有 pagination）
const MOCK_PRODUCTS_PAGED = {
  data: MOCK_PRODUCTS,
  total: 3,
  page: 1,
  pageSize: 10,
}
```

---

### 9-3. Composable 模板（含 Mock 切換）

```ts
// app/composables/useProducts.ts
import { ref } from 'vue'
import { api } from '~/composables/utils/api'
import { showError } from '~/composables/utils/alert'
import type { Product } from '~/composables/types'

// =============================================
// ⭐ 開關：true = 用假資料，false = 打真實 API
// =============================================
const USE_MOCK = true  // ✏️ 串接後端後改為 false
// =============================================

// ✏️ 假資料（API 串接後可整個 block 刪除）
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: '基礎方案',
    description: '適合小型活動，完整的基本功能',
    price: 3990,
    imageUrl: '/images/mock/product-1.jpg',
    badge: '入門',
    isActive: true,
  },
  {
    id: 2,
    name: '專業方案',
    description: '適合中型婚禮，含進階座位管理',
    price: 7990,
    imageUrl: '/images/mock/product-2.jpg',
    badge: '推薦',
    isActive: true,
  },
  {
    id: 3,
    name: '尊榮方案',
    description: '完整功能無限制，專屬客服支援',
    price: 14990,
    imageUrl: '/images/mock/product-3.jpg',
    badge: '熱門',
    isActive: true,
  },
]

export function useProducts() {
  const items = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProducts() {
    isLoading.value = true
    error.value = null

    try {
      // ⭐ Mock 開關
      if (USE_MOCK) {
        // 模擬網路延遲（開發用，讓 loading 狀態可見）
        await new Promise(resolve => setTimeout(resolve, 400))
        items.value = MOCK_PRODUCTS
        return
      }

      // 真實 API（✏️ 替換為實際路由）
      const res = await api.get('/products')
      items.value = res.data
    }
    catch (err: any) {
      error.value = err.response?.data?.message ?? '載入失敗，請稍後再試'
      showError(error.value!)
    }
    finally {
      isLoading.value = false
    }
  }

  async function fetchProductById(id: number) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const found = MOCK_PRODUCTS.find(p => p.id === id)
        if (!found) throw new Error('找不到商品')
        return found
      }

      const res = await api.get(`/products/${id}`)
      return res.data as Product
    }
    catch (err: any) {
      error.value = err.message ?? '載入失敗'
      showError(error.value!)
      return null
    }
    finally {
      isLoading.value = false
    }
  }

  return { items, isLoading, error, fetchProducts, fetchProductById }
}
```

---

### 9-4. Page 用法（呼叫端完全不知道是 Mock）

```vue
<!-- app/pages/products.vue -->
<template>
  <div class="products-page">
    <section class="products-section">
      <div class="section-inner">
        <header class="section-header">
          <h1 class="section-title">我們的方案</h1>
          <p class="section-desc">選擇最適合你的服務</p>
        </header>

        <div v-if="isLoading" class="loading-state" aria-busy="true">載入中...</div>
        <p  v-else-if="error" class="error-state" role="alert">{{ error }}</p>

        <ul v-else class="products-grid" role="list">
          <li v-for="product in items" :key="product.id">
            <ProductCard :product="product" />
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { items, isLoading, error, fetchProducts } = useProducts()

useHead({
  title: '方案總覽',
  meta: [{ name: 'description', content: '查看所有服務方案，找到最適合你的婚禮規劃選項。' }],
})

onMounted(fetchProducts)
</script>
```

---

### 9-5. 串接真實後端的切換步驟

切換時只需改 **一個地方**：

```ts
// ❶ 找到對應 composable 頂部的開關
const USE_MOCK = false  // ← 從 true 改為 false

// ❷ 確認 API 路由正確（✏️ 依後端文件調整）
const res = await api.get('/products')  // ← 確認這行路由正確

// ❸ 確認 response 結構與型別一致
// 若後端回傳 { data: Product[], total: number }，改為：
items.value = res.data.data
```

> ⭐ Mock 資料 block（`MOCK_PRODUCTS` 常數）可在確認 API 正常後直接刪除，不影響任何其他程式碼

---

### 9-6. 圖片 Mock 處理

```
public/
└── images/
    └── mock/           ← 開發用假圖，上線後替換為真實圖片 URL
        ├── product-1.jpg
        ├── product-2.jpg
        └── product-3.jpg
```

**快速取得假圖片（開發階段）：**

```ts
// 直接用 picsum（不需下載）
imageUrl: 'https://picsum.photos/seed/product1/640/480',
imageUrl: 'https://picsum.photos/seed/product2/640/480',

// 或用固定色塊佔位（完全不依賴外部服務）
imageUrl: '',  // 搭配 v-if / CSS 背景色佔位

// Component 內的佔位處理
<img
  :src="product.imageUrl || '/images/placeholder.jpg'"
  :alt="product.name"
  loading="lazy"
/>
```

---

### 9-7. Pricing 方案頁完整 Mock 範例

```ts
// app/composables/usePricing.ts
import type { PricingPlan } from '~/composables/types'

const USE_MOCK = true  // ✏️

const MOCK_PLANS: PricingPlan[] = [
  {
    id: 1,
    name: '基礎版',
    price: 3990,
    period: '/ 次',
    description: '適合 100 人以下的溫馨小婚禮',
    features: [
      '賓客名單管理（100 人）',
      '基本桌位規劃',
      '電子邀請函',
      '客服工作日回覆',
    ],
    isFeatured: false,
    ctaText: '選擇基礎版',
    ctaLink: '/order',
  },
  {
    id: 2,
    name: '專業版',
    price: 7990,
    period: '/ 次',
    description: '適合 300 人以下的精緻婚禮',
    features: [
      '賓客名單管理（300 人）',
      '進階桌位拖曳規劃',
      '電子邀請函 + 回覆追蹤',
      '心願牆功能',
      '24 小時客服支援',
    ],
    isFeatured: true,          // ← 推薦方案，樣式突出
    ctaText: '立即選購',
    ctaLink: '/order?plan=pro',
  },
  {
    id: 3,
    name: '尊榮版',
    price: 14990,
    period: '/ 次',
    description: '無人數限制，完整功能解鎖',
    features: [
      '賓客名單無限制',
      '全功能桌位規劃',
      '專屬客製化邀請函',
      '心願牆 + 照片上傳',
      '專屬客服經理',
      '婚後回憶相簿',
    ],
    isFeatured: false,
    ctaText: '選擇尊榮版',
    ctaLink: '/order?plan=premium',
  },
]

export function usePricing() {
  const plans = ref<PricingPlan[]>([])
  const isLoading = ref(false)

  async function fetchPlans() {
    isLoading.value = true
    try {
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 300))
        plans.value = MOCK_PLANS
        return
      }
      const res = await api.get('/plans')
      plans.value = res.data
    }
    finally {
      isLoading.value = false
    }
  }

  return { plans, isLoading, fetchPlans }
}
```
