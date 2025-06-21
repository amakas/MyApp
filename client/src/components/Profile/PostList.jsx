import React from 'react';

export default function PostList({ posts }) {
    if (!posts || posts.length === 0) {
        return <div className="post-list">No posts available.</div>;
    }
    if (!Array.isArray(posts)) {
        console.error("Expected posts to be an array, but got:", posts);
        return <div className="post-list">Error: Invalid posts data.</div>;
    }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <div
          key={post.id || post._id}
          className="post-item"
          >
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}