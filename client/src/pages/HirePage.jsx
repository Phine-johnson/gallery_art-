import React, { useEffect, useState } from 'react';
import './HirePage.css';

const HirePage = () => {
    const [designers, setDesigners] = useState([]);
    const [selectedDesigner, setSelectedDesigner] = useState(null); // For Hire Modal
    const [previewDesigner, setPreviewDesigner] = useState(null);   // For Lightbox logic
    const [activePhotoIndex, setActivePhotoIndex] = useState(null); // Track specific photo in Lightbox
    const [formData, setFormData] = useState({ name: '', email: '', details: '', budget: '' });
    
    const BACKEND_URL = " https://gallery-art-api.onrender.com";

    // 1. Fetch designers on load
    useEffect(() => {
        fetch(`${BACKEND_URL}/api/users`)
            .then(res => res.json())
            .then(data => {
                // Only show users who have the 'designer' role
                const onlyDesigners = data.filter(user => user.role === 'designer');
                setDesigners(onlyDesigners);
            })
            .catch(err => console.error("Server connection error:", err));
    }, []);

    // 2. Helper to format image URLs correctly to match your backend
    const getFullUrl = (path) => {
        if (!path) return "/default-avatar.png";
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${BACKEND_URL}${cleanPath}`;
    };

    // Lightbox Navigation Logic
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
                
                {designers.map(designer => (
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

                        {/* Horizontal Gallery of User Projects */}
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
                ))}
            </main>

            {/* LIGHTBOX VIEWER */}
            {previewDesigner && activePhotoIndex !== null && (
                <div className="lightbox-overlay" onClick={() => setActivePhotoIndex(null)}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-lightbox" onClick={() => setActivePhotoIndex(null)}>×</button>
                        <button className="nav-btn prev" onClick={prevPhoto} disabled={activePhotoIndex === 0}>‹</button>
                        
                        <div className="focused-image-wrapper">
                            <img 
                                src={getFullUrl(previewDesigner.projects[activePhotoIndex].img)} 
                                alt="work" 
                                className="portfolio-large-view"
                            />
                            <div className="lightbox-footer">
                                <h3>{previewDesigner.projects[activePhotoIndex].title}</h3>
                                <span>{activePhotoIndex + 1} / {previewDesigner.projects.length}</span>
                            </div>
                        </div>

                        <button className="nav-btn next" onClick={nextPhoto} disabled={activePhotoIndex === previewDesigner.projects.length - 1}>›</button>
                    </div>
                </div>
            )}

            {/* HIRE MODAL */}
            {selectedDesigner && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Work with {selectedDesigner.fullName}</h2>
                        <form onSubmit={handleHireSubmit}>
                            <input type="text" placeholder="Your Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input type="email" placeholder="Your Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            <textarea placeholder="Project Details" required value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})}></textarea>
                            <input type="text" placeholder="Budget ($)" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                            <div className="modal-btns">
                                <button type="submit" className="send-btn">Send Proposal</button>
                                <button type="button" className="close-btn-modal" onClick={() => setSelectedDesigner(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HirePage;