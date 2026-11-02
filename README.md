# MyLink

MyLink는 자기소개와 여러 링크를 하나의 공개 페이지로 공유하는 웹 서비스입니다. Next.js로 제작했으며, Firebase를 연결하면 Google 로그인과 사용자별 데이터 저장을 이용할 수 있습니다.

## 주요 기능

- 프로필 이름과 소개글 작성, 링크 추가·수정·삭제
- `/{username}` 주소로 프로필과 링크 공유
- Firebase Authentication의 Google 로그인과 Firestore 데이터 저장
- Firebase 설정 없이 브라우저에만 데이터가 저장되는 데모 모드 제공

## 실행 및 배포

```bash
cd MyLink
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. Vercel 배포 시 Root Directory는 `MyLink`로 설정합니다.

Firebase 설정과 자세한 사용 방법은 [프로젝트 안내서](MyLink/README.md)를 참고하세요.
