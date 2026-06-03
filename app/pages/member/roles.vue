<template>
  <div class="bo-page">
    <header class="bo-page-header">
      <div>
        <p class="bo-kicker">Human Resources</p>
        <h1 class="bo-page-title">角色權限管理</h1>
      </div>
      <div class="bo-header-actions">
        <NuxtLink to="/member/staff" class="bo-btn is-ghost">
          <Icon name="fa6-solid:arrow-left" aria-hidden="true" /> 返回員工管理
        </NuxtLink>
      </div>
    </header>

    <section class="bo-panel role-panel">
      <header class="role-panel-header">
        <div>
          <h2>角色列表</h2>
          <p>依品牌已開通功能顯示可設定的角色權限。</p>
        </div>
        <div class="role-panel-tools">
          <span class="bo-pill">{{ roles.length }} 個角色</span>
          <button class="bo-btn is-primary is-sm" @click="openRoleModal">
            <Icon name="fa6-solid:plus" aria-hidden="true" /> 新增角色
          </button>
        </div>
      </header>

      <div class="role-tabs" role="tablist" aria-label="角色列表">
        <button
          v-for="role in roles"
          :key="role.Id"
          class="bo-btn is-ghost is-sm role-tab"
          :class="{ 'is-active': selectedRoleId === role.Id }"
          @click="selectedRoleId = role.Id"
        >
          {{ role.RoleName }}
          <span>{{ countEnabledPermissions(role) }} 權限</span>
        </button>
      </div>

      <div v-if="pending" class="bo-empty">載入中…</div>

      <div v-else-if="roles.length === 0" class="bo-empty">
        <Icon name="fa6-solid:shield-halved" class="bo-empty-icon" aria-hidden="true" />
        <p>目前查無角色資料</p>
      </div>

      <div v-else-if="selectedRole" class="role-detail">
        <div v-if="permissionUpdating" class="permission-loading" role="status" aria-live="polite">
          <span class="permission-loading-spinner" aria-hidden="true" />
          <p>權限儲存中，請稍候…</p>
        </div>

        <div class="role-detail-head">
          <div>
            <strong>{{ selectedRole.RoleName }}</strong>
            <small>{{ selectedRole.Description || "尚未設定描述" }}</small>
          </div>
          <div class="role-detail-actions">
            <span v-if="selectedRoleDirty" class="role-dirty-tip">尚未儲存變更</span>
            <button
              class="bo-btn is-primary is-sm"
              :disabled="permissionUpdating || !selectedRoleDirty"
              @click="saveSelectedPermissions"
            >
              <Icon name="fa6-solid:floppy-disk" aria-hidden="true" /> 儲存權限
            </button>
            <button
              class="bo-btn is-danger is-sm"
              :disabled="permissionUpdating || roleDeleting"
              @click="deleteSelectedRole"
            >
              <Icon name="fa6-solid:trash" aria-hidden="true" /> 刪除角色
            </button>
          </div>
        </div>

        <div class="permission-groups">
          <section
            v-for="group in permissionGroups"
            :key="group.title"
            class="permission-group"
          >
            <h3>{{ group.title }}</h3>
            <div class="permission-items">
              <label
                v-for="item in group.items"
                :key="item.key"
                class="permission-item"
              >
                <input
                  type="checkbox"
                  :checked="selectedRole[item.key]"
                  :disabled="permissionUpdating"
                  @change="onPermissionChange(item.key, $event)"
                />
                <span>{{ item.label }}</span>
              </label>
            </div>
          </section>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="showRoleModal" class="bo-modal-overlay">
        <div class="bo-modal" role="dialog" aria-modal="true" aria-labelledby="role-modal-title">
          <header class="bo-modal-header">
            <h2 id="role-modal-title">新增角色</h2>
            <button class="bo-modal-close" aria-label="關閉" @click="closeRoleModal">
              x
            </button>
          </header>

          <form class="bo-form" @submit.prevent="handleAddRole">
            <label class="bo-field">
              <span>角色名稱 <em>*</em></span>
              <input
                v-model.trim="roleForm.roleName"
                type="text"
                placeholder="請輸入角色名稱"
                maxlength="50"
                required
              />
            </label>

            <label class="bo-field">
              <span>角色簡介 <em>*</em>（最多 30 字）</span>
              <textarea
                v-model.trim="roleForm.description"
                rows="3"
                maxlength="30"
                placeholder="請輸入角色簡介"
                required
              />
              <small class="bo-field-note">{{ roleForm.description.length }}/30</small>
            </label>

            <div class="bo-form-actions">
              <button type="button" class="bo-btn is-ghost" @click="closeRoleModal">
                取消
              </button>
              <button type="submit" class="bo-btn is-primary" :disabled="roleSaving">
                {{ roleSaving ? "建立中…" : "建立角色" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import Swal from "sweetalert2";
import api from "~/composables/utils/api";
import { usePermissionStore } from "~/composables/usePermissionStore";

const { t } = useI18n();

definePageMeta({
  middleware: ["backoffice-auth", "brand-feature"],
  brandFeature: "subscription",
});

useHead(() => ({ title: `${t("page.member.staff")} - 角色權限管理` }));

const permStore = usePermissionStore();
await permStore.load();

type PermissionKey =
  | "Dashboard"
  | "BrandManagement"
  | "StoreManagement"
  | "CustomerManagement"
  | "PetManagement"
  | "AppointmentManagement"
  | "VisitManagement"
  | "MedicalRecordManagement"
  | "BillingManagement"
  | "StaffManagement"
  | "RolePermissionManagement"
  | "ShiftManagement"
  | "HospitalizationManagement"
  | "InpatientCareManagement"
  | "PurchaseManagement"
  | "GeneralInventoryManagement"
  | "DrugInventoryManagement"
  | "PharmacyManagement"
  | "BatchExpireManagement"
  | "MultiStoreManagement"
  | "CrossStoreInventory"
  | "BasicReport"
  | "AdvancedReport";

interface StaffRole {
  Id: number;
  BrandId: number | null;
  RoleName: string;
  Description: string;
  Dashboard: boolean;
  BrandManagement: boolean;
  StoreManagement: boolean;
  CustomerManagement: boolean;
  PetManagement: boolean;
  AppointmentManagement: boolean;
  VisitManagement: boolean;
  MedicalRecordManagement: boolean;
  BillingManagement: boolean;
  StaffManagement: boolean;
  RolePermissionManagement: boolean;
  ShiftManagement: boolean;
  HospitalizationManagement: boolean;
  InpatientCareManagement: boolean;
  PurchaseManagement: boolean;
  GeneralInventoryManagement: boolean;
  DrugInventoryManagement: boolean;
  PharmacyManagement: boolean;
  BatchExpireManagement: boolean;
  MultiStoreManagement: boolean;
  CrossStoreInventory: boolean;
  BasicReport: boolean;
  AdvancedReport: boolean;
}

interface PermissionGroup {
  title: string;
  items: Array<{ key: PermissionKey; label: string }>;
}

type BrandFeatureMap = Record<PermissionKey, boolean>;
const permissionKeys: PermissionKey[] = [
  "Dashboard",
  "BrandManagement",
  "StoreManagement",
  "CustomerManagement",
  "PetManagement",
  "AppointmentManagement",
  "VisitManagement",
  "MedicalRecordManagement",
  "BillingManagement",
  "StaffManagement",
  "RolePermissionManagement",
  "ShiftManagement",
  "HospitalizationManagement",
  "InpatientCareManagement",
  "PurchaseManagement",
  "GeneralInventoryManagement",
  "DrugInventoryManagement",
  "PharmacyManagement",
  "BatchExpireManagement",
  "MultiStoreManagement",
  "CrossStoreInventory",
  "BasicReport",
  "AdvancedReport",
];

const basePermissionGroups: PermissionGroup[] = [
  {
    title: "營運主檔",
    items: [
      { key: "Dashboard", label: "主控台" },
      { key: "BrandManagement", label: "品牌管理" },
      { key: "StoreManagement", label: "院所管理" },
    ],
  },
  {
    title: "客戶資料",
    items: [
      { key: "CustomerManagement", label: "飼主管理" },
      { key: "PetManagement", label: "寵物管理" },
    ],
  },
  {
    title: "門診流程",
    items: [
      { key: "AppointmentManagement", label: "預約管理" },
      { key: "VisitManagement", label: "門診管理" },
      { key: "MedicalRecordManagement", label: "病歷管理" },
      { key: "BillingManagement", label: "批價收費管理" },
    ],
  },
  {
    title: "人事權限",
    items: [
      { key: "StaffManagement", label: "人事管理" },
      { key: "RolePermissionManagement", label: "角色權限管理" },
      { key: "ShiftManagement", label: "排班管理" },
    ],
  },
  {
    title: "住院流程",
    items: [
      { key: "HospitalizationManagement", label: "住院管理" },
      { key: "InpatientCareManagement", label: "住院照護管理" },
    ],
  },
  {
    title: "採購庫存",
    items: [
      { key: "PurchaseManagement", label: "採購管理" },
      { key: "GeneralInventoryManagement", label: "一般庫存管理" },
      { key: "DrugInventoryManagement", label: "藥品庫存管理" },
      { key: "PharmacyManagement", label: "藥局管理" },
      { key: "BatchExpireManagement", label: "批號效期管理" },
    ],
  },
  {
    title: "多店與報表",
    items: [
      { key: "MultiStoreManagement", label: "多分店管理" },
      { key: "CrossStoreInventory", label: "跨店庫存管理" },
      { key: "BasicReport", label: "基本報表" },
      { key: "AdvancedReport", label: "進階報表" },
    ],
  },
];

const emptyFeatures = (): BrandFeatureMap => ({
  Dashboard: false,
  BrandManagement: false,
  StoreManagement: false,
  CustomerManagement: false,
  PetManagement: false,
  AppointmentManagement: false,
  VisitManagement: false,
  MedicalRecordManagement: false,
  BillingManagement: false,
  StaffManagement: false,
  RolePermissionManagement: false,
  ShiftManagement: false,
  HospitalizationManagement: false,
  InpatientCareManagement: false,
  PurchaseManagement: false,
  GeneralInventoryManagement: false,
  DrugInventoryManagement: false,
  PharmacyManagement: false,
  BatchExpireManagement: false,
  MultiStoreManagement: false,
  CrossStoreInventory: false,
  BasicReport: false,
  AdvancedReport: false,
});

const activeBrandId = computed(() => permStore.brandId);

const { data, pending, refresh } = await useAsyncData(
  "staff-roles-by-brand",
  async () => {
    const brandId = activeBrandId.value;
    if (!brandId) {
      return {
        features: emptyFeatures(),
        roles: [] as StaffRole[],
      };
    }

    const [featureResponse, roleResponse] = await Promise.all([
      api.post("/permission/brand", { brandId }),
      api.get(`/staff/roles/${brandId}`),
    ]);

    return {
      features: {
        ...emptyFeatures(),
        ...(featureResponse.data?.data?.Features ?? {}),
      } as BrandFeatureMap,
      roles: (roleResponse.data?.data as StaffRole[]) ?? [],
    };
  },
  {
    server: false,
    watch: [activeBrandId],
  },
);

const features = computed<BrandFeatureMap>(() => data.value?.features ?? emptyFeatures());
const roles = computed<StaffRole[]>(() => data.value?.roles ?? []);

const permissionGroups = computed<PermissionGroup[]>(() =>
  basePermissionGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => features.value[item.key]),
    }))
    .filter((group) => group.items.length > 0),
);

