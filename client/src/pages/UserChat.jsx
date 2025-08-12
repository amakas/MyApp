import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Messages } from "../components/chat/messages";
import { initSocket, getSocket } from "../socket";
const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
export default function UserChat() {
  const [user, setUser] = useState({});
  const [me, setMe] = useState({});
  const [people, setPeople] = useState([]);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const { personId } = useParams();
  const [more, setMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [showDown, setShowDown] = useState(false);
  const [page, setPage] = useState(0);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);
  const messagesRef = useRef(null);
  const myusername = localStorage.getItem("username");
  const navigate = useNavigate();
  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        200;
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
    if (text === "") return;
    if (socket) {
      socket.emit("message", {
        content: text,
        username: myusername,
        senderId: userId,
        receiverId: personId,
      });
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
      const container = messagesRef.current;
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        50;
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
    const fetchMessages = async () => {
      if (!userId || !token) {
        navigate("/");
        return;
      }
      try {
        const response = await fetch(
          `/api/messages/${personId}?limit=50&page=0`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const msgs = data.map((msg) => {
          const { content, username, createdAt, updatedAt } = msg;
          const sendTime = new Date(createdAt).toLocaleTimeString("uk-UA", {
            hour12: false,
          });
          const isMine = username === myusername;
          return { content, username, sendTime, updatedAt, isMine };
        });
        setMessages(msgs);
        if (msgs.length <= 50) {
          setHasMoreMessages(false);
        }
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };
    fetchMessages();
  }, [personId, userId, token]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${personId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const user = await response.json();
          setUser(user);
        } else {
          console.error("Server error", error);
        }
      } catch (error) {
        console.error("Fail to fetch user");
      }
    };

    const fetchMe = async () => {
      try {
        const response = await fetch(`/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const me = await response.json();
          setMe(me);
        } else {
          console.error("Server error");
        }
      } catch (error) {
        console.error("Fail to fetch user", error);
      }
    };
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/users/messages`, {
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
    fetchUser();
    fetchMe();
  }, [userId, token, personId]);
  useEffect(() => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
          `/api/messages/${personId}?page=${nextPage}&limit=50`,
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
        if (data.length <= 50) {
          setHasMoreMessages(false);
        }
        const allMsgs = data;

        const msgs = allMsgs.map((msg) => {
          const { content, username, createdAt, updatedAt } = msg;
          const sendTime = new Date(createdAt).toLocaleTimeString("uk-UA", {
            hour12: false,
          });
          const isMine = username === myusername;
          return { content, username, sendTime, updatedAt, isMine };
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

  useEffect(() => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h1>Chat</h1>
        <h3>with {user.username}</h3>
      </div>
      <div className="main-box">
        <div className="people-box">
          <h2>Dialogs:</h2>
          <div className="people-chats">
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
          <h2>Chat</h2>

          <div className="display">
            <Messages
              messages={messages}
              messagesRef={messagesRef}
              showDown={showDown}
              setShowDown={setShowDown}
              handleClick={handleMore}
              hasMoreMessages={hasMoreMessages}
              messagesEndRef={messagesEndRef}
            />
          </div>
          <div className="message">
            <textarea
              rows={3}
              className="input-message"
              name="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleClick(e);
                }
              }}
              onChange={handleChange}
              value={text}
              placeholder="Your message..."
            />
            <button
              className={text === "" ? "disabled" : "send-message"}
              disabled={text === ""}
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
