import { useStore } from '../state'
import { avatarColor, color } from '../tokens'

const CONFETTI_COLORS = ['#3182F6', '#FF5B3E', '#FFB020', '#38C79C']

function Confetti() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: 26 }, (_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: -14,
            left: `${(i * 37 + 11) % 100}%`,
            width: 8,
            height: i % 2 ? 13 : 8,
            borderRadius: i % 3 ? 2 : '50%',
            background: CONFETTI_COLORS[i % 4],
            animation: `confettiFall ${2.4 + (i % 5) * 0.5}s linear ${(i % 8) * 0.14}s both`,
          }}
        />
      ))}
    </div>
  )
}

export function Status({ view }: { view: 'org' | 'att' }) {
  const { state, set, names } = useStore()
  const s = state
  const jisooOpt = s.orgObjection === 'accepted'
  const isOrg = view === 'org'

  const finalDate = s.reRec ? '7월 9일 목요일' : '7월 7일 화요일'
  const finalTime = s.reRec ? '10:00 – 11:00' : '15:00 – 16:00'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '24px 22px 22px',
        animation: 'fadeUp .3s ease both',
        position: 'relative',
      }}
    >
      {!s.bailed && <Confetti />}

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: color.primary }}>{s.title}</div>
        <div style={{ fontSize: 25, fontWeight: 800, color: color.textPrimary, marginTop: 8, letterSpacing: '-.01em' }}>
          회의 시간이 확정됐어요
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          background: 'linear-gradient(135deg,#3182F6,#5FA5F9)',
          borderRadius: 22,
          padding: '24px 22px',
          textAlign: 'center',
          color: '#fff',
          animation: 'popIn .45s cubic-bezier(.2,1.5,.4,1) both',
          boxShadow: '0 10px 24px rgba(49,130,246,.28)',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.85 }}>{finalDate}</div>
        <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, letterSpacing: '-.01em' }}>{finalTime}</div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 14,
            background: 'rgba(255,255,255,.18)',
            borderRadius: 20,
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          필수 4명 전원 가능 · 회의실 미정
        </div>
      </div>

      {isOrg && s.bailed && (
        <div
          style={{
            marginTop: 14,
            background: '#FFF3EF',
            border: '1.5px solid #FFD0C2',
            borderRadius: 16,
            padding: 14,
            animation: 'popIn .3s ease both',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: '#C43D1B' }}>지수님이 못 가게 됐어요</div>
          <div style={{ fontSize: 12.5, color: '#8B6255', marginTop: 4 }}>
            기존 응답 데이터로 대안을 바로 추천할 수 있어요 — 재설문 없이요
          </div>
          <button
            onClick={() => set({ reRec: true, confirmed: false, hostScreen: 's6' })}
            style={{
              marginTop: 10,
              width: '100%',
              height: 42,
              border: 'none',
              borderRadius: 11,
              background: color.heart,
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            대안 시간 다시 보기
          </button>
        </div>
      )}

      {isOrg && (
        <div style={{ marginTop: 14, background: color.fillLight, borderRadius: 18, padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: color.textQuaternary, marginBottom: 10 }}>
            참석 현황 · {s.bailed ? '5/6명 참석 예정' : '6/6명 참석 예정'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {names.map((n, i) => {
              const role = n === '지수' && jisooOpt ? '선택' : s.roles[n]
              const out = s.bailed && n === '지수'
              return (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: avatarColor(n, i),
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      opacity: out ? 0.4 : 1,
                    }}
                  >
                    {n[0]}
                  </div>
                  <div style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: color.textPrimary }}>{n}</div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 10,
                      background: role === '필수' ? color.primaryLight : color.fill,
                      color: role === '필수' ? color.primary : color.textQuaternary,
                    }}
                  >
                    {role}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      width: 32,
                      textAlign: 'right',
                      color: out ? color.heart : color.successDeep,
                    }}
                  >
                    {out ? '불참' : '참석'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!isOrg && s.bailed && (
        <div
          style={{
            marginTop: 14,
            background: color.fillLight,
            borderRadius: 16,
            padding: 18,
            textAlign: 'center',
            animation: 'popIn .3s ease both',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800, color: color.textPrimary }}>알려줘서 고마워요</div>
          <div style={{ fontSize: 13, color: color.textQuaternary, marginTop: 5 }}>
            주최자에게 전달됐어요 · 사유는 남기지 않아도 돼요
          </div>
          <button
            onClick={() => set({ bailed: false })}
            style={{
              marginTop: 12,
              height: 38,
              padding: '0 16px',
              border: `1px solid ${color.border}`,
              borderRadius: 11,
              background: '#fff',
              color: color.textQuaternary,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            취소하기
          </button>
        </div>
      )}

      {!isOrg && !s.bailed && (
        <div style={{ marginTop: 'auto', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8, flex: 'none' }}>
          <button
            style={{
              height: 54,
              border: 'none',
              borderRadius: 16,
              background: color.primary,
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            캘린더에 추가
          </button>
        </div>
      )}

      {isOrg && (
        <div style={{ marginTop: 'auto', paddingTop: 14, flex: 'none', display: 'flex', flexDirection: 'column' }}>
          <button
            style={{
              height: 54,
              border: 'none',
              borderRadius: 16,
              background: color.primary,
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            캘린더에 추가
          </button>
        </div>
      )}
    </div>
  )
}
