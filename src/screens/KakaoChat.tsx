import type { ReactNode } from 'react'
import { selectedRec } from '../data'
import { useStore } from '../state'
import { avatarColor, color } from '../tokens'
import thumbImg from '../assets/kakao-link-thumb.png'

const MEETING_LINK = 'modu.time/retro-9k2f'
const CHAT_BG = '#ABC0D1'
const TS_COLOR = '#5A6E7E'

function Timestamp({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 10.5, color: TS_COLOR, fontWeight: 600, whiteSpace: 'nowrap', flex: 'none' }}>
      {children}
    </div>
  )
}

function Avatar({ name, index }: { name: string; index: number }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 16,
        background: avatarColor(name, index),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 700,
        color: '#fff',
        flex: 'none',
      }}
    >
      {name[0]}
    </div>
  )
}

function ChatBubble({
  name,
  text,
  index,
  time,
  mine = false,
}: {
  name: string
  text: string
  index: number
  time: string
  mine?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: mine ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 14,
      }}
    >
      {!mine && <Avatar name={name} index={index} />}
      <div style={{ maxWidth: '68%' }}>
        {!mine && (
          <div style={{ fontSize: 12, color: '#3D4F5F', marginBottom: 4, marginLeft: 2, fontWeight: 600 }}>{name}</div>
        )}
        <div style={{ display: 'flex', flexDirection: mine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 5 }}>
          <div
            style={{
              background: mine ? '#FEE500' : '#fff',
              borderRadius: 16,
              padding: '9px 13px',
              fontSize: 14.5,
              lineHeight: 1.45,
              color: color.textPrimary,
              whiteSpace: 'pre-wrap',
            }}
          >
            {text}
          </div>
          <Timestamp>{time}</Timestamp>
        </div>
      </div>
    </div>
  )
}

/** 공유하기 원형 버튼 (업로드 아이콘) — 링크 카드 오른쪽 스택. */
function ShareCircle() {
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: 'rgba(255,255,255,.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 15V4M12 4L7.5 8.5M12 4L16.5 8.5" stroke="#4A5D6D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 14v4.2c0 .99.81 1.8 1.8 1.8h10.4c.99 0 1.8-.81 1.8-1.8V14" stroke="#4A5D6D" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

/** 카톡 링크 카드 — 썸네일 배너 + 본문. */
function ThumbCard({
  title,
  desc,
  onOpen,
}: {
  title: string
  desc: string
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
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,.05)',
        animation: 'fadeUp .35s ease both',
      }}
    >
      <img src={thumbImg} alt="" style={{ width: '100%', height: 104, objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: '13px 16px 15px' }}>
        <div style={{ fontSize: 15.5, fontWeight: 800, color: color.textPrimary, letterSpacing: '-.01em', lineHeight: 1.4 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: color.textTertiary, marginTop: 5, lineHeight: 1.5 }}>{desc}</div>
        <div
          style={{
            marginTop: 8,
            fontSize: 13,
            color: '#2D6FE4',
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: 2,
          }}
        >
          {MEETING_LINK}
        </div>
      </div>
    </button>
  )
}

/** 지민이 보낸 카드 메시지 행 (카드 + 오른쪽 공유 버튼/타임스탬프 스택). */
function CardRow({ time, children }: { time: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14 }}>
      <Avatar name="지민" index={0} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#3D4F5F', marginBottom: 4, marginLeft: 2, fontWeight: 600 }}>지민</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ flex: 1, minWidth: 0, maxWidth: '82%' }}>{children}</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 'none' }}>
            <ShareCircle />
            <Timestamp>{time}</Timestamp>
          </div>
        </div>
      </div>
    </div>
  )
}

const headerIconStroke = '#26343F'

function HeaderIcons() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 'none' }}>
      {/* 검색 */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="10.5" cy="10.5" r="6.5" stroke={headerIconStroke} strokeWidth="2" />
        <path d="M15.5 15.5L20 20" stroke={headerIconStroke} strokeWidth="2" strokeLinecap="round" />
      </svg>
      {/* 전화 */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 4.5C5 3.7 5.7 3 6.5 3h2L10 7l-1.8 1.8c.9 2.1 2.9 4.1 5 5L15 12l4 1.5v2c0 .8-.7 1.5-1.5 1.5C10.6 17 7 13.4 7 6.5"
          stroke={headerIconStroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {/* 햄버거 */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 6.5H20M4 12H20M4 17.5H20" stroke={headerIconStroke} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function KakaoChat() {
  const { state, set } = useStore()
  const s = state

  const openLink = () => set({ attendeeScreen: 's4pre', sheet: null })
  const openStatus = () => set({ attendeeScreen: 's7', statusView: 'att', sheet: null })
  const sched = selectedRec(s.reRec, s.recSel)

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
      {/* 헤더 — 배경 없이 투명 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px 10px',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flex: 'none' }}>
          <path d="M15 5L8 12L15 19" stroke={headerIconStroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: color.textPrimary,
              letterSpacing: '-.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            스프린트 회고
          </div>
          <div style={{ fontSize: 13, color: TS_COLOR, fontWeight: 600 }}>6</div>
        </div>
        <HeaderIcons />
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 12px 20px',
        }}
      >
        <ChatBubble name="서연" text="다들 회고 시간 언제 되나요?" index={1} time="오전 10:02" />
        <ChatBubble name="준호" text="주최자님이 링크 보내준다고 했어요" index={2} time="오전 10:03" />
        <ChatBubble name="지수" text="네, 기다리고 있을게요!" index={3} time="오전 10:05" mine />

        {s.linkShared && (
          <CardRow time="오전 10:31">
            <ThumbCard
              title={s.title}
              desc="가능한 시간을 알려주세요 — 앱 설치 없이 바로 응답할 수 있어요"
              onOpen={openLink}
            />
          </CardRow>
        )}

        {s.confirmed && (
          <CardRow time="오후 2:14">
            <ThumbCard
              title={`${sched.date} ${sched.range}으로 확정되었어요`}
              desc="해당 회의시간이 확정되었어요!"
              onOpen={openStatus}
            />
          </CardRow>
        )}
      </div>

      {/* 입력바 */}
      <div
        style={{
          background: '#fff',
          padding: '8px 10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flex: 'none' }}>
          <path d="M12 5V19M5 12H19" stroke="#4A5D6D" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div style={{ flex: 1, fontSize: 15, color: '#B0B8C1', fontWeight: 500 }}>메시지 입력</div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flex: 'none' }}>
          <circle cx="12" cy="12" r="8.5" stroke="#4A5D6D" strokeWidth="2" />
          <circle cx="9" cy="10" r="1.1" fill="#4A5D6D" />
          <circle cx="15" cy="10" r="1.1" fill="#4A5D6D" />
          <path d="M8.5 14c.9 1.2 2.1 1.9 3.5 1.9s2.6-.7 3.5-1.9" stroke="#4A5D6D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: '#F2F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
            color: '#8B95A1',
            flex: 'none',
          }}
        >
          #
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
