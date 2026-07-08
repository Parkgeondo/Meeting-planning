import { DEADLINE_BASE, DL_DAY_LABELS } from '../data'
import { rangeSummary } from '../range'
import { useStore } from '../state'
import { color } from '../tokens'
import { CTA, SectionLabel, SelChip, Toggle } from '../components/ui'

const LEN_CHIPS: [number, string][] = [
  [30, '30분'],
  [60, '1시간'],
  [90, '1.5시간'],
  [120, '2시간'],
]
const DL_CHIPS = ['24시간', '48시간', '직접 설정']

const fieldInput: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  height: 50,
  border: 'none',
  background: color.fill,
  borderRadius: 14,
  padding: '0 16px',
  fontWeight: 600,
  color: color.textPrimary,
  outline: 'none',
}

export function CreateMeeting() {
  const { state, set, go } = useStore()
  const s = state

  const due = new Date(DEADLINE_BASE)
  due.setHours(due.getHours() + s.dlCustom)
  const dueLabel =
    `${due.getMonth() + 1}/${due.getDate()} (${DL_DAY_LABELS[due.getDay()]}) ` +
    `${due.getHours() < 10 ? '0' : ''}${due.getHours()}:00 마감`

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '26px 22px 22px',
        animation: 'fadeUp .3s ease both',
      }}
    >
      <div style={{ fontSize: 23, fontWeight: 800, color: color.textPrimary, letterSpacing: '-.01em' }}>
        어떤 회의인가요?
      </div>

      <SectionLabel style={{ marginTop: 22 }}>회의 제목</SectionLabel>
      <input
        value={s.title}
        onChange={(e) => set({ title: e.target.value })}
        placeholder="6월 스프린트 회고"
        style={{ ...fieldInput, fontSize: 16 }}
      />

      <SectionLabel>무엇을 논의하나요?</SectionLabel>
      <input
        value={s.agenda}
        onChange={(e) => set({ agenda: e.target.value })}
        placeholder="회고 + 다음 스프린트 우선순위 결정"
        style={{ ...fieldInput, fontSize: 15 }}
      />
      <div style={{ fontSize: 12.5, color: color.textQuaternary, marginTop: 7, lineHeight: 1.5 }}>
        안건이 있으면 참석자가 자신의 참석 필요성을 판단할 수 있어요
      </div>

      <SectionLabel>회의 길이</SectionLabel>
      <div style={{ display: 'flex', gap: 6 }}>
        {LEN_CHIPS.map(([v, l]) => (
          <SelChip key={v} label={l} active={s.len === v} onClick={() => set({ len: v })} />
        ))}
      </div>

      <SectionLabel>후보 범위</SectionLabel>
      <div
        style={{
          background: color.fillLight,
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: color.textPrimary }}>
            {rangeSummary(s.range)}
          </div>
          <div
            onClick={() => set({ sheet: 'range' })}
            style={{
              fontSize: 12,
              color: color.primary,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '4px 6px',
              margin: '-4px -6px',
            }}
          >
            변경
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: color.textTertiary }}>점심시간(12–13시) 제외</div>
          <Toggle on={s.lunchOff} onClick={() => set({ lunchOff: !s.lunchOff })} />
        </div>
      </div>
      <div style={{ fontSize: 12, color: color.textQuaternary, marginTop: 7 }}>
        범위가 넓을수록 모두가 괜찮은 시간을 찾기 쉬워요
      </div>

      <SectionLabel>응답 기한</SectionLabel>
      <div style={{ display: 'flex', gap: 6 }}>
        {DL_CHIPS.map((d) => (
          <SelChip key={d} label={d} active={s.deadline === d} onClick={() => set({ deadline: d })} />
        ))}
      </div>
      {s.deadline === '직접 설정' && (
        <div
          style={{
            marginTop: 8,
            background: color.fillLight,
            borderRadius: 12,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'popIn .2s ease both',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StepBtn onClick={() => s.dlCustom > 1 && set({ dlCustom: s.dlCustom - 1 })}>−</StepBtn>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: color.textPrimary,
                minWidth: 56,
                textAlign: 'center',
              }}
            >
              {s.dlCustom}시간
            </div>
            <StepBtn onClick={() => s.dlCustom < 168 && set({ dlCustom: s.dlCustom + 1 })}>+</StepBtn>
          </div>
          <div style={{ fontSize: 12, color: color.textQuaternary, fontWeight: 600 }}>{dueLabel}</div>
        </div>
      )}

      <CTA onClick={() => go('s2')} style={{ marginTop: 'auto' }}>
        참석자 정하기
      </CTA>
    </div>
  )
}

function StepBtn({ children, onClick }: { children: string; onClick: () => void }) {
  return (
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
      {children}
    </button>
  )
}
