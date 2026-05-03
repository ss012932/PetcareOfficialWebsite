# 📏 程式碼規範（CODING_RULES）

> 從真實專案分析產出 ｜ 最後更新：2026-04

---

## 🏷️ 命名規範

### 檔案命名

| 類型 | 規則 | 範例 |
|------|------|------|
| Pages | `kebab-case.vue` | `login.vue` / `product-detail.vue` |
| Components | `PascalCase.vue` | `LoginModal.vue` / `ProductCard.vue` |
| Composables | `useXxx.ts` | `useAuth.ts` / `useProduct.ts` |
| Pinia Store | `xxxStore.ts` | `cartStore.ts` / `userStore.ts` |
| Utils | `camelCase.ts` | `api.ts` / `alert.ts` |
| Layouts | `kebab-case.vue` | `default.vue` / `admin.vue` |
| Middleware | `kebab-case.ts`（`.global.ts` 自動套用） | `auth.global.ts` |

---

### 變數 / 函式命名

```ts
// ✅ 布林值 → is/has/can 前綴
const isLoading = ref(false)
const isLoggedIn = ref(false)
const hasError = ref(false)

// ✅ 事件處理 → handle 前綴
function handleLogin() {}
function handleSubmit() {}

// ✅ 開關動作 → open/close/toggle 前綴
function openModal() {}
function closeModal() {}
function toggleDrawer() {}

// ✅ 資料取得 → fetch/get/load 前綴
async function fetchUser() {}
async function getUserData() {}

// ✅ 格式化 → format 前綴
function formatDateTime(dateStr: string) {}
function formatCurrency(amount: number) {}
```

---

## 🧩 Component 規範

### 標準 Component 結構

```vue
<template>
  <!-- 1. 語意化 HTML -->
  <!-- 2. 事件用 @click / @submit.prevent -->
  <!-- 3. 條件用 v-if / v-show -->
  <!-- 4. 列表用 v-for + :key -->
</template>

<script setup lang="ts">
// ===== 1. 第三方 import =====
import { ref, computed, onMounted } from "vue"
import api from "~/composables/utils/api"
import { showSuccess, showError, showConfirm } from "~/composables/utils/alert"

// ===== 2. Props & Emits =====
interface Props {
  propName: string
  optionalProp?: boolean
}

interface Emits {
  (e: "close"): void
  (e: "submit", data: SomeType): void
}

withDefaults(defineProps<Props>(), {
  optionalProp: false,
})

const emit = defineEmits<Emits>()

// ===== 3. 狀態 =====
const isLoading = ref(false)
const data = ref<SomeType | null>(null)

// ===== 4. Computed =====
const displayName = computed(() => ...)

// ===== 5. 函式 =====
async function handleSubmit() {
  isLoading.value = true
  try {
    const res = await api.post('/endpoint', payload)
    if (res.data?.success) {
      showSuccess('操作成功')
      emit('close')
    }
  } catch (err) {
    showError('操作失敗')
  } finally {
    isLoading.value = false
  }
}

// ===== 6. 生命週期 =====
onMounted(async () => {
  await fetchData()
})
</script>

<style scoped>
/* Mobile First CSS */
</style>
```

---

## 📋 Modal Component 規範（從 LoginModal.vue 分析）

Modal 必須使用 Teleport + Transition 組合：

```vue
<template>
  <Teleport to="body">
    <!-- 背景遮罩 -->
    <Transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click="emit('close')"></div>
    </Transition>

    <!-- 內容框 -->
    <Transition name="modal-slide">
      <div v-if="isOpen" class="modal-wrapper">
        <div class="modal-content">
          <button class="close-btn" @click="emit('close')" aria-label="關閉">
            <!-- SVG X 圖示 -->
          </button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
```

---

## 📄 Page 規範

### 標準 Page 結構

