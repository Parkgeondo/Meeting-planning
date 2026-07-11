import type { ReactNode } from 'react'
import { StoreProvider, useStore, type AttendeeScreen, type HostScreen, type Screen, type Sheet } from './state'
import { color } from './tokens'
import { CreateMeeting } from './screens/CreateMeeting'
import { AssignAttendees } from './screens/AssignAttendees'
import { Share } from './screens/Share'
import { WhoAreYou } from './screens/WhoAreYou'
import { KakaoChat } from './screens/KakaoChat'
import { InputGrid } from './screens/InputGrid'
import { Dashboard } from './screens/Dashboard'
import { Recommend } from './screens/Recommend'
import { Status } from './screens/Status'
import { Sheets } from './components/Sheets'

type NavChip = { label: string; screen: Screen }

const HOST_NAV: NavChip[] = [
  { label: '① 생성', screen: 's1' },
  { label: '② 지정', screen: 's2' },
  { label: '③ 공유', screen: 's3' },
  { label: '⑤ 집계 ★', screen: 's5' },
  { label: '⑥ 추천 ★', screen: 's6' },
  { label: '⑦ 상태', screen: 's7' },
]

const ATTENDEE_NAV: NavChip[] = [
  { label: '⓪ 카톡', screen: 's4kakao' },
  { label: '③.5 응답자', screen: 's4pre' },
  { label: '④ 입력 ★', screen: 's4' },
  { label: '⑤ 대시보드', screen: 's5att' },
  { label: '⑦ 상태', screen: 's7' },
]

const SHEET_OWNER: Record<Exclude<Sheet, null>, 'host' | 'attendee'> = {
  range: 'host',
  info: 'host',
  cell: 'host',
  confirm: 'host',
  role: 'attendee',
  submitted: 'attendee',
}

function FlowNav({
  title,
  chips,
  activeScreen,
  onSelect,
}: {
  title: string
  chips: NavChip[]
  activeScreen: Screen
  onSelect: (screen: Screen) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        background: '#fff',
        borderRadius: 19,
        padding: '4px 6px 4px 12px',
        boxShadow: '0 1px 3px rgba(0,0,0,.06)',
        maxWidth: 420,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 800, color: color.textQuaternary, flex: 'none' }}>{title}</span>
      {chips.map((chip) => {
        const active = activeScreen === chip.screen
        return (
          <button
            key={chip.label}
            onClick={() => onSelect(chip.screen)}
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
  )
}

function HostScreen() {
  const { state } = useStore()
  switch (state.hostScreen) {
    case 's1':
      return <CreateMeeting />
    case 's2':
      return <AssignAttendees />
    case 's3':
      return <Share />
    case 's5':
      return <Dashboard />
    case 's6':
      return <Recommend />
    case 's7':
      return <Status view="org" />
  }
}

function AttendeeScreen() {
  const { state } = useStore()
  switch (state.attendeeScreen) {
    case 's4kakao':
      return <KakaoChat />
    case 's4pre':
      return <WhoAreYou />
    case 's4':
      return <InputGrid />
    case 's5att':
      return <Dashboard attendeeView />
    case 's7':
      return <Status view="att" />
  }
}

function FrameSheets({ role }: { role: 'host' | 'attendee' }) {
  const { state } = useStore()
  if (!state.sheet) return null
  if (SHEET_OWNER[state.sheet] !== role) return null
  return <Sheets />
}

function PhoneFrame({
  label,
  nav: _nav,
  children,
  sheetsRole,
}: {
  label: string
  nav?: ReactNode
  children: ReactNode
  sheetsRole: 'host' | 'attendee'
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: color.textSecondary, letterSpacing: '-.01em' }}>{label}</div>
      {/* {_nav} */}
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
        {children}
        <FrameSheets role={sheetsRole} />
      </div>
    </div>
  )
}

function Frame() {
  const { state, set } = useStore()

  const goHost = (screen: Screen) =>
    set({
      hostScreen: screen as HostScreen,
      sheet: null,
      ...(screen === 's7' ? { statusView: 'org' as const } : {}),
    })

  const goAttendee = (screen: Screen) =>
    set({
      attendeeScreen: screen as AttendeeScreen,
      sheet: null,
      ...(screen === 's7' ? { statusView: 'att' as const } : {}),
    })

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 16px 48px',
        gap: 22,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: color.textQuaternary }}>v1.1</div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 28,
        }}
      >
        <PhoneFrame
          label="주최자 화면"
          sheetsRole="host"
          nav={<FlowNav title="주최자" chips={HOST_NAV} activeScreen={state.hostScreen} onSelect={goHost} />}
        >
          <HostScreen />
        </PhoneFrame>

        <PhoneFrame
          label="참석자 화면"
          sheetsRole="attendee"
          nav={<FlowNav title="참석자" chips={ATTENDEE_NAV} activeScreen={state.attendeeScreen} onSelect={goAttendee} />}
        >
          <AttendeeScreen />
        </PhoneFrame>
      </div>
      <div style={{ fontSize: 12, color: color.textQuaternary, textAlign: 'center', maxWidth: 520 }}>
        주최자가 카카오톡으로 공유하면 참석자 채팅방에 링크가 도착하고, 링크를 누르면 응답 화면으로 이동해요.
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
