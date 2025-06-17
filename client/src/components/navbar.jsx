import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./navbar.scss"; // Assuming you have a CSS file for styling
function Navbar(){
    console.log("Chat rendered");
    const [data, setData] = useState(null);
    useEffect(() => {
        
        setTimeout(() => {
            setData({ message: "Hello from Home!" });
        }, 1000);
    }, []);
    return(
        <div className="navbar">
            <nav>
                <ol>
                    <li><Link to="/">Home</Link> </li>
                    <li><Link to="/chat">Chat</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                </ol>
            </nav>
        </div>
    )
    
}
export default Navbar;