<template>
  <!-- ===== 服務條款 Modal 遮罩：控制背景半透明與點擊空白處關閉 ===== -->
  <Teleport to="body">
    <Transition name="terms-fade">
      <div v-if="modelValue" class="terms-backdrop" @click.self="closeModal">
        <!-- ===== 服務條款 Modal 主體：控制條款視窗內容 ===== -->
        <section
          class="terms-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-title"
        >
          <!-- ===== Modal 標題列：控制標題與關閉按鈕 ===== -->
          <header class="terms-header">
            <h2 id="terms-title" class="terms-title">購買與服務條款</h2>

            <button
              type="button"
              class="terms-close"
              aria-label="關閉服務條款視窗"
              @click="closeModal"
            >
              ×
            </button>
          </header>

          <!-- ===== 條款內容區：控制可滾動的服務條款文字 ===== -->
          <div class="terms-body">
            <p class="terms-version">條款版本：2026 年 5 月 14 日</p>
            <p>
              歡迎您購買或使用本平台所提供之寵物醫療管理系統服務
              （以下簡稱「本服務」）。為保障您的權益，請於註冊、
              購買或使用本服務前詳細閱讀以下條款。當您完成註冊、
              購買、付款、開通或實際使用本服務時，即視為您已閱讀、
              瞭解並同意本條款之所有內容。
            </p>

            <p>
              本服務主要提供動物醫院、寵物診所及相關寵物醫療照護單位使用，
              協助進行預約排程、電子病歷、看診流程、收費管理、庫存管理、
              報表分析及客戶關懷等數位化管理作業。
            </p>

            <section class="terms-section">
              <h3>一、服務內容說明</h3>

              <p>
                本服務為寵物醫療院所專用之數位管理平台，
                依使用者實際購買之方案不同，提供不同功能範圍。
                各方案之名稱、價格、使用期間、功能項目與適用對象，
                以本平台購買頁面、報價單、訂單內容或雙方確認之方案資料為準。
              </p>

              <h4>（一）Starter 開診版</h4>

              <p>
                適合單店、小型動物診所使用，協助診所建立基礎數位化管理流程。
              </p>

              <ul>
                <li>品牌與院所基本資料管理</li>
                <li>飼主管理</li>
                <li>寵物資料管理</li>
                <li>基本預約管理</li>
                <li>基本看診紀錄</li>
                <li>基本 Dashboard 統計</li>
              </ul>

              <h4>（二）Team 團隊版</h4>

              <p>
                適合已有多位員工的一般動物醫院使用。
                本方案包含基礎管理功能，並加入人事、帳號、權限與排班等團隊管理功能。
              </p>

              <ul>
                <li>基礎版所有功能</li>
                <li>收費紀錄管理</li>
                <li>人事系統</li>
                <li>員工帳號管理</li>
                <li>角色權限管理</li>
                <li>員工排班管理</li>
                <li>基本營運報表</li>
              </ul>

              <h4>（三）Business 營運版</h4>

              <p>
                適合中大型動物醫院使用。 本方案包含 Team
                團隊版主要功能，並加入住院照護、採購、一般庫存與進階報表等營運管理功能。
              </p>

              <ul>
                <li>Team 團隊版所有功能</li>
                <li>住院照護管理</li>
                <li>住院紀錄管理</li>
                <li>採購管理</li>
                <li>一般庫存管理</li>
                <li>檢查紀錄管理</li>
                <li>客戶回訪提醒</li>
                <li>進階報表</li>
              </ul>

              <h4>（四）Scale 連鎖版</h4>

              <p>
                適合連鎖動物醫院、集團型院所或需要高階營運管理功能的品牌使用。
                本方案包含 Business
                營運版主要功能，並加入多分店、跨店資料、藥品庫存與高階營運管理功能。
              </p>

              <ul>
                <li>Business 營運版所有功能</li>
                <li>多分店管理</li>
                <li>跨店資料管理</li>
                <li>藥品庫存管理</li>
                <li>藥局管理</li>
                <li>批號與效期管理</li>
                <li>跨店庫存查詢</li>
                <li>進階權限控管</li>
                <li>營運管理報表</li>
              </ul>

              <p class="terms-highlight">
                使用者理解並同意，實際可使用之功能、方案價格、優惠內容、使用期間、
                加購項目與開通範圍，應以使用者購買當下之平台顯示內容、
                訂單紀錄、報價單或雙方書面確認內容為準。
              </p>

              <p>
                本平台得依營運規劃、系統版本、技術限制或服務調整，
                修改、增加、移除或更名各方案之功能項目。
                惟使用者已完成付款且仍於有效期間內之方案，
                除雙方另有約定外，仍依購買當下所確認之方案內容提供服務。
              </p>
            </section>

            <section class="terms-section">
              <h3>二、帳號與使用權限</h3>

              <p>
                使用者應依本平台要求提供正確、完整且合法之註冊資料。
                使用者應妥善保管帳號、密碼及登入資訊，不得將帳號提供、
                出租、轉讓或借予第三人使用。
              </p>

              <p>
                若因使用者未妥善保管帳號密碼，導致資料外洩、遭第三方登入、
                操作異常或其他損害，使用者應自行負責。
              </p>

              <p>
                本平台得依購買方案提供不同數量之員工帳號、權限角色及功能範圍。
                若使用者需要額外帳號、分院、權限或功能，應依本平台規定另行加購或升級方案。
              </p>
            </section>

            <section class="terms-section">
              <h3>三、資料內容與使用限制</h3>

              <p>
                本服務可能包含飼主資料、寵物資料、預約紀錄、看診紀錄、
                檢查紀錄、用藥紀錄、收費紀錄、庫存紀錄及其他院所營運資料。
              </p>

              <p>
                使用者應確保其輸入、上傳、保存或處理之資料具有合法來源及使用權限，
                並應遵守個人資料保護法、醫療相關法規及其他中華民國相關法律規定。
              </p>

              <p>使用者不得於本服務中輸入、上傳或保存以下內容：</p>

              <ul>
                <li>違反法律或公序良俗之內容</li>
                <li>侵害他人著作權、商標權、營業秘密或其他智慧財產權之內容</li>
                <li>未經授權取得或使用之個人資料</li>
                <li>
                  惡意程式、病毒、木馬、釣魚連結或其他可能危害系統安全之內容
                </li>
                <li>
                  與本服務目的無關，且可能造成系統負擔或第三人權益受損之資料
                </li>
              </ul>
            </section>

            <section class="terms-section">
              <h3>四、資料保存、備份與安全</h3>

              <p>
                本平台將以合理之技術與管理措施維護系統安全，
                包含但不限於權限控管、資料備份、系統監控及必要之資安防護措施。
              </p>

              <p>
                惟使用者仍應自行妥善保存重要資料，並依院所內部管理需求定期備份或匯出重要紀錄。
                本平台不保證任何資料得永久保存、永不中斷或絕對不會遺失。
              </p>

              <p>
                使用者於服務有效期間內，得依本平台提供之功能匯出或備份其必要資料。
                服務終止、到期未續約或帳號停用後，本平台得於合理期間內保存相關資料；
                保存期間屆滿後，除法律另有規定或雙方另有約定外，
                本平台得刪除或匿名化相關資料。
              </p>
            </section>

            <section class="terms-section">
              <h3>五、加購服務說明</h3>

              <p>
                本平台得提供額外付費之加購服務，使用者可依院所需求另行選購。
              </p>

              <ul>
                <li>額外員工帳號</li>
                <li>額外分院管理功能</li>
                <li>進階報表分析</li>
                <li>客製化欄位設定</li>
                <li>客製化報表設計</li>
                <li>專屬導入教育訓練</li>
                <li>資料匯入與轉移服務</li>
                <li>系統流程客製化</li>
                <li>簡訊、Email 或 LINE 通知功能擴充</li>
                <li>雲端儲存空間擴充</li>
                <li>專屬技術支援服務</li>
                <li>API 串接或第三方系統整合</li>
              </ul>

              <p>
                加購服務須依所購主方案及其功能範圍搭配使用，
                並非所有加購項目均適用於所有方案。
              </p>

              <p>
                加購服務一經購買、開通、設定、製作或交付，
                即視為服務已開始提供。除法律另有強制規定、雙方另有書面約定、
                重複付款、錯誤收款，或可歸責於本平台致無法提供該加購服務之情形外，
                原則上不接受任意取消或退款申請。
              </p>
            </section>

            <section class="terms-section">
              <h3>六、購買與付款條款</h3>

              <p>
                本服務目前依方案採固定期間授權使用制，
                各方案之價格、原價、優惠價格、使用期間及付款方式，
                以本平台購買頁面、訂單內容、報價單或雙方約定內容為準。
              </p>

              <p>
                本服務為數位平台服務，無實體商品配送。
                使用者完成付款後，得依本平台開通流程取得該方案之使用權限。
              </p>

              <p>
                部分功能、客製內容、資料匯入、分院設定、報表設定或系統整合服務，
                須經資料確認、設定或製作完成後方可啟用。
              </p>

              <p>
                本平台保留調整服務價格、方案內容、功能項目及優惠活動之權利。
                惟已完成付款並於有效期間內之既有方案，除雙方另有約定外，不受價格調整影響。
              </p>

              <p>
                使用期間屆滿後，若使用者未完成續約或升級付款，
                本平台得暫停或終止該方案之使用權限。
                使用者如需繼續使用本服務，應依本平台當時公告之方案內容及價格辦理續約。
              </p>
            </section>

            <section class="terms-section">
              <h3>七、退款與終止條款</h3>

              <p>
                本服務包含主方案及加購服務，均屬數位內容、線上服務或客製化服務。
              </p>

              <p>
                使用者於勾選同意本條款並完成購買或付款時，
                即表示已知悉並同意本服務屬非以有形媒介提供之數位內容、
                線上服務或客製化服務，並同意本平台於付款完成後開始提供、
                開通、設定、授權或進行相關服務。
              </p>

              <p>
                依據《消費者保護法》第 19
                條及「通訊交易解除權合理例外情事適用準則」
                等相關規定，若本服務已開始提供、完成開通、設定、授權、客製化製作
                或使用者已實際使用，除法律另有強制規定外，不適用七日鑑賞期。
              </p>

              <p class="terms-highlight">
                本服務一經購買、付款、開通或啟用後，因本服務屬數位內容、
                線上服務或客製化服務，除法律另有強制規定、雙方另有書面約定、
                重複付款、錯誤收款，或可歸責於本平台致無法提供主要服務內容之情形外，
                原則上不接受任意取消、退款、部分退款或比例退款申請。
              </p>
            </section>

            <section class="terms-section">
              <h3>八、使用者責任與義務</h3>

              <p>
                使用者應確保提供予本平台之資料正確、完整且合法。
                使用者應自行負責院所內部資料管理、員工帳號權限設定及資料輸入內容之正確性。
              </p>

              <ul>
                <li>不得將本服務用於非法用途</li>
                <li>不得侵害他人權益或違反法令</li>
                <li>不得干擾、破壞或嘗試入侵本平台系統</li>
                <li>不得擅自複製、修改、反向工程或散布本平台程式碼</li>
                <li>不得大量傳送垃圾訊息、惡意請求或造成系統異常負載</li>
                <li>不得將帳號提供予未授權第三人使用</li>
                <li>應自行確認輸入之醫療、藥品、收費與庫存資料正確性</li>
              </ul>

              <p>
                本服務為管理輔助工具，並非醫療診斷、治療判斷或專業醫療意見之替代。
                所有寵物醫療診斷、治療、用藥及照護決策，
                仍應由具備合法資格之獸醫師或相關專業人員自行判斷並負責。
              </p>
            </section>

            <section class="terms-section">
              <h3>九、醫療資料與專業責任聲明</h3>

              <p>
                本平台僅提供寵物醫療院所進行資料紀錄、流程管理、預約排程、
                庫存管理、報表分析及客戶關懷之系統工具。
              </p>

              <p>
                本平台不參與、不干預亦不負責任何醫療診斷、治療處置、用藥建議、
                醫療糾紛或院所與飼主間之爭議。
              </p>

              <p>
                若因使用者輸入錯誤、判斷錯誤、操作錯誤、資料不完整或院所內部管理問題，
                導致醫療爭議、損害賠償、行政責任或第三方請求，本平台不負相關責任。
              </p>
            </section>

            <section class="terms-section">
              <h3>十、服務中斷與系統維護</h3>

              <p>
                本平台得因系統維護、版本更新、資安修補、設備調整、資料庫維護
                或其他必要作業，暫停全部或部分服務。
              </p>

              <p>
                若有計畫性維護，本平台將盡可能提前公告或通知使用者。
                惟遇緊急資安事件、系統異常、第三方服務異常或不可抗力因素時，
                本平台得不經事前通知即進行必要處理。
              </p>

              <p>
                本平台將於合理範圍內提供客服或技術支援。
                實際支援方式、服務時間、回覆時間、支援範圍及是否提供專屬支援，
                依使用者購買之方案內容、加購服務或雙方約定為準。
              </p>
            </section>

            <section class="terms-section">
              <h3>十一、第三方服務說明</h3>

              <p>本服務可能串接或使用第三方服務，包括但不限於：</p>

              <ul>
                <li>雲端主機服務</li>
                <li>金流服務</li>
                <li>Email 寄送服務</li>
                <li>簡訊服務</li>
                <li>LINE 或其他通知服務</li>
                <li>地圖服務</li>
                <li>網域、DNS 或 SSL 憑證服務</li>
                <li>第三方 API 或外部系統整合服務</li>
              </ul>

              <p>
                第三方服務之穩定性、價格、政策、服務內容及可用性，
                均可能由第三方供應商自行調整。
                若因第三方服務異常、政策調整、停止服務或不可歸責於本平台之原因，
                導致本服務部分功能受影響，本平台將盡合理努力協助處理，
                惟不負擔因此所生之間接損害、營業損失或預期利益損失。
              </p>
            </section>

            <section class="terms-section">
              <h3>十二、服務變更與終止</h3>

              <p>
                本平台保留修改、調整、增加、暫停或終止本服務部分功能、
                方案內容或系統介面之權利。
              </p>

              <p>
                若使用者違反本條款、侵害第三人權益、違反法律規定、
                未依約付款或有其他不當使用情形，本平台得視情節暫停或終止其使用權限。
                因前述可歸責於使用者之事由所生之服務中斷或終止，
                除法律另有強制規定或雙方另有書面約定外，
                使用者不得要求補償、退款或其他賠償。
              </p>
            </section>

            <section class="terms-section">
              <h3>十三、智慧財產權聲明</h3>

              <p>
                本平台之系統架構、介面設計、程式碼、資料庫設計、文件、
                商標、圖像、視覺設計、流程規劃及其他相關內容，
                均受智慧財產權相關法律保護。
              </p>

              <p>
                未經本平台事前書面同意，使用者不得重製、修改、散布、出租、
                出售、反向工程、轉授權或以任何方式用於本服務範圍以外之用途。
              </p>
            </section>

            <section class="terms-section">
              <h3>十四、個人資料保護</h3>

              <p>
                本平台將依個人資料保護法及相關法令規定，
                於提供本服務之必要範圍內蒐集、處理及利用使用者所提供之資料。
              </p>

              <p>
                使用者應確保其蒐集、輸入或使用飼主、員工或其他第三人個人資料時，
                已取得合法依據或必要授權。
              </p>

              <p>
                如因使用者未依法取得授權、違法蒐集個人資料、資料輸入錯誤、
                帳號管理不當或內部人員操作不當，導致個資爭議、行政處分或第三方請求，
                應由使用者自行負責。
              </p>

              <p>
                本平台於提供本服務之必要範圍內，可能蒐集、處理及利用使用者、
                院所員工、飼主或其他相關人員之姓名、聯絡方式、帳號資訊、
                院所資料、服務使用紀錄、付款紀錄及系統操作紀錄等資料。
              </p>

              <p>
                前述資料將用於帳號建立、身分驗證、服務提供、系統維運、
                客戶服務、付款處理、資安管理、通知聯繫、法令遵循及爭議處理等目的。
              </p>

              <p>
                使用者得依法請求查詢、閱覽、製給複製本、補充、更正、
                停止蒐集處理利用或刪除其個人資料。
                惟如相關資料為履行契約、依法保存、資安稽核或爭議處理所必要者，
                本平台得於必要範圍內繼續保存或處理。
              </p>

              <p>
                個人資料之利用期間為本服務存續期間、契約履行期間、
                法令規定保存期間、爭議處理或權利義務行使所必要之期間；
                利用地區包含本平台營運所在地、雲端服務或第三方服務實際處理資料之所在地。
              </p>

              <p>
                個人資料之利用對象包含本平台、受本平台委託處理事務之合作廠商、
                金流服務商、雲端服務商、通知服務商、技術支援服務商、
                依法有調查權或請求權之主管機關、司法機關或其他依法得請求提供資料之對象。
                利用方式包含電子、自動化系統、書面、電話、Email、簡訊、 LINE
                或其他合理且必要之方式。
              </p>

              <p>
                使用者得自由選擇是否提供個人資料，惟若拒絕提供本服務所必要之資料，
                可能導致無法完成註冊、付款、開通、身分驗證、客服處理或使用部分服務功能。
              </p>
            </section>

            <section class="terms-section">
              <h3>十五、責任限制</h3>

              <p>
                在法律允許之最大範圍內，本平台對於因使用或無法使用本服務所生之間接損害、
                營業損失、資料遺失、預期利益損失、商譽損失、第三方請求或其他衍生性損害，
                不負賠償責任。
              </p>

              <p>
                若依法本平台仍須負擔賠償責任，其賠償總額以使用者最近一期實際支付予本平台之服務費用為上限。
                但因本平台故意或重大過失所致者，不在此限。
              </p>
            </section>

            <section class="terms-section">
              <h3>十六、條款修改</h3>

              <p>
                本平台得視服務內容、法令變更、營運需求或系統調整，
                隨時修改本條款。
              </p>

              <p>
                條款修改後，本平台得以網站公告、系統通知、Email
                或其他合理方式通知使用者。
                使用者於條款修改後繼續使用本服務，即視為已閱讀、瞭解並同意修改後之條款。
              </p>
            </section>

            <section class="terms-section">
              <h3>十七、準據法與管轄法院</h3>

              <p>本條款之解釋與適用，以中華民國法律為準據法。</p>

              <p>
                如因本條款或本服務發生爭議，雙方應本於誠信原則協商解決；
                若仍無法解決，除法律另有強制規定外，
                雙方同意以台灣台北地方法院為第一審管轄法院。
              </p>
            </section>

            <section class="terms-section">
              <h3>十八、條款效力</h3>

              <p>
                本條款任一條款如因法律規定、主管機關命令或法院判決而被認定為無效、
                不成立或不得執行時，不影響其他條款之效力。
              </p>

              <p>
                雙方應於合法、有效且最接近原條款目的之範圍內，
                重新解釋或調整該條款內容。
              </p>
            </section>

            <section class="terms-section">
              <h3>十九、平台資訊與聯絡方式</h3>

              <p>
                本服務由本平台經營者提供。若使用者對本服務、付款、
                帳務、個人資料或本條款有任何疑問，得透過本平台公告之客服信箱、
                聯絡表單或其他官方聯絡方式與本平台聯繫。
              </p>

              <p>
                本平台得視營運需要更新聯絡方式，最新聯絡資訊以本平台網站公告內容為準。
              </p>

              <p>
                平台經營者：彩虹小馬工作室<br />
                統一編號：93205176<br />
                客服信箱：lovechristy1115@gmail.com
              </p>
            </section>
          </div>

          <!-- ===== 條款底部操作區：控制勾選同意與按鈕 ===== -->
          <footer class="terms-footer">
            <label class="terms-check">
              <input v-model="isAgreed" type="checkbox" />

              <span>
                我已詳細閱讀、理解並同意本購買與服務條款，
                並確認已充分了解所選方案之服務內容、功能範圍、價格、
                使用期間、開通方式、加購服務及退款限制。
                我同意於完成購買、付款、開通或使用本服務後，
                依本條款約定辦理相關權利義務。
              </span>
            </label>

            <button
              type="button"
              class="terms-submit"
              :disabled="!isAgreed"
              @click="confirmTerms"
            >
              同意條款並繼續購買
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

