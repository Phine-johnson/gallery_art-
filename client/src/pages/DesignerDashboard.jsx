import React, { useState, useEffect } from 'react';
import './DesignerDashboard.css';

const DesignerDashboard = () => {
    const [designer, setDesigner] = useState(null);
    const [artworkTitle, setArtworkTitle] = useState('');
    const [artworkFile, setArtworkFile] = useState(null);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [newBio, setNewBio] = useState('');
    
    const BACKEND_URL = "http://localhost:5000";
    const token = localStorage.getItem('token');

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/users/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setDesigner(data);
            setNewBio(data.bio || "");
        } catch (err) {
            console.error("Failed to fetch profile", err);
        }
    };

    // --- NEW: Handle Profile Picture Upload ---
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${BACKEND_URL}/api/users/upload-avatar`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (res.ok) {
            fetchProfile(); // Refresh to show the new avatar
        } else {
            alert("Avatar upload failed");
        }
    };

    const handleUpdateBio = async () => {
        const res = await fetch(`${BACKEND_URL}/api/users/update-bio`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bio: newBio })
        });
        if (res.ok) {
            const updatedUser = await res.json();
            setDesigner(updatedUser);
            setIsEditingBio(false);
        }
    };

    const handleArtPublish = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', artworkFile);
        formData.append('title', artworkTitle);

        const res = await fetch(`${BACKEND_URL}/api/users/post-art`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (res.ok) {
            setArtworkTitle('');
            setArtworkFile(null);
            fetchProfile(); 
        }
    };

    if (!designer) return <div className="loading">Loading Studio...</div>;

    return (
        <div className="art-gallery-dashboard">
            <div className="glass-container">
                <div className="profile-section">
                    <div className="avatar-wrapper">
                        <img 
                            src={designer.avatar ? `${BACKEND_URL}${designer.avatar}` : "/default-avatar.png"} 
                            className="round-avatar" 
                            alt="Profile" 
                        />
                        {/* Hidden input triggered by the label */}
                        <input 
                            type="file" 
                            id="avatar-input" 
                            style={{ display: 'none' }} 
                            onChange={handleAvatarUpload} 
                            accept="image/*"
                        />
                        <label htmlFor="avatar-input" className="change-photo-label">
                            📸 Change Photo
                        </label>
                    </div>

                    <h2>{designer.fullName}</h2>
                    
                    {isEditingBio ? (
                        <div className="bio-editor">
                            <textarea value={newBio} onChange={(e) => setNewBio(e.target.value)} />
                            <div className="bio-btns">
                                <button className="save-bio-btn" onClick={handleUpdateBio}>Save</button>
                                <button className="edit-link" onClick={() => setIsEditingBio(false)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="bio-display">
                            <p>{designer.bio || "No bio set."}</p>
                            <button className="edit-link" onClick={() => setIsEditingBio(true)}>Edit Bio</button>
                        </div>
                    )}
                </div>

                <form className="publish-form" onSubmit={handleArtPublish}>
                    <h3>Post New Work</h3>
                    <input type="text" placeholder="Project Title" value={artworkTitle} onChange={(e) => setArtworkTitle(e.target.value)} required />
                    <input type="file" onChange={(e) => setArtworkFile(e.target.files[0])} required />
                    <button type="submit" className="publish-btn">🚀 Publish Now</button>
                </form>

                <div className="my-public-posts">
                    <h3>My Public Posts</h3>
                    <div className="mini-grid">
                        {designer.projects?.map((art, idx) => (
                            <div key={idx} className="mini-post">
                                <img src={`${BACKEND_URL}${art.img}`} alt={art.title} />
                                <span>{art.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignerDashboard;