import { StoreProvider, useStore, type Screen, type StatusView } from './state'
import { color } from './tokens'
import { CreateMeeting } from './screens/CreateMeeting'
import { AssignAttendees } from './screens/AssignAttendees'
import { Share } from './screens/Share'
import { WhoAreYou } from './screens/WhoAreYou'
import { InputGrid } from './screens/InputGrid'
import { Dashboard } from './screens/Dashboard'
import { Recommend } from './screens/Recommend'
import { Status } from './screens/Status'
import { Sheets } from './components/Sheets'

/** A nav chip either jumps to a screen, or to ⑦ with a specific status view. */
type NavChip = { label: string; screen: Screen; statusView?: StatusView }

const NAV_GROUPS: { name: string; chips: NavChip[] }[] = [
  {
    name: '주최자',
    chips: [
      { label: '① 생성', screen: 's1' },
      { label: '② 지정', screen: 's2' },
      { label: '③ 공유', screen: 's3' },
      { label: '⑤ 집계 ★', screen: 's5' },
      { label: '⑥ 추천 ★', screen: 's6' },
      { label: '⑦ 상태', screen: 's7', statusView: 'org' },
    ],
  },
  {
    name: '참석자',
    chips: [
      { label: '③.5 응답자', screen: 's4pre' },
      { label: '④ 입력 ★', screen: 's4' },
      { label: '⑦ 상태', screen: 's7', statusView: 'att' },
    ],
  },
]

function Nav() {
  const { state, set } = useStore()
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        maxWidth: 760,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700, color: color.textQuaternary }}>v1.1</span>
      {NAV_GROUPS.map((g) => (
        <div
          key={g.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#fff',
            borderRadius: 19,
            padding: '4px 6px 4px 12px',
            boxShadow: '0 1px 3px rgba(0,0,0,.06)',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 800, color: color.textQuaternary, flex: 'none' }}>{g.name}</span>
          {g.chips.map((chip) => {
            const active = chip.statusView
              ? state.screen === 's7' && state.statusView === chip.statusView
              : state.screen === chip.screen
            return (
              <button
                key={chip.label + (chip.statusView ?? '')}
                onClick={() =>
                  set({ screen: chip.screen, sheet: null, ...(chip.statusView ? { statusView: chip.statusView } : {}) })
                }
                style={{
                  height: 28,
                  padding: '0 10px',
                  borderRadius: 14,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 12,
                  fontWeight: 700,
                  background: active ? color.primary : color.fill,
                  color: active ? '#fff' : color.textSecondary,
                  transition: 'all .15s',
                }}
              >
                {chip.label}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function CurrentScreen() {
  const { state } = useStore()
  switch (state.screen) {
    case 's1':
      return <CreateMeeting />
    case 's2':
      return <AssignAttendees />
    case 's3':
      return <Share />
    case 's4pre':
      return <WhoAreYou />
    case 's4':
      return <InputGrid />
    case 's5':
      return <Dashboard />
    case 's6':
      return <Recommend />
    case 's7':
      return <Status />
  }
}

function Frame() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 16px 48px',
        gap: 18,
      }}
    >
      <Nav />
      <div
        style={{
          width: 375,
          minHeight: 760,
          background: '#fff',
          borderRadius: 28,
          boxShadow: '0 12px 40px rgba(25,31,40,.10)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <CurrentScreen />
        <Sheets />
      </div>
      <div style={{ fontSize: 12, color: color.textQuaternary }}>
        v1.1 명세 기반 · 3단계 응답 + 비공개 이의 채널 — 위 탭으로 화면 이동
      </div>
    </div>
  )
}

export function App() {
  return (
    <StoreProvider>
      <Frame />
    </StoreProvider>
  )
}
