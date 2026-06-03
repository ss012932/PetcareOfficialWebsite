<template>
  <div class="bo-page">
    <header class="bo-page-header">
      <div>
        <p class="bo-kicker">Human Resources</p>
        <h1 class="bo-page-title">{{ t('page.member.staff') }}</h1>
      </div>
      <div class="bo-header-actions">
        <span class="bo-pill">
          {{ activeCount }} / {{ staffs.length }} 位在職
        </span>
        <NuxtLink to="/member/roles" class="bo-btn is-ghost">
          <Icon name="fa6-solid:shield-halved" aria-hidden="true" /> 角色權限管理
        </NuxtLink>
        <button class="bo-btn is-primary" @click="openAdd">
          <Icon name="fa6-solid:plus" aria-hidden="true" /> 新增員工
        </button>
      </div>
    </header>

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

          <div class="staff-meta">
            <strong>{{ staff.FullName }}</strong>
            <span>職稱: {{ staff.JobTitle }} · 權限: {{ staff.RoleName }} · 店家: {{ staff.StoreName }}</span>
          </div>

          <div class="staff-actions">
            <span class="bo-pill" :class="staff.IsActive ? 'is-success' : 'is-muted'">
              {{ staff.IsActive ? "在職" : "停用" }}
            </span>
            <button class="bo-btn is-ghost is-sm" title="編輯員工" @click="openEdit(staff)">
              <Icon name="fa6-solid:pen" aria-hidden="true" /> 編輯
            </button>
            <button
              class="bo-btn is-ghost is-sm"
              :title="staff.IsActive ? '停用帳號' : '啟用帳號'"
              @click="toggleActive(staff)"
            >
              <Icon
                :name="staff.IsActive ? 'fa6-solid:ban' : 'fa6-solid:rotate-left'"
                aria-hidden="true"
              />
              {{ staff.IsActive ? "停用" : "啟用" }}
            </button>
            <button class="bo-btn is-danger is-sm" title="移除員工" @click="confirmRemove(staff)">
              <Icon name="fa6-solid:trash" aria-hidden="true" /> 移除
            </button>
          </div>
        </li>
      </ul>
    </section>

    <Teleport to="body">
      <div v-if="showModal" class="bo-modal-overlay">
        <div class="bo-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <header class="bo-modal-header">
            <h2 id="modal-title">{{ isEditMode ? "編輯員工" : "新增員工" }}</h2>
            <button class="bo-modal-close" aria-label="關閉" @click="closeModal">x</button>
          </header>

          <form class="bo-form" @submit.prevent="handleSave">
            <label class="bo-field">
              <span>姓名 <em>*</em></span>
              <input v-model="form.fullName" type="text" placeholder="請輸入姓名" required />
            </label>
            <label class="bo-field">
              <span>手機 <em>*</em></span>
              <input
                v-model="form.phone"
                type="tel"
                placeholder="0912345678"
                inputmode="numeric"
                pattern="09[0-9]{8}"
                maxlength="10"
                required
              />
            </label>
            <label class="bo-field">
              <span>Email <em>*</em></span>
              <input
                v-model="form.email"
                type="email"
                placeholder="staff@example.com"
                required
              />
            </label>
            <label class="bo-field">
              <span>帳號 <em>*</em></span>
              <input
                v-model="form.account"
                type="text"
                placeholder="請輸入登入帳號"
                required
              />
            </label>
            <label class="bo-field">
              <span>職稱</span>
              <input
                v-model="form.jobTitle"
                type="text"
                placeholder="例：獸醫師、護理師"
              />
            </label>
            <label class="bo-field">
              <span>權限 <em>*</em></span>
              <select v-model.number="form.roleId" :disabled="rolePending" required>
                <option v-if="roleOptions.length === 0" :value="0">
                  {{ rolePending ? "權限載入中…" : "目前無可用權限" }}
                </option>
                <option v-for="role in roleOptions" v-else :key="role.id" :value="role.id">
                  {{ role.name }}
                </option>
              </select>
            </label>

            <label class="bo-field">
              <span>店家 <em>*</em></span>
              <select v-model.number="form.storeId" :disabled="storePending" required>
                <option v-if="storeOptions.length === 0" :value="0">
                  {{ storePending ? "店家載入中…" : "目前無可用店家" }}
                </option>
                <option v-for="store in storeOptions" v-else :key="store.id" :value="store.id">
                  {{ store.name }}
                </option>
              </select>
            </label>

            <label class="bo-field bo-field-inline">
              <input v-model="form.isPrimary" type="checkbox" />
              <span>主要店家</span>
            </label>

            <label class="bo-field bo-field-inline">
              <input v-model="form.isAdmin" type="checkbox" />
              <span>管理員權限</span>
            </label>

            <div class="bo-form-actions">
              <button type="button" class="bo-btn is-ghost" @click="closeModal">取消</button>
              <button type="submit" class="bo-btn is-primary" :disabled="saving">
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
import { computed, reactive, ref, watch } from "vue";
import { showCustom } from "~/composables/utils/alert";
import api from "~/composables/utils/api";
import { usePermissionStore } from "~/composables/usePermissionStore";

const { t } = useI18n();

definePageMeta({
  middleware: ["backoffice-auth", "brand-feature"],
  brandFeature: "subscription",
});

useHead(() => ({ title: t("page.member.staff") }));

interface Staff {
  StaffId: number;
  FullName: string;
  Phone: string;
  Email: string;
  Account: string;
  JobTitle: string;
  StoreId: number;
  StoreName: string;
  StaffsRoleId: number;
  RoleName: string;
  IsPrimary: boolean;
  IsActive: boolean;
  IsAdmin: boolean;
  CreateDate: string;
}

interface StaffRoleApiItem {
  Id: number;
  RoleName: string;
}

interface StoreApiItem {
  Id: number;
  Name: string;
}

const permStore = usePermissionStore();
await permStore.load();

const activeBrandId = computed(() => permStore.brandId);

const { data: roleData, pending: rolePending } = await useAsyncData(
  "member-staff-role-options",
  async () => {
    const brandId = activeBrandId.value;
    if (!brandId) return [] as StaffRoleApiItem[];

    const res = await api.get(`/staff/roles/${brandId}`);
    return (res.data?.data as StaffRoleApiItem[]) ?? [];
  },
  {
    server: false,
    watch: [activeBrandId],
  },
);

const roleOptions = computed(() =>
  (roleData.value ?? []).map((role) => ({
    id: role.Id,
    name: role.RoleName,
  })),
);

const { data: storeData, pending: storePending } = await useAsyncData(
  "member-staff-store-options",
  async () => {
    const brandId = activeBrandId.value;
    if (!brandId) return [] as StoreApiItem[];

    const res = await api.get(`/stores/my/brand/${brandId}`);
    return (res.data?.stores as StoreApiItem[]) ?? [];
  },
  {
    server: false,
    watch: [activeBrandId],
  },
);

const storeOptions = computed(() =>
  (storeData.value ?? []).map((store) => ({
    id: store.Id,
    name: store.Name,
  })),
);

const { data: staffData, pending, refresh } = await useAsyncData(
  "member-staffs",
  async () => {
    const brandId = activeBrandId.value;
    if (!brandId) return [] as Staff[];

    const res = await api.get(`/staff/brand/${brandId}`);
    return (res.data?.data as Staff[]) ?? [];
  },
  {
    server: false,
    watch: [activeBrandId],
  },
);

const staffs = computed<Staff[]>(() => staffData.value ?? []);
const activeCount = computed(() => staffs.value.filter((s) => s.IsActive).length);

const showModal = ref(false);
const saving = ref(false);
const editTarget = ref<Staff | null>(null);
const isEditMode = computed(() => Boolean(editTarget.value));
const form = reactive({
  fullName: "",
  phone: "",
  email: "",
  account: "",
  jobTitle: "",
  roleId: roleOptions.value[0]?.id ?? 0,
  storeId: storeOptions.value[0]?.id ?? 0,
  isPrimary: true,
  isAdmin: false,
});

watch(
  roleOptions,
  (nextOptions) => {
    if (!nextOptions.some((role) => role.id === form.roleId)) {
      form.roleId = nextOptions[0]?.id ?? 0;
    }
  },
  { immediate: true },
);

watch(
  storeOptions,
  (nextOptions) => {
    if (!nextOptions.some((store) => store.id === form.storeId)) {
      form.storeId = nextOptions[0]?.id ?? 0;
    }
  },
  { immediate: true },
);

function openAdd() {
  editTarget.value = null;
  form.fullName = "";
  form.phone = "";
  form.email = "";
  form.account = "";
  form.jobTitle = "";
  form.roleId = roleOptions.value[0]?.id ?? 0;
  form.storeId = storeOptions.value[0]?.id ?? 0;
  form.isPrimary = true;
  form.isAdmin = false;
  showModal.value = true;
}

function openEdit(staff: Staff) {
  editTarget.value = staff;
  form.fullName = staff.FullName;
  form.phone = staff.Phone;
  form.email = staff.Email;
  form.account = staff.Account;
  form.jobTitle = staff.JobTitle;
  form.roleId = staff.StaffsRoleId;
  form.storeId = staff.StoreId;
  form.isPrimary = staff.IsPrimary;
  form.isAdmin = staff.IsAdmin;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editTarget.value = null;
}

