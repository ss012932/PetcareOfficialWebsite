<template>
  <div class="shift-page">
    <header class="page-header">
      <div>
        <p class="kicker">Workforce Scheduling</p>
        <h1>{{ t("page.member.shifts") }}</h1>
        <p class="page-desc">先建立可重複使用的班別，再以月曆或週表安排員工值班院所與日期。</p>
      </div>
      <div class="header-actions">
        <button class="btn ghost" :class="{ active: activeTab === 'schedule' }" @click="activeTab = 'schedule'">
          <Icon name="fa6-solid:calendar-days" aria-hidden="true" /> 排班表
        </button>
        <button class="btn ghost" :class="{ active: activeTab === 'templates' }" @click="activeTab = 'templates'">
          <Icon name="fa6-solid:clock" aria-hidden="true" /> 班別設定
        </button>
        <template v-if="activeTab === 'schedule'">
          <button class="btn ghost" :disabled="selectedStoreId <= 0 || staffOptions.length === 0" @click="openPdfExport">
            <Icon name="fa6-solid:file-pdf" aria-hidden="true" /> 匯出 A4 PDF
          </button>
          <button class="btn ghost" :disabled="selectedStoreId <= 0" @click="openMarkerCreate()">
            <Icon name="fa6-solid:calendar-xmark" aria-hidden="true" /> 店休／異動
          </button>
          <button class="btn ghost" :disabled="!canCreateShift" @click="openBatchSchedule">
            <Icon name="fa6-solid:layer-group" aria-hidden="true" /> 批次排班
          </button>
          <button class="btn danger-ghost" :disabled="selectedStoreId <= 0 || staffOptions.length === 0" @click="openBatchDelete">
            <Icon name="fa6-solid:trash-can" aria-hidden="true" /> 批次移除
          </button>
          <button class="btn primary" :disabled="!canCreateShift" @click="openScheduleCreate">
            <Icon name="fa6-solid:plus" aria-hidden="true" /> 新增排班
          </button>
        </template>
        <button v-else class="btn primary" @click="openTemplateCreate">
          <Icon name="fa6-solid:plus" aria-hidden="true" /> 新增班別
        </button>
      </div>
    </header>

    <section v-if="activeTab === 'schedule'" class="workspace">
      <div class="toolbar">
        <label class="control">
          <span>院所</span>
          <select v-model.number="selectedStoreId" :disabled="loadingStores">
            <option :value="0">請選擇院所</option>
            <option v-for="store in stores" :key="store.id" :value="store.id">{{ store.name }}</option>
          </select>
        </label>

        <div class="period-control">
          <button class="icon-btn" :title="scheduleView === 'month' ? '上個月' : '上一週'" @click="movePeriod(-1)">
            <Icon name="fa6-solid:chevron-left" aria-hidden="true" />
          </button>
          <button class="btn ghost" @click="goCurrentPeriod">{{ scheduleView === 'month' ? '本月' : '本週' }}</button>
          <strong>{{ periodLabel }}</strong>
          <button class="icon-btn" :title="scheduleView === 'month' ? '下個月' : '下一週'" @click="movePeriod(1)">
            <Icon name="fa6-solid:chevron-right" aria-hidden="true" />
          </button>
        </div>

        <div class="view-switch" role="group" aria-label="排班檢視方式">
          <button class="view-switch-btn" :class="{ active: scheduleView === 'month' }" @click="setScheduleView('month')">
            <Icon name="fa6-solid:calendar" aria-hidden="true" /> 月
          </button>
          <button class="view-switch-btn" :class="{ active: scheduleView === 'week' }" @click="setScheduleView('week')">
            <Icon name="fa6-solid:table-columns" aria-hidden="true" /> 週
          </button>
        </div>

        <div class="toolbar-summary">
          <span>{{ staffOptions.length }} 位員工</span>
          <span>{{ shifts.length }} 筆排班</span>
        </div>
      </div>

      <div v-if="loadingSchedule" class="state-card">排班載入中…</div>
      <div v-else-if="!selectedStoreId" class="state-card">請先選擇要管理的院所。</div>
      <div v-else-if="staffOptions.length === 0" class="state-card">
        此院所尚未指派可排班員工，請先至員工管理完成院所指派。
      </div>
      <div v-else-if="scheduleView === 'month'" class="month-board-wrap">
        <div class="month-board">
          <div v-for="weekday in calendarWeekdays" :key="weekday" class="month-weekday">{{ weekday }}</div>

          <div
            v-for="day in monthDays"
            :key="day.iso"
            class="month-day"
            :class="{ outside: !day.isCurrentMonth, today: day.isToday }"
          >
            <header class="month-day-header">
              <button class="month-date" :aria-label="`${day.iso} 新增排班`" @click="openScheduleCreate(0, day.iso)">
                {{ day.dayNumber }}
              </button>
              <span v-if="day.isToday">今天</span>
              <small v-else-if="!day.isCurrentMonth">{{ day.monthLabel }}</small>
            </header>

            <button
              v-if="getDateMarker(day.iso)"
              class="calendar-marker"
              :class="markerClass(getDateMarker(day.iso)!)"
              :title="getDateMarker(day.iso)?.note || getDateMarker(day.iso)?.title"
              @click="openMarkerEdit(getDateMarker(day.iso)!)"
            >
              <strong>{{ getDateMarker(day.iso)?.title }}</strong>
              <span v-if="formatMarkerTime(getDateMarker(day.iso)!)">{{ formatMarkerTime(getDateMarker(day.iso)!) }}</span>
            </button>

            <div class="month-shift-list">
              <button
                v-for="shift in getDateShifts(day.iso)"
                :key="shift.id"
                class="month-shift-card"
                :style="shiftCardStyle(shift)"
                @click="openScheduleEdit(shift)"
              >
                <strong>{{ shift.staffName }}</strong>
                <span>{{ shift.shiftName }}｜{{ formatShiftSegments(shift) }}</span>
              </button>
            </div>

            <button class="month-add" title="新增排班" @click="openScheduleCreate(0, day.iso)">
              <Icon name="fa6-solid:plus" aria-hidden="true" />
              <span>新增</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="week-board-wrap">
        <div class="week-board">
          <div class="week-head sticky-name">員工</div>
          <div v-for="day in weekDays" :key="day.iso" class="week-head" :class="{ today: day.isToday }">
            <span>{{ day.weekday }}</span>
            <strong>{{ day.monthDay }}</strong>
            <button
              v-if="getDateMarker(day.iso)"
              class="week-marker"
              :class="markerClass(getDateMarker(day.iso)!)"
              @click="openMarkerEdit(getDateMarker(day.iso)!)"
            >
              {{ getDateMarker(day.iso)?.title }}
              <small v-if="formatMarkerTime(getDateMarker(day.iso)!)">{{ formatMarkerTime(getDateMarker(day.iso)!) }}</small>
            </button>
          </div>

          <template v-for="staff in staffOptions" :key="staff.staffId">
            <div class="staff-cell sticky-name">
              <span class="avatar">{{ staff.fullName.slice(0, 1) }}</span>
              <div>
                <strong>{{ staff.fullName }}</strong>
                <small>{{ staff.jobTitle || staff.roleName || "未設定職稱" }}</small>
              </div>
            </div>

            <div v-for="day in weekDays" :key="`${staff.staffId}-${day.iso}`" class="day-cell">
              <button
                v-for="shift in getCellShifts(staff.staffId, day.iso)"
                :key="shift.id"
                class="shift-card"
                :style="shiftCardStyle(shift)"
                @click="openScheduleEdit(shift)"
              >
                <strong>{{ shift.shiftName }}</strong>
                <span>{{ formatShiftSegments(shift) }}</span>
                <small>{{ formatWorkMinutes(shift.workMinutes) }}</small>
              </button>
              <button class="cell-add" title="新增排班" @click="openScheduleCreate(staff.staffId, day.iso)">
                <Icon name="fa6-solid:plus" aria-hidden="true" />
              </button>
            </div>
          </template>
        </div>
      </div>
    </section>

    <section v-else class="workspace">
      <div class="template-intro">
        <div>
          <h2>班別模板</h2>
          <p>一般班可設定內含休息時間；分段班可增加多段實際工作時段，段落間空檔不計入工時。</p>
        </div>
        <span class="count-pill">{{ templates.length }} 個班別</span>
      </div>

      <div v-if="loadingTemplates" class="state-card">班別載入中…</div>
      <div v-else-if="templates.length === 0" class="state-card">
        尚未建立班別，請先新增早班、晚班或分段班。
      </div>
      <div v-else class="template-grid">
        <article v-for="template in templates" :key="template.id" class="template-card" :class="{ disabled: !template.isActive }">
          <header>
            <span class="color-dot" :style="{ backgroundColor: template.colorHex || '#17334a' }" />
            <div>
              <strong>{{ template.templateName }}</strong>
              <small>{{ template.templateCode }}</small>
            </div>
            <span class="status-pill" :class="template.isActive ? 'on' : 'off'">
              {{ template.isActive ? "啟用" : "停用" }}
            </span>
          </header>

          <div class="segment-list">
            <div v-for="segment in template.segments" :key="segment.sequenceNo" class="segment-line">
              <Icon name="fa6-solid:clock" aria-hidden="true" />
              <span>{{ formatTime(segment.startTime) }}～{{ formatTime(segment.endTime) }}</span>
              <em v-if="segment.endDayOffset === 1">翌日</em>
            </div>
          </div>

          <dl>
            <div><dt>工作時數</dt><dd>{{ formatWorkMinutes(template.workMinutes) }}</dd></div>
            <div><dt>內含休息</dt><dd>{{ template.breakMinutes }} 分鐘</dd></div>
            <div><dt>班別類型</dt><dd>{{ template.isMultiSegment ? "多段班" : "一般班" }}</dd></div>
          </dl>

          <p v-if="template.description" class="template-description">{{ template.description }}</p>

          <footer>
            <button class="btn ghost small" @click="openTemplateEdit(template)">
              <Icon name="fa6-solid:pen" aria-hidden="true" /> 編輯
            </button>
            <button class="btn danger small" @click="removeTemplate(template)">
              <Icon name="fa6-solid:trash" aria-hidden="true" /> 刪除
            </button>
          </footer>
        </article>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="showPdfModal" class="modal-overlay">
        <div class="modal pdf-export-modal" role="dialog" aria-modal="true" aria-labelledby="pdf-export-title">
          <header class="modal-header">
            <div>
              <p class="modal-kicker">A4 Schedule PDF</p>
              <h2 id="pdf-export-title">匯出 A4 月班表</h2>
              <p class="modal-subtitle">選擇月份與顯示員工，系統會下載與畫面相近的 A4 橫式月曆班表。</p>
            </div>
            <button class="icon-btn" aria-label="關閉" @click="closePdfExport">×</button>
          </header>

          <div class="pdf-export-body">
            <section class="pdf-export-settings">
              <div class="form-grid two">
                <label class="field">
                  <span>院所 <em>*</em></span>
                  <select v-model.number="pdfForm.storeId" @change="loadPdfStaffRows">
                    <option :value="0">請選擇院所</option>
                    <option v-for="store in stores" :key="store.id" :value="store.id">{{ store.name }}</option>
                  </select>
                </label>
                <label class="field">
                  <span>班表月份 <em>*</em></span>
                  <input v-model="pdfForm.month" type="month" />
                </label>
              </div>

              <div class="pdf-staff-toolbar">
                <div>
                  <strong>顯示員工</strong>
                  <span>預設選取此院所全部員工</span>
                </div>
                <div>
                  <button type="button" class="btn ghost small" @click="selectAllPdfStaff">全選</button>
                  <button type="button" class="btn ghost small" @click="clearAllPdfStaff">清除</button>
                </div>
              </div>

              <div v-if="loadingPdfStaff" class="state-card compact">員工載入中…</div>
              <div v-else-if="pdfStaffRows.length === 0" class="state-card compact">此院所目前沒有可顯示的員工。</div>
              <div v-else class="pdf-staff-list">
                <label v-for="row in pdfStaffRows" :key="row.staffId" class="pdf-staff-row" :class="{ selected: row.selected }">
                  <input v-model="row.selected" type="checkbox" />
                  <span class="avatar">{{ row.fullName.slice(0, 1) }}</span>
                  <span class="pdf-staff-meta">
                    <strong>{{ row.fullName }}</strong>
                    <small>{{ row.jobTitle || row.roleName || "未設定職稱" }}</small>
                  </span>
                </label>
              </div>
            </section>

            <aside class="pdf-export-summary">
              <div class="pdf-paper-preview" aria-hidden="true">
                <div class="pdf-paper-title"></div>
                <div class="pdf-paper-subtitle"></div>
                <div class="pdf-paper-grid">
                  <span v-for="index in 42" :key="index"></span>
                </div>
              </div>

              <div class="pdf-summary-grid">
                <div>
                  <span>選擇員工</span>
                  <strong>{{ selectedPdfStaffCount }} 人</strong>
                </div>
                <div>
                  <span>預計頁數</span>
                  <strong>{{ estimatedPdfPages }} 頁</strong>
                </div>
              </div>

              <div class="pdf-layout-note">
                <Icon name="fa6-solid:file-pdf" aria-hidden="true" />
                <div>
                  <strong>A4 橫式月曆排版</strong>
                  <p>PDF 會顯示星期日至星期六的完整月曆；每頁最多 10 位員工，超過時以相同月份自動續頁。</p>
                </div>
              </div>

              <div class="pdf-export-info">
                <span>院所</span>
                <strong>{{ selectedPdfStoreName || "尚未選擇" }}</strong>
                <span>月份</span>
                <strong>{{ formattedPdfMonth }}</strong>
              </div>

              <div class="modal-actions pdf-export-actions">
                <button type="button" class="btn ghost" @click="closePdfExport">取消</button>
                <button type="button" class="btn primary" :disabled="!canExportPdf || exportingPdf" @click="exportSchedulePdf">
                  <Icon name="fa6-solid:download" aria-hidden="true" />
                  {{ exportingPdf ? "PDF 產生中…" : "下載 A4 班表" }}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showBatchModal" class="modal-overlay">
        <div class="modal batch-modal" role="dialog" aria-modal="true" aria-labelledby="batch-modal-title">
          <header class="modal-header">
            <div>
              <p class="modal-kicker">Batch Scheduling</p>
              <h2 id="batch-modal-title">批次排班</h2>
              <p class="modal-subtitle">依日期範圍與星期，為多位員工一次建立排班。</p>
            </div>
            <button class="icon-btn" aria-label="關閉" @click="closeBatchModal">×</button>
          </header>

          <form class="modal-body batch-body" @submit.prevent="saveBatchSchedule">
            <section class="batch-section batch-scope-section">
              <header class="batch-section-header">
                <span class="step-index">1</span>
                <div>
                  <h3>日期與院所</h3>
                  <p>預設使用目前查看的月份，可快速切換整月或平日。</p>
                </div>
              </header>

              <div class="batch-preset-row">
                <button type="button" class="preset-btn" @click="setBatchPreset(0, 'all')">本月整月</button>
                <button type="button" class="preset-btn" @click="setBatchPreset(0, 'weekdays')">本月平日</button>
                <button type="button" class="preset-btn" @click="setBatchPreset(1, 'weekdays')">下月平日</button>
              </div>

              <div class="form-grid three">
                <label class="field">
                  <span>院所 <em>*</em></span>
                  <select v-model.number="batchForm.storeId" required @change="loadBatchStaffRows">
                    <option :value="0">請選擇院所</option>
                    <option v-for="store in stores" :key="store.id" :value="store.id">{{ store.name }}</option>
                  </select>
                </label>
                <label class="field">
                  <span>開始日期 <em>*</em></span>
                  <input v-model="batchForm.startDate" type="date" required />
                </label>
                <label class="field">
                  <span>結束日期 <em>*</em></span>
                  <input v-model="batchForm.endDate" type="date" required />
                </label>
              </div>

              <div class="weekday-selector">
                <span class="weekday-label">套用星期</span>
                <label v-for="day in batchWeekdayOptions" :key="day.value" class="weekday-chip" :class="{ selected: batchForm.weekdays.includes(day.value) }">
                  <input v-model="batchForm.weekdays" type="checkbox" :value="day.value" />
                  <span>{{ day.label }}</span>
                </label>
              </div>
            </section>

            <section class="batch-section batch-staff-section">
              <header class="batch-section-header">
                <span class="step-index">2</span>
                <div>
                  <h3>員工與班別</h3>
                  <p>每位員工可使用不同班別，也可先選擇班別後一次套用。</p>
                </div>
              </header>

              <div class="batch-staff-toolbar">
                <button type="button" class="btn ghost small" @click="toggleAllBatchStaff">
                  {{ allBatchStaffSelected ? "取消全選" : "全選員工" }}
                </button>
                <select v-model.number="batchApplyTemplateId" aria-label="批次套用班別">
                  <option :value="0">選擇要套用的班別</option>
                  <option v-for="template in activeTemplates" :key="template.id" :value="template.id">
                    {{ template.templateName }}｜{{ formatTemplateTimes(template) }}
                  </option>
                </select>
                <button type="button" class="btn ghost small" :disabled="!batchApplyTemplateId || batchSelectedStaffCount === 0" @click="applyTemplateToSelectedStaff">
                  套用到已選員工
                </button>
                <span class="selected-count">已選 {{ batchSelectedStaffCount }} / {{ batchStaffRows.length }} 人</span>
              </div>

              <div v-if="loadingBatchStaff" class="state-card compact">員工載入中…</div>
              <div v-else-if="batchStaffRows.length === 0" class="state-card compact">此院所目前沒有可排班員工。</div>
              <div v-else class="batch-staff-list">
                <article v-for="row in batchStaffRows" :key="row.staffId" class="batch-staff-row" :class="{ selected: row.selected }">
                  <label class="staff-select-box">
                    <input v-model="row.selected" type="checkbox" />
                    <span class="avatar">{{ row.fullName.slice(0, 1) }}</span>
                    <span class="staff-meta">
                      <strong>{{ row.fullName }}</strong>
                      <small>{{ row.jobTitle || row.roleName || "未設定職稱" }}</small>
                    </span>
                  </label>
                  <label class="field compact batch-template-field">
                    <span>套用班別</span>
                    <select v-model.number="row.shiftTemplateId" :disabled="!row.selected">
                      <option :value="0">請選擇班別</option>
                      <option v-for="template in activeTemplates" :key="template.id" :value="template.id">
                        {{ template.templateName }}｜{{ formatTemplateTimes(template) }}
                      </option>
                    </select>
                  </label>
                </article>
              </div>
            </section>

            <section class="batch-section summary-section">
              <header class="batch-section-header">
                <span class="step-index">3</span>
                <div>
                  <h3>確認建立方式</h3>
                  <p>系統會逐筆檢查跨品牌與跨院所的時間衝突。</p>
                </div>
              </header>

              <div class="batch-summary-grid">
                <div><span>選擇員工</span><strong>{{ batchSelectedStaffCount }} 人</strong></div>
                <div><span>符合日期</span><strong>{{ batchSelectedDates.length }} 天</strong></div>
                <div class="highlight"><span>預計建立</span><strong>{{ batchRequestedCount }} 筆</strong></div>
              </div>

              <p v-if="batchRangeDayCount > 63" class="batch-limit-warning">日期範圍最多 63 天，請縮小開始與結束日期。</p>
              <p v-else-if="batchRequestedCount > 500" class="batch-limit-warning">單次最多建立 500 筆，請縮小日期範圍或員工人數。</p>

              <div class="conflict-options">
                <label :class="{ active: batchForm.skipConflicts }">
                  <input v-model="batchForm.skipConflicts" type="radio" :value="true" />
                  <span>
                    <strong>略過衝突，建立其餘排班</strong>
                    <small>建議使用。已有排班的日期會略過，不影響其他員工與日期。</small>
                  </span>
                </label>
                <label :class="{ active: !batchForm.skipConflicts }">
                  <input v-model="batchForm.skipConflicts" type="radio" :value="false" />
                  <span>
                    <strong>遇到衝突，整批取消</strong>
                    <small>適合班表必須完全一致的情況；任何一筆衝突都不會建立。</small>
                  </span>
                </label>
              </div>

              <label class="field">
                <span>共用備註</span>
                <textarea v-model.trim="batchForm.note" maxlength="500" rows="2" placeholder="例如：八月份固定班表、教育訓練期間" />
              </label>
            </section>

            <div class="modal-actions batch-actions">
              <button type="button" class="btn ghost" @click="closeBatchModal">取消</button>
              <button type="submit" class="btn primary" :disabled="!batchCanSubmit || savingBatch">
                {{ savingBatch ? "批次建立中…" : `確認建立 ${batchRequestedCount} 筆排班` }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showBatchDeleteModal" class="modal-overlay">
        <div class="modal batch-delete-modal" role="dialog" aria-modal="true" aria-labelledby="batch-delete-title">
          <header class="modal-header">
            <div>
              <p class="modal-kicker danger-text">Batch Remove</p>
              <h2 id="batch-delete-title">批次移除排班</h2>
              <p class="modal-subtitle">先篩選並預覽實際排班，再選擇要移除的項目。</p>
            </div>
            <button class="icon-btn" aria-label="關閉" @click="closeBatchDelete">×</button>
          </header>

          <div class="batch-delete-body">
            <section class="batch-delete-filter">
              <header class="batch-section-header">
                <span class="step-index">1</span>
                <div>
                  <h3>篩選要移除的排班</h3>
                  <p>修改任何條件後都必須重新預覽，避免使用舊清單誤刪。</p>
                </div>
              </header>

              <div class="batch-preset-row">
                <button type="button" class="preset-btn" @click="setBatchDeletePreset(0, 'all')">本月整月</button>
                <button type="button" class="preset-btn" @click="setBatchDeletePreset(0, 'weekdays')">本月平日</button>
                <button type="button" class="preset-btn" @click="setBatchDeletePreset(1, 'weekdays')">下月平日</button>
              </div>

              <div class="form-grid three">
                <label class="field">
                  <span>院所 <em>*</em></span>
                  <select v-model.number="batchDeleteForm.storeId" @change="loadBatchDeleteStaffRows">
                    <option :value="0">請選擇院所</option>
                    <option v-for="store in stores" :key="store.id" :value="store.id">{{ store.name }}</option>
                  </select>
                </label>
                <label class="field">
                  <span>開始日期 <em>*</em></span>
                  <input v-model="batchDeleteForm.startDate" type="date" @change="clearBatchDeletePreview" />
                </label>
                <label class="field">
                  <span>結束日期 <em>*</em></span>
                  <input v-model="batchDeleteForm.endDate" type="date" @change="clearBatchDeletePreview" />
                </label>
              </div>

              <div class="weekday-selector">
                <span class="weekday-label">套用星期</span>
                <label v-for="day in batchWeekdayOptions" :key="day.value" class="weekday-chip" :class="{ selected: batchDeleteForm.weekdays.includes(day.value) }">
                  <input v-model="batchDeleteForm.weekdays" type="checkbox" :value="day.value" @change="clearBatchDeletePreview" />
                  <span>{{ day.label }}</span>
                </label>
              </div>

              <div class="batch-delete-staff-header">
                <strong>選擇員工</strong>
                <button type="button" class="btn ghost small" @click="toggleAllBatchDeleteStaff">
                  {{ allBatchDeleteStaffSelected ? '取消全選' : '全選員工' }}
                </button>
              </div>

              <div v-if="loadingBatchDeleteStaff" class="state-card compact">員工載入中…</div>
              <div v-else-if="batchDeleteStaffRows.length === 0" class="state-card compact">此院所目前沒有可排班員工。</div>
              <div v-else class="batch-delete-staff-list">
                <label v-for="row in batchDeleteStaffRows" :key="row.staffId" class="delete-staff-chip" :class="{ selected: row.selected }">
                  <input v-model="row.selected" type="checkbox" @change="clearBatchDeletePreview" />
                  <span class="avatar">{{ row.fullName.slice(0, 1) }}</span>
                  <span>
                    <strong>{{ row.fullName }}</strong>
                    <small>{{ row.jobTitle || row.roleName || '未設定職稱' }}</small>
                  </span>
                </label>
              </div>

              <p v-if="batchDeleteRangeDayCount > 63" class="batch-limit-warning">日期範圍最多 63 天，請縮小開始與結束日期。</p>

              <button type="button" class="btn primary preview-delete-btn" :disabled="!batchDeleteCanPreview || previewingBatchDelete" @click="previewBatchDelete">
                <Icon name="fa6-solid:magnifying-glass" aria-hidden="true" />
                {{ previewingBatchDelete ? '查詢中…' : '預覽符合排班' }}
              </button>
            </section>

            <section class="batch-delete-preview">
              <header class="batch-section-header preview-header">
                <span class="step-index danger-step">2</span>
                <div>
                  <h3>確認移除清單</h3>
                  <p>預覽後可取消勾選個別排班。</p>
                </div>
                <span class="delete-selected-count">已選 {{ selectedBatchDeleteCount }} 筆</span>
              </header>

              <div v-if="!batchDeleteHasPreview" class="delete-preview-empty">
                <Icon name="fa6-solid:list-check" aria-hidden="true" />
                <strong>尚未產生預覽</strong>
                <span>先在左側設定條件，再按「預覽符合排班」。</span>
              </div>
              <div v-else-if="batchDeletePreviewItems.length === 0" class="delete-preview-empty">
                <Icon name="fa6-solid:calendar-check" aria-hidden="true" />
                <strong>沒有符合條件的排班</strong>
                <span>目前條件下不需要移除任何資料。</span>
              </div>
              <template v-else>
                <div class="delete-preview-toolbar">
                  <button type="button" class="btn ghost small" @click="toggleAllBatchDeletePreview">
                    {{ allBatchDeletePreviewSelected ? '取消全選' : '全選排班' }}
                  </button>
                  <span>共找到 {{ batchDeletePreviewItems.length }} 筆</span>
                </div>

                <div class="delete-preview-list">
                  <label v-for="item in batchDeletePreviewItems" :key="item.shiftId" class="delete-preview-row" :class="{ selected: item.selected }">
                    <input v-model="item.selected" type="checkbox" />
                    <time>{{ item.shiftDate }}</time>
                    <span class="delete-preview-main">
                      <strong>{{ item.staffName }}</strong>
                      <small>{{ item.shiftName }}｜{{ item.timeSummary }}</small>
                      <small v-if="item.note">備註：{{ item.note }}</small>
                    </span>
                  </label>
                </div>
              </template>

              <div class="delete-warning-box">
                <Icon name="fa6-solid:triangle-exclamation" aria-hidden="true" />
                <span>移除後會標記為取消，月曆不再顯示。送出前會再顯示一次確認視窗。</span>
              </div>

              <div class="modal-actions delete-modal-actions">
                <button type="button" class="btn ghost" @click="closeBatchDelete">取消</button>
                <button type="button" class="btn danger" :disabled="selectedBatchDeleteCount === 0 || deletingBatchDelete" @click="executeBatchDelete">
                  {{ deletingBatchDelete ? '移除中…' : `移除 ${selectedBatchDeleteCount} 筆排班` }}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showTemplateModal" class="modal-overlay">
        <div class="modal large" role="dialog" aria-modal="true" aria-labelledby="template-modal-title">
          <header class="modal-header">
            <div>
              <p class="modal-kicker">Shift Template</p>
              <h2 id="template-modal-title">{{ editingTemplate ? "編輯班別" : "新增班別" }}</h2>
            </div>
            <button class="icon-btn" aria-label="關閉" @click="closeTemplateModal">×</button>
          </header>

          <form class="modal-body" @submit.prevent="saveTemplate">
            <div class="form-grid two">
              <label class="field">
                <span>班別名稱 <em>*</em></span>
                <input v-model.trim="templateForm.templateName" maxlength="100" placeholder="例如：早班、A 班、分段班" required />
              </label>
              <label class="field">
                <span>班別代碼</span>
                <input
                  v-model.trim="templateForm.templateCode"
                  maxlength="30"
                  placeholder="未填由系統自動產生"
                  :readonly="Boolean(editingTemplate)"
                  :aria-readonly="Boolean(editingTemplate)"
                  :class="{ 'readonly-input': Boolean(editingTemplate) }"
                />
                <small v-if="editingTemplate">班別代碼建立後不可修改。</small>
              </label>
              <label class="field">
                <span>顯示顏色</span>
                <input v-model="templateForm.colorHex" type="color" class="color-input" />
              </label>
              <label class="field">
                <span>工作時段內休息分鐘</span>
                <input v-model.number="templateForm.breakMinutes" type="number" min="0" max="720" step="5" />
                <small>例如 09:00～18:00，中間休息一小時，請填 60。分段班段落間的空檔不必重複填入。</small>
              </label>
            </div>

            <label class="field">
              <span>班別說明</span>
              <textarea v-model.trim="templateForm.description" maxlength="500" rows="2" placeholder="例如：平日門診早班，包含午休一小時" />
            </label>

            <section class="segment-editor">
              <header>
                <div>
                  <h3>工作時段</h3>
                  <p>一段班保留一列；分段班可新增多列。夜班可勾選「隔日結束」。</p>
                </div>
                <button type="button" class="btn ghost small" :disabled="templateForm.segments.length >= 8" @click="addSegment">
                  <Icon name="fa6-solid:plus" aria-hidden="true" /> 增加時段
                </button>
              </header>

              <div v-for="(segment, index) in templateForm.segments" :key="segment.key" class="segment-row">
                <span class="segment-index">{{ index + 1 }}</span>
                <label class="field compact">
                  <span>開始</span>
                  <input v-model="segment.startTime" type="time" required />
                </label>
                <span class="arrow">→</span>
                <label class="field compact">
                  <span>結束</span>
                  <input v-model="segment.endTime" type="time" required />
                </label>
                <label class="check-field">
                  <input v-model="segment.endNextDay" type="checkbox" />
                  <span>隔日結束</span>
                </label>
                <button type="button" class="icon-btn danger-icon" title="移除此時段" :disabled="templateForm.segments.length === 1" @click="removeSegment(index)">
                  <Icon name="fa6-solid:trash" aria-hidden="true" />
                </button>
              </div>
            </section>

            <div class="work-preview">
              <div><span>時段總長</span><strong>{{ formatWorkMinutes(templatePreview.grossMinutes) }}</strong></div>
              <div><span>扣除休息</span><strong>{{ templateForm.breakMinutes }} 分鐘</strong></div>
              <div class="highlight"><span>實際工時</span><strong>{{ formatWorkMinutes(templatePreview.workMinutes) }}</strong></div>
            </div>

            <label class="check-field standalone">
              <input v-model="templateForm.isActive" type="checkbox" />
              <span>啟用此班別，可用於新增排班</span>
            </label>

            <div class="modal-actions">
              <button type="button" class="btn ghost" @click="closeTemplateModal">取消</button>
              <button type="submit" class="btn primary" :disabled="savingTemplate || templatePreview.workMinutes <= 0">
                {{ savingTemplate ? "儲存中…" : "儲存班別" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showMarkerModal" class="modal-overlay">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="marker-modal-title">
          <header class="modal-header">
            <div>
              <p class="modal-kicker">Calendar Marker</p>
              <h2 id="marker-modal-title">{{ editingMarker ? "編輯店休／異動" : "新增店休／異動" }}</h2>
            </div>
            <button class="icon-btn" aria-label="關閉" @click="closeMarkerModal">×</button>
          </header>

          <form class="modal-body" @submit.prevent="saveMarker">
            <label class="field">
              <span>院所</span>
              <select v-model.number="markerForm.storeId" disabled>
                <option v-for="store in stores" :key="store.id" :value="store.id">{{ store.name }}</option>
              </select>
            </label>

            <div class="form-grid two">
              <label class="field">
                <span>日期 <em>*</em></span>
                <input v-model="markerForm.markerDate" type="date" required />
              </label>
              <label class="field">
                <span>類型 <em>*</em></span>
                <select v-model="markerForm.markerType" required @change="applyMarkerTypeDefaults">
                  <option value="ClosedAllDay">整天店休</option>
                  <option value="BusinessHoursChanged">營業時間異動</option>
                  <option value="BreakPeriod">特定時段休息</option>
                </select>
              </label>
            </div>

            <div v-if="markerNeedsTime" class="form-grid two">
              <label class="field">
                <span>開始時間 <em>*</em></span>
                <input v-model="markerForm.startTime" type="time" required />
              </label>
              <label class="field">
                <span>結束時間 <em>*</em></span>
                <input v-model="markerForm.endTime" type="time" required />
              </label>
            </div>

            <label class="field">
              <span>顯示文字</span>
              <input v-model.trim="markerForm.title" maxlength="100" :placeholder="markerDefaultTitle" />
              <small>未填時會自動顯示「{{ markerDefaultTitle }}」。</small>
            </label>

            <label class="field">
              <span>備註</span>
              <textarea v-model.trim="markerForm.note" maxlength="300" rows="3" placeholder="例如：春節店休、設備保養、下午教育訓練" />
            </label>

            <p class="marker-hint">這只是班表上的提示標記，不會阻止或自動刪除員工排班。</p>

            <div class="modal-actions split">
              <button v-if="editingMarker" type="button" class="btn danger" @click="removeMarker(editingMarker)">
                <Icon name="fa6-solid:trash" aria-hidden="true" /> 移除標記
              </button>
              <span v-else />
              <div>
                <button type="button" class="btn ghost" @click="closeMarkerModal">取消</button>
                <button type="submit" class="btn primary" :disabled="savingMarker">
                  {{ savingMarker ? "儲存中…" : "儲存標記" }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showScheduleModal" class="modal-overlay">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="schedule-modal-title">
          <header class="modal-header">
            <div>
              <p class="modal-kicker">Staff Schedule</p>
              <h2 id="schedule-modal-title">{{ editingShift ? "編輯排班" : "新增排班" }}</h2>
            </div>
            <button class="icon-btn" aria-label="關閉" @click="closeScheduleModal">×</button>
          </header>

          <form class="modal-body" @submit.prevent="saveSchedule">
            <label class="field">
              <span>院所 <em>*</em></span>
              <select v-model.number="scheduleForm.storeId" required @change="loadStaffOptions">
                <option :value="0">請選擇院所</option>
                <option v-for="store in stores" :key="store.id" :value="store.id">{{ store.name }}</option>
              </select>
            </label>

            <label class="field">
              <span>員工 <em>*</em></span>
              <select v-model.number="scheduleForm.staffId" required :disabled="loadingStaffOptions">
                <option :value="0">{{ loadingStaffOptions ? "員工載入中…" : "請選擇員工" }}</option>
                <option v-for="staff in modalStaffOptions" :key="staff.staffId" :value="staff.staffId">
                  {{ staff.fullName }}{{ staff.jobTitle ? `｜${staff.jobTitle}` : "" }}
                </option>
              </select>
            </label>

            <div class="form-grid two">
              <label class="field">
                <span>排班日期 <em>*</em></span>
                <input v-model="scheduleForm.shiftDate" type="date" required />
              </label>
              <label class="field">
                <span>班別 <em>*</em></span>
                <select v-model.number="scheduleForm.shiftTemplateId" required>
                  <option :value="0">請選擇班別</option>
                  <option v-for="template in activeTemplates" :key="template.id" :value="template.id">
                    {{ template.templateName }}｜{{ formatTemplateTimes(template) }}
                  </option>
                </select>
              </label>
            </div>

            <div v-if="selectedModalTemplate" class="selected-template-preview">
              <span class="color-dot" :style="{ backgroundColor: selectedModalTemplate.colorHex || '#17334a' }" />
              <div>
                <strong>{{ selectedModalTemplate.templateName }}</strong>
                <p>{{ formatTemplateTimes(selectedModalTemplate) }}</p>
                <small>實際工時 {{ formatWorkMinutes(selectedModalTemplate.workMinutes) }}，休息 {{ selectedModalTemplate.breakMinutes }} 分鐘</small>
              </div>
            </div>

            <label class="field">
              <span>備註</span>
              <textarea v-model.trim="scheduleForm.note" maxlength="500" rows="3" placeholder="例如：代班、會議、教育訓練" />
            </label>

            <p class="conflict-hint">
              系統會跨品牌與跨院所檢查同一員工的時間重疊；分段班的段落空檔可安排其他不衝突工作。
            </p>

            <div class="modal-actions split">
              <button v-if="editingShift" type="button" class="btn danger" @click="removeShift(editingShift)">
                <Icon name="fa6-solid:trash" aria-hidden="true" /> 移除排班
              </button>
              <span v-else />
              <div>
                <button type="button" class="btn ghost" @click="closeScheduleModal">取消</button>
                <button type="submit" class="btn primary" :disabled="savingSchedule">
                  {{ savingSchedule ? "儲存中…" : "儲存排班" }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import api from "~/composables/utils/api";
import { showCustom } from "~/composables/utils/alert";
import { generateShiftSchedulePdf, SHIFT_CALENDAR_STAFFS_PER_PAGE } from "~/composables/utils/shift-schedule-pdf";
import { usePermissionStore } from "~/composables/usePermissionStore";

definePageMeta({
  middleware: ["backoffice-auth", "brand-feature"],
  brandFeature: "ShiftManagement",
});

const { t } = useI18n();
useHead(() => ({ title: t("page.member.shifts") }));

interface StoreOption { id: number; name: string }
interface StaffOption { staffId: number; fullName: string; jobTitle: string | null; email: string; roleName: string | null; isPrimary: boolean }
interface TemplateSegment { id: number; sequenceNo: number; startTime: string; endTime: string; endDayOffset: number; workMinutes: number }
interface ShiftTemplate { id: number; brandId: number; templateCode: string; templateName: string; description: string | null; colorHex: string | null; isMultiSegment: boolean; breakMinutes: number; workMinutes: number; isActive: boolean; createDate: string; segments: TemplateSegment[] }
interface ShiftSegment { id: number; sequenceNo: number; startDateTime: string; endDateTime: string; workMinutes: number }
interface StaffShift { id: number; brandId: number; storeId: number; storeName: string; staffId: number; staffName: string; jobTitle: string | null; shiftTemplateId: number | null; shiftDate: string; shiftName: string; templateCode: string; colorHex: string | null; breakMinutes: number; workMinutes: number; status: string; note: string | null; segments: ShiftSegment[] }
interface ShiftCalendarMarker { id: number; brandId: number; storeId: number; storeName: string; markerDate: string; markerType: "ClosedAllDay" | "BusinessHoursChanged" | "BreakPeriod"; title: string; startTime: string | null; endTime: string | null; note: string | null }
interface SegmentForm { key: number; startTime: string; endTime: string; endNextDay: boolean }
interface BatchStaffRow extends StaffOption { selected: boolean; shiftTemplateId: number }
interface BatchResultItem { staffId: number; staffName: string; shiftTemplateId: number; shiftName: string; shiftDate: string; status: string; shiftId: number | null; reason: string | null }
interface BatchDeleteStaffRow extends StaffOption { selected: boolean }
interface PdfStaffRow extends StaffOption { selected: boolean }
interface BatchDeletePreviewItem { shiftId: number; staffId: number; staffName: string; shiftDate: string; shiftName: string; timeSummary: string; note: string | null; selected: boolean }

const permissionStore = usePermissionStore();
await permissionStore.load();

const activeBrandId = computed(() => permissionStore.brandId ?? 0);
const activeTab = ref<"schedule" | "templates">("schedule");
const stores = ref<StoreOption[]>([]);
const templates = ref<ShiftTemplate[]>([]);
const staffOptions = ref<StaffOption[]>([]);
const modalStaffOptions = ref<StaffOption[]>([]);
const shifts = ref<StaffShift[]>([]);
const markers = ref<ShiftCalendarMarker[]>([]);
const selectedStoreId = ref(0);
const scheduleView = ref<"month" | "week">("month");
const calendarCursor = ref(startOfMonth(new Date()));

const loadingStores = ref(false);
const loadingTemplates = ref(false);
const loadingSchedule = ref(false);
const loadingStaffOptions = ref(false);

const showTemplateModal = ref(false);
const editingTemplate = ref<ShiftTemplate | null>(null);
const savingTemplate = ref(false);
let segmentKey = 1;
const templateForm = reactive({
  templateName: "",
  templateCode: "",
  description: "",
  colorHex: "#4f7c82",
  breakMinutes: 0,
  isActive: true,
  segments: [] as SegmentForm[],
});

const showBatchModal = ref(false);
const savingBatch = ref(false);
const loadingBatchStaff = ref(false);
const batchApplyTemplateId = ref(0);
const batchStaffRows = ref<BatchStaffRow[]>([]);
const batchWeekdayOptions = [
  { value: 0, label: "日" },
  { value: 1, label: "一" },
  { value: 2, label: "二" },
  { value: 3, label: "三" },
  { value: 4, label: "四" },
  { value: 5, label: "五" },
  { value: 6, label: "六" },
];
const batchForm = reactive({
  storeId: 0,
  startDate: toIsoDate(startOfMonth(new Date())),
  endDate: toIsoDate(endOfMonth(new Date())),
  weekdays: [0, 1, 2, 3, 4, 5, 6] as number[],
  skipConflicts: true,
  note: "",
});

const showBatchDeleteModal = ref(false);
const loadingBatchDeleteStaff = ref(false);
const previewingBatchDelete = ref(false);
const deletingBatchDelete = ref(false);
const batchDeleteHasPreview = ref(false);
const batchDeleteStaffRows = ref<BatchDeleteStaffRow[]>([]);
const batchDeletePreviewItems = ref<BatchDeletePreviewItem[]>([]);
const batchDeleteForm = reactive({
  storeId: 0,
  startDate: toIsoDate(startOfMonth(new Date())),
  endDate: toIsoDate(endOfMonth(new Date())),
  weekdays: [0, 1, 2, 3, 4, 5, 6] as number[],
});

const showPdfModal = ref(false);
const loadingPdfStaff = ref(false);
const exportingPdf = ref(false);
const pdfStaffRows = ref<PdfStaffRow[]>([]);
const pdfForm = reactive({
  storeId: 0,
  month: toMonthInput(new Date()),
});

const showMarkerModal = ref(false);
const editingMarker = ref<ShiftCalendarMarker | null>(null);
const savingMarker = ref(false);
const markerForm = reactive({
  storeId: 0,
  markerDate: toIsoDate(new Date()),
  markerType: "ClosedAllDay" as ShiftCalendarMarker["markerType"],
  title: "",
  startTime: "09:00",
  endTime: "18:00",
  note: "",
});

const showScheduleModal = ref(false);
const editingShift = ref<StaffShift | null>(null);
const savingSchedule = ref(false);
const scheduleForm = reactive({
  storeId: 0,
  staffId: 0,
  shiftDate: toIsoDate(new Date()),
  shiftTemplateId: 0,
  note: "",
});

const activeTemplates = computed(() => templates.value.filter((item) => item.isActive));
const markerNeedsTime = computed(() => markerForm.markerType !== "ClosedAllDay");
const markerDefaultTitle = computed(() => ({
  ClosedAllDay: "整天店休",
  BusinessHoursChanged: "營業時間異動",
  BreakPeriod: "特定時段休息",
}[markerForm.markerType]));
const canCreateShift = computed(() => selectedStoreId.value > 0 && staffOptions.value.length > 0 && activeTemplates.value.length > 0);
const batchSelectedRows = computed(() => batchStaffRows.value.filter((row) => row.selected));
const batchSelectedStaffCount = computed(() => batchSelectedRows.value.length);
const allBatchStaffSelected = computed(() => batchStaffRows.value.length > 0 && batchStaffRows.value.every((row) => row.selected));
const batchRangeDayCount = computed(() => {
  const start = parseIsoDate(batchForm.startDate);
  const end = parseIsoDate(batchForm.endDate);
  if (!start || !end || start > end) return 0;
  return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
});
const batchSelectedDates = computed(() => {
  const start = parseIsoDate(batchForm.startDate);
  const end = parseIsoDate(batchForm.endDate);
  if (!start || !end || start > end || batchRangeDayCount.value > 63 || batchForm.weekdays.length === 0) return [] as string[];

  const dates: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    if (batchForm.weekdays.includes(cursor.getDay())) dates.push(toIsoDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
});
const batchRequestedCount = computed(() => batchSelectedStaffCount.value * batchSelectedDates.value.length);
const batchCanSubmit = computed(() =>
  batchForm.storeId > 0 &&
  batchSelectedStaffCount.value > 0 &&
  batchRangeDayCount.value > 0 &&
  batchRangeDayCount.value <= 63 &&
  batchSelectedDates.value.length > 0 &&
  batchRequestedCount.value <= 500 &&
  batchSelectedRows.value.every((row) => row.shiftTemplateId > 0),
);
const selectedBatchDeleteStaffRows = computed(() => batchDeleteStaffRows.value.filter((row) => row.selected));
const allBatchDeleteStaffSelected = computed(() => batchDeleteStaffRows.value.length > 0 && batchDeleteStaffRows.value.every((row) => row.selected));
const selectedBatchDeleteItems = computed(() => batchDeletePreviewItems.value.filter((item) => item.selected));
const selectedBatchDeleteCount = computed(() => selectedBatchDeleteItems.value.length);
const allBatchDeletePreviewSelected = computed(() => batchDeletePreviewItems.value.length > 0 && batchDeletePreviewItems.value.every((item) => item.selected));
const batchDeleteRangeDayCount = computed(() => {
  const start = parseIsoDate(batchDeleteForm.startDate);
  const end = parseIsoDate(batchDeleteForm.endDate);
  if (!start || !end || start > end) return 0;
  return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
});
const batchDeleteCanPreview = computed(() =>
  batchDeleteForm.storeId > 0 &&
  selectedBatchDeleteStaffRows.value.length > 0 &&
  batchDeleteForm.weekdays.length > 0 &&
  batchDeleteRangeDayCount.value > 0 &&
  batchDeleteRangeDayCount.value <= 63,
);
const selectedPdfStaffRows = computed(() => pdfStaffRows.value.filter((row) => row.selected));
const selectedPdfStaffCount = computed(() => selectedPdfStaffRows.value.length);
const selectedPdfStoreName = computed(() => stores.value.find((store) => store.id === pdfForm.storeId)?.name ?? "");
const activeBrandName = computed(() => permissionStore.brands.find((brand) => brand.id === activeBrandId.value)?.name ?? "PetCare");
const estimatedPdfPages = computed(() => selectedPdfStaffCount.value > 0
  ? Math.ceil(selectedPdfStaffCount.value / SHIFT_CALENDAR_STAFFS_PER_PAGE)
  : 0);
const formattedPdfMonth = computed(() => {
  const [year, month] = pdfForm.month.split("-").map(Number);
  return year && month ? `${year} 年 ${month} 月` : "尚未選擇";
});
const canExportPdf = computed(() =>
  pdfForm.storeId > 0 && /^\d{4}-\d{2}$/.test(pdfForm.month) && selectedPdfStaffCount.value > 0,
);
const calendarWeekdays = ["日", "一", "二", "三", "四", "五", "六"];
const weekDays = computed(() => {
  const firstDay = startOfWeek(calendarCursor.value);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(firstDay, index);
    return {
      iso: toIsoDate(date),
      weekday: new Intl.DateTimeFormat("zh-TW", { weekday: "short" }).format(date),
      monthDay: new Intl.DateTimeFormat("zh-TW", { month: "numeric", day: "numeric" }).format(date),
      isToday: toIsoDate(date) === toIsoDate(new Date()),
    };
  });
});
const monthDays = computed(() => {
  // 控制月曆只保留「有包含當月日期」的週。
  // 例如最後一整週全部都是下個月日期時，不再產生那一列空白週。
  const monthFirst = startOfMonth(calendarCursor.value);
  const monthLast = endOfMonth(calendarCursor.value);
  const calendarFirst = startOfCalendarWeek(monthFirst);
  const calendarLast = addDays(startOfCalendarWeek(monthLast), 6);
  const dayCount = Math.round((calendarLast.getTime() - calendarFirst.getTime()) / 86_400_000) + 1;

  return Array.from({ length: dayCount }, (_, index) => {
    const date = addDays(calendarFirst, index);
    return {
      iso: toIsoDate(date),
      dayNumber: date.getDate(),
      monthLabel: `${date.getMonth() + 1}月`,
      isCurrentMonth: date.getMonth() === monthFirst.getMonth() && date.getFullYear() === monthFirst.getFullYear(),
      isToday: toIsoDate(date) === toIsoDate(new Date()),
    };
  });
});
const periodLabel = computed(() => {
  if (scheduleView.value === "month") {
    return new Intl.DateTimeFormat("zh-TW", { year: "numeric", month: "long" }).format(calendarCursor.value);
  }
  return `${weekDays.value[0]?.iso.replaceAll("-", "/")} ～ ${weekDays.value[6]?.iso.replaceAll("-", "/")}`;
});
const scheduleRange = computed(() => {
  if (scheduleView.value === "month") {
    return { from: monthDays.value[0]!.iso, to: monthDays.value.at(-1)!.iso };
  }
  return { from: weekDays.value[0]!.iso, to: weekDays.value[6]!.iso };
});
const selectedModalTemplate = computed(() => templates.value.find((item) => item.id === scheduleForm.shiftTemplateId) ?? null);
const templatePreview = computed(() => {
  const grossMinutes = templateForm.segments.reduce((sum, segment) => sum + segmentMinutes(segment), 0);
  return { grossMinutes, workMinutes: Math.max(0, grossMinutes - Number(templateForm.breakMinutes || 0)) };
});

watch(activeBrandId, async () => {
  selectedStoreId.value = 0;
  await loadInitialData();
});

watch(selectedStoreId, async () => {
  await Promise.all([loadStaffOptions(), loadSchedules(), loadMarkers()]);
});

watch([scheduleView, calendarCursor], async () => {
  await Promise.all([loadSchedules(), loadMarkers()]);
});

onMounted(loadInitialData);

async function loadInitialData() {
  if (!activeBrandId.value) return;
  await Promise.all([loadStores(), loadTemplates()]);
  if (!selectedStoreId.value && stores.value.length > 0) selectedStoreId.value = stores.value[0]!.id;
  await Promise.all([loadStaffOptions(), loadSchedules(), loadMarkers()]);
}

async function loadStores() {
  loadingStores.value = true;
  try {
    const response = await api.get(`/stores/my/brand/${activeBrandId.value}`);
    const raw = response.data?.stores ?? response.data?.Stores ?? [];
    stores.value = raw.map((item: any) => ({ id: Number(item.Id ?? item.id), name: String(item.Name ?? item.name) }));
  } finally {
    loadingStores.value = false;
  }
}

async function loadTemplates() {
  if (!activeBrandId.value) return;
  loadingTemplates.value = true;
  try {
    const response = await api.get(`/shifts/templates/${activeBrandId.value}`);
    templates.value = (response.data?.data ?? []).map(normalizeTemplate);
  } catch (error) {
    templates.value = [];
    await showCustom("載入失敗", getErrorMessage(error, "無法取得班別設定。"), "error");
  } finally {
    loadingTemplates.value = false;
  }
}

async function loadStaffOptions() {
  if (!activeBrandId.value || !selectedStoreId.value) {
    staffOptions.value = [];
    return;
  }
  loadingStaffOptions.value = true;
  try {
    const response = await api.get(`/shifts/staff-options/${activeBrandId.value}?storeId=${selectedStoreId.value}`);
    staffOptions.value = (response.data?.data ?? []).map(normalizeStaff);
  } catch {
    staffOptions.value = [];
  } finally {
    loadingStaffOptions.value = false;
  }
}

async function loadModalStaffOptions() {
  if (!activeBrandId.value || !scheduleForm.storeId) {
    modalStaffOptions.value = [];
    return;
  }
  loadingStaffOptions.value = true;
  try {
    const response = await api.get(`/shifts/staff-options/${activeBrandId.value}?storeId=${scheduleForm.storeId}`);
    modalStaffOptions.value = (response.data?.data ?? []).map(normalizeStaff);
    if (!modalStaffOptions.value.some((staff) => staff.staffId === scheduleForm.staffId)) scheduleForm.staffId = 0;
  } finally {
    loadingStaffOptions.value = false;
  }
}

async function loadSchedules() {
  if (!activeBrandId.value || !selectedStoreId.value) {
    shifts.value = [];
    return;
  }
  loadingSchedule.value = true;
  try {
    const { from, to } = scheduleRange.value;
    const response = await api.get(`/shifts/schedules/${activeBrandId.value}?storeId=${selectedStoreId.value}&from=${from}&to=${to}`);
    shifts.value = (response.data?.data ?? []).map(normalizeShift);
  } catch (error) {
    shifts.value = [];
    await showCustom("載入失敗", getErrorMessage(error, "無法取得排班資料。"), "error");
  } finally {
    loadingSchedule.value = false;
  }
}

async function loadMarkers() {
  if (!activeBrandId.value || !selectedStoreId.value) {
    markers.value = [];
    return;
  }

  try {
    const { from, to } = scheduleRange.value;
    const response = await api.get(`/shifts/markers/${activeBrandId.value}?storeId=${selectedStoreId.value}&from=${from}&to=${to}`);
    markers.value = (response.data?.data ?? []).map(normalizeMarker);
  } catch (error) {
    markers.value = [];
    await showCustom("載入失敗", getErrorMessage(error, "無法取得店休與營業異動標記。"), "error");
  }
}

function openTemplateCreate() {
  editingTemplate.value = null;
  Object.assign(templateForm, {
    templateName: "",
    templateCode: "",
    description: "",
    colorHex: "#4f7c82",
    breakMinutes: 0,
    isActive: true,
    segments: [{ key: segmentKey++, startTime: "09:00", endTime: "18:00", endNextDay: false }],
  });
  showTemplateModal.value = true;
}

function openTemplateEdit(template: ShiftTemplate) {
  editingTemplate.value = template;
  Object.assign(templateForm, {
    templateName: template.templateName,
    templateCode: template.templateCode,
    description: template.description ?? "",
    colorHex: template.colorHex ?? "#4f7c82",
    breakMinutes: template.breakMinutes,
    isActive: template.isActive,
    segments: template.segments.map((segment) => ({
      key: segmentKey++,
      startTime: formatTime(segment.startTime),
      endTime: formatTime(segment.endTime),
      endNextDay: segment.endDayOffset === 1,
    })),
  });
  showTemplateModal.value = true;
}

function closeTemplateModal() {
  showTemplateModal.value = false;
  editingTemplate.value = null;
}

function addSegment() {
  const last = templateForm.segments.at(-1);
  templateForm.segments.push({
    key: segmentKey++,
    startTime: last?.endTime ?? "17:00",
    endTime: "21:00",
    endNextDay: false,
  });
}

function removeSegment(index: number) {
  if (templateForm.segments.length > 1) templateForm.segments.splice(index, 1);
}

async function saveTemplate() {
  if (!activeBrandId.value) return;
  savingTemplate.value = true;
  try {
    const payload = {
      brandId: activeBrandId.value,
      templateName: templateForm.templateName,
      // 編輯時固定送出原始代碼；後端也會再次保護，不接受代碼變更。
      templateCode: editingTemplate.value
        ? editingTemplate.value.templateCode
        : templateForm.templateCode || null,
      description: templateForm.description || null,
      colorHex: templateForm.colorHex,
      breakMinutes: Number(templateForm.breakMinutes || 0),
      isActive: templateForm.isActive,
      segments: templateForm.segments.map((segment) => ({
        startTime: `${segment.startTime}:00`,
        endTime: `${segment.endTime}:00`,
        endDayOffset: segment.endNextDay ? 1 : 0,
      })),
    };

    if (editingTemplate.value) await api.put(`/shifts/templates/${editingTemplate.value.id}`, payload);
    else await api.post("/shifts/templates", payload);

    closeTemplateModal();
    await loadTemplates();
    await showCustom("儲存成功", "班別設定已更新。", "success");
  } catch (error) {
    await showCustom("儲存失敗", getErrorMessage(error, "請確認時段與休息設定。"), "error");
  } finally {
    savingTemplate.value = false;
  }
}

async function removeTemplate(template: ShiftTemplate) {
  const { default: Swal } = await import("sweetalert2");
  const result = await Swal.fire({
    title: `刪除「${template.templateName}」？`,
    text: "既有排班會保留快照，但之後不能再使用此班別新增排班。",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確認刪除",
    cancelButtonText: "取消",
    confirmButtonColor: "#c0392b",
  });
  if (!result.isConfirmed) return;

  try {
    await api.delete(`/shifts/templates/${template.id}?brandId=${activeBrandId.value}`);
    await loadTemplates();
    await showCustom("刪除成功", "班別已停止使用。", "success");
  } catch (error) {
    await showCustom("刪除失敗", getErrorMessage(error, "無法刪除此班別。"), "error");
  }
}

async function openPdfExport() {
  pdfForm.storeId = selectedStoreId.value;
  pdfForm.month = toMonthInput(calendarCursor.value);
  showPdfModal.value = true;
  await loadPdfStaffRows();
}

function closePdfExport() {
  if (exportingPdf.value) return;
  showPdfModal.value = false;
  pdfStaffRows.value = [];
}

async function loadPdfStaffRows() {
  if (!activeBrandId.value || !pdfForm.storeId) {
    pdfStaffRows.value = [];
    return;
  }

  loadingPdfStaff.value = true;
  try {
    const response = await api.get(`/shifts/staff-options/${activeBrandId.value}?storeId=${pdfForm.storeId}`);
    pdfStaffRows.value = (response.data?.data ?? [])
      .map((item: any) => ({ ...normalizeStaff(item), selected: true }))
      .sort((left: PdfStaffRow, right: PdfStaffRow) => left.fullName.localeCompare(right.fullName, "zh-TW"));
  } catch (error) {
    pdfStaffRows.value = [];
    await showCustom("載入失敗", getErrorMessage(error, "無法取得 PDF 員工清單。"), "error");
  } finally {
    loadingPdfStaff.value = false;
  }
}

function selectAllPdfStaff() {
  pdfStaffRows.value.forEach((row) => { row.selected = true; });
}

function clearAllPdfStaff() {
  pdfStaffRows.value.forEach((row) => { row.selected = false; });
}

async function exportSchedulePdf() {
  if (!canExportPdf.value) return;

  const [year, month] = pdfForm.month.split("-").map(Number);
  if (!year || !month) {
    await showCustom("月份不正確", "請重新選擇要匯出的月份。", "warning");
    return;
  }

  exportingPdf.value = true;
  try {
    const firstDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const lastDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    const [scheduleResponse, markerResponse] = await Promise.all([
      api.get(`/shifts/schedules/${activeBrandId.value}?storeId=${pdfForm.storeId}&from=${firstDate}&to=${lastDate}`),
      api.get(`/shifts/markers/${activeBrandId.value}?storeId=${pdfForm.storeId}&from=${firstDate}&to=${lastDate}`),
    ]);
    const selectedIds = new Set(selectedPdfStaffRows.value.map((row) => row.staffId));
    const pdfSchedules = (scheduleResponse.data?.data ?? [])
      .map(normalizeShift)
      .filter((shift: StaffShift) => selectedIds.has(shift.staffId));
    const pdfMarkers = (markerResponse.data?.data ?? []).map(normalizeMarker);

    await generateShiftSchedulePdf({
      brandName: activeBrandName.value,
      storeName: selectedPdfStoreName.value,
      year,
      month,
      staffs: selectedPdfStaffRows.value.map((row) => ({
        staffId: row.staffId,
        fullName: row.fullName,
        jobTitle: row.jobTitle || row.roleName,
      })),
      schedules: pdfSchedules.map((shift: StaffShift) => ({
        staffId: shift.staffId,
        shiftDate: shift.shiftDate,
        shiftName: shift.shiftName,
        colorHex: shift.colorHex,
        segments: shift.segments.map((segment) => ({
          startDateTime: segment.startDateTime,
          endDateTime: segment.endDateTime,
        })),
      })),
      markers: pdfMarkers.map((marker: ShiftCalendarMarker) => ({
        markerDate: marker.markerDate,
        markerType: marker.markerType,
        title: marker.title,
        startTime: marker.startTime,
        endTime: marker.endTime,
      })),
    });

    showPdfModal.value = false;
    pdfStaffRows.value = [];
    await showCustom("PDF 已產生", `${formattedPdfMonth.value}班表已開始下載。`, "success");
  } catch (error) {
    await showCustom("PDF 產生失敗", getErrorMessage(error, "請稍後再試一次。"), "error");
  } finally {
    exportingPdf.value = false;
  }
}

async function openBatchDelete() {
  const baseMonth = scheduleView.value === "month" ? calendarCursor.value : new Date();
  Object.assign(batchDeleteForm, {
    storeId: selectedStoreId.value,
    startDate: toIsoDate(startOfMonth(baseMonth)),
    endDate: toIsoDate(endOfMonth(baseMonth)),
    weekdays: [0, 1, 2, 3, 4, 5, 6],
  });
  clearBatchDeletePreview();
  showBatchDeleteModal.value = true;
  await loadBatchDeleteStaffRows();
}

function closeBatchDelete() {
  showBatchDeleteModal.value = false;
  batchDeleteStaffRows.value = [];
  clearBatchDeletePreview();
}

function clearBatchDeletePreview() {
  batchDeleteHasPreview.value = false;
  batchDeletePreviewItems.value = [];
}

async function loadBatchDeleteStaffRows() {
  clearBatchDeletePreview();
  if (!activeBrandId.value || !batchDeleteForm.storeId) {
    batchDeleteStaffRows.value = [];
    return;
  }

  loadingBatchDeleteStaff.value = true;
  try {
    const response = await api.get(`/shifts/staff-options/${activeBrandId.value}?storeId=${batchDeleteForm.storeId}`);
    batchDeleteStaffRows.value = (response.data?.data ?? []).map((item: any) => ({
      ...normalizeStaff(item),
      selected: false,
    }));
  } catch (error) {
    batchDeleteStaffRows.value = [];
    await showCustom("載入失敗", getErrorMessage(error, "無法取得可選員工。"), "error");
  } finally {
    loadingBatchDeleteStaff.value = false;
  }
}

function setBatchDeletePreset(monthOffset: number, mode: "all" | "weekdays") {
  const today = new Date();
  const targetMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  batchDeleteForm.startDate = toIsoDate(startOfMonth(targetMonth));
  batchDeleteForm.endDate = toIsoDate(endOfMonth(targetMonth));
  batchDeleteForm.weekdays = mode === "weekdays" ? [1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5, 6];
  clearBatchDeletePreview();
}

function toggleAllBatchDeleteStaff() {
  const nextSelected = !allBatchDeleteStaffSelected.value;
  batchDeleteStaffRows.value.forEach((row) => { row.selected = nextSelected; });
  clearBatchDeletePreview();
}

function toggleAllBatchDeletePreview() {
  const nextSelected = !allBatchDeletePreviewSelected.value;
  batchDeletePreviewItems.value.forEach((item) => { item.selected = nextSelected; });
}

async function previewBatchDelete() {
  if (!batchDeleteCanPreview.value) return;
  previewingBatchDelete.value = true;
  try {
    const response = await api.post("/shifts/schedules/batch-delete/preview", {
      brandId: activeBrandId.value,
      storeId: batchDeleteForm.storeId,
      startDate: batchDeleteForm.startDate,
      endDate: batchDeleteForm.endDate,
      weekdays: [...batchDeleteForm.weekdays].sort((left, right) => left - right),
      staffIds: selectedBatchDeleteStaffRows.value.map((row) => row.staffId),
    });

    const raw = response.data?.data?.items ?? response.data?.data?.Items ?? [];
    batchDeletePreviewItems.value = raw.map((item: any) => ({
      shiftId: Number(item.shiftId ?? item.ShiftId),
      staffId: Number(item.staffId ?? item.StaffId),
      staffName: String(item.staffName ?? item.StaffName ?? ""),
      shiftDate: String(item.shiftDate ?? item.ShiftDate ?? "").slice(0, 10),
      shiftName: String(item.shiftName ?? item.ShiftName ?? ""),
      timeSummary: String(item.timeSummary ?? item.TimeSummary ?? ""),
      note: item.note ?? item.Note ?? null,
      selected: true,
    }));
    batchDeleteHasPreview.value = true;
  } catch (error) {
    clearBatchDeletePreview();
    await showCustom("預覽失敗", getErrorMessage(error, "無法取得符合條件的排班。"), "error");
  } finally {
    previewingBatchDelete.value = false;
  }
}

async function executeBatchDelete() {
  if (selectedBatchDeleteCount.value === 0) return;

  const { default: Swal } = await import("sweetalert2");
  const result = await Swal.fire({
    title: `確定移除 ${selectedBatchDeleteCount.value} 筆排班？`,
    text: `院所：${stores.value.find((store) => store.id === batchDeleteForm.storeId)?.name ?? "目前院所"}
日期：${batchDeleteForm.startDate} ～ ${batchDeleteForm.endDate}
此操作會將所選排班標記為取消。`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `確認移除 ${selectedBatchDeleteCount.value} 筆`,
    cancelButtonText: "取消",
    confirmButtonColor: "#b9382f",
    reverseButtons: true,
  });
  if (!result.isConfirmed) return;

  deletingBatchDelete.value = true;
  try {
    const response = await api.post("/shifts/schedules/batch-delete", {
      brandId: activeBrandId.value,
      storeId: batchDeleteForm.storeId,
      shiftIds: selectedBatchDeleteItems.value.map((item) => item.shiftId),
    });
    const deletedCount = Number(response.data?.data?.deletedCount ?? response.data?.data?.DeletedCount ?? selectedBatchDeleteCount.value);
    selectedStoreId.value = batchDeleteForm.storeId;
    closeBatchDelete();
    await loadSchedules();
    await showCustom("批次移除完成", `已移除 ${deletedCount} 筆排班。`, "success");
  } catch (error) {
    await showCustom("批次移除失敗", getErrorMessage(error, "排班可能已被其他人修改，請重新預覽。"), "error");
  } finally {
    deletingBatchDelete.value = false;
  }
}

async function openBatchSchedule() {
  const baseMonth = scheduleView.value === "month" ? calendarCursor.value : new Date();
  Object.assign(batchForm, {
    storeId: selectedStoreId.value,
    startDate: toIsoDate(startOfMonth(baseMonth)),
    endDate: toIsoDate(endOfMonth(baseMonth)),
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    skipConflicts: true,
    note: "",
  });
  batchApplyTemplateId.value = activeTemplates.value[0]?.id ?? 0;
  showBatchModal.value = true;
  await loadBatchStaffRows();
}

function closeBatchModal() {
  showBatchModal.value = false;
  batchStaffRows.value = [];
  batchApplyTemplateId.value = 0;
}

async function loadBatchStaffRows() {
  if (!activeBrandId.value || !batchForm.storeId) {
    batchStaffRows.value = [];
    return;
  }

  loadingBatchStaff.value = true;
  try {
    const response = await api.get(`/shifts/staff-options/${activeBrandId.value}?storeId=${batchForm.storeId}`);
    const defaultTemplateId = batchApplyTemplateId.value || activeTemplates.value[0]?.id || 0;
    batchStaffRows.value = (response.data?.data ?? []).map((item: any) => ({
      ...normalizeStaff(item),
      selected: false,
      shiftTemplateId: defaultTemplateId,
    }));
  } catch (error) {
    batchStaffRows.value = [];
    await showCustom("載入失敗", getErrorMessage(error, "無法取得可排班員工。"), "error");
  } finally {
    loadingBatchStaff.value = false;
  }
}

function setBatchPreset(monthOffset: number, mode: "all" | "weekdays") {
  const today = new Date();
  const targetMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  batchForm.startDate = toIsoDate(startOfMonth(targetMonth));
  batchForm.endDate = toIsoDate(endOfMonth(targetMonth));
  batchForm.weekdays = mode === "weekdays" ? [1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5, 6];
}

function toggleAllBatchStaff() {
  const nextSelected = !allBatchStaffSelected.value;
  const defaultTemplateId = batchApplyTemplateId.value || activeTemplates.value[0]?.id || 0;
  batchStaffRows.value.forEach((row) => {
    row.selected = nextSelected;
    if (nextSelected && !row.shiftTemplateId) row.shiftTemplateId = defaultTemplateId;
  });
}

function applyTemplateToSelectedStaff() {
  if (!batchApplyTemplateId.value) return;
  batchSelectedRows.value.forEach((row) => {
    row.shiftTemplateId = batchApplyTemplateId.value;
  });
}

async function saveBatchSchedule() {
  if (!batchCanSubmit.value) return;
  savingBatch.value = true;
  try {
    const payload = {
      brandId: activeBrandId.value,
      storeId: batchForm.storeId,
      startDate: batchForm.startDate,
      endDate: batchForm.endDate,
      weekdays: [...batchForm.weekdays].sort((left, right) => left - right),
      assignments: batchSelectedRows.value.map((row) => ({
        staffId: row.staffId,
        shiftTemplateId: row.shiftTemplateId,
      })),
      skipConflicts: batchForm.skipConflicts,
      note: batchForm.note || null,
    };

    const response = await api.post("/shifts/schedules/batch", payload);
    const data = response.data?.data ?? response.data?.Data ?? {};
    const createdCount = Number(data.createdCount ?? data.CreatedCount ?? 0);
    const skippedCount = Number(data.skippedCount ?? data.SkippedCount ?? 0);
    const rawResults = data.results ?? data.Results ?? [];
    const results: BatchResultItem[] = rawResults.map((item: any) => ({
      staffId: Number(item.staffId ?? item.StaffId),
      staffName: String(item.staffName ?? item.StaffName ?? ""),
      shiftTemplateId: Number(item.shiftTemplateId ?? item.ShiftTemplateId),
      shiftName: String(item.shiftName ?? item.ShiftName ?? ""),
      shiftDate: String(item.shiftDate ?? item.ShiftDate ?? "").slice(0, 10),
      status: String(item.status ?? item.Status ?? ""),
      shiftId: Number(item.shiftId ?? item.ShiftId ?? 0) || null,
      reason: item.reason ?? item.Reason ?? null,
    }));

    const firstDate = parseIsoDate(batchForm.startDate);
    selectedStoreId.value = batchForm.storeId;
    scheduleView.value = "month";
    if (firstDate) calendarCursor.value = startOfMonth(firstDate);
    closeBatchModal();
    await loadSchedules();

    if (skippedCount > 0) {
      const skippedPreview = results
        .filter((item) => item.status.toLowerCase() === "skipped")
        .slice(0, 5)
        .map((item) => `${item.shiftDate} ${item.staffName}`)
        .join("、");
      const suffix = skippedCount > 5 ? `，另有 ${skippedCount - 5} 筆` : "";
      await showCustom(
        "批次排班完成",
        `成功建立 ${createdCount} 筆，略過 ${skippedCount} 筆衝突排班。${skippedPreview ? `
略過：${skippedPreview}${suffix}` : ""}`,
        "warning",
      );
    } else {
      await showCustom("批次排班完成", `已成功建立 ${createdCount} 筆排班。`, "success");
    }
  } catch (error) {
    await showCustom("批次排班失敗", getErrorMessage(error, "請確認日期、員工與班別設定。"), "error");
  } finally {
    savingBatch.value = false;
  }
}

function openMarkerCreate(markerDate = "") {
  if (!selectedStoreId.value) return;

  const today = toIsoDate(new Date());
  const defaultDate = markerDate || (
    today >= scheduleRange.value.from && today <= scheduleRange.value.to
      ? today
      : scheduleView.value === "month"
        ? toIsoDate(startOfMonth(calendarCursor.value))
        : weekDays.value[0]?.iso || today
  );

  editingMarker.value = null;
  Object.assign(markerForm, {
    storeId: selectedStoreId.value,
    markerDate: defaultDate,
    markerType: "ClosedAllDay",
    title: "",
    startTime: "09:00",
    endTime: "18:00",
    note: "",
  });
  showMarkerModal.value = true;
}

function openMarkerEdit(marker: ShiftCalendarMarker) {
  editingMarker.value = marker;
  Object.assign(markerForm, {
    storeId: marker.storeId,
    markerDate: marker.markerDate,
    markerType: marker.markerType,
    title: marker.title,
    startTime: marker.startTime ? marker.startTime.slice(0, 5) : "09:00",
    endTime: marker.endTime ? marker.endTime.slice(0, 5) : "18:00",
    note: marker.note || "",
  });
  showMarkerModal.value = true;
}

function closeMarkerModal() {
  showMarkerModal.value = false;
  editingMarker.value = null;
}

function applyMarkerTypeDefaults() {
  if (markerForm.markerType === "ClosedAllDay") {
    markerForm.startTime = "09:00";
    markerForm.endTime = "18:00";
    return;
  }

  if (!markerForm.startTime) markerForm.startTime = "09:00";
  if (!markerForm.endTime) markerForm.endTime = "18:00";
}

async function saveMarker() {
  if (!activeBrandId.value || !markerForm.storeId) return;
  savingMarker.value = true;
  try {
    const payload = {
      brandId: activeBrandId.value,
      storeId: markerForm.storeId,
      markerDate: markerForm.markerDate,
      markerType: markerForm.markerType,
      title: markerForm.title || null,
      startTime: markerNeedsTime.value ? `${markerForm.startTime}:00` : null,
      endTime: markerNeedsTime.value ? `${markerForm.endTime}:00` : null,
      note: markerForm.note || null,
    };

    if (editingMarker.value) await api.put(`/shifts/markers/${editingMarker.value.id}`, payload);
    else await api.post("/shifts/markers", payload);

    closeMarkerModal();
    await loadMarkers();
    await showCustom("儲存成功", "店休／營業異動已顯示在班表日期上。", "success");
  } catch (error) {
    await showCustom("儲存失敗", getErrorMessage(error, "無法儲存班表標記。"), "error");
  } finally {
    savingMarker.value = false;
  }
}

async function removeMarker(marker: ShiftCalendarMarker) {
  const { default: Swal } = await import("sweetalert2");
  const result = await Swal.fire({
    title: `移除 ${marker.markerDate} 的標記？`,
    text: marker.title,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確認移除",
    cancelButtonText: "取消",
    confirmButtonColor: "#c0392b",
  });
  if (!result.isConfirmed) return;

  try {
    await api.delete(`/shifts/markers/${marker.id}?brandId=${activeBrandId.value}`);
    closeMarkerModal();
    await loadMarkers();
    await showCustom("移除成功", "班表標記已移除。", "success");
  } catch (error) {
    await showCustom("移除失敗", getErrorMessage(error, "無法移除此標記。"), "error");
  }
}

async function openScheduleCreate(staffId = 0, shiftDate = "") {
  editingShift.value = null;
  Object.assign(scheduleForm, {
    storeId: selectedStoreId.value,
    staffId,
    shiftDate: shiftDate || toIsoDate(new Date()),
    shiftTemplateId: activeTemplates.value[0]?.id ?? 0,
    note: "",
  });
  await loadModalStaffOptions();
  if (staffId && modalStaffOptions.value.some((staff) => staff.staffId === staffId)) scheduleForm.staffId = staffId;
  showScheduleModal.value = true;
}

async function openScheduleEdit(shift: StaffShift) {
  editingShift.value = shift;
  Object.assign(scheduleForm, {
    storeId: shift.storeId,
    staffId: shift.staffId,
    shiftDate: shift.shiftDate,
    shiftTemplateId: shift.shiftTemplateId ?? 0,
    note: shift.note ?? "",
  });
  await loadModalStaffOptions();
  scheduleForm.staffId = shift.staffId;
  showScheduleModal.value = true;
}

function closeScheduleModal() {
  showScheduleModal.value = false;
  editingShift.value = null;
}

async function saveSchedule() {
  if (!activeBrandId.value) return;
  savingSchedule.value = true;
  try {
    const payload = {
      brandId: activeBrandId.value,
      storeId: scheduleForm.storeId,
      staffId: scheduleForm.staffId,
      shiftTemplateId: scheduleForm.shiftTemplateId,
      shiftDate: scheduleForm.shiftDate,
      note: scheduleForm.note || null,
    };

    if (editingShift.value) await api.put(`/shifts/schedules/${editingShift.value.id}`, payload);
    else await api.post("/shifts/schedules", payload);

    closeScheduleModal();
    if (selectedStoreId.value !== payload.storeId) selectedStoreId.value = payload.storeId;
    await loadSchedules();
    await showCustom("儲存成功", "員工排班已更新。", "success");
  } catch (error) {
    await showCustom("儲存失敗", getErrorMessage(error, "請確認員工、院所與班別時間。"), "error");
  } finally {
    savingSchedule.value = false;
  }
}

async function removeShift(shift: StaffShift) {
  const { default: Swal } = await import("sweetalert2");
  const result = await Swal.fire({
    title: `移除 ${shift.staffName} 的排班？`,
    text: `${shift.shiftDate}｜${shift.shiftName}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確認移除",
    cancelButtonText: "取消",
    confirmButtonColor: "#c0392b",
  });
  if (!result.isConfirmed) return;

  try {
    await api.delete(`/shifts/schedules/${shift.id}?brandId=${activeBrandId.value}`);
    closeScheduleModal();
    await loadSchedules();
    await showCustom("移除成功", "排班已移除。", "success");
  } catch (error) {
    await showCustom("移除失敗", getErrorMessage(error, "無法移除此排班。"), "error");
  }
}

function getCellShifts(staffId: number, date: string) {
  return shifts.value.filter((shift) => shift.staffId === staffId && shift.shiftDate === date);
}
function getDateShifts(date: string) {
  return shifts.value
    .filter((shift) => shift.shiftDate === date)
    .sort((left, right) => left.staffName.localeCompare(right.staffName, "zh-TW"));
}
function getDateMarker(date: string) {
  return markers.value.find((marker) => marker.markerDate === date) ?? null;
}
function formatMarkerTime(marker: ShiftCalendarMarker) {
  if (marker.markerType === "ClosedAllDay" || !marker.startTime || !marker.endTime) return "";
  return `${marker.startTime.slice(0, 5)}～${marker.endTime.slice(0, 5)}`;
}
function markerClass(marker: ShiftCalendarMarker) {
  return {
    "marker-closed": marker.markerType === "ClosedAllDay",
    "marker-hours": marker.markerType === "BusinessHoursChanged",
    "marker-break": marker.markerType === "BreakPeriod",
  };
}
function setScheduleView(view: "month" | "week") {
  scheduleView.value = view;

  // 切換檢視時回到今天所屬的月份或週次，避免沿用先前瀏覽過的日期。
  const today = new Date();
  calendarCursor.value = view === "month"
    ? startOfMonth(today)
    : startOfWeek(today);
}
function movePeriod(step: number) {
  if (scheduleView.value === "month") {
    calendarCursor.value = new Date(calendarCursor.value.getFullYear(), calendarCursor.value.getMonth() + step, 1);
    return;
  }
  calendarCursor.value = addDays(startOfWeek(calendarCursor.value), step * 7);
}
function goCurrentPeriod() {
  calendarCursor.value = scheduleView.value === "month" ? startOfMonth(new Date()) : startOfWeek(new Date());
}
function startOfMonth(date: Date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function endOfMonth(date: Date) { return new Date(date.getFullYear(), date.getMonth() + 1, 0); }
function parseIsoDate(value: string) { const parts = value.split("-").map(Number); if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return null; return new Date(parts[0]!, parts[1]! - 1, parts[2]!); }
function startOfCalendarWeek(date: Date) { const result = new Date(date.getFullYear(), date.getMonth(), date.getDate()); result.setDate(result.getDate() - result.getDay()); return result; }
function startOfWeek(date: Date) { const result = new Date(date.getFullYear(), date.getMonth(), date.getDate()); const day = result.getDay() || 7; result.setDate(result.getDate() - day + 1); return result; }
function addDays(date: Date, days: number) { const result = new Date(date); result.setDate(result.getDate() + days); return result; }
function toIsoDate(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function toMonthInput(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function formatTime(value: string) { return String(value || "").slice(0, 5); }
function formatWorkMinutes(minutes: number) { const safe = Math.max(0, Number(minutes || 0)); const hours = Math.floor(safe / 60); const rest = safe % 60; return rest ? `${hours} 小時 ${rest} 分` : `${hours} 小時`; }
function formatTemplateTimes(template: ShiftTemplate) { return template.segments.map((segment) => `${formatTime(segment.startTime)}～${formatTime(segment.endTime)}${segment.endDayOffset ? "翌日" : ""}`).join("、"); }
function formatShiftSegments(shift: StaffShift) { return shift.segments.map((segment) => `${new Date(segment.startDateTime).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false })}～${new Date(segment.endDateTime).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false })}`).join("、"); }
function segmentMinutes(segment: SegmentForm) { const [sh, sm] = segment.startTime.split(":").map(Number); const [eh, em] = segment.endTime.split(":").map(Number); let end = eh * 60 + em + (segment.endNextDay ? 1440 : 0); const start = sh * 60 + sm; return Math.max(0, end - start); }
function shiftCardStyle(shift: StaffShift) { const color = shift.colorHex || "#4f7c82"; return { borderLeftColor: color, backgroundColor: `${color}18` }; }

function normalizeTemplate(item: any): ShiftTemplate {
  const segments = item.Segments ?? item.segments ?? [];
  return {
    id: Number(item.Id ?? item.id), brandId: Number(item.BrandId ?? item.brandId),
    templateCode: String(item.TemplateCode ?? item.templateCode ?? ""), templateName: String(item.TemplateName ?? item.templateName ?? ""),
    description: item.Description ?? item.description ?? null, colorHex: item.ColorHex ?? item.colorHex ?? null,
    isMultiSegment: Boolean(item.IsMultiSegment ?? item.isMultiSegment), breakMinutes: Number(item.BreakMinutes ?? item.breakMinutes ?? 0),
    workMinutes: Number(item.WorkMinutes ?? item.workMinutes ?? 0), isActive: Boolean(item.IsActive ?? item.isActive),
    createDate: String(item.CreateDate ?? item.createDate ?? ""),
    segments: segments.map((segment: any) => ({
      id: Number(segment.Id ?? segment.id ?? 0), sequenceNo: Number(segment.SequenceNo ?? segment.sequenceNo),
      startTime: String(segment.StartTime ?? segment.startTime), endTime: String(segment.EndTime ?? segment.endTime),
      endDayOffset: Number(segment.EndDayOffset ?? segment.endDayOffset ?? 0), workMinutes: Number(segment.WorkMinutes ?? segment.workMinutes ?? 0),
    })),
  };
}

function normalizeStaff(item: any): StaffOption {
  return { staffId: Number(item.StaffId ?? item.staffId), fullName: String(item.FullName ?? item.fullName), jobTitle: item.JobTitle ?? item.jobTitle ?? null, email: String(item.Email ?? item.email ?? ""), roleName: item.RoleName ?? item.roleName ?? null, isPrimary: Boolean(item.IsPrimary ?? item.isPrimary) };
}

function normalizeMarker(item: any): ShiftCalendarMarker {
  return {
    id: Number(item.Id ?? item.id),
    brandId: Number(item.BrandId ?? item.brandId),
    storeId: Number(item.StoreId ?? item.storeId),
    storeName: String(item.StoreName ?? item.storeName ?? ""),
    markerDate: String(item.MarkerDate ?? item.markerDate).slice(0, 10),
    markerType: String(item.MarkerType ?? item.markerType) as ShiftCalendarMarker["markerType"],
    title: String(item.Title ?? item.title ?? ""),
    startTime: item.StartTime ?? item.startTime ?? null,
    endTime: item.EndTime ?? item.endTime ?? null,
    note: item.Note ?? item.note ?? null,
  };
}

function normalizeShift(item: any): StaffShift {
  const segments = item.Segments ?? item.segments ?? [];
  return {
    id: Number(item.Id ?? item.id), brandId: Number(item.BrandId ?? item.brandId), storeId: Number(item.StoreId ?? item.storeId),
    storeName: String(item.StoreName ?? item.storeName ?? ""), staffId: Number(item.StaffId ?? item.staffId), staffName: String(item.StaffName ?? item.staffName ?? ""),
    jobTitle: item.JobTitle ?? item.jobTitle ?? null, shiftTemplateId: Number(item.ShiftTemplateId ?? item.shiftTemplateId ?? 0) || null,
    shiftDate: String(item.ShiftDate ?? item.shiftDate).slice(0, 10), shiftName: String(item.ShiftName ?? item.shiftName ?? ""), templateCode: String(item.TemplateCode ?? item.templateCode ?? ""),
    colorHex: item.ColorHex ?? item.colorHex ?? null, breakMinutes: Number(item.BreakMinutes ?? item.breakMinutes ?? 0), workMinutes: Number(item.WorkMinutes ?? item.workMinutes ?? 0),
    status: String(item.Status ?? item.status ?? "Scheduled"), note: item.Note ?? item.note ?? null,
    segments: segments.map((segment: any) => ({ id: Number(segment.Id ?? segment.id), sequenceNo: Number(segment.SequenceNo ?? segment.sequenceNo), startDateTime: String(segment.StartDateTime ?? segment.startDateTime), endDateTime: String(segment.EndDateTime ?? segment.endDateTime), workMinutes: Number(segment.WorkMinutes ?? segment.workMinutes ?? 0) })),
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  const response = (error as any)?.response?.data;
  return response?.detail ?? response?.message ?? response?.Message ?? fallback;
}
</script>

<style scoped>
/* SweetAlert2 二次確認必須高於 Teleport Modal 遮罩。 */
:global(.swal2-container) { z-index: 3000 !important; }
.shift-page { display: grid; gap: 1.25rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; flex-wrap: wrap; }
.kicker, .modal-kicker { margin: 0 0 .3rem; color: #b58b49; font-size: .72rem; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; }
h1 { margin: 0; color: #17334a; font-size: clamp(1.55rem, 3vw, 2rem); }
.page-desc { margin: .4rem 0 0; color: #6b7882; font-size: .92rem; }
.header-actions, .toolbar, .period-control, .toolbar-summary { display: flex; align-items: center; gap: .65rem; flex-wrap: wrap; }
.btn { min-height: 2.5rem; border: 1px solid transparent; border-radius: 8px; padding: 0 1rem; font: inherit; font-size: .88rem; font-weight: 900; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: .4rem; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn.primary { color: #fff; background: #17334a; }
.btn.ghost { color: #17334a; background: #fff; border-color: #dbe4ea; }
.btn.ghost.active { background: #edf4f8; border-color: #9fb7c5; }
.btn.danger { color: #b9382f; background: #fff; border-color: #efc8c4; }
.btn.small { min-height: 2rem; padding: 0 .7rem; font-size: .8rem; }
.icon-btn { width: 2.4rem; height: 2.4rem; border: 1px solid #dbe4ea; border-radius: 8px; background: #fff; color: #17334a; cursor: pointer; display: inline-grid; place-items: center; }
.workspace { background: #fff; border: 1px solid #dfe7ec; border-radius: 12px; overflow: hidden; }
.toolbar { justify-content: space-between; padding: 1rem; border-bottom: 1px solid #e6ecef; background: #fbfcfd; }
.control { display: grid; gap: .25rem; color: #17334a; font-size: .78rem; font-weight: 900; }
.control select { min-width: min(16rem, 70vw); min-height: 2.4rem; border: 1px solid #d8e2e8; border-radius: 7px; padding: 0 .7rem; background: #fff; }
.period-control strong { color: #17334a; font-size: .9rem; min-width: 10rem; text-align: center; }
.view-switch { display: inline-flex; border: 1px solid #d8e2e8; border-radius: 8px; overflow: hidden; background: #fff; }
.view-switch-btn { min-height: 2.4rem; border: 0; border-right: 1px solid #d8e2e8; padding: 0 .75rem; background: #fff; color: #61727d; font: inherit; font-size: .8rem; font-weight: 900; cursor: pointer; display: inline-flex; align-items: center; gap: .35rem; }
.view-switch-btn:last-child { border-right: 0; }
.view-switch-btn.active { background: #17334a; color: #fff; }
.toolbar-summary { color: #6b7882; font-size: .82rem; }
.state-card { padding: 4rem 1rem; text-align: center; color: #6b7882; }
.month-board-wrap { overflow-x: auto; }
.month-board { display: grid; grid-template-columns: repeat(7, minmax(9.5rem, 1fr)); min-width: 68rem; }
.month-weekday { min-height: 2.7rem; display: grid; place-items: center; border-right: 1px solid #e8edef; border-bottom: 1px solid #e8edef; background: #f7f9fa; color: #667681; font-size: .78rem; font-weight: 900; }
.month-day { min-height: 11.5rem; padding: .45rem; border-right: 1px solid #e8edef; border-bottom: 1px solid #e8edef; background: #fff; display: flex; flex-direction: column; gap: .35rem; }
.month-day.outside { background: #f8fafb; }
.month-day.today { box-shadow: inset 0 0 0 2px #d5a95f; }
.month-day-header { min-height: 1.8rem; display: flex; align-items: center; justify-content: space-between; gap: .35rem; }
.month-date { width: 1.8rem; height: 1.8rem; border: 0; border-radius: 50%; background: transparent; color: #17334a; font: inherit; font-size: .82rem; font-weight: 900; cursor: pointer; }
.month-day.today .month-date { background: #17334a; color: #fff; }
.month-day.outside .month-date { color: #9aa6ad; }
.month-day-header span { color: #b06d25; font-size: .68rem; font-weight: 900; }
.month-day-header small { color: #9aa6ad; font-size: .65rem; }
.calendar-marker, .week-marker { width: 100%; border: 1px solid transparent; border-radius: 6px; padding: .32rem .42rem; font: inherit; text-align: left; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: .35rem; }
.calendar-marker strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .7rem; }
.calendar-marker span { flex: none; font-size: .62rem; font-weight: 900; }
.marker-closed { color: #a6332b; background: #fff0ee; border-color: #efc4bf; }
.marker-hours { color: #815a12; background: #fff7df; border-color: #ead59b; }
.marker-break { color: #276278; background: #edf7fb; border-color: #badce8; }
.month-shift-list { flex: 1; min-height: 0; overflow-y: auto; display: grid; align-content: start; gap: .3rem; scrollbar-width: thin; }
.month-shift-card { width: 100%; border: 0; border-left: 4px solid #4f7c82; border-radius: 6px; padding: .4rem .45rem; text-align: left; color: #17334a; cursor: pointer; display: grid; gap: .12rem; }
.month-shift-card strong { font-size: .75rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.month-shift-card span { color: #52636e; font-size: .66rem; line-height: 1.3; }
.month-add { min-height: 1.75rem; border: 1px dashed #cbd8df; border-radius: 6px; background: transparent; color: #7f8f99; font: inherit; font-size: .68rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: .25rem; opacity: 0; }
.month-day:hover .month-add, .month-add:focus { opacity: 1; }
.week-board-wrap { overflow-x: auto; }
.week-board { display: grid; grid-template-columns: minmax(11rem, 1.2fr) repeat(7, minmax(9rem, 1fr)); min-width: 78rem; }
.week-head, .staff-cell, .day-cell { border-right: 1px solid #e8edef; border-bottom: 1px solid #e8edef; }
.week-head { min-height: 5.2rem; padding: .55rem; background: #f7f9fa; display: grid; place-items: center; align-content: center; gap: .2rem; color: #64737d; font-size: .75rem; }
.week-marker { padding: .22rem .3rem; justify-content: center; flex-wrap: wrap; text-align: center; font-size: .62rem; font-weight: 900; line-height: 1.2; }
.week-marker small { font-size: .58rem; }
.week-head strong { color: #17334a; font-size: .95rem; }
.week-head.today { background: #fff6e7; }
.sticky-name { position: sticky; left: 0; z-index: 2; box-shadow: 5px 0 10px rgba(25, 50, 67, .04); }
.week-head.sticky-name { z-index: 3; color: #17334a; font-weight: 900; }
.staff-cell { min-height: 8rem; padding: .8rem; background: #fff; display: flex; align-items: flex-start; gap: .65rem; }
.staff-cell .avatar { width: 2.2rem; height: 2.2rem; border-radius: 50%; background: #edf4f8; color: #17334a; display: grid; place-items: center; font-weight: 900; flex: none; }
.staff-cell strong { display: block; color: #17334a; }
.staff-cell small { color: #7a8790; }
.day-cell { min-height: 8rem; padding: .45rem; background: #fff; display: grid; align-content: start; gap: .4rem; }
.shift-card { width: 100%; border: 0; border-left: 4px solid #4f7c82; border-radius: 7px; padding: .5rem; text-align: left; color: #17334a; cursor: pointer; display: grid; gap: .15rem; }
.shift-card strong { font-size: .82rem; }
.shift-card span, .shift-card small { font-size: .7rem; color: #52636e; line-height: 1.35; }
.cell-add { min-height: 2rem; border: 1px dashed #cbd8df; border-radius: 7px; background: transparent; color: #80909a; cursor: pointer; opacity: 0; transition: opacity .15s; }
.day-cell:hover .cell-add, .cell-add:focus { opacity: 1; }
.template-intro { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1.2rem; border-bottom: 1px solid #e6ecef; }
.template-intro h2 { margin: 0; color: #17334a; }
.template-intro p { margin: .35rem 0 0; color: #6b7882; font-size: .87rem; }
.count-pill, .status-pill { border-radius: 999px; padding: .3rem .65rem; font-size: .75rem; font-weight: 900; }
.count-pill { background: #edf4f8; color: #17334a; }
.template-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: 1rem; padding: 1rem; }
.template-card { border: 1px solid #dfe7ec; border-radius: 10px; padding: 1rem; display: grid; gap: .9rem; }
.template-card.disabled { opacity: .6; }
.template-card > header { display: flex; align-items: center; gap: .65rem; }
.template-card > header > div { flex: 1; }
.template-card header strong, .template-card header small { display: block; }
.template-card header strong { color: #17334a; }
.template-card header small { color: #81909a; }
.color-dot { width: .9rem; height: .9rem; border-radius: 50%; flex: none; }
.status-pill.on { color: #15643f; background: #e7f6ee; }
.status-pill.off { color: #747e84; background: #f0f2f3; }
.segment-list { display: grid; gap: .35rem; }
.segment-line { display: flex; align-items: center; gap: .45rem; color: #3f515d; font-size: .84rem; }
.segment-line em { color: #b56f22; font-size: .7rem; font-style: normal; font-weight: 900; }
dl { margin: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: .45rem; }
dl div { background: #f7f9fa; border-radius: 7px; padding: .55rem; }
dt { color: #839099; font-size: .68rem; } dd { margin: .15rem 0 0; color: #17334a; font-size: .8rem; font-weight: 900; }
.template-description { margin: 0; color: #6b7882; font-size: .8rem; line-height: 1.6; }
.template-card footer { display: flex; justify-content: flex-end; gap: .5rem; }
.modal.pdf-export-modal {
  width: min(calc(100vw - 3rem), 72rem);
  max-height: calc(100vh - 3rem);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}
.pdf-export-body {
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(20rem, .8fr);
  background: #f7f9fa;
}
.pdf-export-settings,
.pdf-export-summary {
  min-width: 0;
  min-height: 0;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}
.pdf-export-settings { border-right: 1px solid #dfe7ec; }
.pdf-export-summary { background: #fff; }
.pdf-staff-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .8rem;
  padding: .75rem;
  border-radius: 9px;
  background: #edf4f8;
}
.pdf-staff-toolbar > div:first-child { min-width: 0; }
.pdf-staff-toolbar strong,
.pdf-staff-toolbar span { display: block; }
.pdf-staff-toolbar strong { color: #17334a; font-size: .88rem; }
.pdf-staff-toolbar span { margin-top: .15rem; color: #74838d; font-size: .72rem; }
.pdf-staff-toolbar > div:last-child { display: flex; gap: .45rem; flex: none; }
.pdf-staff-list {
  min-height: 0;
  max-height: 27rem;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .55rem;
}
.pdf-staff-row {
  min-width: 0;
  padding: .75rem;
  border: 1px solid #dfe7ec;
  border-radius: 9px;
  background: #fff;
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  align-items: center;
  gap: .6rem;
  cursor: pointer;
}
.pdf-staff-row.selected { border-color: #9fb7c5; background: #f8fbfc; }
.pdf-staff-row input { width: 1rem; height: 1rem; accent-color: #17334a; }
.pdf-staff-row .avatar {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  background: #edf4f8;
  color: #17334a;
  display: grid;
  place-items: center;
  font-weight: 900;
}
.pdf-staff-meta { min-width: 0; }
.pdf-staff-meta strong,
.pdf-staff-meta small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pdf-staff-meta strong { color: #17334a; font-size: .84rem; }
.pdf-staff-meta small { margin-top: .1rem; color: #74838d; font-size: .7rem; }
.pdf-paper-preview {
  width: min(100%, 23rem);
  aspect-ratio: 297 / 210;
  align-self: center;
  padding: 1rem;
  border: 1px solid #d8e2e8;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(23, 51, 74, .12);
  transform: rotate(-1deg);
}
.pdf-paper-title { width: 42%; height: .55rem; border-radius: 999px; background: #17334a; }
.pdf-paper-subtitle { width: 68%; height: .3rem; margin-top: .45rem; border-radius: 999px; background: #cfd9df; }
.pdf-paper-grid {
  margin-top: 1rem;
  height: calc(100% - 2.3rem);
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  border-top: 1px solid #cfd9df;
  border-left: 1px solid #cfd9df;
}
.pdf-paper-grid span { border-right: 1px solid #cfd9df; border-bottom: 1px solid #cfd9df; }
.pdf-summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: .65rem; }
.pdf-summary-grid > div { padding: .85rem; border-radius: 9px; background: #f7f9fa; display: grid; gap: .2rem; }
.pdf-summary-grid span { color: #7c8992; font-size: .72rem; }
.pdf-summary-grid strong { color: #17334a; font-size: 1.05rem; }
.pdf-layout-note {
  display: flex;
  align-items: flex-start;
  gap: .7rem;
  padding: .85rem;
  border: 1px solid #dbe5e9;
  border-radius: 9px;
  background: #f8fbfc;
  color: #17334a;
}
.pdf-layout-note > svg { margin-top: .15rem; color: #b9382f; font-size: 1.15rem; flex: none; }
.pdf-layout-note strong { font-size: .84rem; }
.pdf-layout-note p { margin: .25rem 0 0; color: #6f7f89; font-size: .72rem; line-height: 1.55; }
.pdf-export-info { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .45rem .75rem; padding: .85rem; border-radius: 9px; background: #fff8e9; }
.pdf-export-info span { color: #8c795b; font-size: .72rem; }
.pdf-export-info strong { color: #17334a; font-size: .78rem; overflow-wrap: anywhere; }
.pdf-export-actions { margin-top: auto; padding-top: .9rem; border-top: 1px solid #e5ebee; }
.btn.danger-ghost { color: #b9382f; border-color: #efc7c3; background: #fff; }
.btn.danger-ghost:hover { background: #fff5f4; }
.btn.danger { color: #fff; border-color: #b9382f; background: #b9382f; }
.danger-text { color: #b9382f; }
.modal.batch-delete-modal {
  width: min(calc(100vw - 3rem), 82rem);
  max-height: calc(100vh - 3rem);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}
.batch-delete-body {
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
  background: #f7f9fa;
}
.batch-delete-filter,
.batch-delete-preview {
  min-width: 0;
  min-height: 0;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}
.batch-delete-filter { border-right: 1px solid #dfe7ec; }
.batch-delete-preview { background: #fff; }
.batch-delete-staff-header,
.delete-preview-toolbar,
.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
}
.preview-header { align-items: flex-start; }
.preview-header > div { flex: 1; }
.batch-delete-staff-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .55rem;
  max-height: 18rem;
  overflow-y: auto;
}
.delete-staff-chip {
  min-width: 0;
  padding: .7rem;
  border: 1px solid #dfe7ec;
  border-radius: 9px;
  background: #fff;
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  align-items: center;
  gap: .55rem;
  cursor: pointer;
}
.delete-staff-chip.selected { border-color: #9fb7c5; background: #f8fbfc; }
.delete-staff-chip input,
.delete-preview-row input { width: 1rem; height: 1rem; accent-color: #17334a; }
.delete-staff-chip .avatar { width: 2rem; height: 2rem; border-radius: 50%; background: #edf4f8; color: #17334a; display: grid; place-items: center; font-weight: 900; }
.delete-staff-chip strong,
.delete-staff-chip small { display: block; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.delete-staff-chip strong { color: #17334a; font-size: .82rem; }
.delete-staff-chip small { color: #74838d; font-size: .7rem; }
.preview-delete-btn { width: 100%; margin-top: auto; }
.danger-step { background: #b9382f; }
.delete-selected-count { flex: none; padding: .3rem .65rem; border-radius: 999px; background: #fff0ee; color: #b9382f; font-size: .76rem; font-weight: 900; }
.delete-preview-empty { flex: 1; min-height: 16rem; display: grid; place-items: center; align-content: center; gap: .55rem; border: 1px dashed #d8e2e8; border-radius: 10px; color: #7b8992; text-align: center; }
.delete-preview-empty svg { font-size: 2rem; opacity: .45; }
.delete-preview-empty strong { color: #435963; }
.delete-preview-empty span { font-size: .76rem; }
.delete-preview-toolbar span { color: #74838d; font-size: .76rem; font-weight: 800; }
.delete-preview-list { min-height: 0; max-height: 32rem; overflow-y: auto; display: grid; gap: .5rem; }
.delete-preview-row { padding: .7rem; border: 1px solid #dfe7ec; border-radius: 9px; display: grid; grid-template-columns: auto 6.2rem minmax(0, 1fr); align-items: center; gap: .7rem; cursor: pointer; }
.delete-preview-row.selected { border-color: #e6b5b0; background: #fffafa; }
.delete-preview-row time { color: #17334a; font-size: .78rem; font-weight: 900; }
.delete-preview-main { min-width: 0; }
.delete-preview-main strong,
.delete-preview-main small { display: block; }
.delete-preview-main strong { color: #17334a; }
.delete-preview-main small { margin-top: .12rem; color: #71808a; font-size: .72rem; overflow-wrap: anywhere; }
.delete-warning-box { display: flex; align-items: flex-start; gap: .6rem; padding: .75rem; border-radius: 9px; background: #fff4e8; color: #8c5d20; font-size: .75rem; line-height: 1.55; }
.delete-modal-actions { margin-top: auto; padding-top: .9rem; border-top: 1px solid #e5ebee; }
.modal.batch-modal {
  width: min(calc(100vw - 3rem), 88rem);
  max-height: calc(100vh - 3rem);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}
.modal-subtitle { margin: .25rem 0 0; color: #74838d; font-size: .78rem; }
.batch-body {
  min-height: 0;
  overflow: auto;
  background: #f7f9fa;
  grid-template-columns: minmax(0, 1.75fr) minmax(20rem, .85fr);
  grid-template-areas:
    "scope summary"
    "staff summary"
    "actions actions";
  align-items: start;
  gap: 1rem;
}
.batch-scope-section { grid-area: scope; }
.batch-staff-section { grid-area: staff; }
.summary-section {
  grid-area: summary;
  position: sticky;
  top: 0;
  align-self: start;
}
.batch-actions { grid-area: actions; }
.batch-section { min-width: 0; padding: 1rem; border: 1px solid #dfe7ec; border-radius: 12px; background: #fff; display: grid; gap: 1rem; }
.batch-section-header { display: flex; align-items: flex-start; gap: .75rem; }
.batch-section-header h3 { margin: 0; color: #17334a; font-size: 1rem; }
.batch-section-header p { margin: .2rem 0 0; color: #74838d; font-size: .76rem; }
.step-index { width: 1.8rem; height: 1.8rem; border-radius: 50%; background: #17334a; color: #fff; display: grid; place-items: center; font-size: .78rem; font-weight: 900; flex: none; }
.batch-preset-row { display: flex; align-items: center; gap: .45rem; flex-wrap: wrap; }
.preset-btn { min-height: 2rem; border: 1px solid #d8e2e8; border-radius: 999px; padding: 0 .8rem; background: #fff; color: #17334a; font: inherit; font-size: .75rem; font-weight: 900; cursor: pointer; }
.form-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.weekday-selector { display: flex; align-items: center; gap: .45rem; flex-wrap: wrap; }
.weekday-label { margin-right: .25rem; color: #17334a; font-size: .8rem; font-weight: 900; }
.weekday-chip { position: relative; cursor: pointer; }
.weekday-chip input { position: absolute; opacity: 0; pointer-events: none; }
.weekday-chip span { width: 2.25rem; height: 2.25rem; border: 1px solid #d8e2e8; border-radius: 50%; background: #fff; color: #61727d; display: grid; place-items: center; font-size: .78rem; font-weight: 900; }
.weekday-chip.selected span { background: #17334a; border-color: #17334a; color: #fff; }
.batch-staff-toolbar { display: flex; align-items: center; gap: .55rem; flex-wrap: wrap; padding: .7rem; border-radius: 9px; background: #f7f9fa; }
.batch-staff-toolbar select { min-height: 2.2rem; min-width: min(21rem, 100%); border: 1px solid #d8e2e8; border-radius: 7px; padding: 0 .65rem; background: #fff; color: #253946; }
.selected-count { margin-left: auto; color: #657580; font-size: .76rem; font-weight: 900; }
.state-card.compact { padding: 2rem 1rem; }
.batch-staff-list { max-height: 31rem; overflow-y: auto; overflow-x: hidden; display: grid; gap: .55rem; padding-right: .2rem; }
.batch-staff-row { min-width: 0; display: grid; grid-template-columns: minmax(14rem, .85fr) minmax(18rem, 1.15fr); gap: 1rem; align-items: center; padding: .75rem; border: 1px solid #dfe7ec; border-radius: 9px; background: #fff; }
.batch-staff-row.selected { border-color: #9fb7c5; background: #fbfdfe; }
.staff-select-box { display: flex; align-items: center; gap: .65rem; cursor: pointer; }
.staff-select-box > input { width: 1rem; height: 1rem; accent-color: #17334a; }
.staff-select-box .avatar { width: 2.1rem; height: 2.1rem; border-radius: 50%; background: #edf4f8; color: #17334a; display: grid; place-items: center; font-weight: 900; flex: none; }
.staff-meta { min-width: 0; }
.staff-meta strong, .staff-meta small { display: block; }
.staff-meta strong { color: #17334a; }
.staff-meta small { color: #7a8790; font-size: .72rem; }
.batch-template-field { min-width: 0; }
.batch-template-field select { min-width: 0; min-height: 2.35rem; }
.batch-summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .6rem; }
.batch-summary-grid > div { padding: .8rem; border-radius: 9px; background: #f7f9fa; display: grid; gap: .2rem; }
.batch-summary-grid span { color: #7c8992; font-size: .72rem; }
.batch-summary-grid strong { color: #17334a; font-size: 1rem; }
.batch-summary-grid .highlight { background: #fff3dc; }
.batch-limit-warning { margin: 0; padding: .7rem; border-radius: 8px; background: #fff0ee; color: #b9382f; font-size: .78rem; font-weight: 800; }
.conflict-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .65rem; }
.conflict-options > label { display: flex; align-items: flex-start; gap: .6rem; padding: .8rem; border: 1px solid #dfe7ec; border-radius: 9px; cursor: pointer; }
.conflict-options > label.active { border-color: #9fb7c5; background: #f5f9fb; }
.conflict-options input { margin-top: .2rem; accent-color: #17334a; }
.conflict-options strong, .conflict-options small { display: block; }
.conflict-options strong { color: #17334a; font-size: .82rem; }
.conflict-options small { margin-top: .2rem; color: #74838d; font-size: .7rem; line-height: 1.45; }
.batch-actions { position: sticky; bottom: -1.25rem; margin: 0 -1.25rem -1.25rem; padding: .9rem 1.25rem; border-top: 1px solid #e1e8ec; background: rgba(255, 255, 255, .96); backdrop-filter: blur(10px); }
.modal-overlay { position: fixed; inset: 0; z-index: 1200; background: rgba(17, 31, 40, .55); padding: 1rem; display: grid; place-items: center; }
.modal { width: min(100%, 34rem); max-height: calc(100vh - 2rem); overflow: auto; background: #fff; border-radius: 14px; box-shadow: 0 24px 70px rgba(0, 0, 0, .25); }
.modal.large { width: min(100%, 48rem); }
.modal-header { padding: 1rem 1.25rem; border-bottom: 1px solid #e5ebee; display: flex; align-items: center; justify-content: space-between; }
.modal-header h2 { margin: 0; color: #17334a; font-size: 1.15rem; }
.modal-body { padding: 1.25rem; display: grid; gap: 1rem; }
.form-grid { display: grid; gap: .9rem; }
.form-grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.field { display: grid; gap: .35rem; color: #17334a; font-size: .85rem; font-weight: 800; }
.field em { color: #c0392b; font-style: normal; }
.field input, .field select, .field textarea { width: 100%; min-height: 2.7rem; border: 1px solid #d8e2e8; border-radius: 8px; padding: .65rem .75rem; background: #fff; color: #253946; font: inherit; }
.field textarea { resize: vertical; }
.field small { color: #74838d; font-size: .72rem; font-weight: 500; line-height: 1.5; }
.color-input { padding: .25rem !important; }
.segment-editor { border: 1px solid #dfe7ec; border-radius: 10px; overflow: hidden; }
.segment-editor > header { padding: .85rem; background: #f7f9fa; display: flex; align-items: center; justify-content: space-between; gap: .8rem; }
.segment-editor h3 { margin: 0; color: #17334a; font-size: .95rem; }
.segment-editor p { margin: .2rem 0 0; color: #74838d; font-size: .74rem; }
.segment-row { display: grid; grid-template-columns: auto 1fr auto 1fr auto auto; gap: .65rem; align-items: end; padding: .8rem; border-top: 1px solid #edf1f3; }
.segment-index { width: 1.7rem; height: 1.7rem; border-radius: 50%; background: #edf4f8; display: grid; place-items: center; color: #17334a; font-weight: 900; align-self: center; }
.field.compact input { min-height: 2.35rem; }
.arrow { color: #8a989f; align-self: center; padding-top: 1rem; }
.check-field { display: flex; align-items: center; gap: .45rem; color: #324955; font-size: .8rem; font-weight: 800; }
.check-field input { width: 1rem; height: 1rem; accent-color: #17334a; }
.check-field.standalone { padding: .7rem; background: #f7f9fa; border-radius: 8px; }
.danger-icon { color: #b9382f; align-self: end; }
.work-preview { display: grid; grid-template-columns: repeat(3, 1fr); gap: .6rem; }
.work-preview div { padding: .75rem; background: #f7f9fa; border-radius: 8px; display: grid; gap: .2rem; }
.work-preview span { color: #7c8992; font-size: .72rem; }
.work-preview strong { color: #17334a; }
.work-preview .highlight { background: #fff3dc; }
.modal-actions { display: flex; justify-content: flex-end; gap: .6rem; padding-top: .25rem; }
.modal-actions.split { justify-content: space-between; align-items: center; }
.modal-actions.split > div { display: flex; gap: .6rem; }
.selected-template-preview { display: flex; align-items: flex-start; gap: .7rem; padding: .8rem; border: 1px solid #dfe7ec; border-radius: 9px; background: #fbfcfd; }
.selected-template-preview strong { color: #17334a; }
.selected-template-preview p { margin: .15rem 0; color: #435963; font-size: .82rem; }
.selected-template-preview small, .conflict-hint { color: #74838d; font-size: .74rem; line-height: 1.5; }
.conflict-hint { margin: 0; padding: .7rem; background: #f7f9fa; border-radius: 8px; }
@media (max-width: 68rem) {
  .modal.pdf-export-modal { width: min(calc(100vw - 2rem), 58rem); }
  .pdf-export-body { overflow-y: auto; grid-template-columns: 1fr; }
  .pdf-export-settings { border-right: 0; border-bottom: 1px solid #dfe7ec; overflow: visible; }
  .pdf-export-summary { overflow: visible; }
  .modal.batch-delete-modal { width: min(calc(100vw - 2rem), 58rem); }
  .batch-delete-body { overflow-y: auto; grid-template-columns: 1fr; }
  .batch-delete-filter { border-right: 0; border-bottom: 1px solid #dfe7ec; overflow: visible; }
  .batch-delete-preview { overflow: visible; }
  .modal.batch-modal {
    width: min(calc(100vw - 2rem), 58rem);
  }
  .batch-body {
    grid-template-columns: 1fr;
    grid-template-areas:
      "scope"
      "staff"
      "summary"
      "actions";
  }
  .summary-section {
    position: static;
  }
}

@media (max-width: 48rem) {
  .modal-overlay { padding: 0; align-items: end; }
  .modal.pdf-export-modal {
    width: 100%;
    max-height: 94dvh;
    border-radius: 16px 16px 0 0;
  }
  .pdf-staff-toolbar { align-items: stretch; flex-direction: column; }
  .pdf-staff-toolbar > div:last-child { width: 100%; }
  .pdf-staff-toolbar .btn { flex: 1; }
  .pdf-staff-list { grid-template-columns: 1fr; max-height: none; }
  .pdf-paper-preview { width: min(100%, 20rem); }
  .pdf-export-actions { position: sticky; bottom: -1.25rem; margin: 0 -1.25rem -1.25rem; padding: .9rem 1.25rem; background: rgba(255,255,255,.96); }
  .pdf-export-actions .btn { flex: 1; }
  .modal.batch-modal {
    width: 100%;
    max-height: 94dvh;
    border-radius: 16px 16px 0 0;
  }
  .modal.batch-delete-modal {
    width: 100%;
    max-height: 94dvh;
    border-radius: 16px 16px 0 0;
  }
  .batch-delete-staff-list { grid-template-columns: 1fr; max-height: none; }
  .delete-preview-list { max-height: none; }
  .delete-preview-row { grid-template-columns: auto 1fr; }
  .delete-preview-row time { grid-column: 2; }
  .delete-preview-main { grid-column: 2; }
  .delete-modal-actions { position: sticky; bottom: -1.25rem; margin: 0 -1.25rem -1.25rem; padding: .9rem 1.25rem; background: rgba(255,255,255,.96); }
  .delete-modal-actions .btn { flex: 1; }
  .batch-body { padding: 1rem; }
  .batch-section { padding: .85rem; }
  .batch-preset-row { display: grid; grid-template-columns: repeat(3, 1fr); }
  .preset-btn { padding: 0 .4rem; }
  .weekday-selector { justify-content: center; }
  .header-actions { width: 100%; }
  .header-actions .btn { flex: 1; }
  .toolbar { align-items: stretch; }
  .control, .control select { width: 100%; }
  .period-control { width: 100%; justify-content: center; }
  .view-switch { width: 100%; }
  .view-switch-btn { flex: 1; justify-content: center; }
  .toolbar-summary { width: 100%; justify-content: center; }
  .form-grid.two, .form-grid.three, .work-preview, .batch-summary-grid, .conflict-options { grid-template-columns: 1fr; }
  .segment-row { grid-template-columns: auto 1fr 1fr auto; }
  .segment-row .arrow { display: none; }
  .segment-row .check-field { grid-column: 2 / span 2; }
  .cell-add, .month-add { opacity: 1; }
  dl { grid-template-columns: 1fr; }
  .batch-staff-toolbar select { width: 100%; min-width: 0; }
  .selected-count { width: 100%; margin-left: 0; text-align: center; }
  .batch-staff-row { grid-template-columns: 1fr; }
  .batch-staff-list { max-height: none; }
  .modal-actions.split { align-items: stretch; flex-direction: column-reverse; }
  .modal-actions.split > div, .modal-actions.split .btn { width: 100%; }
}
.marker-hint { margin: 0; border-radius: 8px; padding: .75rem; background: #f7f9fa; color: #61727d; font-size: .78rem; line-height: 1.6; }
.field input.readonly-input { cursor: not-allowed; color: #52636f; background: #f1f4f6; border-color: #dbe3e8; }
.field input.readonly-input:focus { border-color: #dbe3e8; box-shadow: none; }
</style>
