<template>
  <div class="bo-page">
    <!-- ===== 頁首 ===== -->
    <header class="bo-page-header">
      <div>
        <p class="bo-kicker">Organization</p>
        <h1 class="bo-page-title">{{ t('page.member.brand') }}</h1>
      </div>
      <button class="bo-btn is-primary" @click="openCreate">＋ 新增品牌</button>
    </header>

    <!-- ===== 品牌列表 ===== -->
    <section class="bo-panel">
      <header class="bo-panel-header">
        <h2>品牌列表</h2>
        <span class="bo-pill">{{ brands.length }} 個品牌</span>
      </header>

      <div v-if="listLoading" class="bo-empty">載入中…</div>

      <p v-else-if="brands.length === 0" class="bo-empty">
        尚未建立任何品牌，點擊「新增品牌」開始。
      </p>

      <ul v-else class="brand-list" role="list">
        <li v-for="brand in brands" :key="brand.id" class="brand-card">
          <div class="brand-card-body">
            <div class="brand-logo-wrap">
              <img
                v-if="brand.logoUrl"
                :src="brand.logoUrl"
                class="brand-logo"
                :alt="`${brand.brandName} logo`"
                loading="lazy"
              />
              <div v-else class="brand-logo-placeholder" aria-hidden="true">
                {{ brand.brandName.charAt(0) }}
              </div>
            </div>
            <div class="brand-info">
              <h3 class="brand-name">{{ brand.brandName }}</h3>
              <p class="brand-company">{{ brand.companyName }}</p>
              <p class="brand-meta">
                <span v-if="brand.city">{{ brand.city }}</span>
                <span v-if="brand.city && brand.phone"> · </span>
                <span v-if="brand.phone">{{ brand.phone }}</span>
                <span v-if="brand.taxId"> · 統編 {{ brand.taxId }}</span>
              </p>
            </div>
          </div>
          <div class="brand-card-footer">
            <div class="brand-mode">
              <span class="brand-mode-label">營運模式：</span>
              <span v-if="brand.isMultiStore" class="mode-badge is-multi">多店管理</span>
              <span v-else class="mode-badge is-single">單店模式</span>
            </div>
            <div class="brand-card-actions">
              <NuxtLink v-if="brand.isMultiStore" to="/member/stores" class="bo-btn is-accent">管理分店</NuxtLink>
              <NuxtLink v-else to="/price" class="bo-btn is-upgrade">升級多店管理</NuxtLink>
              <button class="bo-btn is-ghost" type="button" @click="openEdit(brand)">編輯</button>
              <button class="bo-btn is-danger" type="button" @click="confirmDelete(brand)">刪除</button>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <!-- ===== 新增 / 編輯 Modal ===== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showModal" class="modal-overlay" role="dialog" aria-modal="true">
          <div class="modal-box">
            <header class="modal-header">
              <h2>{{ editingId ? '編輯品牌' : '新增品牌' }}</h2>
              <button class="modal-close" type="button" aria-label="關閉" @click="closeModal">✕</button>
            </header>

            <form class="bo-form" @submit.prevent="handleSave">
              <!-- Logo 上傳區 -->
              <div class="logo-upload-section">
                <div
                  class="logo-upload-area"
                  role="button"
                  tabindex="0"
                  @click="fileInputRef?.click()"
                  @keydown.enter="fileInputRef?.click()"
                >
                  <img
                    v-if="logoPreview"
                    :src="logoPreview"
                    class="logo-preview-img"
                    alt="Logo 預覽"
                  />
                  <div v-else class="logo-upload-placeholder">
                    <span class="upload-icon">🖼</span>
                    <span class="upload-label">點擊上傳品牌 Logo</span>
                    <span class="upload-hint">支援 JPG、PNG、WebP</span>
                  </div>
                </div>
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  class="visually-hidden"
                  @change="onFileSelected"
                />
                <p v-if="logoPreview" class="logo-change-hint">
                  點擊圖片可重新上傳
                </p>
              </div>

              <div class="form-grid">
                <label class="bo-field">
                  <span>品牌名稱 <em class="req">*</em></span>
                  <input v-model="form.brandName" type="text" placeholder="請輸入品牌名稱" required />
                </label>
                <label class="bo-field">
                  <span>公司名稱 <em class="req">*</em></span>
                  <input v-model="form.companyName" type="text" placeholder="請輸入公司名稱" required />
                </label>
                <label class="bo-field">
                  <span>統一編號</span>
                  <input v-model="form.taxId" type="text" maxlength="8" placeholder="8 碼統一編號" pattern="\d{8}" />
                </label>
                <label class="bo-field">
                  <span>縣市 <em class="req">*</em></span>
                  <div class="select-wrap">
                    <select v-model="form.city" required :disabled="citiesLoading">
                      <option value="" disabled>
                        {{ citiesLoading ? '載入縣市中…' : '請選擇縣市' }}
                      </option>
                      <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                    </select>
                  </div>
                </label>
                <label class="bo-field">
                  <span>聯絡電話</span>
                  <input v-model="form.phone" type="tel" placeholder="02-12345678" />
                </label>
                <label class="bo-field">
                  <span>聯絡信箱</span>
                  <input v-model="form.email" type="email" placeholder="service@example.com" />
                </label>
                <label class="bo-field field-full">
                  <span>地址</span>
                  <input v-model="form.address" type="text" placeholder="信義區測試路 1 號" />
                </label>
              </div>

              <div class="modal-actions">
                <button type="button" class="bo-btn is-ghost" @click="closeModal">取消</button>
                <button type="submit" class="bo-btn is-primary" :disabled="saving">
                  {{ saving ? '儲存中…' : (editingId ? '更新品牌' : '建立品牌') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== 圓形裁切 Modal ===== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showCropModal" class="crop-overlay" role="dialog" aria-modal="true">
          <div class="crop-box">
            <header class="crop-header">
              <h2>裁切品牌 Logo</h2>
            </header>
            <p class="crop-hint">拖曳移動圖片・滾輪 / 雙指縮放</p>
            <div class="crop-canvas-wrap">
              <canvas
                ref="cropCanvasRef"
                :width="CANVAS_SIZE"
                :height="CANVAS_SIZE"
                class="crop-canvas"
                @mousedown="onDragStart"
                @wheel.prevent="onWheel"
                @touchstart.prevent="onTouchStart"
                @touchmove.prevent="onTouchMove"
                @touchend="onTouchEnd"
              />
            </div>
            <div class="crop-actions">
              <button class="bo-btn is-ghost" type="button" @click="cancelCrop">取消</button>
              <button class="bo-btn is-primary" type="button" @click="applyCrop">確認裁切</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import api from '~/composables/utils/api'
import { showCustom, showConfirm } from '~/composables/utils/alert'
import { usePermissionStore } from '~/composables/usePermissionStore'

const { t } = useI18n()

const permStore = usePermissionStore()

useHead(() => ({ title: t('page.member.brand') }))

// ── Types ──────────────────────────────────────────────────────────────
interface Brand {
  id: number
  brandName: string
  companyName: string
  taxId: string
  logoUrl: string
  phone: string
  email: string
  address: string
  city: string
  isActive: boolean
  isMultiStore: boolean
}

interface ApiBrand {
  Id: number
  BrandName: string
  CompanyName: string
  TaxId: string
  LogoUrl: string
  Phone: string
  Email: string
  Address: string
  City?: string
  IsActive: boolean
  IsMultiStore: boolean
}

function mapBrand(b: ApiBrand): Brand {
  return {
    id: b.Id,
    brandName: b.BrandName,
    companyName: b.CompanyName,
    taxId: b.TaxId ?? '',
    logoUrl: b.LogoUrl ?? '',
    phone: b.Phone ?? '',
    email: b.Email ?? '',
    address: b.Address ?? '',
    city: b.City ?? '',
    isActive: b.IsActive,
    isMultiStore: b.IsMultiStore,
  }
}

function getApiErrorText(error: unknown, fallback: string) {
  if (!error || typeof error !== 'object') return fallback

  const data = (error as { response?: { data?: Record<string, unknown> | string } }).response?.data

  if (!data) return fallback
  if (typeof data === 'string' && data.trim()) return data

  const payload = data as Record<string, unknown>
  const detail = payload.detail ?? payload.Detail
  const message = payload.message ?? payload.Message
  const text = detail ?? message

  if (typeof text === 'string' && text.trim()) return text

  return fallback
}

// ── Brand List ──────────────────────────────────────────────────────────
const brands = ref<Brand[]>([])
const listLoading = ref(false)

async function loadBrands() {
  listLoading.value = true
  try {
    const res = await api.get('/brands/my')
    brands.value = (res.data?.Brands ?? []).map(mapBrand)
  } catch {
    await showCustom('載入失敗', '無法取得品牌列表，請稍後再試。', 'error')
  } finally {
    listLoading.value = false
  }
}

// ── Taiwan City Dropdown ────────────────────────────────────────────────
const cities = ref<string[]>([])
const citiesLoading = ref(false)

const FALLBACK_CITIES = [
  '臺北市', '新北市', '基隆市', '宜蘭縣', '桃園市',
  '新竹市', '新竹縣', '苗栗縣', '臺中市', '彰化縣',
  '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市',
  '高雄市', '屏東縣', '臺東縣', '花蓮縣', '澎湖縣',
  '金門縣', '連江縣',
]

async function loadCities() {
  citiesLoading.value = true
  try {
    const res = await fetch('https://api.nlsc.gov.tw/other/ListCounty')
    if (!res.ok) throw new Error('HTTP error')
    const xml = await res.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'text/xml')
    const nodes = doc.querySelectorAll('countyItem countyname')
    if (nodes.length === 0) throw new Error('empty')
    cities.value = Array.from(nodes).map(n => n.textContent ?? '').filter(Boolean)
  } catch {
    cities.value = FALLBACK_CITIES
  } finally {
    citiesLoading.value = false
  }
}

// ── Logo Upload & Crop ──────────────────────────────────────────────────
const CANVAS_SIZE = 320
const CIRCLE_RADIUS = 138

const fileInputRef = ref<HTMLInputElement | null>(null)
const cropCanvasRef = ref<HTMLCanvasElement | null>(null)
const showCropModal = ref(false)
const logoPreview = ref('')
const logoFile = ref<File | null>(null)

// crop state (mutable, no need for reactivity)
let cropImg: HTMLImageElement | null = null
let cropOffsetX = 0
let cropOffsetY = 0
let cropScale = 1
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let lastPinchDist: number | null = null

function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  input.value = ''

  const reader = new FileReader()
  reader.onload = (ev) => {
    const img = new Image()
    img.onload = () => {
      cropImg = img
      const minSide = Math.min(img.width, img.height)
      cropScale = (CIRCLE_RADIUS * 2) / minSide
      cropOffsetX = (CANVAS_SIZE - img.width * cropScale) / 2
      cropOffsetY = (CANVAS_SIZE - img.height * cropScale) / 2
      showCropModal.value = true
      nextTick(() => drawCropCanvas())
    }
    img.src = ev.target?.result as string
  }
  reader.readAsDataURL(file)
}

