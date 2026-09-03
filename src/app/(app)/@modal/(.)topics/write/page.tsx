import { ModalShell } from "@/components/modal-shell";
import { TopicWriteView } from "@/app/(app)/topics/write/topic-write-view";

// 앱 내 이동 시 주제 작성을 모달로 표시 (직접 URL 접근은 전체 페이지)
export default function TopicWriteModal() {
  return (
    <ModalShell>
      <TopicWriteView inModal />
    </ModalShell>
  );
}
