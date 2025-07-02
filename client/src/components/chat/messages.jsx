import './messages.scss'
export const Messages = ( {messages}) => {
return (
    <div className="message-list">
        {messages.map((message,i) => (
            <div key={i} className={message.isMine? "my-message":"someone-message"}>
                <div className="message-details">
                <p className="message-username">{message.username}</p>
                <p className="message-time">{message.sendTime}</p>
                </div>
                <p className="message-content">{message.content}</p>
                
                </div>
        ))  
        }
    </div>
)
}