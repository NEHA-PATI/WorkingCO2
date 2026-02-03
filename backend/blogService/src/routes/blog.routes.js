import express from 'express';
import blogController from '../controllers/blog.controller.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/posts', blogController.getPosts);
router.get('/posts/:slug', blogController.getPostBySlug);
router.get('/posts/:id/related', blogController.getRelatedPosts);

router.get('/categories', blogController.getCategories);
router.get('/categories/:slug/posts', blogController.getPostsByCategory);

router.get('/tags', blogController.getTags);
router.get('/tags/:slug/posts', blogController.getPostsByTag);

router.get('/authors/:slug', blogController.getAuthorBySlug);

router.get('/search', blogController.searchPosts);

export default router;
