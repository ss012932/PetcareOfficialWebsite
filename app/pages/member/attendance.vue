<template>
  <div class="bo-page attendance-page">
    <header class="bo-page-header attendance-header">
      <div>
        <p class="bo-kicker">Attendance Management</p>
        <h1 class="bo-page-title">出勤管理</h1>
        <p class="page-desc">依員工班表逐段比對實際打卡，支援多院所、二段班與多段班。</p>
      </div>

      <div class="header-actions">
        <NuxtLink to="/member/shifts" class="btn ghost">
          <Icon name="fa6-solid:calendar-days" aria-hidden="true" /> 查看排班
        </NuxtLink>
        <button class="btn primary" :disabled="loading" @click="loadOverview">
          <Icon name="fa6-solid:rotate" aria-hidden="true" /> 重新計算
        </button>
      </div>
    </header>

    <nav class="tab-bar" aria-label="出勤管理分頁">
      <button :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">
        <Icon name="fa6-solid:list-check" aria-hidden="true" /> 出勤總覽
      </button>
      <button :class="{ active: activeTab === 'leaves' }" @click="activeTab = 'leaves'">
        <Icon name="fa6-solid:calendar-minus" aria-hidden="true" /> 請假／假別
      </button>
      <button :class="{ active: activeTab === 'overtime' }" @click="openPayrollTab">
        <Icon name="fa6-solid:money-check-dollar" aria-hidden="true" /> 月薪試算
      </button>
      <button :class="{ active: activeTab === 'policy' }" @click="activeTab = 'policy'">
        <Icon name="fa6-solid:sliders" aria-hidden="true" /> 判定規則
      </button>
    </nav>

    <section v-if="activeTab === 'overview'" class="panel-stack">
      <div class="filter-panel">
        <label class="field">
          <span>月份</span>
          <input v-model="filters.month" type="month" />
        </label>
        <label class="field">
          <span>院所</span>
          <select v-model.number="filters.storeId">
            <option :value="0">全部院所</option>
            <option v-for="store in stores" :key="store.id" :value="store.id">{{ store.name }}</option>
          </select>
        </label>
        <label class="field">
          <span>員工</span>
          <select v-model.number="filters.staffId">
            <option :value="0">全部員工</option>
            <option v-for="staff in availableStaffs" :key="staff.staffId" :value="staff.staffId">
              {{ staff.fullName }}{{ staff.jobTitle ? `｜${staff.jobTitle}` : "" }}
            </option>
          </select>
        </label>
        <label class="field">
          <span>狀態</span>
          <select v-model="filters.status">
            <option value="All">全部狀態</option>
            <option value="Scheduled">尚未出勤</option>
            <option value="Normal">正常</option>
            <option value="Late">遲到</option>
            <option value="EarlyLeave">早退</option>
            <option value="LateAndEarlyLeave">遲到早退</option>
            <option value="MissingPunch">缺卡</option>
            <option value="Absent">曠職（確認扣薪）</option>
            <option value="Leave">休假／請假</option>
          </select>
        </label>
        <button class="btn primary filter-button" :disabled="loading" @click="loadOverview">
          <Icon name="fa6-solid:magnifying-glass" aria-hidden="true" /> 查詢
        </button>
      </div>

      <div class="summary-grid">
        <article class="summary-card neutral"><span>尚未出勤</span><strong>{{ summary.scheduledCount }}</strong></article>
        <article class="summary-card success"><span>正常</span><strong>{{ summary.normalCount }}</strong></article>
        <article class="summary-card warning"><span>遲到</span><strong>{{ summary.lateCount }}</strong></article>
        <article class="summary-card warning"><span>早退</span><strong>{{ summary.earlyLeaveCount }}</strong></article>
        <article class="summary-card danger"><span>遲到早退</span><strong>{{ summary.lateAndEarlyLeaveCount }}</strong></article>
        <article class="summary-card danger"><span>缺卡／未出勤</span><strong>{{ summary.missingPunchCount + summary.absentCount }}</strong></article>
        <article class="summary-card leave"><span>休假／請假</span><strong>{{ summary.leaveCount }}</strong></article>
      </div>

      <div class="data-panel">
        <div class="panel-heading">
          <div>
            <h2 class="attendance-record-title">{{ formattedMonth }} 出勤紀錄</h2>
            <p>共 {{ records.length }} 筆員工單日出勤；多段班可展開查看每一段。</p>
          </div>
          <span class="count-pill">{{ records.length }} 筆</span>
        </div>

        <div v-if="loading" class="state-card">出勤資料計算中…</div>
        <div v-else-if="records.length === 0" class="state-card">查無符合條件的排班與出勤資料。</div>
        <div v-else class="table-wrap">
          <table class="attendance-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>員工</th>
                <th>院所</th>
                <th>班別／時段</th>
                <th>實際打卡</th>
                <th>出勤狀態</th>
                <th>異常分鐘</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in records" :key="record.staffShiftId">
                <td><strong>{{ formatDate(record.shiftDate) }}</strong><small>{{ weekdayLabel(record.shiftDate) }}</small></td>
                <td><strong>{{ record.staffName }}</strong><small>{{ record.jobTitle || "未設定職稱" }}</small></td>
                <td>{{ record.storeName }}</td>
                <td><strong>{{ record.shiftName }}</strong><small>{{ record.segments.map(formatScheduledSegment).join("、") }}</small></td>
                <td><span>{{ summarizeActualPunches(record) }}</span><small v-if="record.segments.length > 1">共 {{ record.segments.length }} 段</small></td>
                <td><span class="status-badge" :class="statusClass(record.status)">{{ statusLabel(record.status) }}</span></td>
                <td>
                  <span v-if="record.lateMinutes">遲到 {{ record.lateMinutes }} 分</span>
                  <span v-if="record.earlyLeaveMinutes">早退 {{ record.earlyLeaveMinutes }} 分</span>
                  <span v-if="record.lateWaivedByWorkMinutes" class="waiver-note">
                    總工時 {{ formatWorkMinutes(record.actualWorkMinutes) }} 達標，遲到免計
                  </span>
                  <span v-if="!record.lateMinutes && !record.earlyLeaveMinutes && !record.lateWaivedByWorkMinutes">—</span>
                </td>
                <td><button class="btn ghost small" @click="openDetail(record)">查看明細</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section v-else-if="activeTab === 'leaves'" class="leave-panel">
      <div class="section-intro">
        <div>
          <h2>休假與請假類型參考</h2>
          <p>排班休息日、員工可申請假別與長期留職分開管理，避免把例假誤當成一般請假。</p>
        </div>
      </div>

      <section class="leave-reference-section">
        <header class="leave-group-heading">
          <div>
            <span class="leave-group-index">1</span>
            <div><h3>排班休息日</h3><p>例假目前可由「設定休假／請假」指定；休息日與國定假日仍由排班或行事曆管理。</p></div>
          </div>
        </header>
        <div class="leave-type-grid">
          <article v-for="type in scheduleRestTypes" :key="type.code" class="leave-type-card schedule-rest-card">
            <header>
              <span class="leave-icon"><Icon :name="leaveTypeIcon(type.code)" aria-hidden="true" /></span>
              <div><strong>{{ type.name }}</strong><small>{{ type.code }}</small></div>
              <span class="leave-kind-badge">排班指定</span>
            </header>
            <dl>
              <div><dt>法定額度</dt><dd>{{ type.quotaSummary }}</dd></div>
              <div><dt>薪資摘要</dt><dd>{{ type.paySummary }}</dd></div>
              <div><dt>適用說明</dt><dd>{{ type.legalSummary }}</dd></div>
            </dl>
          </article>
        </div>
      </section>

      <section class="leave-reference-section">
        <header class="leave-group-heading">
          <div>
            <span class="leave-group-index">2</span>
            <div><h3>可申請休假</h3><p>管理者可在員工排班時段中核准；補休與特休餘額目前尚未自動結算。</p></div>
          </div>
        </header>
        <div class="leave-type-grid">
          <article v-for="type in requestableLeaveTypes" :key="type.code" class="leave-type-card">
            <header>
              <span class="leave-icon"><Icon :name="leaveTypeIcon(type.code)" aria-hidden="true" /></span>
              <div><strong>{{ type.name }}</strong><small>{{ type.code }}</small></div>
              <span class="leave-kind-badge requestable">可申請</span>
            </header>
            <dl>
              <div><dt>法定額度</dt><dd>{{ type.quotaSummary }}</dd></div>
              <div><dt>薪資摘要</dt><dd>{{ type.paySummary }}</dd></div>
              <div><dt>適用說明</dt><dd>{{ type.legalSummary }}</dd></div>
            </dl>
          </article>
        </div>
      </section>

      <section v-if="longTermLeaveTypes.length" class="leave-reference-section">
        <header class="leave-group-heading">
          <div>
            <span class="leave-group-index">3</span>
            <div><h3>長期留職狀態</h3><p>不適合逐段排班請假，後續應由人事異動流程管理。</p></div>
          </div>
        </header>
        <div class="leave-type-grid">
          <article v-for="type in longTermLeaveTypes" :key="type.code" class="leave-type-card long-term-card">
            <header>
              <span class="leave-icon"><Icon :name="leaveTypeIcon(type.code)" aria-hidden="true" /></span>
              <div><strong>{{ type.name }}</strong><small>{{ type.code }}</small></div>
              <span class="leave-kind-badge long-term">人事狀態</span>
            </header>
            <dl>
              <div><dt>法定額度</dt><dd>{{ type.quotaSummary }}</dd></div>
              <div><dt>薪資摘要</dt><dd>{{ type.paySummary }}</dd></div>
              <div><dt>適用說明</dt><dd>{{ type.legalSummary }}</dd></div>
            </dl>
          </article>
        </div>
      </section>

      <div class="legal-note">
        <Icon name="fa6-solid:scale-balanced" aria-hidden="true" />
        <p>畫面內容僅供系統設定參考；實際請假、薪資與證明文件仍應依最新法令、勞動契約及公司優於法令規定處理。</p>
      </div>
    </section>

    <section v-else-if="activeTab === 'overtime'" class="overtime-panel payroll-panel">
      <div class="section-intro payroll-heading">
        <div>
          <h2>2026 月薪試算</h2>
          <p>以員工薪資、2026 勞健保級距、勞退及後台核准加班計算；未核准的加班不會帶入試算。</p>
        </div>
        <div class="payroll-heading-actions">
          <span class="overtime-law-badge">2026 台灣法規基準</span>
          <button class="btn ghost" type="button" :disabled="payrollLoading" @click="loadPayrollWorkspace">
            <Icon name="fa6-solid:rotate" aria-hidden="true" /> {{ payrollLoading ? "載入中…" : "重新計算" }}
          </button>
        </div>
      </div>

      <div class="payroll-toolbar">
        <label class="field">
          <span>加班審核狀態</span>
          <select v-model="overtimeStatus" @change="loadPayrollWorkspace">
            <option value="All">全部狀態</option>
            <option value="Pending">待審核</option>
            <option value="Approved">已核准</option>
            <option value="Rejected">已拒絕</option>
          </select>
        </label>
        <div class="payroll-rule-note">
          <Icon name="fa6-solid:circle-info" aria-hidden="true" />
          <span>員工從另一個打卡專案提出申請；此頁只負責審核與月薪彙總。</span>
        </div>
      </div>

      <section class="payroll-subpanel">
        <header class="payroll-subpanel-heading">
          <div>
            <span class="payroll-section-index">1</span>
            <div><h3>加班申請審核</h3><p>核准時可調整實際認列分鐘；只有已核准資料會進入月薪。</p></div>
          </div>
          <span class="count-pill">待審核 {{ pendingOvertimeCount }} 筆</span>
        </header>

        <div v-if="payrollLoading && overtimeApplications.length === 0" class="state-card">加班申請載入中…</div>
        <div v-else-if="overtimeApplications.length === 0" class="state-card">目前月份沒有符合條件的加班申請。</div>
        <div v-else class="table-wrap">
          <table class="overtime-review-table">
            <thead><tr><th>員工／院所</th><th>日期與類型</th><th>申請時間</th><th>申請原因</th><th>狀態</th><th>操作</th></tr></thead>
            <tbody>
              <tr v-for="item in overtimeApplications" :key="item.id">
                <td><strong>{{ item.staffName }}</strong><small>{{ item.storeName }}</small></td>
                <td><strong>{{ formatDate(item.overtimeDate) }}</strong><small>{{ overtimeDayLabel(item.dayType) }}</small></td>
                <td><strong>{{ formatTimeRange(item.startDateTime, item.endDateTime) }}</strong><small>申請 {{ formatWorkMinutes(item.requestedMinutes) }}<template v-if="item.status === 'Approved'">・核准 {{ formatWorkMinutes(item.approvedMinutes) }}</template></small></td>
                <td class="overtime-reason-cell"><span>{{ item.reason }}</span><small v-if="item.reviewNote">審核備註：{{ item.reviewNote }}</small></td>
                <td><span class="status-badge" :class="`overtime-status-${item.status.toLowerCase()}`">{{ overtimeStatusLabel(item.status) }}</span></td>
                <td>
                  <div v-if="item.status === 'Pending'" class="review-actions">
                    <button class="btn small primary" type="button" :disabled="reviewingOvertimeId === item.id" @click="reviewOvertime(item, 'Approved')">核准</button>
                    <button class="btn small danger" type="button" :disabled="reviewingOvertimeId === item.id" @click="reviewOvertime(item, 'Rejected')">拒絕</button>
                  </div>
                  <span v-else class="review-complete">已完成審核</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="payroll-subpanel">
        <header class="payroll-subpanel-heading">
          <div>
            <span class="payroll-section-index">2</span>
            <div><h3>獎金、津貼與其他加減項</h3><p>每筆項目都會保留名稱、金額與備註，新增或刪除後立即重新試算。</p></div>
          </div>
          <span class="count-pill">{{ allPayrollAdjustments.length }} 筆</span>
        </header>

        <form class="payroll-adjustment-form" @submit.prevent="createPayrollAdjustment">
          <label class="field">
            <span>員工 <em>*</em></span>
            <select v-model.number="payrollAdjustmentForm.staffId" required>
              <option :value="0" disabled>請選擇員工</option>
              <option v-for="employee in payroll?.employees ?? []" :key="employee.staffId" :value="employee.staffId">{{ employee.staffName }}</option>
            </select>
          </label>
          <label class="field">
            <span>類型 <em>*</em></span>
            <select v-model="payrollAdjustmentForm.adjustmentType" required>
              <option value="Bonus">獎金</option>
              <option value="Allowance">津貼</option>
              <option value="Addition">其他加項</option>
              <option value="Deduction">其他扣項</option>
            </select>
          </label>
          <label class="field">
            <span>名稱 <em>*</em></span>
            <input v-model.trim="payrollAdjustmentForm.name" maxlength="100" placeholder="例如：績效獎金、夜班津貼" required />
          </label>
          <label class="field">
            <span>金額 <em>*</em></span>
            <input v-model.number="payrollAdjustmentForm.amount" type="number" min="1" step="1" placeholder="請輸入金額" required />
          </label>
          <label class="field payroll-adjustment-note">
            <span>備註</span>
            <input v-model.trim="payrollAdjustmentForm.note" maxlength="500" placeholder="選填：核發原因或扣項依據" />
          </label>
          <button class="btn primary" type="submit" :disabled="savingPayrollAdjustment">{{ savingPayrollAdjustment ? "新增中…" : "新增加減項" }}</button>
        </form>

        <div v-if="allPayrollAdjustments.length" class="table-wrap">
          <table class="payroll-adjustment-table">
            <thead><tr><th>員工</th><th>類型</th><th>名稱</th><th>金額</th><th>備註</th><th></th></tr></thead>
            <tbody>
              <tr v-for="item in allPayrollAdjustments" :key="item.id">
                <td><strong>{{ item.staffName }}</strong></td>
                <td><span class="adjustment-type-badge" :class="`adjustment-${item.adjustmentType.toLowerCase()}`">{{ payrollAdjustmentTypeLabel(item.adjustmentType) }}</span></td>
                <td>{{ item.name }}</td>
                <td><strong>{{ formatCurrency(item.amount) }}</strong></td>
                <td>{{ item.note || "—" }}</td>
                <td><button class="btn danger small" type="button" @click="deletePayrollAdjustment(item)">刪除</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="payroll-subpanel">
        <header class="payroll-subpanel-heading">
          <div>
            <span class="payroll-section-index">3</span>
            <div><h3>{{ formattedMonth }} 薪資結果</h3><p>勞退雇主提繳 6% 列入雇主成本，不會從員工實領薪資扣除。</p></div>
          </div>
          <span class="count-pill">{{ payroll?.employees.length ?? 0 }} 位員工</span>
        </header>

        <div v-if="payroll" class="payroll-summary-grid">
          <article><span>獎金／津貼／加項</span><strong>{{ formatCurrency(payroll.totalBonusAndAllowance) }}</strong></article>
          <article><span>出勤扣薪</span><strong>{{ formatCurrency(payroll.totalAttendanceDeductions) }}</strong></article>
          <article><span>其他扣項</span><strong>{{ formatCurrency(payroll.totalOtherDeductions) }}</strong></article>
          <article><span>應發薪資合計</span><strong>{{ formatCurrency(payroll.totalGrossPay) }}</strong></article>
          <article><span>員工實領合計</span><strong>{{ formatCurrency(payroll.totalNetPay) }}</strong></article>
          <article><span>雇主勞退 6%</span><strong>{{ formatCurrency(payroll.totalEmployerPension) }}</strong></article>
          <article class="employer-cost"><span>雇主總成本</span><strong>{{ formatCurrency(payroll.totalEmployerCost) }}</strong></article>
        </div>

        <div v-if="payrollLoading && !payroll" class="state-card">月薪資料計算中…</div>
        <div v-else-if="!payroll || payroll.employees.length === 0" class="state-card">目前沒有可試算的啟用員工，請先在員工管理完成薪資與投保設定。</div>
        <div v-else class="table-wrap">
          <table class="payroll-table">
            <thead>
              <tr><th>員工</th><th>本薪／正常工資</th><th>核准加班</th><th>獎金／津貼／加項</th><th>出勤扣薪</th><th>其他扣項</th><th>應發薪資</th><th>員工自付</th><th>實領薪資</th><th>雇主負擔</th><th>雇主總成本</th></tr>
            </thead>
            <tbody>
              <tr v-for="employee in payroll.employees" :key="employee.staffId">
                <td><strong>{{ employee.staffName }}</strong><small>{{ employee.jobTitle || "未設定職稱" }}・{{ employee.salaryType === 'Monthly' ? '月薪制' : '時薪制' }}</small></td>
                <td><strong>{{ formatCurrency(employee.basePay) }}</strong><small>{{ employee.salaryType === 'Hourly' ? `正常工時 ${formatWorkMinutes(employee.regularWorkMinutes)}` : `約定月薪 ${formatCurrency(employee.salaryAmount)}` }}</small></td>
                <td><strong>{{ formatCurrency(employee.approvedOvertimePay) }}</strong><small>{{ employee.approvedOvertimeCount }} 筆・{{ formatWorkMinutes(employee.approvedOvertimeMinutes) }}</small></td>
                <td>
                  <strong>{{ formatCurrency(employee.bonusAmount + employee.allowanceAmount + employee.otherAdditionAmount) }}</strong>
                  <small>獎金 {{ formatCurrency(employee.bonusAmount) }}・津貼 {{ formatCurrency(employee.allowanceAmount) }}</small>
                  <small>其他加項 {{ formatCurrency(employee.otherAdditionAmount) }}</small>
                </td>
                <td>
                  <strong>{{ formatCurrency(employee.personalLeaveDeduction + employee.confirmedAbsenceDeduction + Math.max(0, -employee.sickLeavePayAdjustment)) }}</strong>
                  <small>事假／家庭照顧 {{ formatWorkMinutes(employee.personalLeaveMinutes) }}：{{ formatCurrency(employee.personalLeaveDeduction) }}</small>
                  <small>病假 {{ formatWorkMinutes(employee.sickLeaveMinutes) }}：{{ formatSignedCurrency(employee.sickLeavePayAdjustment) }}</small>
                  <small>曠職 {{ formatWorkMinutes(employee.confirmedAbsenceMinutes) }}：{{ formatCurrency(employee.confirmedAbsenceDeduction) }}</small>
                </td>
                <td><strong>{{ formatCurrency(employee.otherDeductionAmount) }}</strong><small>人工建立的其他扣項</small></td>
                <td><strong>{{ formatCurrency(employee.grossPay) }}</strong><small>加項－出勤扣薪－其他扣項</small></td>
                <td>
                  <strong>{{ formatCurrency(employee.employeeDeductions) }}</strong>
                  <small>勞保 {{ formatCurrency(employee.employeeLaborInsurance) }}・就保 {{ formatCurrency(employee.employeeEmploymentInsurance) }}</small>
                  <small>健保 {{ formatCurrency(employee.employeeHealthInsurance) }}・自提勞退 {{ formatCurrency(employee.employeeVoluntaryPension) }}</small>
                </td>
                <td class="net-pay-cell"><strong>{{ formatCurrency(employee.netPay) }}</strong><small>應發－員工自付</small></td>
                <td>
                  <strong>{{ formatCurrency(employee.employerLaborInsurance + employee.employerEmploymentInsurance + employee.employerHealthInsurance + employee.employerPension6Percent) }}</strong>
                  <small>勞退 6%：{{ formatCurrency(employee.employerPension6Percent) }}</small>
                  <small>勞保／就保／健保：{{ formatCurrency(employee.employerLaborInsurance + employee.employerEmploymentInsurance + employee.employerHealthInsurance) }}</small>
                </td>
                <td><strong>{{ formatCurrency(employee.employerCost) }}</strong><details v-if="employee.warnings.length" class="payroll-warning-details"><summary>查看 {{ employee.warnings.length }} 項提醒</summary><p v-for="warning in employee.warnings" :key="warning">{{ warning }}</p></details></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="overtime-legal-note payroll-legal-note">
        <Icon name="fa6-solid:scale-balanced" aria-hidden="true" />
        <p>本頁是薪資試算，不是正式薪資單。2026 勞保、就保、健保及勞退級距已內建；事假、家庭照顧假、普通病假半薪、人工確認曠職及薪資加減項已納入。所得稅、二代健保補充保費、職災保險行業別費率仍需在正式結算前核對。系統只自動彙總核准加班，但實際已提供的加班勞務仍應依事實與法令判斷，不能只因申請未核准就直接不計薪。</p>
      </div>
    </section>

    <section v-else class="policy-panel">
      <div class="section-intro">
        <div>
          <h2>出勤判定規則</h2>
          <p>規則套用於目前品牌的所有院所；每一段班都會獨立判定。</p>
        </div>
      </div>

      <form class="policy-form" @submit.prevent="savePolicy">
        <div class="policy-grid">
          <label class="field">
            <span>遲到寬限分鐘</span>
            <input v-model.number="policyForm.lateGraceMinutes" type="number" min="0" max="120" required />
            <small>例如設為 5，09:05 前打卡不算遲到。</small>
          </label>
          <label class="field">
            <span>早退寬限分鐘</span>
            <input v-model.number="policyForm.earlyLeaveGraceMinutes" type="number" min="0" max="120" required />
            <small>例如設為 5，17:55 後下班不算早退。</small>
          </label>
          <label class="field">
            <span>班前打卡比對範圍</span>
            <input v-model.number="policyForm.punchMatchBeforeMinutes" type="number" min="0" max="720" required />
            <small>預設 240 分鐘，用來配對提早到院的上班打卡。</small>
          </label>
          <label class="field">
            <span>班後打卡比對範圍</span>
            <input v-model.number="policyForm.punchMatchAfterMinutes" type="number" min="0" max="720" required />
            <small>預設 360 分鐘，支援延後下班與跨日班。</small>
          </label>
        </div>

        <label class="policy-toggle">
          <input v-model="policyForm.ignoreLateWhenWorkMinutesMet" type="checkbox" />
          <span class="policy-toggle-box" aria-hidden="true"></span>
          <span class="policy-toggle-copy">
            <strong>實際總工時達到班別要求時，不計遲到</strong>
            <small>
              例如班別要求 8 小時，員工雖然晚到，但完整打卡並補足 8 小時，就移除系統自動判定的遲到。
              二段班與多段班會加總各段實際工作分鐘；早退、缺卡、未出勤及人工指定狀態不受影響。
              未勾選時依預定上班時間與遲到寬限判定；寬限設為 0 時，09:00 班最晚須於 09:00 完成打卡，09:01 起算遲到。
            </small>
          </span>
        </label>

        <div class="policy-example">
          <strong>二段班判定範例</strong>
          <p>09:00～14:00 與 17:00～21:00 會分成兩段；第一段正常、第二段遲到時，當日結果會顯示遲到。</p>
        </div>

        <div class="form-actions">
          <button class="btn primary" type="submit" :disabled="savingPolicy">{{ savingPolicy ? "儲存中…" : "儲存判定規則" }}</button>
        </div>
      </form>
    </section>

    <Teleport to="body">
      <div v-if="detailRecord" class="modal-overlay">
        <section class="modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="attendance-detail-title">
          <header class="modal-header">
            <div>
              <p class="modal-kicker">Attendance Detail</p>
              <h2 id="attendance-detail-title" class="attendance-detail-title">
                <span class="attendance-detail-name">{{ detailRecord.staffName }}</span>
                <span class="attendance-detail-divider" aria-hidden="true">｜</span>
                <time class="attendance-detail-date">{{ formatDate(detailRecord.shiftDate) }}</time>
              </h2>
              <span>{{ detailRecord.storeName }}・{{ detailRecord.shiftName }}</span>
            </div>
            <button class="icon-btn" aria-label="關閉" @click="detailRecord = null">×</button>
          </header>

          <div class="modal-body detail-body">
            <div class="detail-summary">
              <span class="status-badge" :class="statusClass(detailRecord.status)">{{ statusLabel(detailRecord.status) }}</span>
              <button class="btn leave-btn" @click="openLeave(detailRecord.segments)">
                <Icon name="fa6-solid:calendar-minus" aria-hidden="true" /> 整天休假／請假
              </button>
            </div>

            <article v-for="segment in detailRecord.segments" :key="segment.staffShiftSegmentId" class="segment-card">
              <header>
                <div>
                  <span class="segment-index">第 {{ segment.sequenceNo }} 段</span>
                  <strong>{{ formatTimeRange(segment.scheduledStart, segment.scheduledEnd) }}</strong>
                </div>
                <span class="status-badge" :class="statusClass(segment.status)">{{ segmentStatusLabel(segment) }}</span>
              </header>

              <div class="segment-grid">
                <div><span>預定上班</span><strong>{{ formatDateTime(segment.scheduledStart) }}</strong></div>
                <div><span>預定下班</span><strong>{{ formatDateTime(segment.scheduledEnd) }}</strong></div>
                <div><span>實際上班</span><strong>{{ segment.clockIn ? formatDateTime(segment.clockIn) : "尚無紀錄" }}</strong></div>
                <div><span>實際下班</span><strong>{{ segment.clockOut ? formatDateTime(segment.clockOut) : "尚無紀錄" }}</strong></div>
              </div>

              <p v-if="segment.leaveTypeName" class="segment-note leave-note">{{ segment.leaveTypeName }}{{ segment.leaveReason ? `：${segment.leaveReason}` : "" }}</p>
              <p v-if="segment.adjustmentNote" class="segment-note">人工修正：{{ segment.adjustmentNote }}</p>

              <footer>
                <button class="btn ghost small" @click="openAdjustment(segment)">
                  <Icon name="fa6-solid:pen-to-square" aria-hidden="true" /> 補登／修正
                </button>
                <button v-if="segment.leaveId" class="btn danger small" @click="cancelLeave(segment)">取消休假／請假</button>
                <button v-else class="btn leave-btn small" @click="openLeave([segment])">設定休假／請假</button>
              </footer>
            </article>
          </div>
        </section>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="adjustmentTarget" class="modal-overlay top-layer">
        <section class="modal compact-modal" role="dialog" aria-modal="true" aria-labelledby="adjustment-title">
          <header class="modal-header">
            <div><p class="modal-kicker">Manual Adjustment</p><h2 id="adjustment-title">補登／修正出勤</h2></div>
            <button class="icon-btn" aria-label="關閉" @click="adjustmentTarget = null">×</button>
          </header>
          <form class="modal-body" @submit.prevent="saveAdjustment">
            <div class="target-info">
              <strong>第 {{ adjustmentTarget.sequenceNo }} 段</strong>
              <span>{{ formatTimeRange(adjustmentTarget.scheduledStart, adjustmentTarget.scheduledEnd) }}</span>
            </div>
            <div class="form-grid two">
              <label class="field"><span>修正上班時間</span><input v-model="adjustmentForm.clockIn" type="datetime-local" /></label>
              <label class="field"><span>修正下班時間</span><input v-model="adjustmentForm.clockOut" type="datetime-local" /></label>
            </div>
            <label class="field">
              <span>人工狀態</span>
              <select v-model="adjustmentForm.overrideStatus">
                <option value="">依時間自動判定</option>
                <option value="Normal">正常</option>
                <option value="Late">遲到</option>
                <option value="EarlyLeave">早退</option>
                <option value="LateAndEarlyLeave">遲到早退</option>
                <option value="MissingIn">缺上班卡</option>
                <option value="MissingOut">缺下班卡</option>
                <option value="Absent">未出勤</option>
              </select>
            </label>
            <label class="field"><span>修正原因 <em>*</em></span><textarea v-model.trim="adjustmentForm.note" rows="3" maxlength="500" required /></label>
            <div class="modal-actions"><button type="button" class="btn ghost" @click="adjustmentTarget = null">取消</button><button type="submit" class="btn primary" :disabled="savingAdjustment">{{ savingAdjustment ? "儲存中…" : "儲存修正" }}</button></div>
          </form>
        </section>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="leaveTargets.length" class="modal-overlay top-layer">
        <section class="modal compact-modal" role="dialog" aria-modal="true" aria-labelledby="leave-title">
          <header class="modal-header">
            <div><p class="modal-kicker">Attendance Leave</p><h2 id="leave-title">設定休假／請假</h2></div>
            <button class="icon-btn" aria-label="關閉" @click="leaveTargets = []">×</button>
          </header>
          <form class="modal-body" @submit.prevent="saveLeave">
            <div class="target-info">
              <strong>{{ leaveTargets.length }} 個排班時段</strong>
              <span>{{ leaveTargets.map(item => formatTimeRange(item.scheduledStart, item.scheduledEnd)).join("、") }}</span>
            </div>
            <label class="field">
              <span>假別 <em>*</em></span>
              <select v-model="leaveForm.leaveTypeCode" required>
                <option value="" disabled>請選擇休假／請假類型</option>
                <optgroup v-for="group in leaveSelectGroups" :key="group.code" :label="group.label">
                  <option v-for="type in group.items" :key="type.code" :value="type.code">{{ type.name }}</option>
                </optgroup>
              </select>
              <small v-if="selectedLeaveType?.code === 'WeeklyHoliday'" class="leave-select-note schedule-rest-note">
                例假由管理端指定，代表這個排班時段應為法定例假，不是員工提出請假。
              </small>
              <small v-else-if="selectedLeaveType?.code === 'Compensatory'" class="leave-select-note">
                補休必須已有加班換休時數；目前系統尚未自動核對可用餘額。
              </small>
            </label>
            <label class="field"><span>請假原因</span><textarea v-model.trim="leaveForm.reason" rows="3" maxlength="500" /></label>
            <label class="field"><span>證明文件說明</span><input v-model.trim="leaveForm.proofNote" maxlength="300" placeholder="例如：診斷證明待補、訃聞已確認" /></label>
            <div class="modal-actions"><button type="button" class="btn ghost" @click="leaveTargets = []">取消</button><button type="submit" class="btn leave-btn" :disabled="savingLeave">{{ savingLeave ? "儲存中…" : "儲存休假／請假" }}</button></div>
          </form>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import api from "~/composables/utils/api";
