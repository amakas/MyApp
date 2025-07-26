import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import "./chat.scss";
import { initSocket, getSocket } from "../socket";
import { Messages } from "../components/chat/messages";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [text, setText] = useState("");
  const [page, setPage] = useState(0);
  const myusername = localStorage.getItem("username");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const messagesRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [people, setPeople] = useState([]);

  const token = localStorage.getItem("token");
  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!text) return;
    if (socket) {
      socket.emit("message", { content: text, username: myusername });
    }
    setText("");
  };

  useEffect(() => {
    let s = getSocket();
    if (!s) {
      s = initSocket(token);
    }
    setSocket(s);

    s.on("message", (data) => {
      const { content, username, createdAt, updatedAt } = data;
      let hours = new Date(createdAt).getHours();
      let minutes = new Date(createdAt).getMinutes();
      let seconds = new Date(createdAt).getSeconds();
      if (seconds.toString().length === 1) {
        seconds = "0" + seconds;
      }
      if (minutes.toString().length === 1) {
        minutes = "0" + minutes;
      }
      if (hours.toString().length === 1) {
        hours = "0" + hours;
      }
      const sendTime = `${hours}:${minutes}:${seconds}`;
      const isMine = username === myusername;
      setShouldScrollToBottom(true);
      setMessages((prev) => [
        ...prev,
        { content, username, sendTime: sendTime, updatedAt, isMine },
      ]);
    });

    return () => {
      s.off("message");
    };
  }, []);

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

  useEffect(() => {
    setLoading(true);
    const fetchMessages = async () => {
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const response = await fetch(`/api/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const allMsgs = data.filter((el) => !el.receiverId);

        const msgs = allMsgs.map((msg) => {
          const { content, username, createdAt, updatedAt } = msg;
          const sendTime = new Date(createdAt).toLocaleTimeString("uk-UA", {
            hour12: false,
          });
          const isMine = username === myusername;
          return { content, username, sendTime, updatedAt, isMine };
        });
        setMessages(msgs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };
    fetchMessages();
  }, [token]);

  useEffect(() => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-page">
      <h1>Global chat</h1>
      <div className="global-main-box">
        <div className="global-people-box">
          <div className="people-chats">
            <h2>Dialogs</h2>
            {people.map((person) => {
              return (
                <div
                  onClick={() => navigate(`/userChat/${person._id}`)}
                  key={person._id}
                  className="chat-people-item"
                >
                  <img
                    src={
                      person.profilePicture
                        ? person.profilePicture.startsWith("http")
                          ? person.profilePicture
                          : `${BaseUrl}${person.profilePicture}`
                        : `https://ui-avatars.com/api/?name=${person.username}`
                    }
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${person.username}`;
                    }}
                    alt="avatar"
                  />
                  <p>{person.username}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="messages-box">
          <div className="global-display">
            <Messages messages={messages} />
            <div ref={messagesEndRef}></div>
          </div>
          <div className="message">
            <textarea
              rows={3}
              className="global input-message"
              name="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleClick(e);
                }
              }}
              onChange={handleChange}
              value={text}
            />
            <button className="send-message" onClick={handleClick}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Chat;
