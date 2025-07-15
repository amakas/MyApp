import React, { useState, useEffect } from "react";
import "./allPosts.scss";

import { useNavigate } from "react-router-dom";

import Post from "./Post";

export default function PostList({
  posts,
  setPosts,
  isGlobal,
  setIsGlobal,
  setFollowingPosts,
}) {
  return (
    <div className="post-list">
      <div className="h-container">
        <h2
          className={`choice ${isGlobal ? "active" : ""}`}
          onClick={() => setIsGlobal(true)}
        >
          Global
        </h2>
        <h2
          className={`choice ${!isGlobal ? "active" : ""}`}
          onClick={() => setIsGlobal(false)}
        >
          Following
        </h2>
      </div>

      {posts.length === 0 || !posts ? (
        <div className="no-posts">No available posts</div>
      ) : (
        posts.map((post) => {
          return (
            <Post
              key={post._id}
              post={post}
              setPosts={setPosts}
              setFollowingPosts={setFollowingPosts}
            />
          );
        })
      )}
    </div>
  );
}
