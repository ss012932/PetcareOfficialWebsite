export interface ShiftPdfStaff {
  staffId: number
  fullName: string
  jobTitle?: string | null
}

export interface ShiftPdfSegment {
  startDateTime: string
  endDateTime: string
}

export interface ShiftPdfSchedule {
  staffId: number
  shiftDate: string
  shiftName: string
  colorHex?: string | null
  segments: ShiftPdfSegment[]
}

export interface ShiftPdfMarker {
  markerDate: string
  markerType: "ClosedAllDay" | "BusinessHoursChanged" | "BreakPeriod"
  title: string
  startTime?: string | null
  endTime?: string | null
}

export interface GenerateShiftSchedulePdfOptions {
  brandName: string
  storeName: string
  year: number
  month: number
  staffs: ShiftPdfStaff[]
  schedules: ShiftPdfSchedule[]
  markers?: ShiftPdfMarker[]
  generatedAt?: Date
}

/**
 * 控制月曆式 PDF 每頁最多顯示的員工數量。
 * 日期格改用雙欄姓名標籤後，每頁可維持 10 位員工的可讀性。
 */
export const SHIFT_CALENDAR_STAFFS_PER_PAGE = 10

const PAGE_WIDTH_PX = 1120
const PAGE_HEIGHT_PX = 792
const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"]

interface CalendarDay {
  date: Date
  iso: string
  dayNumber: number
  monthLabel: string
  isCurrentMonth: boolean
}

interface ShiftLegendItem {
  key: string
  color: string
  shiftName: string
  timeText: string
}

/**
 * 控制 PDF 文字安全輸出，避免姓名或班別中的特殊字元破壞 HTML。
 */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

/**
 * 控制日期字串只保留 YYYY-MM-DD，兼容 API 回傳的 DateTime 格式。
 */
function normalizeDate(value: string): string {
  return String(value ?? "").slice(0, 10)
}

/**
 * 控制本地日期轉換成 YYYY-MM-DD，避免 toISOString 造成時區偏移。
 */
function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

/**
 * 控制班別時間顯示，例如 09:00-18:00 或 22:00-08:00翌日。
 */
function formatSegmentTime(segment: ShiftPdfSegment): string {
  const start = new Date(segment.startDateTime)
  const end = new Date(segment.endDateTime)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return ""

  const toTime = (date: Date) =>
    `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`

  const nextDay = end.toDateString() !== start.toDateString() ? "翌日" : ""
  return `${toTime(start)}-${toTime(end)}${nextDay}`
}

/**
 * 控制陣列分頁，員工超過單頁上限時建立下一張完整月曆。
 */
function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size))
  }
  return result
}

/**
 * 控制班別顏色，只接受安全的 #RRGGBB 格式。
 */
function normalizeColor(value?: string | null): string {
  return /^#[0-9a-fA-F]{6}$/.test(value ?? "") ? String(value) : "#4f7c82"
}

/**
 * 控制班別標籤的淡色背景。
 */
function toRgba(hex: string, alpha: number): string {
  const normalized = normalizeColor(hex).slice(1)
  const red = Number.parseInt(normalized.slice(0, 2), 16)
  const green = Number.parseInt(normalized.slice(2, 4), 16)
  const blue = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgba(${red},${green},${blue},${alpha})`
}

/**
 * 建立固定 6 週、共 42 格的月曆資料。
 */
function createCalendarDays(year: number, month: number): CalendarDay[] {
  const monthFirst = new Date(year, month - 1, 1)
  const calendarFirst = new Date(year, month - 1, 1 - monthFirst.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarFirst)
    date.setDate(calendarFirst.getDate() + index)

    return {
      date,
      iso: toIsoDate(date),
      dayNumber: date.getDate(),
      monthLabel: `${date.getMonth() + 1}月`,
      isCurrentMonth: date.getFullYear() === year && date.getMonth() === month - 1,
    }
  })
}

/**
 * 建立 PDF 下方班別圖例。
 * 同一班別會顯示代表顏色、班別名稱與完整工作時段。
 */
function createShiftLegend(schedules: ShiftPdfSchedule[], selectedStaffIds: Set<number>): ShiftLegendItem[] {
  const legendMap = new Map<string, ShiftLegendItem>()

  for (const schedule of schedules) {
    if (!selectedStaffIds.has(schedule.staffId)) continue

    const color = normalizeColor(schedule.colorHex)
    const timeText = schedule.segments.map(formatSegmentTime).filter(Boolean).join(" / ") || "未設定時間"
    const shiftName = schedule.shiftName || "未命名班別"
    const key = `${color}|${shiftName}|${timeText}`

    if (!legendMap.has(key)) {
      legendMap.set(key, { key, color, shiftName, timeText })
    }
  }

  return [...legendMap.values()].sort((left, right) =>
    left.shiftName.localeCompare(right.shiftName, "zh-TW") || left.timeText.localeCompare(right.timeText, "zh-TW"),
  )
}

/**
 * 建立單張 A4 橫式月曆班表 HTML。
 * 日期格只顯示「班別顏色＋員工姓名」，班別名稱與時間集中顯示於頁尾圖例。
 */
function createPageElement(options: {
  brandName: string
  storeName: string
  year: number
  month: number
  generatedText: string
  pageText: string
  staffs: ShiftPdfStaff[]
  calendarDays: CalendarDay[]
  schedulesByDate: Map<string, ShiftPdfSchedule[]>
  markersByDate: Map<string, ShiftPdfMarker>
  legendItems: ShiftLegendItem[]
}): HTMLDivElement {
  const page = document.createElement("div")
  page.style.cssText = [
    `width:${PAGE_WIDTH_PX}px`,
    `height:${PAGE_HEIGHT_PX}px`,
    "box-sizing:border-box",
    "padding:24px 28px 20px",
    "background:#ffffff",
    "color:#17334a",
    'font-family:"Aptos","PMingLiU","新細明體",serif',
    "overflow:hidden",
  ].join(";")

  const staffMap = new Map(options.staffs.map((staff) => [staff.staffId, staff]))
  const staffOrder = new Map(options.staffs.map((staff, index) => [staff.staffId, index]))

  const weekdayHeaders = WEEKDAY_LABELS.map((weekday, index) => {
    const isWeekend = index === 0 || index === 6
    return `<div style="display:grid;place-items:center;border-right:${index === 6 ? "0" : "1px solid #dfe7ec"};border-bottom:1px solid #dfe7ec;background:${isWeekend ? "#f7f9fa" : "#f4f7f9"};color:#647681;font-size:10px;font-weight:900">${weekday}</div>`
  }).join("")

  const calendarCells = options.calendarDays.map((day, dayIndex) => {
    const dateSchedules = (options.schedulesByDate.get(day.iso) ?? [])
      .filter((schedule) => staffMap.has(schedule.staffId))
      .sort((left, right) => {
        const staffDiff = (staffOrder.get(left.staffId) ?? 999) - (staffOrder.get(right.staffId) ?? 999)
        if (staffDiff !== 0) return staffDiff
        return left.shiftName.localeCompare(right.shiftName, "zh-TW")
      })

    const cards = dateSchedules.map((schedule) => {
      const staff = staffMap.get(schedule.staffId)
      const color = normalizeColor(schedule.colorHex)

      return `<div style="min-width:0;height:14px;padding:0 4px;border-left:3px solid ${color};border-radius:3px;background:${toRgba(color, 0.12)};display:flex;align-items:center;overflow:hidden">
        <span style="min-width:0;color:#17334a;font-size:7px;font-weight:800;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(staff?.fullName ?? "未命名員工")}</span>
      </div>`
    }).join("")

    const marker = options.markersByDate.get(day.iso)
    const markerTime = marker?.markerType !== "ClosedAllDay" && marker?.startTime && marker?.endTime
      ? `${marker.startTime.slice(0, 5)}-${marker.endTime.slice(0, 5)}`
      : ""
    const markerText = marker ? `${marker.title}${markerTime ? ` ${markerTime}` : ""}` : ""
    const markerStyle = marker?.markerType === "ClosedAllDay"
      ? "color:#9f3029;background:#fff0ee;border:1px solid #efc4bf"
      : marker?.markerType === "BusinessHoursChanged"
        ? "color:#815a12;background:#fff7df;border:1px solid #ead59b"
        : "color:#276278;background:#edf7fb;border:1px solid #badce8"

    const columnIndex = dayIndex % 7
    const isWeekend = columnIndex === 0 || columnIndex === 6
    const rightBorder = columnIndex === 6 ? "0" : "1px solid #e4eaee"
    const bottomBorder = dayIndex >= 35 ? "0" : "1px solid #e4eaee"
    const cellBackground = day.isCurrentMonth
      ? (isWeekend ? "#fdfefe" : "#ffffff")
      : "#f7f9fa"
    const numberColor = day.isCurrentMonth ? "#17334a" : "#9aa6ad"

    return `<div style="position:relative;min-width:0;min-height:0;padding:4px 5px;border-right:${rightBorder};border-bottom:${bottomBorder};background:${cellBackground};overflow:hidden">
      <div style="height:16px;display:flex;align-items:center;justify-content:space-between;gap:4px;overflow:hidden">
        <span style="flex:none;color:${numberColor};font-size:8px;font-weight:900">${day.dayNumber}</span>
        ${marker
          ? `<span style="min-width:0;padding:1px 4px;border-radius:3px;font-size:5.5px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${markerStyle}">${escapeHtml(markerText)}</span>`
          : !day.isCurrentMonth
            ? `<span style="color:#9aa6ad;font-size:5.7px">${day.monthLabel}</span>`
            : ""}
      </div>
      <div style="min-height:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:14px;gap:2px 3px;overflow:hidden">${cards}</div>
    </div>`
  }).join("")

  const legendHtml = options.legendItems.length > 0
    ? options.legendItems.map((item) => `
      <div style="min-width:0;display:flex;align-items:center;gap:5px;overflow:hidden">
        <span style="width:10px;height:10px;flex:none;border-radius:2px;background:${item.color}"></span>
        <span style="min-width:0;color:#51636f;font-size:6.4px;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          <strong style="color:#17334a;font-weight:900">${escapeHtml(item.shiftName)}</strong>
          <span>｜${escapeHtml(item.timeText)}</span>
        </span>
      </div>`).join("")
    : '<span style="color:#87949b;font-size:6.6px">本月份尚無班別資料</span>'

  page.innerHTML = `
    <header style="height:50px;display:flex;align-items:flex-start;justify-content:space-between;gap:22px;margin-bottom:8px">
      <div style="min-width:0;flex:1">
        <div style="color:#b48745;font-size:8px;font-weight:800;letter-spacing:2px;text-transform:uppercase">Workforce Scheduling</div>
        <div style="display:flex;align-items:baseline;gap:10px;margin-top:3px;min-width:0">
          <h1 style="margin:0;color:#17334a;font-family:inherit;font-size:22px;font-weight:400;letter-spacing:0;line-height:1.15;white-space:nowrap">${options.year} 年 ${options.month} 月班表</h1>
          <span style="min-width:0;color:#647681;font-size:8.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(options.brandName)}｜${escapeHtml(options.storeName)}</span>
        </div>
      </div>
      <div style="flex:none;text-align:right;color:#74838d;font-size:7.5px;line-height:1.55">
        <div>${escapeHtml(options.generatedText)}</div>
        <div>${escapeHtml(options.pageText)}</div>
      </div>
    </header>

    <section style="height:624px;border:1px solid #dfe7ec;border-radius:7px;overflow:hidden;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));grid-template-rows:32px repeat(6,minmax(0,1fr));background:#fff">
      ${weekdayHeaders}
      ${calendarCells}
    </section>

    <footer style="height:58px;margin-top:8px;box-sizing:border-box;padding:7px 9px;border:1px solid #e4eaee;border-radius:6px;background:#fafbfc;overflow:hidden">
      <div style="margin-bottom:5px;color:#647681;font-size:6.8px;font-weight:900;letter-spacing:.6px">班別圖例</div>
      <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));grid-auto-rows:12px;gap:3px 12px;overflow:hidden">
        ${legendHtml}
      </div>
    </footer>
  `

  return page
}

/**
 * 產生 A4 橫式月曆班表 PDF。
 * 每頁最多 10 位員工，超過時以完整月曆延續分頁。
 */
export async function generateShiftSchedulePdf(options: GenerateShiftSchedulePdfOptions): Promise<void> {
  if (!import.meta.client) throw new Error("PDF 只能在瀏覽器中產生。")
  if (options.staffs.length === 0) throw new Error("請至少選擇一位員工。")

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ])

  await document.fonts?.ready

  const staffGroups = chunk(options.staffs, SHIFT_CALENDAR_STAFFS_PER_PAGE)
  const schedulesByDate = new Map<string, ShiftPdfSchedule[]>()

  for (const schedule of options.schedules) {
    const dateKey = normalizeDate(schedule.shiftDate)
    const list = schedulesByDate.get(dateKey) ?? []
    list.push(schedule)
    schedulesByDate.set(dateKey, list)
  }

  const markersByDate = new Map<string, ShiftPdfMarker>()
  for (const marker of options.markers ?? []) {
    markersByDate.set(normalizeDate(marker.markerDate), marker)
  }

  const selectedStaffIds = new Set(options.staffs.map((staff) => staff.staffId))
  const legendItems = createShiftLegend(options.schedules, selectedStaffIds)
  const generatedAt = options.generatedAt ?? new Date()
  const generatedText = `產出時間：${new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(generatedAt)}`
  const calendarDays = createCalendarDays(options.year, options.month)

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  })

  const renderHost = document.createElement("div")
  renderHost.setAttribute("aria-hidden", "true")
  renderHost.style.cssText = `position:fixed;left:-100000px;top:0;width:${PAGE_WIDTH_PX}px;background:#fff;z-index:-1`
  document.body.appendChild(renderHost)

  try {
    for (let pageIndex = 0; pageIndex < staffGroups.length; pageIndex += 1) {
      const page = createPageElement({
        brandName: options.brandName,
        storeName: options.storeName,
        year: options.year,
        month: options.month,
        generatedText,
        pageText: `第 ${pageIndex + 1} / ${staffGroups.length} 頁`,
        staffs: staffGroups[pageIndex] ?? [],
        calendarDays,
        schedulesByDate,
        markersByDate,
        legendItems,
      })

      renderHost.appendChild(page)
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

      const canvas = await html2canvas(page, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        width: PAGE_WIDTH_PX,
        height: PAGE_HEIGHT_PX,
        windowWidth: PAGE_WIDTH_PX,
        windowHeight: PAGE_HEIGHT_PX,
      })

      if (pageIndex > 0) pdf.addPage("a4", "landscape")
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.94), "JPEG", 0, 0, 297, 210, undefined, "FAST")
      page.remove()
    }

    const safeStoreName = options.storeName.replace(/[\\/:*?"<>|]+/g, "_")
    pdf.save(`${safeStoreName}_${options.year}-${String(options.month).padStart(2, "0")}_月曆班表.pdf`)
  } finally {
    renderHost.remove()
  }
}
