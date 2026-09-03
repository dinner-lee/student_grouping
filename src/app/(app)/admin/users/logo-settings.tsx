import { updateLogoUrlAction } from "@/lib/actions/users";

// 헤더·로그인 화면에 표시할 로고 이미지 설정 (관리자 전용) — 이미지 URL을 입력해 적용
export function LogoSettings({ logoUrl }: { logoUrl: string | null }) {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-white p-6 shadow-[0_18px_44px_-26px_rgba(30,50,90,.32),0_1px_3px_rgba(30,50,90,.04)]">
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-[13.5px] font-semibold text-stone-700">로고 이미지 설정</span>
        <span className="text-[12px] text-stone-400">
          공개적으로 접근 가능한 이미지 주소(URL)를 입력하면 상단바와 로그인 화면에 표시됩니다.
          비워두면 로고 없이 텍스트만 표시됩니다.
        </span>
      </div>

      {logoUrl && (
        <div className="flex items-center gap-3 rounded-[10px] bg-paper px-4 py-3">
          <span className="text-[11px] font-semibold text-stone-400">현재 로고</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="현재 로고" className="h-7 w-auto max-w-[160px] object-contain" />
        </div>
      )}

      <form action={updateLogoUrlAction} className="flex flex-wrap items-center gap-2">
        <input
          name="logoUrl"
          defaultValue={logoUrl ?? ""}
          placeholder="https://example.com/logo.png"
          className="h-9 min-w-0 flex-1 rounded-[9px] border-[1.5px] border-transparent bg-[#f4f6f9] px-3.5 text-[12.5px] text-[#12233c] outline-none focus:border-[#003E81] focus:bg-white"
        />
        <button
          type="submit"
          className="h-9 flex-none rounded-[9px] bg-[linear-gradient(135deg,#2a63b4,#003E81)] px-4 text-[12.5px] font-bold text-white hover:brightness-115"
        >
          저장
        </button>
      </form>
    </div>
  );
}
