import React from 'react';
import { Link } from 'react-router-dom';

function HomeButton(){
    
    return(
        <div>
            <button className="home-button">
            <Link to="/">
                Home
            </Link>
            </button>
        </div>
    )
    
}
export default HomeButton;