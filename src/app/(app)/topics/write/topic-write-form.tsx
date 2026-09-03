"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveTopicAction } from "@/lib/actions/topics";
import { composeTopicMarkdown } from "@/lib/utils";

// 연구 주제 작성 폼 — 제목/내용/키워드를 분리한 일반 텍스트 편집기 (전체 페이지·모달 공용)
export function TopicWriteForm({
  initialTitle,
  initialContent,
  initialKeywords,
  inModal = false,
}: {
  initialTitle: string;
  initialContent: string;
  initialKeywords: string[];
  inModal?: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [keywords, setKeywords] = useState(initialKeywords);
  const [newKeyword, setNewKeyword] = useState("");
  const [pending, startTransition] = useTransition();

  const close = () => (inModal ? router.back() : router.push("/topics"));

  const addKeyword = () => {
    const k = newKeyword.trim();
    if (k && !keywords.includes(k)) setKeywords([...keywords, k]);
    setNewKeyword("");
  };

  const save = () => {
    if (!title.trim()) return;
    startTransition(async () => {
      await saveTopicAction(composeTopicMarkdown(title, content), keywords);
      close();
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-stone-500">제목</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 청소년의 SNS 사용과 또래관계"
          autoFocus
          className="h-11 rounded-[10px] border-[1.5px] border-transparent bg-paper px-3.5 text-[14px] font-medium text-stone-800 outline-none focus:border-accent focus:bg-white"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-stone-500">내용</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={"어떤 현상이 궁금한지, 어떻게 알아보고 싶은지 자유롭게 적어보세요."}
          rows={8}
          className="min-h-[180px] resize-y rounded-[10px] border-[1.5px] border-transparent bg-paper p-3.5 text-[13.5px] leading-[1.7] text-stone-800 outline-none focus:border-accent focus:bg-white"
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-stone-500">키워드</span>
        <div className="flex flex-col gap-2 rounded-[10px] bg-paper p-3.5">
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((k) => (
                <span
                  key={k}
                  className="flex items-center gap-1.5 rounded-full bg-accent-soft py-[5px] pr-2 pl-3 text-xs font-medium text-accent"
                >
                  {k}
                  <button
                    onClick={() => setKeywords(keywords.filter((x) => x !== k))}
                    className="cursor-pointer text-[13px] leading-none text-accent/60 hover:text-accent"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                addKeyword();
              }
            }}
            placeholder="키워드 입력 후 Enter"
            className="h-9 rounded-[8px] border border-line bg-white px-3 text-[12.5px] text-stone-800 outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={close}
          className="font-display cursor-pointer rounded-[9px] px-4 py-2.5 text-[13px] font-semibold text-stone-500 hover:bg-line-soft"
        >
          취소
        </button>
        <button
          onClick={save}
          disabled={pending || !title.trim()}
          className="font-display cursor-pointer rounded-[9px] bg-[linear-gradient(135deg,#2a63b4,#003E81)] px-5 py-2.5 text-[13px] text-white hover:brightness-115 disabled:cursor-default disabled:bg-line disabled:opacity-60"
        >
          {pending ? "저장 중…" : "저장"}
        </button>
      </div>
    </div>
  );
}
