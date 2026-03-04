import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Gallery.css';

const Gallery = () => {
  const navigate = useNavigate();
  const categories = [
    { id: 'graphic', name: 'Graphic Design', image: 'https://picsum.photos/seed/g/800/600' },
    { id: 'uiux', name: 'UI/UX & Web', image: 'https://picsum.photos/seed/u/800/600' },
    { id: '3d', name: '3D & Motion', image: 'https://picsum.photos/seed/3d/800/600' },
    { id: 'photo', name: 'Photography', image: 'https://picsum.photos/seed/p/800/600' }
  ];

  return (
    <div className="discovery-container">
      <section className="discovery-hero">
        <h1>Find the perfect creative for your project.</h1>
        <button className="banner-cta" onClick={() => navigate('/hire')}>View All Freelancers</button>
      </section>
      <div className="category-layout">
        {categories.map((cat) => (
          <div key={cat.id} className="category-item" onClick={() => navigate(`/category/${cat.id}`)}>
            <div className="category-image-box">
              <img src={cat.image} alt={cat.name} />
              <div className="category-label"><h3>{cat.name}</h3></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Gallery;