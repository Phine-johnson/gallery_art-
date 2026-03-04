import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CategoryPage.css';

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState(null);

  // Generating 50 small images for the high-density grid
  const projects = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    img: `https://picsum.photos/seed/${id}-${i}/800/600`,
    title: `${id} Design ${i + 1}`,
    rating: (Math.random() * (5 - 3) + 3).toFixed(1)
  }));

  const handleSave = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `GalleryArt-${id}-Design.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="category-view-container">
      <header className="category-compact-header">
        <h1>{id?.toUpperCase()} EXPLORATION</h1>
        <button onClick={() => navigate('/')} className="back-btn">← Back</button>
      </header>
      
      <div className="compact-project-grid">
        {projects.map(p => (
          <div key={p.id} className="mini-project-card" onClick={() => setSelectedImg(p)}>
            <div className="mini-img-wrapper">
              <img src={p.img} alt={p.title} />
              <div className="mini-overlay">
                <span className="mini-rating">⭐ {p.rating}</span>
              </div>
            </div>
            <p className="mini-title">{p.title}</p>
          </div>
        ))}
      </div>

      {/* VIEW & SAVE MODAL */}
      {selectedImg && (
        <div className="modal-overlay" onClick={() => setSelectedImg(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={selectedImg.img} alt="Full View" className="full-view-img" />
            <div className="modal-actions">
              <button className="save-btn" onClick={() => handleSave(selectedImg.img)}>💾 Save to Device</button>
              <button className="close-btn" onClick={() => setSelectedImg(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// CRITICAL: This line fixes the "Uncaught SyntaxError"
export default CategoryPage;