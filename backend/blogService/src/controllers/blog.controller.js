import blogService from '../services/blog.service.js';
import { successResponse, paginationMeta } from '../utils/response.helper.js';

class BlogController {
  // GET /api/blog/posts
  async getPosts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await blogService.getPosts(page, limit);

      res.json(
        successResponse(
          result.posts,
          'Posts fetched successfully',
          paginationMeta(result.total, page, limit)
        )
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/blog/posts/:slug
  async getPostBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const post = await blogService.getPostBySlug(slug);

      res.json(successResponse(post, 'Post fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/blog/categories/:slug/posts
  async getPostsByCategory(req, res, next) {
    try {
      const { slug } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await blogService.getPostsByCategory(slug, page, limit);

      res.json(
        successResponse(
          {
            category: result.category,
            posts: result.posts,
          },
          'Category posts fetched successfully',
          paginationMeta(result.total, page, limit)
        )
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/blog/tags/:slug/posts
  async getPostsByTag(req, res, next) {
    try {
      const { slug } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await blogService.getPostsByTag(slug, page, limit);

      res.json(
        successResponse(
          {
            tag: result.tag,
            posts: result.posts,
          },
          'Tag posts fetched successfully',
          paginationMeta(result.total, page, limit)
        )
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/blog/categories
  async getCategories(req, res, next) {
    try {
      const categories = await blogService.getCategories();

      res.json(successResponse(categories, 'Categories fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/blog/tags
  async getTags(req, res, next) {
    try {
      const tags = await blogService.getTags();

      res.json(successResponse(tags, 'Tags fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  // GET /api/blog/authors/:slug
  async getAuthorBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await blogService.getAuthorBySlug(slug, page, limit);

      res.json(
        successResponse(
          {
            author: result.author,
            posts: result.posts,
          },
          'Author fetched successfully',
          paginationMeta(result.total, page, limit)
        )
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/blog/search
  async searchPosts(req, res, next) {
    try {
      const { q } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
      }

      const result = await blogService.searchPosts(q, page, limit);

      res.json(
        successResponse(
          result.posts,
          'Search results fetched successfully',
          paginationMeta(result.total, page, limit)
        )
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/blog/posts/:id/related
  async getRelatedPosts(req, res, next) {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit) || 3;

      const posts = await blogService.getRelatedPosts(id, limit);

      res.json(successResponse(posts, 'Related posts fetched successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new BlogController();
