// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // ===== SSR 配置 =====
  ssr: true,

  // ===== 應用程式頭設定（全域 SEO）=====
  app: {
    head: {
      htmlAttrs: { lang: 'zh-TW' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',

      title: '寵物醫療中心',
      titleTemplate: '%s | 寵物醫療中心',

      meta: [
        { name: 'description', content: '專業寵物醫療服務，提供全方位的寵物健康照護方案' },
        { name: 'keywords', content: '寵物醫療, 獸醫, 寵物保健, 動物醫院' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: '寵物醫療中心' },
        { property: 'og:title', content: '寵物醫療中心' },
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
  ],

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