/* ===== Props：控制 Modal 是否開啟 ===== */
const props = defineProps<{
  modelValue: boolean;
  planName?: string;
  planCode?: string;
}>();

/* ===== Emits：通知父層關閉與同意條款 ===== */
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [planCode?: string];
}>();

/* ===== 同意狀態：控制按鈕是否可以點擊 ===== */
const isAgreed = ref(false);

/* ===== 關閉 Modal：通知父層關閉條款視窗 ===== */
function closeModal() {
  emit("update:modelValue", false);
}

/* ===== 確認條款：通知父層使用者已同意服務條款 ===== */
function confirmTerms() {
  if (!isAgreed.value) return;

  emit("confirm", props.planCode);
  closeModal();
}

/* ===== 每次重新開啟 Modal 時，重置勾選狀態 ===== */
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      isAgreed.value = false;
    }
  },
);
</script>

<style scoped>
/* ===== Modal 背景遮罩：控制整個畫面半透明背景 ===== */
.terms-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: grid;
  place-items: center;
  padding: 1rem;
  background-color: rgba(15, 37, 56, 0.58);
  backdrop-filter: blur(0.4rem);
}

/* ===== Modal 主體：控制服務條款視窗外觀 ===== */
.terms-modal {
  width: min(100%, 45rem);
  max-height: calc(100vh - 2rem);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border-radius: 1.35rem;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.99) 0%,
    rgba(248, 247, 243, 0.99) 100%
  );
  border: 1px solid rgba(230, 216, 189, 0.9);
  box-shadow: 0 24px 70px rgba(15, 37, 56, 0.28);
}

