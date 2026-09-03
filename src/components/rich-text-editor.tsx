"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown, type MarkdownStorage } from "tiptap-markdown";

// tiptap-markdown은 editor.storage.markdown 타입을 core의 Storage에 등록하지 않으므로 직접 캐스팅
function markdownOf(storage: unknown): string {
  return (storage as { markdown: MarkdownStorage }).markdown.getMarkdown().trim();
}

// 서식 버튼 — 굵게/기울임/목록만 지원 (연구 주제 설명에 필요한 최소 서식)
function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-7 w-7 flex-none cursor-pointer items-center justify-center rounded-[6px] text-[13px] ${
        active ? "bg-accent-soft font-bold text-accent" : "text-stone-400 hover:bg-line-soft hover:text-stone-600"
      }`}
    >
      {children}
    </button>
  );
}

// 본문 위지윅 편집기 — 내부적으로는 마크다운으로 저장/복원됨
export function RichTextEditor({
  content,
  onChange,
  placeholder,
}: {
  content: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Markdown.configure({ html: false }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] max-h-[420px] overflow-y-auto px-3.5 py-3 text-[13.5px] leading-[1.7] text-stone-800 outline-none [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(markdownOf(editor.storage));
    },
  });

  const isEmpty = editor?.isEmpty ?? true;

  return (
    <div className="flex flex-col overflow-hidden rounded-[10px] border-[1.5px] border-line bg-white focus-within:border-accent">
      <div className="flex items-center gap-0.5 border-b border-line-soft/70 px-2 py-1.5">
        <ToolbarButton
          label="굵게"
          active={!!editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          label="기울임"
          active={!!editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-line-soft" />
        <ToolbarButton
          label="글머리 기호 목록"
          active={!!editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <circle cx="4" cy="6" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="4" cy="18" r="1.2" fill="currentColor" stroke="none" />
            <line x1="9" y1="6" x2="20" y2="6" />
            <line x1="9" y1="12" x2="20" y2="12" />
            <line x1="9" y1="18" x2="20" y2="18" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          label="번호 매기기 목록"
          active={!!editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="9" y1="6" x2="20" y2="6" />
            <line x1="9" y1="12" x2="20" y2="12" />
            <line x1="9" y1="18" x2="20" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 17h2M4 20h2M4 17.5c0-.6.5-1 1-1s1 .4 1 1-2 1.5-2 2.5h2" />
          </svg>
        </ToolbarButton>
      </div>
      <div className="relative">
        {isEmpty && placeholder && (
          <span className="pointer-events-none absolute top-3 left-3.5 text-[13.5px] text-stone-300">
            {placeholder}
          </span>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
