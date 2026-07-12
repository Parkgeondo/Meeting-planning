import { useEffect, useState, type CSSProperties } from 'react'
import { DAY_NAMES, selectedRec } from '../data'
import {
  MAX_MONTH,
  MIN_MONTH,
  activeDays,
  buildCalendar,
  fmtHour,
  toggleDates,
} from '../range'
import { useStore, type Sheet } from '../state'
import { avatarColor, color } from '../tokens'
import { BottomSheet, SheetClosingContext } from './Sheet'
import { Collapse, Toggle } from './ui'
import lockIcon from '../assets/lock.png'
import checkGreenIcon from '../assets/check-green.png'
import clipboardIcon from '../assets/clipboard.png'
import clockIcon from '../assets/clock.png'

const SHEET_OWNER: Record<Exclude<Sheet, null>, 'host' | 'attendee'> = {
  range: 'host',
  info: 'host',
  cell: 'host',
  confirm: 'host',
  role: 'attendee',
  submitted: 'attendee',
  bail: 'attendee',
}

export function Sheets({ role }: { role: 'host' | 'attendee' }) {
  const { state } = useStore()
  const owner = state.sheet === 'cell' ? state.cellFrom : state.sheet ? SHEET_OWNER[state.sheet] : null
  const active = state.sheet && owner === role ? state.sheet : null

  const [shown, setShown] = useState<Sheet>(active)

  useEffect(() => {
    if (active) setShown(active)
  }, [active])

  useEffect(() => {
    if (active || !shown) return
    const t = setTimeout(() => setShown(null), 270)
    return () => clearTimeout(t)
  }, [active, shown])

  const shownNow = active ?? shown
  const closing = !active && !!shown
  if (!shownNow) return null

  let node: JSX.Element | null
  switch (shownNow) {
    case 'role':
      node = (state.roles[state.who] || '선택') === '필수' ? <RoleReqSheet /> : <RoleOptSheet />
      break
    case 'info':
      node = <InfoSheet />
      break
    case 'range':
      node = <RangeSheet />
      break
    case 'cell':
      node = <CellSheet />
      break
    case 'confirm':
      node = <ConfirmDialog />
      break
    case 'submitted':
      node = <SubmittedSheet />
      break
    case 'bail':
      node = <BailSheet />
      break
    default:
      node = null
  }

  return <SheetClosingContext.Provider value={closing}>{node}</SheetClosingContext.Provider>
}

const sheetTitle: CSSProperties = { fontSize: 18, fontWeight: 800, color: color.textPrimary }

function useCloseSheet() {
  const { set } = useStore()
  return () =>
    set((st) => ({ sheet: null, ...(st.objSentByMe ? {} : { objChip: null, objText: '' }) }))
}

function AgendaCard({ agenda }: { agenda: string }) {
  return (
    <div style={{ marginTop: 12, background: color.fillLight, borderRadius: 12, padding: 12 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 11.5,
          fontWeight: 700,
          color: '#2F87FF',
          marginBottom: 4,
        }}
      >
        <img src={clipboardIcon} alt="" width={14} height={14} style={{ flex: 'none' }} />
        회의 안건
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: color.textPrimary, lineHeight: 1.5 }}>{agenda}</div>
    </div>
  )
}

function RoleBadge({ children, tone = 'optional' }: { children: string; tone?: 'required' | 'optional' }) {
  const required = tone === 'required'
  return (
    <span
      style={{
        background: required ? '#EAF3FE' : '#F2F4F6',
        color: required ? '#3182F6' : '#4E5968',
        borderRadius: 6,
        padding: '4px 8px',
        fontSize: 14.5,
      }}
    >
      {children}
    </span>
  )
}

const revertLink: CSSProperties = {
  marginTop: 12,
  height: 36,
  padding: '0 14px',
  border: 'none',
  background: 'none',
  color: color.textQuaternary,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  textDecoration: 'underline',
  textUnderlineOffset: 3,
}

