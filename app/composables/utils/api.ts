import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { showCustom } from "~/composables/utils/alert.js";

const apiClient = axios.create({
  baseURL: "/api",
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
      "/reset-password",
      "/cart",
      "/AuthMe", // ⭐ 加這個
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
    // 🔐 判斷 token 過期（修正版）
    // ===============================
    const isTokenExpired =
      detail.includes("登入逾時") ||
      detail.includes("過期") ||
      detail.toLowerCase().includes("token");

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

  delete(endpoint: string, data = {}, config = {}) {
    return apiClient.delete(endpoint, { data, ...config });
  },
};
