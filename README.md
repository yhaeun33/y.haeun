# Haeun · Adriot Portfolio

윤하은(Adriot) 디자이너 포트폴리오 사이트예요. GitHub Pages로 바로 배포할 수 있는 정적 사이트예요.

- `index.html`: 메인 (Hero · About · Selected Projects · Skills · Contact)
- `work.html`: 작업물 전체 (웹사이트·앱 74 · 상세페이지 6 · 기획전 57 · AI 이미지 63 · 광고 94)
- `data/works.js`: 작업물 목록 (제목, 분류, 이미지 경로, 링크)
- `images/`: 작업 이미지 (`<분류>/` 썸네일, `<분류>/full/` 크게 보기용)
- `assets/`: 스타일과 스크립트
- `project/`: Claude 디자인 캔버스 원본 (`Main.dc.html`, `Work.dc.html`)

## 배포

GitHub 저장소 Settings → Pages → Source를 `Deploy from a branch`로, 브랜치를 `main`의 `/ (root)`로 지정하면 돼요.

## 작업물 추가

1. 이미지를 `images/<분류>/`(썸네일)와 `images/<분류>/full/`(원본)에 넣어요.
2. `data/works.js`의 해당 분류 배열에 항목을 추가해요.