function RoleReqSheet() {
  const { state, set } = useStore()
  const s = state
  const close = useCloseSheet()
  const who = s.who
  const agendaShown = s.agenda || s.title
  const objReady = s.objText.trim().length > 0

  return (
    <BottomSheet onClose={close}>
      {!s.objSentByMe ? (
        <>
          <div style={{ fontSize: 18, fontWeight: 800, color: color.textPrimary, lineHeight: 1.4 }}>
            이 회의에서 {who}님은
            <br />
            <RoleBadge tone="required">필수 참석</RoleBadge>으로 지정됐어요
          </div>
          <AgendaCard agenda={agendaShown} />
          <div style={{ fontSize: 13.5, color: color.textTertiary, marginTop: 12, lineHeight: 1.6, padding: '0 2px' }}>
            안건을 보고 참석이 필요하지 않다고 생각이 되면 주최자에게 선택 참석 변경을 요청할 수 있어요.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 16 }}>
            <input
              value={s.objText}
              onChange={(e) => set({ objText: e.target.value, objChip: null })}
              placeholder="예: 이번 안건은 지난 회의에서 이미 공유받았어요"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                height: 44,
                padding: '0 14px',
                borderRadius: 12,
                fontFamily: 'inherit',
                fontSize: 13.5,
                fontWeight: 600,
                outline: 'none',
                border: s.objText.trim() ? `1.5px solid ${color.primary}` : `1.5px solid ${color.border}`,
                background: s.objText.trim() ? color.primaryLight : '#fff',
                color: color.textPrimary,
              }}
            />
          </div>
          <button
            onClick={() => objReady && set({ objSentByMe: true, orgObjection: 'pending', hostScreen: 's5' })}
            style={{
              marginTop: 14,
              width: '100%',
              height: 48,
              border: 'none',
              borderRadius: 14,
              background: objReady ? color.primary : '#DEE3E8',
              color: objReady ? '#fff' : color.textQuaternary,
              fontSize: 15,
              fontWeight: 700,
              cursor: objReady ? 'pointer' : 'default',
              fontFamily: 'inherit',
              transition: 'all .2s',
            }}
          >
            선택 참석 변경 요청하기
          </button>
        </>
      ) : (
        <>
          <div style={{ textAlign: 'center', paddingTop: 6, animation: 'popIn .3s ease both' }}>
            <CheckCircle />
            <div style={{ fontSize: 18, fontWeight: 800, color: color.textPrimary, marginTop: 14 }}>
              주최자에게 의견을 전달했어요
            </div>
            <div style={{ fontSize: 13.5, color: color.textTertiary, marginTop: 8, lineHeight: 1.6 }}>
              참석하게 될 수도 있으니, 가능한 시간은 이어서 알려주세요.
            </div>
            <button onClick={() => set({ objSentByMe: false, objChip: null, objText: '' })} style={revertLink}>
              전송 취소
            </button>
          </div>
        </>
      )}
    </BottomSheet>
  )
}

