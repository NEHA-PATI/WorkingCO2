import React, { useState, useRef, useEffect } from "react";
import "../styles/user/blog.css";
import { FaPlus, FaRegHeart, FaHeart } from "react-icons/fa";
import api from "../services/apiClient";
// Navbar and Footer are provided by BaseLayout

const categories = [
  "All",
  "Carbon Credit",
  "Sustainable Development",
  "Others",
];

const Blog = ({ isAuthenticated }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPostModal, setShowPostModal] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postSummary, setPostSummary] = useState("");
  const [postFile, setPostFile] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [postCategories, setPostCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const fileInputRef = useRef();
  const [commentInputs, setCommentInputs] = useState({});
  const [modalBlog, setModalBlog] = useState(null);

  useEffect(() => {
    api
      .get("/")
      .then((res) => setBlogs(res.data.blogs))
      .catch((err) => console.error("Error loading blogs:", err));
  }, []);

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((blog) => blog.tags.includes(selectedCategory));

  const handlePostFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPostFile(e.target.files[0]);
    }
  };

  const handleCategoryChange = (cat) => {
    setPostCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", postTitle);
    form.append("content", postContent);
    form.append("authorName", "You");
    form.append(
      "authorAvatar",
      "https://randomuser.me/api/portraits/lego/1.jpg"
    );
    form.append("authorBio", "Frontend Dev");
    form.append("tags", postCategories.join(","));
    if (postFile) {
      const field = postFile.type.startsWith("image/") ? "image" : "video";
      form.append(field, postFile);
    }

    try {
      const res = await api.post("/", form);
      setBlogs((prev) => [res.data.blog, ...prev]);
      setShowPostModal(false);
      setPostTitle("");
      setPostSummary("");
      setPostFile(null);
      setPostContent("");
      setPostCategories([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error creating blog:", err);
    }
  };

  const handleLike = async (blogId) => {
    try {
      const res = await api.patch(`/${blogId}/like`);
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blogId ? { ...b, likes: res.data.likes } : b
        )
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleCommentInput = (blogId, value) => {
    setCommentInputs((prev) => ({ ...prev, [blogId]: value }));
  };

  const handleAddComment = async (blogId) => {
    const text = (commentInputs[blogId] || "").trim();
    if (!text) return;
    try {
      const res = await api.post(`/${blogId}/comments`, {
        user: "You",
        text,
      });
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blogId ? { ...b, comments: res.data.comments } : b
        )
      );
      setCommentInputs((prev) => ({ ...prev, [blogId]: "" }));
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  return (
    <div className="blog-main-wrapper">
      {/* <Navbar /> */}

      {/* Hero Section */}

      <div className="blog-hero-section">
        <div className="blog-hero-bg" />

        <div className="blog-hero-content">
          <h1>Welcome to Carbon Credit Blogs</h1>
        </div>
      </div>

      {/* Category Filter */}

      <div className="blog-category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`blog-category-btn ${
              selectedCategory === cat ? "active" : ""
            }`} // ✅ fixed class spacing
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}

        {isAuthenticated && (
          <button
            className="blog-category-btn post-btn"
            onClick={() => setShowPostModal(true)}
          >
            <FaPlus style={{ marginRight: 6, fontSize: "0.9em" }} /> Post
          </button>
        )}
      </div>

      {/* Blog Grid */}

      <div className="blog-content-row">
        <div className="blog-grid">
          {filteredBlogs.map((blog) => (
            <div
              className="blog-card-modern"
              key={blog._id}
              onClick={() =>
                setModalBlog({
                  title: blog.title,

                  content: blog.content,

                  author: blog.author.name,

                  authorAvatar: blog.author.avatar,

                  date: blog.createdAt,

                  categories: blog.tags,

                  summary: blog.content.slice(0, 100),

                  image: blog.imageUrl,
                })
              }
            >
              {blog.imageUrl && (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="blog-card-img"
                />
              )}

              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <img
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    className="blog-card-avatar"
                  />

                  <div>
                    <div className="blog-card-author">{blog.author.name}</div>

                    <div className="blog-card-date">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <h2 className="blog-card-title">{blog.title}</h2>

                <p className="blog-card-summary">
                  {blog.content.slice(0, 100)}...
                </p>

                <div className="blog-card-categories">
                  {blog.tags.map((tag) => (
                    <span className="blog-card-category" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="blog-like-section">
                  <button
                    className="blog-like-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(blog._id);
                    }}
                  >
                    <FaHeart /> {blog.likes || 0}
                  </button>
                </div>

                <div className="blog-comment-section">
                  <div className="blog-comments-list">
                    {blog.comments &&
                      blog.comments.map((c, idx) => (
                        <div className="blog-comment" key={idx}>
                          <span className="blog-comment-text">{c.text}</span>

                          <span className="blog-comment-date">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="blog-comment-input-row">
                    <input
                      type="text"
                      className="blog-comment-input"
                      placeholder="Add a comment..."
                      value={commentInputs[blog._id] || ""}
                      onChange={(e) =>
                        handleCommentInput(blog._id, e.target.value)
                      }
                    />

                    <button
                      className="blog-comment-add-btn"
                      onClick={() => handleAddComment(blog._id)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Modal */}

      {showPostModal && (
        <div
          className="blog-modal-overlay"
          onClick={() => setShowPostModal(false)}
        >
          <div
            className="blog-modal post-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setShowPostModal(false)}
            >
              &times;
            </button>

            <h2 className="modal-title">Create a Blog Post</h2>

            <form className="post-form" onSubmit={handlePostSubmit}>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Enter blog title"
                required
              />

              <input
                type="text"
                value={postSummary}
                onChange={(e) => setPostSummary(e.target.value)}
                placeholder="Short summary"
                required
              />

              <input
                type="file"
                accept="image/*,video/*"
                onChange={handlePostFileChange}
                ref={fileInputRef}
              />

              <div>
                {categories
                  .filter((cat) => cat !== "All")
                  .map((cat) => (
                    <label key={cat}>
                      <input
                        type="checkbox"
                        checked={postCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                      />{" "}
                      {cat}
                    </label>
                  ))}
              </div>

              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={6}
                required
                placeholder="Write your blog here..."
              />

              <button type="submit" className="post-submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Blog View Modal */}

      {modalBlog && (
        <div className="blog-modal-overlay" onClick={() => setModalBlog(null)}>
          <div
            className="blog-modal post-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setModalBlog(null)}
            >
              &times;
            </button>

            <div
              className="blog-card-meta"
              style={{ justifyContent: "center", marginBottom: 12 }}
            >
              <img
                src={modalBlog.authorAvatar}
                alt={modalBlog.author}
                className="blog-card-avatar"
              />

              <div>
                <div className="blog-card-author">{modalBlog.author}</div>

                <div className="blog-card-date">
                  {new Date(modalBlog.date).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div
              className="blog-card-categories"
              style={{ justifyContent: "center", marginBottom: 8 }}
            >
              {modalBlog.categories.map((cat) => (
                <span className="blog-card-category" key={cat}>
                  {cat}
                </span>
              ))}
            </div>

            <h2 className="blog-card-title" style={{ textAlign: "center" }}>
              {modalBlog.title}
            </h2>

            <p className="blog-card-summary" style={{ textAlign: "center" }}>
              {modalBlog.summary}
            </p>

            {modalBlog.image && (
              <img
                src={modalBlog.image}
                alt={modalBlog.title}
                className="blog-card-img"
                style={{ margin: "0 auto 18px auto", maxHeight: 220 }}
              />
            )}

            <div className="blog-modal-content" style={{ marginTop: 10 }}>
              {modalBlog.content
                .split(/\n+/)
                .map((para, idx) =>
                  para.trim() ? <p key={idx}>{para}</p> : null
                )}
            </div>
          </div>
        </div>
      )}
      {/* Footer is provided by BaseLayout */}
    </div>
  );
};

export default Blog;
