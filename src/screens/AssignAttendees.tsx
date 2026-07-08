import type { CSSProperties } from 'react'
import { useStore } from '../state'
import { avatarColor, color } from '../tokens'
import { CTA } from '../components/ui'

const segStyle = (on: boolean): CSSProperties => ({
  height: 30,
  padding: '0 12px',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 12.5,
  fontWeight: 700,
  background: on ? '#fff' : 'transparent',
  color: on ? color.textPrimary : color.textQuaternary,
  boxShadow: on ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
  transition: 'all .15s',
})

export function AssignAttendees() {
  const { state, set, go, names } = useStore()
  const s = state
  const addTrimmed = s.addVal.trim()
  const canAdd = !!addTrimmed && !names.includes(addTrimmed)

  const doAdd = () => {
    if (!canAdd) return
    set((st) => ({
      extra: st.extra.concat(addTrimmed),
      roles: { ...st.roles, [addTrimmed]: '선택' },
      addVal: '',
    }))
  }

  const reqCount = names.filter((n) => s.roles[n] === '필수').length

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 23, fontWeight: 800, color: color.textPrimary, letterSpacing: '-.01em' }}>
          누가 함께하나요?
        </div>
        <div
          onClick={() => set({ sheet: 'info' })}
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: color.fill,
            color: color.textQuaternary,
            fontSize: 13,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          ?
        </div>
      </div>
      <div style={{ fontSize: 14, color: color.textTertiary, marginTop: 6, lineHeight: 1.5 }}>
        지정이 확실하지 않아도 괜찮아요 — 초안이에요
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        <input
          value={s.addVal}
          onChange={(e) => set({ addVal: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && doAdd()}
          placeholder="이름을 입력해 추가하세요"
          style={{
            flex: 1,
            height: 48,
            border: 'none',
            borderRadius: 14,
            background: color.fill,
            padding: '0 16px',
            fontSize: 15,
            fontWeight: 600,
            color: color.textPrimary,
            fontFamily: 'inherit',
            outline: 'none',
            boxSizing: 'border-box',
            minWidth: 0,
          }}
        />
        <button
          onClick={doAdd}
          style={{
            height: 48,
            padding: '0 18px',
            border: 'none',
            borderRadius: 14,
            cursor: canAdd ? 'pointer' : 'default',
            background: canAdd ? color.primary : '#DEE3E8',
            color: canAdd ? '#fff' : color.textQuaternary,
            fontSize: 14,
            fontWeight: 700,
            fontFamily: 'inherit',
            flex: 'none',
            transition: 'all .15s',
          }}
        >
          추가
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
        {names.map((n, i) => {
          const isContact = /[0-9@]/.test(n)
          return (
            <div
              key={n}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: color.fillLight,
                borderRadius: 14,
                padding: '10px 12px',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: avatarColor(n, i),
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isContact ? 16 : 14,
                  fontWeight: 700,
                  flex: 'none',
                }}
              >
                {isContact ? '👤' : n[0]}
              </div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: color.textPrimary }}>{n}</div>
              <div style={{ display: 'flex', background: color.canvas, borderRadius: 10, padding: 2 }}>
                <button
                  onClick={() => set((st) => ({ roles: { ...st.roles, [n]: '필수' } }))}
                  style={segStyle(s.roles[n] === '필수')}
                >
                  필수
                </button>
                <button
                  onClick={() => set((st) => ({ roles: { ...st.roles, [n]: '선택' } }))}
                  style={segStyle((s.roles[n] || '선택') === '선택')}
                >
                  선택
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          marginTop: 14,
          textAlign: 'center',
          fontSize: 13.5,
          fontWeight: 700,
          color: color.textSecondary,
          background: color.fill,
          borderRadius: 12,
          padding: 10,
        }}
      >
        필수 {reqCount}명 · 선택 {names.length - reqCount}명
      </div>

      <CTA onClick={() => go('s3')} style={{ marginTop: 'auto' }}>
        링크 만들기
      </CTA>
    </div>
  )
}
