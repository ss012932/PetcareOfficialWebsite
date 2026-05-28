import { defineStore } from "pinia";
import api from "~/composables/utils/api";

// ===== 型別 =====
export type BrandFeatureKey =
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

type Features = Record<BrandFeatureKey, boolean>;

export interface BrandOption {
  id: number;
  name: string;
}

type BrandItem = {
  Id?: number;
  id?: number;
  BrandName?: string;
  brandName?: string;
};

/**
 * Permission Store
 * 載入後台品牌功能權限，供 sidebar 與路由守衛共用。
 * 使用 `subscription` 作為特殊 key 表示「只需有效訂閱即可」。
 */
export const usePermissionStore = defineStore("permission", {
  state: () => ({
    loaded: false,
    loading: false,
    brands: [] as BrandOption[],
    brandId: null as number | null,
    hasActiveSubscription: false,
    features: {} as Partial<Features>,
  }),

  getters: {
    /**
     * 判斷是否可存取特定功能。
     * 傳入 'subscription' → 只檢查 HasActiveSubscription。
     * 傳入功能名稱 → 檢查 Features[key]。
     */
    canAccess:
      (state) =>
      (feature: BrandFeatureKey | "subscription"): boolean => {
        if (feature === "subscription") return state.hasActiveSubscription;
        return Boolean(state.features[feature as BrandFeatureKey]);
      },
  },

  actions: {
    /**
     * 載入品牌權限（idempotent：只執行一次，除非手動 reset）。
     * 1. 呼叫 GET /brands/my 取得第一個品牌 ID
     * 2. 呼叫 GET /permission/brand?brandId={id} 取得功能開關
     */
    async load() {
      if (this.loaded || this.loading) return;
      this.loading = true;
      try {
        const brandsRes = await api.get("/brands/my");
        const rawBrands: BrandItem[] =
          brandsRes.data?.Brands ??
          brandsRes.data?.brands ??
          brandsRes.data?.data?.Brands ??
          brandsRes.data?.data?.brands ??
          [];

        if (rawBrands.length === 0) return;

        // 儲存品牌列表供下拉選單使用
        this.brands = rawBrands
          .map((b) => ({
            id: (b.Id ?? b.id) as number,
            name: b.BrandName ?? b.brandName ?? String(b.Id ?? b.id),
          }))
          .sort((a, b) => a.id - b.id);

        const brandId = rawBrands[0]?.Id ?? rawBrands[0]?.id;

        if (!brandId) return;

        this.brandId = brandId;

        const permRes = await api.post("/permission/brand", { brandId });
        const data = permRes.data?.data;
        if (data) {
          this.hasActiveSubscription = Boolean(data.HasActiveSubscription);
          this.features = (data.Features ?? {}) as Partial<Features>;
        }
        this.loaded = true;
      } catch {
        // 載入失敗時預設全部關閉，避免意外開放
        this.loaded = true;
      } finally {
        this.loading = false;
      }
    },

    /** 切換品牌並重新載入對應權限 */
    async switchBrand(brandId: number) {
      if (this.brandId === brandId) return;
      this.loading = true;
      try {
        const permRes = await api.post("/permission/brand", { brandId });
        const data = permRes.data?.data;
        if (data) {
          this.brandId = brandId;
          this.hasActiveSubscription = Boolean(data.HasActiveSubscription);
          this.features = (data.Features ?? {}) as Partial<Features>;
        }
      } catch {
        // 切換失敗維持原有狀態
      } finally {
        this.loading = false;
      }
    },

    /** 清除快取，下次 load() 會重新呼叫 API */
    reset() {
      this.loaded = false;
      this.loading = false;
      this.brands = [];
      this.brandId = null;
      this.hasActiveSubscription = false;
      this.features = {};
    },

    /** 強制重新拉取品牌列表（不重置權限），供品牌 CRUD 後同步 Sidebar 下拉選單 */
    async reloadBrands() {
      try {
        const brandsRes = await api.get("/brands/my");
        const rawBrands: BrandItem[] =
          brandsRes.data?.Brands ??
          brandsRes.data?.brands ??
          brandsRes.data?.data?.Brands ??
          brandsRes.data?.data?.brands ??
          [];
        this.brands = rawBrands
          .map((b) => ({
            id: (b.Id ?? b.id) as number,
            name: b.BrandName ?? b.brandName ?? String(b.Id ?? b.id),
          }))
          .sort((a, b) => a.id - b.id);
      } catch {
        // 失敗時保留舊清單，不中斷頁面
      }
    },
  },
});
