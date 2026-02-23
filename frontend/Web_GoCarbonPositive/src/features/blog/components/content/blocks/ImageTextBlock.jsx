import React from "react";
import { PortableText } from "@portabletext/react";

const bodyComponents = {
  block: {
    normal: ({ children }) => <p className="blog-paragraph">{children}</p>,
    h2: ({ children }) => <h2 className="blog-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="blog-h3">{children}</h3>,
  },
};

export default function ImageTextBlock({ block }) {
  const isImageRight = block?.imagePosition === "right";

  if (!block?.image?.url || !block?.body) return null;

  return (
    <section className={`blog-image-text ${isImageRight ? "right" : "left"}`}>
      <div className="blog-image-text-media">
        <img src={block.image.url} alt={block.image.alt || ""} loading="lazy" />
        {block.image.caption && (
          <p className="blog-image-caption">{block.image.caption}</p>
        )}
      </div>

      <div className="blog-image-text-body">
        {block.heading && <h2 className="blog-h2">{block.heading}</h2>}
        <PortableText value={block.body} components={bodyComponents} />
      </div>
    </section>
  );
}
