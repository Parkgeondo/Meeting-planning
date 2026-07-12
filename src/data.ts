export const DAYS: ReadonlyArray<readonly [string, string]> = [
  ['월', '6'],
  ['화', '7'],
  ['수', '8'],
  ['목', '9'],
  ['금', '10'],
]

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

export const HOURSX = [9, 10, 11, 12, 13, 14, 15, 16, 17]

export const DAY_NAMES = ['월', '화', '수', '목', '금']

export const BASE_NAMES = ['지민', '서연', '준호', '지수', '하늘', '도윤']

export const MAX_HEARTS = 3

export const DEADLINE_BASE = new Date(2026, 6, 6, 10, 0)
export const DL_DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export const PRESEED_OBJECTION = true

export const OBJ_CHIPS: string[] = []

export const LUNCH_HOUR = 12

export const HEAT_COLORS = ['#EDF3FA', '#C9E0FB', '#8FC1F9', '#4D95F7', '#1B64DA']

export function isLocked(di: number, hi: number, jisooOpt: boolean): boolean {
  return lockedAttendees(di, hi, jisooOpt).length > 0
}

export function lockedAttendees(di: number, hi: number, jisooOpt: boolean): string[] {
  if (di === 0 && hi <= 2) return ['서연', '준호']
  if (di === 2 && hi === 5) return ['지민']
  if (!jisooOpt && di === 4 && hi >= 7) return ['지수']
  return []
}

export function optBlockedAttendees(di: number, hi: number): string[] {
  return di === 2 && (hi === 0 || hi === 1) ? ['서연'] : []
}

export interface RecOption {
  id: 'r1' | 'r2' | 'r3'
  rank: number
  time: string
  short: string
  date: string
  range: string
  badges: string[]
  di: number
  hi: number
}

export function recOptions(reRec: boolean): RecOption[] {
  return reRec
    ? [
        { id: 'r1', rank: 1, time: '목요일 10:00 – 11:00', short: '목요일 10:00', date: '7월 9일 목요일', range: '10:00 – 11:00', badges: ['필수 4명 전원 가능', '선호 점수 10/12'], di: 3, hi: 1 },
        { id: 'r2', rank: 2, time: '수 16:00 – 17:00', short: '수요일 16:00', date: '7월 8일 수요일', range: '16:00 – 17:00', badges: ['필수 4명 전원 가능', '선호 점수 9/12'], di: 2, hi: 7 },
        { id: 'r3', rank: 3, time: '화 11:00 – 12:00', short: '화요일 11:00', date: '7월 7일 화요일', range: '11:00 – 12:00', badges: ['필수 4명 전원 가능', '선호 점수 8/12'], di: 1, hi: 2 },
      ]
    : [
        { id: 'r1', rank: 1, time: '화요일 15:00 – 16:00', short: '화요일 15:00', date: '7월 7일 화요일', range: '15:00 – 16:00', badges: ['필수 4명 전원 가능', '선호 점수 11/12'], di: 1, hi: 6 },
        { id: 'r2', rank: 2, time: '목 10:00 – 11:00', short: '목요일 10:00', date: '7월 9일 목요일', range: '10:00 – 11:00', badges: ['필수 4명 전원 가능', '선호 점수 10/12'], di: 3, hi: 1 },
        { id: 'r3', rank: 3, time: '수 16:00 – 17:00', short: '수요일 16:00', date: '7월 8일 수요일', range: '16:00 – 17:00', badges: ['필수 4명 전원 가능', '선호 점수 9/12'], di: 2, hi: 7 },
      ]
}

export function selectedRec(reRec: boolean, recSel: 'r1' | 'r2' | 'r3'): RecOption {
  return recOptions(reRec).find((o) => o.id === recSel) ?? recOptions(reRec)[0]
}

export function baseHeat(di: number, hi: number): number {
  if (di === 1 && hi === 6) return 1
  if (di === 3 && hi === 1) return 0.92
  if (di === 2 && hi === 7) return 0.85
  return ((Math.sin(di * 2.3 + hi * 0.8) + 1) / 2) * 0.62 + 0.08
}
