<template>
  <!-- ===== Footer 區塊：控制整個網站頁尾 ===== -->
  <footer class="app-footer">
    <!-- ===== Footer 主要內容：控制公司資訊、快速連結、聯絡方式 ===== -->
    <div class="footer-content">
      <div class="footer-inner">

        <!-- ===== 左側公司資訊：控制品牌名稱與產品介紹 ===== -->
        <section class="footer-section">
          <h3 class="footer-title">PetCare System</h3>

          <p class="footer-desc">
            專為動物醫院打造的寵物醫療管理系統，整合掛號、病歷、收費、庫存與營運報表，協助院所提升管理效率。
          </p>

          <!-- ===== 聯絡資訊：控制業務聯繫資料 ===== -->
          <div class="footer-contact">
            <p><strong>業務信箱：</strong> sales@petcare-system.com</p>
            <p><strong>客服信箱：</strong> support@petcare-system.com</p>
            <p><strong>服務時間：</strong> 週一至五 09:00 - 18:00</p>
          </div>
        </section>

        <!-- ===== 中間快速連結：控制頁面錨點導覽 ===== -->
        <section class="footer-section">
          <h3 class="footer-title">快速連結</h3>

          <ul class="footer-links" role="list">
            <li>
              <NuxtLink to="/#home">
                首頁
              </NuxtLink>
            </li>

            <li>
              <NuxtLink to="/#features">
                功能介紹
              </NuxtLink>
            </li>

            <li>
              <NuxtLink to="/#pricing">
                價格方案
              </NuxtLink>
            </li>
          </ul>
        </section>

        <!-- ===== 右側產品資訊：控制系統重點與行動連結 ===== -->
        <section class="footer-section">
          <h3 class="footer-title">系統特色</h3>

          <ul class="feature-links" role="list">
            <li>雲端資料管理</li>
            <li>電子病歷紀錄</li>
            <li>預約掛號流程</li>
            <li>庫存與收費整合</li>
          </ul>

          <NuxtLink to="/#pricing" class="footer-cta">
            查看價格方案
          </NuxtLink>
        </section>

      </div>
    </div>

    <!-- ===== 版權資訊：控制最底部版權文字 ===== -->
    <div class="footer-bottom">
      <div class="footer-bottom-inner">
        <p class="copyright">
          &copy; 2026 PetCare System. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ===== 頁尾容器：控制整個 Footer 背景與文字顏色 ===== */
.app-footer {
  background: linear-gradient(135deg, #166534 0%, #14532d 100%);
  color: #ffffff;
  margin-top: 0;
}

/* ===== 頁尾內容：控制 Footer 主要內容上下間距 ===== */
.footer-content {
  padding: 3rem 1.25rem 2rem;
}

/* ===== 頁尾主要排版：控制三欄區塊排列 ===== */
.footer-inner {
  max-width: 75rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

/* ===== 頁尾區塊：控制每個欄位內部排列 ===== */
.footer-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ===== 頁尾標題：控制每欄標題樣式 ===== */
.footer-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: 0.02em;
}

/* ===== 頁尾描述：控制品牌介紹文字 ===== */
.footer-desc {
  max-width: 28rem;
  font-size: 0.95rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.88);
}

/* ===== 聯絡資訊：控制業務與客服資訊 ===== */
.footer-contact {
  font-size: 0.9rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
}

/* ===== 聯絡資訊段落：控制每行資料間距 ===== */
.footer-contact p {
  margin: 0.35rem 0;
}

/* ===== 快速連結清單：控制中間連結排列 ===== */
.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0;
  margin: 0;
}

/* ===== 快速連結文字：控制連結樣式 ===== */
.footer-links a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  font-size: 0.95rem;
}

/* ===== 快速連結滑過：控制滑鼠移入效果 ===== */
.footer-links a:hover {
  opacity: 0.75;
  text-decoration: underline;
}

/* ===== 系統特色清單：控制右側特色文字 ===== */
.feature-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
}

/* ===== 系統特色項目：控制每個特色前方符號 ===== */
.feature-links li::before {
  content: '✓';
  margin-right: 0.5rem;
  color: #bbf7d0;
  font-weight: 800;
}

/* ===== Footer CTA：控制查看價格方案按鈕 ===== */
.footer-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 2.75rem;
  margin-top: 0.75rem;
  padding: 0 1.25rem;
  border-radius: 999px;
  color: #166534;
  background-color: #ffffff;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

/* ===== Footer CTA 滑過：控制按鈕互動效果 ===== */
.footer-cta:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* ===== 頁尾底部：控制版權區塊背景 ===== */
.footer-bottom {
  background-color: rgba(20, 83, 45, 0.95);
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

/* ===== 頁尾底部內容：控制版權文字最大寬度 ===== */
.footer-bottom-inner {
  max-width: 75rem;
  margin: 0 auto;
}

/* ===== 版權文字：控制最底部文字樣式 ===== */
.copyright {
  font-size: 0.85rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.78);
  margin: 0;
}

/* ===== 平板以上：控制 Footer 兩欄排列 ===== */
@media (min-width: 48em) {
  .footer-content {
    padding: 4rem 2rem 2rem;
  }

  .footer-inner {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }

  .footer-bottom {
    padding: 1.25rem 2rem;
  }
}

/* ===== 桌機以上：控制 Footer 三欄排列 ===== */
@media (min-width: 64em) {
  .footer-content {
    padding: 4.5rem 3rem 2rem;
  }

  .footer-inner {
    grid-template-columns: 1.4fr 0.8fr 0.8fr;
    gap: 3rem;
  }

  .footer-bottom {
    padding: 1.25rem 3rem;
  }
}
</style>