function RoleOptSheet() {
  const { state, set } = useStore()
  const s = state
  const close = useCloseSheet()
  const who = s.who
  const agendaShown = s.agenda || s.title
  const optedOut = s.optOutBy === who
  const reqReady = s.objText.trim().length > 0

  return (
    <BottomSheet onClose={close}>
      {optedOut ? (
        <div style={{ textAlign: 'center', paddingTop: 6, animation: 'popIn .3s ease both' }}>
          <CheckCircle />
          <div style={{ fontSize: 18, fontWeight: 800, color: color.textPrimary, marginTop: 14 }}>
            주최자에게 전달됐어요
          </div>
          <div style={{ fontSize: 13.5, color: color.textTertiary, marginTop: 8 }}>사유는 묻지 않아요.</div>
          <button onClick={() => set({ optOutBy: null })} style={revertLink}>
            되돌리기
          </button>
        </div>
      ) : s.objSentByMe ? (
        <div style={{ textAlign: 'center', paddingTop: 6, animation: 'popIn .3s ease both' }}>
          <CheckCircle />
          <div style={{ fontSize: 18, fontWeight: 800, color: color.textPrimary, marginTop: 14 }}>
            주최자에게 의견을 전달했어요
          </div>
          <div style={{ fontSize: 13.5, color: color.textTertiary, marginTop: 8, lineHeight: 1.6 }}>
            참석하게 될 수도 있으니, 가능한 시간은 이어서 알려주세요.
          </div>
          <button onClick={() => set({ objSentByMe: false, objChip: null, objText: '' })} style={revertLink}>
            전송 취소
          </button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 18, fontWeight: 800, color: color.textPrimary, lineHeight: 1.4 }}>
            이 회의에서 {who}님은
            <br />
            <RoleBadge>선택 참석</RoleBadge>이에요
          </div>
          <AgendaCard agenda={agendaShown} />
          <div style={{ fontSize: 13.5, color: color.textTertiary, marginTop: 12, lineHeight: 1.6, padding: '0 2px' }}>
            안건을 보고 꼭 참석해야 한다고 생각이 되면 주최자에게 필수 참석 변경을 요청할 수 있어요.
          </div>
          <input
            value={s.objText}
            onChange={(e) => set({ objText: e.target.value, objChip: null })}
            placeholder="예: 이번 안건은 제 담당 업무와 직접 관련이 있어요"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              height: 44,
              marginTop: 14,
              padding: '0 14px',
              borderRadius: 12,
              fontFamily: 'inherit',
              fontSize: 13.5,
              fontWeight: 600,
              outline: 'none',
              border: s.objText.trim() ? `1.5px solid ${color.primary}` : `1.5px solid ${color.border}`,
              background: s.objText.trim() ? color.primaryLight : '#fff',
              color: color.textPrimary,
            }}
          />
          <button
            onClick={() => reqReady && set({ objSentByMe: true })}
            style={{
              marginTop: 14,
              width: '100%',
              height: 48,
              border: 'none',
              borderRadius: 14,
              background: reqReady ? color.primary : '#DEE3E8',
              color: reqReady ? '#fff' : color.textQuaternary,
              fontSize: 15,
              fontWeight: 700,
              cursor: reqReady ? 'pointer' : 'default',
              fontFamily: 'inherit',
              transition: 'all .2s',
            }}
          >
            필수 참석으로 변경 요청하기
          </button>
        </>
      )}
    </BottomSheet>
  )
}

function CheckCircle() {
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: '#E9F8F0',
        color: color.successDeep,
        fontSize: 24,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
      }}
    >
      ✓
    </div>
  )
}

