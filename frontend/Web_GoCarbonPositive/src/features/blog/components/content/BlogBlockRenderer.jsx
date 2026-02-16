import React from "react";
import { PortableText } from "@portabletext/react";
import ImageTextBlock from "./blocks/ImageTextBlock";
import GalleryBlock from "./blocks/GalleryBlock";
import QuoteSectionBlock from "./blocks/QuoteSectionBlock";
import CallToActionBlock from "./blocks/CallToActionBlock";
import FullWidthImageBlock from "./blocks/FullWidthImageBlock";

const portableTextComponents = {
  block: {
    h1: ({ children }) => <h2 className="blog-h2">{children}</h2>,
    h2: ({ children }) => <h2 className="blog-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="blog-h3">{children}</h3>,
    normal: ({ children }) => <p className="blog-paragraph">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="blog-blockquote">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="blog-list-bullet">{children}</ul>,
    number: ({ children }) => <ol className="blog-list-number">{children}</ol>,
  },
};

function BasicImageBlock({ block }) {
  if (!block?.url) return null;

  return (
    <figure className="blog-inline-image">
      <img src={block.url} alt={block.alt || ""} loading="lazy" />
      {block.caption && <figcaption>{block.caption}</figcaption>}
    </figure>
  );
}

const blockComponents = {
  block: ({ block }) => (
    <PortableText value={[block]} components={portableTextComponents} />
  ),
  image: BasicImageBlock,
  imageText: ImageTextBlock,
  gallery: GalleryBlock,
  quoteSection: QuoteSectionBlock,
  callToAction: CallToActionBlock,
  fullWidthImage: FullWidthImageBlock,
};

function renderBlock(block) {
  const BlockComponent = blockComponents[block?._type];

  if (!BlockComponent) return null;

  return <BlockComponent block={block} />;
}

export default function BlogBlockRenderer({ content }) {
  if (!Array.isArray(content) || content.length === 0) return null;

  return (
    <>
      {content.map((block, index) => (
        <React.Fragment key={block._key || `${block._type}-${index}`}>
          {renderBlock(block)}
        </React.Fragment>
      ))}
    </>
  );
}
