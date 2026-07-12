import { recOptions, type RecOption } from '../data'
import { useStore } from '../state'
import { color } from '../tokens'

function Radio({ selected }: { selected: boolean }) {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        boxSizing: 'border-box',
        background: '#fff',
        border: selected ? `7px solid ${color.primary}` : `2px solid ${color.borderDashed}`,
        transition: 'border .15s',
        flex: 'none',
      }}
    />
  )
}

function ViewTimeBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      style={{
        height: 28,
        padding: '0 11px',
        border: `1px solid ${color.border}`,
        borderRadius: 14,
        background: '#fff',
        color: color.textSecondary,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        flex: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      시간 보기 →
    </button>
  )
}

export function Recommend() {
  const { state, set, go } = useStore()
  const s = state

  const recs = recOptions(s.reRec)
  const rec1 = recs[0]
  const rec23 = recs.slice(1)
  const rec1Line = s.reRec
    ? '지수님을 제외한 응답으로 다시 계산한 결과예요.'
    : '모두 가능하면서, 아무도 참지 않아도 되는 유일한 시간이에요.'

  const viewTime = (r: RecOption) => set({ hostScreen: 's5', hlCell: `${r.di}-${r.hi}`, sheet: null })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '26px 15px 22px',
        animation: 'fadeUp .3s ease both',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => go('s5')}
          aria-label="집계로 돌아가기"
          style={{
            width: 28,
            height: 28,
            border: 'none',
            background: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 5L8 12L15 19" stroke="#26343F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ fontSize: 23, fontWeight: 800, color: color.textPrimary, letterSpacing: '-.01em' }}>
          이 시간이 가장 괜찮아요
        </div>
      </div>
      {s.reRec && (
        <div
          style={{
            marginTop: 10,
            background: color.primaryLight,
            borderRadius: 12,
            padding: '9px 12px',
            fontSize: 12.5,
            color: color.primaryDeep,
            fontWeight: 600,
          }}
        >
          기존 응답으로 다시 추천했어요 — 재설문이 필요 없어요
        </div>
      )}

      <div
        onClick={() => set({ recSel: 'r1' })}
        style={{
          marginTop: 18,
          background: 'linear-gradient(135deg,#F3F8FF,#EEF6F1)',
          border: `1.5px solid ${s.recSel === 'r1' ? color.primary : '#BBD8FA'}`,
          borderRadius: 20,
          padding: '18px 16px',
          boxSizing: 'border-box',
          animation: 'popIn .35s cubic-bezier(.2,1.4,.4,1) both',
          position: 'relative',
          cursor: 'pointer',
          transition: 'border .15s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ paddingTop: 2 }}>
            <Radio selected={s.recSel === 'r1'} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div
                style={{
                  display: 'inline-block',
                  background: color.primary,
                  color: '#fff',
                  fontSize: 11.5,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 20,
                }}
              >
                추천 1위
              </div>
              <ViewTimeBtn onClick={() => viewTime(rec1)} />
            </div>
            <div style={{ fontSize: 25, fontWeight: 800, color: color.textPrimary, marginTop: 10, letterSpacing: '-.01em' }}>
              {rec1.time}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {rec1.badges.map((b) => (
                <div
                  key={b}
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: color.primaryDeep,
                    background: '#fff',
                    border: '1px solid #D9E8FC',
                    borderRadius: 14,
                    padding: '4px 10px',
                  }}
                >
                  {b}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13.5, color: color.textSecondary, marginTop: 12, lineHeight: 1.5, fontWeight: 600 }}>
              {rec1Line}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {rec23.map((r) => {
          const sel = s.recSel === r.id
          return (
            <div
              key={r.id}
              onClick={() => set({ recSel: r.id })}
              style={{
                background: color.fillLight,
                borderRadius: 16,
                padding: '14px 16px',
                boxSizing: 'border-box',
                border: `1.5px solid ${sel ? color.primary : 'transparent'}`,
                cursor: 'pointer',
                transition: 'border .15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ paddingTop: 2 }}>
                  <Radio selected={sel} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: color.textQuaternary }}>{r.rank}위</div>
                      <div style={{ fontSize: 16.5, fontWeight: 800, color: color.textPrimary }}>{r.time}</div>
                    </div>
                    <ViewTimeBtn onClick={() => viewTime(r)} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 9 }}>
                    {r.badges.map((b) => (
                      <div
                        key={b}
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: color.textTertiary,
                          background: '#fff',
                          border: `1px solid ${color.border}`,
                          borderRadius: 14,
                          padding: '4px 10px',
                        }}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => set({ sheet: 'confirm' })}
        style={{
          marginTop: 'auto',
          height: 56,
          border: 'none',
          borderRadius: 16,
          background: color.primary,
          color: '#fff',
          fontSize: 17,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
          flex: 'none',
        }}
      >
        이 시간으로 확정
      </button>
    </div>
  )
}
