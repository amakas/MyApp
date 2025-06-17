import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import HomeButton from "../components/button";
function Chat(){
    console.log("Chat rendered");
    const [data, setData] = useState(null);
    useEffect(() => {
        
        setTimeout(() => {
            setData({ message: "Hello from Home!" });
        }, 1000);
    }, []);
    return(
        <div>
            <h1>Chat</h1>
            <p>Welcome to the chat</p>
            <HomeButton />
        </div>
    )
    
}
export default Chat;