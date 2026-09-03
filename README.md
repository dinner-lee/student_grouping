# student_grouping

관심 주제 카드 기반 자율연구 모둠 구성 웹앱 (Next.js + PostgreSQL + Prisma)

## 기능

- **관심 주제 카드** — 학습자가 자기 연구 주제를 작성하고, 동료 카드에 하트·댓글로 반응
- **관심 키워드 지도** — 키워드 클라우드에서 하트를 눌러 내 관심 키워드에 추가
- **학생 네트워크 그래프** — 관심 키워드가 겹치는 학생을 힘-지향(d3-force) 그래프로 시각화 (하트·댓글 상호작용 표시 포함)
- **키워드 그래프** — 학생–키워드 이분 그래프
- **관심 순위(1~5)** — 동료 주제 카드에 1~5순위를 매겨 모둠 구성 선호 제출
- **모둠 구성(관리자)** — 순위 데이터를 볼록 비용 기반 배정 알고리즘으로 최적화해 시안 생성 → 멤버 이동 조정 → 확정하면 학습자에게 공개
- **계정** — 아이디/비밀번호 + 초대 코드 가입, Google 로그인(선택), 관리자 계정 관리

## 시작하기

```bash
pnpm install
cp .env.example .env       # DATABASE_URL, AUTH_SECRET 채우기
pnpm prisma migrate deploy # DB 스키마 적용
pnpm seed                  # 관리자 계정(admin/admin1234) + 초대 코드(WELCOME) 생성
pnpm dev
```

배포: Vercel + Postgres 계열(Neon, Supabase, Vercel Postgres 등). `DATABASE_URL`만 바꾸면 됩니다.

## 데이터 관리

학습자 명단·주제·순위 데이터는 모두 PostgreSQL에 저장됩니다. 계정 생성은 두 방식:

1. 초대 코드를 공유해 학습자가 스스로 가입 (아이디/비밀번호)
2. Google 로그인 연동 시 첫 로그인에 학습자 계정 자동 생성 — 역할은 관리자가 '계정 관리'에서 변경
