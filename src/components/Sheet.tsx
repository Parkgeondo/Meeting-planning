import { createContext, useContext, type ReactNode } from 'react'

/** True while the sheet is playing its exit animation (two-phase close). */
export const SheetClosingContext = createContext(false)

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
  const closing = useContext(SheetClosingContext)
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: closing ? 'none' : 'auto' }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(25,31,40,.45)',
          animation: closing ? 'dimOut .24s ease both' : 'dimIn .2s ease both',
        }}
      />
      {center ? (
        // transform 센터링은 등장 애니메이션과 충돌하므로 flex 래퍼로 센터링.
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 24px',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: '100%',
              background: '#fff',
              borderRadius: 20,
              padding: '24px 22px',
              animation: closing ? 'popOutC .2s ease both' : 'popIn .25s ease both',
              textAlign: 'center',
              pointerEvents: closing ? 'none' : 'auto',
            }}
          >
            {children}
          </div>
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
            animation: closing
              ? 'sheetDown .26s cubic-bezier(.2,.9,.3,1) both'
              : 'sheetUp .28s cubic-bezier(.2,.9,.3,1) both',
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