import { showCustom } from "~/composables/utils/alert";
import { usePermissionStore } from "~/composables/usePermissionStore";

const { t } = useI18n();
definePageMeta({ middleware: ["backoffice-auth", "brand-feature"], brandFeature: "ShiftManagement" });
useHead(() => ({ title: t("page.member.attendance") }));

interface StoreOption { id: number; name: string }
interface StaffOption { staffId: number; fullName: string; jobTitle: string | null; storeIds: number[] }
interface AttendanceSummary { scheduledCount: number; normalCount: number; lateCount: number; earlyLeaveCount: number; lateAndEarlyLeaveCount: number; missingPunchCount: number; absentCount: number; leaveCount: number }
interface AttendanceSegment { staffShiftSegmentId: number; sequenceNo: number; scheduledStart: string; scheduledEnd: string; clockIn: string | null; clockOut: string | null; clockSource: string; status: string; lateMinutes: number; earlyLeaveMinutes: number; lateWaivedByWorkMinutes: boolean; isStatusOverridden: boolean; leaveId: number | null; leaveTypeCode: string | null; leaveTypeName: string | null; leaveReason: string | null; adjustmentId: number | null; adjustmentNote: string | null }
interface AttendanceRecord { staffShiftId: number; brandId: number; storeId: number; storeName: string; staffId: number; staffName: string; jobTitle: string | null; shiftDate: string; shiftName: string; status: string; lateMinutes: number; earlyLeaveMinutes: number; scheduledWorkMinutes: number; actualWorkMinutes: number; lateWaivedByWorkMinutes: boolean; segments: AttendanceSegment[] }
interface LeaveType {
  code: string;
  name: string;
  categoryCode: string;
  isRequestable: boolean;
  sortOrder: number;
  legalSummary: string;
  paySummary: string;
  quotaSummary: string;
}
interface LeaveSelectGroup { code: string; label: string; items: LeaveType[] }