```vue
<template>
  <div class="[page-name]-page">
    <!-- ======== SECTION 1 ======== -->
    <section class="hero">
      <div class="hero-content">
        <p class="hero-eyebrow">副標題</p>
        <h1 class="hero-title">主標題</h1>
        <p class="hero-desc">描述文字</p>
      </div>
    </section>

    <!-- ======== SECTION 2 ======== -->
    <section class="features" id="features">
      <div class="section-header">
        <h2>段落標題</h2>
        <p class="section-desc">段落描述</p>
      </div>
      <!-- 內容 -->
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO 必須放最前面
useHead({
  title: '頁面標題',
  meta: [
    { name: 'description', content: '頁面描述' },
    { name: 'keywords', content: '關鍵字1, 關鍵字2' },
  ]
})

// definePageMeta（如需指定 layout 或 meta）
definePageMeta({
  // layout: 'admin',        // 若使用 admin layout
  // hideHeader: true,       // 隱藏 Header
})

// 業務邏輯...
</script>
```

---

## 🔧 Composable 規範

```ts
// composables/useXxx.ts
import { ref } from 'vue'
import api from '~/composables/utils/api'

export function useXxx() {
  // 狀態
  const data = ref<DataType[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 方法
  async function fetchData() {
    isLoading.value = true
    error.value = null
    try {
      const res = await api.get('/endpoint')
      if (res.data?.success) {
        data.value = res.data.data
      }
    } catch (err) {
      error.value = '載入失敗'
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    isLoading,
    error,
    fetchData,
  }
}
```

---

## 🏪 Pinia Store 規範（從 floorPlanStore.ts 分析）

```ts
// composables/xxxStore.ts
import { defineStore } from "pinia"
import { ref, reactive, computed } from "vue"
import api from "./utils/api"

export interface SomeType {
  id: number
  name: string
}

interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
}

export const useXxxStore = defineStore("xxx", () => {
  // state
  const items = ref<SomeType[]>([])
  const isLoading = ref(false)

  // getters
  const totalCount = computed(() => items.value.length)

  // actions
  async function fetchItems() {
    isLoading.value = true
    try {
      const res = await api.get('/items')
      if (res.data?.success) {
        items.value = res.data.data
      }
    } finally {
      isLoading.value = false
    }
  }

  return { items, isLoading, totalCount, fetchItems }
})
```

---

## 🔒 SSR 安全規範（重要）

瀏覽器 API（localStorage / window / document）必須用守衛：

```ts
// ✅ 正確
if (import.meta.client) {
  const stored = localStorage.getItem('key')
}

// ✅ 正確（composable 中）
if (import.meta.client) {
  window.addEventListener('storage', handler)
}

// ❌ 錯誤（SSR 會報錯）
const stored = localStorage.getItem('key')
```

---

## 🎨 CSS 規範

### 樣式作用域

```vue
<!-- ✅ 元件使用 scoped -->
<style scoped>
.my-component { ... }
</style>

<!-- ✅ 全域樣式放 app/assets/css/main.css -->
<!-- ✅ 第三方 z-index 覆蓋放 main.css -->
```

### CSS 變數命名

```css
/* 推薦使用 CSS 自訂屬性 */
:root {
  --color-primary: #c9a96e;
  --color-text: #2c2c2c;
  --font-heading: 'Noto Serif TC', serif;
  --font-body: 'Noto Sans TC', sans-serif;
  --radius-md: 0.5rem;
  --shadow-card: 0 4px 24px rgba(0,0,0,.08);
}
```

### Class 命名（BEM 風格）

```css
/* Block */
.feature-card { }

/* Element */
.feature-card__title { }
.feature-card__icon { }

/* Modifier */
.feature-card--featured { }
.feature-card--loading { }
```

---

## 🚫 禁止事項清單

```ts
// ❌ 禁止
import axios from 'axios'
axios.get('/api/xxx')

// ❌ 禁止（在 component/page 直接裸用 axios）
const res = await axios.post('/Login', form)

// ❌ 禁止
import Bootstrap from 'bootstrap'

// ❌ 禁止（固定 px 寬度，除非是 border / icon size）
width: 1200px;

// ✅ 正確
import api from "~/composables/utils/api"
const res = await api.post('/Login', form)
```
