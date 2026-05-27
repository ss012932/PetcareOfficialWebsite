// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // ===== SSR 配置 =====
  ssr: true,

   // ===== 路由規則 =====
  // 會員中心依賴登入 Cookie、使用者狀態，不需要 SEO
  // 所以 /member 底下全部改成 Client Side Rendering，避免 Hydration mismatch
  routeRules: {
    '/member': {
      ssr: false,
    },
    '/member/**': {
      ssr: false,
    },
  },

  // ===== 應用程式頭設定（全域 SEO）=====
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',

      title: 'PetCare｜寵你｜毛孩照護系統',
      titleTemplate: '%s | PetCare｜寵你｜毛孩照護系統',

      meta: [
        { name: 'description', content: '專業寵物醫療服務，提供全方位的寵物健康照護方案' },
        { name: 'keywords', content: '寵物醫療, 獸醫, 寵物保健, 動物醫院' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'PetCare｜寵你｜毛孩照護系統' },
        { property: 'og:title', content: 'PetCare｜寵你｜毛孩照護系統' },
        { property: 'og:description', content: '專業寵物醫療服務，提供全方位的寵物健康照護方案' },
        { property: 'og:url', content: 'https://petcare.example.com' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],

      link: [
        { rel: 'canonical', href: 'https://petcare.example.com' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // ===== 模組 =====
  modules: [
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxtjs/i18n',
  ],

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'zh-TW',
    langDir: '../app/i18n',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'petcare_locale',
      redirectOn: 'root',
      fallbackLocale: 'zh-TW',
    },
    locales: [
      { code: 'zh-TW', iso: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
      { code: 'zh-CN', iso: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'ja-JP', iso: 'ja-JP', name: '日本語', file: 'ja-JP.json' },
      { code: 'ko-KR', iso: 'ko-KR', name: '한국어', file: 'ko-KR.json' },
      { code: 'en-US', iso: 'en-US', name: 'English', file: 'en-US.json' },
      { code: 'th-TH', iso: 'th-TH', name: 'ไทย', file: 'th-TH.json' },
      { code: 'vi-VN', iso: 'vi-VN', name: 'Tiếng Việt', file: 'vi-VN.json' },
    ],
  },

  // ===== CSS 引入 =====
  css: [
    '~/assets/css/main.css',
  ],

  // ===== Vite 開發環境最佳化設定 =====
  vite: {
    // optimizeDeps 用來控制 Vite 預先打包哪些相依套件
    optimizeDeps: {
      // include 裡面的套件會在開發啟動時先處理
      // 避免執行中才發現新套件，造成頁面重新整理
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'sweetalert2',
      ],
    },
  },
})