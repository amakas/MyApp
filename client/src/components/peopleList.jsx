import "./peopleList.scss";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export const ListOfPeople = ({
  people,
  isGlobal,
  setPeople,
  type,
  setIsGlobal,
  setFollowing,
}) => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  return (
    <div className="people-list">
      {type === "people" && (
        <div className="h-container">
          <h2
            className={`choice ${isGlobal ? "active" : ""}`}
            onClick={() => setIsGlobal(true)}
          >
            Global
          </h2>
          <h2
            className={`choice ${!isGlobal ? "active" : ""}`}
            onClick={() => setIsGlobal(false)}
          >
            Following
          </h2>
        </div>
      )}

      {people.map((person) => {
        const personId = person._id;
        const isFollowing = person.followers.includes(userId);

        const profilePictureUrl = person.profilePicture
          ? `${BaseUrl}${person.profilePicture}`
          : `https://ui-avatars.com/api/?name=${person.username}&background=1abc9c&color=ffffff&rounded=true&bold=true`;
        const pictureClass = person.profilePicture
          ? "picture"
          : "defaultPicture";
        const handleClick = () => {
          localStorage.setItem("personId", personId);
          navigate(`/userProfile/${personId}`);
        };
        const handleFollow = async (e, personId) => {
          e.stopPropagation();
          const token = localStorage.getItem("token");
          const userId = localStorage.getItem("userId");
          if (personId === userId) return;
          try {
            const response = await fetch(`/api/users/follow/${personId}`, {
              method: "PUT",
              headers: { Authorization: `Bearer ${token}` },
              body: JSON.stringify({ userId }),
            });
            if (response.ok) {
              const isCurrentlyFollowing = people
                .find((p) => p._id === personId)
                ?.followers.includes(userId);

              setPeople((prev) =>
                prev.map((p) =>
                  p._id === personId
                    ? {
                        ...p,
                        followers: isCurrentlyFollowing
                          ? p.followers.filter((id) => id !== userId)
                          : [...p.followers, userId],
                      }
                    : p
                )
              );

              setFollowing((prev) => {
                if (isCurrentlyFollowing) {
                  return prev.filter((p) => p._id !== personId);
                } else {
                  const newFollow = people.find((p) => p._id === personId);
                  if (newFollow) {
                    return [
                      ...prev,
                      {
                        ...newFollow,
                        followers: [...newFollow.followers, userId],
                      },
                    ];
                  } else {
                    return prev;
                  }
                }
              });
            } else {
              console.error("Fail to follow");
            }
          } catch (error) {
            console.error("Internal error", error);
          }
        };
        return (
          <div onClick={handleClick} className="people-item" key={person._id}>
            <img
              src={profilePictureUrl}
              width="70"
              height="70"
              alt="Avatar"
              className={pictureClass}
              title="Avatar"
            />
            <div className="person-details">
              <p className="person-username">{person.username}</p>
              <p className="person-name">
                {person.firstname} {person.lastname}
              </p>{" "}
              <p className="person-bio">{person.bio}</p>
            </div>
            <div>
              <button
                className={
                  isFollowing
                    ? "follow-button followed"
                    : "follow-button notfollowed"
                }
                onClick={(e) => handleFollow(e, person._id)}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>

              <button
                className="message-button"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Message
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
