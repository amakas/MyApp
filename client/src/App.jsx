import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import React from "react";
import Navbar from "./components/navbar";
import Profile from "./pages/Profile";
import Footer from "./components/footer";
import "./main.scss"; // Import your main styles
import EditProfile from "./components/Profile/EditProfile"; // Import EditProfile page if needed
import Terms from "./pages/Terms"; 
import PrivacyPolicy from "./pages/Privacy"; 
function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </BrowserRouter>
    
    </React.StrictMode>
    
    
  );
}

export default App;