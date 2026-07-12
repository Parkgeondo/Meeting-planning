import type { CSSProperties, ReactNode } from 'react'
import { color } from '../tokens'

export function SectionLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: color.textQuaternary,
        margin: '18px 0 8px',
        padding: '0 2px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        opacity: open ? 1 : 0,
        visibility: open ? 'visible' : 'hidden',
        transition: 'grid-template-rows .4s cubic-bezier(.4,0,.2,1), opacity .3s ease, visibility .4s',
      }}
    >
      <div style={{ overflow: 'hidden', minHeight: 0 }}>{children}</div>
    </div>
  )
}

export function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 44,
        height: 26,
        borderRadius: 13,
        background: on ? color.primary : color.borderDashed,
        padding: 3,
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition: 'background .2s',
        flex: 'none',
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          transform: on ? 'translateX(18px)' : 'translateX(0)',
          transition: 'transform .2s',
          boxShadow: '0 1px 3px rgba(0,0,0,.15)',
        }}
      />
    </div>
  )
}

export function CTA({
  children,
  onClick,
  disabled,
  bg = color.primary,
  fg = '#fff',
  style,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  bg?: string
  fg?: string
  style?: CSSProperties
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        height: 56,
        border: 'none',
        borderRadius: 16,
        background: disabled ? '#DEE3E8' : bg,
        color: disabled ? color.textQuaternary : fg,
        fontSize: 17,
        fontWeight: 700,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'inherit',
        flex: 'none',
        transition: 'all .2s',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function SelChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: 42,
        borderRadius: 12,
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 13.5,
        fontWeight: 700,
        border: active ? `1.5px solid ${color.primary}` : `1.5px solid ${color.border}`,
        background: active ? color.primaryLight : '#fff',
        color: active ? color.primary : color.textTertiary,
        transition: 'all .15s',
      }}
    >
      {label}
    </button>
  )
}
