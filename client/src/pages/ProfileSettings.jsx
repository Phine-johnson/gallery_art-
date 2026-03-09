import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    fullName: '', // Matches 'fullName' in User.js
    title: '',    // Matches 'title' in User.js
    bio: '',
    instagram: '',
    behance: '',
    avatar: ''
  });
  const [message, setMessage] = useState('');

  // 1. Fetch existing data when page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/profile'); // Adjust to your actual route
        const data = await res.json();
        if (res.ok) {
          setFormData({
            fullName: data.fullName || '',
            title: data.title || 'Professional Designer',
            bio: data.bio || '',
            instagram: data.instagram || '',
            behance: data.behance || '',
            avatar: data.avatar || ''
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Submit changes to the database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Updating...');

    try {
      const res = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Profile updated successfully! ✅');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.message || 'Failed to save'}`);
      }
    } catch (err) {
      setMessage('Failed to save to database. Check Vercel logs.');
      console.error(err);
    }
  };

  return (
    <div className="settings-container">
      <h2>Public Profile Settings</h2>
      {message && <div className="status-msg">{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Full Name (Required)</label>
          <input 
            type="text" 
            name="fullName" 
            value={formData.fullName} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <label>Professional Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
          />
        </div>

        <div className="input-group">
          <label>Profile Picture URL (Avatar)</label>
          <input 
            type="text" 
            name="avatar" 
            value={formData.avatar} 
            onChange={handleChange} 
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div className="input-group">
          <label>Instagram</label>
          <input 
            type="text" 
            name="instagram" 
            value={formData.instagram} 
            onChange={handleChange} 
          />
        </div>

        <div className="input-group">
          <label>Behance</label>
          <input 
            type="text" 
            name="behance" 
            value={formData.behance} 
            onChange={handleChange} 
          />
        </div>

        <div className="input-group">
          <label>Professional Bio</label>
          <textarea 
            name="bio" 
            value={formData.bio} 
            onChange={handleChange} 
          ></textarea>
        </div>

        <button type="submit" className="update-btn">Update Public Profile</button>
      </form>
    </div>
  );
};

export default ProfileSettings;