interface OvertimeApplication {
  id: number; brandId: number; storeId: number; storeName: string; staffId: number; staffName: string;
  staffShiftId: number | null; overtimeDate: string; dayType: string; startDateTime: string; endDateTime: string;
  requestedMinutes: number; approvedMinutes: number; reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled"; reviewNote: string | null; reviewDate: string | null;
}
interface PayrollAdjustment {
  id: number; brandId: number; staffId: number; staffName: string; payrollMonth: string;
  adjustmentType: "Bonus" | "Allowance" | "Addition" | "Deduction";
  name: string; amount: number; note: string | null; createDate: string;
}
interface PayrollEmployee {
  staffId: number; staffName: string; jobTitle: string | null; salaryType: "Monthly" | "Hourly"; salaryAmount: number;
  regularWorkMinutes: number; basePay: number; approvedOvertimeCount: number; approvedOvertimeMinutes: number;
  approvedOvertimePay: number; personalLeaveMinutes: number; personalLeaveDeduction: number; sickLeaveMinutes: number;
  sickLeavePayAdjustment: number; confirmedAbsenceMinutes: number; confirmedAbsenceDeduction: number;
  bonusAmount: number; allowanceAmount: number; otherAdditionAmount: number; otherDeductionAmount: number;
  adjustments: PayrollAdjustment[]; grossPay: number; laborInsuranceSalary: number; healthInsuranceSalary: number;
  pensionContributionSalary: number; employeeLaborInsurance: number; employeeEmploymentInsurance: number;
  employeeHealthInsurance: number; employeeVoluntaryPension: number; employeeDeductions: number; netPay: number;
  employerLaborInsurance: number; employerEmploymentInsurance: number; employerHealthInsurance: number;
  employerPension6Percent: number; employerCost: number; nhiDependentCount: number; warnings: string[];
}
interface MonthlyPayroll {
  brandId: number; month: string; ruleYear: number; employees: PayrollEmployee[];
  totalGrossPay: number; totalBonusAndAllowance: number; totalAttendanceDeductions: number; totalOtherDeductions: number;
  totalNetPay: number; totalEmployerPension: number; totalEmployerCost: number;
}

