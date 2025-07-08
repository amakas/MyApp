import "./peopleList.scss";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export const ListOfPeople = ({ people, type }) => {
  const navigate = useNavigate();
  const [peopleState, setPeopleState] = useState(people);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    setPeopleState(people);
  }, [people]);
  return (
    <div className="people-list">
      {type === "people" && (
        <div className="h-container">
          <h2 className="choice">Global</h2>
          <h2 className="choice">Following</h2>
        </div>
      )}
      <label htmlFor="search">Search for people:</label>
      <input
        className="search-people"
        id="search"
        name="search"
        type="text"
        placeholder="Username"
      ></input>
      {peopleState.map((person) => {
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
          if (personId === userId) retrun;
          try {
            const response = await fetch(`/api/users/follow/${personId}`, {
              method: "PUT",
              headers: { Authorization: `Bearer ${token}` },
              body: JSON.stringify({ userId }),
            });
            if (response.ok) {
              setPeopleState((prev) =>
                prev.map((p) =>
                  p._id === personId
                    ? {
                        ...p,
                        followers: p.followers.includes(userId)
                          ? p.followers.filter((id) => id !== userId)
                          : [...p.followers, userId],
                      }
                    : p
                )
              );
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
              <p>{person.username}</p>
              <p>
                {person.firstname} {person.lastname}
              </p>{" "}
              <p>{person.bio}</p>
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