function drawCropCanvas() {
  const canvas = cropCanvasRef.value
  if (!canvas || !cropImg) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

  // Draw image
  ctx.drawImage(
    cropImg,
    cropOffsetX, cropOffsetY,
    cropImg.width * cropScale,
    cropImg.height * cropScale,
  )

  // Dark overlay with circular hole (evenodd fill)
  ctx.save()
  ctx.fillStyle = 'rgba(0, 0, 0, 0.52)'
  ctx.beginPath()
  ctx.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
  ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CIRCLE_RADIUS, 0, Math.PI * 2, true)
  ctx.fill('evenodd')

  // Circle border
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 2
  ctx.setLineDash([6, 3])
  ctx.beginPath()
  ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CIRCLE_RADIUS, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

// ── Canvas drag (mouse) ─────────────────────────────────────────────────
function getCanvasCoords(e: MouseEvent) {
  const canvas = cropCanvasRef.value!
  const rect = canvas.getBoundingClientRect()
  const sx = CANVAS_SIZE / rect.width
  return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sx }
}

function onDragStart(e: MouseEvent) {
  isDragging = true
  const { x, y } = getCanvasCoords(e)
  dragStartX = x - cropOffsetX
  dragStartY = y - cropOffsetY
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
}

function onDragMove(e: MouseEvent) {
  if (!isDragging || !cropCanvasRef.value) return
  const canvas = cropCanvasRef.value
  const rect = canvas.getBoundingClientRect()
  const sx = CANVAS_SIZE / rect.width
  cropOffsetX = (e.clientX - rect.left) * sx - dragStartX
  cropOffsetY = (e.clientY - rect.top) * sx - dragStartY
  drawCropCanvas()
}

