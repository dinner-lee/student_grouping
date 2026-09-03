// 키워드 동일성 비교용 정규화 — 공백·대소문자가 달라도 같은 키워드로 취급
export function normKeyword(k: string) {
  return k.replace(/\s+/g, "").toLowerCase();
}

// 연구 주제 마크다운의 첫 헤딩을 제목으로
export function topicTitleOf(markdown: string) {
  return (
    markdown
      .split("\n")
      .find((l) => l.trim().startsWith("#"))
      ?.replace(/^#+\s*/, "") ?? "(제목 없음)"
  );
}

export function initialOf(name: string) {
  return name.length > 1 ? name[1] : (name[0] ?? "?");
}

// 주제 카드 저장 형식(마크다운)과 일반 텍스트 편집기(제목/내용) 간 변환
// 편집기는 줄바꿈을 그대로 유지하기 위해 각 줄을 별도 문단으로 취급한다
export function parseTopic(markdown: string): { title: string; content: string } {
  const lines = markdown.split("\n");
  const titleIdx = lines.findIndex((l) => l.trim().startsWith("#"));
  const title = titleIdx >= 0 ? lines[titleIdx].replace(/^#+\s*/, "").trim() : "";
  const rest = lines.slice(titleIdx + 1).join("\n");
  const content = rest.replace(/\n{2,}/g, "\n").trim();
  return { title, content };
}

export function composeTopicMarkdown(title: string, content: string) {
  const body = content.trim().split("\n").join("\n\n");
  return `# ${title.trim()}\n\n${body}`.trim();
}

export function dDayLabel(dueAt: Date | null) {
  if (!dueAt) return null;
  const days = Math.ceil((dueAt.getTime() - Date.now()) / 86400000);
  if (days < 0) return "마감됨";
  if (days === 0) return "오늘 마감";
  return `마감 D-${days}`;
}

export function formatDateTime(d: Date) {
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}