const countEnabledPermissions = (role: StaffRole) =>
  permissionKeys.filter((key) => features.value[key] && role[key]).length;

const selectedRoleId = ref(roles.value[0]?.Id ?? 0);

watch(
  roles,
  (nextRoles) => {
    if (!nextRoles.some((role) => role.Id === selectedRoleId.value)) {
      selectedRoleId.value = nextRoles[0]?.Id ?? 0;
    }
  },
  { deep: true },
);

const selectedRole = computed(() =>
  roles.value.find((role) => role.Id === selectedRoleId.value),
);

const permissionUpdating = ref(false);
const roleDeleting = ref(false);
const originalPermissionSignatures = ref<Record<number, string>>({});
const dirtyRoleMap = ref<Record<number, boolean>>({});
const hasUnsavedChanges = computed(() => Object.keys(dirtyRoleMap.value).length > 0);

function getPermissionSignature(role: StaffRole) {
  return JSON.stringify(buildPermissionPayload(role));
}

const selectedRoleDirty = computed(() => {
  const role = selectedRole.value;
  if (!role) return false;
  return Boolean(dirtyRoleMap.value[role.Id]);
});

function updateRoleDirtyFlag(role: StaffRole) {
  const isDirty =
    getPermissionSignature(role) !== originalPermissionSignatures.value[role.Id];

  const nextMap = { ...dirtyRoleMap.value };
  if (isDirty) {
    nextMap[role.Id] = true;
  } else {
    delete nextMap[role.Id];
  }
  dirtyRoleMap.value = nextMap;
}

