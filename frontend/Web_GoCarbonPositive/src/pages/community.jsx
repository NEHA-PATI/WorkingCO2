import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Navbar and Footer are provided by BaseLayout
import "../styles/user/community.css";
import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";

const suggestionsData = [
  {
    id: 1,
    name: "Amit Verma",
    title: "Climate Scientist",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    posts: [
      {
        id: 101,
        content: "Just published a paper on carbon sequestration in mangroves!",
      },
      { id: 102, content: "Excited to join the Carbon Community!" },
    ],
  },
  {
    id: 2,
    name: "Sara Lee",
    title: "NGO Volunteer",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    posts: [
      {
        id: 201,
        content: "Organizing a tree plantation drive this weekend. Join us!",
      },
    ],
  },
  {
    id: 3,
    name: "Rohit Gupta",
    title: "Green Entrepreneur",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    posts: [
      { id: 301, content: "Launching a new biodegradable packaging startup!" },
    ],
  },
  {
    id: 4,
    name: "Emily Carter",
    title: "Sustainability Coach",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    posts: [
      {
        id: 401,
        content: "5 tips for reducing your carbon footprint at home.",
      },
    ],
  },
  {
    id: 5,
    name: "David Kim",
    title: "Eco Startup Founder",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    posts: [
      { id: 501, content: "Our team just offset 10,000kg of CO₂ this month!" },
    ],
  },
  {
    id: 6,
    name: "Linda Park",
    title: "Environmental Activist",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    posts: [
      {
        id: 601,
        content: "Spoke at the local school about climate change awareness.",
      },
    ],
  },
  {
    id: 7,
    name: "Carlos Diaz",
    title: "Climate Policy Advisor",
    avatar: "https://randomuser.me/api/portraits/men/53.jpg",
    posts: [
      { id: 701, content: "Consulting on new carbon credit regulations." },
    ],
  },
  {
    id: 8,
    name: "Fatima Noor",
    title: "Green Tech Engineer",
    avatar: "https://randomuser.me/api/portraits/women/77.jpg",
    posts: [
      {
        id: 801,
        content: "Developed a solar-powered water purification system.",
      },
    ],
  },
  {
    id: 9,
    name: "John Smith",
    title: "Tree Planter",
    avatar: "https://randomuser.me/api/portraits/men/90.jpg",
    posts: [{ id: 901, content: "Planted 500 trees this month with my team!" }],
  },
];

