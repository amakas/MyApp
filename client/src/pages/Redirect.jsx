import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import isTokenExpired from "../components/token";
function EntryRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!isTokenExpired(token)) {
      navigate(`/home/${userId}`);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null;
}

export default EntryRedirect;
