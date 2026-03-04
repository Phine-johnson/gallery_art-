import React from 'react';
import './ArtworkCard.css';

const ArtworkCard = ({ art, onClick }) => (
  <div className="artwork-card" onClick={onClick} tabIndex={0} role="button" aria-label={art.title}>
    <img src={art.imageUrl} alt={art.title} className="artwork-img" />
    <div className="artwork-info">
      <h3>{art.title}</h3>
      <p>{art.description}</p>
      <div className="artwork-meta">
        <span className="category">{art.category}</span>
        <span className="designer">By {art.createdBy?.name || 'Unknown'}</span>
      </div>
      <div className="artwork-actions">
        <span className="likes">❤️ {art.likes.length}</span>
      </div>
    </div>
  </div>
);

export default ArtworkCard;
