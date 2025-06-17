import React from "react";
import { useState } from "react";
import { useEffect } from "react";

function Register(){
    console.log("Chat rendered");
    const [data, setData] = useState(null);
    useEffect(() => {
        
        setTimeout(() => {
            setData({ message: "Hello from Home!" });
        }, 1000);
    }, []);
    return(
        <div>
            <h1>Registration</h1>
            <p>Welcome to the registration page!</p>
        </div>
    )
    
}
export default Register;