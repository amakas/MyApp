import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./navbar.scss"; // Assuming you have a CSS file for styling
import LoginButton from "./buttons/loginButton";
import RegisterButton from "./buttons/registerButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const id = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div>
      <nav className="navbar">
        <ol className="pages-list">
          <li>
            <Link to={`/home/${id}`}>Home</Link>{" "}
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
            {" "}
            <Link to={`/people/${id}`}>People</Link>
          </li>
        </ol>
        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Search"
          ></input>{" "}
          <FontAwesomeIcon className="glass" icon={faMagnifyingGlass} />
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
