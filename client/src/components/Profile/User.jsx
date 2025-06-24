import {useState} from 'react';
import {useEffect} from 'react';
import React from 'react';
import './User.scss'; // Import your styles for User component

export default function User({firstname, lastname, username, profilePicture, bio, email, location, phoneNumber, profession, followers, following, posts=0}) {
    const id = localStorage.getItem('userId');
    const [userData, setUserData] = useState(id);
    return (
        
        <section className="user-profile">
            <h1 className="profile-title">{username}'s Profile</h1>
            <div className="profile-header">
                
            <img src={profilePicture} width="100" height="100" alt="ProfilePicture" className="picture" title="profile-picture"/>
            <h2 className="name">{firstname} {lastname}</h2>
            </div>
           <div className="user-details">
                
                <h3 className="username">Username: {username}</h3>
                <p className="email">Email: {email}
                    </p>
                <p className="bio">Bio: {bio}</p>
                <p className="location">Location: {location}</p>
                <p className="number">Phone Number: {phoneNumber}</p>
                <p className="profession">Profession: {profession}</p>

            </div>
            <div className="user-stats">
                <p className="followers">Followers: {followers}</p>
                <p className="following">Following:{following}</p>
                <p className="posts">Posts: {posts}</p>
            </div>

            
                
        </section>
    )
}