import { useState } from "react";
import { useEffect } from "react";
import React from "react";
import "./User.scss";
import { useNavigate, useParams } from "react-router-dom";

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
  followersArr = [],
  followingArr = [],
  posts = [],
  pictureClass,
}) {
  const navigate = useNavigate();

  let { id } = useParams();
  if (!id) id = localStorage.getItem("userId");

  const postLength = posts.length;
  const followers = followersArr.length;
  const following = followingArr.length;
  const handleFollowers = () => {
    navigate(`/followers/${id}`);
  };
  const handleFollowing = () => {
    navigate(`/following/${id}`);
  };
  return (
    <section className="user-profile">
      <h1 className="profile-title">{username}</h1>
      <div className="profile-header">
        <img
          src={profilePicture}
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${userData.username}`;
          }}
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

        <p className="location">Location: {location}</p>
        <p className="number">Phone Number: {phoneNumber}</p>
        <p className="profession">Profession: {profession}</p>
        <p className="email">Email: {email}</p>
      </div>

      <div className="user-stats">
        <p onClick={handleFollowers} className="followers">
          Followers: {followers}
        </p>
        <p onClick={handleFollowing} className="following">
          Following:{following}
        </p>
        <a href="#posts">
          <p className="posts">Posts: {postLength}</p>
        </a>
      </div>
    </section>
  );
}