const permissionStore = usePermissionStore();
await permissionStore.load();
const activeBrandId = computed(() => permissionStore.brandId ?? 0);

const activeTab = ref<"overview" | "leaves" | "overtime" | "policy">("overview");
const stores = ref<StoreOption[]>([]);
const staffs = ref<StaffOption[]>([]);
const records = ref<AttendanceRecord[]>([]);
const leaveTypes = ref<LeaveType[]>([]);
const loading = ref(false);
const savingPolicy = ref(false);
const savingAdjustment = ref(false);
const savingLeave = ref(false);
const detailRecord = ref<AttendanceRecord | null>(null);
const adjustmentTarget = ref<AttendanceSegment | null>(null);
const leaveTargets = ref<AttendanceSegment[]>([]);

const filters = reactive({ month: toMonthInput(new Date()), storeId: 0, staffId: 0, status: "All" });
const summary = reactive<AttendanceSummary>({ scheduledCount: 0, normalCount: 0, lateCount: 0, earlyLeaveCount: 0, lateAndEarlyLeaveCount: 0, missingPunchCount: 0, absentCount: 0, leaveCount: 0 });
const policyForm = reactive({
  lateGraceMinutes: 0,
  earlyLeaveGraceMinutes: 0,
  ignoreLateWhenWorkMinutesMet: false,
  punchMatchBeforeMinutes: 240,
  punchMatchAfterMinutes: 360,
});
const adjustmentForm = reactive({ clockIn: "", clockOut: "", overrideStatus: "", note: "" });
const leaveForm = reactive({ leaveTypeCode: "", reason: "", proofNote: "" });
const overtimeApplications = ref<OvertimeApplication[]>([]);
const payroll = ref<MonthlyPayroll | null>(null);
const payrollLoading = ref(false);
const overtimeStatus = ref("All");
const reviewingOvertimeId = ref<number | null>(null);
const savingPayrollAdjustment = ref(false);
const payrollAdjustmentForm = reactive({
  staffId: 0,
  adjustmentType: "Bonus" as PayrollAdjustment["adjustmentType"],
  name: "",
  amount: 0,
  note: "",
});

const availableStaffs = computed(() => filters.storeId
  ? staffs.value.filter(staff => staff.storeIds.includes(filters.storeId))
  : staffs.value);
const formattedMonth = computed(() => {
  const [year, month] = filters.month.split("-").map(Number);
  return year && month ? `${year} 年 ${month} 月` : filters.month;
});

const pendingOvertimeCount = computed(() => overtimeApplications.value.filter(item => item.status === "Pending").length);
const allPayrollAdjustments = computed(() =>
  (payroll.value?.employees ?? [])
    .flatMap(employee => employee.adjustments)
    .sort((a, b) => a.staffName.localeCompare(b.staffName, "zh-TW") || a.id - b.id),
);

const scheduleRestTypes = computed(() => leaveTypes.value.filter(type => type.categoryCode === "ScheduleRest"));
const assignableLeaveTypes = computed(() => leaveTypes.value.filter(type => type.isRequestable));
const requestableLeaveTypes = computed(() => assignableLeaveTypes.value.filter(type => type.categoryCode !== "ScheduleRest"));
const longTermLeaveTypes = computed(() => leaveTypes.value.filter(type => type.categoryCode === "LongTerm"));
const selectedLeaveType = computed(() => leaveTypes.value.find(type => type.code === leaveForm.leaveTypeCode) ?? null);
const leaveSelectGroups = computed<LeaveSelectGroup[]>(() => {
  const definitions = [
    { code: "ScheduleRest", label: "排班休息（管理端指定）" },
    { code: "Accrued", label: "補休與特別休假" },
    { code: "General", label: "一般請假" },
    { code: "Family", label: "家庭與個人假別" },
    { code: "Maternity", label: "懷孕、生育與陪產" },
    { code: "Public", label: "公假與職業災害" },
  ];
  return definitions
    .map(group => ({
      ...group,
      items: assignableLeaveTypes.value.filter(type => type.categoryCode === group.code),
    }))
    .filter(group => group.items.length > 0);
});

watch(() => filters.storeId, () => {
  if (filters.staffId && !availableStaffs.value.some(staff => staff.staffId === filters.staffId)) filters.staffId = 0;
});
watch(activeBrandId, initialize);
onMounted(initialize);

async function initialize() {
  if (!activeBrandId.value) return;
  await Promise.all([loadStores(), loadStaffs(), loadLeaveTypes(), loadPolicy()]);
  await loadOverview();
}

async function loadStores() {
  const response = await api.get(`/stores/my/brand/${activeBrandId.value}`);
  stores.value = (response.data?.stores ?? []).map((item: any) => ({ id: Number(item.Id ?? item.id), name: String(item.Name ?? item.name) }));
}

async function loadStaffs() {
  const response = await api.get(`/staff/brand/${activeBrandId.value}`);
  staffs.value = (response.data?.data ?? []).map((item: any) => ({
    staffId: Number(item.StaffId ?? item.staffId),
    fullName: String(item.FullName ?? item.fullName),
    jobTitle: item.JobTitle ?? item.jobTitle ?? null,
    storeIds: (item.StoreAssignments ?? item.storeAssignments ?? []).filter((store: any) => Boolean(store.IsActive ?? store.isActive)).map((store: any) => Number(store.StoreId ?? store.storeId)),
  })).sort((a: StaffOption, b: StaffOption) => a.fullName.localeCompare(b.fullName, "zh-TW"));
}

async function loadLeaveTypes() {
  const response = await api.get("/attendance/leave-types");
  leaveTypes.value = (response.data?.data ?? []).map((item: any) => ({
    code: String(item.Code ?? item.code),
    name: String(item.Name ?? item.name),
    categoryCode: String(item.CategoryCode ?? item.categoryCode ?? "General"),
    isRequestable: Boolean(item.IsRequestable ?? item.isRequestable ?? true),
    sortOrder: Number(item.SortOrder ?? item.sortOrder ?? 999),
    legalSummary: String(item.LegalSummary ?? item.legalSummary),
    paySummary: String(item.PaySummary ?? item.paySummary),
    quotaSummary: String(item.QuotaSummary ?? item.quotaSummary),
  })).sort((a: LeaveType, b: LeaveType) => a.sortOrder - b.sortOrder);
}

async function loadPolicy() {
  const response = await api.get(`/attendance/policy/${activeBrandId.value}`);
  const data = response.data?.data ?? {};
  Object.assign(policyForm, {
    lateGraceMinutes: Number(data.LateGraceMinutes ?? data.lateGraceMinutes ?? 0),
    earlyLeaveGraceMinutes: Number(data.EarlyLeaveGraceMinutes ?? data.earlyLeaveGraceMinutes ?? 0),
    ignoreLateWhenWorkMinutesMet: Boolean(data.IgnoreLateWhenWorkMinutesMet ?? data.ignoreLateWhenWorkMinutesMet ?? false),
    punchMatchBeforeMinutes: Number(data.PunchMatchBeforeMinutes ?? data.punchMatchBeforeMinutes ?? 240),
    punchMatchAfterMinutes: Number(data.PunchMatchAfterMinutes ?? data.punchMatchAfterMinutes ?? 360),
  });
}

async function loadOverview() {
  if (!activeBrandId.value || !filters.month) return;
  loading.value = true;
  try {
    const { from, to } = monthRange(filters.month);
    const query = new URLSearchParams({ from, to, status: filters.status });
    if (filters.storeId) query.set("storeId", String(filters.storeId));
    if (filters.staffId) query.set("staffId", String(filters.staffId));
    const response = await api.get(`/attendance/overview/${activeBrandId.value}?${query}`);
    const data = response.data?.data ?? {};
    records.value = (data.Records ?? data.records ?? []).map(normalizeRecord);
    const source = data.Summary ?? data.summary ?? {};
    Object.assign(summary, {
      scheduledCount: Number(source.ScheduledCount ?? source.scheduledCount ?? 0),
      normalCount: Number(source.NormalCount ?? source.normalCount ?? 0),
      lateCount: Number(source.LateCount ?? source.lateCount ?? 0),
      earlyLeaveCount: Number(source.EarlyLeaveCount ?? source.earlyLeaveCount ?? 0),
      lateAndEarlyLeaveCount: Number(source.LateAndEarlyLeaveCount ?? source.lateAndEarlyLeaveCount ?? 0),
      missingPunchCount: Number(source.MissingPunchCount ?? source.missingPunchCount ?? 0),
      absentCount: Number(source.AbsentCount ?? source.absentCount ?? 0),
      leaveCount: Number(source.LeaveCount ?? source.leaveCount ?? 0),
    });
  } catch (error) {
    records.value = [];
    await showCustom("載入失敗", getErrorMessage(error, "無法取得出勤資料。"), "error");
  } finally {
    loading.value = false;
  }
}

async function savePolicy() {
  savingPolicy.value = true;
  try {
    await api.put(`/attendance/policy/${activeBrandId.value}`, { ...policyForm });
    await showCustom("儲存成功", "出勤判定規則已更新。", "success");
    await loadOverview();
  } catch (error) {
    await showCustom("儲存失敗", getErrorMessage(error, "無法儲存出勤規則。"), "error");
  } finally {
    savingPolicy.value = false;
  }
}

async function openPayrollTab() {
  activeTab.value = "overtime";
  await loadPayrollWorkspace();
}

async function loadPayrollWorkspace() {
  if (!activeBrandId.value || !filters.month) return;
  payrollLoading.value = true;
  try {
    const { from, to } = monthRange(filters.month);
    const applicationQuery = new URLSearchParams({ from, to, status: overtimeStatus.value });
    const payrollQuery = new URLSearchParams({ month: filters.month });
    if (filters.storeId) {
      applicationQuery.set("storeId", String(filters.storeId));
      payrollQuery.set("storeId", String(filters.storeId));
    }
    if (filters.staffId) {
      applicationQuery.set("staffId", String(filters.staffId));
      payrollQuery.set("staffId", String(filters.staffId));
    }

    const [applicationResponse, payrollResponse] = await Promise.all([
      api.get(`/attendance/overtime/applications/${activeBrandId.value}?${applicationQuery}`),
      api.get(`/attendance/payroll/${activeBrandId.value}?${payrollQuery}`),
    ]);
    overtimeApplications.value = (applicationResponse.data?.data ?? []).map(normalizeOvertimeApplication);
    payroll.value = normalizePayroll(payrollResponse.data?.data ?? {});
    if (!payroll.value.employees.some(employee => employee.staffId === payrollAdjustmentForm.staffId)) {
      payrollAdjustmentForm.staffId = payroll.value.employees[0]?.staffId ?? 0;
    }
  } catch (error) {
    overtimeApplications.value = [];
    payroll.value = null;
    await showCustom("月薪試算載入失敗", getErrorMessage(error, "無法取得加班審核或月薪資料。"), "error");
  } finally {
    payrollLoading.value = false;
  }
}

