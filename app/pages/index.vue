<template>
  <div class="home-page">
    <!-- ======== HERO SECTION ======== -->
    <section class="hero">
      <div class="hero-content">
        <div class="container">
          <p class="hero-eyebrow">🐾 寵物健康照護專家</p>
          <h1 class="hero-title">專業寵物醫療服務</h1>
          <p class="hero-desc">
            提供全方位的寵物醫療照護，從預防保健到疾病治療，我們承諾用心守護您最親密的家人
          </p>
          <div class="hero-actions">
            <NuxtLink to="#services" class="btn btn-primary">
              瞭解服務
            </NuxtLink>
            <NuxtLink to="#contact" class="btn btn-outline">
              預約掛號
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="hero-image">
        <img
          src="https://images.unsplash.com/photo-1587300411107-ec4ea46e7f64?w=800&q=80"
          alt="寵物醫療中心診間"
          class="hero-img"
        />
      </div>
    </section>

    <!-- ======== 服務項目 ======== -->
    <section class="services-section" id="services">
      <div class="container">
        <header class="section-header">
          <div class="divider"></div>
          <h2 class="section-title">我們提供的服務</h2>
          <p class="section-desc">
            完整的寵物醫療服務，滿足您愛寵在各個生命階段的健康需求
          </p>
        </header>

        <ul class="services-grid grid grid-3" role="list">
          <li class="service-card card">
            <div class="service-icon">🏥</div>
            <article class="card-body">
              <h3>一般診療</h3>
              <p>
                提供內科、外科等一般門診服務，針對常見寵物疾病進行診斷與治療
              </p>
            </article>
          </li>

          <li class="service-card card">
            <div class="service-icon">💉</div>
            <article class="card-body">
              <h3>預防保健</h3>
              <p>
                疫苗接種、寄生蟲防治、口腔保健等預防性醫療照護
              </p>
            </article>
          </li>

          <li class="service-card card">
            <div class="service-icon">✂️</div>
            <article class="card-body">
              <h3>外科手術</h3>
              <p>
                包含一般手術、骨科手術、軟組織手術等專業外科服務
              </p>
            </article>
          </li>

          <li class="service-card card">
            <div class="service-icon">🔬</div>
            <article class="card-body">
              <h3>檢驗檢查</h3>
              <p>
                完整的血液檢驗、影像診斷（X光、超音波）等診斷工具
              </p>
            </article>
          </li>

          <li class="service-card card">
            <div class="service-icon">🦷</div>
            <article class="card-body">
              <h3>牙科治療</h3>
              <p>
                專業的寵物牙科治療，包含洗牙、牙科手術等服務
              </p>
            </article>
          </li>

          <li class="service-card card">
            <div class="service-icon">🏆</div>
            <article class="card-body">
              <h3>健康檢查</h3>
              <p>
                定期健康檢查計畫，及早發現潛在健康問題
              </p>
            </article>
          </li>
        </ul>
      </div>
    </section>

    <!-- ======== 醫療團隊 ======== -->
    <section class="doctors-section bg-light" id="doctors">
      <div class="container">
        <header class="section-header">
          <div class="divider"></div>
          <h2 class="section-title">醫療團隊</h2>
          <p class="section-desc">
            由經驗豐富、充滿愛心的獸醫專家組成，致力於提供最優質的寵物醫療
          </p>
        </header>

        <ul class="doctors-grid grid grid-3" role="list">
          <li class="doctor-card card">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"
              alt="李獸醫"
              class="doctor-avatar"
            />
            <article class="card-body">
              <h3>李獸醫</h3>
              <p class="doctor-title">院長・內科專科</p>
              <p class="doctor-bio">
                擁有15年寵物醫療經驗，專長於內科疾病診療與健康管理
              </p>
            </article>
          </li>

          <li class="doctor-card card">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
              alt="王獸醫"
              class="doctor-avatar"
            />
            <article class="card-body">
              <h3>王獸醫</h3>
              <p class="doctor-title">外科專科</p>
              <p class="doctor-bio">
                具備高度外科技術，擅長複雜手術與骨科疾病治療
              </p>
            </article>
          </li>

          <li class="doctor-card card">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80"
              alt="陳獸醫"
              class="doctor-avatar"
            />
            <article class="card-body">
              <h3>陳獸醫</h3>
              <p class="doctor-title">牙科專科</p>
              <p class="doctor-bio">
                專攻寵物牙科治療，擁有最新的牙科診療技術
              </p>
            </article>
          </li>
        </ul>
      </div>
    </section>

    <!-- ======== 關於我們 ======== -->
    <section class="about-section" id="about">
      <div class="container">
        <div class="about-content">
          <article class="about-text">
            <h2>關於寵物醫療中心</h2>
            <p>
              我們於 2015 年創立，致力於為台北市的寵物提供最優質的醫療服務。擁有現代化的醫療設備，配合經驗豐富的獸醫團隊，為您的愛寵提供溫暖而專業的醫療照護。
            </p>
            <p>
              每一個患者在我們心中都是獨特的，我們以同理心與專業知識，為每隻寵物制訂個人化的治療方案，讓您的家人能夠健康快樂地陪伴您每一天。
            </p>
            <ul class="about-features" role="list">
              <li>✓ 24 小時緊急醫療服務</li>
              <li>✓ 最新醫療設備與技術</li>
              <li>✓ 經驗豐富的醫療團隊</li>
              <li>✓ 人性化與同理心的照護</li>
            </ul>
          </article>

          <aside class="about-stats">
            <div class="stat-item">
              <div class="stat-number">10+</div>
              <div class="stat-label">年醫療經驗</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">5000+</div>
              <div class="stat-label">患者關懷</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">99%</div>
              <div class="stat-label">客戶滿意度</div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- ======== FAQ ======== -->
    <section class="faq-section bg-light" aria-label="常見問題">
      <div class="container">
        <header class="section-header">
          <div class="divider"></div>
          <h2 class="section-title">常見問題</h2>
        </header>

        <div class="faq-list">
          <details class="faq-item" open>
            <summary class="faq-question">
              <span class="faq-icon">+</span>
              初次就診需要準備什麼？
            </summary>
            <article class="faq-answer">
              <p>
                請準備寵物的疫苗記錄、過去的醫療紀錄（如有）以及詳細的症狀說明。建議也攜帶寵物的最近照片，方便醫生了解寵物的日常狀況。
              </p>
            </article>
          </details>

          <details class="faq-item">
            <summary class="faq-question">
              <span class="faq-icon">+</span>
              掛號費用多少？
            </summary>
            <article class="faq-answer">
              <p>
                一般診療掛號費為 $300 元，檢驗、手術等特殊項目另行計費。建議致電預約時詢問詳細費用說明。
              </p>
            </article>
          </details>

          <details class="faq-item">
            <summary class="faq-question">
              <span class="faq-icon">+</span>
              可以預約掛號嗎？
            </summary>
            <article class="faq-answer">
              <p>
                可以。我們提供電話與線上預約服務。電話預約：02-1234-5678，我們建議提前預約以避免等待時間過長。
              </p>
            </article>
          </details>

          <details class="faq-item">
            <summary class="faq-question">
              <span class="faq-icon">+</span>
              有提供緊急服務嗎？
            </summary>
            <article class="faq-answer">
              <p>
                有的，我們提供 24 小時緊急醫療服務。若您的寵物在營業時間外出現緊急情況，請立即撥打 02-1234-5678 與我們聯繫。
              </p>
            </article>
          </details>
        </div>
      </div>
    </section>

    <!-- ======== CTA BANNER ======== -->
    <section class="cta-banner bg-primary">
      <div class="container">
        <h2 class="cta-title">準備好照顧您的愛寵了嗎？</h2>
        <p class="cta-desc">
          今天就預約初次諮詢，讓我們幫您的寵物建立健康的未來
        </p>
        <NuxtLink to="#contact" class="btn btn-secondary">
          預約掛號
        </NuxtLink>
      </div>
    </section>

    <!-- ======== 聯絡我們 ======== -->
    <section class="contact-section" id="contact">
      <div class="container">
        <header class="section-header">
          <div class="divider"></div>
          <h2 class="section-title">聯絡我們</h2>
          <p class="section-desc">
            有任何問題或想預約掛號，歡迎透過以下方式與我們聯繫
          </p>
        </header>

        <div class="contact-grid grid grid-2">
          <article class="contact-card card">
            <h3 class="contact-card-title">📞 電話</h3>
            <p>
              <strong>主線：</strong> (02) 1234-5678<br />
              <strong>預約：</strong> (02) 1234-5679<br />
              <strong>急診：</strong> (02) 1234-5680
            </p>
          </article>

          <article class="contact-card card">
            <h3 class="contact-card-title">📍 地址</h3>
            <p>
              台北市中山區寵物路 123 號<br />
              捷運站牌近距離，交通便利
            </p>
          </article>

          <article class="contact-card card">
            <h3 class="contact-card-title">⏰ 營業時間</h3>
            <p>
              <strong>週一至五：</strong> 09:00 - 19:00<br />
              <strong>週六：</strong> 10:00 - 18:00<br />
              <strong>週日：</strong> 休診
            </p>
          </article>

          <article class="contact-card card">
            <h3 class="contact-card-title">📧 線上聯繫</h3>
            <p>
              <strong>Email：</strong> info@petcare.com<br />
              <strong>Line：</strong> @petcare<br />
              <strong>Facebook：</strong> 寵物醫療中心
            </p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// ===== SEO 設定（必須放最前面）=====