function buildPermissionPayload(role: StaffRole) {
  return {
    dashboard: role.Dashboard,
    brandManagement: role.BrandManagement,
    storeManagement: role.StoreManagement,
    customerManagement: role.CustomerManagement,
    petManagement: role.PetManagement,
    appointmentManagement: role.AppointmentManagement,
    visitManagement: role.VisitManagement,
    medicalRecordManagement: role.MedicalRecordManagement,
    billingManagement: role.BillingManagement,
    staffManagement: role.StaffManagement,
    rolePermissionManagement: role.RolePermissionManagement,
    shiftManagement: role.ShiftManagement,
    hospitalizationManagement: role.HospitalizationManagement,
    inpatientCareManagement: role.InpatientCareManagement,
    purchaseManagement: role.PurchaseManagement,
    generalInventoryManagement: role.GeneralInventoryManagement,
    drugInventoryManagement: role.DrugInventoryManagement,
    pharmacyManagement: role.PharmacyManagement,
    batchExpireManagement: role.BatchExpireManagement,
    multiStoreManagement: role.MultiStoreManagement,
    crossStoreInventory: role.CrossStoreInventory,
    basicReport: role.BasicReport,
    advancedReport: role.AdvancedReport,
  };
}

function onPermissionChange(key: PermissionKey, event: Event) {
  const checked = (event.target as HTMLInputElement | null)?.checked ?? false;
  if (permissionUpdating.value || !selectedRole.value || !data.value) return;

  const targetRole = data.value.roles.find((role) => role.Id === selectedRole.value?.Id);
  if (!targetRole) return;
  targetRole[key] = checked;
  updateRoleDirtyFlag(targetRole);
}

