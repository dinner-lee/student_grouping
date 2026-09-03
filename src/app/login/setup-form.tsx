"use client";

import { useActionState } from "react";
import { bootstrapAdminAction, type AuthFormState } from "@/lib/actions/auth";

const inputCls =
  "w-full rounded-[10px] border border-line bg-paper px-4 py-3 text-[14px] text-stone-800 placeholder:text-stone-300";

// 배포 직후 최초 1회 — 관리자 계정 생성 (계정이 하나도 없을 때만 표시됨)
export function SetupForm() {
  const [state, dispatch, pending] = useActionState<AuthFormState, FormData>(
    bootstrapAdminAction,
    {}
  );

  return (
    <form action={dispatch} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5 rounded-[10px] bg-accent-soft px-4 py-3">
        <span className="text-[13px] font-bold text-accent">처음 오셨네요! 관리자 계정 만들기</span>
        <span className="text-[12px] leading-relaxed text-stone-500">
          이 서비스의 첫 계정은 관리자로 생성됩니다. 학습자들은 만들어진 뒤 초대 코드
          <b className="font-semibold"> WELCOME</b>으로 가입할 수 있습니다(초대 코드는 계정
          관리에서 변경 가능).
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        <input name="name" placeholder="이름 (예: 홍길동)" className={inputCls} required />
        <input name="username" placeholder="아이디" className={inputCls} required />
        <input
          name="password"
          type="password"
          placeholder="비밀번호 (6자 이상)"
          className={inputCls}
          required
        />
      </div>
      {state.error && <p className="text-[12.5px] text-bad">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="font-display w-full cursor-pointer rounded-[10px] bg-[linear-gradient(135deg,#2a63b4,#003E81)] py-3.5 text-[14.5px] text-white hover:brightness-115 disabled:opacity-60"
      >
        {pending ? "잠시만요…" : "관리자 계정 만들고 시작하기"}
      </button>
    </form>
  );
}
