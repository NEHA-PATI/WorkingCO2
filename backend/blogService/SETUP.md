# BlogService Setup Guide

## Step 1: Install Dependencies

```bash
cd backend/blogService
npm install
```

## Step 2: Setup Sanity Project

### Option A: Create New Sanity Project

```bash
cd sanity
npm install
npx sanity login
npx sanity init
```

Follow the prompts:
- Create new project or use existing
- Choose dataset name (production recommended)
- Select project template: Clean project

### Option B: Use Existing Sanity Project

1. Get your Sanity project ID from https://sanity.io/manage
2. Update `sanity/sanity.cli.js` and `sanity/sanity.config.js` with your project ID
3. Install dependencies:

```bash
cd sanity
npm install
```

## Step 3: Create Sanity API Token

1. Go to https://sanity.io/manage
2. Select your project
3. Go to API → Tokens
4. Create new token with "Editor" permissions
5. Copy the token

## Step 4: Configure Environment

```bash
# In backend/blogService directory
cp .env.example .env
```

Edit `.env`:
```env
PORT=4000
NODE_ENV=development

SANITY_PROJECT_ID=your_project_id_here
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
SANITY_TOKEN=your_token_here

JWT_SECRET=your_random_secret_here

REDIS_ENABLED=false
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Step 5: Start Services

### Terminal 1: Start Sanity Studio
```bash
cd backend/blogService/sanity
npm run dev
```

Sanity Studio will be available at: http://localhost:3333

### Terminal 2: Start BlogService Backend
```bash
cd backend/blogService
npm run dev
```

API will be available at: http://localhost:4000

## Step 6: Create Sample Content

1. Open Sanity Studio: http://localhost:3333
2. Create an Author first
3. Create a Category
4. Create a Tag (optional)
5. Create a Blog Post:
   - Fill in all required fields
   - Set status to "Published"
   - Set published date
   - Add cover image
   - Write content

## Step 7: Test API

```bash
# Get all posts
curl http://localhost:4000/api/blog/posts

# Get single post
curl http://localhost:4000/api/blog/posts/your-post-slug

# Get categories
curl http://localhost:4000/api/blog/categories
```

## Troubleshooting

### Sanity Connection Failed
- Verify SANITY_PROJECT_ID is correct
- Check SANITY_TOKEN has proper permissions
- Ensure dataset name matches

### No Posts Returned
- Check post status is "published"
- Verify publishedAt date is set
- Check Sanity Studio for content

### CORS Errors
- Add your frontend URL to ALLOWED_ORIGINS in .env
- Restart the server after changing .env

## Next Steps

1. **Deploy Sanity Studio**: `cd sanity && npm run deploy`
2. **Deploy Backend**: Use Vercel, Railway, or AWS
3. **Setup Redis**: For production caching
4. **Configure CDN**: For image optimization
5. **Add Monitoring**: Error tracking and analytics
