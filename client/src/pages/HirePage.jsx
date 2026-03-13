import React, { useEffect, useState } from 'react';
import './HirePage.css';

const HirePage = () => {
    const [designers, setDesigners] = useState([]);
    const [artworks, setArtworks] = useState([]);
    const [selectedDesigner, setSelectedDesigner] = useState(null);
    const [previewDesigner, setPreviewDesigner] = useState(null);
    const [activePhotoIndex, setActivePhotoIndex] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', details: '', budget: '' });

    const BACKEND_URL = "https://gallery-art-api.onrender.com";

    useEffect(() => {
        const fetchDesigners = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/users`);
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    const onlyDesigners = data.filter(user => user.role === 'designer');
                    setDesigners(onlyDesigners);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        const fetchArtworks = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/artworks`);
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const data = await res.json();
                setArtworks(data);
            } catch (err) {
                console.error("Fetch artworks error:", err);
            }
        };

        fetchDesigners();
        fetchArtworks();
    }, []);

    const getDisplayUrl = (path) => {
        if (!path) return "/default-avatar.png";
        if (path.startsWith('http')) return path;
        return `${BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
    };

    const getDesignerArtworks = (designerId) => {
        return artworks.filter(art =>
            art.createdBy === designerId ||
            art.createdBy?._id === designerId
        );
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this account?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/users/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setDesigners(prev => prev.filter(d => d._id !== id));
                alert("Account deleted successfully.");
            } else {
                alert("Failed to delete.");
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
                                {getDesignerArtworks(designer._id).length > 0 ? (
                                    getDesignerArtworks(designer._id).map((art, index) => (
                                        <img
                                            key={index}
                                            src={art.imageUrl}
                                            className="gallery-img-large clickable-img"
                                            alt={art.title}
                                            onClick={() => {
                                                setPreviewDesigner(designer);
                                                setActivePhotoIndex(index);
                                            }}
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    ))
                                ) : (
                                    <p className="no-work">No work posted yet.</p>
                                )}
                            </div>
                        </div>
                    )) : (
                        <p>Loading designers from Ghana...</p>
                    )}
                </div>
            </main>

            {/* Hire Form Modal */}
            {selectedDesigner && (
                <div className="modal-overlay" onClick={() => setSelectedDesigner(null)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h2>Hire {selectedDesigner.fullName}</h2>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <textarea
                            placeholder="Project Details"
                            value={formData.details}
                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Budget (e.g. $500)"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        />
                        <div className="modal-btns">
                            <button className="send-btn">Send Request</button>
                            <button className="cancel-btn" onClick={() => setSelectedDesigner(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewDesigner && (
                <div className="modal-overlay" onClick={() => setPreviewDesigner(null)}>
                    <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{previewDesigner.fullName}</h2>
                        {getDesignerArtworks(previewDesigner._id).length > 0 && (
                            <img
                                src={getDesignerArtworks(previewDesigner._id)[activePhotoIndex || 0]?.imageUrl}
                                alt="preview"
                                className="preview-img"
                            />
                        )}
                        <button onClick={() => setPreviewDesigner(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HirePage;