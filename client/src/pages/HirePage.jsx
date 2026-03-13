import React, { useEffect, useState } from 'react';
import './HirePage.css';

const HirePage = () => {
    const [designers, setDesigners] = useState([]);
    const [selectedDesigner, setSelectedDesigner] = useState(null); 
    const [previewDesigner, setPreviewDesigner] = useState(null);   
    const [activePhotoIndex, setActivePhotoIndex] = useState(null); 
    const [formData, setFormData] = useState({ name: '', email: '', details: '', budget: '' });
    
    // Ensure this matches your Render URL exactly
    const BACKEND_URL = "https://gallery-art-api.onrender.com";

    useEffect(() => {
        const fetchDesigners = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/users`);
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const data = await res.json();
                
                if (Array.isArray(data)) {
                    // Filter to show only designers and skip incomplete profiles
                    const onlyDesigners = data.filter(user => user.role === 'designer');
                    setDesigners(onlyDesigners);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        fetchDesigners();
    }, []);

    // Logic to handle Cloudinary URLs vs Legacy Local Paths
    const getDisplayUrl = (path) => {
        if (!path) return "/default-avatar.png";
        if (path.startsWith('http')) return path; // Use Cloudinary link directly
        return `${BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this account? This cannot be undone.")) return;
        
        try {
            const res = await fetch(`${BACKEND_URL}/api/users/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setDesigners(prev => prev.filter(d => d._id !== id));
                alert("Account deleted successfully.");
            } else {
                alert("Failed to delete. Make sure the backend route is ready.");
            }
        } catch (err) {
            console.error("Delete error:", err);
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
                    <label><input type="checkbox" /> Illustration</label>
                </div>
            </aside>

            <main className="hire-content-area">
                <h1>Available Freelancers</h1>
                
                <div className="designers-list">
                    {designers.length > 0 ? designers.map(designer => (
                        <div key={designer._id} className="pro-designer-card">
                            <div className="card-header-top">
                                <img 
                                    src={getDisplayUrl(designer.avatar)} 
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
                                            {designer.fullName || designer.name}
                                        </h2>
                                        <span className="pro-badge">PRO</span>
                                        {/* DELETE BUTTON */}
                                        <button 
                                            onClick={() => handleDelete(designer._id)} 
                                            className="delete-account-btn"
                                            title="Delete Account"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <p className="location-info">📍 Ghana • <span className="avail">Available</span></p>
                                    <p className="designer-bio">{designer.bio || "Creative professional in Ghana."}</p>
                                    <button className="hire-me-btn" onClick={() => setSelectedDesigner(designer)}>
                                        Hire Me
                                    </button>
                                </div>
                            </div>

                            <div className="horizontal-gallery">
                                {designer.projects?.map((project, index) => (
                                    <img 
                                        key={index} 
                                        src={getDisplayUrl(project.img)} 
                                        className="gallery-img-large clickable-img" 
                                        alt="work"
                                        onClick={() => {
                                            setPreviewDesigner(designer);
                                            setActivePhotoIndex(index);
                                        }}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                ))}
                            </div>
                        </div>
                    )) : (
                        <p>Loading designers from Ghana...</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HirePage;