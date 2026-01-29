// GROQ Queries for Blog Service

// Base fields for post projection
const postFields = `
  _id,
  title,
  slug,
  excerpt,
  "content": content,
  "coverImage": coverImage.asset->url,
  "coverImageAlt": coverImage.alt,
  "author": author->{
    _id,
    name,
    slug,
    bio,
    "image": image.asset->url
  },
  "categories": categories[]->{
    _id,
    title,
    slug,
    description
  },
  "tags": tags[]->{
    _id,
    title,
    slug
  },
  seoTitle,
  seoDescription,
  status,
  publishedAt,
  _createdAt,
  _updatedAt
`;

// Get all published posts with pagination
export const getPublishedPostsQuery = (limit = 10, offset = 0) => `
  {
    "posts": *[_type == "post" && status == "published"] | order(publishedAt desc) [${offset}...${offset + limit}] {
      ${postFields}
    },
    "total": count(*[_type == "post" && status == "published"])
  }
`;

// Get single post by slug
export const getPostBySlugQuery = (slug) => `
  *[_type == "post" && slug.current == "${slug}" && status == "published"][0] {
    ${postFields}
  }
`;

// Get posts by category
export const getPostsByCategoryQuery = (categorySlug, limit = 10, offset = 0) => `
  {
    "posts": *[_type == "post" && status == "published" && references(*[_type == "category" && slug.current == "${categorySlug}"]._id)] | order(publishedAt desc) [${offset}...${offset + limit}] {
      ${postFields}
    },
    "total": count(*[_type == "post" && status == "published" && references(*[_type == "category" && slug.current == "${categorySlug}"]._id)]),
    "category": *[_type == "category" && slug.current == "${categorySlug}"][0] {
      _id,
      title,
      slug,
      description
    }
  }
`;

// Get posts by tag
export const getPostsByTagQuery = (tagSlug, limit = 10, offset = 0) => `
  {
    "posts": *[_type == "post" && status == "published" && references(*[_type == "tag" && slug.current == "${tagSlug}"]._id)] | order(publishedAt desc) [${offset}...${offset + limit}] {
      ${postFields}
    },
    "total": count(*[_type == "post" && status == "published" && references(*[_type == "tag" && slug.current == "${tagSlug}"]._id)]),
    "tag": *[_type == "tag" && slug.current == "${tagSlug}"][0] {
      _id,
      title,
      slug
    }
  }
`;

// Get all categories
export const getAllCategoriesQuery = () => `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "postCount": count(*[_type == "post" && status == "published" && references(^._id)])
  }
`;

// Get all tags
export const getAllTagsQuery = () => `
  *[_type == "tag"] | order(title asc) {
    _id,
    title,
    slug,
    "postCount": count(*[_type == "post" && status == "published" && references(^._id)])
  }
`;

// Get author with their posts
export const getAuthorBySlugQuery = (authorSlug, limit = 10, offset = 0) => `
  {
    "author": *[_type == "author" && slug.current == "${authorSlug}"][0] {
      _id,
      name,
      slug,
      bio,
      "image": image.asset->url,
      "socialLinks": socialLinks
    },
    "posts": *[_type == "post" && status == "published" && author->slug.current == "${authorSlug}"] | order(publishedAt desc) [${offset}...${offset + limit}] {
      ${postFields}
    },
    "total": count(*[_type == "post" && status == "published" && author->slug.current == "${authorSlug}"])
  }
`;

// Search posts
export const searchPostsQuery = (searchTerm, limit = 10, offset = 0) => `
  {
    "posts": *[_type == "post" && status == "published" && (
      title match "${searchTerm}*" ||
      excerpt match "${searchTerm}*" ||
      pt::text(content) match "${searchTerm}*"
    )] | order(publishedAt desc) [${offset}...${offset + limit}] {
      ${postFields}
    },
    "total": count(*[_type == "post" && status == "published" && (
      title match "${searchTerm}*" ||
      excerpt match "${searchTerm}*" ||
      pt::text(content) match "${searchTerm}*"
    )])
  }
`;

// Get related posts (by categories and tags)
export const getRelatedPostsQuery = (postId, limit = 3) => `
  *[_type == "post" && _id != "${postId}" && status == "published" && (
    count((categories[]._ref)[@ in *[_id == "${postId}"][0].categories[]._ref]) > 0 ||
    count((tags[]._ref)[@ in *[_id == "${postId}"][0].tags[]._ref]) > 0
  )] | order(publishedAt desc) [0...${limit}] {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coverImage.asset->url,
    publishedAt
  }
`;
