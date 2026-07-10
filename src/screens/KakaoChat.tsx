import { useStore } from '../state'
import { avatarColor, color } from '../tokens'

const MEETING_LINK = 'modu.time/retro-9k2f'
const CHAT_BG = '#ABC1D1'
const HEADER_BG = '#A8BCC9'

function ChatBubble({
  name,
  text,
  index,
  mine = false,
}: {
  name: string
  text: string
  index: number
  mine?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: mine ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 6,
        marginBottom: 14,
      }}
    >
      {!mine && (
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            background: avatarColor(name, index),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            flex: 'none',
          }}
        >
          {name[0]}
        </div>
      )}
      <div style={{ maxWidth: '72%' }}>
        {!mine && (
          <div style={{ fontSize: 11, color: '#3D4F5F', marginBottom: 4, marginLeft: 2, fontWeight: 600 }}>{name}</div>
        )}
        <div
          style={{
            background: mine ? '#FEE500' : '#fff',
            borderRadius: mine ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
            padding: '10px 12px',
            fontSize: 14,
            lineHeight: 1.45,
            color: color.textPrimary,
            boxShadow: '0 1px 1px rgba(0,0,0,.06)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {text}
        </div>
      </div>
    </div>
  )
}

function LinkCard({ title, onOpen }: { title: string; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      style={{
        width: '100%',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        background: '#fff',
        borderRadius: '4px 14px 14px 14px',
        overflow: 'hidden',
        boxShadow: '0 1px 1px rgba(0,0,0,.06)',
        animation: 'fadeUp .35s ease both',
      }}
    >
      <div
        style={{
          height: 88,
          background: 'linear-gradient(135deg, #EAF3FE 0%, #D6E8FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 34,
        }}
      >
        📅
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 11, color: color.textQuaternary, fontWeight: 600 }}>모두가 만족하는 시간 찾기</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: color.textPrimary, marginTop: 4, letterSpacing: '-.01em' }}>
          {title}
        </div>
        <div style={{ fontSize: 12.5, color: color.textTertiary, marginTop: 6, lineHeight: 1.45 }}>
          가능한 시간을 알려주세요
          <br />
          앱 설치 없이 바로 응답할 수 있어요
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 11.5,
            color: color.primary,
            fontWeight: 700,
          }}
        >
          {MEETING_LINK}
        </div>
      </div>
    </button>
  )
}

function confirmedSchedule(reRec: boolean) {
  return reRec
    ? { date: '7월 9일 목요일', time: '10:00 – 11:00' }
    : { date: '7월 7일 화요일', time: '15:00 – 16:00' }
}

function ConfirmedCard({
  title,
  date,
  time,
  onOpen,
}: {
  title: string
  date: string
  time: string
  onOpen: () => void
}) {
  return (
    <button
      onClick={onOpen}
      style={{
        width: '100%',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        background: '#fff',
        borderRadius: '4px 14px 14px 14px',
        overflow: 'hidden',
        boxShadow: '0 1px 1px rgba(0,0,0,.06)',
        animation: 'fadeUp .35s ease both',
      }}
    >
      <div
        style={{
          height: 88,
          background: 'linear-gradient(135deg, #E9F8F0 0%, #D4F0E4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 34,
        }}
      >
        ✅
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 11, color: color.successDeep, fontWeight: 700 }}>회의 시간 확정</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: color.textPrimary, marginTop: 4, letterSpacing: '-.01em' }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: color.textSecondary, marginTop: 8, fontWeight: 700, lineHeight: 1.45 }}>
          {date}
          <br />
          {time}
        </div>
        <div style={{ fontSize: 12, color: color.primary, marginTop: 10, fontWeight: 700 }}>
          탭해서 확정 내용 확인하기 →
        </div>
      </div>
    </button>
  )
}

export function KakaoChat() {
  const { state, set } = useStore()
  const s = state

  const openLink = () => set({ attendeeScreen: 's4pre', sheet: null })
  const openStatus = () => set({ attendeeScreen: 's7', statusView: 'att', sheet: null })
  const sched = confirmedSchedule(s.reRec)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        background: CHAT_BG,
        animation: 'fadeUp .3s ease both',
        position: 'relative',
      }}
    >
      <div
        style={{
          background: HEADER_BG,
          padding: '14px 16px 12px',
          borderBottom: '1px solid rgba(0,0,0,.06)',
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 800, color: color.textPrimary, letterSpacing: '-.01em' }}>스프린트 회고</div>
        <div style={{ fontSize: 11.5, color: '#4A5D6D', marginTop: 2, fontWeight: 600 }}>6</div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 14px 20px',
        }}
      >
        <ChatBubble name="서연" text="다들 회고 시간 언제 되나요?" index={1} />
        <ChatBubble name="준호" text="주최자님이 링크 보내준다고 했어요" index={2} />
        <ChatBubble name="지수" text="네, 기다리고 있을게요!" index={3} mine />

        {s.linkShared && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 14 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: avatarColor('지민', 0),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: '#fff',
                flex: 'none',
              }}
            >
              지
            </div>
            <div style={{ maxWidth: '78%' }}>
              <div style={{ fontSize: 11, color: '#3D4F5F', marginBottom: 4, marginLeft: 2, fontWeight: 600 }}>지민</div>
              <LinkCard title={s.title} onOpen={openLink} />
            </div>
          </div>
        )}

        {s.confirmed && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 14 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: avatarColor('지민', 0),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: '#fff',
                flex: 'none',
              }}
            >
              지
            </div>
            <div style={{ maxWidth: '78%' }}>
              <div style={{ fontSize: 11, color: '#3D4F5F', marginBottom: 4, marginLeft: 2, fontWeight: 600 }}>지민</div>
              <ConfirmedCard title={s.title} date={sched.date} time={sched.time} onOpen={openStatus} />
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          background: '#F8F8F8',
          borderTop: '1px solid rgba(0,0,0,.06)',
          padding: '10px 12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 36,
            borderRadius: 18,
            background: '#fff',
            border: '1px solid #E2E5E8',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            fontSize: 13,
            color: color.textDisabled,
          }}
        >
          메시지 입력
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#D8DCE0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: '#8B95A1',
          }}
        >
          ↑
        </div>
      </div>

      {!s.linkShared && !s.confirmed && (
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 72,
            background: 'rgba(25,31,40,.82)',
            color: '#fff',
            borderRadius: 12,
            padding: '10px 12px',
            fontSize: 12,
            lineHeight: 1.45,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          주최자 화면에서 「카카오톡으로 공유」를 누르면
          <br />
          여기에 회의 링크가 도착해요
        </div>
      )}
    </div>
  )
}
