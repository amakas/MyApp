import { useState } from "react";
import "./PostForm.scss";
import { useNavigate } from "react-router-dom";
export default function PostForm({ posts, setPosts }) {
  const username = localStorage.getItem("username");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    username: username,
    createdAt: null,
    likes: [],
    comments: 0,
    views: 0,
  });
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const { title, content } = formData;
    if (!title || !content) {
      return;
    }
    const date = new Date().toISOString();

    const postToSend = {
      ...formData,
      createdAt: date,
      likes: [],
      views: 0,
      shares: 0,
    };

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postToSend),
      });

      if (response.ok) {
        const data = await response.json();
        const { post } = data;
        setPosts((prev) => [post, ...prev]);

        setFormData({ title: "", content: "", username });
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  return (
    <section className="post-form">
      <h2>Create your post</h2>

      <div className="div-title">
        <label className="label-title" htmlFor="title">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="title input"
          placeholder="Some title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div className="div-content">
        <label className="label-content" htmlFor="content">
          Content:
        </label>
        <textarea
          id="content"
          name="content"
          className="content"
          placeholder="What's new"
          value={formData.content}
          onChange={handleChange}
        ></textarea>
      </div>
      <button className="post-button" onClick={handleSubmit}>
        Post
      </button>
    </section>
  );
}
