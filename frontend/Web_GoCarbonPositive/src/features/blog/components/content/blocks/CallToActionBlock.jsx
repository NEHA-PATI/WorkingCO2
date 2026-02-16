import React from "react";

export default function CallToActionBlock({ block }) {
  if (!block?.title || !block?.buttonText || !block?.buttonUrl) return null;

  return (
    <section
      className={`blog-cta blog-cta-${block.theme || "primary"}`}
      aria-label={block.sectionLabel || "Call to action"}
    >
      <h3>{block.title}</h3>
      {block.description && <p>{block.description}</p>}
      <a
        href={block.buttonUrl}
        target={block.openInNewTab ? "_blank" : "_self"}
        rel={block.openInNewTab ? "noopener noreferrer" : undefined}
        className="blog-cta-button"
      >
        {block.buttonText}
      </a>
    </section>
  );
}
