import React from "react";
import { useState } from "react";
import { useEffect } from "react";

function Home(){

    const [data, setData] = useState(null);
    useEffect(() => {
        
        setTimeout(() => {
            setData({ message: "Hello from Home!" });
        }, 1000);
    }, []);
    return(
        <div>
            <h1>Home Page</h1>
            <p>Welcome to the home page!</p>s
        </div>
    )
}
export default Home;
