import "./peopleList.scss";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
import { getSocket } from "../socket";
export const ListOfPeople = ({
  people,
  isGlobal,
  setPeople,
  type,
  setIsGlobal,
  setFollowing,
}) => {
  const [tick, setTick] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const socket = getSocket();

  const formatLastSeen = (lastSeenDate) => {
    const diffMs = Date.now() - new Date(lastSeenDate).getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) {
      return `${diffSec} seconds ago`;
    }
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      return `${diffMin} minutes ago`;
    }
    const diffHours = Math.floor(diffMin / 60);
    return `${diffHours} hours ago`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (!socket) return;
    socket.on("userStatus", ({ userId, isOnline }) => {
      setPeople((prev) =>
        prev.map((person) =>
          person._id === userId ? { ...person, isOnline } : person
        )
      );
    });
  }, [socket]);
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
      {(!people || people.length === 0) && (
        <div>
          <em>No users found</em>
        </div>
      )}

      {people.map((person) => {
        const personId = person._id;
        const isFollowing = person.followers.includes(userId);

        const profilePictureUrl = person.profilePicture
          ? person.profilePicture.startsWith("http")
            ? person.profilePicture
            : `${BaseUrl}${person.profilePicture}`
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
              width="60"
              height="60"
              alt="Avatar"
              className={pictureClass}
              title="Avatar"
            />
            <div className="person-details">
              <div className="name-username">
                <p className="person-username">{person.username}</p>
                <p className="person-name">
                  {person.firstname} {person.lastname}
                </p>
              </div>
              {!person.isOnline ? (
                <div className="online-offline">
                  Offline 🔴 <p>Last seen: {formatLastSeen(person.lastSeen)}</p>
                </div>
              ) : (
                <div className="online-offline">Online 🟢</div>
              )}
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
                  navigate(`/userChat/${person._id}`);
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
