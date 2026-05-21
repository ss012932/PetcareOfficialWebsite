import type { BrandFeatureKey } from "~/composables/usePermissionStore";

declare module "#app" {
  interface PageMeta {
    /** 存取此頁需要的品牌功能 key；'subscription' 代表只需有效訂閱 */
    brandFeature?: BrandFeatureKey | "subscription";
  }
}

/**
 * brand-feature middleware
 * 依 route.meta.brandFeature 檢查品牌功能權限。
 * 無權限時轉向 /member/dashboard，防止直接輸入 URL 進入受保護頁面。
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const requiredFeature = to.meta.brandFeature;
  if (!requiredFeature) return;

  const permStore = usePermissionStore();
  await permStore.load();

  if (!permStore.canAccess(requiredFeature)) {
    return navigateTo("/member/dashboard");
  }
});
