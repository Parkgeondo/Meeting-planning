# 모두가 만족하는 회의시간 찾기 — Design Spec v1.0

> 목적: 이 문서를 Figma AI(Figma Make 등) 또는 Tokens Studio에 넣어 피그마에서 디자인 시스템 + 화면을 재구성하기 위한 명세.
> 원본: HTML 프로토타입 (모바일 웹, 375px 고정폭, 설치·가입 없음).

---

## 1. 파운데이션

### 1.1 컬러 토큰

**브랜드 / 액션**
| 토큰 | 값 | 용도 |
|---|---|---|
| `primary` | `#3182F6` | 주요 CTA 버튼, 선택 상태, 링크, 강조 텍스트 |
| `primary/light` | `#EAF3FE` | 선택 칩 배경, 보조 버튼 배경, 태그 배경 |
| `primary/deep` | `#1B64DA` | 밝은 배경 위 강조 텍스트 |
| `primary/gradient` | `linear-gradient(135deg, #3182F6, #5FA5F9)` | 확정 카드, 공유 썸네일 |

**하트(선호) 계열**
| 토큰 | 값 | 용도 |
|---|---|---|
| `heart` | `#FF5B3E` | 하트 아이콘, 인기 순위 강조 |
| `heart/light` | `#FFF0EC` | 하트 선택 셀 배경, 완료 아이콘 배경 |
| `heart/border` | `#FFB9A8` | 하트 선택 셀 테두리 |
| `heart/gradient` | `linear-gradient(90deg, #FF8A6B, #FF5B3E)` | 인기도 바 |
| `recommend/bg` | `linear-gradient(135deg, #FFF3EF, #FFF8F0)` + border `#FFD9CD` 1.5px | 추천 1위 카드 |

**그레이스케일 (텍스트 → 배경 순)**
| 토큰 | 값 | 용도 |
|---|---|---|
| `text/primary` | `#191F28` | 제목, 본문 강조 |
| `text/secondary` | `#4E5968` | 서브 텍스트, 칩 레이블 |
| `text/tertiary` | `#6B7684` | 설명문 |
| `text/quaternary` | `#8B95A1` | 캡션, 레이블, 비활성 |
| `text/disabled` | `#B0B8C1` | 시간 레이블, 미응답 |
| `border` | `#E5E8EB` | 칩·셀 기본 테두리 (1~1.5px) |
| `border/dashed` | `#D1D6DB` | 미응답 아바타 점선 |
| `fill/deep` | `#E8EBED` | 제외(지운) 셀 |
| `fill` | `#F2F4F6` | 입력 필드, 프로그레스 트랙, 중립 태그 |
| `fill/light` | `#F9FAFB` | 카드 배경 |
| `bg/canvas` | `#EDF0F3` | 앱 밖 캔버스 배경 |
| `bg/surface` | `#FFFFFF` | 폰 프레임, 카드 |

**시맨틱 / 기타**
| 토큰 | 값 | 용도 |
|---|---|---|
| `success` | `#38C79C` | 복사 완료 등 성공 피드백 |
| `grid/available` | `#F4F9FF` + border `#DEEBFB` 1px | 가능 셀 (STEP1) |
| `grid/good` | `#DFF5EA` / deep `#12B76A` | "좋아요" 셀 |
| `grid/soso` | `#FFF3D6` / deep `#F2A93B` + 45° 스트라이프 | "되긴 해요" 셀 |
| `grid/no` | `#3A3D46` | "안 돼요" 셀 |
| `kakao` | `#FEE500` (텍스트 `#191F28`) | 카카오 공유 버튼 |
| `avatar` 팔레트 | `#3182F6` `#00A5B8` `#7B61FF` `#F5A623` `#FF5B3E` `#38C79C` | 참석자 아바타 |

### 1.2 타이포그래피

폰트: **Pretendard Variable** (fallback: -apple-system, system-ui, sans-serif). 큰 제목엔 `letter-spacing: -1%`.

| 스타일 | 크기/굵기/행간 | 용도 |
|---|---|---|
| `display` | 32px / 800 / 1.2 | 확정 시간 |
| `title-1` | 24–26px / 800 / 1.35 | 화면 제목, 결과 시간 |
| `title-2` | 21px / 800 / 1.35 | 섹션 제목 (입력 단계) |
| `title-3` | 18.5px / 800 / 1.45 | 바텀시트 제목 |
| `body-1` | 17px / 600–700 | 입력 텍스트, CTA 버튼 |
| `body-2` | 14.5–15px / 500–600 / 1.5–1.6 | 설명문, 리스트 항목 |
| `label-1` | 13–14px / 600–700 | 필드 레이블, 칩, 카드 소제목 |
| `caption-1` | 12–12.5px / 500–700 | 보조 정보, 태그, 익명 고지 |
| `caption-2` | 10.5–11.5px / 600 | 그리드 시간축, 아바타 이름 |

### 1.3 간격 · 라운드 · 그림자

- 간격 스케일: 2 / 4 / 6 / 8 / 10 / 14 / 16 / 20 / 24 / 28 / 32
- 화면 패딩: 좌우 24px (밀도 높은 그리드 화면은 16–20px), 상단 28px
- 라운드: 셀 4–9px · 입력/칩 12–14px · CTA 16px · 카드 18–22px · 폰 프레임 28px · pill 999px
- 그림자: 폰 프레임 `0 12px 40px rgba(25,31,40,.10)` · 확정 카드 `0 10px 24px rgba(49,130,246,.28)` · 칩 `0 1px 3px rgba(0,0,0,.06)` · 툴팁 `0 6px 18px rgba(25,31,40,.25)`

---

## 2. 컴포넌트

### Button
- **Primary CTA**: H 54–56px, full-width, bg `primary`, 텍스트 white 16–17px/700, radius 16px
- **Primary CTA / disabled**: bg `#DEE3E8`, 텍스트 `#8B95A1`
- **Secondary**: H 48px, bg `primary/light`, 텍스트 `primary` 15px/700, radius 14px
- **Ghost/text**: H 38–44px, 배경 없음, 텍스트 `#8B95A1` 13.5–14px/600
- **Kakao**: CTA와 동일 + bg `#FEE500`, 텍스트 `#191F28`

### Selection Chip (소요 시간·기간 선택)
- H 44px, flex 균등분할, radius 12px, 14px/700
- 기본: border `#E5E8EB` 1.5px, bg white, 텍스트 `#6B7684`
- 선택: border `primary` 1.5px, bg `primary/light`, 텍스트 `primary`
- 전환: all .15s

### Nav Chip (프로토타입 상단)
- H 30px, radius 15px, 12.5px/700 · 기본 white + 그림자 / 활성 `primary` + white 텍스트

### Input Field
- H 44–54px, bg `fill`, radius 12–14px, 패딩 좌우 14–16px, 테두리 없음, 텍스트 15–17px/600

### Time Grid Cell
- H 25–36px, radius 4–9px, transition .12–.18s
- STEP1 가능: `grid/available` / 제외: `fill/deep` + scale(.90) + inset shadow
- STEP2 하트: `heart/light` + border `heart/border` 1.5px + ♥ 애니메이션 / 비활성: `#F5F6F8` opacity .45 scale(.94)
- 3단계 브러시: good `#DFF5EA` / soso `#FFF3D6` + 스트라이프 `repeating-linear-gradient(45deg, rgba(242,169,59,.22) 0 3px, transparent 3px 7px)` / no `#3A3D46`
- 인터랙션: 탭 = 상태 순환, 드래그 = 일괄 페인팅

### Day Header (그리드 요일)
- 요일 13px/700 + 날짜 10.5px opacity .65 · 탭 시 하루 전체 토글 (전체 제외 시 bg `fill`, 텍스트 `#B0B8C1`)

### Avatar
- 42px(현황) / 30px(리스트) 원형, 이니셜 1자, `avatar` 팔레트 순환
- 미응답: white bg + 1.5px dashed `#D1D6DB` + "?" `#B0B8C1`

