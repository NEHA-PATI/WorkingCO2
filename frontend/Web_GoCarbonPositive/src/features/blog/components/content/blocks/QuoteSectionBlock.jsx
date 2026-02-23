import React from "react";

export default function QuoteSectionBlock({ block }) {
  if (!block?.quote) return null;

  return (
    <section
      className="blog-quote-section"
      aria-label={block.sectionLabel || "Quote section"}
    >
      <blockquote className="blog-blockquote">{block.quote}</blockquote>
      <p className="blog-quote-author">
        {block.author}
        {block.role ? `, ${block.role}` : ""}
      </p>
    </section>
  );
}
