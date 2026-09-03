import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { UserAvatar } from "@/components/user-menu";
import { RoleToggle } from "./role-toggle";
import { InviteCodeManager } from "./invite-codes";
import { LogoSettings } from "./logo-settings";

export default async function AdminUsersPage() {
  const me = await requireAdmin();

  const [users, inviteCodes, settings] = await Promise.all([
    prisma.user.findMany({
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
      include: { _count: { select: { topicPicks: true } } },
    }),
    prisma.inviteCode.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.appSettings.findUnique({ where: { id: "main" } }),
  ]);

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex flex-col gap-0.5">
        <div className="font-display text-[17px] font-bold tracking-tight">환경 설정 관리</div>
      </div>

      <InviteCodeManager initial={inviteCodes} />

      <LogoSettings logoUrl={settings?.logoUrl ?? null} />

      <div className="flex flex-col gap-3 rounded-[20px] bg-white p-6 shadow-[0_18px_44px_-26px_rgba(30,50,90,.32),0_1px_3px_rgba(30,50,90,.04)]">
        <span className="font-display text-[13.5px] font-semibold text-stone-700">사용자 목록</span>
        <div className="overflow-x-auto rounded-[12px] bg-paper">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[1fr_130px_190px_90px_150px] gap-2 border-b border-line-soft px-5 py-[11px] text-[11px] font-semibold text-stone-400">
              <span>이름</span>
              <span>아이디</span>
              <span>이메일</span>
              <span className="text-right">선호 제출</span>
              <span className="text-right">역할</span>
            </div>
            {users.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-[1fr_130px_190px_90px_150px] items-center gap-2 border-b border-line-soft px-5 py-3 last:border-b-0"
              >
                <div className="flex items-center gap-2.5">
                  <UserAvatar name={u.name} image={u.image} size={28} />
                  <span className="text-[13px] font-medium text-stone-800">
                    {u.name}
                    {u.id === me.id && (
                      <span className="ml-1 text-[11px] text-stone-400">(나)</span>
                    )}
                  </span>
                  {u.email && (
                    <span className="rounded-[4px] bg-line-soft px-1.5 py-0.5 text-[10px] font-semibold text-stone-500">
                      Google
                    </span>
                  )}
                </div>
                <span className="truncate text-xs text-stone-500">{u.username}</span>
                <span className="truncate text-xs text-stone-400">{u.email ?? "–"}</span>
                <span className="text-right text-xs text-stone-500">{u._count.topicPicks}</span>
                <div className="flex justify-end">
                  {u.id === me.id ? (
                    <span className="rounded-md bg-accent-soft px-2.5 py-1 text-[11.5px] font-semibold text-accent">
                      관리자
                    </span>
                  ) : (
                    <RoleToggle userId={u.id} role={u.role} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
