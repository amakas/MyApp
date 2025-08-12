import { useNavigate } from "react-router-dom";
export default function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <button onClick={handleLogout} className="logout-button">
        <a>Logout</a>
      </button>
    </div>
  );
}
