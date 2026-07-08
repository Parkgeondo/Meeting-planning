import type { ReactNode } from 'react'

/** Bottom sheet shell: dim backdrop + rounded panel sliding up from the bottom. */
export function BottomSheet({
  onClose,
  children,
  center = false,
}: {
  onClose: () => void
  children: ReactNode
  /** Render as a centered dialog card instead of a bottom-anchored sheet. */
  center?: boolean
}) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(25,31,40,.45)',
          animation: 'dimIn .2s ease both',
        }}
      />
      {center ? (
        <div
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#fff',
            borderRadius: 20,
            padding: '24px 22px',
            animation: 'popIn .25s ease both',
            textAlign: 'center',
          }}
        >
          {children}
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#fff',
            borderRadius: '24px 24px 0 0',
            padding: '22px 22px 26px',
            animation: 'sheetUp .28s cubic-bezier(.2,.9,.3,1) both',
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: '#E5E8EB',
              margin: '0 auto 16px',
            }}
          />
          {children}
        </div>
      )}
    </div>
  )
}
