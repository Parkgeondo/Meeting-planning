/** Static prototype data — days, time slots, member roster. */

/** Weekday columns: [label, day-of-month]. Base week = 2026-07-06(월). */
export const DAYS: ReadonlyArray<readonly [string, string]> = [
  ['월', '6'],
  ['화', '7'],
  ['수', '8'],
  ['목', '9'],
  ['금', '10'],
]

/** Heatmap time slots (⑤ dashboard) — 30-min resolution, lunch excluded. */
export const SLOTS = [
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
]

/** Attendee input grid rows (④) — hourly. */
export const HOURSX = [9, 10, 11, 12, 13, 14, 15, 16, 17]

/** Weekday names for the candidate-range sheet. */
export const DAY_NAMES = ['월', '화', '수', '목', '금']

/** Base roster (6 people). */
export const BASE_NAMES = ['지민', '서연', '준호', '지수', '하늘', '도윤']

export const MAX_HEARTS = 3

/** Deadline reference clock: 2026-07-06(월) 10:00. */
export const DEADLINE_BASE = new Date(2026, 6, 6, 10, 0)
export const DL_DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

/** Demo behavior: pre-seed the private objection card on ⑤. */
export const PRESEED_OBJECTION = true

/** Private objection reasons (필수 role sheet chips + ⑤ organizer card). */
export const OBJ_CHIPS: string[] = []

/** Lunch hour (12시) — its HOURSX row is the non-interactive 점심시간 row when lunch is excluded. */
export const LUNCH_HOUR = 12

export const HEAT_COLORS = ['#EDF3FA', '#C9E0FB', '#8FC1F9', '#4D95F7', '#1B64DA']

/** Whether a cell is blocked because a 필수 attendee can't make it. (hi indexes HOURSX.) */
export function isLocked(di: number, hi: number, jisooOpt: boolean): boolean {
  return lockedAttendees(di, hi, jisooOpt).length > 0
}

/** Dummy: which 필수 attendees can't make this slot (1–2 names). */
export function lockedAttendees(di: number, hi: number, jisooOpt: boolean): string[] {
  if (di === 0 && hi <= 2) return ['서연', '준호'] // 월 오전
  if (di === 2 && hi === 5) return ['지민'] // 수 14시
  if (!jisooOpt && di === 4 && hi >= 7) return ['지수'] // 금 늦은 오후
  return []
}

/** Baseline preference heat for a cell (0..1) — three hand-picked peaks + smooth field. */
export function baseHeat(di: number, hi: number): number {
  if (di === 1 && hi === 6) return 1 // 화 15시 — 1위
  if (di === 3 && hi === 1) return 0.92 // 목 10시 — 2위
  if (di === 2 && hi === 7) return 0.85 // 수 16시 — 3위
  return ((Math.sin(di * 2.3 + hi * 0.8) + 1) / 2) * 0.62 + 0.08
}
