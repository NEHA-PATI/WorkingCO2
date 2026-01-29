import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, User, TrendingUp, Loader2 } from "lucide-react";
import { PortableText } from "@portabletext/react";
import "../styles/user/blog-detail.css";
// import blogService from "../services/api/blog.service.js";

const CATEGORY_COLORS = {
  INSIGHTS: "#9b59b6",
  TUTORIAL: "#3498db",
  "CASE STUDY": "#e74c3c",
  GUIDE: "#f39c12",
  RESEARCH: "#1abc9c",
};

const getCategoryColor = (categoryName) => {
  return CATEGORY_COLORS[categoryName?.toUpperCase()] || "#2ecc71";
};

const portableTextComponents = {
  block: {
    h1: ({ children }) => <h2 className="blog-h2">{children}</h2>,
    h2: ({ children }) => <h2 className="blog-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="blog-h3">{children}</h3>,
    normal: ({ children }) => <p className="blog-paragraph">{children}</p>,
    blockquote: ({ children }) => <blockquote className="blog-blockquote">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="blog-list-bullet">{children}</ul>,
    number: ({ children }) => <ol className="blog-list-number">{children}</ol>,
  },
};

export default function BlogDetailPage() {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const fetchBlogData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await blogService.getPostBySlug(slug);
      setBlog(response.data);
      
      if (response.data?._id) {
        const relatedRes = await blogService.getRelatedPosts(response.data._id);
        setRelatedPosts(relatedRes.data || []);
      }
    } catch (err) {
      console.error("Error fetching blog detail:", err);
      setError("Failed to load blog post. It might have been moved or deleted.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlogData();
    window.scrollTo(0, 0);
  }, [fetchBlogData]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = blog?.title || "";
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } else {
      window.open(shareUrls[platform], "_blank");
    }
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="blog-detail-container loading-state">
        <div className="loader-wrapper">
          <Loader2 className="animate-spin" size={48} color="#2ecc71" />
          <p>Loading inspiration...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-container">
        <div className="blog-detail-main" style={{ textAlign: "center", paddingTop: "100px" }}>
          <h1 className="blog-detail-title">{error || "Blog not found"}</h1>
          <button onClick={() => navigate("/blog")} className="back-button" style={{ margin: "20px auto" }}>
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const primaryCategory = blog.categories?.[0]?.title || "Article";
  const categoryColor = getCategoryColor(primaryCategory);

  return (
    <div className="blog-detail-container">
      {/* Reading Progress Bar */}
      <div className="reading-progress-bar" style={{ width: `${readingProgress}%`, backgroundColor: categoryColor }} />

      {/* Navigation */}
      <div className="blog-detail-nav">
        <div className="blog-detail-nav-content">
          <button onClick={() => navigate("/blog")} className="back-button">
            <ArrowLeft className="back-icon" />
            Back to Blog
          </button>

          <div className="share-container">
            <button className="share-button" onClick={() => setShowShareMenu(!showShareMenu)}>
              <Share2 size={18} />
              Share
            </button>
            {showShareMenu && (
              <div className="share-menu">
                <button onClick={() => handleShare("twitter")}>
                  <Twitter size={16} /> Twitter
                </button>
                <button onClick={() => handleShare("linkedin")}>
                  <Linkedin size={16} /> LinkedIn
                </button>
                <button onClick={() => handleShare("facebook")}>
                  <Facebook size={16} /> Facebook
                </button>
                <button onClick={() => handleShare("copy")}>
                  <LinkIcon size={16} /> Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero with Overlay */}
      <div className="blog-detail-hero-wrapper">
        <div
          className="blog-detail-hero-image-bg"
          style={{
            backgroundImage: blog.coverImage ? `url(${blog.coverImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: `${categoryColor}40`
          }}
        />
        <div className="blog-detail-hero-overlay">
          <div className="blog-detail-hero-content-wrapper">
            <div className="blog-categories-detail">
              {blog.categories?.map(cat => (
                <span key={cat._id} className="blog-category-tag" style={{ color: getCategoryColor(cat.title) }}>
                  {cat.title}
                </span>
              ))}
            </div>
            <h1 className="blog-detail-hero-title">{blog.title}</h1>
            <div className="blog-detail-hero-meta">
              <div className="author-info">
                <div className="author-avatar-large">
                  {blog.author?.image ? (
                    <img src={blog.author.image} alt={blog.author.name} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <div className="author-name">{blog.author?.name || "Anonymous"}</div>
                  <div className="blog-date-time">
                    {new Date(blog.publishedAt || blog._createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} · <Clock size={12} /> {blog.readTime || "5 min read"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="blog-detail-main">
        <article className="blog-article">
          <div className="blog-article-content">
            <PortableText 
              value={blog.content} 
              components={portableTextComponents}
            />
          </div>
        </article>

        {/* Author Card */}
        <div className="author-card">
          <div className="author-card-avatar">
            {blog.author?.image ? (
              <img src={blog.author.image} alt={blog.author.name} />
            ) : (
              <User size={32} />
            )}
          </div>
          <div className="author-card-content">
            <h3>About {blog.author?.name || "the Author"}</h3>
            <p>
              {blog.author?.bio || "Passionate writer sharing insights on environmental impact and sustainable technology."}
            </p>
            {blog.author?.socialLinks && (
              <div className="author-socials">
                {blog.author.socialLinks.twitter && (
                  <a href={blog.author.socialLinks.twitter} target="_blank" rel="noopener noreferrer"><Twitter size={16} /></a>
                )}
                {blog.author.socialLinks.linkedin && (
                  <a href={blog.author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={16} /></a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="related-posts">
            <h2 className="related-posts-title">
              <TrendingUp size={24} />
              Related Articles
            </h2>
            <div className="related-posts-grid">
              {relatedPosts.map((post) => (
                <Link key={post._id} to={`/blog/${post.slug?.current}`} className="related-post-card">
                  <div
                    className="related-post-image"
                    style={{
                      backgroundImage: post.coverImage ? `url(${post.coverImage})` : 'none',
                      backgroundColor: `${getCategoryColor(post.categories?.[0]?.title)}40`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <div className="related-post-content">
                    <span className="related-post-category" style={{ color: getCategoryColor(post.categories?.[0]?.title) }}>
                      {post.categories?.[0]?.title}
                    </span>
                    <h4>{post.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
