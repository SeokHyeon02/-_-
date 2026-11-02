# MyLink | 나를 소개하는 하나의 링크

**강의 2·3·4·5·6·7·9·10·11·12주차 PDF를 참고하여 구현한 Next.js 마이링크 프로젝트.**

- 홈페이지 `/` — 네오브루탈리즘 스타일의 소개 페이지
- 데모 `/demo` — 실제 보이는 공개 프로필/링크 화면
- 마이페이지 `/mypage` — 프로필 수정, 링크 Create/Read/Update/Delete
- 개인별 경로 `/[username]` — Firestore에서 username을 조회해 공개 페이지 표시
- Google 로그인 — Firebase Authentication 팝업
- 보안 — 누구나 공개 프로필/링크 **읽기 가능**, 데이터 변경은 소유 계정만 가능
- Vercel 배포 — GitHub에 `MyLink` 폴더를 업로드하고 Vercel **Root Directory: `MyLink`**

> 주의: Firebase 없이 배포해도 페이지와 데모가 표시되지만, 데모 변경 내용은 현재 브라우저 `localStorage`에만 저장됩니다. 실제 개인별 공유는 Firebase 설정과 Security Rules 게시가 필요합니다.

## 1. 로컬에서 실행

Node.js 20.9 이상을 설치한 다음 PowerShell 또는 터미널에서:

```powershell
cd MyLink
npm install
npm run dev
```

`http://localhost:3000` 접속. 기본은 데모 모드이므로 Firebase 계정 없이도 확인할 수 있습니다. `npm run build`로 배포 빌드를 확인할 수 있습니다.

## 2. GitHub에 폴더 생성/업로드 (과제 9점)

**기존 GitHub 저장소가 있다면:** 저장소 최상위에 이 `MyLink/` 폴더를 넣고 commit/push하세요.

**새 저장소를 생성한다면:** GitHub에서 공개 저장소를 만든 후, `MyLink_GitHub_Ready` (이 `MyLink` 폴더가 들어 있는 상위 폴더)에서 다음 명령을 실행합니다.

```powershell
git init
git add MyLink
git commit -m "feat: create MyLink project"
git branch -M main
git remote add origin https://github.com/여러분아이디/저장소명.git
git push -u origin main
```

이미 git 저장소인 곳에서는 `git init`/`git remote add origin`을 반복하지 말고 `git add MyLink`, `git commit`, `git push`만 수행합니다.

확인할 URL: `https://github.com/여러분아이디/저장소명/tree/main/MyLink`

## 3. Vercel 배포 (과제 1점)

1. https://vercel.com 에서 GitHub로 로그인합니다.
2. **Add New → Project → Import Git Repository**로 GitHub 저장소를 선택합니다.
3. **Root Directory를 `MyLink`로 설정**합니다. 설정하지 않으면 `package.json`을 찾지 못할 수 있습니다.
4. **Framework Preset: Next.js**를 선택합니다. Build Command와 Output Directory는 기본값을 사용합니다.
5. **Deploy**를 누른 뒤 배포 주소를 확인합니다. 예: `https://프로젝트명.vercel.app/`
6. 홈페이지와 `/demo`에 접속해 확인합니다. **이 단계까지는 Firebase 없이도 가능**합니다.

Vercel 공식 문서: https://vercel.com/docs/monorepos

## 4. Firebase를 연결해 실제 개인별 마이링크 구현

### 4.1 Firebase 프로젝트/Firestore 생성

1. https://console.firebase.google.com 에서 새 프로젝트를 생성합니다. 강의의 예시 이름은 `mylink-project`입니다.
2. `Firestore Database`를 활성화합니다. 강의에서는 `asia-northeast3`(서울) 및 테스트 모드를 소개합니다. 그러나 **실제 공개 배포에는 테스트 모드의 넓은 권한을 그대로 두면 안 됩니다.**
3. Firestore 콘솔 → **Rules**에 이 폴더의 `firestore.rules` 내용을 붙여 넣고 **Publish**합니다.
4. 인증 → **Sign-in method → Google** 로그인 제공업체를 활성화합니다.
5. 프로젝트 설정 → 내 앱 → 웹 앱 등록 후 SDK 설정의 값을 확인합니다.

### 4.2 로컬 환경변수 설정

