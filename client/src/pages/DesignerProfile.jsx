import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DesignerProfile.css';

const DesignerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedWork, setSelectedWork] = useState(null);
  const [designer, setDesigner] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchLiveDesignerData = async () => {
      try {
        // Since you are on Vercel, we use a relative path or your Vercel URL
        // This ensures the "Public Eye" talks to your Vercel Serverless Functions
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error("Designer not found");
        const data = await res.json();
        setDesigner(data);
      } catch (err) {
        console.error("Database fetch failed. Ensure your MONGO_URI is in Vercel Settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveDesignerData();
  }, [id]);

  if (loading) return <div className="loader">Loading Portfolio...</div>;
  if (!designer) return <div className="error-msg">Profile not found. Please check your connection.</div>;

  // This maps through the REAL projects uploaded by the designer in your dashboard
  const portfolioItems = designer.projects || [];

  return (
    <div className="profile-wrapper">
      <section className="why-hire-section" style={{ borderTop: `8px solid ${designer.color || '#0057ff'}` }}>
        <div className="designer-intro-grid">
          <div className="designer-photo-frame">
            <img 
              src={designer.avatar || "https://via.placeholder.com/400"} 
              alt={designer.fullName} 
              className="designer-img" 
            />
            <div className="status-badge" style={{ background: designer.color || '#0057ff' }}>Available Now</div>
          </div>

          <div className="text-block">
            <h2>I am <span>{designer.fullName}</span> <br /> {designer.title || "Professional Designer"}</h2>
            <p className="description">{designer.bio || "No bio provided yet."}</p>
            <div className="value-props">
              <div className="prop"><strong>✓</strong> Verified Identity</div>
              <div className="prop"><strong>✓</strong> Commercial Rights Included</div>
              <div className="prop"><strong>✓</strong> Source Files (AI, PSD, Figma)</div>
            </div>
          </div>
        </div>

        <div className="stats-highlight">
          <div className="stat-box">
            <h3 style={{color: designer.color || '#0057ff'}}>{designer.rate || "$40/hr"}</h3>
            <p>Average Rate</p>
          </div>
          <div className="stat-box">
            <h3 style={{color: designer.color || '#0057ff'}}>{designer.experience || "Expert"}</h3>
            <p>Experience</p>
          </div>
          <div className="stat-box">
            <h3 style={{color: designer.color || '#0057ff'}}>100%</h3>
            <p>Success Score</p>
          </div>
        </div>

        <div className="action-row">
          <button 
            className="btn-hire-main" 
            style={{ background: designer.color || '#0057ff' }} 
            onClick={() => navigate(`/hire/${id}`)}
          >
            Hire {designer.fullName}
          </button>
          <div className="social-handles">
            {designer.instagram && <a href={`https://instagram.com/${designer.instagram}`} target="_blank" rel="noreferrer">📸 Instagram</a>}
            {designer.behance && <a href={`https://behance.net/${designer.behance}`} target="_blank" rel="noreferrer">🔗 Behance</a>}
          </div>
        </div>
      </section>

      {/* Portfolio Grid - Shows REAL work from your MongoDB */}
      <section className="portfolio-section">
        <h2 className="grid-title">Work History & Portfolio</h2>
        <div className="massive-grid">
          {portfolioItems.length > 0 ? (
            portfolioItems.map((item, index) => (
              <div key={item._id || index} className="work-card" onClick={() => setSelectedWork(item)}>
                <img src={item.img} alt={item.title} loading="lazy" />
                <div className="view-overlay">
                  <span>{item.title}</span>
                  <small>🔍 View Detail</small>
                </div>
              </div>
            ))
          ) : (
            <div className="no-work-msg">No works uploaded to the gallery yet.</div>
          )}
        </div>
      </section>

      {/* Lightbox for viewing work details */}
      {selectedWork && (
        <div className="work-lightbox" onClick={() => setSelectedWork(null)}>
           <div className="lightbox-content" onClick={e => e.stopPropagation()}>
              <img src={selectedWork.img} alt={selectedWork.title} />
              <h3>{selectedWork.title}</h3>
              <button className="close-btn" onClick={() => setSelectedWork(null)}>✕ Close</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default DesignerProfile;