/* ===== Modal 標題列：控制標題與關閉按鈕排列 ===== */
.terms-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(230, 216, 189, 0.75);
}

/* ===== Modal 標題：控制購買與服務條款文字 ===== */
.terms-title {
  color: #2e4a62;
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

/* ===== 關閉按鈕：控制右上角 X ===== */
.terms-close {
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid rgba(217, 178, 111, 0.55);
  border-radius: 999px;
  color: #2e4a62;
  background-color: #fffaf0;
  font-size: 1.45rem;
  line-height: 1;
  cursor: pointer;
  transition: 0.2s ease;
}

/* ===== 關閉按鈕 hover：控制滑過效果 ===== */
.terms-close:hover {
  color: #ffffff;
  background-color: #2e4a62;
}

/* ===== 條款內容：控制文字可滾動區域 ===== */
.terms-body {
  overflow-y: auto;
  padding: 1.5rem;
  color: #263238;
  font-size: 0.95rem;
  line-height: 1.85;
}

/* ===== 條款版本日期：控制條款版本顯示樣式 ===== */
.terms-version {
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: right;
  margin-bottom: 1rem;
}

/* ===== 條款段落：控制段落間距 ===== */
.terms-body p {
  margin: 0 0 1rem;
}

/* ===== 條款章節：控制每一段服務條款距離 ===== */
.terms-section {
  padding-top: 1.2rem;
  margin-top: 1.2rem;
  border-top: 1px dashed rgba(217, 178, 111, 0.42);
}

/* ===== 條款章節標題：控制一、二、三標題 ===== */
.terms-section h3 {
  position: relative;
  color: #2e4a62;
  font-size: 1.05rem;
  font-weight: 900;
  margin-bottom: 0.85rem;
  padding-left: 0.8rem;
}

/* ===== 條款章節標題裝飾：控制左側金色線條 ===== */
.terms-section h3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.25rem;
  width: 0.2rem;
  height: 1rem;
  border-radius: 999px;
  background-color: #d9b26f;
}

