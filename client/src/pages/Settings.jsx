import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import HomeButton from "../components/buttons/homeButton";
import "./Settings.scss"; // Assuming you have a CSS file for styling

function Settings(){
    
    const [data, setData] = useState(null);
    useEffect(() => {
        
        setTimeout(() => {
            setData({ message: "Hello from Home!" });
        }, 1000);
    }, []);
    return(
        <div className="settings-page">
            <h1>Settings</h1>
            <p>Configure your settings here</p>

            <HomeButton />

        </div>
    )
    
}
export default Settings;
