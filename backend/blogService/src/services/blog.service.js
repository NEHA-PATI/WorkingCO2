import { sanityClient } from '../config/sanity.config.js';
import { cacheGet, cacheSet } from '../config/redis.config.js';
import * as queries from '../utils/groq-queries.js';

class BlogService {
  // Get all published posts with pagination
  async getPosts(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const cacheKey = `posts:page:${page}:limit:${limit}`;

    // Try cache first
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const query = queries.getPublishedPostsQuery(limit, offset);
    const result = await sanityClient.fetch(query);

    // Cache for 5 minutes
    await cacheSet(cacheKey, result, 300);

    return result;
  }

  // Get single post by slug
  async getPostBySlug(slug) {
    const cacheKey = `post:slug:${slug}`;

    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const query = queries.getPostBySlugQuery(slug);
    const post = await sanityClient.fetch(query);

    if (!post) {
      throw { statusCode: 404, message: 'Post not found' };
    }

    await cacheSet(cacheKey, post, 600);

    return post;
  }

  // Get posts by category
  async getPostsByCategory(categorySlug, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const cacheKey = `category:${categorySlug}:page:${page}:limit:${limit}`;

    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const query = queries.getPostsByCategoryQuery(categorySlug, limit, offset);
    const result = await sanityClient.fetch(query);

    if (!result.category) {
      throw { statusCode: 404, message: 'Category not found' };
    }

    await cacheSet(cacheKey, result, 300);

    return result;
  }

  // Get posts by tag
  async getPostsByTag(tagSlug, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const cacheKey = `tag:${tagSlug}:page:${page}:limit:${limit}`;

    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const query = queries.getPostsByTagQuery(tagSlug, limit, offset);
    const result = await sanityClient.fetch(query);

    if (!result.tag) {
      throw { statusCode: 404, message: 'Tag not found' };
    }

    await cacheSet(cacheKey, result, 300);

    return result;
  }

  // Get all categories
  async getCategories() {
    const cacheKey = 'categories:all';

    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const query = queries.getAllCategoriesQuery();
    const categories = await sanityClient.fetch(query);

    await cacheSet(cacheKey, categories, 600);

    return categories;
  }

  // Get all tags
  async getTags() {
    const cacheKey = 'tags:all';

    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const query = queries.getAllTagsQuery();
    const tags = await sanityClient.fetch(query);

    await cacheSet(cacheKey, tags, 600);

    return tags;
  }

  // Get author with posts
  async getAuthorBySlug(authorSlug, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const cacheKey = `author:${authorSlug}:page:${page}:limit:${limit}`;

    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const query = queries.getAuthorBySlugQuery(authorSlug, limit, offset);
    const result = await sanityClient.fetch(query);

    if (!result.author) {
      throw { statusCode: 404, message: 'Author not found' };
    }

    await cacheSet(cacheKey, result, 600);

    return result;
  }

  // Search posts
  async searchPosts(searchTerm, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const cacheKey = `search:${searchTerm}:page:${page}:limit:${limit}`;

    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const query = queries.searchPostsQuery(searchTerm, limit, offset);
    const result = await sanityClient.fetch(query);

    await cacheSet(cacheKey, result, 180); // Cache for 3 minutes

    return result;
  }

  // Get related posts
  async getRelatedPosts(postId, limit = 3) {
    const cacheKey = `related:${postId}:limit:${limit}`;

    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const query = queries.getRelatedPostsQuery(postId, limit);
    const posts = await sanityClient.fetch(query);

    await cacheSet(cacheKey, posts, 600);

    return posts;
  }
}

export default new BlogService();