/* ===== 條款小標：控制基本版、專業版等標題 ===== */
.terms-section h4 {
  color: #2e4a62;
  font-size: 0.98rem;
  font-weight: 900;
  margin: 1rem 0 0.5rem;
}

/* ===== 條款列表：控制項目符號間距 ===== */
.terms-section ul {
  display: grid;
  gap: 0.35rem;
  padding-left: 1.25rem;
  margin: 0 0 1rem;
}

/* ===== 條款重點：控制退款重要提示 ===== */
.terms-highlight {
  padding: 0.9rem 1rem;
  border: 1px solid rgba(217, 178, 111, 0.55);
  border-radius: 0.9rem;
  color: #2e4a62;
  background-color: #fffaf0;
  font-weight: 800;
}

/* ===== 底部操作區：控制同意勾選與按鈕 ===== */
.terms-footer {
  display: grid;
  gap: 1rem;
  padding: 1rem 1.5rem 1.25rem;
  border-top: 1px solid rgba(230, 216, 189, 0.75);
  background-color: rgba(255, 250, 240, 0.52);
}

/* ===== 同意條款勾選區：控制 checkbox 與文字排列 ===== */
.terms-check {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.7rem;
  align-items: flex-start;
  color: #263238;
  font-size: 0.92rem;
  font-weight: 800;
  line-height: 1.6;
  cursor: pointer;
}