useHead({
  title: '首頁',
  meta: [
    {
      name: 'description',
      content:
        '寵物醫療中心提供專業的寵物醫療服務，包括一般診療、預防保健、外科手術、檢驗檢查、牙科治療等全方位照護。由經驗豐富的獸醫團隊駐診，致力於守護您愛寵的健康。',
    },
    {
      name: 'keywords',
      content: '寵物醫療, 獸醫, 寵物保健, 動物醫院, 寵物診所, 狗, 貓',
    },
    {
      property: 'og:title',
      content: '寵物醫療中心 | 專業寵物醫療服務',
    },
    {
      property: 'og:description',
      content:
        '寵物醫療中心提供專業的寵物醫療服務，包括一般診療、預防保健、外科手術、檢驗檢查等全方位照護',
    },
    {
      property: 'og:url',
      content: 'https://petcare.example.com',
    },
    {
      property: 'og:type',
      content: 'website',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://petcare.example.com',
    },
  ],
})

// ===== 動態效果 =====
const expandedFaq = ref<number | null>(0)

function toggleFaq(index: number) {
  expandedFaq.value = expandedFaq.value === index ? null : index
}

import { ref } from 'vue'
</script>

<style scoped>
/* ===== HERO SECTION ===== */
.hero {
  background: linear-gradient(135deg, #2c5f2d 0%, #1e4620 100%);
  color: #fff;
  padding: 3rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero-content {
  width: 100%;
}

.hero-content .container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-eyebrow {
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  opacity: 0.9;
  margin: 0;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  font-family: var(--font-heading);
}

.hero-desc {
  font-size: 1.125rem;
  line-height: 1.6;
  opacity: 0.95;
  max-width: 50rem;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hero-image {
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.hero-img {
  width: 100%;
  height: auto;
  display: block;
}

/* ===== 服務區塊 ===== */
.services-section {
  background-color: #fff;
}

.service-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  display: block;
}

.service-card article h3 {
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}

.service-card article p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
}

/* ===== 醫療團隊 ===== */
.doctor-avatar {
  width: 100%;
  height: 15rem;
  object-fit: cover;
  display: block;
}

.doctor-card article h3 {
  color: var(--color-primary);
  margin: 1rem 0 0.5rem 0;
}

.doctor-title {
  font-weight: 600;
  color: var(--color-secondary);
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
}

.doctor-bio {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
}

/* ===== 關於我們 ===== */
.about-section {
  padding: var(--spacing-2xl) var(--spacing-md);
}

.about-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

.about-text h2 {
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.about-text p {
  margin-bottom: 1.25rem;
  color: #666;
  line-height: 1.8;
}

.about-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-weight: 500;
  color: var(--color-primary);
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  text-align: center;
}

.stat-item {
  padding: 1.5rem;
  background-color: var(--color-primary-light);
  border-radius: var(--radius-lg);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  font-family: var(--font-heading);
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}

/* ===== FAQ ===== */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 60rem;
  margin: 0 auto;
}

.faq-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-base);
}

