import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import '../styles/navigation.css';

export default function Navigation() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2 onClick={() => navigate('/dashboard')} className="logo">
            🚀 TaskManager
          </h2>
        </div>

        <div className="nav-menu">
          <button className="nav-link" onClick={() => handleNavigation('/dashboard')}>
            📊 Dashboard
          </button>
          <button className="nav-link" onClick={() => handleNavigation('/projects')}>
            📁 Projects
          </button>
        </div>

        <div className="nav-user">
          <button
            className="user-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {user?.first_name} ▼
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item disabled">
                {user?.email}
              </div>
              <hr />
              <button
                className="dropdown-item"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
