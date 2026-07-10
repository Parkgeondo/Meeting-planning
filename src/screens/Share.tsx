import { useStore } from '../state'
import { color } from '../tokens'
import { CTA } from '../components/ui'

export function Share() {
  const { state, set } = useStore()
  const s = state

  const copy = () => {
    set({ copied: true })
    setTimeout(() => set({ copied: false }), 1600)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '26px 22px 22px',
        alignItems: 'center',
        textAlign: 'center',
        animation: 'fadeUp .3s ease both',
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: '#EAF3FE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
          marginTop: 40,
          animation: 'popIn .4s cubic-bezier(.2,1.6,.4,1) both',
        }}
      >
        🔗
      </div>
      <div
        style={{
          fontSize: 23,
          fontWeight: 800,
          color: color.textPrimary,
          marginTop: 22,
          letterSpacing: '-.01em',
        }}
      >
        링크가 준비됐어요
      </div>
      <div style={{ fontSize: 14.5, color: color.textTertiary, marginTop: 8, lineHeight: 1.55 }}>
        참석자는 앱 설치 없이
        <br />
        바로 응답할 수 있어요
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 28, width: '100%' }}>
        <div
          style={{
            flex: 1,
            height: 50,
            background: color.fill,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            fontSize: 14,
            color: color.textTertiary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          modu.time/retro-9k2f
        </div>
        <button
          onClick={copy}
          style={{
            width: 64,
            height: 50,
            border: 'none',
            borderRadius: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 14,
            fontWeight: 700,
            background: s.copied ? color.success : color.primaryLight,
            color: s.copied ? '#fff' : color.primary,
            transition: 'all .2s',
          }}
        >
          {s.copied ? '복사됨!' : '복사'}
        </button>
      </div>

      <CTA
        onClick={() => set({ linkShared: true, attendeeScreen: 's4kakao' })}
        bg={color.kakao}
        fg={color.textPrimary}
        style={{ marginTop: 'auto', width: '100%' }}
      >
        카카오톡으로 공유
      </CTA>
      <button
        onClick={() => set({ linkShared: true, attendeeScreen: 's4kakao' })}
        style={{
          marginTop: 10,
          height: 40,
          border: 'none',
          background: 'none',
          color: color.textQuaternary,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        참석자 카톡 미리보기 →
      </button>
    </div>
  )
}
