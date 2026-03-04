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

  // State for Profile
  const [profile, setProfile] = useState({
    fullName: currentUser?.fullName || "Designer",
    title: "Verified Pro Designer",
    avatar: `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=0057ff&color=fff`,
    bio: "", 
    instagram: "", 
    behance: "",
    rate: "$50/hr",
    experience: "5 Years"
  });

  const [projects, setProjects] = useState([]);

  // FETCH: Get real data from the database on load
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.id) return;
      try {
        // Using relative path for Vercel deployment
        const response = await fetch(`/api/users/${currentUser.id}`);
        const data = await response.json();
        if (data) {
          setProfile(prev => ({ ...prev, ...data }));
          setProjects(data.projects || []);
        }
      } catch (err) {
        console.error("Database fetch failed, using local session data.", err);
      }
    };
    fetchUserData();
  }, [currentUser?.id]);

  // HANDLER: Update Profile & Sync Gallery to MongoDB
  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/users/update/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          projects: projects // 🔥 CRITICAL: This sends your images to MongoDB
        }),
      });

      if (response.ok) {
        alert("Public Profile & Gallery Updated! Check your public page.");
        setViewMode('gallery');
      } else {
        alert("Failed to save to database. Check Vercel logs.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Could not connect to the Vercel server.");
    } finally {
      setLoading(false);
    }
  };

  // HANDLER: Upload Project (Local Preview)
  const handleProjectUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const title = prompt("Enter project title:", "New Masterpiece");
      if (!title) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const newProj = { 
          id: Date.now().toString(), // String ID for consistency
          title: title, 
          img: reader.result, 
          views: 0, 
          likes: 0 
        };
        // Add to local state
        setProjects(prev => [newProj, ...prev]);
        // Trigger a profile update to save this new image to MongoDB immediately
        setTimeout(() => alert("Project added to list! Click 'Update Profile' in Settings to save permanently."), 500);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="dashboard-wrapper">
      {/* Hidden Inputs */}
      <input type="file" ref={projectInputRef} onChange={handleProjectUpload} style={{ display: 'none' }} />
      <input type="file" ref={avatarInputRef} onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => setProfile({ ...profile, avatar: reader.result });
          reader.readAsDataURL(file);
      }} style={{ display: 'none' }} />

      {/* Lightbox */}
      {selectedImg && (
        <div className="lightbox-overlay" onClick={() => setSelectedImg(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={selectedImg.img} alt={selectedImg.title} />
            <button className="close-x" onClick={() => setSelectedImg(null)}>✕</button>
            <div className="lightbox-info"><h2>{selectedImg.title}</h2></div>
          </div>
        </div>
      )}

      <section className="dash-hero">
        <div className="avatar-wrapper" onClick={() => avatarInputRef.current.click()}>
          <img src={profile.avatar} alt="Profile" className="profile-img" />
          <div className="cam-overlay">📸</div>
        </div>
        <div className="user-meta">
          <h1>{profile.fullName || profile.name}</h1>
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
            <h3>Public Profile Settings</h3>
            <form onSubmit={handleUpdate}>
              <div className="field-group">
                <label>DISPLAY NAME</label>
                <input type="text" value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} required />
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
                <textarea rows="3" value={profile.bio} placeholder="Describe your style..." onChange={e => setProfile({...profile, bio: e.target.value})} />
              </div>
              <button type="submit" className="save-action-btn" disabled={loading}>
                {loading ? "Syncing with Cloud..." : "Update Public Profile"}
              </button>
            </form>
          </div>
        )}

        {viewMode === 'gallery' && (
          <div className="gallery-masonry-grid">
            {projects.length === 0 ? (
              <p className="empty-msg">Your public gallery is empty. Upload your first project!</p>
            ) : (
              projects.map(p => (
                <div key={p.id} className="project-card-v2" onClick={() => setSelectedImg(p)}>
                  <div className="card-image-box">
                    <img src={p.img} alt={p.title} />
                    <button className="card-delete-btn" onClick={(e) => {
                        e.stopPropagation();
                        if(window.confirm("Delete this project?")) {
                          setProjects(projects.filter(proj => proj.id !== p.id));
                        }
                    }}>🗑️</button>
                  </div>
                  <div className="card-details">
                    <h4>{p.title}</h4>
                    <div className="card-stats">👁️ {p.views || 0} ❤️ {p.likes || 0}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignerDashboard;