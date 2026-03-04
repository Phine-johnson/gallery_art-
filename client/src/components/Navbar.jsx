import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/', { replace: true });
  };

  return (
    <nav className="studio-navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="brand-logo">GALLERYART</Link>
          <div className="main-links">
            <Link to="/explore">Explore</Link>
            
          </div>
        </div>

        <div className="nav-right">
          <span className="lang-code">EN</span>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-item">Dashboard</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth" className="seller-btn">Become a Seller</Link>
              <Link to="/auth" className="login-btn">Sign In</Link>
              <Link to="/auth" className="join-pill">Join</Link>
            </>
          )}
          
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;