import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DesignerDashboard.css';

const DesignerDashboard = () => {
  const navigate = useNavigate();
  const projectInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  
  const [viewMode, setViewMode] = useState('gallery'); 
  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get current user from login session
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) navigate('/auth', { replace: true });
  }, [currentUser, navigate]);

  // State for Profile - Initialized with currentUser data
  const [profile, setProfile] = useState({
    name: currentUser?.fullName || "Designer",
    title: "Verified Pro Designer",
    avatar: `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=0057ff&color=fff`,
    bio: "", 
    instagram: "", 
    behance: ""
  });

  const [projects, setProjects] = useState([]);

  // FETCH: Get real data from the database on load
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      try {
        const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}`);
        const data = await response.json();
        if (data) {
          setProfile(prev => ({ ...prev, ...data }));
          setProjects(data.projects || []);
        }
      } catch (err) {
        console.error("Database fetch failed, using local session data.");
      }
    };
    fetchUserData();
  }, []);

  // HANDLER: Update Profile (The "Transfer to Public" Logic)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace localhost with your Render URL when you deploy the server
      const response = await fetch(`http://localhost:5000/api/users/update/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        alert("Public Profile Updated! Everyone can see your changes now.");
        setViewMode('gallery');
      } else {
        alert("Update failed. Check if your server is running.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // HANDLER: Upload Project
  const handleProjectUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const title = prompt("Enter project title:", "New Work");
      if (!title) return;

      // In a real app, you'd send this File to Cloudinary/Multer
      // For now, we use a reader for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProj = { 
          id: Date.now(), 
          title: title, 
          img: reader.result, 
          views: 0, 
          likes: 0 
        };
        setProjects([newProj, ...projects]);
        // Note: You should also add a fetch() here to save the image to the DB!
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="dashboard-wrapper">
      <input type="file" ref={projectInputRef} onChange={handleProjectUpload} style={{ display: 'none' }} />
      <input type="file" ref={avatarInputRef} onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => setProfile({ ...profile, avatar: reader.result });
          reader.readAsDataURL(file);
      }} style={{ display: 'none' }} />

      {/* Lightbox Overlay */}
      {selectedImg && (
        <div className="lightbox-overlay" onClick={() => setSelectedImg(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={selectedImg.img} alt={selectedImg.title} />
            <button className="close-x" onClick={() => setSelectedImg(null)}>✕</button>
            <div className="lightbox-info">
               <h2>{selectedImg.title}</h2>
            </div>
          </div>
        </div>
      )}

      <section className="dash-hero">
        <div className="avatar-wrapper" onClick={() => avatarInputRef.current.click()}>
          <img src={profile.avatar} alt="Profile" className="profile-img" />
          <div className="cam-overlay">📸</div>
        </div>
        <div className="user-meta">
          <h1>{profile.name}</h1>
          <p className="verified-badge">{profile.title}</p>
        </div>

        <div className="action-pill-nav">
          <button className={`nav-item ${viewMode === 'gallery' ? 'active' : ''}`} onClick={() => setViewMode('gallery')}>🖼️ Gallery</button>
          <button className="nav-item upload-btn" onClick={() => projectInputRef.current.click()}>+ Add Project</button>
          <button className={`nav-item ${viewMode === 'settings' ? 'active' : ''}`} onClick={() => setViewMode('settings')}>⚙️ Settings</button>
          <button className="nav-item logout-btn" onClick={() => { localStorage.removeItem('currentUser'); navigate('/auth'); }}>Logout</button>
        </div>
      </section>

      <div className="content-container">
        {viewMode === 'settings' && (
          <div className="settings-panel">
            <h3>Account Settings</h3>
            <form onSubmit={handleUpdate}>
              <div className="field-group">
                <label>DISPLAY NAME</label>
                <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required />
              </div>
              <div className="social-row">
                <div className="field-group">
                  <label>INSTAGRAM</label>
                  <input type="text" value={profile.instagram} placeholder="@username" onChange={e => setProfile({...profile, instagram: e.target.value})} />
                </div>
                <div className="field-group">
                  <label>BEHANCE</label>
                  <input type="text" value={profile.behance} placeholder="behance.net/username" onChange={e => setProfile({...profile, behance: e.target.value})} />
                </div>
              </div>
              <div className="field-group">
                <label>PROFESSIONAL BIO</label>
                <textarea rows="3" value={profile.bio} placeholder="Tell the world about your style..." onChange={e => setProfile({...profile, bio: e.target.value})} />
              </div>
              <button type="submit" className="save-action-btn" disabled={loading}>
                {loading ? "Saving..." : "Update Profile"}
              </button>
            </form>
          </div>
        )}

        {viewMode === 'gallery' && (
          <div className="gallery-masonry-grid">
            {projects.length === 0 ? <p className="empty-msg">No projects yet. Upload your first masterpiece!</p> : 
              projects.map(p => (
                <div key={p.id} className="project-card-v2" onClick={() => setSelectedImg(p)}>
                  <div className="card-image-box">
                    <img src={p.img} alt={p.title} />
                    <button className="card-delete-btn" onClick={(e) => {
                        e.stopPropagation();
                        setProjects(projects.filter(proj => proj.id !== p.id));
                    }}>🗑️</button>
                  </div>
                  <div className="card-details">
                    <h4>{p.title}</h4>
                    <div className="card-stats">👁️ {p.views} ❤️ {p.likes}</div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignerDashboard;