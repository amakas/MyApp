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
import ProtectedRoute from "./pages/ProtectedRoute"; // Import ProtectedRoute for protected routes
function App() {
  return (
    <div className="app">
      <BrowserRouter>
      <Navbar />
      <main className="main-content">
      <Routes>
        
      
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
           <Route element={<ProtectedRoute />}>
           <Route path="/edit-profile/:id" element={<EditProfile />} />
           <Route path="/home/:id" element={<Home />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/settings/:id" element={<Settings />} />
    <Route path="/profile/:id" element={<Profile />} />
  </Route>
        <Route path="*" element={<h1>Page Not Found</h1>} />  
      </Routes>
      
      </main>
      <Footer />
    </BrowserRouter>
    </div>
    
    
    
  );
}

export default App;