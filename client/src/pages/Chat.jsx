import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import "./chat.scss"; 
import { initSocket, getSocket } from "../socket";
import { Messages } from "../components/chat/messages";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function Chat(){
    const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [text, setText] = useState("");
  const [page, setPage] = useState(0)
  const myusername = localStorage.getItem('username')
   const messagesEndRef = useRef(null);
   const navigate = useNavigate();
   const messagesRef = useRef(null);
   const [loading, setLoading] = useState(false);
   const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);


  const handleChange = (e) => {
    setText(e.target.value)
  }

  const handleClick = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit('message', {content:text, username:myusername});
    }
    setText("");
  }
  

useEffect(() => {
  const s = initSocket();
  setSocket(s);

  s.on('connect', () => {
    console.log('Connected to socket:', s.id);
  });
  s.on('message', (data)=>{
    const {content, username, createdAt, updatedAt} = data;
    let hours = new Date(createdAt).getHours();
    let minutes = new Date(createdAt).getMinutes();
    let seconds = new Date(createdAt).getSeconds();
    if(seconds.toString().length===1){
      seconds = "0" + seconds;
    }
    if(minutes.toString().length===1){
      minutes = "0" + minutes;
    }
    if(hours.toString().length===1){
      hours = "0" + hours;
    }
    const sendTime = `${hours}:${minutes}:${seconds}`
    const isMine = username===myusername
    setShouldScrollToBottom(true)
    setMessages(prev => [...prev, {content, username, sendTime:sendTime, updatedAt, isMine}])
    console.log(messages.length, messages[0].sendTime)
  })

  return () => {
    s.off('message');
    s.off('connect');    
  };
}, []);

useEffect(()=>{
  
  const fetchMessages = async () => {
    const id = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if(!id || !token){
      navigate('/');
            return;
    }
   try{
      const response = await fetch(`/api/messages`, {
        headers: {
                    'Authorization': `Bearer ${token}`
                }
      });
      const data = await response.json();
      const msgs = data.map(msg => {
  const { content, username, createdAt, updatedAt } = msg;
  const sendTime = new Date(createdAt).toLocaleTimeString('uk-UA', { hour12: false });
  const isMine = username === myusername;
  return { content, username, sendTime, updatedAt, isMine };
});
  setMessages(msgs);

   }  catch(error){
    console.error('Error fetching messages', error)
   }
  }
   fetchMessages();
   
}, []);

  useEffect(() => {
  if (shouldScrollToBottom) {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]);


    return(
        <div className="chat-page">
            <h1>Chat</h1>
            <p>Global chat</p>
            <div className="display"> 
              <Messages messages={messages}/>
              <div ref={messagesEndRef}></div>
            </div>
            <div className="message">
              <textarea rows="3" className="input-message"  name="text" onKeyDown={(e)=>{if(e.key==='Enter') {
               e.preventDefault();
               handleClick(e);
              }
              }} onChange={handleChange} value={text}/>
              <button className="send-message" onClick={handleClick}>Send</button>
            </div>
            
        </div>
    )
    
}
export default Chat;