`MyLink/.env.example`을 복사하여 **`MyLink/.env.local`**을 만들고 값을 채웁니다.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
```

최소 필수: `API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `APP_ID`의 4개 값입니다. 설정 후 `npm run dev` 서버를 재시작하세요.

**절대** `.env.local` 파일이나 Firebase 서비스 계정 비밀키를 GitHub에 올리지 마세요. 웹 SDK의 `NEXT_PUBLIC_` 환경변수 값은 브라우저에 공개됩니다. 실제 접근 제어는 Firestore Rules가 담당합니다.

### 4.3 Vercel 환경변수 설정

Vercel 프로젝트 → **Settings → Environment Variables**에서 동일한 `NEXT_PUBLIC_FIREBASE_*` 변수를 입력합니다. 변경 후 **Redeploy**가 필요합니다. Firebase Authentication 콘솔의 **Settings → Authorized domains**에도 실제 배포 도메인(`프로젝트명.vercel.app`, https 제외)을 추가해야 Google 팝업 로그인이 동작합니다.

Firebase 공식 문서: https://firebase.google.com/docs/auth/web/google-signin

### 4.4 기능 테스트

1. `/mypage`에서 **Google로 로그인**
2. username, 표시 이름, 소개글 입력 및 프로필 저장
3. 링크 제목/주소 입력 → 추가
4. 링크 목록에서 **수정(인라인 편집)**, 삭제(확인 대화상자)
5. 새로고침 후 링크 저장 여부 확인
6. `https://실제도메인.vercel.app/username`을 **시크릿 창**에서 열어 로그인 없이도 조회되는지 확인
7. 다른 Google 계정으로 로그인했을 때 다른 사용자의 데이터를 수정할 수 없는지 보안 규칙 확인

## 5. Firestore 데이터 구조

```text
users/{uid}/profile/public       : username, displayName, bio, createdAt, updatedAt
users/{uid}/links/{linkId}       : title, url, createdAt, updatedAt
usernames/{username}            : userId
```

강의의 `users/{userId}/profile`은 계층 설명용 표기이므로, **실제 문서 경로**로는 `/public`을 붙였습니다. 공개 개인 페이지는 username → userId 변환용 `usernames` 문서에서 소유자 ID를 찾습니다. 프로필 저장은 Firestore Transaction을 사용하여 username 중복을 방지하고 관련 데이터를 함께 갱신합니다.

`firestore.rules`에서는 공개 읽기와 **본인만 쓰기** 권한을 구분합니다. 공개 프로필에는 이름/소개/username만 저장하며 이메일을 공개하지 않습니다.

## 6. 주요 문제 해결

| 증상 | 확인할 것 |
|---|---|
| Vercel 빌드 시 `package.json` 없음 | Root Directory가 **MyLink**인지 확인 |
| 첫 화면이 데모 모드로 표시 | Firebase 환경변수 4개가 설정되어 있고 Redeploy 했는지 확인 |
| `auth/unauthorized-domain` | Firebase 인증 승인된 도메인에 Vercel 도메인 추가 |
| `Missing or insufficient permissions` | Firestore Rules 게시 여부와 로그인 계정 UID 확인 |
| URL 아이디가 이미 사용 중 | 다른 username으로 변경하여 다시 저장 |
| 다른 기기에서 데모 변경 내용이 보이지 않음 | 데모는 브라우저 로컬 저장만 지원, Firebase 모드 필요 |
| URL을 열었는데 404 | username 오타 또는 프로필 미저장 확인 |

## 7. 강의 주차별 적용 내용

구체적인 대응표는 [`docs/PDF_MAPPING.md`](docs/PDF_MAPPING.md), 요구사항/시나리오는 [`docs/PRD.md`](docs/PRD.md), 와이어프레임은 [`docs/WIREFRAME.md`](docs/WIREFRAME.md)에 정리했습니다.

## 공식 참고자료

- Next.js 배포: https://nextjs.org/docs/app/getting-started/deploying
- Vercel Root Directory: https://vercel.com/docs/monorepos
- Firebase Google 인증: https://firebase.google.com/docs/auth/web/google-signin
- Firestore 데이터 모델: https://firebase.google.com/docs/firestore/data-model
- Firestore 보안 조건: https://firebase.google.com/docs/firestore/security/rules-conditions
