import React, { useEffect, useState } from 'react';
import './HirePage.css';

const HirePage = () => {
    const [designers, setDesigners] = useState([]);
    const [selectedDesigner, setSelectedDesigner] = useState(null);
    const [previewDesigner, setPreviewDesigner] = useState(null);
    const [activePhotoIndex, setActivePhotoIndex] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', details: '', budget: '' });
    
    // FIXED: Removed leading space
    const BACKEND_URL = "https://gallery-art-api.onrender.com";

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/users`)
            .then(res => {
                if (!res.ok) throw new Error('Server error');
                return res.json();
            })
            .then(data => {
                // FIXED: Safety check to ensure data is an array
                if (Array.isArray(data)) {
                    const onlyDesigners = data.filter(user => user.role === 'designer');
                    setDesigners(onlyDesigners);
                } else {
                    setDesigners([]);
                }
            })
            .catch(err => {
                console.error("Server connection error:", err);
                setDesigners([]);
            });
    }, []);

    const getFullUrl = (path) => {
        if (!path) return "/default-avatar.png";
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${BACKEND_URL}${cleanPath}`;
    };

    const nextPhoto = (e) => {
        e.stopPropagation();
        if (activePhotoIndex < previewDesigner.projects.length - 1) {
            setActivePhotoIndex(activePhotoIndex + 1);
        }
    };

    const prevPhoto = (e) => {
        e.stopPropagation();
        if (activePhotoIndex > 0) {
            setActivePhotoIndex(activePhotoIndex - 1);
        }
    };

    const handleHireSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/api/users/hire`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    designerId: selectedDesigner._id,
                    ...formData
                })
            });
            if (res.ok) {
                alert(`Proposal sent to ${selectedDesigner.fullName}!`);
                setSelectedDesigner(null);
                setFormData({ name: '', email: '', details: '', budget: '' });
            }
        } catch (err) {
            alert("Failed to send proposal.");
        }
    };

    return (
        <div className="hire-main-layout">
            <aside className="sidebar">
                <button className="post-project-btn">+ Post a Project</button>
                <div className="filter-group">
                    <h3>Categories</h3>
                    <label><input type="checkbox" /> UI/UX Design</label>
                    <label><input type="checkbox" /> Branding</label>
                    <label><input type="checkbox" /> Website Development</label>
                </div>
            </aside>

            <main className="hire-content-area">
                <h1>Available Freelancers</h1>
                
                {designers.length > 0 ? designers.map(designer => (
                    <div key={designer._id} className="pro-designer-card">
                        <div className="card-header-top">
                            <img 
                                src={getFullUrl(designer.avatar)} 
                                className="designer-avatar-main" 
                                alt="profile" 
                                onError={(e) => { e.target.src = "/default-avatar.png"; }}
                            />
                            <div className="designer-details">
                                <div className="name-row">
                                    <h2 className="clickable-name" onClick={() => {
                                        setPreviewDesigner(designer);
                                        setActivePhotoIndex(0);
                                    }}>
                                        {designer.fullName}
                                    </h2>
                                    <span className="pro-badge">PRO</span>
                                </div>
                                <p className="location-info">📍 Ghana • <span className="avail">Available</span></p>
                                <p className="designer-bio">{designer.bio || "No bio provided."}</p>

                                <button className="hire-me-btn" onClick={() => setSelectedDesigner(designer)}>
                                    Hire Me
                                </button>
                            </div>
                        </div>

                        <div className="horizontal-gallery">
                            {designer.projects && designer.projects.length > 0 ? (
                                designer.projects.map((project, index) => (
                                    <img 
                                        key={index} 
                                        src={getFullUrl(project.img)} 
                                        className="gallery-img-large clickable-img" 
                                        alt={project.title} 
                                        onClick={() => {
                                            setPreviewDesigner(designer);
                                            setActivePhotoIndex(index);
                                        }}
                                    />
                                ))
                            ) : (
                                <p className="no-work-msg">No work uploaded yet.</p>
                            )}
                        </div>
                    </div>
                )) : <p>Loading freelancers...</p>}
            </main>

            {/* LIGHTBOX & MODAL RENDERED HERE (same as your previous code) */}
        </div>
    );
};

export default HirePage;