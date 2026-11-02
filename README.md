# MyLink 과제

## 프로젝트 소개

MyLink는 자기소개와 여러 웹사이트 링크를 하나의 페이지에 모아 공유하는 웹 애플리케이션입니다. 프로필과 링크를 관리하고 개인 주소로 공개할 수 있도록 제작했습니다.

## 과제 제출 정보

- **GitHub 프로젝트 폴더**: [MyLink](./MyLink)
- **마이링크 접속 주소**: https://seokhyeon-mylink.vercel.app/

## 주요 기능

- 사용자 아이디, 표시 이름과 소개글 작성 및 수정
- 링크 추가, 조회, 수정 및 삭제
- `/{username}` 주소로 프로필과 링크 공유
- Firebase Authentication을 이용한 Google 로그인
- Firebase 설정 없이 체험할 수 있는 데모 모드 (변경 내용은 현재 브라우저에 저장)

## 사용 기술

Next.js, React, TypeScript, CSS, Firebase Authentication, Cloud Firestore

## 실행 방법

Node.js 20.9 이상에서 다음 명령을 실행합니다.

```bash
cd MyLink
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`에 접속합니다. Firebase를 설정하지 않으면 데모 모드로 실행됩니다.

## 배포 및 Firebase 설정

Vercel에서 저장소를 가져올 때 Root Directory를 `MyLink`로 지정합니다. Firebase를 연결하려면 Google 로그인을 활성화하고 Firestore 보안 규칙을 게시한 뒤 환경변수를 설정해야 합니다. 자세한 방법은 [프로젝트 안내서](./MyLink/README.md)를 참고하세요.
