import { prisma } from "@/lib/prisma";
import { initialOf, topicTitleOf } from "@/lib/utils";

// 확정된 자율연구 모둠 보기 (학습자·관리자 공용) — 내 모둠 카드를 맨 앞에 강조
export async function ConfirmedGroups({ userId }: { userId: string }) {
  const set = await prisma.researchGroupSet.findFirst({
    where: { confirmedAt: { not: null } },
    orderBy: { confirmedAt: "desc" },
    include: {
      groups: {
        orderBy: { index: "asc" },
        include: {
          topic: { select: { markdown: true, user: { select: { name: true } } } },
          members: { include: { user: { select: { name: true } } } },
        },
      },
    },
  });

  if (!set)
    return (
      <div className="rounded-[20px] bg-white p-7 text-sm text-stone-400 shadow-[0_18px_44px_-26px_rgba(30,50,90,.32),0_1px_3px_rgba(30,50,90,.04)]">
        아직 확정된 모둠이 없습니다.
      </div>
    );

  const groups = [...set.groups].sort(
    (a, b) =>
      Number(b.members.some((m) => m.userId === userId)) -
        Number(a.members.some((m) => m.userId === userId)) || a.index - b.index
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {groups.map((g) => {
        const isMine = g.members.some((m) => m.userId === userId);
        return (
          <div
            key={g.id}
            className={`flex flex-col gap-3 rounded-[16px] bg-white px-5 py-[18px] shadow-[0_14px_34px_-22px_rgba(30,50,90,.28)] ${
              isMine ? "ring-[1.5px] ring-accent-border" : ""
            }`}
          >
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-2 font-display text-[13.5px]">
                <span className="font-bold text-accent">모둠 {g.index + 1}</span>
                {isMine && (
                  <span className="rounded-[5px] bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                    내 모둠
                  </span>
                )}
                <span className="text-stone-400">· {g.members.length}명</span>
              </span>
              <span className="text-[13px] leading-snug font-semibold text-stone-800">
                {topicTitleOf(g.topic.markdown)}
              </span>
              <span className="text-[11px] text-stone-400">
                주제 작성: {g.topic.user.name.split("/")[0].trim()}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {g.members.map((m) => (
                <span
                  key={m.id}
                  className="flex items-center gap-1.5 rounded-full bg-paper py-1 pr-2.5 pl-1"
                >
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-line text-[8.5px] font-semibold text-stone-600">
                    {initialOf(m.user.name)}
                  </span>
                  <span className="text-[11.5px] font-medium text-stone-700">
                    {m.user.name.split("/")[0].trim()}
                  </span>
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
