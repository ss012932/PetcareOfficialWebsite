import { authAPI } from "~/composables/utils/api";

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return;

  const result = await authAPI.checkLoginStatus();

  if (!result.success || !result.isLogin) {
    return navigateTo({
      path: "/",
      query: {
        login: "1",
        redirect: "/member",
      },
    });
  }
});
