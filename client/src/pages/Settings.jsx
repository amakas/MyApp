import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.scss";
import EditPorfile from "../components/Profile/EditProfile";

function Settings() {
  const navigate = useNavigate();
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const confirmed = window.confirm("Are you sure? this is irreversible");
    if (confirmed) {
      try {
        const response = await fetch(`/api/users/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          alert("Account successfully deleted");
          localStorage.clear();
          navigate("/login", { replace: true });
        } else {
          alert("Failed to delete account");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-card">
        <EditPorfile />
      </div>
      <div className="settings-danger">
        <button className="delete-btn" onClick={handleDelete}>
          Delete account
        </button>
      </div>
    </div>
  );
}
export default Settings;
