import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./Home.scss";
import PostList from "../components/allPosts";
import { useNavigate } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);

  const [followingPosts, setFollowingPosts] = useState([]);
  const [isGlobal, setIsGlobal] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    if (!token || !userId) return;
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error("Failed to fetch posts:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
      }
    };
    const fetchFollowingPosts = async () => {
      try {
        const response = await fetch(`/api/posts/followings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();

          setPosts(data);
        }
      } catch (error) {
        console.error("Error fething followings posts", error);
      }
    };

    isGlobal ? fetchPosts() : fetchFollowingPosts();
  }, [isGlobal, token]);

  return (
    <div className="home-page">
      <h1>Home</h1>

      <PostList
        posts={posts}
        setPosts={setPosts}
        setFollowingPosts={setFollowingPosts}
        setIsGlobal={setIsGlobal}
        isGlobal={isGlobal}
      />
    </div>
  );
}
export default Home;
