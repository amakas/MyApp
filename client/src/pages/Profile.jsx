import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import User from "../components/Profile/User";
import PostForm from "../components/Profile/PostForm";
import PostList from "../components/Profile/PostList";

function Profile(){
    console.log("Home rendered");
    const [data, setData] = useState(null);
    useEffect(() => {
        
        setTimeout(() => {
            setData({ message: "Hello from Home!" });
        }, 1000);
    }, []);
    return(
        <div className="profile-page">
             
            <User firstname="Maks" lastname="Yasaddas"  username="makson" profilePicture="https://lh4.googleusercontent.com/NmT2y1afsx282HAx3j6ir2HobpAb94KdZags9majVc8g1peNNmjEvkTl_Xu2H051o6vM2UBwytZYRIWNj91TMdS124gKqtZECQqTLT5TtiSViXPKKVmYQafUcAJuzFrzEVCNoDrdsqIq2NRxuKawVbuRN7CcAfQk0iGIHQEaeFzEfX1xH5uA-g=w1280" bio="Sample bio" email="email@.com" location="Americaa" phoneNumber="2342352524124" profession="designer" followers="100" following="50" posts="10"/>
            <PostForm />
            <PostList posts={[{id:1, title:"Post 1", content:"Content of post 1"}, {id:2, title:"Post 2", content:"Content of post 2"}]} onPostClick={(id) => console.log("Post clicked:", id)} />
            
        </div>
    )
    
}
export default Profile;
