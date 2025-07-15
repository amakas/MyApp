import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import React from "react";
import Navbar from "./components/navbar";
import Profile from "./pages/Profile";
import Footer from "./components/footer";
import EntryRedirect from "./pages/Redirect";
import "./main.scss";
import EditProfile from "./components/Profile/EditProfile";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/Privacy";
import ProtectedRoute from "./pages/ProtectedRoute";
import { People } from "./pages/People";
import UserProfile from "./pages/UserProfile";
import { FollowersList } from "./pages/Followers";
import { FollowingList } from "./pages/Following";
import { Comments } from "./pages/Comments";

function LayoutWrapper() {
  const location = useLocation();

  const hideLayoutOn = ["/login", "/register", "/terms", "/privacy"];
  const hideLayout = hideLayoutOn.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<EntryRedirect />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/edit-profile/:id" element={<EditProfile />} />
            <Route path="/home/:id" element={<Home />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/settings/:id" element={<Settings />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/people/:id" element={<People />} />
            <Route path="/userProfile/:id" element={<UserProfile />} />
            <Route path="/followers/:id" element={<FollowersList />} />
            <Route path="/following/:id" element={<FollowingList />} />
            <Route path="/comments/:id/:postId" element={<Comments />} />
          </Route>
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <LayoutWrapper />
      </BrowserRouter>
    </div>
  );
}

export default App;
