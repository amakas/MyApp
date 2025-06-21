import React, { use } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import User from "../components/Profile/User";
import PostForm from "../components/Profile/PostForm";
import PostList from "../components/Profile/PostList";
import "./Profile.scss"; // Assuming you have a CSS file for styling
import { useNavigate } from "react-router-dom";
const BaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
function Profile(){
    
    const [userData, setUserData] = useState("");
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [posts, setPosts] = useState([])

    const profilePictureUrl = userData.profilePicture 
  ? `${BaseUrl}${userData.profilePicture}` 
  : null;



    useEffect(() => {
    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('userId');
        
        if (!token || !id) {
            navigate('/');
            return;
        }
        
        const response = await fetch(`/api/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
           
            setUserData(data);
        } else {
           navigate('/');
        }
    };
    const fetchPosts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        try {
            const response = await fetch(`/api/posts/post/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                
                setPosts(data);

            } else {
                console.error('Failed to fetch posts:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };
    
    if (id) fetchUserData(); 
     if (id) fetchPosts();
}, [id]);
  
    return(
        <div className="profile-page">
            <User firstname={userData.firstname} lastname={userData.lastname}  username={userData.username} profilePicture={profilePictureUrl} bio={userData.bio} email={userData.email} location={userData.location} phoneNumber={userData.phoneNumber} profession={userData.profession} followers={userData.followers} following={userData.following} posts={userData.posts}/>
            <PostForm setPosts={setPosts}/>
            <PostList posts={posts}  />
            
        </div>
    )
    
}
export default Profile;
