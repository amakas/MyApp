import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./navbar.scss"; // Assuming you have a CSS file for styling
import LoginButton from "./buttons/loginButton";
import RegisterButton from "./buttons/registerButton";
import Logo from "./logo";
function Navbar(){
    console.log("Chat rendered");
    const [data, setData] = useState(null);
    useEffect(() => {
        
        setTimeout(() => {
            setData({ message: "Hello from Home!" });
        }, 1000);
    }, []);
    return(
        <div >
            <nav className="navbar">
                <Logo />
                
                <ol className="pages-list">
                    <li><Link to="/">Home</Link> </li>
                    <li><Link to="/chat">Chat</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                </ol>
                <ol className="buttons-list">
                <li><RegisterButton /></li>
                <li><LoginButton /></li>
                </ol>
               
            </nav>
        </div>
    )
    
}
export default Navbar;