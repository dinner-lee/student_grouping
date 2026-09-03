"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveTopicAction } from "@/lib/actions/topics";
import { composeTopicMarkdown } from "@/lib/utils";
import { RichTextEditor } from "@/components/rich-text-editor";

// 주제 작성 폼 — 제목/본문(위지윅)/키워드로 분리된 편집기 (전체 페이지·모달 공용)
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
    <div className="flex flex-col gap-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        autoFocus
        className="h-12 rounded-[10px] border-[1.5px] border-line bg-white px-4 font-display text-[16px] font-semibold tracking-tight text-stone-800 outline-none focus:border-accent"
      />

      <RichTextEditor content={content} onChange={setContent} />

      <div className="flex flex-col gap-2 rounded-[10px] border-[1.5px] border-line bg-white p-3">
        <div className="flex flex-wrap items-center gap-1.5">
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
          <input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                addKeyword();
              }
            }}
            placeholder="키워드"
            className="h-7 min-w-[100px] flex-1 rounded-full border-none bg-transparent px-2 text-[12.5px] text-stone-800 outline-none placeholder:text-stone-300"
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
