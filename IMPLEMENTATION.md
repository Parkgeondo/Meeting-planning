# 모두가 만족하는 시간 찾기 — Implementation

Production implementation of the Claude Design handoff, tracking the latest prototype
`project/모두가 만족하는 시간 찾기 v3 copy copy.dc.html`.
Built with **Vite + React + TypeScript**, recreating the prototype pixel-for-pixel.

## v3 changes (vs v2)

- **④ 입력 STEP2**: 하트 3개 찍기 → "좋아요(기본)/되긴 해요" 2색 브러시 페인팅 + 점심시간 행
- **⑤ 히트맵**: 30분 14행 → 1시간 9행(④ 격자와 일치), 요일 날짜 표기, 점심행
- **⑦ 상태**: 화면 내 토글 제거 → 컨페티 + 확정 카드, 상단 탭이 주최자/참석자 ⑦로 분리
- **역할 시트**: 필수(비공개 이의: 칩/직접입력 → 전달 완료)·선택(opt-out) 2종 분리
- **③.5**: 역할 배지에 불참 상태 + 되돌리기 힌트

## Run

```bash
npm install
npm run dev        # dev server (http://localhost:5173)
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
```

## Structure

```
src/
  main.tsx            entry
  index.css           global styles + keyframes (fadeUp/popIn/sheetUp/dimIn/stampIn/heartPop)
  tokens.ts           color tokens + avatar palette (from design.md)
  data.ts             static data: days, slots, roster, heatmap/lock/objection helpers
  range.ts            candidate-range summary + month-calendar logic
  state.tsx           app state + React context store (mirrors the prototype's DCLogic state)
  App.tsx             prototype nav, 375px phone frame, screen router
  components/
    ui.tsx            SectionLabel, Toggle, CTA, SelChip
    Sheet.tsx         bottom-sheet / centered-dialog shell
    Sheets.tsx        role·info·range·cell·confirm·submitted sheets
  screens/
    CreateMeeting.tsx   ① 회의 생성
    AssignAttendees.tsx ② 참석자 지정
    Share.tsx           ③ 공유
    WhoAreYou.tsx       ③.5 응답자 확인
    InputGrid.tsx       ④ 참석자 입력 (STEP1 지우기 / STEP2 하트)
    Dashboard.tsx       ⑤ 집계 대시보드 (선호 히트맵)
    Recommend.tsx       ⑥ 추천·확정
    Status.tsx          ⑦ 확정 후 상태 (참석자/주최자 뷰)
```

## Notes

- The top nav (주최자 / 참석자 / 공통) is the prototype screen switcher, preserved from the design.
- Demo runs entirely on mock data — no backend. Toggle the ⑤ pre-seeded objection card via
  `PRESEED_OBJECTION` in `src/data.ts`.
- Pretendard is loaded from a CDN in `index.html`; it falls back to the system sans-serif offline.
