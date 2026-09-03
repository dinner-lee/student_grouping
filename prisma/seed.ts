import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// 초기 계정: 관리자 1명 + 초대 코드
async function main() {
  const adminPw = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", name: "관리자", passwordHash: adminPw, role: "ADMIN" },
  });

  await prisma.inviteCode.upsert({
    where: { code: "WELCOME" },
    update: {},
    create: { code: "WELCOME", role: "LEARNER", active: true },
  });

  console.log("시드 완료 — 관리자 계정: admin / admin1234, 학습자 초대 코드: WELCOME");
}

main().finally(() => prisma.$disconnect());
