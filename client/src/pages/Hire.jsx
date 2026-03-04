import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hire.css';

const Hire = () => {
  const navigate = useNavigate();
  const [designers, setDesigners] = useState([]); // Start with an empty list
  const [loading, setLoading] = useState(true);

  // FETCH: Get all designers from your MongoDB
  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        // This relative path works on both localhost:5000 and gallery-art-beige.vercel.app
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setDesigners(data);
      } catch (err) {
        console.error("Could not load designers from database:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigners();
  }, []);

  if (loading) return <div className="loader">Finding top talent...</div>;

  return (
    <div className="directory-container">
      <aside className="directory-sidebar">
        <div className="sidebar-sticky">
          <button className="new-job-btn">+ Post a Project</button>
          <div className="filter-section">
            <h4>Categories</h4>
            {["Logo Design", "Branding", "Social Media", "Website Design"].map(cat => (
              <label key={cat} className="filter-label">
                <input type="checkbox" /> {cat}
              </label>
            ))}
          </div>
        </div>
      </aside>

      <main className="directory-list">
        <div className="list-header">
          <h2>Available Freelancers ({designers.length})</h2>
          <select className="sort-select">
            <option>Recommended</option>
            <option>Highest Rated</option>
          </select>
        </div>

        {designers.length > 0 ? (
          designers.map((designer) => (
            <div 
              key={designer._id} // MongoDB uses _id
              className="talent-row-card" 
              onClick={() => navigate(`/designer/${designer._id}`)}
            >
              <div className="row-main-info">
                <div className="row-brand">
                  {/* Shows real avatar if uploaded, otherwise a placeholder */}
                  <img 
                    src={designer.avatar || `https://ui-avatars.com/api/?name=${designer.fullName}&background=0057ff&color=fff`} 
                    alt={designer.fullName}
                    className="row-avatar-img"
                  />
                  <div className="brand-text">
                    <h3>{designer.fullName || designer.name} <span className="pro-badge">PRO</span></h3>
                    <p>📍 {designer.location || "Global"} • <span className="status">Available now</span></p>
                  </div>
                </div>
                <button className="inquiry-btn">Send Inquiry</button>
              </div>

              <div className="tag-row">
                {/* Shows real title as a tag if available */}
                <span className="skill-tag">{designer.title || "Graphic Designer"}</span>
                <span className="skill-tag">Branding</span>
              </div>

              {/* REAL WORK STRIP: Shows the designer's actual uploaded projects */}
              <div className="work-scroll-strip">
                {designer.projects && designer.projects.length > 0 ? (
                  designer.projects.slice(0, 6).map((proj, idx) => (
                    <div key={idx} className="work-thumb-box">
                       <img src={proj.img} alt={proj.title} />
                    </div>
                  ))
                ) : (
                  <p className="no-work-text">No portfolio projects uploaded yet.</p>
                )}
              </div>
              
              <div className="row-footer">
                <span><strong>{designer.rate || "$40/hr"}</strong> average rate</span>
                <span className="view-reviews">Read Reviews ❯</span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h3>No designers found in the database.</h3>
            <p>Make sure your MONGO_URI is set up in Vercel!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Hire;