function onDragEnd() {
  isDragging = false
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
}

function onWheel(e: WheelEvent) {
  const delta = e.deltaY > 0 ? 0.92 : 1.08
  const cx = CANVAS_SIZE / 2
  const cy = CANVAS_SIZE / 2
  cropOffsetX = cx + (cropOffsetX - cx) * delta
  cropOffsetY = cy + (cropOffsetY - cy) * delta
  cropScale *= delta
  drawCropCanvas()
}

// ── Canvas touch ────────────────────────────────────────────────────────
function getTouchCanvasCoord(t: Touch) {
  const canvas = cropCanvasRef.value!
  const rect = canvas.getBoundingClientRect()
  const sx = CANVAS_SIZE / rect.width
  return { x: (t.clientX - rect.left) * sx, y: (t.clientY - rect.top) * sx }
}

function onTouchStart(e: TouchEvent) {
  const t0 = e.touches[0]
  const t1 = e.touches[1]
  if (e.touches.length === 1 && t0) {
    isDragging = true
    lastPinchDist = null
    const { x, y } = getTouchCanvasCoord(t0)
    dragStartX = x - cropOffsetX
    dragStartY = y - cropOffsetY
  } else if (e.touches.length === 2 && t0 && t1) {
    isDragging = false
    const dx = t0.clientX - t1.clientX
    const dy = t0.clientY - t1.clientY
    lastPinchDist = Math.hypot(dx, dy)
  }
}

