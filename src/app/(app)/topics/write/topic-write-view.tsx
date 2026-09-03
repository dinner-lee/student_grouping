import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { parseTopic } from "@/lib/utils";
import { PencilIcon } from "@/components/icons";
import { TopicWriteForm } from "./topic-write-form";

// 연구 주제 작성 (전체 페이지·모달 공용)
export async function TopicWriteView({ inModal = false }: { inModal?: boolean }) {
  const user = await requireUser();
  const topic = await prisma.topic.findUnique({ where: { userId: user.id } });
  const { title, content } = parseTopic(topic?.markdown ?? "");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 font-display text-[16px] font-bold tracking-tight">
        <span className="text-accent">
          <PencilIcon size={16} />
        </span>
        연구 주제 작성
      </div>
      <TopicWriteForm
        initialTitle={title}
        initialContent={content}
        initialKeywords={topic?.keywords ?? []}
        inModal={inModal}
      />
    </div>
  );
}
