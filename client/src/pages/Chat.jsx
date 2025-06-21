import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import HomeButton from "../components/buttons/homeButton";
import "./chat.scss"; // Assuming you have a CSS file for styling
function Chat(){
    
    const [data, setData] = useState(null);
    useEffect(() => {
        
        setTimeout(() => {
            setData({ message: "Hello from Home!" });
        }, 1000);
    }, []);
    return(
        <div className="chat-page">
            <h1>Chat</h1>
            <p>Welcome to the chat</p>
            <HomeButton />
        </div>
    )
    
}
export default Chat;