
import { useState } from "react"
import { 
  FaFire, 
  FaComments, 
  FaQuestionCircle, 
  FaBook, 
  FaTrophy, 
  FaSearch, 
  FaEye, 
  FaHeart, 
  FaComment,
  FaUserGraduate,
  FaUser,
  FaBuilding,
  FaUsers,
  FaBell,
  FaRegLightbulb,
  FaRocket,
  FaChartLine,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaChevronDown
} from "react-icons/fa"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("all")

  // Community Groups
  const communityGroups = [
    {
      id: "students",
      name: "Student Community",
      icon: <FaUserGraduate />,
      description: "Connect with fellow students, share learning resources, and grow together",
      members: 2847,
      posts: 1523,
      color: "#10b981"
    },
    {
      id: "individuals",
      name: "Individual Contributors",
      icon: <FaUser />,
      description: "For individual members making a difference in sustainability",
      members: 1965,
      posts: 892,
      color: "#059669"
    },
    {
      id: "industry",
      name: "Industry Professionals",
      icon: <FaBuilding />,
      description: "Business leaders and industry experts sharing insights",
      members: 1234,
      posts: 687,
      color: "#047857"
    }
  ]

  // Trending Topics
  const trendingTopics = [
    {
      id: 1,
      title: "Sustainable Energy Solutions for Small Businesses",
      author: "Sarah Johnson",
      authorAvatar: "👩‍💼",
      level: "Industry Expert",
      group: "industry",
      date: "2 hours ago",
      category: "SUSTAINABILITY",
      tags: ["Energy", "Business", "Green Tech"],
      views: 342,
      likes: 67,
      comments: 23,
      status: "ongoing",
    },
    {
      id: 2,
      title: "Best Practices for Carbon Footprint Tracking",
      author: "Michael Chen",
      authorAvatar: "👨‍💻",
      level: "Level 8",
      group: "individuals",
      date: "5 hours ago",
      category: "CARBON TRACKING",
      tags: ["Analytics", "Environment", "Tools"],
      views: 289,
      likes: 54,
      comments: 18,
      status: "solved",
    },
    {
      id: 3,
      title: "Research Paper: Climate Change Impact Study",
      author: "Emma Rodriguez",
      authorAvatar: "👩‍🎓",
      level: "Student Researcher",
      group: "students",
      date: "1 day ago",
      category: "RESEARCH",
      tags: ["Climate", "Research", "Academic"],
      views: 456,
      likes: 89,
      comments: 34,
      status: "ongoing",
    },
    {
      id: 4,
      title: "Implementing Green Policies in Manufacturing",
      author: "David Kumar",
      authorAvatar: "👨‍🏭",
      level: "Industry Leader",
      group: "industry",
      date: "2 days ago",
      category: "POLICY",
      tags: ["Manufacturing", "Policy", "Compliance"],
      views: 521,
      likes: 95,
      comments: 41,
      status: "solved",
    }
  ]

  // Discussion Categories
  const discussionCategories = [
    { id: "announcements", name: "Announcements", icon: <FaBell />, count: 24 },
    { id: "help", name: "Help & Support", icon: <FaQuestionCircle />, count: 156 },
    { id: "showcase", name: "Project Showcase", icon: <FaRocket />, count: 89 },
    { id: "ideas", name: "Ideas & Innovation", icon: <FaRegLightbulb />, count: 203 },
  ]

  // Top Contributors
  const topContributors = [
    {
      id: 1,
      name: "Dr. Amanda Foster",
      badge: "Expert",
      group: "industry",
      score: 2850,
      avatar: "👩‍🔬",
      contributions: 145,
      badgeColor: "#10b981"
    },
    {
      id: 2,
      name: "Alex Thompson",
      badge: "Top Contributor",
      group: "individuals",
      score: 2340,
      avatar: "👨‍💼",
      contributions: 128,
      badgeColor: "#059669"
    },
    {
      id: 3,
      name: "Lisa Wang",
      badge: "Rising Star",
      group: "students",
      score: 1890,
      avatar: "👩‍🎓",
      contributions: 97,
      badgeColor: "#047857"
    },
    {
      id: 4,
      name: "James Wilson",
      badge: "Mentor",
      group: "industry",
      score: 1750,
      avatar: "👨‍🏫",
      contributions: 83,
      badgeColor: "#10b981"
    }
  ]

  // Popular Tags
  const popularTags = [
    "Sustainability", "Carbon Neutral", "Green Energy", "Climate Action", 
    "Renewable Energy", "Zero Waste", "ESG", "Conservation"
  ]

  const filteredTopics = selectedGroup === "all" 
    ? trendingTopics 
    : trendingTopics.filter(topic => topic.group === selectedGroup)

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Carbon Positive Community</h1>
            <p style={styles.heroDescription}>
              Join our thriving global community to connect with like-minded members, share knowledge, 
              and discover sustainable solutions for a carbon-positive future.
            </p>
          </div>
          <div style={styles.heroImageContainer}>
            <img 
              src="/GoCarbonPositive_LOGO.svg" 
              alt="Carbon Positive Logo" 
              style={styles.heroLogo}
            />
          </div>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search discussions, topics, or members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Community Highlights */}
      <div style={styles.summarySection}>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryHeader}>
              <FaChartLine style={styles.summaryHeaderIcon} />
              <h3 style={styles.sidebarTitle}>Community Stats</h3>
            </div>
            <div style={styles.statsGrid}>
              <div style={styles.summaryStatItem}>
                <FaUsers style={styles.summaryStatIcon} />
                <div>
                  <div style={styles.summaryStatNumber}>6,046</div>
                  <div style={styles.summaryStatLabel}>Active Members</div>
                </div>
              </div>
              <div style={styles.summaryStatItem}>
                <FaComments style={styles.summaryStatIcon} />
                <div>
                  <div style={styles.summaryStatNumber}>3,102</div>
                  <div style={styles.summaryStatLabel}>Discussions</div>
                </div>
              </div>
              <div style={styles.summaryStatItem}>
                <FaChartLine style={styles.summaryStatIcon} />
                <div>
                  <div style={styles.summaryStatNumber}>12,456</div>
                  <div style={styles.summaryStatLabel}>Solutions Shared</div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div style={styles.summaryHeader}>
              <FaTrophy style={styles.summaryHeaderIcon} />
              <h3 style={styles.sidebarTitle}>Top Contributors</h3>
            </div>
            <div style={styles.contributorsList}>
              {topContributors.slice(0, 3).map((contributor, index) => (
                <div key={contributor.id} style={styles.contributorItem}>
                  <div style={styles.contributorRank}>#{index + 1}</div>
                  <div style={styles.contributorAvatar}>{contributor.avatar}</div>
                  <div style={styles.contributorInfo}>
                    <div style={styles.contributorName}>{contributor.name}</div>
                    <div style={styles.contributorMeta}>
                      <span style={{...styles.contributorBadge, backgroundColor: contributor.badgeColor}}>
                        {contributor.badge}
                      </span>
                      <span style={styles.contributorGroup}>
                        {communityGroups.find(g => g.id === contributor.group)?.name}
                      </span>
                    </div>
                  </div>
                  <div style={styles.contributorScore}>
                    <FaStar style={{color: '#fbbf24', fontSize: '14px'}} />
                    <span>{contributor.score}</span>
                  </div>
                </div>
              ))}
            </div>
            <button style={styles.seeMoreButton} aria-label="View more contributors">
              +
            </button>
          </div>

          <div style={styles.summaryCard}>
            <div style={styles.summaryHeader}>
              <FaRegLightbulb style={styles.summaryHeaderIcon} />
              <h3 style={styles.sidebarTitle}>Popular Topics</h3>
            </div>
            <div style={styles.tagsGrid}>
              {popularTags.map((tag, idx) => (
                <span key={idx} style={styles.popularTag}>{tag}</span>
              ))}
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div style={styles.summaryHeader}>
              <FaCheckCircle style={styles.summaryHeaderIcon} />
              <h3 style={styles.sidebarTitle}>Community Guidelines</h3>
            </div>
            <ul style={styles.guidelinesList}>
              <li style={styles.guidelineItem}>
                <FaCheckCircle style={styles.guidelineIcon} />
                Be respectful and inclusive
              </li>
              <li style={styles.guidelineItem}>
                <FaCheckCircle style={styles.guidelineIcon} />
                Share knowledge constructively
              </li>
              <li style={styles.guidelineItem}>
                <FaCheckCircle style={styles.guidelineIcon} />
                Verify information before posting
              </li>
              <li style={styles.guidelineItem}>
                <FaCheckCircle style={styles.guidelineIcon} />
                Support sustainable practices
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Community Groups Section */}
      <div style={styles.groupsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Community Groups</h2>
          <p style={styles.sectionSubtitle}>Choose your community to connect with the right people</p>
        </div>
        <div style={styles.groupsGrid}>
          {communityGroups.map((group) => (
            <div 
              key={group.id} 
              style={{
                ...styles.groupCard,
                borderColor: selectedGroup === group.id ? group.color : '#e5e7eb',
                backgroundColor: selectedGroup === group.id ? '#f0fdf4' : '#ffffff'
              }}
              onClick={() => setSelectedGroup(selectedGroup === group.id ? "all" : group.id)}
            >
              <div style={{...styles.groupIcon, backgroundColor: `${group.color}20`, color: group.color}}>
                {group.icon}
              </div>
              <h3 style={styles.groupName}>{group.name}</h3>
              <p style={styles.groupDescription}>{group.description}</p>
              <div style={styles.groupStats}>
                <div style={styles.groupStat}>
                  <FaUsers style={{color: group.color, fontSize: '16px'}} />
                  <span>{group.members.toLocaleString()} members</span>
                </div>
                <div style={styles.groupStat}>
                  <FaComment style={{color: group.color, fontSize: '16px'}} />
                  <span>{group.posts} posts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={styles.mainContent}>
        <div style={styles.contentGrid}>
          {/* Left Content */}
          <div style={styles.leftContent}>
            {/* Navigation Tabs */}
            <div style={styles.tabsContainer}>
              {[
                { id: "all", label: "All Discussions", icon: <FaFire /> },
                { id: "trending", label: "Trending", icon: <FaFire /> },
                // { id: "discussions", label: "Discussions", icon: <FaComments /> },
                { id: "questions", label: "Q&A", icon: <FaQuestionCircle /> },
                { id: "resources", label: "Resources", icon: <FaBook /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    ...styles.tabButton,
                    ...(activeTab === tab.id ? styles.tabButtonActive : {})
                  }}
                >
                  {tab.icon}
                  <span style={styles.tabLabel}>{tab.label}</span>
                </button>
              ))}
              <details style={styles.categoryDropdown}>
                <summary style={styles.categoryDropdownSummary}>
                  <FaBell />
                  <span style={styles.tabLabel}>Categories</span>
                  <FaChevronDown style={styles.dropdownIcon} />
                </summary>
                <div style={styles.categoryDropdownMenu}>
                  {discussionCategories.map((category) => (
                    <button key={category.id} style={styles.categoryDropdownItem}>
                      <div style={styles.categoryLeft}>
                        <span style={styles.categoryIcon}>{category.icon}</span>
                        <span style={styles.categoryName}>{category.name}</span>
                      </div>
                      <span style={styles.categoryCount}>{category.count}</span>
                    </button>
                  ))}
                </div>
              </details>
            </div>

            {/* Filter Info */}
            {selectedGroup !== "all" && (
              <div style={styles.filterInfo}>
                <span>Showing posts from: </span>
                <strong>{communityGroups.find(g => g.id === selectedGroup)?.name}</strong>
                <button 
                  onClick={() => setSelectedGroup("all")} 
                  style={styles.clearFilter}
                >
                  Clear Filter
                </button>
              </div>
            )}

            {/* Topics List */}
            <div style={styles.topicsSection}>
              <div style={styles.topicsHeader}>
                <h2 style={styles.topicsTitle}>
                  {activeTab === "all" ? "Latest Discussions" : 
                   activeTab === "trending" ? "Trending Topics" : 
                   activeTab === "discussions" ? "Active Discussions" :
                   activeTab === "questions" ? "Recent Questions" : "Knowledge Resources"}
                </h2>
                <button style={styles.newPostButton}>
                  <FaRocket style={{marginRight: '8px'}} />
                  Start Discussion
                </button>
              </div>

              <div style={styles.topicsList}>
                {filteredTopics.map((topic) => (
                  <div key={topic.id} style={styles.topicCard}>
                    <div style={styles.topicAvatar}>{topic.authorAvatar}</div>
                    <div style={styles.topicContent}>
                      <div style={styles.topicHeader}>
                        <div style={styles.topicHeaderLeft}>
                          <h3 style={styles.topicTitle}>{topic.title}</h3>
                          <div style={styles.topicMeta}>
                            <span style={styles.topicAuthor}>{topic.author}</span>
                            <span style={styles.metaSeparator}>•</span>
                            <span style={styles.topicLevel}>{topic.level}</span>
                            <span style={styles.metaSeparator}>•</span>
                            <span style={styles.topicGroup}>
                              {communityGroups.find(g => g.id === topic.group)?.name}
                            </span>
                            <span style={styles.metaSeparator}>•</span>
                            <span style={styles.topicDate}>
                              <FaClock style={{fontSize: '12px', marginRight: '4px'}} />
                              {topic.date}
                            </span>
                          </div>
                          <div style={styles.tagsContainer}>
                            <span style={styles.categoryBadge}>{topic.category}</span>
                            {topic.tags.map((tag, idx) => (
                              <span key={idx} style={styles.tag}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div style={styles.topicStatus}>
                          {topic.status === "solved" ? (
                            <span style={styles.statusSolved}>
                              <FaCheckCircle style={{marginRight: '4px'}} />
                              Solved
                            </span>
                          ) : (
                            <span style={styles.statusOngoing}>
                              <FaClock style={{marginRight: '4px'}} />
                              Ongoing
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={styles.topicStats}>
                        <div style={styles.stat}>
                          <FaEye style={styles.statIconSmall} />
                          <span>{topic.views}</span>
                        </div>
                        <div style={styles.stat}>
                          <FaHeart style={styles.statIconSmall} />
                          <span>{topic.likes}</span>
                        </div>
                        <div style={styles.stat}>
                          <FaComment style={styles.statIconSmall} />
                          <span>{topic.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside style={styles.sidebar}>
            {/* Top Contributors */}
          </aside>
        </div>
      </div>
    </div>
  )
}

// Styles Object
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  // Hero Section
  heroSection: {
    background: '#38b000',
    padding: '48px 24px',
    borderBottom: '2px solid #10b981',
  },
  heroContainer: {
    maxWidth: '1400px',
    margin: '0 auto 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '48px',
  },
  heroContent: {
    flex: '1',
    maxWidth: '700px',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '16px',
    lineHeight: '1.2',
  },
  heroDescription: {
    fontSize: '1.125rem',
    color: '#ffffff',
    marginBottom: '32px',
    lineHeight: '1.7',
  },
  heroStats: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statIcon: {
    fontSize: '32px',
    color: '#ffffff',
  },
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#ffffff',
  },
  heroImageContainer: {
    flexShrink: '0',
  },
  heroLogo: {
    width: '160px',
    height: 'auto',
  },
  searchContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6b7280',
    fontSize: '18px',
  },
  searchInput: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    border: '2px solid #10b981',
    borderRadius: '12px',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
  },

  // Community Highlights
  summarySection: {
    maxWidth: '1400px',
    margin: '32px auto 16px',
    padding: '0 24px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    alignItems: 'stretch',
    gridAutoRows: '1fr',
  },
  summaryCard: {
    backgroundColor: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    padding: '24px',
    height: '100%',
  },
  summaryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  summaryHeaderIcon: {
    color: '#10b981',
    fontSize: '20px',
    lineHeight: '1',
    display: 'block',
  },
  statsGrid: {
    display: 'grid',
    gap: '12px',
  },
  summaryStatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  summaryStatIcon: {
    fontSize: '24px',
    color: '#10b981',
  },
  summaryStatNumber: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#111827',
  },
  summaryStatLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  seeMoreButton: {
    marginTop: '16px',
    alignSelf: 'flex-start',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: '1px solid #38b000',
    backgroundColor: '#38b000',
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    cursor: 'pointer',
    lineHeight: '1',
  },

  // Community Groups Section
  groupsSection: {
    maxWidth: '1400px',
    margin: '48px auto',
    padding: '0 24px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#065f46',
    marginBottom: '8px',
  },
  sectionSubtitle: {
    fontSize: '1rem',
    color: '#6b7280',
  },
  groupsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  groupCard: {
    backgroundColor: '#ffffff',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    padding: '32px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  groupIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    marginBottom: '16px',
  },
  groupName: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  },
  groupDescription: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  groupStats: {
    display: 'flex',
    gap: '24px',
  },
  groupStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.875rem',
    color: '#4b5563',
  },

  // Main Content
  mainContent: {
    maxWidth: '100%',
    margin: '0 auto 48px',
    padding: '0 24px',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
  },

  // Left Content
  leftContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  tabsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '12px',
    backgroundColor: '#ffffff',
    padding: '8px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'visible',
    alignItems: 'center',
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#6b7280',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    justifyContent: 'center',
    width: '100%',
    lineHeight: '1',
  },
  tabButtonActive: {
    backgroundColor: '#38b000',
    color: '#ffffff',
  },
  tabLabel: {
    display: 'inline',
    lineHeight: '1',
  },
  categoryDropdown: {
    position: 'relative',
    width: '100%',
  },
  categoryDropdownSummary: {
    listStyle: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#6b7280',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    justifyContent: 'center',
    width: '100%',
    lineHeight: '1',
  },
  dropdownIcon: {
    fontSize: '12px',
    marginLeft: '4px',
  },
  categoryDropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    minWidth: '260px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
    zIndex: 50,
  },
  categoryDropdownItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  filterInfo: {
    backgroundColor: '#ecfdf5',
    border: '1px solid #10b981',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '0.875rem',
    color: '#065f46',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  clearFilter: {
    marginLeft: 'auto',
    padding: '4px 12px',
    backgroundColor: '#38b000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // Topics Section
  topicsSection: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
  },
  topicsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  topicsTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
  },
  newPostButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#38b000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  topicsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  topicCard: {
    display: 'flex',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  },
  topicAvatar: {
    fontSize: '2.5rem',
    flexShrink: '0',
  },
  topicContent: {
    flex: '1',
    minWidth: '0',
  },
  topicHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '16px',
  },
  topicHeaderLeft: {
    flex: '1',
    minWidth: '0',
  },
  topicTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
    lineHeight: '1.4',
  },
  topicMeta: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    fontSize: '0.813rem',
    color: '#6b7280',
    marginBottom: '12px',
  },
  topicAuthor: {
    fontWeight: '600',
    color: '#374151',
  },
  metaSeparator: {
    color: '#d1d5db',
  },
  topicLevel: {
    color: '#10b981',
    fontWeight: '500',
  },
  topicGroup: {
    color: '#059669',
    fontWeight: '500',
  },
  topicDate: {
    display: 'flex',
    alignItems: 'center',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  categoryBadge: {
    padding: '4px 10px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '6px',
    fontSize: '0.688rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tag: {
    padding: '4px 10px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  topicStatus: {
    flexShrink: '0',
  },
  statusSolved: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '8px',
    fontSize: '0.813rem',
    fontWeight: '700',
  },
  statusOngoing: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    backgroundColor: '#fed7aa',
    color: '#9a3412',
    borderRadius: '8px',
    fontSize: '0.813rem',
    fontWeight: '700',
  },
  topicStats: {
    display: 'flex',
    gap: '20px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  statIconSmall: {
    fontSize: '14px',
  },

  // Sidebar
  sidebar: {
    display: 'none',
  },
  sidebarCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  sidebarTitle: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '16px',
  },
  categoriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  categoryLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  categoryIcon: {
    color: '#10b981',
    fontSize: '16px',
  },
  categoryName: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
  },
  categoryCount: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#6b7280',
    backgroundColor: '#e5e7eb',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  contributorsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  contributorItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  contributorRank: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#10b981',
    minWidth: '24px',
  },
  contributorAvatar: {
    fontSize: '1.75rem',
  },
  contributorInfo: {
    flex: '1',
    minWidth: '0',
  },
  contributorName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  contributorMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.688rem',
  },
  contributorBadge: {
    padding: '2px 8px',
    color: '#ffffff',
    borderRadius: '4px',
    fontWeight: '600',
  },
  contributorGroup: {
    color: '#6b7280',
  },
  contributorScore: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#111827',
  },
  tagsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  popularTag: {
    padding: '6px 12px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  guidelinesList: {
    listStyle: 'none',
    margin: '0',
    padding: '0',
  },
  guidelineItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '12px',
    lineHeight: '1.5',
  },
  guidelineIcon: {
    color: '#10b981',
    fontSize: '16px',
    marginTop: '2px',
    flexShrink: '0',
  },
}
