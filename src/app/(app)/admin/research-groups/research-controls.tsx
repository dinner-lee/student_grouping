"use client";

import { useState, useTransition } from "react";
import {
  generateResearchGroupsAction,
  confirmResearchGroupsAction,
} from "@/lib/actions/research";

export function ResearchControls({
  initialCount,
  learners,
  pickedCount,
}: {
  initialCount: number;
  learners: { id: string; name: string }[];
  pickedCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const toggleExclude = (id: string) =>
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const effectiveCount = learners.length - excluded.size;
  const generate = () =>
    startTransition(() => generateResearchGroupsAction(count, [...excluded]));
  const per = effectiveCount > 0 ? Math.floor(effectiveCount / count) : 0;
  const rem = effectiveCount > 0 ? effectiveCount % count : 0;

  return (
    <div className="flex flex-col gap-5 rounded-[20px] bg-white shadow-[0_18px_44px_-26px_rgba(30,50,90,.32),0_1px_3px_rgba(30,50,90,.04)] p-6">
      <span className="font-display text-[13.5px] font-semibold text-stone-700">모둠 수 설정</span>
      <div className="flex flex-wrap items-end gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-0.5 rounded-[9px] bg-line-soft p-[3px]">
            <button
              type="button"
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              className="h-[30px] w-[30px] cursor-pointer rounded-[7px] text-base text-stone-600 hover:bg-white"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-bold">{count}</span>
            <button
              type="button"
              onClick={() => setCount((c) => Math.min(20, c + 1))}
              className="h-[30px] w-[30px] cursor-pointer rounded-[7px] text-base text-stone-600 hover:bg-white"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 pb-1 text-[12px] text-stone-400">
          <span>
            학습자 {effectiveCount}명{excluded.size > 0 && ` (${excluded.size}명 제외)`} → 모둠당{" "}
            {per}
            {rem > 0 ? `–${per + 1}` : ""}명 · 선호 제출 {pickedCount}명
          </span>
          <span>
            작성자는 자기 주제에 우선 배정되고, 나머지는 대체로 1~2순위 안에 들도록 배정합니다
          </span>
        </div>
        <button
          onClick={generate}
          disabled={pending || effectiveCount === 0}
          className="font-display ml-auto cursor-pointer rounded-[9px] bg-[linear-gradient(135deg,#2a63b4,#003E81)] px-6 py-2.5 text-[14px] text-white hover:brightness-115 disabled:opacity-60"
        >
          {pending ? "구성 중…" : "모둠 구성"}
        </button>
      </div>

      {learners.length > 0 && (
        <details className="rounded-[10px] border border-line-soft">
          <summary className="cursor-pointer list-none px-3.5 py-2.5 text-[12px] font-semibold text-stone-500">
            모둠 구성에서 제외할 학생
            {excluded.size > 0 && (
              <span className="ml-1.5 font-normal text-bad">{excluded.size}명 선택됨</span>
            )}
          </summary>
          <div className="flex flex-wrap gap-1.5 border-t border-line-soft px-3.5 py-3">
            {learners.map((l) => {
              const isOut = excluded.has(l.id);
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => toggleExclude(l.id)}
                  className={`cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    isOut
                      ? "bg-bad-soft text-bad line-through decoration-2"
                      : "bg-line-soft text-stone-600 hover:bg-accent-soft hover:text-accent"
                  }`}
                >
                  {l.name}
                </button>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}

export function ResearchConfirmButton({ setId }: { setId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() =>
        startTransition(async () => {
          if (confirm("이 구성을 확정할까요? 확정하면 학습자에게 공개됩니다.")) {
            await confirmResearchGroupsAction(setId);
          }
        })
      }
      disabled={pending}
      className="font-display cursor-pointer rounded-[9px] bg-[linear-gradient(135deg,#2a63b4,#003E81)] px-5 py-2 text-[13px] text-white hover:brightness-115 disabled:opacity-60"
    >
      {pending ? "확정 중…" : "이 구성으로 확정"}
    </button>
  );
}
