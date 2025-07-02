import { useState } from "react";
import { useEffect } from "react";
import React from "react";
import "./User.scss";

export default function User({
  firstname,
  lastname,
  username,
  profilePicture,
  bio,
  email,
  location,
  phoneNumber,
  profession,
  followers,
  following,
  posts,
  pictureClass,
}) {
  const id = localStorage.getItem("userId");
  const [userData, setUserData] = useState(id);
  const postLength = posts.length;
  return (
    <section className="user-profile">
      <h1 className="profile-title">{username}'s Profile</h1>
      <div className="profile-header">
        <img
          src={profilePicture}
          width="130"
          height="130"
          alt="ProfilePicture"
          className={pictureClass}
          title="profile-picture"
        />
        <div className="name-bio">
          <h2 className="name">
            {firstname} {lastname}
          </h2>
          <p className="bio">Bio: {bio}</p>
        </div>
      </div>
      <div className="user-details">
        <p className="username">Username: {username}</p>
        <p className="email">Email: {email}</p>

        <p className="location">Location: {location}</p>
        <p className="number">Phone Number: {phoneNumber}</p>
        <p className="profession">Profession: {profession}</p>
      </div>
      <div className="user-stats">
        <p className="followers">Followers: {followers}</p>
        <p className="following">Following:{following}</p>
        <p className="posts">Posts: {postLength}</p>
      </div>
    </section>
  );
}
