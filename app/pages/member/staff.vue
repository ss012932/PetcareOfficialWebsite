<template>
  <div class="bo-page">
    <!-- ===== 頁首：控制員工統計與功能入口 ===== -->
    <header class="bo-page-header">
      <div>
        <p class="bo-kicker">Human Resources</p>
        <h1 class="bo-page-title">{{ t("page.member.staff") }}</h1>
      </div>

      <div class="bo-header-actions">
        <span class="bo-pill">{{ activeCount }} / {{ staffs.length }} 位在職</span>

        <NuxtLink to="/member/roles" class="bo-btn is-ghost">
          <Icon name="fa6-solid:shield-halved" aria-hidden="true" />
          角色權限管理
        </NuxtLink>

        <button class="bo-btn is-primary" @click="openAdd">
          <Icon name="fa6-solid:plus" aria-hidden="true" />
          新增員工
        </button>
      </div>
    </header>

    <!-- ===== 員工清單：一位員工只顯示一列，院所用標籤呈現 ===== -->
    <section class="bo-panel">
      <div v-if="pending" class="bo-empty">載入中…</div>

      <div v-else-if="staffs.length === 0" class="bo-empty">
        <Icon name="fa6-solid:users" class="bo-empty-icon" aria-hidden="true" />
        <p>尚未建立任何員工帳號</p>
      </div>

      <ul v-else class="staff-list" role="list">
        <li
          v-for="staff in staffs"
          :key="staff.StaffId"
          class="staff-row"
          :class="{ 'is-disabled': !staff.IsActive }"
        >
          <span class="staff-avatar" aria-hidden="true">
            {{ (staff.FullName || staff.Email).slice(0, 1).toUpperCase() }}
          </span>

          <div class="staff-content">
            <div class="staff-summary">
              <div class="staff-heading">
                <strong>{{ staff.FullName }}</strong>
                <span>{{ staff.JobTitle || "未設定職稱" }}</span>
              </div>

              <div class="staff-identity">
                <span>{{ staff.Email }}</span>
                <span>{{ staff.Account ? `帳號：${staff.Account}` : "帳號尚未啟用" }}</span>
              </div>
            </div>

            <div class="assignment-tags" aria-label="員工院所指派">
              <span
                v-for="assignment in staff.StoreAssignments"
                :key="assignment.StoreId"
                class="assignment-tag"
                :class="{ 'is-primary': assignment.IsPrimary }"
              >
                <Icon
                  :name="assignment.IsPrimary ? 'fa6-solid:star' : 'fa6-solid:house-medical'"
                  aria-hidden="true"
                />
                {{ assignment.StoreName }}
                <small>{{ assignment.RoleName || "未設定角色" }}</small>
                <small v-if="assignment.IsAdmin">管理員</small>
              </span>
            </div>
          </div>

          <div class="staff-actions">
            <span class="bo-pill" :class="staff.IsActive ? 'is-success' : 'is-muted'">
              {{ staff.IsActive ? "在職" : "停用" }}
            </span>

            <button class="bo-btn is-ghost is-sm" title="編輯員工" @click="openEdit(staff)">
              <Icon name="fa6-solid:pen" aria-hidden="true" />
              編輯
            </button>

            <button
              class="bo-btn is-ghost is-sm"
              :title="staff.IsActive ? '停用此品牌任職權限' : '啟用此品牌任職權限'"
              @click="toggleActive(staff)"
            >
              <Icon
                :name="staff.IsActive ? 'fa6-solid:ban' : 'fa6-solid:rotate-left'"
                aria-hidden="true"
              />
              {{ staff.IsActive ? "停用" : "啟用" }}
            </button>

            <button class="bo-btn is-danger is-sm" title="從目前品牌移除" @click="confirmRemove(staff)">
              <Icon name="fa6-solid:trash" aria-hidden="true" />
              移除
            </button>
          </div>
        </li>
      </ul>
    </section>

    <!-- ===== 員工 Modal：控制基本資料與多院所指派 ===== -->
    <Teleport to="body">
      <!-- 點擊遮罩不關閉，避免輸入資料時誤觸造成內容遺失。 -->
      <div v-if="showModal" class="bo-modal-overlay">
        <div class="bo-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <header class="bo-modal-header">
            <div>
              <p class="bo-modal-kicker">Staff Assignment</p>
              <h2 id="modal-title">{{ isEditMode ? "編輯員工" : "新增員工" }}</h2>
            </div>
            <button class="bo-modal-close" aria-label="關閉" @click="closeModal">×</button>
          </header>

          <form class="bo-form" @submit.prevent="handleSave">
            <!-- ===== 基本資料 ===== -->
            <section class="form-section">
              <header class="form-section-header">
                <div>
                  <h3>員工資料</h3>
                  <p>同一個 Email 在 PetCare 只會建立一組登入帳號。</p>
                </div>
              </header>

              <div class="basic-grid">
                <label class="bo-field">
                  <span>姓名 <em>*</em></span>
                  <input v-model.trim="form.fullName" type="text" maxlength="50" placeholder="請輸入姓名" required>
                </label>

                <label class="bo-field">
                  <span>手機 <em>*</em></span>
                  <input
                    v-model.trim="form.phone"
                    type="tel"
                    placeholder="0912345678"
                    inputmode="numeric"
                    pattern="09[0-9]{8}"
                    maxlength="10"
                    required
                  >
                </label>

                <label class="bo-field">
                  <span>Email <em>*</em></span>
                  <input
                    v-model.trim="form.email"
                    type="email"
                    maxlength="100"
                    placeholder="staff@example.com"
                    :disabled="isEditMode"
                    required
                  >
                  <small v-if="isEditMode" class="bo-field-hint">
                    Email 是全系統唯一身分識別，建立後不可修改。
                  </small>
                  <small v-else class="bo-field-hint">
                    若此 Email 已在其他品牌使用，系統會沿用原帳號，只新增目前品牌與院所權限。
                  </small>
                </label>

                <label v-if="isEditMode" class="bo-field">
                  <span>登入帳號</span>
                  <input v-model="form.account" type="text" placeholder="尚未由員工設定" disabled>
                  <small class="bo-field-hint">登入帳號由員工自行設定，管理者不能修改。</small>
                </label>

                <label class="bo-field basic-grid__wide">
                  <span>目前品牌職稱</span>
                  <input
                    v-model.trim="form.jobTitle"
                    type="text"
                    maxlength="50"
                    placeholder="例如：主治獸醫師、護理師"
                  >
                  <small class="bo-field-hint">此職稱只套用目前品牌，不影響員工在其他品牌的職稱。</small>
                </label>

                <div class="salary-section basic-grid__wide">
                  <div class="salary-section-heading">
                    <div>
                      <strong>目前品牌薪資設定</strong>
                      <small>計薪方式與金額只套用目前品牌，不影響員工在其他品牌的薪資。</small>
                    </div>
                  </div>

                  <div class="salary-grid">
                    <label class="bo-field">
                      <span>計薪方式 <em>*</em></span>
                      <select v-model="form.salaryType" required>
                        <option value="Monthly">月薪制</option>
                        <option value="Hourly">時薪制</option>
                      </select>
                      <small class="bo-field-hint">
                        {{ form.salaryType === "Monthly" ? "每月固定薪資，後續加班費可用月薪 ÷ 240 推算平日時薪。" : "依實際核准工作時數與約定時薪計算。" }}
                      </small>
                    </label>

                    <label class="bo-field">
                      <span>{{ form.salaryType === "Monthly" ? "月薪" : "約定時薪" }} <em>*</em></span>
                      <div class="salary-money-input">
                        <span>NT$</span>
                        <input
                          v-model.number="form.salaryAmount"
                          type="number"
                          min="1"
                          step="1"
                          :placeholder="form.salaryType === 'Monthly' ? '例如：36000' : '例如：200'"
                          required
                        >
                      </div>
                      <small class="bo-field-hint">
                        {{ form.salaryType === "Monthly" ? "請輸入員工在目前品牌的每月薪資。" : "請輸入勞雇雙方約定的每小時工資額。" }}
                      </small>
                    </label>

                    <label class="bo-field">
                      <span>健保眷屬人數</span>
                      <select v-model.number="form.nhiDependentCount">
                        <option :value="0">0 人</option>
                        <option :value="1">1 人</option>
                        <option :value="2">2 人</option>
                        <option :value="3">3 人以上（保費最多計 3 人）</option>
                      </select>
                      <small class="bo-field-hint">用於計算員工健保自付額，不含員工本人。</small>
                    </label>

                    <label class="bo-field">
                      <span>勞退個人自提率</span>
                      <div class="salary-money-input salary-rate-input">
                        <input v-model.number="form.employeePensionRate" type="number" min="0" max="6" step="0.5">
                        <span>%</span>
                      </div>
                      <small class="bo-field-hint">員工可自願提繳 0～6%；雇主提繳 6% 另計，不會從薪資扣除。</small>
                    </label>
                  </div>

                  <div class="insurance-options" aria-label="投保設定">
                    <label><input v-model="form.laborInsuranceEnabled" type="checkbox"><span>由目前品牌投保勞保</span></label>
                    <label><input v-model="form.employmentInsuranceEnabled" type="checkbox"><span>由目前品牌投保就保</span></label>
                    <label><input v-model="form.healthInsuranceEnabled" type="checkbox"><span>由目前品牌投保健保</span></label>
                  </div>
                </div>
              </div>
            </section>

            <!-- ===== 多院所指派 ===== -->
            <section class="form-section">
              <header class="form-section-header">
                <div>
                  <h3>院所與角色指派 <em>*</em></h3>
                  <p>可同時選擇多間院所，且每間院所可以設定不同角色。</p>
                </div>
                <span class="selection-count">已選 {{ selectedAssignmentCount }} 間</span>
              </header>

              <div v-if="storePending || rolePending" class="assignment-loading">
                院所與角色載入中…
              </div>

              <div v-else-if="storeAssignments.length === 0" class="assignment-loading">
                目前品牌沒有可指派的院所。
              </div>

              <div v-else class="assignment-table-wrap">
                <table class="assignment-table">
                  <thead>
                    <tr>
                      <th>選取</th>
                      <th>院所</th>
                      <th>角色</th>
                      <th>主要院所</th>
                      <th>管理員</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="assignment in storeAssignments"
                      :key="assignment.storeId"
                      :class="{ 'is-selected': assignment.selected }"
                    >
                      <td data-label="選取">
                        <input
                          v-model="assignment.selected"
                          class="assignment-checkbox"
                          type="checkbox"
                          :aria-label="`指派到 ${assignment.storeName}`"
                          @change="handleAssignmentSelection(assignment)"
                        >
                      </td>
                      <td data-label="院所">
                        <strong>{{ assignment.storeName }}</strong>
                      </td>
                      <td data-label="角色">
                        <select v-model.number="assignment.roleId" :disabled="!assignment.selected" required>
                          <option v-for="role in roleOptions" :key="role.id" :value="role.id">
                            {{ role.name }}
                          </option>
                        </select>
                      </td>
                      <td data-label="主要院所">
                        <label class="choice-control">
                          <input
                            :checked="assignment.isPrimary"
                            type="radio"
                            name="primary-store"
                            :disabled="!assignment.selected"
                            @change="setPrimaryStore(assignment.storeId)"
                          >
                          <span>{{ assignment.isPrimary ? "主要" : "設為主要" }}</span>
                        </label>
                      </td>
                      <td data-label="管理員">
                        <label class="choice-control">
                          <input v-model="assignment.isAdmin" type="checkbox" :disabled="!assignment.selected">
                          <span>{{ assignment.isAdmin ? "是" : "否" }}</span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <div class="bo-form-actions">
              <button type="button" class="bo-btn is-ghost" @click="closeModal">取消</button>
              <button type="submit" class="bo-btn is-primary" :disabled="saving || !canSubmit">
                {{ saving ? (isEditMode ? "儲存中…" : "建立中…") : (isEditMode ? "儲存變更" : "建立員工") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue"
import { showCustom } from "~/composables/utils/alert"
import api from "~/composables/utils/api"
import { usePermissionStore } from "~/composables/usePermissionStore"

const { t } = useI18n()

definePageMeta({
  middleware: ["backoffice-auth", "brand-feature"],
  brandFeature: "subscription",
})

useHead(() => ({ title: t("page.member.staff") }))

interface StaffStoreAssignment {
  StoreId: number
  StoreName: string
  StaffsRoleId: number | null
  RoleName: string | null
  IsPrimary: boolean
  IsActive: boolean
  IsAdmin: boolean
}

interface Staff {
  StaffId: number
  FullName: string
  Phone: string | null
  Email: string
  Account: string | null
  JobTitle: string | null
  SalaryType: "Monthly" | "Hourly"
  SalaryAmount: number
  NhiDependentCount: number
  EmployeePensionRate: number
  LaborInsuranceEnabled: boolean
  EmploymentInsuranceEnabled: boolean
  HealthInsuranceEnabled: boolean
  IsActive: boolean
  CreateDate: string
  StoreAssignments: StaffStoreAssignment[]
}

interface StaffRoleApiItem {
  Id: number
  RoleName: string
}

interface StoreApiItem {
  Id: number
  Name: string
}

interface StoreAssignmentForm {
  storeId: number
  storeName: string
  selected: boolean
  roleId: number
  isPrimary: boolean
  isAdmin: boolean
}

const permStore = usePermissionStore()
await permStore.load()

const activeBrandId = computed(() => permStore.brandId)

const { data: roleData, pending: rolePending } = await useAsyncData(
  "member-staff-role-options",
  async () => {
    const brandId = activeBrandId.value
    if (!brandId) return [] as StaffRoleApiItem[]

    const res = await api.get(`/staff/roles/${brandId}`)
    return (res.data?.data as StaffRoleApiItem[]) ?? []
  },
  { server: false, watch: [activeBrandId] },
)

const roleOptions = computed(() =>
  (roleData.value ?? []).map((role) => ({ id: role.Id, name: role.RoleName })),
)

const { data: storeData, pending: storePending } = await useAsyncData(
  "member-staff-store-options",
  async () => {
    const brandId = activeBrandId.value
    if (!brandId) return [] as StoreApiItem[]

    const res = await api.get(`/stores/my/brand/${brandId}`)
    return (res.data?.stores as StoreApiItem[]) ?? []
  },
  { server: false, watch: [activeBrandId] },
)

const storeOptions = computed(() =>
  (storeData.value ?? []).map((store) => ({ id: store.Id, name: store.Name })),
)

const { data: staffData, pending, refresh } = await useAsyncData(
  "member-staffs",
  async () => {
    const brandId = activeBrandId.value
    if (!brandId) return [] as Staff[]

    const res = await api.get(`/staff/brand/${brandId}`)
    return (res.data?.data as Staff[]) ?? []
  },
  { server: false, watch: [activeBrandId] },
)

const staffs = computed<Staff[]>(() => staffData.value ?? [])
const activeCount = computed(() => staffs.value.filter((staff) => staff.IsActive).length)

const showModal = ref(false)
const saving = ref(false)
const editTarget = ref<Staff | null>(null)
const isEditMode = computed(() => Boolean(editTarget.value))

const form = reactive({
  fullName: "",
  phone: "",
  email: "",
  account: "",
  jobTitle: "",
  salaryType: "Monthly" as "Monthly" | "Hourly",
  salaryAmount: 0,
  nhiDependentCount: 0,
  employeePensionRate: 0,
  laborInsuranceEnabled: true,
  employmentInsuranceEnabled: true,
  healthInsuranceEnabled: true,
})

const storeAssignments = ref<StoreAssignmentForm[]>([])

const selectedAssignments = computed(() =>
  storeAssignments.value.filter((assignment) => assignment.selected),
)

const selectedAssignmentCount = computed(() => selectedAssignments.value.length)

const canSubmit = computed(() =>
  selectedAssignmentCount.value > 0 &&
  selectedAssignments.value.filter((assignment) => assignment.isPrimary).length === 1 &&
  selectedAssignments.value.every((assignment) => assignment.roleId > 0),
)

/**
 * 建立所有院所的表單列，沒有被指派的院所仍會顯示但不勾選。
 */
function buildAssignmentRows(staff?: Staff): StoreAssignmentForm[] {
  const existingMap = new Map(
    (staff?.StoreAssignments ?? []).map((assignment) => [assignment.StoreId, assignment]),
  )
  const defaultRoleId = roleOptions.value[0]?.id ?? 0

  const rows = storeOptions.value.map((store) => {
    const existing = existingMap.get(store.id)
    return {
      storeId: store.id,
      storeName: store.name,
      selected: Boolean(existing),
      roleId: existing?.StaffsRoleId ?? defaultRoleId,
      isPrimary: existing?.IsPrimary ?? false,
      isAdmin: existing?.IsAdmin ?? false,
    }
  })

  if (!staff && rows[0]) {
    rows[0].selected = true
    rows[0].isPrimary = true
  }

  return rows
}

function openAdd(): void {
  editTarget.value = null
  form.fullName = ""
  form.phone = ""
  form.email = ""
  form.account = ""
  form.jobTitle = ""
  form.salaryType = "Monthly"
  form.salaryAmount = 0
  form.nhiDependentCount = 0
  form.employeePensionRate = 0
  form.laborInsuranceEnabled = true
  form.employmentInsuranceEnabled = true
  form.healthInsuranceEnabled = true
  storeAssignments.value = buildAssignmentRows()
  showModal.value = true
}

function openEdit(staff: Staff): void {
  editTarget.value = staff
  form.fullName = staff.FullName
  form.phone = staff.Phone ?? ""
  form.email = staff.Email
  form.account = staff.Account ?? ""
  form.jobTitle = staff.JobTitle ?? ""
  form.salaryType = staff.SalaryType === "Hourly" ? "Hourly" : "Monthly"
  form.salaryAmount = Number(staff.SalaryAmount ?? 0)
  form.nhiDependentCount = Math.min(3, Math.max(0, Number(staff.NhiDependentCount ?? 0)))
  form.employeePensionRate = Math.min(6, Math.max(0, Number(staff.EmployeePensionRate ?? 0)))
  form.laborInsuranceEnabled = staff.LaborInsuranceEnabled !== false
  form.employmentInsuranceEnabled = staff.EmploymentInsuranceEnabled !== false
  form.healthInsuranceEnabled = staff.HealthInsuranceEnabled !== false
  storeAssignments.value = buildAssignmentRows(staff)
  showModal.value = true
}

function closeModal(): void {
  showModal.value = false
  editTarget.value = null
  storeAssignments.value = []
}

/**
 * 勾選第一間院所時自動設成主要院所；取消主要院所時把主要資格移給下一間。
 */
function handleAssignmentSelection(changed: StoreAssignmentForm): void {
  if (changed.selected) {
    if (!changed.roleId) changed.roleId = roleOptions.value[0]?.id ?? 0
    if (!selectedAssignments.value.some((assignment) => assignment.isPrimary)) {
      setPrimaryStore(changed.storeId)
    }
    return
  }

  changed.isAdmin = false
  const wasPrimary = changed.isPrimary
  changed.isPrimary = false

  if (wasPrimary) {
    const next = selectedAssignments.value[0]
    if (next) setPrimaryStore(next.storeId)
  }
}

function setPrimaryStore(storeId: number): void {
  for (const assignment of storeAssignments.value) {
    assignment.isPrimary = assignment.selected && assignment.storeId === storeId
  }
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  const source = error as {
    response?: { data?: { detail?: string; message?: string } }
    message?: string
  }

  return source.response?.data?.detail
    ?? source.response?.data?.message
    ?? source.message
    ?? fallback
}

async function handleSave(): Promise<void> {
  const brandId = activeBrandId.value
  if (!brandId) {
    await showCustom("操作失敗", "目前尚未選擇品牌。", "error")
    return
  }

  if (!/^09\d{8}$/.test(form.phone)) {
    await showCustom("資料格式不正確", "手機格式需為 09 開頭且共 10 碼。", "warning")
    return
  }

  if (!Number.isFinite(form.salaryAmount) || form.salaryAmount <= 0) {
    await showCustom(
      "薪資設定不完整",
      `請輸入正確的${form.salaryType === "Monthly" ? "月薪" : "約定時薪"}，金額必須大於 0。`,
      "warning",
    )
    return
  }

  if (!Number.isInteger(form.nhiDependentCount) || form.nhiDependentCount < 0 || form.nhiDependentCount > 3) {
    await showCustom("健保設定不正確", "健保眷屬人數必須介於 0 到 3 人。", "warning")
    return
  }

  if (!Number.isFinite(form.employeePensionRate) || form.employeePensionRate < 0 || form.employeePensionRate > 6) {
    await showCustom("勞退設定不正確", "員工勞退個人自提率必須介於 0% 到 6%。", "warning")
    return
  }

  if (!canSubmit.value) {
    await showCustom(
      "院所指派不完整",
      "請至少選擇一間院所、為每間院所設定角色，並且只能指定一間主要院所。",
      "warning",
    )
    return
  }

  const storeAssignmentPayload = selectedAssignments.value.map((assignment) => ({
    storeId: assignment.storeId,
    staffsRoleId: assignment.roleId,
    isPrimary: assignment.isPrimary,
    isAdmin: assignment.isAdmin,
  }))

  saving.value = true
  try {
    const isEditing = isEditMode.value
    const response = isEditing && editTarget.value
      ? await api.put(`/staff/${editTarget.value.StaffId}`, {
          fullName: form.fullName,
          phone: form.phone,
          email: editTarget.value.Email,
          account: editTarget.value.Account,
          jobTitle: form.jobTitle,
          salaryType: form.salaryType,
          salaryAmount: form.salaryAmount,
          nhiDependentCount: form.nhiDependentCount,
          employeePensionRate: form.employeePensionRate,
          laborInsuranceEnabled: form.laborInsuranceEnabled,
          employmentInsuranceEnabled: form.employmentInsuranceEnabled,
          healthInsuranceEnabled: form.healthInsuranceEnabled,
          brandId,
          storeAssignments: storeAssignmentPayload,
        })
      : await api.post("/staff", {
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          jobTitle: form.jobTitle,
          salaryType: form.salaryType,
          salaryAmount: form.salaryAmount,
          nhiDependentCount: form.nhiDependentCount,
          employeePensionRate: form.employeePensionRate,
          laborInsuranceEnabled: form.laborInsuranceEnabled,
          employmentInsuranceEnabled: form.employmentInsuranceEnabled,
          healthInsuranceEnabled: form.healthInsuranceEnabled,
          brandId,
          storeAssignments: storeAssignmentPayload,
        })

    if (!response.data?.success) {
      throw new Error(response.data?.message || "員工資料儲存失敗。")
    }

    const successMessage = response.data?.message
      || (isEditing ? `${form.fullName} 資料已更新。` : `${form.fullName} 已加入員工名單。`)

    closeModal()
    await refresh()
    await showCustom(isEditing ? "儲存成功" : "建立成功", successMessage, "success")
  } catch (error) {
    await showCustom(
      isEditMode.value ? "儲存失敗" : "建立失敗",
      getApiErrorMessage(error, "請確認資料後再試一次。"),
      "error",
    )
  } finally {
    saving.value = false
  }
}

async function toggleActive(staff: Staff): Promise<void> {
  const action = staff.IsActive ? "停用" : "啟用"
  const brandId = activeBrandId.value
  if (!brandId) {
    await showCustom(`${action}失敗`, "目前尚未選擇品牌。", "error")
    return
  }

  try {
    await api.patch(`/staff/${staff.StaffId}/active?brandId=${brandId}`, {
      isActive: !staff.IsActive,
    })
    await refresh()
    await showCustom(
      `${action}成功`,
      `${staff.FullName} 在目前品牌的院所權限已${action}，其他品牌不受影響。`,
      "success",
    )
  } catch (error) {
    await showCustom(`${action}失敗`, getApiErrorMessage(error, "操作失敗，請稍後再試。"), "error")
  }
}

async function confirmRemove(staff: Staff): Promise<void> {
  const { default: Swal } = await import("sweetalert2")
  const result = await Swal.fire({
    title: `從目前品牌移除 ${staff.FullName}？`,
    text: "只會移除此品牌與院所權限；員工在其他品牌的帳號與權限不受影響。",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確認移除",
    cancelButtonText: "取消",
    confirmButtonColor: "#c0392b",
  })

  if (!result.isConfirmed) return

  const brandId = activeBrandId.value
  if (!brandId) {
    await showCustom("移除失敗", "目前尚未選擇品牌。", "error")
    return
  }

  try {
    await api.delete(`/staff/${staff.StaffId}?brandId=${brandId}`)
    await refresh()
    await showCustom("移除成功", `${staff.FullName} 已從目前品牌移除。`, "success")
  } catch (error) {
    await showCustom("移除失敗", getApiErrorMessage(error, "操作失敗，請稍後再試。"), "error")
  }
}
</script>

<style scoped>
.bo-page {
  display: grid;
  gap: 1.5rem;
}

.bo-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.bo-kicker,
.bo-modal-kicker {
  margin: 0 0 0.25rem;
  color: var(--bo-accent, #d9b26f);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.bo-page-title {
  margin: 0;
  color: var(--bo-primary, #17334a);
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 900;
}

.bo-header-actions,
.staff-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.bo-panel {
  padding: clamp(0.8rem, 2vw, 1.25rem);
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 10px;
  background: #fff;
}

.bo-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: var(--bo-muted, #6b7882);
}

.bo-empty-icon {
  font-size: 2.5rem;
  opacity: 0.3;
}

.staff-list {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.staff-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 10px;
  background: #fafbfc;
  transition: opacity 0.2s, border-color 0.2s;
}

.staff-row:hover {
  border-color: #c8d5dc;
}

.staff-row.is-disabled {
  opacity: 0.58;
}

.staff-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--bo-primary-soft, #edf4f8);
  color: var(--bo-primary, #17334a);
  font-weight: 900;
}

.staff-content {
  min-width: 0;
  display: grid;
  gap: 0.65rem;
}

.staff-summary {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.staff-heading,
.staff-identity {
  display: grid;
  gap: 0.15rem;
}

.staff-heading strong {
  color: var(--bo-primary, #17334a);
  font-weight: 900;
}

.staff-heading span,
.staff-identity span {
  color: var(--bo-muted, #6b7882);
  font-size: 0.8rem;
}

.staff-identity {
  text-align: right;
}

.assignment-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.assignment-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.32rem 0.55rem;
  border: 1px solid #dbe5e8;
  border-radius: 999px;
  background: #fff;
  color: #40555e;
  font-size: 0.76rem;
  font-weight: 800;
}

.assignment-tag.is-primary {
  border-color: #dec58f;
  background: #fff8e9;
}

.assignment-tag small {
  padding-left: 0.35rem;
  border-left: 1px solid currentColor;
  opacity: 0.72;
  font-size: 0.68rem;
}

.bo-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  color: var(--bo-primary, #17334a);
  background: var(--bo-primary-soft, #edf4f8);
  font-size: 0.78rem;
  font-weight: 900;
  white-space: nowrap;
}

.bo-pill.is-success {
  color: #14633f;
  background: #e7f6ee;
}

.bo-pill.is-muted {
  color: var(--bo-muted, #6b7882);
  background: #f0f0f0;
}

.bo-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 2.5rem;
  padding: 0 1.1rem;
  border: 1px solid transparent;
  border-radius: 7px;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 900;
  cursor: pointer;
  text-decoration: none;
}

.bo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bo-btn.is-primary {
  color: #fff;
  background: var(--bo-primary, #17334a);
  border-color: var(--bo-primary, #17334a);
}

.bo-btn.is-ghost {
  color: var(--bo-primary, #17334a);
  background: transparent;
  border-color: var(--bo-border, #dfe7ec);
}

.bo-btn.is-danger {
  color: #c0392b;
  background: transparent;
  border-color: #f5c6c3;
}

.bo-btn.is-sm {
  min-height: 2rem;
  padding: 0 0.7rem;
  font-size: 0.8rem;
}

.bo-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(21, 31, 38, 0.54);
}

.bo-modal {
  width: min(100%, 58rem);
  max-height: calc(100dvh - 2rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.24);
}

.bo-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.05rem 1.35rem;
  border-bottom: 1px solid var(--bo-border, #dfe7ec);
}

.bo-modal-header h2 {
  margin: 0;
  color: var(--bo-primary, #17334a);
  font-size: 1.1rem;
  font-weight: 900;
}

.bo-modal-close {
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--bo-muted, #6b7882);
  font-size: 1.35rem;
  cursor: pointer;
}

.bo-form {
  display: grid;
  gap: 1rem;
  overflow-y: auto;
  padding: 1.25rem;
}

.form-section {
  display: grid;
  gap: 0.9rem;
  padding: 1rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 10px;
  background: #fcfdfe;
}

.form-section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-section-header h3 {
  margin: 0;
  color: var(--bo-primary, #17334a);
  font-size: 0.98rem;
  font-weight: 900;
}

.form-section-header h3 em {
  color: #c0392b;
  font-style: normal;
}

.form-section-header p {
  margin: 0.25rem 0 0;
  color: var(--bo-muted, #6b7882);
  font-size: 0.78rem;
  line-height: 1.55;
}

.selection-count {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  color: #315b64;
  background: #eaf3f4;
  font-size: 0.75rem;
  font-weight: 900;
}

.basic-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.basic-grid__wide {
  grid-column: 1 / -1;
}

.bo-field {
  display: grid;
  gap: 0.4rem;
  color: var(--bo-primary, #17334a);
  font-size: 0.88rem;
  font-weight: 800;
}

.bo-field em {
  color: #c0392b;
  font-style: normal;
}

.bo-field-hint {
  color: var(--bo-muted, #6b7882);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.5;
}

.bo-field input,
.bo-field select,
.assignment-table select {
  width: 100%;
  min-height: 2.65rem;
  padding: 0 0.75rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 7px;
  color: var(--bo-text, #20303c);
  background: #fff;
  font: inherit;
}

.bo-field input:disabled,
.bo-field select:disabled,
.assignment-table select:disabled {
  color: var(--bo-muted, #6b7882);
  background: #f1f4f5;
  cursor: not-allowed;
}

.bo-field input:focus,
.bo-field select:focus,
.assignment-table select:focus {
  border-color: var(--bo-accent, #d9b26f);
  outline: 3px solid rgba(217, 178, 111, 0.18);
}

.salary-section { display: grid; gap: .8rem; padding: .9rem; border: 1px solid #dfe7ec; border-radius: 9px; background: #f7f9fa; }
.salary-section-heading strong { display: block; color: var(--bo-primary, #17334a); font-size: .9rem; }
.salary-section-heading small { display: block; margin-top: .2rem; color: var(--bo-muted, #6b7882); font-size: .74rem; font-weight: 500; line-height: 1.5; }
.salary-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .9rem; }
.salary-money-input { display: grid; grid-template-columns: auto 1fr; align-items: center; overflow: hidden; border: 1px solid var(--bo-border, #dfe7ec); border-radius: 7px; background: #fff; }
.salary-money-input > span { padding-left: .75rem; color: var(--bo-muted, #6b7882); font-size: .8rem; font-weight: 800; }
.salary-money-input input { border: 0 !important; outline: 0 !important; }
.salary-rate-input { grid-template-columns: 1fr auto; }
.salary-rate-input > span { padding: 0 .75rem 0 0; }
.insurance-options { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .65rem; }
.insurance-options label { display: flex; align-items: center; gap: .5rem; min-height: 2.7rem; padding: .65rem .75rem; border: 1px solid var(--bo-border, #dfe7ec); border-radius: 7px; background: #fff; color: var(--bo-primary, #17334a); font-size: .78rem; font-weight: 800; cursor: pointer; }
.insurance-options input { width: 1rem; height: 1rem; flex: none; accent-color: var(--bo-primary, #17334a); }

.assignment-loading {
  padding: 1.5rem;
  border-radius: 8px;
  color: var(--bo-muted, #6b7882);
  background: #f4f7f8;
  text-align: center;
}

.assignment-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 9px;
}

.assignment-table {
  width: 100%;
  min-width: 44rem;
  border-collapse: collapse;
}

.assignment-table th,
.assignment-table td {
  padding: 0.7rem;
  border-bottom: 1px solid var(--bo-border, #dfe7ec);
  text-align: left;
  vertical-align: middle;
}

.assignment-table th {
  color: var(--bo-muted, #6b7882);
  background: #f4f7f8;
  font-size: 0.74rem;
  font-weight: 900;
}

.assignment-table tr:last-child td {
  border-bottom: 0;
}

.assignment-table tr.is-selected td {
  background: #fbfdfd;
}

.assignment-checkbox,
.choice-control input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--bo-primary, #17334a);
}

.choice-control {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #52656d;
  font-size: 0.76rem;
  font-weight: 800;
  white-space: nowrap;
}

.bo-form-actions {
  position: sticky;
  bottom: -1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding: 1rem 0 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff 35%);
}

@media (max-width: 62rem) {
  .staff-row {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .staff-actions {
    grid-column: 1 / -1;
    justify-content: flex-end;
  }
}

@media (max-width: 42rem) {
  .bo-header-actions,
  .bo-header-actions .bo-btn {
    width: 100%;
  }

  .bo-modal-overlay {
    padding: 0;
    place-items: stretch;
  }

  .bo-modal {
    width: 100%;
    max-height: 100dvh;
    border-radius: 0;
  }

  .basic-grid {
    grid-template-columns: 1fr;
  }

  .basic-grid__wide {
    grid-column: auto;
  }

  .staff-row {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: flex-start;
  }

  .staff-summary,
  .staff-identity {
    text-align: left;
  }

  .staff-actions {
    justify-content: stretch;
  }

  .staff-actions .bo-btn {
    flex: 1;
  }

  .assignment-table-wrap {
    overflow: visible;
    border: 0;
  }

  .assignment-table {
    min-width: 0;
  }

  .assignment-table thead {
    display: none;
  }

  .assignment-table,
  .assignment-table tbody,
  .assignment-table tr,
  .assignment-table td {
    display: block;
    width: 100%;
  }

  .assignment-table tr {
    display: grid;
    gap: 0.65rem;
    margin-bottom: 0.75rem;
    padding: 0.85rem;
    border: 1px solid var(--bo-border, #dfe7ec);
    border-radius: 9px;
    background: #fff;
  }

  .assignment-table td {
    display: grid;
    grid-template-columns: 5.5rem minmax(0, 1fr);
    align-items: center;
    gap: 0.6rem;
    padding: 0;
    border: 0;
  }

  .assignment-table td::before {
    content: attr(data-label);
    color: var(--bo-muted, #6b7882);
    font-size: 0.72rem;
    font-weight: 900;
  }
}
</style>
