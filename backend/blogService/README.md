# Blog CMS Service

Production-grade Blog CMS using Sanity headless CMS with admin-only content management and public read-only APIs.

## 🏗️ Architecture

```
Admin → Sanity Studio → Sanity Cloud
                         ↓
                   BlogService (Node.js)
                         ↓
                 Public Website/App
```

## 📁 Project Structure

```
blogService/
├── sanity/                    # Sanity Studio & Schemas
│   ├── schemas/
│   │   ├── post.js           # Blog post schema
│   │   ├── author.js         # Author schema
│   │   ├── category.js       # Category schema
│   │   ├── tag.js            # Tag schema
│   │   └── index.js
│   ├── sanity.config.js      # Studio configuration
│   ├── sanity.cli.js
│   └── package.json
│
├── src/
│   ├── config/
│   │   ├── env.config.js     # Environment configuration
│   │   ├── sanity.config.js  # Sanity client setup
│   │   └── redis.config.js   # Redis cache setup
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── errorHandler.js
│   ├── services/
│   │   └── blog.service.js   # Business logic
│   ├── controllers/
│   │   └── blog.controller.js
│   ├── routes/
│   │   └── blog.routes.js
│   ├── utils/
│   │   ├── groq-queries.js   # GROQ queries
│   │   └── response.helper.js
│   └── server.js             # Express server
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install Sanity Studio dependencies
cd sanity && npm install
```

### 2. Setup Sanity

```bash
# Login to Sanity
cd sanity
npx sanity login

# Initialize project (if new)
npx sanity init

# Or use existing project
# Update sanity.cli.js and sanity.config.js with your project ID
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
```

Required environment variables:
```env
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
SANITY_TOKEN=your_token
JWT_SECRET=your_secret
```

### 4. Start Services

```bash
# Terminal 1: Start BlogService backend
npm run dev

# Terminal 2: Start Sanity Studio
npm run sanity
```

## 📡 API Endpoints

All endpoints are **read-only** and return **published posts only**.

### Posts

- `GET /api/blog/posts` - List all published posts
  - Query params: `page`, `limit`
  
- `GET /api/blog/posts/:slug` - Get single post by slug

- `GET /api/blog/posts/:id/related` - Get related posts
  - Query params: `limit`

### Categories

- `GET /api/blog/categories` - List all categories

- `GET /api/blog/categories/:slug/posts` - Get posts by category
  - Query params: `page`, `limit`

### Tags

- `GET /api/blog/tags` - List all tags

- `GET /api/blog/tags/:slug/posts` - Get posts by tag
  - Query params: `page`, `limit`

### Authors

- `GET /api/blog/authors/:slug` - Get author with their posts
  - Query params: `page`, `limit`

### Search

- `GET /api/blog/search?q=searchterm` - Search posts
  - Query params: `q`, `page`, `limit`

## 📝 Content Workflow

```
DRAFT → REVIEW → PUBLISHED → ARCHIVED
```

- **DRAFT**: Initial creation, visible only to admins
- **REVIEW**: Ready for review, visible to editors
- **PUBLISHED**: Live and accessible via public API
- **ARCHIVED**: Hidden from public API

## 🔒 Security

- **Admin Access**: Protected by JWT authentication
- **Public APIs**: Read-only, no authentication required
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable allowed origins

## 💾 Caching

Redis caching is optional but recommended for production:

- Posts list: 5 minutes
- Single post: 10 minutes
- Categories/Tags: 10 minutes
- Search results: 3 minutes

## 🎨 Sanity Studio

Access Sanity Studio at: `http://localhost:3333`

### Content Types

1. **Blog Post**
   - Title, slug, excerpt, rich content
   - Cover image with alt text
   - Author, categories, tags
   - SEO fields
   - Workflow status
   - Publish date

2. **Author**
   - Name, slug, bio, image
   - Social links

3. **Category**
   - Title, slug, description

4. **Tag**
   - Title, slug

## 🌐 Deployment

### Deploy Sanity Studio

```bash
cd sanity
npm run build
npm run deploy
```

### Deploy Backend

Recommended platforms:
- **Vercel**: Zero-config deployment
- **Railway**: Easy PostgreSQL + Redis
- **AWS**: Full control

Environment variables must be set in your deployment platform.

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 404,
  "errors": null
}
```

## 🔧 Development

```bash
# Run backend in development mode
npm run dev

# Run Sanity Studio
npm run sanity
```

## 📦 Production Build

```bash
# Build Sanity Studio
cd sanity && npm run build

# Start backend in production
NODE_ENV=production npm start
```

## 🎯 Features

✅ Headless CMS with Sanity  
✅ Admin-only content management  
✅ Public read-only APIs  
✅ Workflow system (Draft → Review → Published → Archived)  
✅ Rich text editor with image support  
✅ SEO optimization  
✅ Category & tag taxonomy  
✅ Author profiles  
✅ Search functionality  
✅ Pagination  
✅ Redis caching  
✅ Rate limiting  
✅ CORS protection  
✅ Error handling  
✅ Production-ready  

## 📚 Tech Stack

- **CMS**: Sanity v3
- **Backend**: Node.js + Express
- **Cache**: Redis (optional)
- **Auth**: JWT
- **Query Language**: GROQ

## 🤝 Contributing

This is a production-grade service. Follow these guidelines:

1. Never expose write APIs publicly
2. Always validate admin access
3. Keep GROQ queries optimized
4. Maintain cache invalidation strategy
5. Document all API changes

## 📄 License

ISC

---

**Built with ❤️ for production use**
