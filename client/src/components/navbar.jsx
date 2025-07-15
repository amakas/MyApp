import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.scss";
import LoginButton from "./buttons/loginButton";
import RegisterButton from "./buttons/registerButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState({ users: [], posts: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("userId");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (token) setIsLoggedIn(true);
  }, [token]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults({ users: [], posts: [] });
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?query=${searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Search error", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleGoToUser = (userId) => {
    navigate(`/userProfile/${userId}`);
    setShowDropdown(false);
    setSearchQuery("");
  };

  const handleGoToPost = (postId) => {
    navigate(`/comments/${id}/${postId}`);
    setShowDropdown(false);
    setSearchQuery("");
  };

  return (
    <div>
      <nav className="navbar">
        <ol className="pages-list">
          <li>
            <Link to={`/home/${id}`}>Home</Link>
          </li>
          <li>
            <Link to={`/chat/${id}`}>Chat</Link>
          </li>
          <li>
            <Link to={`/settings/${id}`}>Settings</Link>
          </li>
          <li>
            <Link to={`/profile/${id}`}>Profile</Link>
          </li>
          <li>
            <Link to={`/people/${id}`}>People</Link>
          </li>
        </ol>

        <div className="search-bar" ref={searchRef}>
          <input
            className="search-input"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
          />
          <FontAwesomeIcon className="glass" icon={faMagnifyingGlass} />

          {showDropdown && (
            <div className="search-dropdown">
              {results.users.length === 0 && results.posts.length === 0 ? (
                <p className="no-results">No results found</p>
              ) : (
                results.users.length > 0 && (
                  <>
                    <p className="dropdown-title">Users</p>
                    {results.users.map((user) => (
                      <div
                        key={user._id}
                        className="dropdown-item"
                        onClick={() => handleGoToUser(user._id)}
                      >
                        <img
                          src={
                            user.profilePicture
                              ? `${BaseUrl}${user.profilePicture}`
                              : `https://ui-avatars.com/api/?name=${user.username}`
                          }
                          alt="avatar"
                        />
                        <span>{user.username}</span>
                      </div>
                    ))}
                  </>
                )
              )}

              {results.posts.length > 0 && (
                <>
                  <p className="dropdown-title">Posts</p>
                  {results.posts.map((post) => (
                    <div
                      key={post._id}
                      className="dropdown-item"
                      onClick={() => handleGoToPost(post._id)}
                    >
                      <span className="post-title">{post.title}</span>
                      <span className="post-content">
                        {post.content.slice(0, 30)}...
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        <ol className="buttons-list">
          <li>
            <RegisterButton />
          </li>
          <li>
            <LoginButton />
          </li>
        </ol>
      </nav>
    </div>
  );
}

export default Navbar;