export default function Community({
  user,
  isAuthenticated,
  onLogout,
  onUserUpdate,
}) {
  const [isNewUser, setIsNewUser] = useState(true);
  const navigate = useNavigate();
  const [connected, setConnected] = useState([]);
  const [suggestionCount, setSuggestionCount] = useState(3);
  const [userPosts, setUserPosts] = useState([]);
  const [postInput, setPostInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleConnect = (id) => {
    setConnected((prev) => [...prev, id]);
    setIsNewUser(false);
  };

  // Add handleUnfollow function
  const handleUnfollow = (id) => {
    setConnected((prev) => prev.filter((cid) => cid !== id));
  };

  const handleSeeMore = () => {
    setSuggestionCount((count) => Math.min(count + 3, suggestionsData.length));
    setTimeout(() => {
      const sidebar = document.getElementById("suggestionsBar");
      if (sidebar) sidebar.scrollTop = sidebar.scrollHeight;
    }, 100);
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (postInput.trim()) {
      setUserPosts((prev) => [
        { id: Date.now(), content: postInput, timestamp: Date.now() },
        ...prev,
      ]);
      setPostInput("");
      setIsNewUser(false);
    }
  };

  const filteredSuggestions = suggestionsData.filter(
    (person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const followedPosts = suggestionsData
    .filter((person) => connected.includes(person.id))
    .flatMap((person) =>
      person.posts.map((post) => ({
        ...post,
        author: person.name,
        avatar: person.avatar,
        title: person.title,
      }))
    );

  const feedPosts = [
    ...userPosts.map((post) => ({
      ...post,
      author: "You",
      avatar: "/default-avatar.png",
      title: "Community Member",
    })),
    ...followedPosts,
  ].sort((a, b) => b.timestamp - a.timestamp || b.id - a.id);

  return (
    <div className="communityPage">
      <div className="toolbar">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            maxWidth: 600,
            position: "relative",
          }}
        >
          <FaSearch
            style={{
              position: "absolute",
              left: 16,
              color: "#0073b1",
              fontSize: "1.1em",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            type="text"
            className="searchInput"
            placeholder="Search community..."
            style={{ paddingLeft: 40 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginLeft: 24,
          }}
        >
          <button className="iconBtn" aria-label="Notifications">
            <FaBell />
          </button>
          <button
            className="iconBtn"
            aria-label="Profile"
            onClick={() => navigate("/profile")} // <-- Add this handler
          >
            <FaUserCircle />
          </button>
        </div>
      </div>
      <div className="mainContent">
        {isNewUser ? (
          <div className="defaultCommunity">
            <h2>Welcome to the Carbon Community!</h2>
            <p>
              Connect with sustainability leaders, climate activists, and green
              tech innovators.
              <br />
              Follow members to grow your network and stay updated on the latest
              in carbon action.
            </p>
            <div className="featuredMembers">
              <h3>Featured Members</h3>
              <ul className="suggestionsList">
                {filteredSuggestions.slice(0, 5).map((person) => (
                  <li key={person.id} className="suggestionItem">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="suggestionAvatar"
                    />
                    <div>
                      <div className="suggestionName">{person.name}</div>
                      <div className="suggestionTitle">{person.title}</div>
                    </div>
                    {connected.includes(person.id) ? (
                      <button
                        className="connectedBtn"
                        onClick={() => handleUnfollow(person.id)}
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        className="connectBtn"
                        onClick={() => handleConnect(person.id)}
                      >
                        Follow
                      </button>
                    )}
                  </li>
                ))}
                {filteredSuggestions.length === 0 && (
                  <div className="noResults">No members found</div>
                )}
              </ul>
            </div>
            <div className="communityInfo">
              <h4>Why join?</h4>
              <ul>
                <li>Share and learn about sustainable development</li>
                <li>Collaborate on carbon reduction projects</li>
                <li>Stay updated on green initiatives</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="feed">
            <form className="postBox" onSubmit={handlePost}>
              <img src="/default-avatar.png" alt="You" className="postAvatar" />
              <textarea
                className="postInput"
                placeholder="Share something with the community..."
                value={postInput}
                onChange={(e) => setPostInput(e.target.value)}
                rows={2}
                required
              />
              <button type="submit" className="postBtn">
                Post
              </button>
            </form>
            <div className="feedPosts">
              {feedPosts.length === 0 && (
                <div className="noPosts">
                  Follow members to see their posts here!
                </div>
              )}
              {feedPosts.map((post) => (
                <div key={post.id} className="feedPost">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="feedAvatar"
                  />
                  <div>
                    <div className="feedAuthor">{post.author}</div>
                    <div className="feedTitle">{post.title}</div>
                    <div className="feedContent">{post.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <aside className="suggestionsBar" id="suggestionsBar">
          <h3>Suggestions</h3>
          <ul className="suggestionsList">
            {filteredSuggestions.slice(0, suggestionCount).map((person) => (
              <li key={person.id} className="suggestionItem">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="suggestionAvatar"
                />
                <div>
                  <div className="suggestionName">{person.name}</div>
                  <div className="suggestionTitle">{person.title}</div>
                </div>
                {connected.includes(person.id) ? (
                  <button
                    className="connectedBtn"
                    onClick={() => handleUnfollow(person.id)}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    className="connectBtn"
                    onClick={() => handleConnect(person.id)}
                  >
                    Follow
                  </button>
                )}
              </li>
            ))}
            {filteredSuggestions.length === 0 && (
              <div className="noResults">No members found</div>
            )}
          </ul>
          {suggestionCount < filteredSuggestions.length && (
            <button
              className="seeMoreBtn"
              onClick={handleSeeMore}
              type="button"
            >
              See More
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
