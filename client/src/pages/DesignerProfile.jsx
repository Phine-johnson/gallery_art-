import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DesignerProfile.css';

const DesignerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedWork, setSelectedWork] = useState(null);
  const [designer, setDesigner] = useState(null); // Dynamic designer state
  const [loading, setLoading] = useState(true);

  // Fallback data (Used only if the backend fails)
  const fallbackDesigners = {
    "2": { name: "Andreas Preis", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", bio: "Illustration-heavy branding.", rate: "$120/hr", exp: "15 Years", color: "#ffaa00" },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchLiveDesignerData = async () => {
      try {
        // Change 'localhost:5000' to your Render/Vercel backend URL later
        const res = await fetch(`http://localhost:5000/api/users/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setDesigner(data);
      } catch (err) {
        console.log("Using fallback data");
        setDesigner(fallbackDesigners[id] || fallbackDesigners["2"]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveDesignerData();
  }, [id]);

  if (loading) return <div className="loader">Loading Profile...</div>;

  const portfolioItems = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/design${id}${i}/1200/900`,
    title: `${designer.name} Work #${i + 1}`,
  }));

  return (
    <div className="profile-wrapper">
      <section className="why-hire-section" style={{ borderTop: `8px solid ${designer.color || '#0057ff'}` }}>
        <div className="designer-intro-grid">
          <div className="designer-photo-frame">
            <img src={designer.img || "https://via.placeholder.com/400"} alt={designer.name} className="designer-img" />
            <div className="status-badge" style={{ background: designer.color || '#0057ff' }}>Online Now</div>
          </div>

          <div className="text-block">
            <h2>I am <span>{designer.name}</span> <br /> Professional Designer</h2>
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
            <h3 style={{color: designer.color}}>{designer.rate || "$50/hr"}</h3>
            <p>Average Rate</p>
          </div>
          <div className="stat-box">
            <h3 style={{color: designer.color}}>{designer.exp || "5 Years"}</h3>
            <p>Experience</p>
          </div>
          <div className="stat-box">
            <h3 style={{color: designer.color}}>100%</h3>
            <p>Success Score</p>
          </div>
        </div>

        <div className="action-row">
          <button className="btn-hire-main" style={{ background: designer.color }} onClick={() => navigate(`/hire/${id}`)}>
            Hire {designer.name}
          </button>
          <div className="social-handles">
            {designer.instagram && <a href={`https://instagram.com/${designer.instagram}`}>📸 Instagram</a>}
            {designer.behance && <a href={`https://behance.net/${designer.behance}`}>🔗 Behance</a>}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="portfolio-section">
        <h2 className="grid-title">Work History</h2>
        <div className="massive-grid">
          {portfolioItems.map((item) => (
            <div key={item.id} className="work-card" onClick={() => setSelectedWork(item)}>
              <img src={item.url} alt={item.title} loading="lazy" />
              <div className="view-overlay">🔍 View Detail</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DesignerProfile;