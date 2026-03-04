import React from 'react';
import './GalleryModal.css';

const GalleryModal = ({ art, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>&times;</button>
      <img src={art.imageUrl} alt={art.title} className="modal-img" />
      <h2>{art.title}</h2>
      <p>{art.description}</p>
      <div className="modal-meta">
        <span>Category: {art.category}</span>
        <span>Designer: {art.createdBy?.name || 'Unknown'}</span>
        <span>Likes: {art.likes.length}</span>
      </div>
    </div>
  </div>
);

export default GalleryModal;
