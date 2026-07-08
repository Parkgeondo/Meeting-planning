import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { BASE_NAMES } from './data'

export type Screen = 's1' | 's2' | 's3' | 's4pre' | 's4' | 's5' | 's6' | 's7'
export type Sheet = 'role' | 'info' | 'cell' | 'confirm' | 'submitted' | 'range' | null
export type Role = '필수' | '선택'
export type Week = '이번 주' | '다음 주' | '직접 선택'
export type OrgObjection = 'pending' | 'accepted' | 'kept'
export type StatusView = 'att' | 'org'

export interface RangeState {
  week: Week
  days: boolean[]
  start: number
  end: number
  /** Encoded selected dates: month*100 + day (e.g. 7/8 → 708). */
  dates: number[]
  month: number
}

/** Detail of the tapped heatmap cell (⑤ → cell sheet). */
export interface CellSel {
  dl: string
  hr: number
  locked: boolean
  heat: number
}

export interface AppState {
  screen: Screen
  title: string
  agenda: string
  len: number
  deadline: string
  dlCustom: number
  lunchOff: boolean
  range: RangeState
  roles: Record<string, Role>
  extra: string[]
  who: string
  addVal: string
  /** ④ STEP 1/2 attendee input. */
  xStep: 1 | 2
  xExcluded: Record<string, boolean>
  /** "되긴 해요" (soft-negative) cells painted in STEP 2. */
  xSoso: Record<string, boolean>
  xDrag: 'exclude' | 'restore' | 'soso' | 'unsoso' | null
  sheet: Sheet
  cellSel: CellSel | null
  /** Selected preset objection chip (필수 role sheet), or null. */
  objChip: number | null
  /** Free-text objection (필수 role sheet). */
  objText: string
  objSentByMe: boolean
  /** Name of the 선택 attendee who opted out, or null. */
  optOutBy: string | null
  orgObjection: OrgObjection
  responded: number
  confirmed: boolean
  bailed: boolean
  reRec: boolean
  statusView: StatusView
  copied: boolean
}

const initialState: AppState = {
  screen: 's1',
  title: '6월 스프린트 회고',
  agenda: '회고 + 다음 스프린트 우선순위 결정',
  len: 60,
  deadline: '48시간',
  dlCustom: 72,
  lunchOff: true,
  range: { week: '다음 주', days: [true, true, true, true, true], start: 10, end: 18, dates: [], month: 7 },
  roles: { 지민: '필수', 서연: '필수', 준호: '필수', 지수: '필수', 하늘: '선택', 도윤: '선택' },
  extra: [],
  who: '지수',
  addVal: '',
  xStep: 1,
  xExcluded: {},
  xSoso: {},
  xDrag: null,
  sheet: null,
  cellSel: null,
  objChip: null,
  objText: '',
  objSentByMe: false,
  optOutBy: null,
  orgObjection: 'pending',
  responded: 4,
  confirmed: false,
  bailed: false,
  reRec: false,
  statusView: 'att',
  copied: false,
}

interface Store {
  state: AppState
  /** Shallow-merge a patch (object) or updater function into state. */
  set: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState> | null)) => void
  /** Merge into `range`. */
  setRange: (patch: Partial<RangeState>) => void
  /** Navigate to a screen and close any open sheet. */
  go: (screen: Screen) => void
  /** All members = base roster + added extras. */
  names: string[]
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState)

  const store = useMemo<Store>(() => {
    const set: Store['set'] = (patch) =>
      setState((s) => {
        const next = typeof patch === 'function' ? patch(s) : patch
        return next ? { ...s, ...next } : s
      })
    return {
      state,
      set,
      setRange: (patch) => setState((s) => ({ ...s, range: { ...s.range, ...patch } })),
      go: (screen) => setState((s) => ({ ...s, screen, sheet: null })),
      names: BASE_NAMES.concat(state.extra),
    }
  }, [state])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
