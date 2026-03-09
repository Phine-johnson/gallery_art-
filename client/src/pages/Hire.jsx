import React, { useState, useEffect } from 'react';
import './Hire.css';

const Hire = () => {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    setLoading(true);
    try {
      // Replace 5000 with your actual backend port if different
      const API_URL = 'http://localhost:5000/api/users';
      console.log("Fetching from:", API_URL);

      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setDesigners(data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not connect to the database. Make sure your backend server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hire-container">
      <div className="sidebar">
        <button className="post-project-btn">+ Post a Project</button>
        <h3>Categories</h3>
        <div className="filter-group">
          <label><input type="checkbox" /> Logo Design</label>
          <label><input type="checkbox" /> Branding</label>
          <label><input type="checkbox" /> Social Media</label>
          <label><input type="checkbox" /> Website Design</label>
        </div>
      </div>

      <div className="main-content">
        <div className="header-row">
          <h2>Available Freelancers ({designers.length})</h2>
          <select className="sort-dropdown">
            <option>Recommended</option>
            <option>Newest</option>
            <option>Highest Rated</option>
          </select>
        </div>

        {loading ? (
          <div className="status-message">Loading designers...</div>
        ) : error ? (
          <div className="status-message error-box">
            <p>{error}</p>
            <small>Check your Terminal to see if the backend crashed.</small>
          </div>
        ) : designers.length === 0 ? (
          <div className="status-message">
            <h3>No designers found in the database.</h3>
            <p>Make sure your MONGO_URI is set up and your 'users' collection isn't empty!</p>
          </div>
        ) : (
          <div className="designer-grid">
            {designers.map((designer) => (
              <div key={designer._id} className="designer-card">
                <img src={designer.profileImage || 'https://via.placeholder.com/150'} alt={designer.name} />
                <div className="card-info">
                  <h4>{designer.name}</h4>
                  <p>{designer.specialty || 'Professional Designer'}</p>
                  <div className="card-footer">
                    <span>⭐ {designer.rating || '5.0'}</span>
                    <button className="view-profile-btn">View Profile</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hire;