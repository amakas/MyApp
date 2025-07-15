import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.scss";
import PostList from "../components/allPosts";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Loader from "../components/loader";
function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [isGlobal, setIsGlobal] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const response = await fetch(`/api/posts/${userId}`, {
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
        setIsLoading(false);
      }
    };
    const fetchFollowingPosts = async () => {
      try {
        const response = await fetch(`/api/posts/followings/${userId}`, {
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

    if (id) isGlobal ? fetchPosts() : fetchFollowingPosts();
  }, [id, isGlobal]);
  if (isLoading) return <Loader />;
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
