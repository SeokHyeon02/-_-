# 강의 PDF ↔ 구현 기능 대응표

> 수업자료의 **마지막 실습 부분**을 기준으로 무엇을 반영했는지 정리했습니다. 강의자료 내용과 별도 기술 구현(보완사항)을 구분합니다.

| PDF | 마지막 실습에서 요청한 내용 | 실제 파일/구현 | 비고 |
|---|---|---|---|
| 2주차(1).pdf p.24–25 | Gemini CLI로 Next.js 프로필 페이지 생성 | `app/page.tsx`, `components/ProfileCard.tsx` | 직접 코드를 완성해 제공, Gemini CLI 별도 실행 불필요 |
| 3주차(1).pdf p.31–33 | GitHub 저장소 생성, Git 연동, 커밋/푸시 | `README.md`의 GitHub 가이드, 상위 `MyLink/` 폴더 | GitHub 저장소 생성/업로드는 사용자 계정 연결 필요 |
| 4주차(1).pdf p.33–35 | 구체적인 네오브루탈리즘 스타일, 모바일 360/태블릿 768/데스크톱 1024 반응형 | `app/globals.css` | 굵은 테두리/하드 그림자/반응형 디자인 |
| 5주차(1).pdf p.30–34 | PRD·사용자 시나리오·와이어프레임 작성 | `docs/PRD.md`, `docs/WIREFRAME.md` | Markdown 형태로 포함 |
| 6주차(1).pdf p.30–31 | 인스타·유튜브·블로그 더미 링크 목록 UI | `lib/demo.ts`, `components/ProfileCard.tsx` | 디자인 시스템 역할의 공통 컴포넌트 구현. shadcn/ui 자체 설치는 생략(채점 필수 아님) |
| 7주차(1).pdf p.35–40 | `/mypage`, 제목/URL 입력, 검증, 목록에 추가, 자동 초기화 | `app/mypage/page.tsx`, `lib/validation.ts` | 데모는 localStorage, Firebase 모드는 Firestore 저장 |
| 9주차.pdf p.33–38 | Firebase 생성, SDK 연동, 링크 영구 저장·조회 | `lib/firebase.ts`, `lib/firestore.ts`, `.env.example` | Firebase 프로젝트 생성 및 환경변수 입력은 사용자가 해야 함 |
| 10주차.pdf p.30–35 | 링크 인라인 수정/저장·취소, 삭제 확인, updateDoc/deleteDoc | `app/mypage/page.tsx` | 목록 안에서 직접 수정, 취소, 삭제 모달 제공 |
| 11주차.pdf p.40–45 | Google 로그인/로그아웃, onAuthStateChanged, `users/{uid}/links` | `app/mypage/page.tsx`, `lib/firebase.ts` | Firebase Auth 활성화 필요 |
| 12주차.pdf p.35–42 | username/displayName/bio, 중복 체크, 동적 경로, 데이터 분리, Rules | `app/[username]/page.tsx`, `lib/firestore.ts`, `firestore.rules` | Firestore 문서 경로와 원자적 username 점유는 실제 동작하도록 보완 |

## PDF에 없는 후속 과정 (추가 구현)

- 강의 12주차 p.42에서 **14주차 Vercel 배포 예정**이라고 언급하지만 이번 업로드에는 14주차 자료가 포함되지 않았습니다.
- `README.md`의 **Vercel 배포 절차**는 강의 실습이 아니라 Vercel 공식 문서를 확인하여 별도로 정리한 것입니다.
- Firestore는 collection/doc 경로가 번갈아 나와야 하므로 `users/{uid}/profile/public`을 사용합니다. `usernames/{username}`을 두어 클라이언트 쿼리의 불필요한 개인 정보 노출 없이 공개 페이지를 조회하고, 트랜잭션으로 username 중복을 방지합니다.
- PDF 6주차의 shadcn/ui는 수업 권장 도구이지만 **구현에서는 공통 React 컴포넌트 + CSS**를 사용했습니다. 4주차의 네오브루탈리즘 스타일과 반응형 요구사항을 만족하는 데 초점을 맞췄습니다.
- 인증 없는 데모 모드는 강의의 더미 데이터 단계를 사이트 배포 이후에도 체험할 수 있게 추가한 모드이며, 실제 계정별 공유 데이터 저장을 대체하지 않습니다.