/* ===== checkbox：控制勾選大小 ===== */
.terms-check input {
  width: 1.05rem;
  height: 1.05rem;
  margin-top: 0.22rem;
  accent-color: #2e4a62;
}

/* ===== 確認按鈕：控制同意條款並選擇方案按鈕 ===== */
.terms-submit {
  min-height: 3.25rem;
  border: 2px solid #d9b26f;
  border-radius: 999px;
  color: #ffffff;
  background: linear-gradient(135deg, #2e4a62 0%, #1f3548 100%);
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: 0.2s ease;
}

/* ===== 確認按鈕 hover：控制可點擊時的互動效果 ===== */
.terms-submit:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(31, 53, 72, 0.22);
}

/* ===== 確認按鈕 disabled：控制未勾選時不可點擊狀態 ===== */
.terms-submit:disabled {
  color: rgba(46, 74, 98, 0.45);
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(217, 178, 111, 0.35);
  cursor: not-allowed;
}

/* ===== Modal 動畫：控制淡入淡出 ===== */
.terms-fade-enter-active,
.terms-fade-leave-active {
  transition: opacity 0.2s ease;
}

/* ===== Modal 動畫狀態：控制透明度 ===== */
.terms-fade-enter-from,
.terms-fade-leave-to {
  opacity: 0;
}

/* ===== 平板以上：控制 Modal 尺寸與文字留白 ===== */
@media (min-width: 48em) {
  .terms-backdrop {
    padding: 2rem;
  }

  .terms-modal {
    width: min(100%, 52rem);
  }

  .terms-header {
    padding: 1.35rem 1.75rem;
  }

  .terms-body {
    padding: 1.75rem;
  }

  .terms-footer {
    padding: 1.15rem 1.75rem 1.35rem;
  }
}
</style>
