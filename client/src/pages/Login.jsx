import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.clear();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);

        navigate(`/profile/${data.userId}`);
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-page">
      <h1 className="login-title">Login</h1>
      <p className="login-subtext">Please login</p>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p className="register-text">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;
