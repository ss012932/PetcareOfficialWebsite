import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { showCustom } from "~/composables/utils/alert.js";

const apiClient = axios.create({
  //baseURL: "http://localhost:7281/api",
  baseURL: "https://petcare-api.christylove.com.tw/api",
  withCredentials: true,
});

// ===============================
// Request interceptor
// ===============================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url?.includes("/upload")) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isShowing401 = false;
let isRedirecting = false;

// ===============================
// Response interceptor
// ===============================
apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const config = error.config;
    const requestUrl = config?.url || "";

    const skipAuth401APIs = [
      "/Login", // ⭐ 登入失敗不應該調用登出
      "/Register", // ⭐ 註冊失敗不應該調用登出
      "/reset-password",
      "/cart",
      "/AuthMe",
    ];

    const shouldSkip401 = skipAuth401APIs.some((api) =>
      requestUrl.includes(api),
    );

    if (isRedirecting || shouldSkip401) {
      return Promise.reject(error);
    }

    const detail = data?.detail || "";
    const message = data?.message || "";

    // ===============================
    // ❗ 核心：401 一律處理
    // ===============================
    if (status === 401 && !isShowing401) {
      isShowing401 = true;
      isRedirecting = true;

      try {
        try {
          await apiClient.post("/Logout");
        } catch {}

        if (import.meta.client) {
          await showCustom(
            "登入逾時",
            detail || message || "請重新登入",
            "warning",
          );

          // ===============================
          // 🔥 清狀態（你缺這個）
          // ===============================
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("currentWeddingId");

          // ⭐ 強制刷新（關鍵）
          window.location.href = "/";
        }
      } finally {
        setTimeout(() => {
          isShowing401 = false;
          isRedirecting = false;
        }, 1000);
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default {
  get(endpoint: string, params = {}, config = {}) {
    return apiClient.get(endpoint, { params, ...config });
  },

  post(endpoint: string, data: any, config = {}) {
    return apiClient.post(endpoint, data, config);
  },

  put(endpoint: string, data: any, config = {}) {
    return apiClient.put(endpoint, data, config);
  },

  patch(endpoint: string, data: any, config = {}) {
    return apiClient.patch(endpoint, data, config);
  },

  delete(endpoint: string, data = {}, config = {}) {
    return apiClient.delete(endpoint, { data, ...config });
  },
};

// ===== 認證相關 API =====
export const authAPI = {
  // ===== 檢查登入狀態 =====
  async checkLoginStatus() {
    try {
      const response = await apiClient.get("/AuthMe");
      return response.data;
    } catch (error) {
      return {
        success: false,
        isLogin: false,
        user: null,
      };
    }
  },

  // ===== 登出 =====
  async logout() {
    try {
      await apiClient.post("/Logout");
    } catch (error) {
      // 即使 API 失敗也繼續清除本地資料
      console.error("登出 API 呼叫失敗，但仍會清除本地資料", error);
    } finally {
      // 不管 API 是否成功，都清除本地資料
      if (import.meta.client) {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentWeddingId");
      }
    }
  },

  // ===== 忘記密碼 =====
  async forgotPassword(email: string) {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  // ===== 驗證重設密碼 Token =====
  async validateResetToken(token: string) {
    const response = await apiClient.get("/auth/validate-reset-token", {
      params: { token },
    });
    return response.data;
  },

  // ===== 重設密碼 =====
  async resetPassword(token: string, newPassword: string) {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },

  // ===== 綁定 Email =====
  async emailBind(token: string) {
    const response = await apiClient.post("/email-bind", { token });
    return response.data;
  },
};
