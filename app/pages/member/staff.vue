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
        <button class="bo-btn is-primary" @click="openAdd">
          <Icon name="fa6-solid:plus" aria-hidden="true" /> 新增員工
        </button>
      </div>
    </header>

    <!-- ===== 員工列表 ===== -->
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
          <!-- 頭像縮寫 -->
          <span class="staff-avatar" aria-hidden="true">
            {{ (staff.Name || staff.Email).slice(0, 1).toUpperCase() }}
          </span>

          <!-- 基本資訊 -->
          <div class="staff-meta">
            <strong>{{ staff.Name }}</strong>
            <span>{{ staff.JobTitle }} · {{ staff.Email }}</span>
          </div>

          <!-- 狀態 + 操作 -->
          <div class="staff-actions">
            <span
              class="bo-pill"
              :class="staff.IsActive ? 'is-success' : 'is-muted'"
            >
              {{ staff.IsActive ? "在職" : "停用" }}
            </span>
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
            <button
              class="bo-btn is-danger is-sm"
              title="移除員工"
              @click="confirmRemove(staff)"
            >
              <Icon name="fa6-solid:trash" aria-hidden="true" /> 移除
            </button>
          </div>
        </li>
      </ul>
    </section>

    <!-- ===== 新增員工 Modal ===== -->
    <Teleport to="body">
      <div v-if="showModal" class="bo-modal-overlay" @click.self="closeModal">
        <div class="bo-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <header class="bo-modal-header">
            <h2 id="modal-title">新增員工</h2>
            <button class="bo-modal-close" aria-label="關閉" @click="closeModal">
              <Icon name="fa6-solid:xmark" aria-hidden="true" />
            </button>
          </header>

          <form class="bo-form" @submit.prevent="handleAdd">
            <label class="bo-field">
              <span>姓名 <em>*</em></span>
              <input
                v-model="form.Name"
                type="text"
                placeholder="請輸入姓名"
                required
              />
            </label>
            <label class="bo-field">
              <span>Email <em>*</em></span>
              <input
                v-model="form.Email"
                type="email"
                placeholder="staff@example.com"
                required
              />
            </label>
            <label class="bo-field">
              <span>職稱</span>
              <input
                v-model="form.JobTitle"
                type="text"
                placeholder="例：獸醫師、護理師"
              />
            </label>
            <label class="bo-field">
              <span>初始密碼 <em>*</em></span>
              <input
                v-model="form.Password"
                type="password"
                placeholder="至少 8 碼"
                minlength="8"
                required
              />
            </label>

            <div class="bo-form-actions">
              <button type="button" class="bo-btn is-ghost" @click="closeModal">
                取消
              </button>
              <button type="submit" class="bo-btn is-primary" :disabled="saving">
                {{ saving ? "建立中…" : "建立員工" }}
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

const { t } = useI18n();

definePageMeta({
  middleware: ["backoffice-auth", "brand-feature"],
  brandFeature: "subscription",
});

useHead(() => ({ title: t("page.member.staff") }));

// ===== 型別 =====
interface Staff {
  StaffId: number;
  Name: string;
  Email: string;
  JobTitle: string;
  IsActive: boolean;
}

// ===== 資料載入 =====
const { data: staffData, pending, refresh } = await useAsyncData(
  "member-staffs",
  async () => {
    const res = await api.get("/member/staffs");
    return (res.data?.data as Staff[]) ?? [];
  },
  { server: false },
);

const staffs = computed<Staff[]>(() => staffData.value ?? []);
const activeCount = computed(() => staffs.value.filter((s) => s.IsActive).length);

// ===== 新增 Modal =====
const showModal = ref(false);
const saving = ref(false);
const form = reactive({ Name: "", Email: "", JobTitle: "", Password: "" });

function openAdd() {
  form.Name = "";
  form.Email = "";
  form.JobTitle = "";
  form.Password = "";
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function handleAdd() {
  saving.value = true;
  try {
    await api.post("/member/staffs", {
      name: form.Name,
      email: form.Email,
      jobTitle: form.JobTitle,
      password: form.Password,
    });
    closeModal();
    await refresh();
    await showCustom("建立成功", `${form.Name} 已加入員工名單。`, "success");
  } catch {
    await showCustom("建立失敗", "請確認資料後再試一次。", "error");
  } finally {
    saving.value = false;
  }
}

// ===== 停用 / 啟用 =====
async function toggleActive(staff: Staff) {
  const action = staff.IsActive ? "停用" : "啟用";
  try {
    await api.patch(`/member/staffs/${staff.StaffId}/active`, {
      isActive: !staff.IsActive,
    });
    await refresh();
    await showCustom(`${action}成功`, `${staff.Name} 帳號已${action}。`, "success");
  } catch {
    await showCustom(`${action}失敗`, "操作失敗，請稍後再試。", "error");
  }
}

// ===== 移除 =====
async function confirmRemove(staff: Staff) {
  const { default: Swal } = await import("sweetalert2");
  const result = await Swal.fire({
    title: `移除 ${staff.Name}？`,
    text: "此操作無法復原，員工帳號將被永久刪除。",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確認移除",
    cancelButtonText: "取消",
    confirmButtonColor: "#c0392b",
  });
  if (!result.isConfirmed) return;

  try {
    await api.delete(`/member/staffs/${staff.StaffId}`);
    await refresh();
    await showCustom("移除成功", `${staff.Name} 已從員工名單移除。`, "success");
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

/* ===== Panel ===== */
.bo-panel {
  padding: 1.25rem;
  border: 1px solid var(--bo-border, #dfe7ec);
  border-radius: 10px;
  background: #fff;
}

/* ===== Empty ===== */
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

/* ===== Staff list ===== */
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

/* ===== Form ===== */
.bo-form { display: grid; gap: 1rem; padding: 1.4rem; }

.bo-field { display: grid; gap: 0.4rem; font-weight: 800; color: var(--bo-primary, #17334a); font-size: 0.92rem; }
.bo-field em { color: #c0392b; font-style: normal; }

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
</style>
