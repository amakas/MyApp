import React from "react";
import "./EditProfile.scss";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
export default function EditProfile() {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    bio: "",
    email: "",
    location: "",
    phoneNumber: "",
    profession: "",
  });

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [existingProfilePicture, setExistingProfilePicture] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          setFormData({
            username: user.username || "",
            firstname: user.firstname || "",
            lastname: user.lastname || "",
            bio: user.bio || "",
            email: user.email || "",
            location: user.location || "",
            phoneNumber: user.phoneNumber || "",
            profession: user.profession || "",
          });
          setExistingProfilePicture(user.profilePicture || "");
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [userId, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePictureFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();

    for (let key in formData) {
      dataToSend.append(key, formData[key]);
    }

    if (profilePictureFile) {
      dataToSend.append("profilePicture", profilePictureFile);
    }
    try {
      const response = await fetch(`/api/users`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });
      const data = await response.json();
      if (response.ok) {
        alert("Profile updated successfully!");
        localStorage.setItem("username", data.username);
        navigate(`/profile`);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile");
    }
  };

  return (
    <div className="edit-profile">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="edit-picture">
          <label htmlFor="profile-picture">Profile Picture:</label>
          <img
            src={
              existingProfilePicture.startsWith("http")
                ? existingProfilePicture
                : `${BaseUrl}${existingProfilePicture}`
            }
            className="picture"
            width={100}
            height={100}
          ></img>
          <input
            type="file"
            id="profile-picture"
            name="profilePicture"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <div className="edit-details">
          <label htmlFor="firstname">First Name:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
          <label htmlFor="lastname">Last Name:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            cols="50"
            value={formData.bio}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="edit-details">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div className="edit-details">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <label htmlFor="profession">Profession:</label>
          <input
            type="text"
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