async function saveSelectedPermissions() {
  const brandId = activeBrandId.value;
  const role = selectedRole.value;
  if (!brandId || !role) {
    await Swal.fire({
      title: "更新失敗",
      text: "目前尚未選擇品牌或角色。",
      icon: "error",
      confirmButtonText: "確認",
    });
    return;
  }

  if (!selectedRoleDirty.value) return;

  permissionUpdating.value = true;
  try {
    const response = await api.put(
      `/staff/roles/${brandId}/${role.Id}/permissions`,
      buildPermissionPayload(role),
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message || "更新角色權限失敗");
    }

    originalPermissionSignatures.value[role.Id] = getPermissionSignature(role);
    updateRoleDirtyFlag(role);
    await Swal.fire({
      title: "儲存成功",
      text: response.data?.message || "更新角色權限成功",
      icon: "success",
      confirmButtonText: "確認",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新角色權限失敗";
    await Swal.fire({
      title: "更新失敗",
      text: message,
      icon: "error",
      confirmButtonText: "確認",
    });
  } finally {
    permissionUpdating.value = false;
  }
}

async function deleteSelectedRole() {
  const brandId = activeBrandId.value;
  const role = selectedRole.value;
  if (!brandId || !role) return;

  const result = await Swal.fire({
    title: `刪除角色 ${role.RoleName}？`,
    text: "此操作無法復原。",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確認刪除",
    cancelButtonText: "取消",
    confirmButtonColor: "#c0392b",
  });
  if (!result.isConfirmed) return;

  roleDeleting.value = true;
  try {
    const response = await api.delete(`/staff/roles/${brandId}/${role.Id}`);
    if (!response.data?.success) {
      throw new Error(response.data?.message || "刪除角色失敗");
    }

    await refresh();
    syncPermissionSignatures();
    selectedRoleId.value = roles.value[0]?.Id ?? 0;
    await Swal.fire({
      title: "刪除成功",
      text: response.data?.message || "刪除角色成功",
      icon: "success",
      confirmButtonText: "確認",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "刪除角色失敗";
    await Swal.fire({
      title: "刪除失敗",
      text: message,
      icon: "error",
      confirmButtonText: "確認",
    });
  } finally {
    roleDeleting.value = false;
  }
}

const showRoleModal = ref(false);
const roleSaving = ref(false);
const roleForm = reactive({
  roleName: "",
  description: "",
});

function openRoleModal() {
  roleForm.roleName = "";
  roleForm.description = "";
  roleSaving.value = false;
  showRoleModal.value = true;
}

function closeRoleModal() {
  showRoleModal.value = false;
}

watch(activeBrandId, () => {
  selectedRoleId.value = roles.value[0]?.Id ?? 0;
});

function syncPermissionSignatures() {
  const map: Record<number, string> = {};
  for (const role of roles.value) {
    map[role.Id] = getPermissionSignature(role);
  }
  originalPermissionSignatures.value = map;
  dirtyRoleMap.value = {};
}

watch(
  () => data.value?.roles,
  () => {
    syncPermissionSignatures();
  },
  { immediate: true },
);

function beforeUnloadHandler(event: BeforeUnloadEvent) {
  if (!hasUnsavedChanges.value) return;
  event.preventDefault();
  event.returnValue = "";
}

onMounted(() => {
  window.addEventListener("beforeunload", beforeUnloadHandler);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", beforeUnloadHandler);
});

onBeforeRouteLeave(() => {
  if (!hasUnsavedChanges.value) return;
  return Swal.fire({
    title: "尚未儲存變更",
    text: "目前有尚未儲存的權限變更，離開後將遺失，是否仍要離開？",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "仍要離開",
    cancelButtonText: "留在此頁",
    confirmButtonColor: "#c0392b",
  }).then((result) => result.isConfirmed);
});

async function handleAddRole() {
  roleSaving.value = true;
  try {
    const brandId = activeBrandId.value;
    if (!brandId) throw new Error("目前尚未選擇品牌。");

    const roleName = roleForm.roleName.trim();
    const description = roleForm.description.trim();

    if (!roleName) throw new Error("請輸入角色名稱。");
    if (!description) throw new Error("請輸入角色簡介。");
    if (description.length > 30) throw new Error("角色簡介最多 30 字。");
    if (roles.value.some((role) => role.RoleName === roleName)) {
      throw new Error("角色名稱不可重複。");
    }

    const response = await api.post(`/staff/roles/${brandId}`, {
      roleName,
      description,
    });

    if (!response.data?.success) {
      throw new Error(response.data?.message || "新增角色失敗。");
    }

    await refresh();
    const createdRole = [...roles.value]
      .reverse()
      .find((role) => role.RoleName === roleName && role.Description === description);
    selectedRoleId.value = createdRole?.Id ?? roles.value[0]?.Id ?? 0;
    closeRoleModal();
    await Swal.fire({
      title: "建立成功",
      text: response.data?.message || `角色「${roleName}」已建立。`,
      icon: "success",
      confirmButtonText: "確認",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "新增角色失敗。";
    await Swal.fire({
      title: "建立失敗",
      text: message,
      icon: "error",
      confirmButtonText: "確認",
    });
  } finally {
    roleSaving.value = false;
  }
}
</script>

<style scoped>
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

.bo-header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.bo-panel {
  padding: 1.25rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 10px;
  background: #fff;
}

.role-panel { display: grid; gap: 1rem; }

.role-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.role-panel-header h2 {
  color: var(--bo-primary, #17334a);
  font-size: 1.05rem;
  font-weight: 900;
  margin-bottom: 0.25rem;
}

.role-panel-header p { color: var(--bo-muted, #6b7882); font-size: 0.85rem; }

.role-panel-tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.role-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.role-tab { display: inline-flex; gap: 0.45rem; align-items: center; }

.role-tab span {
  font-size: 0.72rem;
  color: var(--bo-muted, #6b7882);
  background: #f5f7f9;
  border-radius: 999px;
  padding: 0.1rem 0.4rem;
}

.role-tab.is-active {
  border-color: var(--bo-primary, #17334a);
  background: var(--bo-primary-soft, #edf4f8);
}

.role-detail {
  position: relative;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 10px;
  padding: 1rem;
  background: #fbfcfd;
  display: grid;
  gap: 1rem;
}

.permission-loading {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(1px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  border-radius: 10px;
}

.permission-loading p {
  color: var(--bo-primary, #17334a);
  font-size: 0.88rem;
  font-weight: 800;
}

.permission-loading-spinner {
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 50%;
  border: 2px solid #d8e0e6;
  border-top-color: var(--bo-primary, #17334a);
  animation: permission-spin 0.8s linear infinite;
}

@keyframes permission-spin {
  to { transform: rotate(360deg); }
}

.role-detail-head { display: grid; gap: 0.2rem; }
.role-detail-head strong { color: var(--bo-primary, #17334a); font-size: 1rem; }
.role-detail-head small { color: var(--bo-muted, #6b7882); font-size: 0.82rem; }

.role-detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.role-detail-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.role-dirty-tip {
  color: #a46907;
  background: #fff7e6;
  border: 1px solid #f2d4a6;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.76rem;
  font-weight: 800;
}

.permission-groups {
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.permission-group {
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 8px;
  padding: 0.7rem;
  background: #fff;
}

.permission-group h3 {
  color: var(--bo-primary, #17334a);
  font-size: 0.87rem;
  font-weight: 900;
  margin-bottom: 0.45rem;
}

.permission-items { display: grid; gap: 0.35rem; }

.permission-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--bo-text, #20303c);
  font-size: 0.84rem;
  font-weight: 700;
}

.permission-item input { width: 1rem; height: 1rem; accent-color: var(--bo-primary, #17334a); }

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

.bo-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2.5rem;
  padding: 0 1.2rem;
  border: 1px solid transparent;
  border-radius: 7px;
  font: inherit;
  font-weight: 900;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.15s, background 0.15s;
  white-space: nowrap;
  text-decoration: none;
}

.bo-btn:disabled { opacity: 0.55; cursor: not-allowed; }

.bo-btn.is-primary { color: #fff; background: var(--bo-primary, #17334a); border-color: var(--bo-primary, #17334a); }
.bo-btn.is-primary:hover:not(:disabled) { opacity: 0.85; }

.bo-btn.is-ghost { color: var(--bo-primary, #17334a); background: transparent; border-color: var(--bo-border, #dfe7ec); }
.bo-btn.is-ghost:hover:not(:disabled) { background: var(--bo-primary-soft, #edf4f8); }

.bo-btn.is-danger { color: #c0392b; background: transparent; border-color: #f5c6c3; }
.bo-btn.is-danger:hover:not(:disabled) { background: #fdf0ef; }

.bo-btn.is-sm { min-height: 2rem; padding: 0 0.75rem; font-size: 0.82rem; }

.bo-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.bo-modal {
  width: 100%;
  max-width: 26rem;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.bo-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.4rem;
  border-bottom: 1px solid var(--bo-border, #dfe7ec);
}

.bo-modal-header h2 { color: var(--bo-primary, #17334a); font-size: 1.05rem; font-weight: 900; }

.bo-modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--bo-muted, #6b7882);
  cursor: pointer;
  transition: background 0.15s;
}

.bo-modal-close:hover { background: var(--bo-primary-soft, #edf4f8); }

.bo-form { display: grid; gap: 1rem; padding: 1.4rem; }

.bo-field { display: grid; gap: 0.4rem; font-weight: 800; color: var(--bo-primary, #17334a); font-size: 0.92rem; }
.bo-field em { color: #c0392b; font-style: normal; }

.bo-field input,
.bo-field textarea {
  width: 100%;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 7px;
  color: var(--bo-text, #20303c);
  background: #fff;
  font: inherit;
}

.bo-field input {
  min-height: 2.75rem;
  padding: 0 0.8rem;
}

.bo-field textarea {
  min-height: 5.5rem;
  padding: 0.65rem 0.8rem;
  resize: vertical;
}

.bo-field input:focus,
.bo-field textarea:focus {
  border-color: var(--bo-accent, #d9b26f);
  outline: 3px solid rgba(217, 178, 111, 0.18);
}

.bo-field-note {
  justify-self: end;
  color: var(--bo-muted, #6b7882);
  font-size: 0.78rem;
}

.bo-form-actions { display: flex; justify-content: flex-end; gap: 0.6rem; padding-top: 0.25rem; }
</style>
