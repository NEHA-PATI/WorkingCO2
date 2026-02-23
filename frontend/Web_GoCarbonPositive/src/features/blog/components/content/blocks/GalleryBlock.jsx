import React from "react";

export default function GalleryBlock({ block }) {
  if (!block?.images?.length) return null;

  const columns = Math.min(Math.max(block.columns || 3, 2), 4);

  return (
    <section className="blog-gallery">
      {block.title && <h2 className="blog-h2">{block.title}</h2>}
      <div
        className={`blog-gallery-grid columns-${columns}`}
        role="list"
        aria-label={block.title || "Image gallery"}
      >
        {block.images.map((image) => (
          <figure key={image._key || image.url} role="listitem">
            <img src={image.url} alt={image.alt || ""} loading="lazy" />
            {image.caption && <figcaption>{image.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  );
}
