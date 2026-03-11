import React, { useState } from 'react';

const PostArt = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handlePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artImage', file);

    try {
      setMessage('Uploading art...');
      const res = await fetch('/api/users/post-art', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setMessage('Art added to portfolio! 🎨');
        setTitle('');
        setFile(null);
      } else {
        setMessage('Upload failed.');
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    }
  };

  return (
    <div className="post-art-container" style={{ padding: '2rem' }}>
      <h3>Post New Artwork</h3>
      <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Art Title (e.g. Modern Logo)" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
          required 
        />
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
          Publish to Gallery
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PostArt;