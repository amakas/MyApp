import React, { useState, useEffect } from "react";
import "./allPosts.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faComments,
  faShare,
  faHeart,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ReportModal from "./ReportModal";

export default function PostList({ posts }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [postsState, setPostsState] = useState(posts);

  useEffect(() => {
    setPostsState(posts);
  }, [posts]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!posts || posts.length === 0) {
    return <div className="post-list">No posts available.</div>;
  }

  return (
    <div className="post-list">
      <div className="h-container">
        <h2 className="choice">Global</h2>
        <h2 className="choice">Following</h2>
      </div>

      {postsState.map((post) => {
        const postId = post._id;

        let comments = 0;
        let views = 100;

        const handleComments = (e) => {
          e.stopPropagation();
          navigate(`/comments/${userId}/${postId}`);
        };

        const handleLike = async (e) => {
          e.stopPropagation();
          try {
            const res = await fetch(`/api/posts/${userId}/${postId}`, {
              method: "PUT",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              setPostsState((prev) =>
                prev.map((p) =>
                  p._id === postId
                    ? {
                        ...p,
                        likes: p.likes.includes(userId)
                          ? p.likes.filter((id) => id !== userId)
                          : [...p.likes, userId],
                      }
                    : p
                )
              );
            } else {
              console.error("Server error");
            }
          } catch (error) {
            console.error("Fail to like", error);
          }
        };

        const handleReport = (e, postId) => {
          e.stopPropagation();
          setSelectedPostId(postId);
          setIsModalOpen(true);
        };

        const handleModalSubmit = async (reason) => {
          const token = localStorage.getItem("token");
          try {
            await fetch(`/api/posts/report/${selectedPostId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ reason }),
            });
            alert("Report submitted!");
          } catch (err) {
            console.error("Error submitting report", err);
          }
        };

        const handleShare = async (e) => {
          e.stopPropagation();
          const url = `${window.location.origin}/post/${postId}`;

          if (navigator.share) {
            try {
              await navigator.share({
                title: post.title,
                text: post.content,
                url: url,
              });
            } catch (err) {
              console.error("Share failed", err);
            }
          } else {
            try {
              await navigator.clipboard.writeText(url);
              alert("Link copied to clipboard");
            } catch (err) {
              console.error("Clipboard failed", err);
            }
          }
          try {
            const res = await fetch(`/api/posts/share/${postId}`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (res.ok) {
              setPostsState((prev) =>
                prev.map((p) =>
                  p._id === post._id ? { ...p, shares: p.shares + 1 } : p
                )
              );
            } else {
              console.error("Failed to share");
            }
          } catch (err) {
            console.error("Share error", err);
          }
        };
        return (
          <div key={post._id} className="post-item">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div className="stats">
              <button
                onClick={handleLike}
                className={post.likes.includes(userId) ? "liked" : "notLiked"}
              >
                <FontAwesomeIcon className="like-icon" icon={faHeart} />
                {post.likes.length}
              </button>
              <button onClick={handleComments} className="comments">
                <FontAwesomeIcon className="comments-icon" icon={faComments} />
                Comments
              </button>
              <p className="views">
                <FontAwesomeIcon icon={faEye} /> Views {views}
              </p>
              <button onClick={handleShare} className="share">
                <FontAwesomeIcon className="share-icon" icon={faShare} />{" "}
                {post.shares}
              </button>
              <button
                onClick={(e) => handleReport(e, post._id)}
                className="report"
              >
                <FontAwesomeIcon className="report-icon" icon={faFlag} />
                Report
              </button>
            </div>
            <ReportModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleModalSubmit}
            />
          </div>
        );
      })}
    </div>
  );
}