async function reviewOvertime(item: OvertimeApplication, status: "Approved" | "Rejected") {
  const { default: Swal } = await import("sweetalert2");
  const isApproved = status === "Approved";
  const result = isApproved
    ? await Swal.fire({
        title: `核准 ${item.staffName} 的加班？`,
        html: `<label class="swal-payroll-field">核准分鐘<input id="swal-approved-minutes" class="swal2-input" type="number" min="1" max="${item.requestedMinutes}" value="${item.requestedMinutes}"></label><label class="swal-payroll-field">審核備註<textarea id="swal-review-note" class="swal2-textarea" maxlength="500" placeholder="可選填"></textarea></label>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "確認核准",
        cancelButtonText: "取消",
        confirmButtonColor: "#17334a",
        preConfirm: () => {
          const minutesElement = document.getElementById("swal-approved-minutes") as HTMLInputElement | null;
          const noteElement = document.getElementById("swal-review-note") as HTMLTextAreaElement | null;
          const approvedMinutes = Number(minutesElement?.value ?? 0);
          if (!Number.isInteger(approvedMinutes) || approvedMinutes <= 0 || approvedMinutes > item.requestedMinutes) {
            Swal.showValidationMessage(`核准分鐘必須介於 1 到 ${item.requestedMinutes} 分鐘。`);
            return false;
          }
          return { approvedMinutes, reviewNote: noteElement?.value.trim() || null };
        },
      })
    : await Swal.fire({
        title: `拒絕 ${item.staffName} 的加班申請？`,
        input: "textarea",
        inputLabel: "拒絕原因／審核備註",
        inputPlaceholder: "請填寫拒絕原因",
        inputAttributes: { maxlength: "500" },
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "確認拒絕",
        cancelButtonText: "取消",
        confirmButtonColor: "#b43a31",
        inputValidator: value => value.trim() ? undefined : "請填寫拒絕原因。",
      });

  if (!result.isConfirmed) return;
  const value = result.value as { approvedMinutes?: number; reviewNote?: string | null } | string;
  const payload = isApproved
    ? { status, approvedMinutes: typeof value === "object" ? value.approvedMinutes : item.requestedMinutes, reviewNote: typeof value === "object" ? value.reviewNote : null }
    : { status, approvedMinutes: 0, reviewNote: String(value ?? "").trim() };

  reviewingOvertimeId.value = item.id;
  try {
    await api.put(`/attendance/overtime/applications/${activeBrandId.value}/${item.id}/review`, payload);
    await showCustom(isApproved ? "核准成功" : "已拒絕", isApproved ? "核准加班會立即重新計入本月薪資試算。" : "此筆加班不會自動帶入月薪試算。", "success");
    await loadPayrollWorkspace();
  } catch (error) {
    await showCustom("審核失敗", getErrorMessage(error, "無法更新加班申請。"), "error");
  } finally {
    reviewingOvertimeId.value = null;
  }
}

async function createPayrollAdjustment() {
  if (!activeBrandId.value || !filters.month) return;
  if (!payrollAdjustmentForm.staffId || !payrollAdjustmentForm.name || payrollAdjustmentForm.amount <= 0) {
    await showCustom("資料不完整", "請選擇員工並填寫名稱與正確金額。", "warning");
    return;
  }

  savingPayrollAdjustment.value = true;
  try {
    await api.post(`/attendance/payroll/adjustments/${activeBrandId.value}`, {
      staffId: payrollAdjustmentForm.staffId,
      payrollMonth: `${filters.month}-01`,
      adjustmentType: payrollAdjustmentForm.adjustmentType,
      name: payrollAdjustmentForm.name,
      amount: payrollAdjustmentForm.amount,
      note: payrollAdjustmentForm.note || null,
    });
    Object.assign(payrollAdjustmentForm, {
      adjustmentType: "Bonus",
      name: "",
      amount: 0,
      note: "",
    });
    await loadPayrollWorkspace();
    await showCustom("新增成功", "薪資加減項已加入本月試算。", "success");
  } catch (error) {
    await showCustom("新增失敗", getErrorMessage(error, "無法新增薪資加減項。"), "error");
  } finally {
    savingPayrollAdjustment.value = false;
  }
}

async function deletePayrollAdjustment(item: PayrollAdjustment) {
  const { default: Swal } = await import("sweetalert2");
  const result = await Swal.fire({
    title: `刪除「${item.name}」？`,
    text: `${item.staffName}・${formatCurrency(item.amount)}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確認刪除",
    cancelButtonText: "取消",
    confirmButtonColor: "#b43a31",
  });
  if (!result.isConfirmed) return;

  try {
    await api.delete(`/attendance/payroll/adjustments/${activeBrandId.value}/${item.id}`);
    await loadPayrollWorkspace();
    await showCustom("已刪除", "本月薪資已重新試算。", "success");
  } catch (error) {
    await showCustom("刪除失敗", getErrorMessage(error, "無法刪除薪資加減項。"), "error");
  }
}

function openDetail(record: AttendanceRecord) { detailRecord.value = record; }
function openAdjustment(segment: AttendanceSegment) {
  adjustmentTarget.value = segment;
  Object.assign(adjustmentForm, {
    clockIn: toDateTimeLocal(segment.clockIn),
    clockOut: toDateTimeLocal(segment.clockOut),
    overrideStatus: segment.adjustmentId ? segment.status : "",
    note: segment.adjustmentNote || "",
  });
}
function openLeave(segments: AttendanceSegment[]) {
  leaveTargets.value = segments.filter(segment => !segment.leaveId);
  if (!leaveTargets.value.length) return;
  Object.assign(leaveForm, { leaveTypeCode: "", reason: "", proofNote: "" });
}

async function saveAdjustment() {
  if (!adjustmentTarget.value) return;
  savingAdjustment.value = true;
  try {
    await api.put(`/attendance/segments/${adjustmentTarget.value.staffShiftSegmentId}/adjustment`, {
      brandId: activeBrandId.value,
      adjustedClockIn: fromDateTimeLocal(adjustmentForm.clockIn),
      adjustedClockOut: fromDateTimeLocal(adjustmentForm.clockOut),
      overrideStatus: adjustmentForm.overrideStatus || null,
      note: adjustmentForm.note,
    });
    adjustmentTarget.value = null;
    detailRecord.value = null;
    await loadOverview();
    await showCustom("修正成功", "出勤資料已重新計算。", "success");
  } catch (error) {
    await showCustom("修正失敗", getErrorMessage(error, "無法儲存出勤修正。"), "error");
  } finally {
    savingAdjustment.value = false;
  }
}

async function saveLeave() {
  if (!leaveTargets.value.length) return;
  savingLeave.value = true;
  try {
    await api.post("/attendance/leaves", {
      brandId: activeBrandId.value,
      leaveTypeCode: leaveForm.leaveTypeCode,
      staffShiftSegmentIds: leaveTargets.value.map(item => item.staffShiftSegmentId),
      reason: leaveForm.reason || null,
      proofNote: leaveForm.proofNote || null,
    });
    leaveTargets.value = [];
    detailRecord.value = null;
    await loadOverview();
    const savedTypeName = selectedLeaveType.value?.name ?? "休假／請假";
    await showCustom("設定已儲存", `所選排班時段已標記為「${savedTypeName}」。`, "success");
  } catch (error) {
    await showCustom("儲存失敗", getErrorMessage(error, "無法建立休假／請假紀錄。"), "error");
  } finally {
    savingLeave.value = false;
  }
}

async function cancelLeave(segment: AttendanceSegment) {
  if (!segment.leaveId) return;
  const { default: Swal } = await import("sweetalert2");
  const result = await Swal.fire({
    title: `取消「${segment.leaveTypeName}」？`,
    text: "取消後會重新依打卡時間判定出勤。",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確認取消",
    cancelButtonText: "保留紀錄",
    confirmButtonColor: "#c0392b",
  });
  if (!result.isConfirmed) return;
  try {
    await api.delete(`/attendance/leaves/${segment.leaveId}?brandId=${activeBrandId.value}`);
    detailRecord.value = null;
    await loadOverview();
    await showCustom("已取消", "休假／請假紀錄已取消。", "success");
  } catch (error) {
    await showCustom("取消失敗", getErrorMessage(error, "無法取消休假／請假紀錄。"), "error");
  }
}