function InfoSheet() {
  const { set } = useStore()
  const close = () => set({ sheet: null })
  return (
    <BottomSheet onClose={close}>
      <div style={{ fontSize: 17, fontWeight: 800, color: color.textPrimary }}>필수와 선택, 뭐가 다른가요?</div>
      <div style={{ fontSize: 14, color: color.textSecondary, marginTop: 12, lineHeight: 1.6 }}>
        필수 참석자가 안 되는 시간은 후보에서 제외돼요. <br/>선택 참석자의 시간은 참고로 반영돼요.
        <br />
        <br />
      </div>
      <button
        onClick={close}
        style={{
          marginTop: 18,
          width: '100%',
          height: 48,
          border: 'none',
          borderRadius: 14,
          background: color.primary,
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        알겠어요
      </button>
    </BottomSheet>
  )
}

function CellSheet() {
  const { state, set } = useStore()
  const cs = state.cellSel
  const close = () => set({ sheet: null })

  if (!cs) return null

  const title = `${cs.dl} ${cs.hr}:00 – ${cs.hr + 1}:00`
  const blockedBy = cs.blockedBy ?? []

  if (cs.locked) {
    return (
      <BottomSheet onClose={close}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 9,
              background: color.fill,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <img src={lockIcon} alt="" width={15} height={15} />
          </div>
          <div style={{ fontSize: 19, fontWeight: 800, color: color.textPrimary, letterSpacing: '-.01em' }}>
            {title}
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            background: '#FFF6F3',
            borderRadius: 16,
            padding: '14px 14px 12px',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: color.heart, letterSpacing: '-.01em' }}>
            후보에서 제외된 시간
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: color.textPrimary, marginTop: 6, lineHeight: 1.5 }}>
            필수 참석자 {blockedBy.length}명이 어려운 시간이에요
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {blockedBy.map((name, i) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: '#fff',
                  borderRadius: 12,
                  padding: '10px 12px',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: avatarColor(name, i),
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    flex: 'none',
                  }}
                >
                  {name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: color.textPrimary }}>{name}</div>
                  <div style={{ fontSize: 12, color: color.textQuaternary, marginTop: 2, fontWeight: 600 }}>
                    필수 · 이 시간 불가
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: color.heart,
                    background: color.heartLight,
                    borderRadius: 10,
                    padding: '4px 8px',
                    flex: 'none',
                  }}
                >
                  불가
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12.5, color: color.textQuaternary, marginTop: 12, lineHeight: 1.5, fontWeight: 600 }}>
          필수 참석자가 모두 가능한 시간만 추천 후보에 올라가요
        </div>

        <button
          onClick={close}
          style={{
            marginTop: 16,
            width: '100%',
            height: 48,
            border: 'none',
            borderRadius: 14,
            background: color.fill,
            color: color.textSecondary,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          닫기
        </button>
      </BottomSheet>
    )
  }

  const optBlocked = cs.optBlocked ?? []
  const hasOpt = optBlocked.length > 0

  return (
    <BottomSheet onClose={close}>
      <div style={{ fontSize: 19, fontWeight: 800, color: color.textPrimary }}>{title}</div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 14.5,
          color: color.textSecondary,
          marginTop: 10,
          lineHeight: 1.6,
        }}
      >
        <img src={checkGreenIcon} alt="" width={16} height={16} style={{ flex: 'none' }} />
        {hasOpt ? '필수 참석자는 모두 가능해요' : `${state.responded}명 모두 가능`}
      </div>
      {hasOpt && (
        <>
          <div
            style={{
              marginTop: 12,
              background: color.fillLight,
              borderRadius: 16,
              padding: '14px 14px 12px',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: color.textQuaternary, letterSpacing: '-.01em' }}>
              후보에는 남아있는 시간
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: color.textPrimary, marginTop: 6, lineHeight: 1.5 }}>
              선택 참석자 {optBlocked.length}명이 어려운 시간이에요
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {optBlocked.map((name, i) => (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#fff',
                    borderRadius: 12,
                    padding: '10px 12px',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: avatarColor(name, i),
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      flex: 'none',
                    }}
                  >
                    {name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: color.textPrimary }}>{name}</div>
                    <div style={{ fontSize: 12, color: color.textQuaternary, marginTop: 2, fontWeight: 600 }}>
                      선택 · 이 시간 불가
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      color: color.textQuaternary,
                      background: color.fill,
                      borderRadius: 10,
                      padding: '4px 8px',
                      flex: 'none',
                    }}
                  >
                    불가
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 12.5, color: color.textQuaternary, marginTop: 12, lineHeight: 1.5, fontWeight: 600 }}>
            선택 참석자의 시간은 참고로만 반영돼요.
          </div>
        </>
      )}
      <button
        onClick={close}
        style={{
          marginTop: 16,
          width: '100%',
          height: 48,
          border: 'none',
          borderRadius: 14,
          background: color.fill,
          color: color.textSecondary,
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        닫기
      </button>
    </BottomSheet>
  )
}

