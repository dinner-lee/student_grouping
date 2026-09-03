# student_grouping

관심 주제 기반 모둠 구성을 지원하는 웹앱(Next.js + PostgreSQL + Prisma)입니다.

## 기능

- **주제 탐색** — 학습자가 자기 연구 주제 카드를 작성하고, 동료 카드에 하트·댓글로 반응할 수 있습니다.
  - 카드 보기 / 학생 네트워크 그래프(관심 키워드가 겹치는 학생을 힘-지향 그래프로 시각화, 하트·댓글 상호작용 포함) / 키워드 그래프(학생–키워드 이분 그래프) 3가지 보기 사이에 전환이 가능합니다.
  - 키워드 목록에서 하트를 눌러 내 관심 키워드로 추가할 수 있습니다.
- **관심 순위(1~5)** — 동료 주제 카드에 순위를 매겨 모둠 구성 선호도를 제출할 수 있습니다.
- **모둠 구성(관리자 모드)** — 주제별 선호도 확인 → 모둠 수를 설정해 배정 알고리즘에 따라 모둠 구성 → (필요한 경우) 모둠원 개별 조정 → 확정 시 학습자에게 공개되고, 확정 기록이 보관됩니다.
- **환경 설정(관리자 모드)**
  - 초대 코드 관리 — 학습자용/관리자용 코드를 여러 개 발급하거나, 비활성화·삭제할 수 있습니다.
  - 로고 이미지 설정 — 상단바·로그인 화면에 표시할 로고를 이미지 URL로 지정(비우면 텍스트만 표시)할 수 있습니다.
  - 사용자 목록 — 계정 역할(학습자/관리자)을 변경할 수 있습니다.
- **계정** — 아이디/비밀번호 + 초대 코드로 가입이 가능합니다(필요한 경우 Google 로그인을 추가할 수 있습니다). 

## 프로젝트 복사(클론)와 설정

### 1. 저장소 클론

```bash
git clone https://github.com/dinner-lee/student_grouping.git
cd student_grouping
```

### 2. 의존성 설치

[pnpm](https://pnpm.io)을 사용합니다. (`npm install -g pnpm`으로 설치)

```bash
pnpm install
```

### 3. 데이터베이스 준비

PostgreSQL 데이터베이를 설정합니다. 다음 중 하나를 선택해 주십시오.

- **로컬 Postgres**: `createdb student_grouping`
- **Neon**: [neon.tech](https://neon.tech)에서 프로젝트 생성 → Connection string 복사
- **Supabase**, **Vercel Postgres** 등 다른 관리형 Postgres도 동일하게 사용 가능합니다.

위 서비스에서 프로젝트를 생성한 후 `postgresql://...` 형태의 연결 문자열을 복사하여 Vercel에서 배포할 때 환경 변수(environmental variables)에 입력해 주십시오.

### 4. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 다음 값을 채웁니다.

- `DATABASE_URL` — 3단계에서 준비한 Postgres 연결 문자열
- `AUTH_SECRET` — `openssl rand -base64 32` 명령으로 생성한 임의의 문자열
- `AUTH_TRUST_HOST` — 로컬 개발 시 `true` (배포 시에도 대부분 `true` 유지)
- Google 로그인을 사용하지 않는 경우 `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`은 비워 두셔도 괜찮습니다.

### 5. 데이터베이스 스키마 적용

```bash
pnpm prisma migrate deploy
```

### 6. 개발 서버 실행

```bash
pnpm dev
```

`http://localhost:3000`으로 접속합니다. **데이터베이스에 계정이 하나도 없으면 로그인 화면에서 바로 관리자 계정을 만들 수 있습니다** — 이름/아이디/비밀번호를 입력하면 첫 계정이 관리자로 생성되고, 학습자용 초대 코드(`WELCOME`)도 함께 만들어집니다. 이후 관리자는 '환경 설정'에서 코드를 추가로 발급하거나 비활성화할 수 있습니다.

(선택) 웹 화면 대신 커맨드라인으로 초기 관리자 계정을 만들고 싶다면:

```bash
pnpm db:seed   # 관리자 계정 admin / admin1234, 초대 코드 WELCOME 생성
```

## 프로덕션 배포 (Vercel)

1. 이 저장소를 본인 GitHub 계정으로 포크하거나, 그대로 Vercel에 Import 합니다.
2. Vercel 프로젝트 설정의 Environment Variables에 `DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`를 입력, 설정합니다. 
3. 배포된 주소로 처음 접속하면 로그인 화면에서 관리자 계정을 생성하는 화면이 나타납니다.

