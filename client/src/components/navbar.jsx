import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./navbar.scss"; // Assuming you have a CSS file for styling
import LoginButton from "./buttons/loginButton";
import RegisterButton from "./buttons/registerButton";


function Navbar(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const id = localStorage.getItem('userId');
    const [userId, setUserId] = useState(id);
    

    

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);
    
   
    return(
        <div >
            <nav className="navbar">
                <ol className="pages-list">
                    <li><Link to={`/home/${userId}`}>Home</Link> </li>
                    <li><Link to={`/chat/${userId}`}>Chat</Link></li>
                     <li><Link to={`/settings/${userId}`}>Settings</Link></li> 
                    <li><Link to={`/profile/${userId}`} >Profile</Link></li>
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