### Tag / Badge
- "필수": bg `primary/light`, 텍스트 `primary` · "선택": bg `fill`, 텍스트 `#8B95A1` — 11.5px/700, 패딩 3×9px, radius 12px
- "추천 1위": bg `heart`, white, 12px/800, 패딩 4×10px, radius 20px
- "STEP n/2": bg `primary/light`, 텍스트 `primary`, 12px/700, radius 20px

### Progress Bar
- H 8px, 트랙 `fill`, 필 `primary`, radius 4px, width transition .4s
- 인기도 바: H 10px, 필 `heart/gradient`

### Card
- **기본**: bg `fill/light`, radius 18px, 패딩 16–18px
- **추천 1위**: `recommend/bg`, radius 20px, 패딩 20px, popIn 애니메이션
- **확정**: `primary/gradient`, radius 22px, 패딩 26×22px, 중앙 정렬 white, 그림자

### Info Banner (익명 고지)
- bg `#F0F6FF`, 패딩 10×20px, 🔒 + 12px/500 `#4E5968`, 강조 `primary/deep` bold

### Bottom Sheet
- radius 상단 24px, 핸들 36×4px `#E5E8EB`, 패딩 14/20/26, 딤 `rgba(25,31,40,.45)`

### Tooltip
- bg `#191F28`, white 11.5px/500, radius 10px, 패딩 10×12px, 45° 화살표

---

## 3. 모션

| 이름 | 정의 | 용도 |
|---|---|---|
| `fadeUp` | translateY(14px)→0 + opacity, .3s ease | 화면 전환 |
| `popIn` | scale(.85)→1 + opacity, .35–.45s cubic-bezier(.2,1.4,.4,1) | 카드·아이콘 등장 |
| `heartPop` | scale 0→1.5→1, .4s cubic-bezier(.2,2,.4,1) | 하트 찍기 |
| `confettiFall` | translateY(800px) + rotate(560deg), 2.4–4.4s linear | 확정 축하 |
| 셀 전환 | 크로스페이드 120ms + scale .95→1 스프링 | 그리드 페인팅 |
| 상태 전환 공통 | all .15–.2s | 칩, 버튼 |

---

## 4. 화면 목록 (375×740+, 폰 프레임 radius 28px)

**주최자**
1. ① 회의 만들기 — 제목 + 이름 입력 + 소요시간 칩 4개 + 기간 칩 3개 + CTA "링크 만들기"
2. ② 카톡 공유 — 링크 복사 필드 + 카톡 미리보기 카드(bg `#B2C7DA`) + Kakao CTA
3. ③ 응답 현황 — "4명이 응답했어요" + 프로그레스 + 아바타 6개 + 인기 시간 카드 + CTA "결과 보기"
4. ④ 결과·확정 — 추천 1위 카드 + 나머지 슬롯 리스트 + 익명 고지 + CTA "이 시간으로 확정"

**참석자**
5. ⑤ 입력 STEP1 — "안 되는 시간만 지워주세요" + 5×9 그리드(드래그 지우기, 요일 토글)
6. ⑤ 입력 STEP2 — "언제가 제일 좋아요?" + 하트 3개 슬롯 + 그리드 하트 찍기
7. ⑥ 완료 — 하트 아이콘(84px 원) + "선호가 반영됐어요"
8. (변형) 참석자 입력 그리드 — 3단계 브러시(좋아요/되긴 해요/안 돼요) + 브러시 셀렉터 + 점심시간 행 + 비공개 이의 바텀시트

**공통**
9. ⑦ 확정 — 컨페티 + 확정 그라데이션 카드 + 참석자 리스트(필수/선택 태그) + CTA "캘린더에 추가"

---

## 5. 보이스 & 톤

- 존댓말 해요체, 짧고 다정하게. 예: "말 안 해도 알아서 모아드려요", "드래그로 쓱— 지울 수 있어요"
- 숫자 피드백 즉시 반영: "3칸 지웠어요, 다음으로"
- 익명성 고지는 반복 노출: "하트는 익명으로 집계돼요"
- 이모지는 최소한만: 📅 🔒 📋 ♥
