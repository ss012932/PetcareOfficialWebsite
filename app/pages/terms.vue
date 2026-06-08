<template>
  <main class="legal-page">
    <!-- ===== 頁面主視覺 ===== -->
    <section class="legal-hero">
      <div class="container legal-hero-container">
        <p class="section-eyebrow">{{ t('termsPage.hero.eyebrow') }}</p>
        <h1 class="legal-title">{{ t('termsPage.hero.title') }}</h1>
        <p class="legal-subtitle">{{ t('termsPage.hero.subtitle') }}</p>
        <p class="legal-version">{{ t('termsPage.hero.version') }}</p>
      </div>
    </section>

    <!-- ===== 條款內容 ===== -->
    <section class="legal-body">
      <div class="container legal-container">

        <div class="legal-intro">
          <p>{{ t('termsPage.intro.p1') }}</p>
          <p>{{ t('termsPage.intro.p2') }}</p>
        </div>

        <!-- 一、服務內容說明 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s1.title') }}</h2>
          <p>{{ t('termsPage.s1.p1') }}</p>

          <h3>{{ t('termsPage.s1.starterTitle') }}</h3>
          <p>{{ t('termsPage.s1.starterDesc') }}</p>
          <ul>
            <li v-for="(item, i) in tList('termsPage.s1.starterItems')" :key="i">{{ item }}</li>
          </ul>

          <h3>{{ t('termsPage.s1.teamTitle') }}</h3>
          <p>{{ t('termsPage.s1.teamDesc') }}</p>
          <ul>
            <li v-for="(item, i) in tList('termsPage.s1.teamItems')" :key="i">{{ item }}</li>
          </ul>

          <h3>{{ t('termsPage.s1.businessTitle') }}</h3>
          <p>{{ t('termsPage.s1.businessDesc') }}</p>
          <ul>
            <li v-for="(item, i) in tList('termsPage.s1.businessItems')" :key="i">{{ item }}</li>
          </ul>

          <h3>{{ t('termsPage.s1.scaleTitle') }}</h3>
          <p>{{ t('termsPage.s1.scaleDesc') }}</p>
          <ul>
            <li v-for="(item, i) in tList('termsPage.s1.scaleItems')" :key="i">{{ item }}</li>
          </ul>

          <p class="legal-highlight">{{ t('termsPage.s1.highlight') }}</p>
          <p>{{ t('termsPage.s1.p2') }}</p>
        </section>

        <!-- 二、帳號與使用權限 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s2.title') }}</h2>
          <p>{{ t('termsPage.s2.p1') }}</p>
          <p>{{ t('termsPage.s2.p2') }}</p>
          <p>{{ t('termsPage.s2.p3') }}</p>
        </section>

        <!-- 三、資料內容與使用限制 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s3.title') }}</h2>
          <p>{{ t('termsPage.s3.p1') }}</p>
          <p>{{ t('termsPage.s3.p2') }}</p>
          <p>{{ t('termsPage.s3.p3') }}</p>
          <ul>
            <li v-for="(item, i) in tList('termsPage.s3.items')" :key="i">{{ item }}</li>
          </ul>
        </section>

        <!-- 四、資料保存、備份與安全 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s4.title') }}</h2>
          <p>{{ t('termsPage.s4.p1') }}</p>
          <p>{{ t('termsPage.s4.p2') }}</p>
          <p>{{ t('termsPage.s4.p3') }}</p>
        </section>

        <!-- 五、加購服務說明 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s5.title') }}</h2>
          <p>{{ t('termsPage.s5.p1') }}</p>
          <ul>
            <li v-for="(item, i) in tList('termsPage.s5.items')" :key="i">{{ item }}</li>
          </ul>
          <p>{{ t('termsPage.s5.p2') }}</p>
          <p>{{ t('termsPage.s5.p3') }}</p>
        </section>

        <!-- 六、購買與付款條款 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s6.title') }}</h2>
          <p>{{ t('termsPage.s6.p1') }}</p>
          <p>{{ t('termsPage.s6.p2') }}</p>
          <p>{{ t('termsPage.s6.p3') }}</p>
          <p>{{ t('termsPage.s6.p4') }}</p>
          <p>{{ t('termsPage.s6.p5') }}</p>
        </section>

        <!-- 七、退款與終止條款 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s7.title') }}</h2>
          <p>{{ t('termsPage.s7.p1') }}</p>
          <p>{{ t('termsPage.s7.p2') }}</p>
          <p>{{ t('termsPage.s7.p3') }}</p>
          <p class="legal-highlight">{{ t('termsPage.s7.highlight') }}</p>
        </section>

        <!-- 八、使用者責任與義務 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s8.title') }}</h2>
          <p>{{ t('termsPage.s8.p1') }}</p>
          <ul>
            <li v-for="(item, i) in tList('termsPage.s8.items')" :key="i">{{ item }}</li>
          </ul>
          <p>{{ t('termsPage.s8.p2') }}</p>
        </section>

        <!-- 九、醫療資料與專業責任聲明 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s9.title') }}</h2>
          <p>{{ t('termsPage.s9.p1') }}</p>
          <p>{{ t('termsPage.s9.p2') }}</p>
          <p>{{ t('termsPage.s9.p3') }}</p>
        </section>

        <!-- 十、服務中斷與系統維護 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s10.title') }}</h2>
          <p>{{ t('termsPage.s10.p1') }}</p>
          <p>{{ t('termsPage.s10.p2') }}</p>
          <p>{{ t('termsPage.s10.p3') }}</p>
        </section>
        <!-- 十一、第三方服務說明 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s11.title') }}</h2>
          <p>{{ t('termsPage.s11.p1') }}</p>
          <ul>
            <li v-for="(item, i) in tList('termsPage.s11.items')" :key="i">{{ item }}</li>
          </ul>
          <p>{{ t('termsPage.s11.p2') }}</p>
        </section>

        <!-- 十二、服務變更與終止 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s12.title') }}</h2>
          <p>{{ t('termsPage.s12.p1') }}</p>
          <p>{{ t('termsPage.s12.p2') }}</p>
        </section>

        <!-- 十三、智慧財產權聲明 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s13.title') }}</h2>
          <p>{{ t('termsPage.s13.p1') }}</p>
          <p>{{ t('termsPage.s13.p2') }}</p>
        </section>

        <!-- 十四、個人資料保護 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s14.title') }}</h2>
          <p>{{ t('termsPage.s14.p1') }}</p>
          <p>{{ t('termsPage.s14.p2') }}</p>
          <p>{{ t('termsPage.s14.p3') }}</p>
        </section>

        <!-- 十五、責任限制 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s15.title') }}</h2>
          <p>{{ t('termsPage.s15.p1') }}</p>
          <p>{{ t('termsPage.s15.p2') }}</p>
        </section>

        <!-- 十六、條款修改 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s16.title') }}</h2>
          <p>{{ t('termsPage.s16.p1') }}</p>
          <p>{{ t('termsPage.s16.p2') }}</p>
        </section>

        <!-- 十七、準據法與管轄法院 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s17.title') }}</h2>
          <p>{{ t('termsPage.s17.p1') }}</p>
          <p>{{ t('termsPage.s17.p2') }}</p>
        </section>

        <!-- 十八、條款效力 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s18.title') }}</h2>
          <p>{{ t('termsPage.s18.p1') }}</p>
          <p>{{ t('termsPage.s18.p2') }}</p>
        </section>

        <!-- 十九、平台資訊與聯絡方式 -->
        <section class="legal-section">
          <h2>{{ t('termsPage.s19.title') }}</h2>
          <p>{{ t('termsPage.s19.p1') }}</p>
          <p>{{ t('termsPage.s19.p2') }}</p>

          <div class="legal-contact-card">
            <p class="legal-contact-label">{{ t('termsPage.s19.contactLabel') }}</p>
            <p>{{ t('termsPage.s19.contactName') }}</p>
            <p>{{ t('termsPage.s19.contactTaxId') }}</p>
            <p>{{ t('termsPage.s19.contactEmailLabel') }}<a href="mailto:lovechristy1115@gmail.com">lovechristy1115@gmail.com</a></p>
          </div>
        </section>

        <!-- 底部導覽 -->
        <div class="legal-nav-bottom">
          <NuxtLink to="/privacy" class="legal-nav-link">
            <Icon name="fa6-solid:arrow-right" class="legal-nav-icon" aria-hidden="true" />
            {{ t('termsPage.nav.toPrivacy') }}
          </NuxtLink>
          <NuxtLink to="/" class="legal-back-home">
            <Icon name="fa6-solid:house" class="legal-nav-icon" aria-hidden="true" />
            {{ t('termsPage.nav.backHome') }}
          </NuxtLink>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const { t, tm, rt } = useI18n()
