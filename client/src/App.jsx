import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
import UserChat from "./pages/UserChat";
import { useEffect } from "react";
import { initSocket, getSocket } from "./socket";
function LayoutWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingUser, setLoadingUser] = React.useState(true); // ✅ стан завантаження

  const hideLayoutOn = ["/login", "/register", "/terms", "/privacy"];
  const hideLayout = hideLayoutOn.includes(location.pathname);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const token = tokenFromUrl || localStorage.getItem("token");

    if (tokenFromUrl) {
      localStorage.clear();
      localStorage.setItem("token", tokenFromUrl);
      window.history.replaceState(null, "", "/");
      navigate("/");
    }

    if (!token) {
      setLoadingUser(false); // ✅ неавторизований
      return;
    }

    console.log("Using token:", token);

    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched user:", data);
        localStorage.setItem("userId", data._id);
        localStorage.setItem("username", data.username);

        const s = initSocket(token);
        s.on("connect", () => {
          console.log("Socket connected:", s.id);
        });
      })
      .catch((err) => {
        console.error("Auth error:", err);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);

  if (loadingUser) {
    return <div>Loading user...</div>;
  }

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
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/home" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/people" element={<People />} />
            <Route path="/userProfile/:id" element={<UserProfile />} />
            <Route path="/followers/:id" element={<FollowersList />} />
            <Route path="/following/:id" element={<FollowingList />} />
            <Route path="/comments/:id/:postId" element={<Comments />} />
            <Route path="/userChat/:personId" element={<UserChat />} />
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
