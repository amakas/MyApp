import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dialogs.scss";
const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
export default function Dialogs() {
  const [people, setPeople] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
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
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/users/messages/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const users = await response.json();
          setPeople(users);
        }
      } catch (error) {
        console.error("Fail to fetch users", error);
      }
    };
    fetchUsers();
  }, [token]);
  return (
    <div className="dialogs-page">
      <h1>Dialogs</h1>
      <div className="people-dialogs">
        <h2>My dialogs:</h2>
        {people.map((person) => {
          if (people.length === 0 || !people) return <div>No dialogs yet</div>;
          const profilePicture = person.profilePicture
            ? person.profilePicture.startsWith("http")
              ? person.profilePicture
              : `${BaseUrl}${person.profilePicture}`
            : `https://ui-avatars.com/api/?name=${person.username}`;
          return (
            <div
              onClick={() => navigate(`/userChat/${person._id}`)}
              key={person._id}
              className="chat-people-item"
            >
              <div className="pers-details">
                <img
                  src={profilePicture}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${person.username}`;
                  }}
                  alt="avatar"
                />
                <p>{person.username}</p>
              </div>
              <div className="other">
                {!person.isOnline ? (
                  <div className="online-offline">
                    Offline 🔴{" "}
                    <p className="last-seen">
                      Last seen: {formatLastSeen(person.lastSeen)}
                    </p>
                  </div>
                ) : (
                  <div className="online-offline">Online 🟢</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