.faq-item[open] {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  font-weight: 600;
  color: var(--color-neutral-dark);
  user-select: none;
}

.faq-question:hover {
  background-color: var(--color-neutral-light);
}

.faq-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--color-primary);
  color: #fff;
  border-radius: 50%;
  font-size: 1rem;
  line-height: 1;
  flex-shrink: 0;
  transition: transform var(--transition-base);
}

.faq-item[open] .faq-icon {
  transform: rotate(45deg);
}

.faq-answer {
  padding: 0 1.25rem 1.25rem 1.25rem;
  color: #666;
  background-color: rgba(44, 95, 45, 0.03);
  line-height: 1.8;
}

.faq-answer p {
  margin: 0;
}

/* ===== CTA BANNER ===== */
.cta-banner {
  padding: 3rem 1.25rem;
  text-align: center;
}

.cta-banner .container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.cta-title {
  font-size: 1.75rem;
  color: #fff;
  margin: 0;
}

.cta-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 50rem;
}

/* ===== 聯絡區塊 ===== */
.contact-section {
  padding: var(--spacing-2xl) var(--spacing-md);
}

.contact-card {
  background-color: var(--color-neutral-light);
}

.contact-card-title {
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.contact-card article p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.8;
}

/* ===== 平板（768px 以上）===== */
@media (min-width: 48em) {
  .hero {
    padding: 4rem 2rem;
    flex-direction: row;
    gap: 3rem;
  }

  .hero-content {
    flex: 1;
  }

  .hero-image {
    flex: 1;
  }

  .hero-title {
    font-size: 3rem;
  }

  .about-content {
    grid-template-columns: 1fr 1fr;
  }

  .about-section {
    padding: var(--spacing-3xl) var(--spacing-lg);
  }

  .contact-section {
    padding: var(--spacing-3xl) var(--spacing-lg);
  }

  .hero-actions {
    flex-direction: row;
  }

  .cta-banner {
    padding: 4rem 2rem;
  }
}

/* ===== 桌機（1024px 以上）===== */
@media (min-width: 64em) {
  .hero {
    padding: 5rem 3rem;
  }

  .hero-title {
    font-size: 3.5rem;
  }

  .about-section {
    padding: 5rem 3rem;
  }

  .contact-section {
    padding: 5rem 3rem;
  }

  .cta-banner {
    padding: 5rem 3rem;
  }

  .about-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
