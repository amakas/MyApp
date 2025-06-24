import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import HomeButton from "../components/buttons/homeButton";

import { useNavigate } from "react-router-dom";
import "./Settings.scss"; 
import EditPorfile from "../components/Profile/EditProfile";
function Settings(){
    
    const navigate = useNavigate()
    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const confirmed = window.confirm("Are you sure? this is irreversible")
        if(confirmed){
        try{
            const response = await fetch(`/api/users/${userId}`, {
                method:"DELETE",
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            if(response.ok){
                alert('Account successfully deleted');
                localStorage.clear()
                navigate('/', {replace:true});
                
            }   else {
                alert("Fail to delete account")
            }
        }   catch(error){
            console.error("Error deleting account:", error)
        }
    } 
    }
   
    return(
        <div className="settings-page">
            <h1>Settings</h1> 
            <EditPorfile />  
            <button onClick={handleDelete}>Delete accaunt</button>    
            <HomeButton />
        </div>
    )
    
}
export default Settings;
