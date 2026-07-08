import { DAYS, HEAT_COLORS, HOURSX, LUNCH_HOUR, OBJ_CHIPS, PRESEED_OBJECTION, baseHeat, isLocked } from '../data'
import { useStore } from '../state'
import { avatarColor, color } from '../tokens'

export function Dashboard() {
  const { state, set, go, names } = useStore()
  const s = state
  const jisooOpt = s.orgObjection === 'accepted'

  const showObjCard =
    s.orgObjection === 'pending' && (PRESEED_OBJECTION || s.objSentByMe)
  const showObjResult = s.orgObjection !== 'pending'
  const objReason = s.objChip !== null ? OBJ_CHIPS[s.objChip] : s.objText.trim() || OBJ_CHIPS[0]
  const objResultMsg =
    s.orgObjection === 'accepted'
      ? '지수님을 선택 참석으로 변경했어요 · 그룹에는 알리지 않아요 · 히트맵이 다시 계산됐어요'
      : '참석을 요청했어요 · 지수님에게 "주최자가 참석을 요청했어요"로 전달돼요'

  const canSimulate = s.responded < 6
  const canRec = s.responded >= 3

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '22px 18px 18px',
        animation: 'fadeUp .3s ease both',
      }}
    >
      <div style={{ fontSize: 19, fontWeight: 800, color: color.textPrimary, letterSpacing: '-.01em' }}>
        {s.title}
      </div>
      <div style={{ fontSize: 12.5, color: color.textQuaternary, marginTop: 3 }}>
        {s.responded}/6명 응답 · 기한까지 26시간
      </div>

      {showObjCard && (
        <div
          style={{
            marginTop: 12,
            background: '#FFF8EC',
            border: '1.5px solid #FFE2B0',
            borderRadius: 16,
            padding: 14,
            animation: 'popIn .3s ease both',
          }}
        >
          <div style={{ fontSize: 13.5, fontWeight: 700, color: color.textPrimary, lineHeight: 1.5 }}>
            💬 지수님이 참석 필요성에 대해 의견을 보냈어요
          </div>
          <div style={{ fontSize: 13, color: color.textTertiary, marginTop: 4 }}>"{objReason}"</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              onClick={() => set({ orgObjection: 'accepted' })}
              style={{
                flex: 1,
                height: 40,
                border: 'none',
                borderRadius: 11,
                background: color.primary,
                color: '#fff',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              선택 참석으로 변경
            </button>
            <button
              onClick={() => set({ orgObjection: 'kept' })}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 11,
                background: '#fff',
                color: color.textSecondary,
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                border: `1px solid ${color.border}`,
              }}
            >
              필수 유지
            </button>
          </div>
        </div>
      )}
      {showObjResult && (
        <div
          style={{
            marginTop: 12,
            background: color.fill,
            borderRadius: 12,
            padding: '10px 14px',
            fontSize: 12.5,
            fontWeight: 600,
            color: color.textSecondary,
          }}
        >
          {objResultMsg}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
        <div style={{ display: 'flex' }}>
          {names.map((n, i) => {
            const done = i < s.responded
            return (
              <div
                key={n}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  marginLeft: i === 0 ? 0 : -8,
                  border: '2px solid #fff',
                  transition: 'all .3s',
                  background: done ? avatarColor(n, i) : color.fill,
                  color: done ? '#fff' : color.textDisabled,
                }}
              >
                {done ? n[0] : '?'}
              </div>
            )
          })}
        </div>
        <div style={{ flex: 1 }} />
        {canSimulate && (
          <button
            onClick={() => set((st) => ({ responded: Math.min(6, st.responded + 1) }))}
            style={{
              height: 32,
              padding: '0 12px',
              border: '1px dashed #B0B8C1',
              borderRadius: 16,
              background: 'none',
              color: color.textQuaternary,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              flex: 'none',
            }}
          >
            시뮬레이션 ▶
          </button>
        )}
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          <div style={{ width: 30 }} />
          {DAYS.map(([label, date]) => (
            <div key={label} style={{ flex: 1, textAlign: 'center', padding: '5px 0', color: color.textSecondary }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
              <div style={{ fontSize: 10.5, opacity: 0.65 }}>7/{date}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {HOURSX.map((h, hi) => (
            <div key={h} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <div style={{ width: 30, fontSize: 10.5, color: color.textDisabled, textAlign: 'right', paddingRight: 2 }}>
                {h}시
              </div>
              {DAYS.map(([dl], di) => {
                const lunch = s.lunchOff && h === LUNCH_HOUR
                if (lunch) {
                  return (
                    <div
                      key={di}
                      style={{
                        flex: 1,
                        height: 34,
                        borderRadius: 9,
                        cursor: 'default',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '.03em',
                        background: '#F5F6F8',
                        color: color.textDisabled,
                      }}
                    >
                      {di === 2 ? '점심시간' : ''}
                    </div>
                  )
                }
                const locked = isLocked(di, hi, jisooOpt)
                const heat = baseHeat(di, hi) * (s.responded / 6)
                const lvl = Math.min(4, Math.floor(heat * 5))
                return (
                  <div
                    key={di}
                    onClick={() =>
                      set({ sheet: 'cell', cellSel: { dl, hr: h, locked, heat: baseHeat(di, hi) } })
                    }
                    style={{
                      flex: 1,
                      height: 34,
                      borderRadius: 9,
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      background: locked ? color.canvas : HEAT_COLORS[lvl],
                      opacity: locked ? 0.8 : 1,
                      transition: 'background .5s, opacity .5s',
                    }}
                  >
                    {locked ? '🔒' : ''}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, justifyContent: 'center' }}>
          <span style={{ fontSize: 11, color: color.textQuaternary }}>낮음</span>
          {HEAT_COLORS.map((c) => (
            <div key={c} style={{ width: 14, height: 10, borderRadius: 3, background: c }} />
          ))}
          <span style={{ fontSize: 11, color: color.textQuaternary }}>선호 높음</span>
          <span style={{ fontSize: 11, color: color.textDisabled, marginLeft: 8 }}>🔒 필수 불가</span>
        </div>
      </div>

      <button
        onClick={() => canRec && go('s6')}
        style={{
          marginTop: 'auto',
          height: 56,
          border: 'none',
          borderRadius: 16,
          fontFamily: 'inherit',
          fontSize: 17,
          fontWeight: 700,
          flex: 'none',
          cursor: canRec ? 'pointer' : 'default',
          background: canRec ? color.primary : '#DEE3E8',
          color: canRec ? '#fff' : color.textQuaternary,
          transition: 'all .2s',
        }}
      >
        {canRec ? '추천 시간 보기' : '3명 이상 응답하면 추천해드려요'}
      </button>
    </div>
  )
}
