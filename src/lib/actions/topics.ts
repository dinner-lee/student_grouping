"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { normKeyword } from "@/lib/utils";

export async function saveTopicAction(markdown: string, keywords: string[]) {
  const user = await requireUser();
  const cleanKeywords = [...new Set(keywords.map((k) => k.trim()).filter(Boolean))].slice(0, 20);
  await prisma.topic.upsert({
    where: { userId: user.id },
    create: { userId: user.id, markdown, keywords: cleanKeywords },
    update: { markdown, keywords: cleanKeywords },
  });
  revalidatePath("/topics");
}

// 내 관심 주제 삭제 — 이미 모둠 구성(시안·확정 모두)의 앵커로 쓰이고 있으면 막는다
// (삭제 시 해당 모둠·멤버 배정까지 함께 사라지는 것을 방지)
export async function deleteTopicAction(): Promise<{ error?: string }> {
  const user = await requireUser();
  const topic = await prisma.topic.findUnique({
    where: { userId: user.id },
    include: { _count: { select: { researchGroups: true } } },
  });
  if (!topic) return {};
  if (topic._count.researchGroups > 0) {
    return {
      error:
        "이미 모둠 구성에 쓰이고 있는 주제라 삭제할 수 없습니다. 관리자에게 모둠에서 제외해 달라고 요청해주세요.",
    };
  }
  await prisma.topic.delete({ where: { id: topic.id } });
  revalidatePath("/topics");
  return {};
}

export async function toggleTopicLikeAction(topicId: string) {
  const user = await requireUser();
  const existing = await prisma.topicLike.findUnique({
    where: { topicId_userId: { topicId, userId: user.id } },
  });
  if (existing) {
    await prisma.topicLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.topicLike.create({ data: { topicId, userId: user.id } });
  }
  revalidatePath(`/topics/${topicId}`);
  revalidatePath("/topics");
}

export async function toggleKeywordLikeAction(keyword: string) {
  const user = await requireUser();
  // 표기가 달라도(공백·대소문자) 같은 키워드의 하트로 취급
  const norm = normKeyword(keyword);
  const mine = await prisma.keywordLike.findMany({ where: { userId: user.id } });
  const existing = mine.filter((kl) => normKeyword(kl.keyword) === norm);
  if (existing.length > 0) {
    await prisma.keywordLike.deleteMany({ where: { id: { in: existing.map((e) => e.id) } } });
  } else {
    await prisma.keywordLike.create({ data: { keyword, userId: user.id } });
  }
  revalidatePath("/topics");
}

export async function addCommentAction(topicId: string, text: string) {
  const user = await requireUser();
  const trimmed = text.trim();
  if (!trimmed) return;
  await prisma.comment.create({
    data: { topicId, userId: user.id, text: trimmed.slice(0, 1000) },
  });
  revalidatePath(`/topics/${topicId}`);
  revalidatePath("/topics");
}
