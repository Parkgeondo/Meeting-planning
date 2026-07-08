import { useStore } from '../state'
import { color } from '../tokens'
import { CTA } from '../components/ui'

export function Recommend() {
  const { state, set, go } = useStore()
  const s = state

  const rec1Time = s.reRec ? '목요일 10:00 – 11:00' : '화요일 15:00 – 16:00'
  const rec1Badges = s.reRec
    ? ['필수 4명 전원 가능', "'되긴 해요' 1명", '선호 점수 10/12']
    : ['필수 4명 전원 가능', "'되긴 해요' 0명", '선호 점수 11/12']
  const rec1Line = s.reRec
    ? '지수님을 제외한 응답으로 다시 계산한 결과예요.'
    : '모두 가능하면서, 아무도 참지 않아도 되는 유일한 시간이에요.'
  const rec23 = s.reRec
    ? [
        { rank: 2, time: '수 16:00 – 17:00', tradeoff: "2명이 '되긴 해요'를 선택했어요" },
        { rank: 3, time: '화 11:00 – 12:00', tradeoff: '선택 참석 1명이 어려운 시간이에요' },
      ]
    : [
        { rank: 2, time: '목 10:00 – 11:00', tradeoff: "1명이 '되긴 해요'를 선택했어요" },
        { rank: 3, time: '수 16:00 – 17:00', tradeoff: "2명이 '되긴 해요'를 선택했어요" },
      ]

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
        이 시간이 가장 괜찮아요
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
        style={{
          marginTop: 18,
          background: 'linear-gradient(135deg,#F3F8FF,#EEF6F1)',
          border: '1.5px solid #BBD8FA',
          borderRadius: 20,
          padding: 20,
          animation: 'popIn .35s cubic-bezier(.2,1.4,.4,1) both',
          position: 'relative',
        }}
      >
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
        <div style={{ fontSize: 25, fontWeight: 800, color: color.textPrimary, marginTop: 10, letterSpacing: '-.01em' }}>
          {rec1Time}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {rec1Badges.map((b) => (
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
        {!s.confirmed ? (
          <button
            onClick={() => set({ sheet: 'confirm' })}
            style={{
              marginTop: 14,
              width: '100%',
              height: 48,
              border: 'none',
              borderRadius: 14,
              background: color.primary,
              color: '#fff',
              fontSize: 15.5,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            이 시간으로 확정
          </button>
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 16,
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '3px solid #17A05D',
              color: '#17A05D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 800,
              transform: 'rotate(-12deg)',
              animation: 'stampIn .35s cubic-bezier(.2,1.5,.4,1) both',
            }}
          >
            확정
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginTop: 12,
          transition: 'opacity .4s',
          opacity: s.confirmed ? 0.35 : 1,
        }}
      >
        {rec23.map((r) => (
          <div key={r.rank} style={{ background: color.fillLight, borderRadius: 16, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: color.textQuaternary }}>{r.rank}위</div>
              <div style={{ fontSize: 16.5, fontWeight: 800, color: color.textPrimary }}>{r.time}</div>
            </div>
            <div style={{ fontSize: 12.5, color: '#B26A00', marginTop: 5, fontWeight: 600 }}>{r.tradeoff}</div>
          </div>
        ))}
      </div>

      {s.confirmed && (
        <CTA onClick={() => go('s7')} style={{ marginTop: 'auto' }}>
          확정 알림 보내기
        </CTA>
      )}
    </div>
  )
}
