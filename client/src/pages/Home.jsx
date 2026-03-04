import React, { useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  // Category data inspired by top creative disciplines
  const categories = [
    { id: 'graphic', title: 'Graphic Design', img: 'https://picsum.photos/seed/design/600/400' },
    { id: 'uiux', title: 'UI/UX & Web', img: 'https://picsum.photos/seed/ui/600/400' },
    { id: 'photo', title: 'Photography', img: 'https://picsum.photos/seed/photo/600/400' },
    { id: 'illus', title: 'Illustration', img: 'https://picsum.photos/seed/art/600/400' },
    { id: '3d', title: '3D Art', img: 'https://picsum.photos/seed/render/600/400' },
    { id: 'motion', title: 'Motion Graphics', img: 'https://picsum.photos/seed/video/600/400' }
  ];

  return (
    <div className="discovery-container">
      {/* HERO SECTION */}
      <section className="modern-hero">
        <div className="hero-content">
          <h1>Find the perfect creative talent.</h1>
          <p>Explore thousands of world-class projects categorized by industry.</p>
          <div className="search-pill">
            <input type="text" placeholder="Search for 'Logo Design'..." />
            <button>Search</button>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <div className="section-header">
        <h2>Explore by Category</h2>
        <p>Click a category to see top-rated works and designers.</p>
      </div>

      <div className="category-grid">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="category-card"
            onClick={() => navigate(`/category/${cat.id}`)}
          >
            <div className="category-img-wrapper">
              <img src={cat.img} alt={cat.title} />
              <div className="category-overlay">
                <h3>{cat.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;