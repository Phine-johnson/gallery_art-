import React from 'react';

const DesignerCard = ({ designer }) => {
  const IMG_URL = " https://gallery-art-api.onrender.com";

  return (
    <div className="designer-card">
      <div className="flex items-start gap-6">
        {/* Uses the Avatar you uploaded in Profile Settings */}
        <img 
          src={designer.avatar ? `${IMG_URL}${designer.avatar}` : 'https://via.placeholder.com/80'} 
          className="designer-avatar"
          alt="Profile"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{designer.fullName}</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">📍 Ghana • <span className="text-green-500">Available now</span></p>
          
          <div className="flex gap-2 mt-4">
            <span className="skill-tag">Logo Design</span>
            <span className="skill-tag">Branding</span>
            <span className="skill-tag">Web Design</span>
          </div>
        </div>
      </div>

      {/* This renders the 'Publish to Public View' images */}
      <div className="gallery-scroll">
        {designer.projects && designer.projects.map((project, index) => (
          <img 
            key={index}
            src={`${IMG_URL}${project.img}`} 
            className="gallery-item"
            alt={project.title}
          />
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
        <p className="text-gray-900 font-bold text-lg">$50/hr <span className="text-gray-400 font-normal text-sm ml-1">average rate</span></p>
        <button className="text-sm font-bold text-gray-800 flex items-center gap-1">Read Reviews ›</button>
      </div>
    </div>
  );
};