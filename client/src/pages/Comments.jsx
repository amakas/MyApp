import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Comments.scss";

export const Comments = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const { postId } = useParams();

  const handleSubmit = async () => {
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
        alert("Comment send");
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
      <h1>Comments</h1>
      {comments.length === 0 ? (
        <div>No comments</div>
      ) : (
        comments.map((comment) => (
          <div className="comment-item" key={comment._id}>
            <h4 className="username-h">{comment.username}</h4>
            <p className="comment-content">{comment.text}</p>
          </div>
        ))
      )}
      <div className="comment-send">
        <textarea
          className="comment-text"
          placeholder="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
};