function normalizeOvertimeApplication(item: any): OvertimeApplication {
  return {
    id: Number(item.Id ?? item.id), brandId: Number(item.BrandId ?? item.brandId), storeId: Number(item.StoreId ?? item.storeId),
    storeName: String(item.StoreName ?? item.storeName ?? ""), staffId: Number(item.StaffId ?? item.staffId),
    staffName: String(item.StaffName ?? item.staffName ?? ""), staffShiftId: item.StaffShiftId ?? item.staffShiftId ?? null,
    overtimeDate: String(item.OvertimeDate ?? item.overtimeDate), dayType: String(item.DayType ?? item.dayType),
    startDateTime: String(item.StartDateTime ?? item.startDateTime), endDateTime: String(item.EndDateTime ?? item.endDateTime),
    requestedMinutes: Number(item.RequestedMinutes ?? item.requestedMinutes ?? 0), approvedMinutes: Number(item.ApprovedMinutes ?? item.approvedMinutes ?? 0),
    reason: String(item.Reason ?? item.reason ?? ""), status: String(item.Status ?? item.status ?? "Pending") as OvertimeApplication["status"],
    reviewNote: item.ReviewNote ?? item.reviewNote ?? null, reviewDate: item.ReviewDate ?? item.reviewDate ?? null,
  };
}
function normalizePayrollAdjustment(item: any): PayrollAdjustment {
  return {
    id: Number(item.Id ?? item.id),
    brandId: Number(item.BrandId ?? item.brandId),
    staffId: Number(item.StaffId ?? item.staffId),
    staffName: String(item.StaffName ?? item.staffName ?? ""),
    payrollMonth: String(item.PayrollMonth ?? item.payrollMonth ?? ""),
    adjustmentType: String(item.AdjustmentType ?? item.adjustmentType ?? "Addition") as PayrollAdjustment["adjustmentType"],
    name: String(item.Name ?? item.name ?? ""),
    amount: Number(item.Amount ?? item.amount ?? 0),
    note: item.Note ?? item.note ?? null,
    createDate: String(item.CreateDate ?? item.createDate ?? ""),
  };
}
function normalizePayrollEmployee(item: any): PayrollEmployee {
  const numberValue = (pascal: string, camel: string) => Number(item[pascal] ?? item[camel] ?? 0);
  return {
    staffId: numberValue("StaffId", "staffId"), staffName: String(item.StaffName ?? item.staffName ?? ""), jobTitle: item.JobTitle ?? item.jobTitle ?? null,
    salaryType: String(item.SalaryType ?? item.salaryType ?? "Monthly") as PayrollEmployee["salaryType"], salaryAmount: numberValue("SalaryAmount", "salaryAmount"),
    regularWorkMinutes: numberValue("RegularWorkMinutes", "regularWorkMinutes"), basePay: numberValue("BasePay", "basePay"),
    approvedOvertimeCount: numberValue("ApprovedOvertimeCount", "approvedOvertimeCount"), approvedOvertimeMinutes: numberValue("ApprovedOvertimeMinutes", "approvedOvertimeMinutes"),
    approvedOvertimePay: numberValue("ApprovedOvertimePay", "approvedOvertimePay"),
    personalLeaveMinutes: numberValue("PersonalLeaveMinutes", "personalLeaveMinutes"),
    personalLeaveDeduction: numberValue("PersonalLeaveDeduction", "personalLeaveDeduction"),
    sickLeaveMinutes: numberValue("SickLeaveMinutes", "sickLeaveMinutes"),
    sickLeavePayAdjustment: numberValue("SickLeavePayAdjustment", "sickLeavePayAdjustment"),
    confirmedAbsenceMinutes: numberValue("ConfirmedAbsenceMinutes", "confirmedAbsenceMinutes"),
    confirmedAbsenceDeduction: numberValue("ConfirmedAbsenceDeduction", "confirmedAbsenceDeduction"),
    bonusAmount: numberValue("BonusAmount", "bonusAmount"), allowanceAmount: numberValue("AllowanceAmount", "allowanceAmount"),
    otherAdditionAmount: numberValue("OtherAdditionAmount", "otherAdditionAmount"), otherDeductionAmount: numberValue("OtherDeductionAmount", "otherDeductionAmount"),
    adjustments: (item.Adjustments ?? item.adjustments ?? []).map(normalizePayrollAdjustment),
    grossPay: numberValue("GrossPay", "grossPay"),
    laborInsuranceSalary: numberValue("LaborInsuranceSalary", "laborInsuranceSalary"), healthInsuranceSalary: numberValue("HealthInsuranceSalary", "healthInsuranceSalary"),
    pensionContributionSalary: numberValue("PensionContributionSalary", "pensionContributionSalary"), employeeLaborInsurance: numberValue("EmployeeLaborInsurance", "employeeLaborInsurance"),
    employeeEmploymentInsurance: numberValue("EmployeeEmploymentInsurance", "employeeEmploymentInsurance"), employeeHealthInsurance: numberValue("EmployeeHealthInsurance", "employeeHealthInsurance"),
    employeeVoluntaryPension: numberValue("EmployeeVoluntaryPension", "employeeVoluntaryPension"), employeeDeductions: numberValue("EmployeeDeductions", "employeeDeductions"),
    netPay: numberValue("NetPay", "netPay"), employerLaborInsurance: numberValue("EmployerLaborInsurance", "employerLaborInsurance"),
    employerEmploymentInsurance: numberValue("EmployerEmploymentInsurance", "employerEmploymentInsurance"), employerHealthInsurance: numberValue("EmployerHealthInsurance", "employerHealthInsurance"),
    employerPension6Percent: numberValue("EmployerPension6Percent", "employerPension6Percent"), employerCost: numberValue("EmployerCost", "employerCost"),
    nhiDependentCount: numberValue("NhiDependentCount", "nhiDependentCount"), warnings: (item.Warnings ?? item.warnings ?? []).map(String),
  };
}
function normalizePayroll(item: any): MonthlyPayroll {
  return {
    brandId: Number(item.BrandId ?? item.brandId ?? activeBrandId.value), month: String(item.Month ?? item.month ?? filters.month),
    ruleYear: Number(item.RuleYear ?? item.ruleYear ?? 2026), employees: (item.Employees ?? item.employees ?? []).map(normalizePayrollEmployee),
    totalGrossPay: Number(item.TotalGrossPay ?? item.totalGrossPay ?? 0),
    totalBonusAndAllowance: Number(item.TotalBonusAndAllowance ?? item.totalBonusAndAllowance ?? 0),
    totalAttendanceDeductions: Number(item.TotalAttendanceDeductions ?? item.totalAttendanceDeductions ?? 0),
    totalOtherDeductions: Number(item.TotalOtherDeductions ?? item.totalOtherDeductions ?? 0),
    totalNetPay: Number(item.TotalNetPay ?? item.totalNetPay ?? 0),
    totalEmployerPension: Number(item.TotalEmployerPension ?? item.totalEmployerPension ?? 0), totalEmployerCost: Number(item.TotalEmployerCost ?? item.totalEmployerCost ?? 0),
  };
}
function overtimeStatusLabel(status: string) { return ({ Pending: "待審核", Approved: "已核准", Rejected: "已拒絕", Cancelled: "已取消" } as Record<string, string>)[status] ?? status; }
function overtimeDayLabel(dayType: string) { return ({ Weekday: "平日延長工時", RestDay: "休息日出勤", NationalHoliday: "國定假日出勤", WeeklyHolidayEmergency: "例假緊急出勤" } as Record<string, string>)[dayType] ?? dayType; }
function payrollAdjustmentTypeLabel(type: string) { return ({ Bonus: "獎金", Allowance: "津貼", Addition: "其他加項", Deduction: "其他扣項" } as Record<string, string>)[type] ?? type; }

function normalizeRecord(item: any): AttendanceRecord {
  return {
    staffShiftId: Number(item.StaffShiftId ?? item.staffShiftId),
    brandId: Number(item.BrandId ?? item.brandId),
    storeId: Number(item.StoreId ?? item.storeId),
    storeName: String(item.StoreName ?? item.storeName),
    staffId: Number(item.StaffId ?? item.staffId),
    staffName: String(item.StaffName ?? item.staffName),
    jobTitle: item.JobTitle ?? item.jobTitle ?? null,
    shiftDate: String(item.ShiftDate ?? item.shiftDate).slice(0, 10),
    shiftName: String(item.ShiftName ?? item.shiftName),
    status: String(item.Status ?? item.status),
    lateMinutes: Number(item.LateMinutes ?? item.lateMinutes ?? 0),
    earlyLeaveMinutes: Number(item.EarlyLeaveMinutes ?? item.earlyLeaveMinutes ?? 0),
    scheduledWorkMinutes: Number(item.ScheduledWorkMinutes ?? item.scheduledWorkMinutes ?? 0),
    actualWorkMinutes: Number(item.ActualWorkMinutes ?? item.actualWorkMinutes ?? 0),
    lateWaivedByWorkMinutes: Boolean(item.LateWaivedByWorkMinutes ?? item.lateWaivedByWorkMinutes ?? false),
    segments: (item.Segments ?? item.segments ?? []).map((segment: any) => ({
      staffShiftSegmentId: Number(segment.StaffShiftSegmentId ?? segment.staffShiftSegmentId),
      sequenceNo: Number(segment.SequenceNo ?? segment.sequenceNo),
      scheduledStart: String(segment.ScheduledStart ?? segment.scheduledStart),
      scheduledEnd: String(segment.ScheduledEnd ?? segment.scheduledEnd),
      clockIn: segment.ClockIn ?? segment.clockIn ?? null,
      clockOut: segment.ClockOut ?? segment.clockOut ?? null,
      clockSource: String(segment.ClockSource ?? segment.clockSource ?? ""),
      status: String(segment.Status ?? segment.status),
      lateMinutes: Number(segment.LateMinutes ?? segment.lateMinutes ?? 0),
      earlyLeaveMinutes: Number(segment.EarlyLeaveMinutes ?? segment.earlyLeaveMinutes ?? 0),
      lateWaivedByWorkMinutes: Boolean(segment.LateWaivedByWorkMinutes ?? segment.lateWaivedByWorkMinutes ?? false),
      isStatusOverridden: Boolean(segment.IsStatusOverridden ?? segment.isStatusOverridden ?? false),
      leaveId: segment.LeaveId ?? segment.leaveId ?? null,
      leaveTypeCode: segment.LeaveTypeCode ?? segment.leaveTypeCode ?? null,
      leaveTypeName: segment.LeaveTypeName ?? segment.leaveTypeName ?? null,
      leaveReason: segment.LeaveReason ?? segment.leaveReason ?? null,
      adjustmentId: segment.AdjustmentId ?? segment.adjustmentId ?? null,
      adjustmentNote: segment.AdjustmentNote ?? segment.adjustmentNote ?? null,
    })),
  };
}

