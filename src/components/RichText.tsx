import type { ReactNode } from "react";

/**
 * Renders the simple text format used in the CMS (no HTML, so nothing to sanitise):
 *   "## Heading" / "### Sub-heading", "- bullet", "1. numbered", blank line = new paragraph.
 */
export function RichText({ text, className = "" }: { text: string | null | undefined; className?: string }) {
  if (!text) return null;
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) blocks.push(<p key={blocks.length}>{para.join(" ")}</p>);
    para = [];
  };
  const flushList = () => {
    if (!list) return;
    const items = list.items.map((it, i) => <li key={i}>{it}</li>);
    blocks.push(list.ordered ? <ol key={blocks.length}>{items}</ol> : <ul key={blocks.length}>{items}</ul>);
    list = null;
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)/);
    const numbered = line.match(/^\d+[.)]\s+(.*)/);
    if (!line) {
      flushPara();
      flushList();
    } else if (line.startsWith("### ")) {
      flushPara();
      flushList();
      blocks.push(<h3 key={blocks.length}>{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      flushPara();
      flushList();
      blocks.push(<h2 key={blocks.length}>{line.slice(3)}</h2>);
    } else if (bullet || numbered) {
      flushPara();
      const ordered = Boolean(numbered);
      if (list && list.ordered !== ordered) flushList();
      list ??= { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return <div className={`rich-text ${className}`}>{blocks}</div>;
}
