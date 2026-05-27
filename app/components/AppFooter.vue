<template>
  <!-- ===== Footer 區塊：控制整個網站頁尾 ===== -->
  <footer class="app-footer">
    <!-- ===== Footer 上方金色線條：控制與內容分隔 ===== -->
    <div class="footer-top-line" aria-hidden="true"></div>

    <!-- ===== Footer 主要內容：簡潔品牌資訊與行動按鈕 ===== -->
    <div class="footer-content">
      <div class="footer-inner">
        <!-- ===== 品牌資訊：控制 Logo 與簡短說明 ===== -->
        <section class="footer-brand-section">
          <NuxtLink to="/" class="footer-brand">
            <span class="footer-brand-icon" aria-hidden="true">🐾</span>
            <span>{{ t("site.brandFull") }}</span>
          </NuxtLink>

          <p class="footer-desc">
            {{ t("footer.description") }}
          </p>
        </section>

        <!-- ===== Footer 行動按鈕：控制導向價格方案 ===== -->
        <div class="footer-action">
          <NuxtLink to="/price" class="footer-cta">
            {{ t("footer.cta") }}
            <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ===== Footer 底部：控制版權與條款連結 ===== -->
    <div class="footer-bottom">
      <div class="footer-bottom-inner">
        <p class="copyright">
          &copy; 2026 {{ t("site.brandFull") }}. {{ t("footer.copyright") }}
        </p>

        <div class="footer-bottom-links">
          <NuxtLink to="/terms">
            {{ t("footer.terms") }}
          </NuxtLink>

          <span aria-hidden="true">・</span>

          <NuxtLink to="/privacy">
            {{ t("footer.privacy") }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style scoped>
/* ===== 頁尾容器：控制 Footer 背景與主色系 ===== */
.app-footer {
  --footer-primary: #2e4a62;
  --footer-primary-dark: #10283a;
  --footer-primary-deep: #0b2233;
  --footer-accent: #d9b26f;
  --footer-cream: #fffaf0;
  --footer-muted: rgba(255, 255, 255, 0.72);
  --footer-border: rgba(217, 178, 111, 0.2);

  position: relative;
  color: #ffffff;
  background:
    radial-gradient(circle at 12% 0%, rgba(217, 178, 111, 0.13), transparent 20rem),
    linear-gradient(
      135deg,
      var(--footer-primary) 0%,
      var(--footer-primary-dark) 52%,
      var(--footer-primary-deep) 100%
    );
  overflow: hidden;
}

/* ===== Footer 背景裝飾：控制淡金色圓形光影 ===== */
.app-footer::before {
  content: '';
  position: absolute;
  right: -8rem;
  bottom: -10rem;
  width: 22rem;
  height: 22rem;
  border-radius: 999px;
  background-color: rgba(217, 178, 111, 0.08);
  pointer-events: none;
}

/* ===== Footer 上方金線：控制與頁面內容分隔 ===== */
.footer-top-line {
  position: relative;
  z-index: 2;
  height: 0.16rem;
  background:
    linear-gradient(
      90deg,
      transparent 0%,
      rgba(217, 178, 111, 0.35) 25%,
      rgba(217, 178, 111, 0.9) 50%,
      rgba(217, 178, 111, 0.35) 75%,
      transparent 100%
    );
}

/* ===== Footer 主要內容：控制上下留白 ===== */
.footer-content {
  position: relative;
  z-index: 2;
  padding: 2.5rem 1.25rem;
}

/* ===== Footer 內層排版：手機版上下排列 ===== */
.footer-inner {
  width: min(100%, 75rem);
  margin: 0 auto;
  display: grid;
  gap: 1.75rem;
  align-items: center;
}

/* ===== 品牌區塊：控制 Logo 與描述寬度 ===== */
.footer-brand-section {
  display: grid;
  gap: 0.9rem;
}

/* ===== Footer 品牌 Logo：控制品牌名稱與 paw icon ===== */
.footer-brand {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-decoration: none;
}

/* ===== Footer 品牌 icon：控制 paw 圖示樣式 ===== */
.footer-brand-icon {
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  border: 1px solid rgba(217, 178, 111, 0.48);
  border-radius: 999px;
  color: var(--footer-primary);
  background-color: var(--footer-cream);
  font-size: 1rem;
}

/* ===== Footer 描述：控制品牌簡短說明 ===== */
.footer-desc {
  max-width: 38rem;
  color: var(--footer-muted);
  font-size: 0.95rem;
  line-height: 1.8;
  margin: 0;
}

/* ===== Footer 行動區：手機版靠左排列 ===== */
.footer-action {
  display: flex;
  justify-content: flex-start;
}

/* ===== Footer CTA：控制查看價格方案按鈕 ===== */
.footer-cta {
  min-height: 2.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0 1.35rem;
  border: 1px solid rgba(217, 178, 111, 0.95);
  border-radius: 999px;
  color: var(--footer-primary-dark);
  background:
    linear-gradient(
      135deg,
      #f2d18a 0%,
      var(--footer-accent) 100%
    );
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-decoration: none;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.2s ease,
    filter 0.2s ease,
    box-shadow 0.2s ease;
}

/* ===== Footer CTA hover：控制按鈕互動 ===== */
.footer-cta:hover {
  transform: translateY(-2px);
  filter: brightness(1.04);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.26);
}

/* ===== Footer 底部：控制版權區塊 ===== */
.footer-bottom {
  position: relative;
  z-index: 2;
  padding: 1.05rem 1.25rem;
  border-top: 1px solid var(--footer-border);
  background-color: rgba(5, 20, 31, 0.28);
}

/* ===== Footer 底部內容：手機版上下排列 ===== */
.footer-bottom-inner {
  width: min(100%, 75rem);
  margin: 0 auto;
  display: grid;
  gap: 0.65rem;
  justify-items: center;
}

/* ===== 版權文字：控制 copyright 樣式 ===== */
.copyright {
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.82rem;
  line-height: 1.6;
  text-align: center;
  margin: 0;
}

/* ===== 底部連結：控制服務條款與隱私權政策排列 ===== */
.footer-bottom-links {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.82rem;
}

/* ===== 底部連結文字：控制條款連結樣式 ===== */
.footer-bottom-links a {
  color: rgba(255, 255, 255, 0.62);
  text-decoration: none;
  transition: color 0.2s ease;
}

/* ===== 底部連結 hover：控制滑過效果 ===== */
.footer-bottom-links a:hover {
  color: var(--footer-accent);
}

/* ===== 平板以上：控制 Footer 左右排列 ===== */
@media (min-width: 48em) {
  .footer-content {
    padding: 2.75rem 2rem;
  }

  .footer-inner {
    grid-template-columns: 1fr auto;
    gap: 2rem;
  }

  .footer-action {
    justify-content: flex-end;
  }

  .footer-bottom {
    padding: 1.1rem 2rem;
  }

  .footer-bottom-inner {
    grid-template-columns: 1fr auto;
    justify-items: stretch;
    align-items: center;
  }

  .copyright {
    text-align: left;
  }
}

/* ===== 桌機以上：控制 Footer 留白更精緻 ===== */
@media (min-width: 64em) {
  .footer-content {
    padding: 3rem 3rem;
  }

  .footer-bottom {
    padding: 1.15rem 3rem;
  }
}
</style>