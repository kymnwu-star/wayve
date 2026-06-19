# Implementation Plan: BUSAN WAVE 🌊

이 문서는 "부산 독점 로컬 투어 플랫폼: BUSAN WAVE"의 개발을 위한 기술 구현 계획서입니다.

## 🚨 User Review Required

사용자용 **투어 목록 페이지(`/tours`)** 구축 계획입니다. 아래 기획 내용에 대해 승인해 주시면 개발을 시작합니다.

### 기획 내용
- **접속 경로**: `/tours` (메인 네비게이션 바의 'Tours' 메뉴 클릭 시 이동)
- **기능**: 사용자가 탐색할 수 있는 프리미엄 투어 상품 목록 제공
- **더미 데이터 (요청 사항 반영)**: 카테고리별 3개씩, 총 9개의 고품질 가상 투어 데이터를 화면에 하드코딩하여 바로 볼 수 있도록 채워 넣겠습니다.

### 디자인 스펙 (UI/UX)
- **갤러리형 그리드 레이아웃**: 시원하고 감각적인 에디토리얼 디자인(잡지 형태)을 위해 큼직한 썸네일과 세련된 폰트 배치를 사용합니다.
- **카테고리 구분**: 'Marine Cruise', 'Boutique Coffee', 'Night Exploration' 별로 섹션을 나누어 진열합니다.

---

## Proposed Changes

### [MODIFY] `src/app/layout.tsx`
- 네비게이션 바의 `<Link href="#">Tours</Link>`를 `<Link href="/tours">Tours</Link>`로 수정하여 연결.

### [NEW] `src/app/tours/page.tsx`
- 9개의 프리미엄 가상 투어 데이터를 담은 배열(Array) 생성.
- 카테고리별로 그룹화하여 렌더링하는 서버 컴포넌트 페이지 구축.

### [NEW] `src/app/tours/page.module.css`
- 카드 호버 시 부드러운 애니메이션(스케일 업, 글로우 효과 등) 추가.
- 잡지 화보 같은 럭셔리한 갤러리 디자인 CSS 적용.

---

## Verification Plan
1. 메인 화면 상단 네비게이션의 **Tours**를 클릭.
2. `/tours` 페이지로 이동하며 카테고리별 3개씩 총 9개의 투어가 예쁘게 진열되는지 확인.
3. 카드 호버 시 의도한 애니메이션과 다크/네온 그린 테마가 잘 어우러지는지 확인.
