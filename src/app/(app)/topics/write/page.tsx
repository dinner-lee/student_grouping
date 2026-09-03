import Link from "next/link";
import { TopicWriteView } from "./topic-write-view";

// 직접 URL 접근용 전체 페이지 — 앱 내 이동 시에는 @modal 인터셉트 라우트가 모달로 표시
export default function TopicWritePage() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/topics" className="text-xs text-stone-400 hover:text-stone-600">
        ← 주제 탐색으로
      </Link>
      <div className="max-w-xl rounded-[20px] bg-white p-6 shadow-[0_18px_44px_-26px_rgba(30,50,90,.32),0_1px_3px_rgba(30,50,90,.04)]">
        <TopicWriteView />
      </div>
    </div>
  );
}
