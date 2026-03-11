import React, { useState, useEffect } from 'react';

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    bio: '',
    instagram: '',
    behance: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch current data on load
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          fullName: data.fullName || '',
          title: data.title || '',
          bio: data.bio || '',
          instagram: data.instagram || '',
          behance: data.behance || ''
        });
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    
    // Append text fields
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    // Append file if selected
    if (file) data.append('avatar', file);

    try {
      setMessage('Updating...');
      const res = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data // Sending FormData, no JSON.stringify
      });

      if (res.ok) setMessage('Profile Updated Successfully! ✅');
      else setMessage('Update failed.');
    } catch (err) {
      setMessage('Server error.');
    }
  };

  return (
    <div className="settings-container" style={{ padding: '2rem' }}>
      <h2>Public Profile Settings</h2>
      {message && <p className="status-msg">{message}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required />
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Professional Title" />
        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Write your bio here..."></textarea>
        
        <label>Update Profile Picture:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        
        <button type="submit" className="update-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfileSettings;