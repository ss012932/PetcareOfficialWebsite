<template>
  <div class="bo-page">
    <header class="bo-page-header">
      <div>
        <p class="bo-kicker">Clinic Management</p>
        <h1 class="bo-page-title">院所管理</h1>
      </div>
      <div class="bo-header-actions">
        <span class="bo-pill">{{ clinics.length }} 間院所</span>
        <button class="bo-btn is-primary" @click="openAdd">
          <Icon name="fa6-solid:plus" aria-hidden="true" /> 新增院所
        </button>
      </div>
    </header>

    <!-- ===== 院所列表 ===== -->
    <div v-if="pending" class="bo-empty">載入中…</div>

    <div v-else-if="clinics.length === 0" class="bo-empty">
      <Icon name="fa6-solid:house-medical" class="bo-empty-icon" aria-hidden="true" />
      <p>尚未建立任何院所</p>
    </div>

    <div v-else class="clinic-grid">
      <article
        v-for="clinic in clinics"
        :key="clinic.Id"
        class="clinic-card"
        :class="{ 'is-inactive': !clinic.IsActive }"
      >
        <header class="clinic-card-header">
          <div class="clinic-title-row">
            <Icon name="fa6-solid:house-medical" class="clinic-icon" aria-hidden="true" />
            <div>
              <p class="clinic-brand-name">{{ clinic.BrandName }}</p>
              <strong>{{ clinic.Name }}</strong>
            </div>
          </div>
          <span class="bo-pill" :class="clinic.IsActive ? 'is-success' : 'is-muted'">
            {{ clinic.IsActive ? "營運中" : "停止營運" }}
          </span>
        </header>

        <dl class="clinic-info">
          <div v-if="clinic.Phone">
            <dt><Icon name="fa6-solid:phone" aria-hidden="true" /> 電話</dt>
            <dd>{{ clinic.Phone }}</dd>
          </div>
          <div v-if="clinic.City">
            <dt><Icon name="fa6-solid:city" aria-hidden="true" /> 城市</dt>
            <dd>{{ clinic.City }}</dd>
          </div>
          <div v-if="clinic.Address">
            <dt><Icon name="fa6-solid:location-dot" aria-hidden="true" /> 地址</dt>
            <dd>{{ clinic.Address }}</dd>
          </div>
          <div v-if="clinic.TaxId">
            <dt><Icon name="fa6-solid:building" aria-hidden="true" /> 統編</dt>
            <dd>{{ clinic.TaxId }}</dd>
          </div>
        </dl>

        <footer class="clinic-card-footer">
          <button class="bo-btn is-ghost is-sm" @click="openEdit(clinic)">
            <Icon name="fa6-solid:pen" aria-hidden="true" /> 編輯
          </button>
          <button
            class="bo-btn is-ghost is-sm"
            @click="toggleActive(clinic)"
          >
            <Icon
              :name="clinic.IsActive ? 'fa6-solid:ban' : 'fa6-solid:rotate-left'"
              aria-hidden="true"
            />
            {{ clinic.IsActive ? "停用" : "啟用" }}
          </button>
          <button class="bo-btn is-danger is-sm" @click="confirmRemove(clinic)">
            <Icon name="fa6-solid:trash" aria-hidden="true" /> 移除
          </button>
        </footer>
      </article>
    </div>

    <!-- ===== 新增 / 編輯 Modal ===== -->
    <Teleport to="body">
      <div v-if="showModal" class="bo-modal-overlay" @click.self="closeModal">
        <div class="bo-modal" role="dialog" aria-modal="true" aria-labelledby="clinic-modal-title">
          <header class="bo-modal-header">
            <h2 id="clinic-modal-title">{{ editTarget ? "編輯院所" : "新增院所" }}</h2>
            <button class="bo-modal-close" aria-label="關閉" @click="closeModal">
              <Icon name="fa6-solid:xmark" aria-hidden="true" />
            </button>
          </header>

          <form class="bo-form" @submit.prevent="handleSave">
            <label class="bo-field">
              <span>品牌 <em>*</em></span>
              <select v-model="form.BrandId" class="bo-select" required>
                <option :value="null" disabled>請選擇品牌</option>
                <option
                  v-for="brand in permStore.brands"
                  :key="brand.id"
                  :value="brand.id"
                >
                  {{ brand.name }}
                </option>
              </select>
            </label>
            <label class="bo-field">
              <span>院所名稱 <em>*</em></span>
              <input v-model="form.Name" type="text" placeholder="例：信義動物醫院" required />
            </label>
            <div class="bo-field-row">
              <label class="bo-field">
                <span>城市</span>
                <select v-model="form.City" class="bo-select">
                  <option value="">請選擇城市</option>
                  <option v-for="city in TW_CITIES" :key="city" :value="city">{{ city }}</option>
                </select>
              </label>
              <label class="bo-field">
                <span>聯絡電話</span>
                <input v-model="form.Phone" type="tel" placeholder="02-12345678" />
              </label>
            </div>
            <label class="bo-field">
              <span>地址</span>
              <input v-model="form.Address" type="text" placeholder="台北市信義區…" />
            </label>
            <label class="bo-field">
              <span>統一編號</span>
              <input v-model="form.TaxId" type="text" placeholder="12345678" maxlength="8" />
            </label>

            <div class="bo-form-actions">
              <button type="button" class="bo-btn is-ghost" @click="closeModal">取消</button>
              <button type="submit" class="bo-btn is-primary" :disabled="saving">
                {{ saving ? "儲存中…" : (editTarget ? "儲存變更" : "建立院所") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { showCustom } from "~/composables/utils/alert";
import api from "~/composables/utils/api";
import { usePermissionStore } from "~/composables/usePermissionStore";

definePageMeta({
  middleware: ["backoffice-auth", "brand-feature"],
  brandFeature: "StoreManagement",
});

useHead({ title: "院所管理" });

const permStore = usePermissionStore();

const TW_CITIES = [
  "台北市", "新北市", "基隆市", "桃園市", "新竹市", "新竹縣",
  "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市",
  "嘉義縣", "台南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣",
  "台東縣", "澎湖縣", "金門縣", "連江縣",
] as const;

// ===== 型別 =====
interface Clinic {
  Id: number;
  BrandId: number;
  BrandName: string;
  Name: string;
  Phone: string;
  Address: string;
  City: string;
  TaxId: string;
  IsActive: boolean;
}

// ===== 資料載入 =====
const { data: clinicData, pending, refresh } = await useAsyncData(
  "member-clinics",
  async () => {
    const res = await api.get("/stores/my");
    return (res.data?.stores as Clinic[]) ?? [];
  },
  { server: false },
);

const clinics = computed<Clinic[]>(() => clinicData.value ?? []);

// ===== Modal 狀態 =====
const showModal = ref(false);
const saving = ref(false);
const editTarget = ref<Clinic | null>(null);
const form = reactive({ BrandId: null as number | null, Name: "", City: "", Phone: "", Address: "", TaxId: "" });

function resetForm() {
  form.BrandId = permStore.brandId;
  form.Name = "";
  form.City = "";
  form.Phone = "";
  form.Address = "";
  form.TaxId = "";
}

function openAdd() {
  editTarget.value = null;
  resetForm();
  showModal.value = true;
}

function openEdit(clinic: Clinic) {
  editTarget.value = clinic;
  form.BrandId = clinic.BrandId;
  form.Name = clinic.Name;
  form.City = clinic.City;
  form.Phone = clinic.Phone;
  form.Address = clinic.Address;
  form.TaxId = clinic.TaxId;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

// ===== 新增 / 編輯儲存 =====
async function handleSave() {
  saving.value = true;
  try {
    if (editTarget.value) {
      await api.put(`/stores`, {
        storeId: editTarget.value.Id,
        brandId: form.BrandId,
        name: form.Name,
        city: form.City,
        phone: form.Phone,
        address: form.Address,
        taxId: form.TaxId,
        isActive: editTarget.value.IsActive,
      });
      closeModal();
      await refresh();
      await showCustom("儲存成功", `${form.Name} 院所資料已更新。`, "success");
    } else {
      await api.post("/stores", {
        brandId: form.BrandId,
        name: form.Name,
        city: form.City,
        phone: form.Phone,
        address: form.Address,
        taxId: form.TaxId,
      });
      closeModal();
      await refresh();
      await showCustom("建立成功", `${form.Name} 已加入院所名單。`, "success");
    }
  } catch (err: unknown) {
    const detail =
      (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      ?? "請確認資料後再試一次。";
    await showCustom("操作失敗", detail, "error");
  } finally {
    saving.value = false;
  }
}

// ===== 停用 / 啟用 =====
async function toggleActive(clinic: Clinic) {
  const action = clinic.IsActive ? "停用" : "啟用";
  try {
    await api.put(`/stores`, {
      storeId: clinic.Id,
      brandId: clinic.BrandId,
      name: clinic.Name,
      city: clinic.City,
      phone: clinic.Phone,
      address: clinic.Address,
      taxId: clinic.TaxId,
      isActive: !clinic.IsActive,
    });
    await refresh();
    await showCustom(`${action}成功`, `${clinic.Name} 已${action}。`, "success");
  } catch (err: unknown) {
    const detail =
      (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      ?? "操作失敗，請稍後再試。";
    await showCustom(`${action}失敗`, detail, "error");
  }
}

// ===== 移除 =====
async function confirmRemove(clinic: Clinic) {
  const { default: Swal } = await import("sweetalert2");
  const result = await Swal.fire({
    title: `移除 ${clinic.Name}？`,
    text: "此操作無法復原，院所資料將被永久刪除。",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確認移除",
    cancelButtonText: "取消",
    confirmButtonColor: "#c0392b",
  });
  if (!result.isConfirmed) return;

  try {
    await api.delete(`/stores/${clinic.Id}`);
    await refresh();
    await showCustom("移除成功", `${clinic.Name} 已從院所名單移除。`, "success");
  } catch (err: unknown) {
    const detail =
      (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      ?? "操作失敗，請稍後再試。";
    await showCustom("移除失敗", detail, "error");
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

/* ===== Empty ===== */
.bo-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 4rem 1rem;
  color: var(--bo-muted, #6b7882);
  font-size: 0.95rem;
}

.bo-empty-icon { font-size: 2.5rem; opacity: 0.3; }

/* ===== Clinic Grid ===== */
.clinic-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
}

.clinic-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 10px;
  background: #fff;
  transition: opacity 0.2s;
}

.clinic-card.is-inactive { opacity: 0.6; }

.clinic-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.clinic-title-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.clinic-icon {
  color: var(--bo-accent, #d9b26f);
  flex-shrink: 0;
}

.clinic-title-row strong {
  color: var(--bo-primary, #17334a);
  font-size: 1rem;
  font-weight: 900;
}

.clinic-brand-name {
  color: var(--bo-accent, #d9b26f);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  margin-bottom: 0.1rem;
}

/* ===== Info ===== */
.clinic-info {
  display: grid;
  gap: 0.45rem;
  flex: 1;
}

.clinic-info > div {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.clinic-info dt {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--bo-muted, #6b7882);
  font-weight: 800;
  min-width: 4.5rem;
  flex-shrink: 0;
}

.clinic-info dd {
  color: var(--bo-text, #20303c);
  word-break: break-all;
}

/* ===== Card Footer ===== */
.clinic-card-footer {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--bo-border, #dfe7ec);
  flex-wrap: wrap;
}

/* ===== Pills ===== */
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

/* ===== Buttons ===== */
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
}

.bo-btn:disabled { opacity: 0.55; cursor: not-allowed; }

.bo-btn.is-primary { color: #fff; background: var(--bo-primary, #17334a); border-color: var(--bo-primary, #17334a); }
.bo-btn.is-primary:hover:not(:disabled) { opacity: 0.85; }

.bo-btn.is-ghost { color: var(--bo-primary, #17334a); background: transparent; border-color: var(--bo-border, #dfe7ec); }
.bo-btn.is-ghost:hover:not(:disabled) { background: var(--bo-primary-soft, #edf4f8); }

.bo-btn.is-danger { color: #c0392b; background: transparent; border-color: #f5c6c3; }
.bo-btn.is-danger:hover:not(:disabled) { background: #fdf0ef; }

.bo-btn.is-sm { min-height: 2rem; padding: 0 0.75rem; font-size: 0.82rem; }

/* ===== Modal ===== */
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
  max-width: 28rem;
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

/* ===== Form ===== */
.bo-form { display: grid; gap: 1rem; padding: 1.4rem; }

.bo-field { display: grid; gap: 0.4rem; font-weight: 800; color: var(--bo-primary, #17334a); font-size: 0.92rem; }
.bo-field em { color: #c0392b; font-style: normal; }

.bo-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

.bo-field input {
  width: 100%;
  min-height: 2.75rem;
  padding: 0 0.8rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 7px;
  color: var(--bo-text, #20303c);
  background: #fff;
  font: inherit;
}

.bo-field input:focus {
  border-color: var(--bo-accent, #d9b26f);
  outline: 3px solid rgba(217, 178, 111, 0.18);
}

.bo-form-actions { display: flex; justify-content: flex-end; gap: 0.6rem; padding-top: 0.25rem; }

.bo-select {
  width: 100%;
  min-height: 2.75rem;
  padding: 0 0.8rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 7px;
  color: var(--bo-text, #20303c);
  background: #fff;
  font: inherit;
  appearance: auto;
  cursor: pointer;
}

.bo-select:focus {
  border-color: var(--bo-accent, #d9b26f);
  outline: 3px solid rgba(217, 178, 111, 0.18);
}
</style>