function statusLabel(status: string) {
  return ({
    Scheduled: "尚未出勤",
    Normal: "正常",
    Late: "遲到",
    EarlyLeave: "早退",
    LateAndEarlyLeave: "遲到早退",
    MissingPunch: "缺卡",
    MissingIn: "缺上班卡",
    MissingOut: "缺下班卡",
    Absent: "未出勤",
    Leave: "休假／請假",
  } as Record<string, string>)[status] ?? status;
}
function segmentStatusLabel(segment: AttendanceSegment) {
  if (segment.status === "Leave") return segment.leaveTypeName || "休假／請假";
  if (segment.status === "Absent" && segment.isStatusOverridden) return "曠職";
  return statusLabel(segment.status);
}
function statusClass(status: string) { return `status-${status.toLowerCase()}`; }
function leaveTypeIcon(code: string) {
  return ({
    WeeklyHoliday: "fa6-solid:calendar-day",
    RestDay: "fa6-solid:mug-hot",
    NationalHoliday: "fa6-solid:flag",
    Compensatory: "fa6-solid:clock-rotate-left",
    Annual: "fa6-solid:umbrella-beach",
    Sick: "fa6-solid:house-medical",
    OccupationalInjury: "fa6-solid:helmet-safety",
    Personal: "fa6-solid:user-clock",
    FamilyCare: "fa6-solid:people-roof",
    Menstrual: "fa6-solid:venus",
    Marriage: "fa6-solid:heart",
    Bereavement: "fa6-solid:ribbon",
    Official: "fa6-solid:building-columns",
    Maternity: "fa6-solid:baby-carriage",
    PregnancyBedRest: "fa6-solid:bed",
    PrenatalCheck: "fa6-solid:stethoscope",
    Paternity: "fa6-solid:person-pregnant",
    ParentalLeave: "fa6-solid:person-breastfeeding",
  } as Record<string, string>)[code] || "fa6-solid:calendar-minus";
}
function formatDate(value: string) { return new Intl.DateTimeFormat("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(`${value}T00:00:00`)); }
function weekdayLabel(value: string) { return new Intl.DateTimeFormat("zh-TW", { weekday: "short" }).format(new Date(`${value}T00:00:00`)); }
function formatDateTime(value: string) { return new Intl.DateTimeFormat("zh-TW", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value)); }
function formatClock(value: string | null) { return value ? new Intl.DateTimeFormat("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value)) : "—"; }
function formatTimeRange(start: string, end: string) { return `${formatClock(start)}～${formatClock(end)}${new Date(end).toDateString() !== new Date(start).toDateString() ? "翌日" : ""}`; }
function formatScheduledSegment(segment: AttendanceSegment) { return formatTimeRange(segment.scheduledStart, segment.scheduledEnd); }
function summarizeActualPunches(record: AttendanceRecord) { return record.segments.map(segment => segment.status === "Leave" ? segment.leaveTypeName || "休假／請假" : `${formatClock(segment.clockIn)}～${formatClock(segment.clockOut)}`).join("、"); }
function formatCurrency(value: number) {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Number(value) || 0));
}
function formatSignedCurrency(value: number) {
  const amount = Number(value) || 0;
  if (amount === 0) return formatCurrency(0);
  return `${amount > 0 ? "+" : "−"}${formatCurrency(Math.abs(amount))}`;
}
function formatWorkMinutes(minutes: number) {
  const safeMinutes = Math.max(0, Number(minutes) || 0);
  const hours = Math.floor(safeMinutes / 60);
  const remainder = safeMinutes % 60;
  if (!hours) return `${remainder} 分鐘`;
  return remainder ? `${hours} 小時 ${remainder} 分鐘` : `${hours} 小時`;
}
function toDateTimeLocal(value: string | null) { if (!value) return ""; const date = new Date(value); const offset = date.getTimezoneOffset() * 60000; return new Date(date.getTime() - offset).toISOString().slice(0, 16); }
function fromDateTimeLocal(value: string) { return value ? `${value}:00` : null; }
function toMonthInput(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function monthRange(value: string) { const [year, month] = value.split("-").map(Number); const last = new Date(year!, month!, 0).getDate(); return { from: `${year}-${String(month).padStart(2, "0")}-01`, to: `${year}-${String(month).padStart(2, "0")}-${String(last).padStart(2, "0")}` }; }
function getErrorMessage(error: any, fallback: string) { return error?.response?.data?.message ?? error?.response?.data?.Message ?? error?.message ?? fallback; }
</script>

<style scoped>
.attendance-page { display: grid; gap: 1rem; }
.attendance-header { align-items: flex-end; }
.page-desc { margin-top: .35rem; color: #6b7882; font-size: .88rem; }
.header-actions, .modal-actions, .detail-summary { display: flex; align-items: center; gap: .65rem; }
.tab-bar { display: flex; gap: .35rem; padding: .35rem; border: 1px solid #dfe7ec; border-radius: 10px; background: #fff; width: fit-content; }
.tab-bar button { border: 0; border-radius: 7px; padding: .6rem 1rem; background: transparent; color: #657681; font: inherit; font-size: .84rem; font-weight: 900; cursor: pointer; }
.tab-bar button.active { background: #17334a; color: #fff; }
.panel-stack { display: grid; gap: 1rem; }
.filter-panel { display: grid; grid-template-columns: 1fr 1.2fr 1.4fr 1.2fr auto; gap: .75rem; align-items: end; padding: 1rem; border: 1px solid #dfe7ec; border-radius: 10px; background: #fff; }
.field { display: grid; gap: .38rem; color: #20384a; font-size: .82rem; font-weight: 900; }
.field span em { color: #b43a31; font-style: normal; }
.field input, .field select, .field textarea { width: 100%; box-sizing: border-box; border: 1px solid #d4dee5; border-radius: 7px; padding: .68rem .75rem; background: #fff; color: #20303c; font: inherit; font-size: .88rem; }
.field small { color: #7b8992; font-size: .72rem; font-weight: 600; line-height: 1.5; }
.filter-button { height: 42px; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; border: 1px solid transparent; border-radius: 7px; padding: .62rem .85rem; font: inherit; font-size: .82rem; font-weight: 900; cursor: pointer; text-decoration: none; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn.primary { background: #17334a; color: #fff; }
.btn.ghost { background: #fff; color: #17334a; border-color: #cad8e1; }
.btn.danger { background: #fff0ee; color: #a5362f; border-color: #efc4bf; }
.btn.leave-btn, .leave-btn { background: #f4efff; color: #6746a4; border-color: #d9caef; }
.btn.small { padding: .42rem .65rem; font-size: .75rem; }
.summary-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: .7rem; }
.summary-card { min-height: 82px; padding: .85rem; border: 1px solid #e0e7eb; border-radius: 9px; background: #fff; display: grid; align-content: space-between; }
.summary-card span { color: #6d7b84; font-size: .74rem; font-weight: 900; }
.summary-card strong { color: #17334a; font-size: 1.55rem; }
.summary-card.success { background: #eff9f1; border-color: #cfe8d3; }
.summary-card.warning { background: #fff8e7; border-color: #ebd9aa; }
.summary-card.danger { background: #fff1ef; border-color: #edc8c3; }
.summary-card.leave { background: #f5f0ff; border-color: #ddd0f2; }
.summary-card.neutral { background: #f5f7f8; }
.data-panel, .leave-panel, .overtime-panel, .policy-panel { border: 1px solid #dfe7ec; border-radius: 10px; background: #fff; overflow: hidden; }
.panel-heading, .section-intro { display: flex; justify-content: space-between; gap: 1rem; padding: 1rem 1.1rem; border-bottom: 1px solid #e4eaee; }
.panel-heading h2, .section-intro h2 { color: #17334a; font-size: 1rem; }
/* 控制出勤紀錄月份標題：使用後台既有字型，避免數字與中文被全站標題字型拆成不同字形。 */
.attendance-record-title {
  font-family: inherit;
  font-weight: 900;
  font-style: normal;
  letter-spacing: 0;
  font-variant-numeric: tabular-nums;
  line-height: 1.35;
}
.panel-heading p, .section-intro p { margin-top: .25rem; color: #72808a; font-size: .8rem; }
.count-pill { align-self: center; border-radius: 999px; padding: .3rem .65rem; background: #edf4f8; color: #17334a; font-size: .76rem; font-weight: 900; }
.table-wrap { overflow-x: auto; }
.attendance-table { width: 100%; border-collapse: collapse; min-width: 1120px; }
.attendance-table th { padding: .72rem; background: #f5f8fa; color: #657681; text-align: left; font-size: .73rem; }
.attendance-table td { padding: .78rem .72rem; border-top: 1px solid #edf1f3; color: #283b49; font-size: .8rem; vertical-align: middle; }
.attendance-table td strong, .attendance-table td small, .attendance-table td span { display: block; }
.attendance-table td small { margin-top: .2rem; color: #7a8992; font-size: .7rem; }
.status-badge { display: inline-flex !important; width: fit-content; border-radius: 999px; padding: .25rem .55rem; font-size: .7rem; font-weight: 900; white-space: nowrap; }
.status-normal { color: #26713c; background: #eaf7ed; }
.status-late, .status-earlyleave { color: #8b6213; background: #fff4d7; }
.status-lateandearlyleave, .status-absent { color: #a4342c; background: #ffecea; }
.status-missingpunch, .status-missingin, .status-missingout { color: #9a4e22; background: #fff0e5; }
.status-leave { color: #6746a4; background: #f2ebff; }
.status-scheduled { color: #647681; background: #edf1f3; }
.state-card { padding: 2.5rem 1rem; text-align: center; color: #75838c; }
.leave-reference-section + .leave-reference-section { border-top: 1px solid #e4eaee; }
.leave-group-heading { padding: 1rem 1rem 0; }
.leave-group-heading > div { display: flex; align-items: flex-start; gap: .7rem; }
.leave-group-heading h3 { color: #17334a; font-size: .92rem; }
.leave-group-heading p { margin-top: .2rem; color: #74828b; font-size: .75rem; }
.leave-group-index { width: 25px; height: 25px; flex: none; display: grid; place-items: center; border-radius: 50%; background: #17334a; color: #fff; font-size: .72rem; font-weight: 900; }
.leave-type-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .9rem; padding: 1rem; }
.leave-type-card { border: 1px solid #e0e7eb; border-radius: 9px; padding: .9rem; }
.leave-type-card.schedule-rest-card { background: #f8fafb; }
.leave-type-card.long-term-card { background: #fffaf0; }
.leave-type-card header { display: flex; gap: .65rem; align-items: center; }
.leave-type-card header div { display: grid; min-width: 0; }
.leave-type-card header small { color: #89959d; font-size: .68rem; }
.leave-kind-badge { margin-left: auto; flex: none; border-radius: 999px; padding: .22rem .48rem; background: #edf1f3; color: #62747f; font-size: .62rem; font-weight: 900; }
.leave-kind-badge.requestable { background: #f2ebff; color: #6746a4; }
.leave-kind-badge.long-term { background: #fff0cf; color: #8a6318; }
.leave-select-note { color: #9a6721 !important; }
.leave-select-note.schedule-rest-note { color: #365f7a !important; }
.leave-icon { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 8px; color: #6746a4; background: #f2ebff; }
.leave-type-card dl { display: grid; gap: .65rem; margin-top: .8rem; }
.leave-type-card dt { color: #7b8992; font-size: .68rem; font-weight: 900; }
.leave-type-card dd { margin-top: .15rem; color: #304451; font-size: .78rem; line-height: 1.55; }
.legal-note { display: flex; gap: .65rem; margin: 0 1rem 1rem; padding: .85rem; border-radius: 8px; background: #f7f9fa; color: #637580; font-size: .78rem; line-height: 1.6; }
.overtime-law-badge { align-self: center; border-radius: 999px; padding: .35rem .65rem; background: #fff3da; color: #8a641e; font-size: .7rem; font-weight: 900; white-space: nowrap; }
.overtime-layout { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(360px, .75fr); gap: 1rem; padding: 1rem; background: #f7f9fa; }
.overtime-form, .overtime-result { border: 1px solid #dfe7ec; border-radius: 10px; padding: 1rem; background: #fff; }
.overtime-form { display: grid; gap: 1rem; }
.overtime-form-heading { display: flex; align-items: center; gap: .65rem; }
.overtime-form-heading > div { display: grid; gap: .12rem; }
.overtime-form-heading strong { color: #17334a; font-size: .9rem; }
.overtime-form-heading small { color: #7c8991; font-size: .7rem; }
.overtime-step { width: 27px; height: 27px; display: grid; place-items: center; flex: none; border-radius: 50%; background: #17334a; color: #fff; font-size: .72rem; font-weight: 900; }
.overtime-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .9rem; }
.overtime-record-field { grid-column: 1 / -1; }
.overtime-record-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .55rem; }
.overtime-record-summary div { display: grid; gap: .2rem; min-width: 0; border-radius: 7px; padding: .65rem; background: #f4f7f9; }
.overtime-record-summary span { color: #7c8991; font-size: .66rem; font-weight: 900; }
.overtime-record-summary strong { overflow: hidden; color: #263d4c; font-size: .75rem; text-overflow: ellipsis; white-space: nowrap; }
.money-input { display: grid; grid-template-columns: auto 1fr; align-items: center; overflow: hidden; border: 1px solid #d4dee5; border-radius: 7px; background: #fff; }
.money-input > span { padding-left: .75rem; color: #6d7b84; font-size: .78rem; }
.money-input input { border: 0 !important; }
.overtime-duration-field { min-width: 0; border: 0; padding: 0; }
.overtime-duration-field legend { margin-bottom: .38rem; color: #20384a; font-size: .82rem; font-weight: 900; }
.overtime-duration-field legend em { color: #b43a31; font-style: normal; }
.overtime-duration-field > small { display: block; margin-top: .38rem; color: #7b8992; font-size: .72rem; font-weight: 600; line-height: 1.5; }
.overtime-duration-inputs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .55rem; }
.overtime-duration-inputs label { display: grid; grid-template-columns: 1fr auto; align-items: center; overflow: hidden; border: 1px solid #d4dee5; border-radius: 7px; }
.overtime-duration-inputs input { min-width: 0; border: 0; padding: .68rem .75rem; color: #20303c; font: inherit; }
.overtime-duration-inputs span { padding-right: .7rem; color: #74828b; font-size: .72rem; font-weight: 900; }
.overtime-result { align-self: start; display: grid; gap: 1rem; }
.overtime-result-summary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .65rem; }
.overtime-result-summary article { display: grid; gap: .25rem; border-radius: 8px; padding: .75rem; background: #f4f7f9; }
.overtime-result-summary span { color: #73818a; font-size: .68rem; font-weight: 900; }
.overtime-result-summary strong { color: #17334a; font-size: 1rem; }
.overtime-result-summary .overtime-total-card { grid-column: 1 / -1; background: #fff2d7; }
.overtime-total-card strong { font-size: 1.55rem; }
.overtime-total-card small { color: #8b6b30; font-size: .68rem; }
.overtime-breakdown { display: grid; gap: .55rem; }
.overtime-breakdown h3 { color: #17334a; font-size: .82rem; }
.overtime-breakdown article { display: flex; justify-content: space-between; gap: .8rem; padding-top: .55rem; border-top: 1px solid #e7ecef; }
.overtime-breakdown article > div { display: grid; gap: .15rem; }
.overtime-breakdown article strong { color: #263b49; font-size: .75rem; }
.overtime-breakdown article > strong { white-space: nowrap; }
.overtime-breakdown span, .overtime-breakdown small { color: #77858e; font-size: .66rem; }
.overtime-warnings { display: grid; gap: .45rem; }
.overtime-warnings p { display: flex; align-items: flex-start; gap: .45rem; border-radius: 7px; padding: .65rem; background: #fff1ef; color: #9b3d34; font-size: .72rem; line-height: 1.5; }
.overtime-legal-note { display: flex; gap: .65rem; margin: 0 1rem 1rem; padding: .85rem; border-radius: 8px; background: #f1f6f8; color: #5f737f; font-size: .75rem; line-height: 1.65; }
.payroll-heading { align-items: center; }
.payroll-heading-actions { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
.payroll-toolbar { display: grid; grid-template-columns: minmax(220px, 320px) 1fr; gap: 1rem; align-items: end; padding: 1rem; background: #f7f9fa; }
.payroll-rule-note { min-height: 42px; display: flex; align-items: center; gap: .55rem; border-radius: 8px; padding: .65rem .8rem; background: #edf4f8; color: #486272; font-size: .76rem; line-height: 1.5; }
.payroll-subpanel { margin: 0 1rem 1rem; overflow: hidden; border: 1px solid #dfe7ec; border-radius: 10px; background: #fff; }
.payroll-subpanel-heading { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .9rem 1rem; border-bottom: 1px solid #e4eaee; background: #fafcfd; }
.payroll-subpanel-heading > div { display: flex; align-items: flex-start; gap: .7rem; }
.payroll-subpanel-heading h3 { color: #17334a; font-size: .9rem; }
.payroll-subpanel-heading p { margin-top: .2rem; color: #74828b; font-size: .72rem; }
.payroll-section-index { width: 27px; height: 27px; display: grid; place-items: center; flex: none; border-radius: 50%; background: #17334a; color: #fff; font-size: .72rem; font-weight: 900; }
.overtime-review-table, .payroll-table { width: 100%; border-collapse: collapse; }
.overtime-review-table { min-width: 1040px; }
.payroll-table { min-width: 2050px; }
.overtime-review-table th, .payroll-table th { padding: .7rem; background: #f5f8fa; color: #657681; text-align: left; font-size: .7rem; white-space: nowrap; }
.overtime-review-table td, .payroll-table td { padding: .75rem .7rem; border-top: 1px solid #edf1f3; color: #283b49; font-size: .76rem; vertical-align: top; }
.overtime-review-table td strong, .overtime-review-table td small, .payroll-table td strong, .payroll-table td small { display: block; }
.overtime-review-table td small, .payroll-table td small { margin-top: .2rem; color: #7a8992; font-size: .66rem; line-height: 1.45; }
.overtime-reason-cell { min-width: 210px; max-width: 320px; line-height: 1.55; }
.review-actions { display: flex; gap: .4rem; }
.review-complete { color: #74828b; font-size: .7rem; }
.overtime-status-pending { color: #8b6213; background: #fff4d7; }
.overtime-status-approved { color: #26713c; background: #eaf7ed; }
.overtime-status-rejected, .overtime-status-cancelled { color: #a4342c; background: #ffecea; }
.payroll-adjustment-form { display: grid; grid-template-columns: 1fr 1fr 1.4fr .8fr 1.5fr auto; gap: .7rem; align-items: end; padding: 1rem; background: #f7f9fa; }
.payroll-adjustment-form > .btn { min-height: 42px; white-space: nowrap; }
.payroll-adjustment-table { width: 100%; min-width: 920px; border-collapse: collapse; }
.payroll-adjustment-table th { padding: .7rem; background: #f5f8fa; color: #657681; text-align: left; font-size: .7rem; white-space: nowrap; }
.payroll-adjustment-table td { padding: .72rem .7rem; border-top: 1px solid #edf1f3; color: #283b49; font-size: .76rem; vertical-align: middle; }
.adjustment-type-badge { display: inline-flex; border-radius: 999px; padding: .24rem .5rem; font-size: .66rem; font-weight: 900; white-space: nowrap; }
.adjustment-bonus { color: #735110; background: #fff2cd; }
.adjustment-allowance { color: #285f73; background: #eaf5f8; }
.adjustment-addition { color: #26713c; background: #eaf7ed; }
.adjustment-deduction { color: #a4342c; background: #ffecea; }
.payroll-summary-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .7rem; padding: 1rem; background: #f7f9fa; }
.payroll-summary-grid article { display: grid; gap: .3rem; border: 1px solid #e0e7eb; border-radius: 9px; padding: .8rem; background: #fff; }
.payroll-summary-grid article span { color: #6d7b84; font-size: .7rem; font-weight: 900; }
.payroll-summary-grid article strong { color: #17334a; font-size: 1.15rem; }
.payroll-summary-grid .employer-cost { border-color: #e7cf9b; background: #fff7e5; }
.net-pay-cell { background: #f2faf4; }
.net-pay-cell strong { color: #14633f; font-size: .9rem; }
.payroll-warning-details { margin-top: .4rem; }
.payroll-warning-details summary { color: #9a6721; font-size: .66rem; font-weight: 900; cursor: pointer; }
.payroll-warning-details p { margin-top: .35rem; color: #7b5d2a; font-size: .65rem; line-height: 1.45; }
.payroll-legal-note { margin-top: 0; }
:global(.swal-payroll-field) { display: grid; gap: .25rem; margin-top: .65rem; color: #20384a; text-align: left; font-size: .78rem; font-weight: 800; }
:global(.swal-payroll-field .swal2-input), :global(.swal-payroll-field .swal2-textarea) { width: 100%; box-sizing: border-box; margin: .25rem 0 0; }
.policy-form { padding: 1rem; }
.policy-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .9rem; }
.policy-toggle { position: relative; display: grid; grid-template-columns: auto 1fr; gap: .75rem; align-items: start; margin-top: 1rem; padding: .9rem; border: 1px solid #d9e3e8; border-radius: 9px; background: #f8fafb; cursor: pointer; }
.policy-toggle > input { position: absolute; opacity: 0; pointer-events: none; }
.policy-toggle-box { width: 20px; height: 20px; margin-top: .1rem; border: 1px solid #9fb0ba; border-radius: 4px; background: #fff; box-sizing: border-box; }
.policy-toggle > input:checked + .policy-toggle-box { border-color: #17334a; background: #17334a; box-shadow: inset 0 0 0 4px #17334a; }
.policy-toggle > input:checked + .policy-toggle-box::after { content: "✓"; display: grid; place-items: center; height: 100%; color: #fff; font-size: .75rem; font-weight: 900; }
.policy-toggle > input:focus-visible + .policy-toggle-box { outline: 3px solid rgba(23, 51, 74, .18); outline-offset: 2px; }
.policy-toggle-copy { display: grid; gap: .3rem; }
.policy-toggle-copy strong { color: #20384a; font-size: .84rem; }
.policy-toggle-copy small { color: #70808a; font-size: .74rem; font-weight: 600; line-height: 1.6; }
.waiver-note { margin-top: .2rem; color: #26713c; font-size: .7rem; font-weight: 900; }
.policy-example { margin-top: 1rem; border-left: 4px solid #4f7c82; border-radius: 6px; padding: .8rem; background: #f1f7f8; }
.policy-example p { margin-top: .25rem; color: #61737d; font-size: .8rem; }
.form-actions { display: flex; justify-content: flex-end; margin-top: 1rem; }
.modal-overlay { position: fixed; inset: 0; z-index: 3000; display: grid; place-items: center; padding: 1rem; background: rgba(18, 34, 47, .55); }
.modal-overlay.top-layer { z-index: 3100; }
.modal { width: min(100%, 760px); max-height: calc(100vh - 2rem); overflow: auto; border-radius: 12px; background: #fff; box-shadow: 0 22px 60px rgba(0,0,0,.25); }
.compact-modal { width: min(100%, 570px); }
.modal-header { display: flex; justify-content: space-between; gap: 1rem; padding: 1rem 1.1rem; border-bottom: 1px solid #dfe7ec; }
.modal-header h2 { color: #17334a; font-size: 1.05rem; }
/* 控制出勤明細標題：姓名保留標題字型，日期改用後台無襯線字型，避免數字變形。 */
.attendance-detail-title {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: .28rem;
}
.attendance-detail-name { font-family: var(--font-heading); }
.attendance-detail-divider { color: #8a98a1; font-family: var(--font-sans); font-weight: 500; }
.attendance-detail-date {
  font-family: var(--font-sans);
  font-size: .86em;
  font-weight: 700;
  font-style: normal;
  letter-spacing: 0;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.modal-header span { color: #78868f; font-size: .76rem; }
.modal-kicker { color: #b48745; font-size: .65rem; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
.icon-btn { width: 34px; height: 34px; border: 1px solid #d5dfe5; border-radius: 7px; background: #fff; color: #17334a; cursor: pointer; }
.modal-body { display: grid; gap: .9rem; padding: 1rem 1.1rem; }
.detail-summary { justify-content: space-between; }
.segment-card { border: 1px solid #dfe7ec; border-radius: 9px; overflow: hidden; }
.segment-card > header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .75rem .85rem; background: #f7f9fa; }
.segment-card > header div { display: flex; align-items: center; gap: .65rem; }
.segment-index { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 50%; background: #17334a; color: #fff; font-size: .7rem; font-weight: 900; }
.segment-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .6rem; padding: .8rem; }
.segment-grid div { display: grid; gap: .2rem; }
.segment-grid span { color: #7b8992; font-size: .66rem; }
.segment-grid strong { color: #263b49; font-size: .77rem; }
.segment-note { margin: 0 .8rem .7rem; padding: .55rem .65rem; border-radius: 6px; background: #f5f7f8; color: #667781; font-size: .74rem; }
.segment-note.leave-note { background: #f3edff; color: #6746a4; }
.segment-card footer { display: flex; justify-content: flex-end; gap: .5rem; padding: .7rem .8rem; border-top: 1px solid #edf1f3; }
.target-info { display: grid; gap: .2rem; padding: .75rem; border-radius: 7px; background: #f4f7f9; }
.target-info span { color: #71808a; font-size: .78rem; }
.form-grid.two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; }
.modal-actions { justify-content: flex-end; padding-top: .3rem; }
@media (max-width: 1100px) {
  .summary-grid { grid-template-columns: repeat(4, 1fr); }
  .filter-panel { grid-template-columns: repeat(2, 1fr); }
  .filter-button { width: 100%; }
  .leave-type-grid { grid-template-columns: repeat(2, 1fr); }
  .overtime-layout { grid-template-columns: 1fr; }
  .overtime-record-summary { grid-template-columns: repeat(2, 1fr); }
  .payroll-summary-grid { grid-template-columns: repeat(2, 1fr); }
  .payroll-adjustment-form { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .payroll-adjustment-note { grid-column: 1 / -1; }
}
@media (max-width: 720px) {
  .attendance-header, .panel-heading, .section-intro { align-items: stretch; flex-direction: column; }
  .header-actions { width: 100%; }
  .header-actions .btn { flex: 1; }
  .tab-bar { width: 100%; overflow-x: auto; }
  .tab-bar button { flex: none; }
  .filter-panel, .policy-grid, .form-grid.two, .overtime-form-grid { grid-template-columns: 1fr; }
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .leave-type-grid { grid-template-columns: 1fr; }
  .overtime-layout { padding: .75rem; }
  .overtime-record-summary, .overtime-result-summary { grid-template-columns: 1fr; }
  .payroll-heading, .payroll-subpanel-heading { align-items: stretch; flex-direction: column; }
  .payroll-heading-actions { align-items: stretch; }
  .payroll-heading-actions .btn { width: 100%; }
  .payroll-toolbar, .payroll-summary-grid, .payroll-adjustment-form { grid-template-columns: 1fr; }
  .payroll-adjustment-note { grid-column: auto; }
  .payroll-subpanel { margin: 0 .75rem .75rem; }
  .overtime-result-summary .overtime-total-card { grid-column: auto; }
  .modal-overlay { align-items: end; padding: 0; }
  .modal { width: 100%; max-height: 92vh; border-radius: 14px 14px 0 0; }
  .segment-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
