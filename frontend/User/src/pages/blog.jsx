import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Clock, User, TrendingUp, Loader2 } from "lucide-react";
import "../styles/user/blog.css";
import Footer from "../components/common/Footer.jsx";
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

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState("for-you");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0,
  });

  const fetchBlogs = useCallback(async (query = "", page = 1) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (query) {
        response = await blogService.searchPosts(query, page);
      } else {
        // Map tabs to backend logic if needed, for now just get all for "for-you"
        response = await blogService.getPosts(page);
      }

      setBlogs(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBlogs(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchBlogs]);

  // Filter by tab on client side for now if we don't have specialized backend endpoints
  const displayBlogs = blogs.filter((blog) => {
    if (activeTab === "featured") return blog.status === "published"; // Replace with featured logic if added
    if (activeTab === "trending") return true;
    return true;
  });

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <div className="blog-hero">
        <div className="blog-hero-content">
          <div className="blog-hero-badge">
            <TrendingUp size={16} />
            <span>Latest Insights & Stories</span>
          </div>
          <h1 className="blog-hero-title">
            Discover Ideas That <span className="gradient-text">Inspire</span>
          </h1>
          <p className="blog-hero-subtitle">
            Explore cutting-edge insights, tutorials, and case studies from
            industry experts
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="blog-search">
        <div className="search-input-wrapper">
          {loading ? (
            <Loader2 className="search-icon animate-spin" size={20} />
          ) : (
            <Search className="search-icon" size={20} />
          )}
          <input
            placeholder="Search articles, topics, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="join-community-btn">Join Community</button>
      </div>

      {/* Tabs */}
      <div className="blog-tabs">
        <span
          className={activeTab === "for-you" ? "active" : ""}
          onClick={() => setActiveTab("for-you")}
        >
          For you
        </span>
        <span
          className={activeTab === "featured" ? "active" : ""}
          onClick={() => setActiveTab("featured")}
        >
          Featured
        </span>
        <span
          className={activeTab === "trending" ? "active" : ""}
          onClick={() => setActiveTab("trending")}
        >
          Trending
        </span>
      </div>

      {/* Header */}
      <div className="blog-heading">
        <h1>
          {activeTab === "for-you"
            ? "For you"
            : activeTab === "featured"
              ? "Featured Posts"
              : "Trending Now"}
        </h1>
        {!loading && (
          <p>
            {displayBlogs.length} article{displayBlogs.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => fetchBlogs(searchQuery)}>Retry</button>
        </div>
      )}

      {/* Loading State */}
      {loading && blogs.length === 0 && (
        <div className="loading-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="blog-card skeleton">
              <div className="blog-image skeleton-box"></div>
              <div className="blog-content">
                <div className="skeleton-line short"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line medium"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Cards */}
      <div className="blog-grid">
        {!loading &&
          displayBlogs.map((blog) => (
            <div
              key={blog._id}
              className={`blog-card ${blog.featured ? "featured-card" : ""}`}
            >
              <div
                className="blog-image"
                style={{
                  backgroundImage: blog.coverImage
                    ? `url(${blog.coverImage})`
                    : "none",
                  backgroundColor: !blog.coverImage
                    ? getCategoryColor(blog.categories?.[0]?.title) + "20"
                    : "transparent",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {blog.featured && (
                  <div className="featured-badge">
                    <TrendingUp size={14} />
                    Featured
                  </div>
                )}
              </div>

              <div className="blog-content">
                <div className="blog-categories">
                  {blog.categories?.map((cat) => (
                    <span
                      key={cat._id}
                      className="blog-category"
                      style={{ color: getCategoryColor(cat.title) }}
                    >
                      {cat.title}
                    </span>
                  ))}
                </div>
                <h3>{blog.title}</h3>
                <p>{blog.excerpt || blog.description}</p>

                <div className="blog-meta">
                  <div className="blog-author">
                    <div className="author-avatar">
                      {blog.author?.image ? (
                        <img src={blog.author.image} alt={blog.author.name} />
                      ) : (
                        <User size={14} />
                      )}
                    </div>
                    <span>{blog.author?.name || "Anonymous"}</span>
                  </div>
                  <div className="blog-read-time">
                    <Clock size={14} />
                    <span>{blog.readTime || "5 min read"}</span>
                  </div>
                </div>

                <Link to={`/blog/${blog.slug?.current}`} className="read-more">
                  Read article <span>→</span>
                </Link>
              </div>
            </div>
          ))}
      </div>

      {!loading && displayBlogs.length === 0 && (
        <div className="no-results">
          <p>No articles found matching "{searchQuery}"</p>
        </div>
      )}
      {/* <Footer /> */}
    </div>
  );
}
