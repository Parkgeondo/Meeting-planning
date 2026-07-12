import { useStore } from '../state'
import { avatarColor, color } from '../tokens'
import { CTA } from '../components/ui'

export function WhoAreYou() {
  const { state, set, go, names } = useStore()
  const s = state
  const who = s.who
  const whoRole = s.roles[who] || '선택'
  const optedOut = s.optOutBy === who
  const sentReq = whoRole === '필수' && s.objSentByMe
  const badgeLabel = optedOut
    ? '불참 예정 ›'
    : sentReq
      ? `${whoRole} 참석 · 의견 전달됨`
      : `${whoRole} 참석 ›`

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
      <div style={{ fontSize: 13, fontWeight: 600, color: color.textQuaternary }}>{s.title} · 1시간</div>
      <div
        style={{
          fontSize: 23,
          fontWeight: 800,
          color: color.textPrimary,
          marginTop: 8,
          letterSpacing: '-.01em',
        }}
      >
        누구로 응답하시나요?
      </div>
      <div style={{ fontSize: 14.5, color: color.textTertiary, marginTop: 6, lineHeight: 1.5 }}>
        하단의 참가자 리스트 중에서 본인의 이름을 선택해주세요.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 22 }}>
        {names.map((n, i) => {
          const on = who === n
          const role = s.roles[n] || '선택'
          return (
            <button
              key={n}
              onClick={() => set({ who: n })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                height: 52,
                padding: '0 14px',
                borderRadius: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 15,
                fontWeight: 600,
                boxSizing: 'border-box',
                border: on ? `1.5px solid ${color.primary}` : `1.5px solid ${color.border}`,
                background: on ? color.primaryLight : '#fff',
                color: on ? color.primaryDeep : color.textPrimary,
                transition: 'all .15s',
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  flex: 'none',
                  background: avatarColor(n, i),
                  color: '#fff',
                }}
              >
                {n[0]}
              </span>
              <span style={{ flex: 1, textAlign: 'left' }}>{n}</span>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 12,
                  flex: 'none',
                  background: role === '필수' ? color.primaryLight : color.fill,
                  color: role === '필수' ? color.primary : color.textQuaternary,
                }}
              >
                {role}
              </span>
            </button>
          )
        })}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 14,
          background: color.fillLight,
          borderRadius: 14,
          padding: '11px 14px',
        }}
      >
        <div style={{ fontSize: 13, color: color.textSecondary, fontWeight: 600 }}>
          {who}님은 이 회의에서
        </div>
        <button
          onClick={() => set({ sheet: 'role' })}
          style={{
            height: 30,
            padding: '0 11px',
            borderRadius: 15,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            background: optedOut ? color.fill : sentReq ? '#E9F8F0' : color.primaryLight,
            color: optedOut ? color.textTertiary : sentReq ? color.successDeep : color.primary,
          }}
        >
          {badgeLabel}
        </button>
      </div>
      {optedOut && (
        <div style={{ fontSize: 11.5, color: color.textDisabled, marginTop: 7, padding: '0 4px' }}>
          배지를 다시 탭하면 '참석할게요'로 되돌릴 수 있어요
        </div>
      )}

      <CTA onClick={() => go('s4')} style={{ marginTop: 'auto' }}>
        {who}(으)로 응답하기
      </CTA>
    </div>
  )
}