function ConfirmDialog() {
  const { state, set } = useStore()
  const close = () => set({ sheet: null })
  const confirmLabel = selectedRec(state.reRec, state.recSel).short
  return (
    <BottomSheet onClose={close} center>
      <div style={{ fontSize: 18, fontWeight: 800, color: color.textPrimary }}>{confirmLabel}으로 확정할까요?</div>
      <div style={{ fontSize: 13.5, color: color.textTertiary, marginTop: 8, lineHeight: 1.6 }}>
        확정하면 참석자 모두에게
        <br />
        알림 링크가 공유돼요
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        <button
          onClick={close}
          style={{
            flex: 1,
            height: 46,
            border: 'none',
            borderRadius: 13,
            background: color.fill,
            color: color.textSecondary,
            fontSize: 14.5,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          취소
        </button>
        <button
          onClick={() =>
            set({
              confirmed: true,
              sheet: null,
              hostScreen: 's7',
              statusView: 'org',
              attendeeScreen: 's4kakao',
              linkShared: true,
            })
          }
          style={{
            flex: 1,
            height: 46,
            border: 'none',
            borderRadius: 13,
            background: color.primary,
            color: '#fff',
            fontSize: 14.5,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          확정
        </button>
      </div>
    </BottomSheet>
  )
}

function SubmittedSheet() {
  const { set } = useStore()
  const close = () => set({ sheet: null })
  return (
    <BottomSheet onClose={close}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#E9F8F0',
          color: color.successDeep,
          fontSize: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          animation: 'popIn .35s cubic-bezier(.2,1.6,.4,1) both',
        }}
      >
        ✓
      </div>
      <div style={{ fontSize: 19, fontWeight: 800, color: color.textPrimary, marginTop: 14, textAlign: 'center' }}>
        응답이 제출됐어요
      </div>
      <div style={{ fontSize: 13.5, color: color.textTertiary, marginTop: 6, lineHeight: 1.6, textAlign: 'center' }}>
        기한 및 확정 전까지 이 링크에서 수정할 수 있어요
      </div>
      <button
        onClick={() => set((st) => ({ attendeeScreen: 's5att', sheet: null, responded: Math.max(st.responded, 5) }))}
        style={{
          marginTop: 16,
          width: '100%',
          height: 48,
          border: 'none',
          borderRadius: 14,
          background: color.primary,
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        주최자 대시보드 보기 →
      </button>
    </BottomSheet>
  )
}

function BailSheet() {
  const { set } = useStore()
  const close = () => set({ sheet: null })
  return (
    <BottomSheet onClose={close}>
      <div style={{ fontSize: 18, fontWeight: 800, color: color.textPrimary, lineHeight: 1.4 }}>
        혹시 일정이 바뀌어도,
        대안이 준비돼 있어요
      </div>
      <div style={{ fontSize: 13.5, color: color.textTertiary, marginTop: 10, lineHeight: 1.6, padding: '0 2px' }}>
        응답을 다시 모으지 않고, 후보 시간으로 대안을 준비해드려요.
      </div>
      <div
        style={{
          marginTop: 12,
          background: color.fillLight,
          borderRadius: 12,
          padding: 12,
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
        }}
      >
        <img src={clockIcon} alt="" width={16} height={16} style={{ flex: 'none', marginTop: 1 }} />
        <div style={{ fontSize: 12.5, fontWeight: 600, color: color.textSecondary, lineHeight: 1.5 }}>
          이미 목요일 10시, 수요일 16시 같은 대안 후보가 준비돼 있어요
        </div>
      </div>
      <button
        onClick={() => set({ bailed: true, sheet: null })}
        style={{
          marginTop: 16,
          width: '100%',
          height: 48,
          border: 'none',
          borderRadius: 14,
          background: color.primary,
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        주최자에게 알리기
      </button>
    </BottomSheet>
  )
}

function RangeSheet() {
  const { state, set, setRange } = useStore()
  const r = state.range
  const close = () => set({ sheet: null })
  const onDays = activeDays(r)
  const custom = r.week === '직접 선택'
  const calCells = buildCalendar(r, (days) => setRange({ dates: toggleDates(r, days) }))
  const rangeNarrow = custom ? r.dates.length <= 2 : onDays.length <= 2

  const arrowStyle = (enabled: boolean): CSSProperties => ({
    width: 26,
    height: 26,
    border: 'none',
    borderRadius: 8,
    padding: 0,
    background: color.fill,
    color: enabled ? color.textSecondary : color.borderDashed,
    fontSize: 14,
    fontWeight: 800,
    cursor: enabled ? 'pointer' : 'default',
    fontFamily: 'inherit',
  })

  const smallChip = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        flex: 1,
        height: 38,
        borderRadius: 11,
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 13,
        fontWeight: 700,
        border: active ? `1.5px solid ${color.primary}` : `1.5px solid ${color.border}`,
        background: active ? color.primaryLight : '#fff',
        color: active ? color.primary : color.textTertiary,
        transition: 'all .15s',
        padding: 0,
      }}
    >
      {label}
    </button>
  )

  const stepBtn = (label: string, onClick: () => void) => (
    <button
      onClick={onClick}
      style={{
        width: 30,
        height: 30,
        border: 'none',
        borderRadius: 9,
        background: color.fill,
        color: color.textSecondary,
        fontSize: 16,
        fontWeight: 800,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  )

  const timeCell = (
    caption: string,
    value: string,
    onDown: () => void,
    onUp: () => void,
  ) => (
    <div
      style={{
        flex: 1,
        height: 48,
        background: color.fillLight,
        borderRadius: 12,
        padding: '0 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
      }}
    >
      {stepBtn('−', onDown)}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10.5, color: color.textQuaternary, fontWeight: 600 }}>{caption}</div>
        <div style={{ fontSize: 14.5, fontWeight: 800, color: color.textPrimary }}>{value}</div>
      </div>
      {stepBtn('+', onUp)}
    </div>
  )

  return (
    <BottomSheet onClose={close}>
      <div style={sheetTitle}>후보 범위</div>

      <div style={{ fontSize: 12.5, fontWeight: 600, color: color.textQuaternary, margin: '18px 0 8px', padding: '0 2px' }}>주간</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {(['이번 주', '다음 주', '직접 선택'] as const).map((w) =>
          smallChip(w, r.week === w, () => setRange({ week: w })),
        )}
      </div>

      <Collapse open={rangeNarrow}>
        <div
          style={{
            marginTop: 14,
            background: '#FFF3D6',
            borderRadius: 12,
            padding: '11px 13px',
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
          }}
        >
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>⚠️</div>
          <div style={{ fontSize: 12.5, color: '#8A6116', fontWeight: 600, lineHeight: 1.5 }}>
            후보가 좁으면 모두가 괜찮은 시간을 찾기 어렵고, 누군가 못 오게 됐을 때 대안도 부족해져요
          </div>
        </div>
      </Collapse>

      <Collapse open={custom}>
        <div style={{ marginTop: 14, background: color.fillLight, borderRadius: 14, padding: '12px 10px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 6px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: color.textPrimary }}>2026년 {r.month}월</div>
              <div style={{ fontSize: 11.5, color: color.textQuaternary, fontWeight: 600 }}>
                {r.dates.length === 0 ? '날짜를 탭하세요' : `${r.dates.length}일 선택`}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={() => r.month > MIN_MONTH && setRange({ month: r.month - 1 })}
                style={arrowStyle(r.month > MIN_MONTH)}
              >
                ‹
              </button>
              <button
                onClick={() => r.month < MAX_MONTH && setRange({ month: r.month + 1 })}
                style={arrowStyle(r.month < MAX_MONTH)}
              >
                ›
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '30px repeat(7,1fr)', gap: 2, marginBottom: 2 }}>
            {['', '일', '월', '화', '수', '목', '금', '토'].map((h, i) => (
              <div
                key={i}
                style={{ textAlign: 'center', fontSize: 10.5, color: color.textDisabled, fontWeight: 700, padding: '2px 0' }}
              >
                {h}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '30px repeat(7,1fr)', gap: 2 }}>
            {calCells.map((c) => {
              if (c.variant === 'pad') return <div key={c.key} style={{ height: 32 }} />
              if (c.variant === 'weekSelect') {
                return (
                  <div
                    key={c.key}
                    onClick={c.onClick ?? undefined}
                    style={{
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10.5,
                      fontWeight: 700,
                      borderRadius: 9,
                      cursor: c.selectable ? 'pointer' : 'default',
                      background: c.allOn ? color.primaryLight : color.fill,
                      color: !c.selectable ? color.borderDashed : c.allOn ? color.primary : color.textQuaternary,
                      transition: 'all .12s',
                    }}
                  >
                    {c.label}
                  </div>
                )
              }
              return (
                <div
                  key={c.key}
                  onClick={c.onClick ?? undefined}
                  style={{
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12.5,
                    fontWeight: c.selected ? 800 : 600,
                    borderRadius: 9,
                    cursor: c.past ? 'default' : 'pointer',
                    background: c.selected ? color.primary : 'transparent',
                    color: c.past ? color.borderDashed : c.selected ? '#fff' : color.textSecondary,
                    transition: 'all .12s',
                  }}
                >
                  {c.label}
                </div>
              )
            })}
          </div>
        </div>
      </Collapse>

      <Collapse open={!custom}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: color.textQuaternary, margin: '16px 0 8px', padding: '0 2px' }}>요일</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {DAY_NAMES.map((d, i) => {
              const on = r.days[i]
              return (
                <button
                  key={d}
                  onClick={() => {
                    if (r.days[i] && onDays.length === 1) return
                    const days = r.days.slice()
                    days[i] = !days[i]
                    setRange({ days })
                  }}
                  style={{
                    flex: 1,
                    height: 38,
                    borderRadius: 11,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 700,
                    padding: 0,
                    border: on ? `1.5px solid ${color.primary}` : `1.5px solid ${color.border}`,
                    background: on ? color.primary : '#fff',
                    color: on ? '#fff' : color.textQuaternary,
                    transition: 'all .15s',
                  }}
                >
                  {d}
                </button>
              )
            })}
          </div>
          <div style={{ fontSize: 12, color: color.textQuaternary, marginTop: 7, padding: '0 2px' }}>안 되는 요일만 꺼주세요</div>
        </div>
      </Collapse>

      <div style={{ fontSize: 12.5, fontWeight: 600, color: color.textQuaternary, margin: '16px 0 8px', padding: '0 2px' }}>시간 범위</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {timeCell(
          '시작',
          fmtHour(r.start),
          () => r.start > 7 && setRange({ start: r.start - 1 }),
          () => r.start < r.end - 1 && setRange({ start: r.start + 1 }),
        )}
        {timeCell(
          '종료',
          fmtHour(r.end),
          () => r.end > r.start + 1 && setRange({ end: r.end - 1 }),
          () => r.end < 22 && setRange({ end: r.end + 1 }),
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <div style={{ fontSize: 13.5, color: color.textSecondary, fontWeight: 600 }}>점심시간(12–13시) 제외</div>
        <Toggle on={state.lunchOff} onClick={() => set((st) => ({ lunchOff: !st.lunchOff }))} />
      </div>

      <button
        onClick={close}
        style={{
          marginTop: 18,
          width: '100%',
          height: 52,
          border: 'none',
          borderRadius: 15,
          background: color.primary,
          color: '#fff',
          fontSize: 15.5,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        적용하기
      </button>
    </BottomSheet>
  )
}
