import React, { useState, useEffect } from 'react';
import './DesignerDashboard.css';

const DesignerDashboard = () => {
    const [designer, setDesigner] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [artworkTitle, setArtworkTitle] = useState('');
    const [artworkFile, setArtworkFile] = useState(null);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [newBio, setNewBio] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploadMsg, setUploadMsg] = useState('');

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
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
            const data = await res.json();
            setDesigner(data);
            setNewBio(data.bio || '');
        } catch (err) {
            console.error("Profile fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchArtworks = async (designerId) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/artworks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const mine = data.filter(a =>
                a.createdBy === designerId ||
                a.createdBy?._id === designerId
            );
            setArtworks(mine);
        } catch (err) {
            console.error("Fetch artworks error:", err);
        }
    };

    useEffect(() => {
        if (designer) fetchArtworks(designer._id);
    }, [designer]);

    const getImageUrl = (path) => {
        if (!path) return "/default-avatar.png";
        if (path.startsWith('http')) return path;
        return `${BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            const res = await fetch(`${BACKEND_URL}/api/users/upload-avatar`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (res.ok) fetchProfile();
            else alert("Avatar upload failed.");
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
        if (!artworkFile) return alert('Please select an image.');
        if (!artworkTitle) return alert('Please enter a title.');

        const formData = new FormData();
        formData.append('image', artworkFile);
        formData.append('title', artworkTitle);
        formData.append('description', 'My artwork');
        formData.append('category', 'general');

        try {
            setUploadMsg('Uploading...');
            const res = await fetch(`${BACKEND_URL}/api/artworks`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                setUploadMsg('Art published! 🎨');
                setArtworkTitle('');
                setArtworkFile(null);
                fetchArtworks(designer._id);
            } else {
                const err = await res.json();
                setUploadMsg('Upload failed: ' + err.message);
            }
        } catch (err) {
            console.error("Art publish error:", err);
            setUploadMsg('Error connecting to server.');
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
                        accept="image/*"
                        onChange={(e) => setArtworkFile(e.target.files[0])}
                        required
                    />
                    <button type="submit" className="publish-btn">🚀 Publish to Gallery</button>
                    {uploadMsg && <p className="upload-msg">{uploadMsg}</p>}
                </form>

                <div className="my-public-posts">
                    <h3>My Live Portfolio</h3>
                    <div className="mini-grid">
                        {artworks.length > 0 ? (
                            artworks.map((art, idx) => (
                                <div key={idx} className="mini-post">
                                    <img
                                        src={art.imageUrl}
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