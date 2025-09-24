import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import "./Chat.scss";
import { initSocket, getSocket } from "../socket";
import { Messages } from "../components/chat/messages";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const BaseUrl = "https://toka-o14g.onrender.com";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [text, setText] = useState("");
  const [page, setPage] = useState(0);
  const myusername = localStorage.getItem("username");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const messagesRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [people, setPeople] = useState([]);
  const [more, setMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [showDown, setShowDown] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        400;
      setShowDown(!isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);
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
      const container = messagesRef.current;
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        50;

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
      if (isAtBottom) {
        setShouldScrollToBottom(true);
        setShowDown(false);
      }
      if (!isAtBottom && !isMine) {
        setShouldScrollToBottom(false);
        setShowDown(true);
      }

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
    const fetchMessages = async () => {
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const response = await fetch(`/api/messages?page=0&limit=100`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const allMsgs = data.filter((el) => !el.receiverId);

        const msgs = allMsgs.map((msg) => {
          const { content, username, createdAt, updatedAt } = msg;
          const dateObj = new Date(createdAt);

          const sendTime = dateObj.toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);

          const isToday = dateObj.toDateString() === today.toDateString();
          const isYesterday =
            dateObj.toDateString() === yesterday.toDateString();

          let dateLabel;
          if (isToday) {
            dateLabel = "Today";
          } else if (isYesterday) {
            dateLabel = "Yesterday";
          } else {
            const day = String(dateObj.getDate()).padStart(2, "0");
            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            dateLabel = `${day}.${month}`;
          }

          const formattedDate = `${sendTime}, ${dateLabel}`;
          const isMine = username === myusername;
          return {
            content,
            username,
            sendTime: formattedDate,
            updatedAt,
            isMine,
          };
        });
        setMessages(msgs);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };
    fetchMessages();
  }, [token]);

  useEffect(() => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "auto",
      });
    }
  }, [messages]);
  const handleMore = () => {
    setMore(true);
  };

  useEffect(() => {
    if (!more || !hasMoreMessages) return;

    const fetchOlderMessages = async () => {
      const nextPage = page + 1;
      setShouldScrollToBottom(false);
      const container = messagesRef.current;
      const scrollHeightBefore = container.scrollHeight;

      try {
        const response = await fetch(
          `/api/messages?page=${nextPage}&limit=50`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.length === 0) {
          setHasMoreMessages(false);
          return;
        }
        if (data.length < 30) {
          setHasMoreMessages(false);
        }
        const allMsgs = data.filter((el) => !el.receiverId);

        const msgs = allMsgs.map((msg) => {
          const { content, username, createdAt, updatedAt } = msg;
          const dateObj = new Date(createdAt);

          const sendTime = dateObj.toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);

          const isToday = dateObj.toDateString() === today.toDateString();
          const isYesterday =
            dateObj.toDateString() === yesterday.toDateString();

          let dateLabel;
          if (isToday) {
            dateLabel = "Today";
          } else if (isYesterday) {
            dateLabel = "Yesterday";
          } else {
            const day = String(dateObj.getDate()).padStart(2, "0");
            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            dateLabel = `${day}.${month}`;
          }

          const formattedDate = `${sendTime}, ${dateLabel}`;
          const isMine = username === myusername;
          return {
            content,
            username,
            sendTime: formattedDate,
            updatedAt,
            isMine,
          };
        });

        setMessages((prev) => [...msgs, ...prev]);
        setPage(nextPage);
        requestAnimationFrame(() => {
          const scrollHeightAfter = container.scrollHeight;
          container.scrollTop = scrollHeightAfter - scrollHeightBefore;
        });
      } catch (error) {
        console.error("Error fetching messages", error);
      } finally {
        setMore(false);
      }
    };
    fetchOlderMessages();
  }, [more, myusername]);

  return (
    <div className="chat-page">
      <h1>Global Chat</h1>
      <div className="main-box">
        <div className="global-people-box">
          <div className="people-chats">
            <h2>Dialogs:</h2>
            {people.map((person) => {
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
                  <img
                    src={profilePicture}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${person.username}`;
                    }}
                    alt="avatar"
                  />
                  <p className="person-username">{person.username}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="messages-box">
          <div className="global-display">
            <Messages
              messagesRef={messagesRef}
              messages={messages}
              messagesEndRef={messagesEndRef}
              handleClick={handleMore}
              hasMoreMessages={hasMoreMessages}
              showDown={showDown}
              setShowDown={setShowDown}
            />
          </div>
          <div className="message">
            <textarea
              className="global input-message input"
              name="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleClick(e);
                }
              }}
              onChange={handleChange}
              value={text}
              autoFocus
              placeholder="Your message..."
            />
            <button
              className={text === "" ? "disabled" : "send-message"}
              onClick={handleClick}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Chat;
