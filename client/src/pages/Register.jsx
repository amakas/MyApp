import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./Register.scss"; 

function Register(){
    
    return(
        <div className="register-page">
            <h1>Registration Form</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login here</a>.</p>
            <p>By registering, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</p>
            
        </div>
    )
    
}
export default Register;