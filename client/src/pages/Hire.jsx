import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hire.css';

const Hire = () => {
  const navigate = useNavigate();

  // Mock designers for the directory
  const designers = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    name: ["Opedia Studio", "Graphéine", "Andreas Preis", "Anagrama"][i % 4],
    location: ["Dhaka, Bangladesh", "Paris, France", "Berlin, Germany", "Mexico City"][i % 4],
    rate: ["$50/hr", "$85/hr", "$120/hr", "$70/hr"][i % 4],
    tags: ["Logo Design", "Branding", "Packaging", "Web Design"]
  }));

  return (
    <div className="directory-container">
      {/* SIDEBAR FOR CATEGORIES */}
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
          <h2>Available Freelancers</h2>
          <select className="sort-select">
            <option>Recommended</option>
            <option>Highest Rated</option>
          </select>
        </div>

        {designers.map((designer) => (
          <div 
            key={designer.id} 
            className="talent-row-card" 
            onClick={() => navigate(`/designer/${designer.id}`)}
          >
            <div className="row-main-info">
              <div className="row-brand">
                <div className="squircle-logo-placeholder"></div>
                <div className="brand-text">
                  <h3>{designer.name} <span className="pro-badge">PRO</span></h3>
                  <p>📍 {designer.location} • <span className="status">Available now</span></p>
                </div>
              </div>
              <button className="inquiry-btn">Send Inquiry</button>
            </div>

            <div className="tag-row">
              {designer.tags.map(tag => <span key={tag} className="skill-tag">{tag}</span>)}
            </div>

            {/* CLICKABLE WORK STRIP */}
            <div className="work-scroll-strip">
              {[1, 2, 3, 4, 5, 6].map(img => (
                <div key={img} className="work-thumb-box">
                   <img src={`https://picsum.photos/seed/h${designer.id}${img}/300/200`} alt="work sample" />
                </div>
              ))}
            </div>
            
            <div className="row-footer">
              <span><strong>{designer.rate}</strong> average rate</span>
              <span className="view-reviews">Read Reviews ❯</span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

// THIS LINE FIXES THE ERROR
export default Hire;