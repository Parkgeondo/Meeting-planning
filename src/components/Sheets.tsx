import type { CSSProperties } from 'react'
import { DAY_NAMES, OBJ_CHIPS } from '../data'
import {
  MAX_MONTH,
  MIN_MONTH,
  activeDays,
  buildCalendar,
  fmtHour,
  toggleDates,
} from '../range'
import { useStore } from '../state'
import { color } from '../tokens'
import { BottomSheet } from './Sheet'
import { Toggle } from './ui'

export function Sheets() {
  const { state } = useStore()
  switch (state.sheet) {
    case 'role':
      return (state.roles[state.who] || '선택') === '필수' ? <RoleReqSheet /> : <RoleOptSheet />
    case 'info':
      return <InfoSheet />
    case 'range':
      return <RangeSheet />
    case 'cell':
      return <CellSheet />
    case 'confirm':
      return <ConfirmDialog />
    case 'submitted':
      return <SubmittedSheet />
    default:
      return null
  }
}

const sheetTitle: CSSProperties = { fontSize: 18, fontWeight: 800, color: color.textPrimary }

/** Close the sheet, discarding an unsent objection draft. */
function useCloseSheet() {
  const { set } = useStore()
  return () =>
    set((st) => ({ sheet: null, ...(st.objSentByMe ? {} : { objChip: null, objText: '' }) }))
}

/** 📋 회의 안건 card shared by both role sheets. */
function AgendaCard({ agenda }: { agenda: string }) {
  return (
    <div style={{ marginTop: 12, background: color.fillLight, borderRadius: 12, padding: 12 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: '#2F87FF', marginBottom: 4 }}>📋 회의 안건</div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: color.textPrimary, lineHeight: 1.5 }}>{agenda}</div>
    </div>
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

const ghostFull: CSSProperties = {
  marginTop: 8,
  width: '100%',
  height: 42,
  border: 'none',
  background: 'none',
  color: color.textQuaternary,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const peekNote: CSSProperties = { fontSize: 11.5, color: color.textDisabled, textAlign: 'center' }

/** ④ 역할 시트 — 필수 참석자: 비공개 이의(사유 칩/직접입력) 채널. */
function RoleReqSheet() {
  const { state, set } = useStore()
  const s = state
  const close = useCloseSheet()
  const who = s.who
  const agendaShown = s.agenda || s.title
  const objReady = s.objChip !== null || s.objText.trim().length > 0

  const chipStyle = (i: number): CSSProperties => ({
    width: '100%',
    textAlign: 'left',
    height: 44,
    padding: '0 14px',
    borderRadius: 12,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13.5,
    fontWeight: 600,
    border: s.objChip === i ? `1.5px solid ${color.primary}` : `1.5px solid ${color.border}`,
    background: s.objChip === i ? color.primaryLight : '#fff',
    color: s.objChip === i ? color.primaryDeep : color.textSecondary,
    transition: 'all .15s',
  })

  return (
    <BottomSheet onClose={close}>
      {!s.objSentByMe ? (
        <>
          <div style={{ fontSize: 18, fontWeight: 800, color: color.textPrimary, lineHeight: 1.4 }}>
            이 회의에서 {who}님은
            <br />
            <span style={{ color: color.primary }}>필수 참석</span>으로 지정됐어요
          </div>
          <AgendaCard agenda={agendaShown} />
          <div style={{ fontSize: 13.5, color: color.textTertiary, marginTop: 12, lineHeight: 1.6 }}>
            안건을 보고 참석이 꼭 필요하지 않다고 생각되면, <b style={{ color: color.textPrimary }}>주최자에게만</b>{' '}
            조용히 알릴 수 있어요. 다른 참석자에게는 보이지 않아요.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 16 }}>
            {OBJ_CHIPS.map((label, i) => (
              <button
                key={label}
                onClick={() => set((st) => ({ objChip: st.objChip === i ? null : i }))}
                style={chipStyle(i)}
              >
                {label}
              </button>
            ))}
            <input
              value={s.objText}
              onChange={(e) => set({ objText: e.target.value })}
              onFocus={() => set({ objChip: null })}
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
            onClick={() => objReady && set({ objSentByMe: true, orgObjection: 'pending' })}
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
            참석 필요성에 의견 보내기
          </button>
          <button onClick={close} style={ghostFull}>
            괜찮아요, 닫기
          </button>
          <div style={peekNote}>열어보기만 한 건 어디에도 기록되지 않아요</div>
        </>
      ) : (
        <>
          <div style={{ textAlign: 'center', paddingTop: 6, animation: 'popIn .3s ease both' }}>
            <CheckCircle />
            <div style={{ fontSize: 18, fontWeight: 800, color: color.textPrimary, marginTop: 14 }}>
              주최자에게만 전달됐어요
            </div>
            <div style={{ fontSize: 13.5, color: color.textTertiary, marginTop: 8, lineHeight: 1.6 }}>
              다른 참석자에게는 보이지 않아요.
              <br />
              참석하게 될 수도 있으니, 가능한 시간은 이어서 알려주세요.
            </div>
            <button onClick={() => set({ objSentByMe: false, objChip: null, objText: '' })} style={revertLink}>
              전송 취소
            </button>
          </div>
          <button
            onClick={close}
            style={{
              marginTop: 14,
              width: '100%',
              height: 50,
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
            시간 입력 계속하기
          </button>
        </>
      )}
    </BottomSheet>
  )
}

/** ④ 역할 시트 — 선택 참석자: 부담 없는 opt-out 채널. */
function RoleOptSheet() {
  const { state, set } = useStore()
  const s = state
  const close = useCloseSheet()
  const who = s.who
  const agendaShown = s.agenda || s.title
  const optedOut = s.optOutBy === who

  return (
    <BottomSheet onClose={close}>
      {!optedOut ? (
        <>
          <div style={{ fontSize: 18, fontWeight: 800, color: color.textPrimary, lineHeight: 1.4 }}>
            이 회의에서 {who}님은
            <br />
            <span style={{ color: color.primary }}>선택 참석</span>이에요
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: color.textPrimary, marginTop: 10, lineHeight: 1.55 }}>
            참석하지 않아도 괜찮아요.
            <br />
            사유를 말할 필요도 없어요.
          </div>
          <AgendaCard agenda={agendaShown} />
          <div style={{ fontSize: 12.5, color: color.textQuaternary, marginTop: 12, lineHeight: 1.6 }}>
            {who}님의 시간은 참고로 반영돼요 — {who}님이 어려운 시간에도 회의가 잡힐 수 있어요
          </div>
          <button
            onClick={() => set({ optOutBy: who })}
            style={{
              marginTop: 16,
              width: '100%',
              height: 48,
              border: 'none',
              borderRadius: 14,
              background: color.fill,
              color: color.textPrimary,
              fontSize: 14.5,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            이번엔 빠질게요
          </button>
          <button onClick={close} style={ghostFull}>
            괜찮아요, 닫기
          </button>
          <div style={peekNote}>열어보기만 한 건 어디에도 기록되지 않아요</div>
        </>
      ) : (
        <>
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
          <button
            onClick={() => set({ attendeeScreen: 's4', sheet: null })}
            style={{
              marginTop: 14,
              width: '100%',
              height: 50,
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
            혹시 몰라 가능한 시간 남기기
          </button>
          <button onClick={close} style={ghostFull}>
            건너뛰고 닫기
          </button>
        </>
      )}
    </BottomSheet>
  )
}

/** Green success check used in both role-sheet confirmations. */
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
      <div style={{ fontSize: 14, color: color.textSecondary, marginTop: 12, lineHeight: 1.7 }}>
        필수 참석자가 안 되는 시간은 후보에서 제외돼요. <br/>선택 참석자의 시간은 참고로 반영돼요.
        <br />
        <br />
        {/* <b style={{ color: color.textPrimary }}>지정이 확실하지 않아도 괜찮아요</b> — 참석자가 다르게 생각하면
        주최자님에게만 조용히 의견을 보낼 수 있어요. */}
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

  let title = ''
  let body = ''
  if (cs) {
    title = `${cs.dl} ${cs.hr}:00 – ${cs.hr + 1}:00`
    if (cs.locked) body = '필수 참석자가 어려운 시간이에요.'
    else {
      const soso = Math.max(0, Math.round((1 - cs.heat) * 2))
      body =
        `✅ ${state.responded}명 모두 가능` +
        (soso > 0 ? ` · 🟡 ${soso}명은 선호하지 않아요` : " · 아무도 '되긴 해요'를 고르지 않았어요")
    }
  }

  return (
    <BottomSheet onClose={close}>
      <div style={{ fontSize: 19, fontWeight: 800, color: color.textPrimary }}>{title}</div>
      <div style={{ fontSize: 14.5, color: color.textSecondary, marginTop: 10, lineHeight: 1.7 }}>{body}</div>
      <div style={{ fontSize: 12, color: color.textDisabled, marginTop: 10 }}>
        집계만 보여요 · 명단은 누구에게도 보이지 않아요
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

function ConfirmDialog() {
  const { state, set } = useStore()
  const close = () => set({ sheet: null })
  const confirmLabel = state.reRec ? '목요일 10:00' : '화요일 15:00'
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
            set({ confirmed: true, sheet: null, attendeeScreen: 's4kakao', linkShared: true })
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
        기한 전까지 이 링크에서 수정할 수 있어요
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

function RangeSheet() {
  const { state, set, setRange } = useStore()
  const r = state.range
  const close = () => set({ sheet: null })
  const onDays = activeDays(r)
  const custom = r.week === '직접 선택'
  const calCells = buildCalendar(r, (days) => setRange({ dates: toggleDates(r, days) }))
  const rangeNarrow = custom ? r.dates.length > 0 && r.dates.length <= 2 : onDays.length <= 2

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

      <div style={{ fontSize: 12.5, fontWeight: 600, color: color.textQuaternary, margin: '18px 0 8px' }}>주간</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {(['이번 주', '다음 주', '직접 선택'] as const).map((w) =>
          smallChip(w, r.week === w, () => setRange({ week: w })),
        )}
      </div>

      {rangeNarrow && (
        <div
          style={{
            marginTop: 14,
            background: '#FFF3D6',
            borderRadius: 12,
            padding: '11px 13px',
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
            animation: 'popIn .25s ease both',
          }}
        >
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>⚠️</div>
          <div style={{ fontSize: 12.5, color: '#8A6116', fontWeight: 600, lineHeight: 1.5 }}>
            후보가 좁으면 모두가 괜찮은 시간을 찾기 어렵고, 누군가 못 오게 됐을 때 대안도 부족해져요
          </div>
        </div>
      )}

      {custom && (
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
      )}

      {!custom && (
        <>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: color.textQuaternary, margin: '16px 0 8px' }}>요일</div>
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
          <div style={{ fontSize: 12, color: color.textQuaternary, marginTop: 7 }}>안 되는 요일만 꺼주세요</div>
        </>
      )}

      <div style={{ fontSize: 12.5, fontWeight: 600, color: color.textQuaternary, margin: '16px 0 8px' }}>시간 범위</div>
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
