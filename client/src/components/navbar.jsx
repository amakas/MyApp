import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./navbar.scss";
import LogoutButton from "./buttons/logoutButton";
import RegisterButton from "./buttons/registerButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import logo from "../imgs/logo.png";
const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState({ users: [], posts: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [me, setMe] = useState("");
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const getPreferredTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };
  const [theme, setTheme] = useState(getPreferredTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const token = localStorage.getItem("token");
  const location = useLocation();

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
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleClickOut = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOut);
    return () => document.removeEventListener("click", handleClickOut);
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
    navigate(`/comments/${postId}`);
    setShowDropdown(false);
    setSearchQuery("");
  };
  useEffect(() => {
    const fethMe = async () => {
      try {
        const response = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const me = await response.json();
          setMe(me);
        }
      } catch (err) {
        console.error("Fail to fetch me", err);
      }
    };
    fethMe();
  }, [token]);

  return (
    <div className="nav-header">
      <div ref={open ? navRef : null}>
        <div className="logo-me">
          <button
            className={`burger ${open ? "" : ""}`}
            onClick={() => setOpen(!open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="logo">
            <img src={logo} alt="Logo" />
            <p className="app-name">Toka</p>
          </div>
        </div>
        <nav className={`menu ${open ? "show" : "closing"}`}>
          <ol className="pages-list">
            <button
              className={`burger ${open ? "open" : ""}`}
              onClick={() => setOpen(!open)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <li className={location.pathname === "/home" ? "active" : ""}>
              <Link to={`/home`}>Home</Link>
            </li>

            <li className={location.pathname === "/profile" ? "active" : ""}>
              <Link to={`/profile`}>Profile</Link>
            </li>
            <li className={location.pathname === "/people" ? "active" : ""}>
              <Link to={`/people`}>People</Link>
            </li>
            <li className={location.pathname === "/chat" ? "active" : ""}>
              <Link to={`/chat`}>Chat</Link>
            </li>
            <li className={location.pathname === "/dialogs" ? "active" : ""}>
              <Link to={`/dialogs`}>Dialogs</Link>
            </li>
            <li className={location.pathname === "/settings" ? "active" : ""}>
              <Link to={`/settings`}>Settings</Link>
            </li>
          </ol>
          <LogoutButton />
        </nav>
      </div>

      <div className="search-bar" ref={searchRef}>
        <input
          className="search-input input"
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

      <div className="buttons-list">
        <button className="toggle-theme" onClick={toggleTheme}>
          {theme === "dark" ? "🌞" : "🌙"}
        </button>
      </div>
    </div>
  );
}

export default Navbar;
