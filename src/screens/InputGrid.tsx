import { useEffect, type CSSProperties } from 'react'
import { DAYS, HOURSX, LUNCH_HOUR } from '../data'
import { useStore } from '../state'
import { color } from '../tokens'

type Mode = 'exclude' | 'restore' | 'soso' | 'unsoso'

const SOSO_BG = 'repeating-linear-gradient(135deg,#FFE9C2 0 4px,#FFF4E0 4px 8px)'

const cellBase: CSSProperties = {
  flex: 1,
  height: 34,
  borderRadius: 9,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform .18s, background .18s, border .18s, opacity .18s',
  boxSizing: 'border-box',
  userSelect: 'none',
  WebkitUserSelect: 'none',
}

export function InputGrid() {
  const { state, set, go } = useStore()
  const s = state
  const sosoCount = Object.keys(s.xSoso).length
  const isLunch = (hi: number) => s.lunchOff && HOURSX[hi] === LUNCH_HOUR

  useEffect(() => {
    const up = () => set((st) => (st.xDrag ? { xDrag: null } : null))
    window.addEventListener('pointerup', up)
    return () => window.removeEventListener('pointerup', up)
  }, [set])

  const applyX = (id: string, mode: Mode) => {
    const hi = Number(id.split('-')[1])
    if (isLunch(hi)) return
    set((st) => {
      const xExcluded = { ...st.xExcluded }
      const xSoso = { ...st.xSoso }
      if (mode === 'exclude') {
        xExcluded[id] = true
        delete xSoso[id]
      } else if (mode === 'restore') {
        delete xExcluded[id]
      } else if (mode === 'soso') {
        if (!xExcluded[id]) xSoso[id] = true
      } else {
        delete xSoso[id]
      }
      return { xExcluded, xSoso }
    })
  }

  const toggleDay = (di: number) => {
    if (s.xStep !== 1) return
    const anyOpen = HOURSX.some((h, hi) => !(s.lunchOff && h === LUNCH_HOUR) && !s.xExcluded[`${di}-${hi}`])
    set((st) => {
      const xExcluded = { ...st.xExcluded }
      const xSoso = { ...st.xSoso }
      HOURSX.forEach((h, hi) => {
        if (st.lunchOff && h === LUNCH_HOUR) return
        const id = `${di}-${hi}`
        if (anyOpen) {
          xExcluded[id] = true
          delete xSoso[id]
        } else {
          delete xExcluded[id]
        }
      })
      return { xExcluded, xSoso }
    })
  }

  const onGridMove = (e: React.PointerEvent) => {
    if (!s.xDrag) return
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const c = el?.closest?.('[data-cellx]')
    if (c) applyX(c.getAttribute('data-cellx')!, s.xDrag)
  }

  const onCellDown = (id: string, ex: boolean, so: boolean, lunch: boolean) => (e: React.PointerEvent) => {
    e.preventDefault()
    if (lunch) return
    if (s.xStep === 1) {
      const mode: Mode = ex ? 'restore' : 'exclude'
      set({ xDrag: mode })
      applyX(id, mode)
    } else if (!ex) {
      const mode: Mode = so ? 'unsoso' : 'soso'
      set({ xDrag: mode })
      applyX(id, mode)
    }
  }

  const cellStyle = (ex: boolean, so: boolean, lunch: boolean): CSSProperties => {
    if (lunch) {
      return {
        ...cellBase,
        background: '#F5F6F8',
        color: color.textDisabled,
        cursor: 'default',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '.03em',
      }
    }
    if (s.xStep === 1) {
      return ex
        ? { ...cellBase, background: '#E8EBED', transform: 'scale(.90)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,.07)' }
        : { ...cellBase, background: '#F4F9FF', border: '1px solid #DEEBFB' }
    }
    if (ex) return { ...cellBase, background: '#F5F6F8', opacity: 0.45, cursor: 'default', transform: 'scale(.94)' }
    if (so) return { ...cellBase, background: SOSO_BG, border: '1.5px solid #F2A93B' }
    return { ...cellBase, background: '#EFFAF4', border: '1px solid #CBE9D9' }
  }

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 800, color: color.textPrimary, letterSpacing: '-.01em' }}>
            {s.title}
          </div>
          <div style={{ fontSize: 12.5, color: color.textQuaternary, marginTop: 3, padding: '0 2px' }}>
            1시간 회의 · 다음 주 중 · 기한까지 26시간
          </div>
        </div>
        <button
          onClick={() => go('s4pre')}
          style={{
            flex: 'none',
            height: 30,
            padding: '0 11px',
            borderRadius: 15,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 12,
            fontWeight: 700,
            background: color.fill,
            color: color.textSecondary,
          }}
        >
          {s.who} ›
        </button>
      </div>

      {s.xStep === 1 ? (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: color.textPrimary, letterSpacing: '-.01em' }}>
              안 되는 시간만 지워주세요
            </div>
            <div style={{ fontSize: 13, color: color.textTertiary, marginTop: 4, padding: '0 2px' }}>
              요일을 누르면 하루 통째로 지울 수 있어요
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: color.primary,
              background: color.primaryLight,
              padding: '4px 10px',
              borderRadius: 20,
              flex: 'none',
            }}
          >
            STEP 1 / 2
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: color.textPrimary, letterSpacing: '-.01em' }}>
              선호하지 않는 시간은?
            </div>
            <div style={{ fontSize: 13, color: color.textTertiary, marginTop: 4, padding: '0 2px' }}>
              해당 시간이 아닌 시간을 우선적으로 고려해요
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#E58A00',
              background: '#FFF4E0',
              padding: '4px 10px',
              borderRadius: 20,
              flex: 'none',
            }}
          >
            STEP 2 / 2
          </div>
        </div>
      )}

      {/* Grid */}
      <div style={{ marginTop: 12, touchAction: 'none', userSelect: 'none' }} onPointerMove={onGridMove}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          <div style={{ width: 30 }} />
          {DAYS.map(([label, date], di) => {
            const allEx = HOURSX.every((h, hi) => (s.lunchOff && h === LUNCH_HOUR) || s.xExcluded[`${di}-${hi}`])
            return (
              <div
                key={label}
                onClick={() => toggleDay(di)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '5px 0',
                  borderRadius: 9,
                  cursor: 'pointer',
                  color: allEx ? color.textDisabled : color.textSecondary,
                  background: allEx ? color.fill : 'transparent',
                  transition: 'all .18s',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: 10.5, opacity: 0.65 }}>7/{date}</div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {HOURSX.map((h, hi) => (
            <div key={h} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <div style={{ width: 30, fontSize: 10.5, color: color.textDisabled, textAlign: 'right', paddingRight: 2 }}>
                {h}시
              </div>
              {DAYS.map((_, di) => {
                const id = `${di}-${hi}`
                const lunch = isLunch(hi)
                const ex = !!s.xExcluded[id]
                const so = !!s.xSoso[id]
                return (
                  <div
                    key={id}
                    data-cellx={id}
                    onPointerDown={onCellDown(id, ex, so, lunch)}
                    onPointerEnter={() => {
                      if (s.xDrag) applyX(id, s.xDrag)
                    }}
                    style={cellStyle(ex, so, lunch)}
                  >
                    {lunch && di === 2 ? '점심시간' : ''}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {s.xStep === 2 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: color.textTertiary }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: '#EFFAF4',
                  border: '1px solid #CBE9D9',
                  display: 'inline-block',
                  boxSizing: 'border-box',
                }}
              />
              좋아요 (기본)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: color.textTertiary }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: 'repeating-linear-gradient(135deg,#FFE9C2 0 3px,#FFF4E0 3px 6px)',
                  border: '1px solid #F2A93B',
                  display: 'inline-block',
                  boxSizing: 'border-box',
                }}
              />
              보통이예요
            </div>
          </div>
          <div style={{ fontSize: 12, color: color.textQuaternary, textAlign: 'center', marginTop: 8 }}>
            선호하지 않는 시간은 익명으로 집계돼요
          </div>
        </>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 12, flex: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {s.xStep === 1 ? (
          <button
            onClick={() => set({ xStep: 2, xDrag: null })}
            style={{
              width: '100%',
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
            {Object.keys(s.xExcluded).length > 0
              ? `${Object.keys(s.xExcluded).length}칸 지웠어요, 다음으로`
              : '다 가능해요, 다음으로'}
          </button>
        ) : (
          <>
            <button
              onClick={() => set({ sheet: 'submitted' })}
              style={{
                width: '100%',
                height: 54,
                border: 'none',
                borderRadius: 16,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 16,
                fontWeight: 700,
                background: color.primary,
                color: '#fff',
                transition: 'all .2s',
              }}
            >
              {sosoCount > 0 ? '이대로 제출' : "모두 '좋아요'로 제출"}
            </button>
            <button
              onClick={() => set({ xStep: 1, xDrag: null })}
              style={{
                height: 38,
                border: 'none',
                background: 'none',
                color: color.textQuaternary,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ← 안 되는 시간 다시 고치기
            </button>
          </>
        )}
      </div>
    </div>
  )
}
