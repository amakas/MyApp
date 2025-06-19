import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import './Login.scss'; // Assuming you have a CSS file for styling

function Login(){
    console.log("Chat rendered");
    const [data, setData] = useState(null);
    useEffect(() => {
        
        setTimeout(() => {
            setData({ message: "Hello from Home!" });
        }, 1000);
    }, []);
    return(
        <div className="login-page">
            <h1>Login</h1>
            <p>Please login</p>
            <form onSubmit={(e) => {
                e.preventDefault();
                // Handle login logic here
                console.log("Login form submitted");
            }}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Login</button>

            </form>
        </div>
    )
    
}
export default Login;