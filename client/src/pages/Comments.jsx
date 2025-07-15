import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Comments.scss";
import BackButton from "../components/buttons/backButton";
export const Comments = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState({});
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const { postId } = useParams();
  const [time, setTime] = useState(null);

  const handleSubmit = async () => {
    if (!comment) return;
    try {
      const response = await fetch(`/api/comments/${userId}/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });
      if (response.ok) {
        const data = await response.json();
        const { newComment } = data;
        alert("Comment sent");
        setComments((prev) => [...prev, newComment]);
        setComment("");
      } else {
        console.error("server error");
      }
    } catch (error) {
      console.error("error sending", error);
    }
  };
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/post/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const post = await response.json();
          setPost(post);

          const time = new Date(post.createdAt).toLocaleString();
          setTime(time);
        } else {
          console.error("Server error");
        }
      } catch (error) {
        console.error("fail to fetch post", error);
      }
    };
    fetchPost();
  }, [postId, token]);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const comments = await response.json();

          setComments(comments);
        } else {
          console.error("server error");
        }
      } catch (error) {
        console.error("fail to fetch comments", error);
      }
    };
    fetchComments();
  }, [postId, token]);
  return (
    <div className="comments-page">
      <BackButton />

      <div className="post-box">
        <div className="post-header">
          <div className="user-info">
            <h2 className="post-username">{post.username}</h2>
            <p className="timestamp">{time}</p>
          </div>
          <h3 className="post-title">{post.title}</h3>
        </div>
        <p className="post-content">{post.content}</p>
      </div>
      <h2 className="comments-heading">Comments</h2>
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">No comments yet</div>
        ) : (
          comments.map((comment) => {
            const commentTime = new Date(comment.createdAt).toLocaleString();
            return (
              <div className="comment-item" key={comment._id}>
                <div className="comment-header">
                  <h4 className="comment-username">{comment.username}</h4>
                  <p className="timestamp">{commentTime}</p>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            );
          })
        )}
      </div>

      <div className="comment-send">
        <textarea
          className="comment-textarea"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="send-button" onClick={handleSubmit}>
          Send
        </button>
      </div>
    </div>
  );
};