const tList = (key: string): string[] => (tm(key) as unknown[]).map(item => rt(item as Parameters<typeof rt>[0]))

useHead({
  title: () => t('termsPage.seo.title'),
  meta: [
    { name: 'description', content: () => t('termsPage.seo.description') },
    { property: 'og:title', content: () => t('termsPage.seo.title') },
    { name: 'robots', content: 'noindex,nofollow' },
  ],
})
</script>

<style scoped>
/* ── Hero ── */
.legal-hero {
  padding: 4rem 0 3rem;
  background: linear-gradient(135deg, #f7fbf7 0%, #eef6ee 100%);
  border-bottom: 1px solid var(--color-border, #e0e0e0);
  text-align: center;
}
.legal-hero-container { max-width: 48rem; margin-inline: auto; }

.section-eyebrow {
  display: inline-block;
  color: var(--color-primary, #2c5f2d);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.legal-title {
  color: var(--color-primary, #2c5f2d);
  font-family: var(--font-heading, serif);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 0.75rem;
}

.legal-subtitle {
  color: #5a7060;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.legal-version {
  display: inline-block;
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  background: rgba(44, 95, 45, 0.08);
  color: var(--color-primary, #2c5f2d);
  font-size: 0.8rem;
  font-weight: 700;
}

/* ── Body Layout ── */
.legal-body {
  padding: 3rem 0 5rem;
}

.legal-container {
  max-width: 52rem;
  margin-inline: auto;
  padding-inline: 1.25rem;
}

/* ── Intro ── */
.legal-intro {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: #f7fbf7;
  border-left: 4px solid var(--color-primary, #2c5f2d);
  border-radius: 0 8px 8px 0;
  color: #3d5c3e;
  line-height: 1.85;
}
.legal-intro p + p { margin-top: 0.75rem; }

/* ── Section ── */
.legal-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border, #e0e0e0);
}
.legal-section:last-of-type { border-bottom: none; }

.legal-section h2 {
  color: var(--color-primary, #2c5f2d);
  font-size: 1.1rem;
  font-weight: 900;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(44, 95, 45, 0.15);
}

.legal-section h3 {
  color: #2c5f2d;
  font-size: 0.97rem;
  font-weight: 800;
  margin: 1.25rem 0 0.5rem;
}

.legal-section p {
  color: #3d4f3e;
  font-size: 0.93rem;
  line-height: 1.85;
  margin-bottom: 0.75rem;
}

.legal-section ul {
  margin: 0.5rem 0 0.75rem 1.25rem;
  list-style: disc;
  color: #3d4f3e;
  font-size: 0.92rem;
  line-height: 1.85;
}
.legal-section ul li + li { margin-top: 0.25rem; }

/* ── Highlight ── */
.legal-highlight {
  padding: 1rem 1.2rem;
  background: #fff8e1;
  border-left: 4px solid #f9a825;
  border-radius: 0 6px 6px 0;
  color: #7a5c00 !important;
  font-weight: 600 !important;
}

/* ── Contact Card ── */
.legal-contact-card {
  margin-top: 1rem;
  padding: 1.2rem 1.5rem;
  background: #f7fbf7;
  border: 1px solid rgba(44, 95, 45, 0.18);
  border-radius: 10px;
  font-size: 0.92rem;
  line-height: 1.9;
  color: #3d4f3e;
}
.legal-contact-label {
  font-weight: 900;
  color: var(--color-primary, #2c5f2d);
  margin-bottom: 0.4rem !important;
}
.legal-contact-card a {
  color: var(--color-primary, #2c5f2d);
  text-decoration: underline;
  word-break: break-all;
}
.legal-contact-card a:hover { opacity: 0.75; }

/* ── Bottom nav ── */
.legal-nav-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border, #e0e0e0);
}

.legal-nav-link,
.legal-back-home {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 800;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.legal-nav-link {
  background: var(--color-primary, #2c5f2d);
  color: #fff;
}
.legal-nav-link:hover { opacity: 0.85; }

.legal-back-home {
  background: transparent;
  color: var(--color-primary, #2c5f2d);
  border: 1px solid rgba(44, 95, 45, 0.3);
}
.legal-back-home:hover { background: #f0f7f0; }

.legal-nav-icon { font-size: 0.8rem; }

/* ── Container ── */
.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2rem);
}

/* ── RWD ── */
@media (max-width: 36em) {
  .legal-nav-bottom { flex-direction: column-reverse; align-items: stretch; text-align: center; }
  .legal-nav-link, .legal-back-home { justify-content: center; }
}
</style>


