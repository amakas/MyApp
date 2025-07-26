import React, { use } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import User from "../components/Profile/User";
import PostForm from "../components/Profile/PostForm";
import PostList from "../components/Profile/PostList";
import "./Profile.scss";
import { useNavigate } from "react-router-dom";
const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
function UserProfile() {
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const profilePictureUrl = userData.profilePicture
    ? userData.profilePicture.startsWith("http")
      ? userData.profilePicture
      : `${BaseUrl}${userData.profilePicture}`
    : `https://ui-avatars.com/api/?name=${userData.username}&background=1abc9c&color=ffffff&rounded=true&bold=true`;
  const pictureClass = userData.profilePicture ? "picture" : "defaultPicture";
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !id) {
        navigate("/");
        return;
      }

      const response = await fetch(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        setUserData(data);
      } else {
        navigate("/");
      }
    };
    const fetchPosts = async () => {
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const response = await fetch(`/api/posts/user/${id}`, {
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
      }
    };

    if (userId) fetchUserData();
    if (userId) fetchPosts();
  }, [userId]);

  return (
    <div className="profile-page">
      <User
        firstname={userData.firstname}
        lastname={userData.lastname}
        username={userData.username}
        profilePicture={profilePictureUrl}
        bio={userData.bio}
        email={userData.email}
        location={userData.location}
        phoneNumber={userData.phoneNumber}
        profession={userData.profession}
        followersArr={userData.followers}
        followingArr={userData.following}
        posts={posts}
        pictureClass={pictureClass}
      />

      <PostList posts={posts} setPosts={setPosts} />
    </div>
  );
}
export default UserProfile;
