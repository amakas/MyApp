import ReportModal from "./ReportModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faComments,
  faShare,
  faHeart,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./Post.scss";
import { toast } from "react-toastify";

const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export default function Post({
  post,
  canEdit = false,
  onDelete,
  onEdit,
  onSave,
  editingId,
  setEditingId,
  editedContent,
  setEditedContent,
  setPosts,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [time, setTime] = useState(null);
  const postId = post._id;

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const postRef = useRef();
  const seenPosts = useRef(new Set());
  const handleComments = (e) => {
    e.stopPropagation();
    navigate(`/comments/${userId}/${postId}`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !seenPosts.current.has(post._id)) {
          seenPosts.current.add(post._id);
          try {
            await fetch(`/api/posts/view/${post._id}`, {
              method: "PUT",
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (err) {
            console.error("View count error:", err);
          }
        }
      },
      { threshold: 0.5 }
    );

    const current = postRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [post._id, token]);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/posts/like/${userId}/${postId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPosts((prev) =>
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
      toast.success("Report submitted!");
    } catch (err) {
      console.error("Error submitting report", err);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${postId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }

      const res = await fetch(`/api/posts/share/${postId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setPosts((prev) =>
          prev.map((p) =>
            p._id === post._id ? { ...p, shares: (p.shares || 0) + 1 } : p
          )
        );
      } else {
        console.error("Failed to share");
      }
    } catch (err) {
      console.error("Share error", err);
    }
  };
  useEffect(() => {
    if (post.createdAt) {
      const timeStamp = new Date(post.createdAt).toLocaleString();
      setTime(timeStamp);
    }
  }, [post.createdAt]);
  useEffect(() => {
    if (!postId) return;
    const getProfilePicture = async () => {
      try {
        const response = await fetch(`/api/users/post/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const user = await response.json();
          setProfilePicture(user.profilePicture);
        } else {
          console.error("server error");
        }
      } catch (err) {
        console.error("Fail to get profile picture", err);
      }
    };
    getProfilePicture();
  }, [postId]);
  const profilePictureUrl = profilePicture
    ? `${BaseUrl}${profilePicture}`
    : `https://ui-avatars.com/api/?name=${post.username}&background=1abc9c&color=ffffff&rounded=true&bold=true`;
  const pictureClass = profilePicture ? "picture" : "defaultPicture";

  const handleGoToUser = () => {
    const postUserId = post.userId;
    console.log(postUserId);
    navigate(`/userProfile/${postUserId}`);
  };
  return (
    <div className="post-item">
      <div className="post-header">
        <div className="user-info">
          <div onClick={handleGoToUser} className="usernameandphoto">
            <img
              src={profilePictureUrl}
              className={pictureClass}
              alt={post.username + " profile picture"}
              width={70}
              height={70}
            />
            <h2 className="post-username">{post.username}</h2>
          </div>

          <p className="timestamp">{time}</p>
        </div>
        <h2 className="post-title">{post.title}</h2>
      </div>
      <p className="post-content">{post.content}</p>

      {editingId === post._id ? (
        <>
          <textarea
            className="post-textarea"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button className="save-button" onClick={() => onSave(post._id)}>
            Save
          </button>
          <button className="cancel-button" onClick={() => setEditingId(null)}>
            Cancel
          </button>
        </>
      ) : (
        <div>
          {canEdit && (
            <>
              <button
                className="delete-button"
                onClick={() => onDelete(post._id)}
              >
                Delete
              </button>
              <button className="edit-button" onClick={() => onEdit(post)}>
                Edit
              </button>
            </>
          )}
        </div>
      )}
      <div className="stats">
        <button
          onClick={handleLike}
          className={post.likes?.includes(userId) ? "liked" : "notLiked"}
        >
          <FontAwesomeIcon className="like-icon" icon={faHeart} />
          {post.likes ? post.likes.length : 0}
        </button>
        <button onClick={handleComments} className="comments">
          <FontAwesomeIcon className="comments-icon" icon={faComments} />
          Comments
        </button>
        <p className="views">
          <FontAwesomeIcon icon={faEye} /> Views {post.views}
        </p>
        <button onClick={handleShare} className="share">
          <FontAwesomeIcon className="share-icon" icon={faShare} /> Share{" "}
          {post.shares}
        </button>
        <button onClick={(e) => handleReport(e, post._id)} className="report">
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
}
