import React from "react";

const heightClassMap = {
  small: "blog-full-width-image-small",
  medium: "blog-full-width-image-medium",
  large: "blog-full-width-image-large",
};

export default function FullWidthImageBlock({ block }) {
  if (!block?.image?.url) return null;

  const heightClass = heightClassMap[block.height] || heightClassMap.medium;

  return (
    <figure className={`blog-full-width-image ${heightClass}`}>
      <img src={block.image.url} alt={block.image.alt || ""} loading="lazy" />
      {block.image.caption && <figcaption>{block.image.caption}</figcaption>}
    </figure>
  );
}
