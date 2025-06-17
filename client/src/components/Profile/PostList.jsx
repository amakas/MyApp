import React from 'react';

export default function PostList({ posts, onPostClick }) {
    if (!posts || posts.length === 0) {
        return <div className="post-list">No posts available.</div>;
    }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <div
          key={post.id}
          className="post-item"
          onClick={() => onPostClick(post.id)}
        >
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}