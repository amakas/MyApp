import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.scss"; 
import PostList from "../components/allPosts";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
function Home(){
    const [posts, setPosts] = useState([])
    
    const navigate = useNavigate()
    const { id } = useParams();
    useEffect( () => {
        const fetchPosts = async () => {
        const token = localStorage.getItem('token')
        const id = localStorage.getItem('userId')
            if(!token){
                navigate("/")
                return
            }
        try{
        const response = await fetch(`/api/posts/${id}`, {
            headers:{
                'Authorization': `Bearer ${token}`
            }     
        });
        if(response.ok){
        const  data = await response.json();
        setPosts(data);
            }  else{
            console.error('Failed to fetch posts:', response.statusText)
            }
        } catch (error){
            console.error('Error fetching posts:', error);
        }
     }
     if(id) fetchPosts();
    }, [id]);

    return(
        <div className="home-page">
            <h1>Home Page</h1>
            <PostList  posts={posts}/>
        </div>
    )
    
}
export default Home;
