import React, { useState, useEffect } from 'react';
import './DesignerDashboard.css';

const DesignerDashboard = () => {
    const [designer, setDesigner] = useState(null);
    const [artworkTitle, setArtworkTitle] = useState('');
    const [artworkFile, setArtworkFile] = useState(null);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [newBio, setNewBio] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Ensure no trailing slash in the URL
    const BACKEND_URL = "https://gallery-art-api.onrender.com";
    const token = localStorage.getItem('token');

    useEffect(() => { 
        if (token) {
            fetchProfile(); 
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/users/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Critical: If the route is 404, this prevents the "Unexpected token <" error
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Server responded with ${res.status}: ${errorText.substring(0, 50)}`);
            }

            const data = await res.json();
            setDesigner(data);
            setNewBio(data.bio || "");
        } catch (err) {
            console.error("Profile fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // Helper to handle both Cloudinary and Local paths
    const getImageUrl = (path) => {
        if (!path) return "/default-avatar.png";
        if (path.startsWith('http')) return path; // Already a Cloudinary URL
        return `${BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${BACKEND_URL}/api/users/upload-avatar`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                fetchProfile(); // Refresh to see the new Cloudinary avatar
            } else {
                alert("Avatar upload failed. Check server logs.");
            }
        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    const handleUpdateBio = async () => {
        try {
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
        } catch (err) {
            console.error("Bio update error:", err);
        }
    };

    const handleArtPublish = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', artworkFile);
        formData.append('title', artworkTitle);

        try {
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
        } catch (err) {
            console.error("Art publish error:", err);
        }
    };

    if (loading) return <div className="loading">Connecting to GalleryArt Studio...</div>;
    if (!designer) return <div className="error-msg">Please login to access your dashboard.</div>;

    return (
        <div className="art-gallery-dashboard">
            <div className="glass-container">
                <div className="profile-section">
                    <div className="avatar-wrapper">
                        <img 
                            src={getImageUrl(designer.avatar)} 
                            className="round-avatar" 
                            alt="Profile" 
                            onError={(e) => { e.target.src = "/default-avatar.png"; }}
                        />
                        <input 
                            type="file" 
                            id="avatar-input" 
                            style={{ display: 'none' }} 
                            onChange={handleAvatarUpload} 
                            accept="image/*"
                        />
                        <label htmlFor="avatar-input" className="change-photo-label">
                            📸 Update Profile Picture
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
                            <p>{designer.bio || "Write something about your creative journey..."}</p>
                            <button className="edit-link" onClick={() => setIsEditingBio(true)}>Edit Bio</button>
                        </div>
                    )}
                </div>

                <form className="publish-form" onSubmit={handleArtPublish}>
                    <h3>Post New Work</h3>
                    <input 
                        type="text" 
                        placeholder="Project Title" 
                        value={artworkTitle} 
                        onChange={(e) => setArtworkTitle(e.target.value)} 
                        required 
                    />
                    <input 
                        type="file" 
                        onChange={(e) => setArtworkFile(e.target.files[0])} 
                        required 
                    />
                    <button type="submit" className="publish-btn">🚀 Publish to Gallery</button>
                </form>

                <div className="my-public-posts">
                    <h3>My Live Portfolio</h3>
                    <div className="mini-grid">
                        {designer.projects && designer.projects.length > 0 ? (
                            designer.projects.map((art, idx) => (
                                <div key={idx} className="mini-post">
                                    <img 
                                        src={getImageUrl(art.img)} 
                                        alt={art.title} 
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <span>{art.title}</span>
                                </div>
                            ))
                        ) : (
                            <p className="empty-msg">No work published yet. Show the world what you've got!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignerDashboard;