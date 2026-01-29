"use client"

import { useState } from "react"
import { Heart, Eye, MessageCircle, Search, Flame, MessageSquare, HelpCircle, BookOpen, Trophy } from "lucide-react"
import "../styles/user/community.css"
import Footer from "../components/common/Footer"


export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("trending")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data
  const trendingTopics = [
    {
      id: 1,
      title: "How to Improve Website Load Speed?",
      author: "AliceM",
      level: "Level 5",
      date: "2 days ago",
      category: "PERFORMANCE",
      tags: ["WEB", "SPEED", "OPTIMIZATION"],
      views: 156,
      likes: 24,
      comments: 8,
      status: "solved",
      avatar: "👩‍💼",
    },
    {
      id: 2,
      title: "Best Practices for API Integration",
      author: "TechGuru",
      level: "Level 6",
      date: "1 day ago",
      category: "API",
      tags: ["BACKEND", "INTEGRATION"],
      views: 203,
      likes: 45,
      comments: 12,
      status: "solved",
      avatar: "👨‍💻",
    },
    {
      id: 3,
      title: "Database Optimization Strategies",
      author: "CreativeSam",
      level: "Level 4",
      date: "3 hours ago",
      category: "DATABASE",
      tags: ["DATABASE", "SQL", "PERFORMANCE"],
      views: 89,
      likes: 15,
      comments: 5,
      status: "ongoing",
      avatar: "👨‍🔬",
    },
  ]

  const discussions = [
    {
      id: 1,
      title: "Upcoming Webinar: Don't Miss Out!",
      category: "ANNOUNCEMENT",
      author: "Admin",
      date: "3 days ago",
      views: 342,
      likes: 28,
      comments: 15,
      avatar: "📢",
    },
    {
      id: 2,
      title: "Need Advice on SEO Strategies",
      category: "HELP",
      author: "Admin",
      date: "2 days ago",
      views: 198,
      likes: 13,
      comments: 32,
      avatar: "❓",
    },
    {
      id: 3,
      title: "My Latest Project Showcase",
      category: "SHOWCASE",
      author: "Admin",
      date: "1 day ago",
      views: 267,
      likes: 36,
      comments: 24,
      avatar: "✨",
    },
  ]

  const mostLikedQuestions = [
    {
      id: 1,
      title: "Mac Download Issue: Video Stops at 90-95%",
      author: "Marcelopuravidamedia",
      level: "New member",
      date: "1 day ago",
      views: 24,
      likes: 0,
      comments: 2,
      status: "solved",
      avatar: "🟣",
    },
    {
      id: 2,
      title: "Contact Support Page Results in Error",
      author: "GS_Sunatori",
      level: "Level 5",
      date: "1 day ago",
      views: 22,
      likes: 0,
      comments: 6,
      status: "solved",
      avatar: "🟥",
    },
    {
      id: 3,
      title: "Unable to Move Dropbox Folder to USB Drive",
      author: "Highside",
      level: "Level 4",
      date: "2 days ago",
      views: 52,
      likes: 0,
      comments: 6,
      status: "solved",
      avatar: "🟣",
    },
  ]

  const topContributors = [
    {
      id: 1,
      name: "AliceM",
      badge: "Expert",
      score: 650,
      avatar: "👩‍💼",
      badgeColor: "badge-expert",
    },
    {
      id: 2,
      name: "TechGuru",
      badge: "Senior",
      score: 540,
      avatar: "👨‍💻",
      badgeColor: "badge-senior",
    },
    {
      id: 3,
      name: "CreativeSam",
      badge: "Helper",
      score: 410,
      avatar: "👨‍🔬",
      badgeColor: "badge-helper",
    },
    {
      id: 4,
      name: "RichardPro",
      badge: "Mentor",
      score: 520,
      avatar: "🧑‍🏫",
      badgeColor: "badge-mentor",
    },
  ]

  const popularTags = ["WEB", "SPEED", "API", "DATABASE", "BACKEND", "FRONTEND", "PERFORMANCE"]

  const guidelines = [
    "Be respectful and professional",
    "Provide helpful and constructive feedback",
    "Search for existing answers first",
    "Share knowledge and best practices",
  ]

  return (
    <div className="community-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Carbon Positive Community</h1>
            <p className="hero-description">
              Join our thriving community to connect with like-minded members, get answers to your questions, and
              discover sustainable solutions for a better tomorrow.
            </p>
           
          </div>
          <div className="hero-icon">
          <img src="/GoCarbonPositive_LOGO.svg" alt="" className="hero-logo" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search in English..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-navigation">
        <div className="tabs-container">
          {[
            { id: "trending", label: "Trending", icon: Flame },
            { id: "discussions", label: "Discussions", icon: MessageSquare },
            { id: "questions", label: "Questions", icon: HelpCircle },
            { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
            { id: "contributors", label: "Top Contributors", icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? "tab-active" : ""}`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="content-wrapper">
        <div className="content-grid">
          {/* Main Content */}
          <div className="main-content">
            {/* Trending Tab */}
            {activeTab === "trending" && (
              <div className="tab-content">
                <h2 className="section-title">Trending Topics</h2>
                <div className="topics-list">
                  {trendingTopics.map((topic) => (
                    <div key={topic.id} className="topic-card">
                      <div className="topic-avatar">{topic.avatar}</div>
                      <div className="topic-body">
                        <div className="topic-header">
                          <div>
                            <h3 className="topic-title">{topic.title}</h3>
                            <div className="topic-meta">
                              <span className="meta-item">{topic.author}</span>
                              <span className="meta-separator">•</span>
                              <span className="meta-item">{topic.level}</span>
                              <span className="meta-separator">•</span>
                              <span className="meta-item">{topic.date}</span>
                            </div>
                            <div className="tags-list">
                              {topic.tags.map((tag) => (
                                <span key={tag} className="tag tag-default">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className={`status-badge ${topic.status}`}>
                            {topic.status === "solved" ? "✓ Solved" : "○ Ongoing"}
                          </span>
                        </div>
                        <div className="topic-stats">
                          <div className="stat">
                            <Eye size={16} />
                            <span>{topic.views}</span>
                          </div>
                          <div className="stat">
                            <Heart size={16} />
                            <span>{topic.likes}</span>
                          </div>
                          <div className="stat">
                            <MessageCircle size={16} />
                            <span>{topic.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discussions Tab */}
            {activeTab === "discussions" && (
              <div className="tab-content">
                <div className="action-bar">
                  <input type="text" placeholder="Search all discussions..." className="search-input-secondary" />
                  <button className="btn btn-primary">Post</button>
                </div>

                <h2 className="section-title">Recent Discussions</h2>
                <div className="topics-list">
                  {discussions.map((discussion) => (
                    <div key={discussion.id} className="topic-card">
                      <div className="topic-avatar">{discussion.avatar}</div>
                      <div className="topic-body">
                        <h3 className="topic-title">{discussion.title}</h3>
                        <span className="category-badge">{discussion.category}</span>
                        <div className="topic-meta" style={{ marginTop: "8px" }}>
                          <span>Posted by {discussion.author}</span>
                          <span className="meta-separator">•</span>
                          <span>{discussion.date}</span>
                        </div>
                        <div className="topic-stats">
                          <div className="stat">
                            <Eye size={16} />
                            <span>{discussion.views}</span>
                          </div>
                          <div className="stat">
                            <Heart size={16} />
                            <span>{discussion.likes}</span>
                          </div>
                          <div className="stat">
                            <MessageCircle size={16} />
                            <span>{discussion.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions Tab */}
            {activeTab === "questions" && (
              <div className="tab-content">
                <div className="action-bar">
                  <input type="text" placeholder="Search all questions..." className="search-input-secondary" />
                  <div className="action-buttons">
                    <select className="select-input">
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>All Time</option>
                    </select>
                    <button className="btn btn-primary">Ask Question</button>
                  </div>
                </div>

                <h2 className="section-title">Questions</h2>
                <div className="topics-list">
                  {mostLikedQuestions.map((question) => (
                    <div key={question.id} className="topic-card">
                      <div className="topic-avatar">{question.avatar}</div>
                      <div className="topic-body">
                        <div className="topic-header">
                          <div className="flex-1">
                            <h3 className="topic-title">{question.title}</h3>
                            <div className="topic-meta">
                              <span className="meta-item">{question.author}</span>
                              <span className="meta-separator">•</span>
                              <span className="meta-item">{question.level}</span>
                              <span className="meta-separator">•</span>
                              <span className="meta-item">{question.date}</span>
                            </div>
                          </div>
                          <span className={`status-badge ${question.status}`}>
                            {question.status === "solved" ? "✓ Solved" : "○ Ongoing"}
                          </span>
                        </div>
                        <div className="topic-stats">
                          <div className="stat">
                            <Eye size={16} />
                            <span>{question.views}</span>
                          </div>
                          <div className="stat">
                            <Heart size={16} />
                            <span>{question.likes}</span>
                          </div>
                          <div className="stat">
                            <MessageCircle size={16} />
                            <span>{question.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Knowledge Base Tab */}
            {activeTab === "knowledge" && (
              <div className="tab-content knowledge-section">
                <BookOpen className="knowledge-icon" size={48} />
                <h2 className="section-title">Knowledge Base</h2>
                <p className="knowledge-description">
                  Explore comprehensive guides and documentation to help you get the most out of our platform.
                </p>
                <button className="btn btn-primary">Browse Articles</button>
              </div>
            )}

            {/* Contributors Tab */}
            {activeTab === "contributors" && (
              <div className="tab-content">
                <h2 className="section-title">All Contributors</h2>
                <div className="topics-list">
                  {topContributors.map((contributor) => (
                    <div key={contributor.id} className="contributor-card">
                      <div className="contributor-info">
                        <div className="contributor-avatar">{contributor.avatar}</div>
                        <div>
                          <h3 className="contributor-name">{contributor.name}</h3>
                          <span className={`badge ${contributor.badgeColor}`}>{contributor.badge}</span>
                        </div>
                      </div>
                      <div className="contributor-score">
                        <div className="score-value">{contributor.score}</div>
                        <div className="score-label">Points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            {/* Most Liked */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Most Liked</h3>
              <div className="sidebar-items">
                {mostLikedQuestions.slice(0, 3).map((item) => (
                  <div key={item.id} className="sidebar-item">
                    <div className="item-avatar">{item.avatar}</div>
                    <div className="item-content">
                      <p className="item-title">{item.title}</p>
                      <p className="item-author">{item.author}</p>
                      <div className="item-views">
                        <Eye size={12} />
                        <span>{item.views}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Popular Tags</h3>
              <div className="tags-grid">
                {popularTags.map((tag) => (
                  <span key={tag} className="tag tag-popular">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Community Guidelines</h3>
              <ul className="guidelines-list">
                {guidelines.map((guideline, idx) => (
                  <li key={idx} className="guideline-item">
                    ✓ {guideline}
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Contributors */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Top Contributors</h3>
              <div className="top-contributors-list">
                {topContributors.slice(0, 3).map((contributor) => (
                  <div key={contributor.id} className="contributor-mini">
                    <div className="contributor-mini-avatar">{contributor.avatar}</div>
                    <div className="contributor-mini-info">
                      <p className="contributor-mini-name">{contributor.name}</p>
                      <span className={`badge-mini ${contributor.badgeColor}`}>{contributor.badge}</span>
                    </div>
                    <div className="contributor-mini-score">{contributor.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
       
    </div>
  )
}