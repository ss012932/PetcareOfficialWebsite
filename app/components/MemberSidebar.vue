<template>
  <aside class="bo-sidebar">
    <!-- ===== 使用者資訊區 ===== -->
    <div class="bo-profile">
      <span class="bo-avatar" aria-hidden="true">{{ userInitial }}</span>
      <div class="bo-profile-info">
        <p class="bo-profile-label">管理後台</p>
        <strong class="bo-profile-name">{{
          user.Name || "PetCare 管理者"
        }}</strong>
        <span class="bo-profile-email">{{ user.Email }}</span>
      </div>
    </div>

    <!-- ===== 品牌選擇器 ===== -->
    <div v-if="permStore.brands.length > 0" class="bo-brand-selector">
      <label class="bo-brand-label">
        <Icon name="fa6-solid:tag" class="bo-brand-label-icon" aria-hidden="true" />
        目前品牌
      </label>
      <div class="bo-brand-select-wrap">
        <select
          :value="permStore.brandId ?? ''"
          class="bo-brand-select"
          :disabled="permStore.loading"
          @change="onBrandChange"
        >
          <option
            v-for="brand in permStore.brands"
            :key="brand.id"
            :value="brand.id"
          >
            {{ brand.name }}
          </option>
        </select>
        <Icon
          name="fa6-solid:chevron-down"
          class="bo-brand-select-arrow"
          aria-hidden="true"
        />
      </div>
    </div>

    <!-- ===== 導覽選單 ===== -->
    <nav class="bo-nav" aria-label="後台導覽">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="bo-nav-item"
        active-class="is-active"
      >
        <Icon :name="item.icon" class="bo-nav-icon" aria-hidden="true" />
        <span class="bo-nav-label">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- ===== 底部操作 ===== -->
    <div class="bo-sidebar-footer">
      <NuxtLink to="/" class="bo-back-link">
        <Icon name="fa6-solid:arrow-left" aria-hidden="true" /> 回官網
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAuthStore } from "~/composables/auth";
import {
  usePermissionStore,
  type BrandFeatureKey,
} from "~/composables/usePermissionStore";

const authStore = useAuthStore();
const permStore = usePermissionStore();

onMounted(async () => {
  await authStore.loadUser();
  await permStore.load();
});

const user = computed(() => authStore.user);

const userInitial = computed(() =>
  (user.value.Name || user.value.Email || "P").trim().slice(0, 1).toUpperCase(),
);

async function onBrandChange(e: Event) {
  const id = Number((e.target as HTMLSelectElement).value);
  if (!id) return;
  await permStore.switchBrand(id);
}

// ===== 導覽清單定義 =====
// requiredFeature 未填 → 永遠顯示
// 'subscription'  → HasActiveSubscription 為 true 才顯示
// 其他 key        → Features[key] 為 true 才顯示
interface NavItem {
  to: string;
  label: string;
  icon: string;
  requiredFeature?: BrandFeatureKey | "subscription";
}

const ALL_NAV_ITEMS: NavItem[] = [
  { to: "/member/dashboard", label: "主控台",  icon: "fa6-solid:gauge-high"   },
  { to: "/member/profile",   label: "會員設定", icon: "fa6-solid:circle-user"  },
  { to: "/member/orders",    label: "訂單資訊", icon: "fa6-solid:receipt"      },
  { to: "/member/brand",     label: "品牌設定", icon: "fa6-solid:tag"          },
  {
    to: "/member/staff",
    label: "員工管理",
    icon: "fa6-solid:users",
    requiredFeature: "subscription",        // 只要有訂閱就開放
  },
  {
    to: "/member/clinics",
    label: "院所管理",
    icon: "fa6-solid:house-medical",
    requiredFeature: "StoreManagement",
  },
  {
    to: "/member/stores",
    label: "分店設定",
    icon: "fa6-solid:store",
    requiredFeature: "MultiStoreManagement",
  },
];

/** 依權限過濾後的選單 */
const navItems = computed(() =>
  ALL_NAV_ITEMS.filter((item) => {
    if (!item.requiredFeature) return true;
    return permStore.canAccess(item.requiredFeature);
  }),
);
</script>

<style scoped>
/* ===== 品牌選擇器 ===== */
.bo-brand-selector {
  padding: 0.6rem 0.8rem 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.bo-brand-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}

.bo-brand-label-icon {
  font-size: 0.65rem;
}

.bo-brand-select-wrap {
  position: relative;
}

.bo-brand-select {
  width: 100%;
  appearance: none;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 7px;
  color: #fff;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 800;
  padding: 0.45rem 2rem 0.45rem 0.7rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  outline: none;
}

.bo-brand-select:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(217, 178, 111, 0.5);
}

.bo-brand-select:focus {
  border-color: #d9b26f;
  background: rgba(255, 255, 255, 0.12);
}

.bo-brand-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* option 的背景色要配合深色側欄 */
.bo-brand-select option {
  background: #17334a;
  color: #fff;
}

.bo-brand-select-arrow {
  position: absolute;
  right: 0.65rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.7rem;
  pointer-events: none;
}
</style>
