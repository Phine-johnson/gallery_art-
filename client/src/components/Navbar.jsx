import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        navigate('/auth');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo" onClick={() => navigate('/')}>
                    GALLERY<span>ART</span>
                </div>
                
                <div className="nav-links">
                    <Link to="/hire" className="nav-item">Explore</Link>
                    
                    {token ? (
                        <>
                            <Link to="/dashboard" className="nav-dash-btn">Dashboard Studio</Link>
                            <button onClick={handleLogout} className="nav-logout">Logout</button>
                        </>
                    ) : (
                        <Link to="/auth" className="nav-login-btn">Login / Join</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;