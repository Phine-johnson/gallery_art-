import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DesignerDashboard.css';

const DesignerDashboard = () => {
  const navigate = useNavigate();
  const projectInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  
  const [viewMode, setViewMode] = useState('gallery'); 
  const [selectedImg, setSelectedImg] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!currentUser) navigate('/auth', { replace: true });
  }, [currentUser, navigate]);

  const profileKey = `profile_${currentUser?.email}`;
  const projectsKey = `projects_${currentUser?.email}`;

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(profileKey);
    return saved ? JSON.parse(saved) : {
      name: currentUser?.fullName || "Designer",
      title: "Verified Pro Designer",
      avatar: `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=0057ff&color=fff`,
      bio: "", instagram: "", behance: ""
    };
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem(projectsKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(profileKey, JSON.stringify(profile));
      localStorage.setItem(projectsKey, JSON.stringify(projects));
    }
  }, [profile, projects, profileKey, projectsKey]);

  // --- HANDLERS ---
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile({ ...profile, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleProjectUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const title = prompt("Enter project title:", "New Work");
      if (!title) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const newProj = { 
          id: Date.now(), 
          title: title, 
          img: reader.result, 
          views: Math.floor(Math.random() * 500), 
          likes: Math.floor(Math.random() * 100) 
        };
        setProjects([newProj, ...projects]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  if (!currentUser) return null;

  return (
    <div className="dashboard-wrapper">
      <input type="file" ref={projectInputRef} onChange={handleProjectUpload} style={{ display: 'none' }} />
      <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} />

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

      {/* Centered Profile Header */}
      <section className="dash-hero">
        <div className="avatar-wrapper" onClick={() => avatarInputRef.current.click()}>
          <img src={profile.avatar} alt="Profile" className="profile-img" />
          <div className="cam-overlay">📸</div>
        </div>
        <div className="user-meta">
          <h1>{profile.name}</h1>
          <p className="verified-badge">{profile.title}</p>
        </div>

        {/* Action Navigation Container */}
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
            <form onSubmit={(e) => { e.preventDefault(); setViewMode('gallery'); }}>
              <div className="field-group">
                <label>DISPLAY NAME</label>
                <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
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
                <textarea rows="3" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
              </div>
              <button type="submit" className="save-action-btn">Update Profile</button>
            </form>
          </div>
        )}

        {viewMode === 'gallery' && (
          <div className="gallery-masonry-grid">
            {projects.map(p => (
              <div key={p.id} className="project-card-v2" onClick={() => setSelectedImg(p)}>
                <div className="card-image-box">
                  <img src={p.img} alt={p.title} />
                  <button className="card-delete-btn" onClick={(e) => handleDelete(p.id, e)}>🗑️</button>
                </div>
                <div className="card-details">
                  <h4>{p.title}</h4>
                  <div className="card-stats">👁️ {p.views} ❤️ {p.likes}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignerDashboard;