import { DAY_NAMES } from './data'
import type { RangeState } from './state'

export const fmtHour = (h: number): string => (h < 10 ? '0' + h : h) + ':00'

export const fmtDateKey = (k: number): string => Math.floor(k / 100) + '/' + (k % 100)

export function activeDays(range: RangeState): string[] {
  return range.days.map((v, i) => (v ? DAY_NAMES[i] : null)).filter((x): x is string => x !== null)
}

export function rangeSummary(range: RangeState): string {
  const on = activeDays(range)
  const dayLabel = on.length === 5 ? '월–금' : on.join('·')
  const custom = range.week === '직접 선택'
  const dates = range.dates
  const dateSummary =
    dates.length > 0
      ? dates.length <= 3
        ? dates.map(fmtDateKey).join('·')
        : fmtDateKey(dates[0]) + ' 외 ' + (dates.length - 1) + '일'
      : null
  const head = custom && dateSummary ? dateSummary : range.week + ' ' + dayLabel
  return head + ' · ' + fmtHour(range.start) + '–' + fmtHour(range.end)
}

export const MIN_MONTH = 7
export const MAX_MONTH = 12

export const isPastDate = (month: number, day: number): boolean => month === 7 && day < 6

export const encodeDate = (month: number, day: number): number => month * 100 + day

export interface CalCell {
  key: string
  label: string
  onClick: (() => void) | null
  variant: 'weekSelect' | 'day' | 'pad'
  selected: boolean
  past: boolean
  allOn: boolean
  selectable: boolean
}

export function buildCalendar(range: RangeState, toggle: (days: number[]) => void): CalCell[] {
  const month = range.month
  const offset = new Date(2026, month - 1, 1).getDay()
  const daysInMonth = new Date(2026, month, 0).getDate()
  const rowCount = Math.ceil((offset + daysInMonth) / 7)
  const cells: CalCell[] = []

  for (let row = 0; row < rowCount; row++) {
    const rowDays: (number | null)[] = []
    for (let col = 0; col < 7; col++) {
      const d = row * 7 + col - offset + 1
      rowDays.push(d >= 1 && d <= daysInMonth ? d : null)
    }
    const selectable = rowDays.filter(
      (d): d is number => d !== null && !isPastDate(month, d),
    )
    const allOn =
      selectable.length > 0 && selectable.every((d) => range.dates.includes(encodeDate(month, d)))

    cells.push({
      key: `w${row}`,
      label: allOn ? '✓' : '주',
      onClick: selectable.length ? () => toggle(selectable) : null,
      variant: 'weekSelect',
      selected: false,
      past: false,
      allOn,
      selectable: selectable.length > 0,
    })

    for (let col = 0; col < 7; col++) {
      const d = rowDays[col]
      if (d === null) {
        cells.push({
          key: `r${row}c${col}`,
          label: '',
          onClick: null,
          variant: 'pad',
          selected: false,
          past: false,
          allOn: false,
          selectable: false,
        })
        continue
      }
      const past = isPastDate(month, d)
      const selected = range.dates.includes(encodeDate(month, d))
      cells.push({
        key: `r${row}c${col}`,
        label: String(d),
        onClick: past ? null : () => toggle([d]),
        variant: 'day',
        selected,
        past,
        allOn: false,
        selectable: !past,
      })
    }
  }
  return cells
}

export function toggleDates(range: RangeState, days: number[]): number[] {
  const keys = days.map((d) => encodeDate(range.month, d))
  const toAdd = keys.filter((k) => !range.dates.includes(k))
  const next =
    toAdd.length > 0 ? range.dates.concat(toAdd) : range.dates.filter((k) => !keys.includes(k))
  return next.slice().sort((a, b) => a - b)
}