function onTouchMove(e: TouchEvent) {
  const t0 = e.touches[0]
  const t1 = e.touches[1]
  if (e.touches.length === 1 && isDragging && t0) {
    const { x, y } = getTouchCanvasCoord(t0)
    cropOffsetX = x - dragStartX
    cropOffsetY = y - dragStartY
    drawCropCanvas()
  } else if (e.touches.length === 2 && lastPinchDist !== null && t0 && t1) {
    const dx = t0.clientX - t1.clientX
    const dy = t0.clientY - t1.clientY
    const dist = Math.hypot(dx, dy)
    const delta = dist / lastPinchDist
    const cx = CANVAS_SIZE / 2
    const cy = CANVAS_SIZE / 2
    cropOffsetX = cx + (cropOffsetX - cx) * delta
    cropOffsetY = cy + (cropOffsetY - cy) * delta
    cropScale *= delta
    lastPinchDist = dist
    drawCropCanvas()
  }
}

function onTouchEnd() {
  isDragging = false
  lastPinchDist = null
}

function cancelCrop() {
  showCropModal.value = false
  cropImg = null
}

function applyCrop() {
  if (!cropImg) return
  const OUTPUT = 300
  const out = document.createElement('canvas')
  out.width = OUTPUT
  out.height = OUTPUT
  const ctx = out.getContext('2d')
  if (!ctx) return

  // Circular clip
  ctx.beginPath()
  ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2)
  ctx.clip()

  // Map circle back to image source coords
  const cx = CANVAS_SIZE / 2
  const cy = CANVAS_SIZE / 2
  const imgCx = (cx - cropOffsetX) / cropScale
  const imgCy = (cy - cropOffsetY) / cropScale
  const imgR = CIRCLE_RADIUS / cropScale

  ctx.drawImage(
    cropImg,
    imgCx - imgR, imgCy - imgR,
    imgR * 2, imgR * 2,
    0, 0,
    OUTPUT, OUTPUT,
  )

  out.toBlob((blob) => {
    if (!blob) return
    if (logoPreview.value) URL.revokeObjectURL(logoPreview.value)
    logoFile.value = new File([blob], 'logo.png', { type: 'image/png' })
    logoPreview.value = URL.createObjectURL(blob)
    showCropModal.value = false
    cropImg = null
  }, 'image/png')
}

