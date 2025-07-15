import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostList.scss";

import Post from "../Post";

export default function PostList({ posts, setPosts }) {
  const userId = localStorage.getItem("userId");
  if (!posts || posts.length === 0) {
    return <div className="post-list">No posts available.</div>;
  }
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const { id } = useParams();

  const token = localStorage.getItem("token");

  const handleEditClick = (post) => {
    setEditingId(post._id);
    setEditedContent(post.content);
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editedContent }),
      });
      if (response.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post._id === id ? { ...post, content: editedContent } : post
          )
        );
        setEditingId(null);
        setEditedContent("");
      } else {
        alert("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setPosts((prev) => [...prev.filter((post) => post._id !== id)]);
        alert("Post deleted");
      } else {
        alert("Fail to delete post");
      }
    } catch (error) {
      console.error("Error deleting", error);
    }
  };

  const handleDeleteAll = async () => {
    confirm("Are you sure, you want to delete all your posts?");
    try {
      const response = await fetch(`/api/posts/deleteAll/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setPosts([]);
      }
    } catch (error) {
      console.error("Fail to delete posts", error);
    }
  };

  return (
    <div id="posts" className="post-list">
      <h2 className="user-posts-title">Posts</h2>
      {posts.map((post, index) => {
        const key = post._id || `temp-${index}`;
        if (!post._id) return null;
        return (
          <Post
            key={key}
            post={post}
            canEdit={id === userId}
            onDelete={handleDelete}
            onEdit={handleEditClick}
            onSave={handleSave}
            editingId={editingId}
            setEditingId={setEditingId}
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            setPosts={setPosts}
          />
        );
      })}
      <>
        {" "}
        {id === userId ? (
          <button onClick={handleDeleteAll} className="delete-all">
            Delete all posts
          </button>
        ) : (
          ""
        )}
      </>
    </div>
  );
}
