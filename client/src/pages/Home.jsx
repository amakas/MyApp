import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.scss"; // Assuming you have a CSS file for styling
function Home(){
    
    const [data, setData] = useState(null);
    useEffect(() => {
        
        setTimeout(() => {
            setData({ message: "Hello from Home!" });
        }, 1000);
    }, []);
    return(
        <div className="home-page">
            <h1>Home Page</h1>
            <p>Welcome to the home page!</p>
            <div><h2><Link to="/profile" >Go to profile</Link></h2></div>
            <div><h2><Link to="/chat" >Go to chat</Link></h2></div>

        </div>
    )
    
}
export default Home;
