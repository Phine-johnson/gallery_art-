import React from 'react';
import './HomeGallery.css';

const designers = [
  {
    name: "Andreas Preis",
    location: "Berlin, Germany",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    previews: ["art1.jpg", "art2.jpg", "art3.jpg"], // Add small previews like Behance
  },
  // ... more designers
];

const HomeGallery = () => {
  return (
    <div className="behance-container">
      {/* 1. HIARABLE BANNER */}
      <section className="hire-banner">
        <div className="banner-content">
          <h1>Looking to Hire a Creator?</h1>
          <p>Over 1 million creatives are available for freelance or full-time work.</p>
          <button className="hire-btn">View our Hire Page</button>
        </div>
        <div className="banner-credit">Artist: Cláudia Silva</div>
      </section>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="gallery-controls">
        <div className="search-box">
          <input type="text" placeholder="Search the creative world..." />
        </div>
        <div className="filter-pills">
          <button className="pill active">Recommended</button>
          <button className="pill">Curated</button>
          <button className="pill">Most Appreciated</button>
        </div>
      </div>

      {/* 3. DESIGNER GRID */}
      <main className="creator-grid">
        {designers.map((creator, index) => (
          <div key={index} className="creator-card">
            <div className="preview-row">
              {/* These simulate the small artwork thumbnails behind the avatar */}
              <div className="thumb-item"></div>
              <div className="thumb-item main"></div>
              <div className="thumb-item"></div>
            </div>
            <div className="creator-details">
              <img src={creator.avatar} className="creator-avatar" alt={creator.name} />
              <h3>{creator.name}</h3>
              <p>{creator.location}</p>
              <button className="follow-btn">Follow</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default HomeGallery;