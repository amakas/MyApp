import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import HomeButton from "../components/buttons/homeButton";
import "./Settings.scss"; // Assuming you have a CSS file for styling

function Settings(){
    console.log("Home rendered");
    const [data, setData] = useState(null);
    useEffect(() => {
        
        setTimeout(() => {
            setData({ message: "Hello from Home!" });
        }, 1000);
    }, []);
    return(
        <div className="settings-page">
            <h1>Settings</h1>
            <HomeButton />
            
        </div>
    )
    
}
export default Settings;