async function handleSave() {
  saving.value = true;
  try {
    const isEditing = isEditMode.value;
    const brandId = activeBrandId.value;
    if (!brandId) {
      await showCustom("建立失敗", "目前尚未選擇品牌。", "error");
      return;
    }

    const phonePattern = /^09\d{8}$/;
    if (!phonePattern.test(form.phone)) {
      await showCustom("建立失敗", "手機格式需為 09 開頭且共 10 碼。", "error");
      return;
    }

    if (!form.roleId) {
      await showCustom("建立失敗", "請先選擇角色。", "error");
      return;
    }

    if (!form.storeId) {
      await showCustom("建立失敗", "目前品牌尚未設定可用院所。", "error");
      return;
    }

    const response = isEditing && editTarget.value
      ? await api.put(`/staff/${editTarget.value.StaffId}`, {
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          account: form.account,
          jobTitle: form.jobTitle,
          brandId,
          storeId: form.storeId,
          staffsRoleId: form.roleId,
          isPrimary: form.isPrimary,
          isAdmin: form.isAdmin,
          isActive: editTarget.value.IsActive,
        })
      : await api.post("/staff", {
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          account: form.account,
          jobTitle: form.jobTitle,
          brandId,
          storeId: form.storeId,
          staffsRoleId: form.roleId,
          isPrimary: form.isPrimary,
          isAdmin: form.isAdmin,
        });

    if (!response.data?.success) {
      throw new Error(response.data?.message || (isEditing ? "編輯員工失敗" : "新增員工失敗"));
    }

    closeModal();
    await refresh();
    await showCustom(
      isEditing ? "儲存成功" : "建立成功",
      response.data?.message || (isEditing ? `${form.fullName} 資料已更新。` : `${form.fullName} 已加入員工名單。`),
      "success",
    );
  } catch (err: unknown) {
    const detail =
      (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
      "請確認資料後再試一次。";
    await showCustom(isEditMode.value ? "儲存失敗" : "建立失敗", detail, "error");
  } finally {
    saving.value = false;
  }
}

async function toggleActive(staff: Staff) {
  const action = staff.IsActive ? "停用" : "啟用";
  try {
    const brandId = activeBrandId.value;
    if (!brandId) {
      await showCustom(`${action}失敗`, "目前尚未選擇品牌。", "error");
      return;
    }

    await api.patch(`/staff/${staff.StaffId}/active?brandId=${brandId}`, {
      isActive: !staff.IsActive,
    });
    await refresh();
    await showCustom(`${action}成功`, `${staff.FullName} 帳號已${action}。`, "success");
  } catch {
    await showCustom(`${action}失敗`, "操作失敗，請稍後再試。", "error");
  }
}

async function confirmRemove(staff: Staff) {
  const { default: Swal } = await import("sweetalert2");
  const result = await Swal.fire({
    title: `移除 ${staff.FullName}？`,
    text: "此操作無法復原，員工帳號將被永久刪除。",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確認移除",
    cancelButtonText: "取消",
    confirmButtonColor: "#c0392b",
  });
  if (!result.isConfirmed) return;

  try {
    const brandId = activeBrandId.value;
    if (!brandId) {
      await showCustom("移除失敗", "目前尚未選擇品牌。", "error");
      return;
    }

    await api.delete(`/staff/${staff.StaffId}?brandId=${brandId}`);
    await refresh();
    await showCustom("移除成功", `${staff.FullName} 已從員工名單移除。`, "success");
  } catch {
    await showCustom("移除失敗", "操作失敗，請稍後再試。", "error");
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

.bo-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: var(--bo-muted, #6b7882);
  font-size: 0.95rem;
}

.bo-empty-icon { font-size: 2.5rem; opacity: 0.3; }

.staff-list {
  display: grid;
  gap: 0.6rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.staff-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 8px;
  background: #fafbfc;
  transition: opacity 0.2s;
}

.staff-row.is-disabled { opacity: 0.55; }

.staff-avatar {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background: var(--bo-primary-soft, #edf4f8);
  color: var(--bo-primary, #17334a);
  font-weight: 900;
  font-size: 0.95rem;
}

.staff-meta { flex: 1; min-width: 0; }
.staff-meta strong { display: block; color: var(--bo-primary, #17334a); font-weight: 900; margin-bottom: 0.15rem; }
.staff-meta span { color: var(--bo-muted, #6b7882); font-size: 0.85rem; }

.staff-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  flex-wrap: wrap;
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

.bo-pill.is-success { color: #14633f; background: #e7f6ee; }
.bo-pill.is-muted   { color: var(--bo-muted, #6b7882); background: #f0f0f0; }

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
.bo-field select {
  width: 100%;
  min-height: 2.75rem;
  padding: 0 0.8rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 7px;
  color: var(--bo-text, #20303c);
  background: #fff;
  font: inherit;
}

.bo-field input:focus,
.bo-field select:focus {
  border-color: var(--bo-accent, #d9b26f);
  outline: 3px solid rgba(217, 178, 111, 0.18);
}

.bo-field-inline {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.bo-field-inline input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  min-height: auto;
  accent-color: var(--bo-primary, #17334a);
}

.bo-form-actions { display: flex; justify-content: flex-end; gap: 0.6rem; padding-top: 0.25rem; }
</style>
