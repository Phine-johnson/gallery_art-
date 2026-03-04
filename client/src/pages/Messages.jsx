import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Messages.css';

const Messages = () => {
  // Mock data representing your 12 Hire Requests
  const [inquiries] = useState([
    { id: 1, client: "Alex Rivers", category: "Branding", budget: "$1,200", img: "https://picsum.photos/seed/a1/800/600", status: "New" },
    { id: 2, client: "TechFlow", category: "UI/UX", budget: "$850", img: "https://picsum.photos/seed/a2/800/600", status: "Urgent" },
    { id: 3, client: "Roots Co", category: "Packaging", budget: "$500", img: "https://picsum.photos/seed/a3/800/600", status: "Active" },
    { id: 4, client: "Urban Edge", category: "Logo", budget: "$900", img: "https://picsum.photos/seed/a4/800/600", status: "New" },
  ]);

  return (
    <div className="behance-messages-page">
      {/* Behance-Style Navigation */}
      <nav className="inbox-sub-nav">
        <div className="nav-container">
          <div className="filter-group">
            <button className="filter-btn active">All Requests</button>
            <button className="filter-btn">Unread</button>
            <button className="filter-btn">Archived</button>
          </div>
          <Link to="/dashboard" className="back-btn-minimal">Back to Command Center</Link>
        </div>
      </nav>

      <div className="content-container">
        <header className="messages-title-section">
          <h1>Client Inquiries</h1>
          <p>You have <strong>12 active requests</strong> to review.</p>
        </header>

        {/* The Grid: Professional & Neatly Arranged */}
        <div className="inquiry-grid">
          {inquiries.map((item) => (
            <div key={item.id} className="inquiry-card">
              <div className="card-image-wrapper">
                <img src={item.img} alt="Project Concept" />
                <div className="status-overlay">{item.status}</div>
              </div>
              <div className="card-info">
                <div className="info-top">
                  <h3>{item.client}</h3>
                  <span className="budget-tag">{item.budget}</span>
                </div>
                <p className="category-text">{item.category}</p>
                <div className="card-footer">
                  <button className="view-btn">View Details</button>
                  <div className="interaction-icons">
                    <span>❤️ 12</span>
                    <span>👁️ 104</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;