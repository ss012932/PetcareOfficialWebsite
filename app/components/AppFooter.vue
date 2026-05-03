<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-inner">
        <!-- 左側：公司資訊 -->
        <section class="footer-section">
          <h3 class="footer-title">寵物醫療中心</h3>
          <p class="footer-desc">
            提供專業的寵物醫療服務，致力於守護您愛寵的健康。
          </p>
          <div class="footer-contact">
            <p><strong>電話：</strong> 02-1234-5678</p>
            <p><strong>地址：</strong> 台北市中山區寵物路123號</p>
            <p><strong>營業時間：</strong> 週一至五 09:00-19:00</p>
          </div>
        </section>

        <!-- 中間：快速連結 -->
        <section class="footer-section">
          <h3 class="footer-title">快速連結</h3>
          <ul class="footer-links" role="list">
            <li><NuxtLink to="/">首頁</NuxtLink></li>
            <li><NuxtLink to="#services">服務項目</NuxtLink></li>
            <li><NuxtLink to="#doctors">醫療團隊</NuxtLink></li>
            <li><NuxtLink to="#about">關於我們</NuxtLink></li>
            <li><NuxtLink to="#contact">聯絡我們</NuxtLink></li>
          </ul>
        </section>

        <!-- 右側：社群連結 -->
        <section class="footer-section">
          <h3 class="footer-title">追蹤我們</h3>
          <ul class="social-links" role="list">
            <li>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                class="social-link"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                class="social-link"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.line.me"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Line"
                class="social-link"
              >
                Line
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>

    <!-- 版權資訊 -->
    <div class="footer-bottom">
      <div class="footer-inner">
        <p class="copyright">
          &copy; 2025 寵物醫療中心。保留所有權利。
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ===== 頁尾容器 ===== */
.app-footer {
  background-color: #2c5f2d;
  color: #fff;
  margin-top: 4rem;
}

/* ===== 頁尾內容 ===== */
.footer-content {
  padding: 3rem 1.25rem 2rem;
}

.footer-inner {
  max-width: 75rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

/* ===== 頁尾區塊 ===== */
.footer-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: 'Cormorant Garamond', serif;
  letter-spacing: 0.05em;
}

.footer-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.9;
}

/* ===== 聯絡資訊 ===== */
.footer-contact {
  font-size: 0.9rem;
  line-height: 1.8;
}

.footer-contact p {
  margin: 0.35rem 0;
}

/* ===== 快速連結 ===== */
.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-links a {
  color: #fff;
  transition: opacity 0.2s ease;
  font-size: 0.95rem;
}

.footer-links a:hover {
  opacity: 0.7;
  text-decoration: underline;
}

/* ===== 社群連結 ===== */
.social-links {
  list-style: none;
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
}

.social-link {
  color: #fff;
  transition: opacity 0.2s ease;
  font-size: 0.95rem;
}

.social-link:hover {
  opacity: 0.7;
  text-decoration: underline;
}

/* ===== 頁尾底部 ===== */
.footer-bottom {
  background-color: #1e4620;
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright {
  font-size: 0.85rem;
  text-align: center;
  opacity: 0.8;
  margin: 0;
}

/* ===== 平板（768px 以上）===== */
@media (min-width: 48em) {
  .footer-content {
    padding: 4rem 2rem 2rem;
  }

  .footer-inner {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }

  .footer-bottom {
    padding: 1.5rem 2rem;
  }
}

/* ===== 桌機（1024px 以上）===== */
@media (min-width: 64em) {
  .footer-content {
    padding: 5rem 3rem 2rem;
  }

  .footer-inner {
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }

  .footer-bottom {
    padding: 1.5rem 3rem;
  }
}
</style>