// ── Modal / Form ────────────────────────────────────────────────────────
const showModal = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)

function emptyForm() {
  return {
    brandName: '',
    companyName: '',
    taxId: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  }
}

const form = reactive(emptyForm())

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm())
  logoPreview.value = ''
  logoFile.value = null
  showModal.value = true
}

// 台 ↔ 臺 正規化，讓選單值與儲存值能互相對應
function normalizeCity(c: string) {
  return c.replace(/臺/g, '台')
}

function openEdit(brand: Brand) {
  editingId.value = brand.id
  const matchedCity = cities.value.find(
    c => normalizeCity(c) === normalizeCity(brand.city)
  ) ?? brand.city
  Object.assign(form, {
    brandName: brand.brandName,
    companyName: brand.companyName,
    taxId: brand.taxId,
    phone: brand.phone,
    email: brand.email,
    address: brand.address,
    city: matchedCity,
  })
  logoPreview.value = brand.logoUrl
  logoFile.value = null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

// cities 載入完成後，若表單 city 還沒對應到選項，補做正規化比對
watch(cities, (list) => {
  if (!showModal.value || !form.city || list.length === 0) return
  const matched = list.find(c => normalizeCity(c) === normalizeCity(form.city))
  if (matched && matched !== form.city) form.city = matched
})

// ── CRUD ────────────────────────────────────────────────────────────────
async function handleSave() {
  saving.value = true
  try {
    const fd = new FormData()
    fd.append('brandName', form.brandName)
    fd.append('companyName', form.companyName)
    fd.append('phone', form.phone)
    fd.append('email', form.email)
    fd.append('address', form.address)
    fd.append('city', form.city)
    fd.append('taxId', form.taxId)
    if (logoFile.value) fd.append('logo', logoFile.value)

    if (editingId.value !== null) {
      await api.put(`/brands/${editingId.value}`, fd)
      await loadBrands()
      await permStore.reloadBrands()
      await showCustom('更新成功', '品牌資料已更新。', 'success')
    } else {
      await api.post('/brands/create', fd)
      await loadBrands()
      await permStore.reloadBrands()
      await showCustom('建立成功', '品牌已成功建立。', 'success')
    }
    closeModal()
  } catch (error) {
    await showCustom('儲存失敗', getApiErrorText(error, '請確認資料後再試。'), 'error')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(brand: Brand) {
  const result = await showConfirm(`確定要刪除「${brand.brandName}」嗎？此操作無法還原。`)
  if (result.isConfirmed) {
    try {
      // TODO: 確認後端刪除品牌的端點
      await api.delete(`/brands/${brand.id}`)
      brands.value = brands.value.filter(b => b.id !== brand.id)
      await permStore.reloadBrands()
      await showCustom('刪除成功', '品牌已移除。', 'success')
    } catch {
      await showCustom('刪除失敗', '請稍後再試。', 'error')
    }
  }
}

// ── Init / Cleanup ──────────────────────────────────────────────────────
onMounted(() => {
  loadBrands()
  loadCities()
})

onBeforeUnmount(() => {
  if (logoPreview.value) URL.revokeObjectURL(logoPreview.value)
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
})
</script>

<style scoped>
/* ── Layout ── */
.bo-page { display: grid; gap: 1.5rem; }

.bo-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.bo-kicker {
  color: var(--bo-accent, #d9b26f);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}
.bo-page-title {
  color: var(--bo-primary, #17334a);
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 900;
}

/* ── Panel ── */
.bo-panel {
  padding: 1.25rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 10px;
  background: #fff;
}
.bo-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--bo-border, #dfe7ec);
}
.bo-panel-header h2 { color: var(--bo-primary, #17334a); font-size: 1rem; font-weight: 900; }
.bo-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  color: var(--bo-primary, #17334a);
  background: var(--bo-primary-soft, #edf4f8);
  font-size: 0.78rem;
  font-weight: 900;
}

.bo-empty {
  padding: 2rem 0;
  text-align: center;
  color: #8a9dab;
  font-size: 0.92rem;
}

/* ── Brand List ── */
.brand-list {
  display: grid;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.brand-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 9px;
  background: #fafcfd;
  flex-wrap: wrap;
  transition: box-shadow 0.15s;
}
.brand-card:hover { box-shadow: 0 2px 10px rgba(23,51,74,0.08); }

.brand-card-body { display: flex; align-items: center; gap: 1rem; flex: 1; min-width: 0; }

.brand-logo-wrap { flex-shrink: 0; }
.brand-logo {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bo-border, #dfe7ec);
}
.brand-logo-placeholder {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--bo-primary-soft, #edf4f8);
  color: var(--bo-primary, #17334a);
  font-size: 1.2rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bo-border, #dfe7ec);
}

.brand-info { min-width: 0; }
.brand-name {
  color: var(--bo-primary, #17334a);
  font-size: 0.97rem;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.brand-company {
  color: #5a7080;
  font-size: 0.85rem;
  margin-top: 0.15rem;
}
.brand-meta {
  color: #8a9dab;
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

.brand-card-actions { display: flex; gap: 0.5rem; flex-shrink: 0; flex-wrap: wrap; }

/* ── Brand Mode ── */
.brand-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  width: 100%;
  padding-top: 0.75rem;
  margin-top: 0.25rem;
  border-top: 1px solid var(--bo-border, #dfe7ec);
}
.brand-mode {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--bo-primary, #17334a);
}
.brand-mode-label { color: #5a7080; font-weight: 700; }
.mode-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 900;
}
.mode-badge.is-single { background: #f0f4f8; color: #5a7080; }
.mode-badge.is-multi  { background: #e8f5e9; color: #2e7d32; }

/* ── Buttons ── */
.bo-btn {
  min-height: 2.5rem;
  padding: 0 1.2rem;
  border: none;
  border-radius: 7px;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 900;
  cursor: pointer;
  transition: opacity 0.15s, background 0.15s;
  white-space: nowrap;
}
.bo-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.bo-btn.is-primary { color: #fff; background: var(--bo-primary, #17334a); }
.bo-btn.is-primary:hover:not(:disabled) { opacity: 0.85; }
.bo-btn.is-ghost {
  color: var(--bo-primary, #17334a);
  background: transparent;
  border: 1px solid var(--bo-border, #dfe7ec);
}
.bo-btn.is-ghost:hover { background: var(--bo-primary-soft, #edf4f8); }
.bo-btn.is-danger { color: #c0392b; background: #fdecea; border: 1px solid #f5c6c2; }
.bo-btn.is-danger:hover { background: #fad4d0; }
.bo-btn.is-accent { color: #fff; background: #2e7d32; border: none; text-decoration: none; display: inline-flex; align-items: center; }
.bo-btn.is-accent:hover { opacity: 0.85; }
.bo-btn.is-upgrade { color: #b8860b; background: #fff8e1; border: 1px solid #ffe082; text-decoration: none; display: inline-flex; align-items: center; }
.bo-btn.is-upgrade:hover { background: #fff3c4; }

/* ── Brand Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 30, 45, 0.45);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9000;
}
.modal-box {
  width: 100%;
  max-width: 40rem;
  max-height: 90dvh;
  overflow-y: auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(15,30,45,0.18);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid var(--bo-border, #dfe7ec);
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}
.modal-header h2 { color: var(--bo-primary, #17334a); font-size: 1rem; font-weight: 900; }
.modal-close {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #5a7080;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.modal-close:hover { background: var(--bo-primary-soft, #edf4f8); }

/* ── Logo Upload ── */
.logo-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1.25rem;
  padding-top: 1.25rem;
}
.logo-upload-area {
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  border: 2px dashed var(--bo-border, #dfe7ec);
  background: #fafcfd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.15s, background 0.15s;
  flex-shrink: 0;
}
.logo-upload-area:hover {
  border-color: var(--bo-accent, #d9b26f);
  background: #fffbf4;
}
.logo-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}
.logo-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem;
  text-align: center;
}
.upload-icon { font-size: 1.6rem; line-height: 1; }
.upload-label { font-size: 0.75rem; font-weight: 800; color: var(--bo-primary, #17334a); }
.upload-hint { font-size: 0.68rem; color: #8a9dab; }
.logo-change-hint { font-size: 0.75rem; color: #8a9dab; }

/* ── Form ── */
.bo-form { padding: 1.25rem; display: grid; gap: 1.25rem; }
.form-grid { display: grid; gap: 1rem; }
.bo-field { display: grid; gap: 0.4rem; font-weight: 800; color: var(--bo-primary, #17334a); font-size: 0.92rem; }
.bo-field input,
.bo-field select {
  width: 100%;
  min-height: 2.75rem;
  padding: 0 0.8rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 7px;
  color: var(--bo-text, #20303c);
  background: #fff;
  font: inherit;
  font-size: 0.92rem;
}
.bo-field input:focus,
.bo-field select:focus {
  border-color: var(--bo-accent, #d9b26f);
  outline: 3px solid rgba(217,178,111,0.18);
}
.bo-field select:disabled { background: #f5f7f8; color: #9aabb5; }
.select-wrap { position: relative; }
.select-wrap select { appearance: none; padding-right: 2.2rem; cursor: pointer; }
.select-wrap::after {
  content: '▾';
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #8a9dab;
  font-size: 0.85rem;
}
.req { color: #c0392b; font-style: normal; margin-left: 0.15rem; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* ── Crop Modal ── */
.crop-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 15, 28, 0.72);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 10000;
}
.crop-box {
  width: 100%;
  max-width: 22rem;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 12px 50px rgba(0,0,0,0.35);
  overflow: hidden;
}
.crop-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--bo-border, #dfe7ec);
}
.crop-header h2 { color: var(--bo-primary, #17334a); font-size: 0.97rem; font-weight: 900; }
.crop-hint {
  text-align: center;
  font-size: 0.78rem;
  color: #8a9dab;
  padding: 0.6rem 1rem 0;
}
.crop-canvas-wrap {
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: center;
}
.crop-canvas {
  display: block;
  width: 100%;
  max-width: 320px;
  height: auto;
  border-radius: 8px;
  cursor: grab;
  touch-action: none;
  user-select: none;
  background: #111;
}
.crop-canvas:active { cursor: grabbing; }
.crop-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 0.75rem 1rem 1rem;
}

/* ── Transition ── */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }

/* ── RWD ── */
@media (min-width: 36em) {
  .form-grid { grid-template-columns: repeat(2, 1fr); }
  .field-full { grid-column: 1 / -1; }
}
</style>
