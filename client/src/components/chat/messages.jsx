import "./messages.scss";
export const Messages = ({
  messages,
  messagesEndRef,
  handleClick,
  hasMoreMessages,
  messagesRef,
  showDown,
  setShowDown,
}) => {
  return (
    <div className="message-list" ref={messagesRef}>
      {hasMoreMessages && (
        <button className="old-messages" onClick={handleClick}>
          Show more messages
        </button>
      )}

      {messages.map((message, i) => (
        <div
          key={i}
          className={message.isMine ? "my-message" : "someone-message"}
        >
          <div className="message-details">
            <p className="message-username">{message.username}</p>
            <p className="message-time">{message.sendTime}</p>
          </div>
          <p className="message-content">{message.content}</p>
        </div>
      ))}
      {showDown && (
        <button
          className="new-messages"
          onClick={() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setShowDown(false);
          }}
        >
          New messages
        </button>
      )}
      <div ref={messagesEndRef}></div>
    </div>
  );
};
