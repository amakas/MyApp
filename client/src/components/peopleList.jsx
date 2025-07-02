import "./peopleList.scss";
import React from "react";
import { useNavigate } from "react-router-dom";
const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export const ListOfPeople = ({ people }) => {
  const navigate = useNavigate();

  return (
    <div className="people-list">
      <div className="h-container">
        <h2 className="choice">Global</h2>
        <h2 className="choice">Follows</h2>
      </div>
      <label for="search">Search for people:</label>
      <input
        className="search-people"
        id="search"
        name="search"
        type="text"
        placeholder="Username"
      ></input>
      {people.map((person) => {
        const personId = person._id;
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
                className="follow-button"
                onClick={(e) => {
                  e.stopPropagation();
                  // твоя логіка
                }}
              >
                Follow
              </button>
              <button
                className="message-button"
                onClick={(e) => {
                  e.stopPropagation();
                  // твоя логіка
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
