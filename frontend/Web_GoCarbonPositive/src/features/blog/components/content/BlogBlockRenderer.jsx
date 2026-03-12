import React from "react";
import { PortableText } from "@portabletext/react";
import ImageTextBlock from "./blocks/ImageTextBlock";
import GalleryBlock from "./blocks/GalleryBlock";
import QuoteSectionBlock from "./blocks/QuoteSectionBlock";
import CallToActionBlock from "./blocks/CallToActionBlock";
import FullWidthImageBlock from "./blocks/FullWidthImageBlock";

function BasicImageBlock({ value }) {
  if (!value?.url) return null;

  return (
    <figure className="blog-inline-image">
      <img src={value.url} alt={value.alt || ""} loading="lazy" />
      {value.caption && <figcaption>{value.caption}</figcaption>}
    </figure>
  );
}

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
  types: {
    image: BasicImageBlock,
    imageText: ({ value }) => <ImageTextBlock block={value} />,
    gallery: ({ value }) => <GalleryBlock block={value} />,
    quoteSection: ({ value }) => <QuoteSectionBlock block={value} />,
    callToAction: ({ value }) => <CallToActionBlock block={value} />,
    fullWidthImage: ({ value }) => <FullWidthImageBlock block={value} />,
  },
};

export default function BlogBlockRenderer({ content }) {
  if (!Array.isArray(content) || content.length === 0) return null;

  return <PortableText value={content} components={portableTextComponents} />;
}
