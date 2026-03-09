import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DesignerProfile.css';

const DesignerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedWork, setSelectedWork] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Data Store: 20 Unique Designers
  const allDesigners = {
    "0": { name: "Opedia Studio", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800", bio: "Minimalist tech branding and scalable UI systems.", rate: "$50/hr", exp: "8 Years", color: "#0057ff" },
    "1": { name: "Graphéine", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800", bio: "Award-winning French luxury branding and typography.", rate: "$85/hr", exp: "12+ Years", color: "#ff007a" },
    "2": { name: "Andreas Preis", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", bio: "Illustration-heavy branding and street art aesthetics.", rate: "$120/hr", exp: "15 Years", color: "#ffaa00" },
    "3": { name: "Luna Design", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800", bio: "Specializing in organic, eco-friendly brand identities.", rate: "$65/hr", exp: "6 Years", color: "#2ecc71" },
    "4": { name: "Studio Kōshō", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800", bio: "Japanese-inspired editorial and print design specialists.", rate: "$95/hr", exp: "10 Years", color: "#e74c3c" },
    "5": { name: "Arto Matic", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800", bio: "Abstract 3D motion graphics and futuristic UI.", rate: "$150/hr", exp: "9 Years", color: "#9b59b6" },
    "6": { name: "Vibe Creative", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800", bio: "Youth-focused social media content and TikTok ads.", rate: "$45/hr", exp: "4 Years", color: "#f1c40f" },
    "7": { name: "Pixel Peak", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800", bio: "SaaS product design and high-conversion landing pages.", rate: "$110/hr", exp: "11 Years", color: "#3498db" },
    "8": { name: "Moma Studio", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800", bio: "Museum-grade art direction and exhibition design.", rate: "$130/hr", exp: "14 Years", color: "#34495e" },
    "9": { name: "Bold & Co", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800", bio: "Impactful typography for social and political campaigns.", rate: "$80/hr", exp: "7 Years", color: "#e67e22" },
    "10": { name: "Symmetry Lab", img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800", bio: "Mathematical logo systems and architectural grids.", rate: "$90/hr", exp: "10 Years", color: "#1abc9c" },
    "11": { name: "Retro Futura", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800", bio: "Combining 80s synth-wave with modern web tech.", rate: "$75/hr", exp: "8 Years", color: "#fd79a8" },
    "12": { name: "Drift Studio", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800", bio: "Clean, light-filled aesthetics for lifestyle brands.", rate: "$100/hr", exp: "12 Years", color: "#dfe6e9" },
    "13": { name: "The Grid", img: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800", bio: "Precision UI engineering and enterprise software design.", rate: "$140/hr", exp: "13 Years", color: "#2d3436" },
    "14": { name: "Neon Fox", img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800", bio: "Cyberpunk branding and e-sports team identities.", rate: "$55/hr", exp: "5 Years", color: "#6c5ce7" },
    "15": { name: "Earth & Ink", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800", bio: "Hand-drawn logos and artisanal packaging design.", rate: "$70/hr", exp: "9 Years", color: "#a29bfe" },
    "16": { name: "Cubic Form", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800", bio: "Brutalist web design and experimental layouts.", rate: "$115/hr", exp: "11 Years", color: "#fab1a0" },
    "17": { name: "Serene Media", img: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=800", bio: "Accessible design for health and wellness apps.", rate: "$60/hr", exp: "6 Years", color: "#55efc4" },
    "18": { name: "Urban Edge", img: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=800", bio: "Streetwear brand building and marketing.", rate: "$85/hr", exp: "7 Years", color: "#00b894" },
    "19": { name: "Mono Chrome", img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800", bio: "Luxury black and white photography-focused branding.", rate: "$200/hr", exp: "18 Years", color: "#000000" }
  };

  // 2. Logic to identify which designer to show
  const safeIndex = isNaN(parseInt(id)) ? 0 : parseInt(id) % 20;
  const designer = allDesigners[safeIndex.toString()] || allDesigners["0"];

  // 3. Loading Logic (Shows for 1.5 seconds)
  useEffect(() => { 
    window.scrollTo(0, 0); 
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [id]);

  const handleHireMe = () => {
    navigate(`/hire/${safeIndex}`, { state: { designerName: designer.name } });
  };

  const portfolioItems = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/design${id}${i}/1200/900`,
    title: `${designer.name} Masterpiece #${i + 1}`,
  }));

  // Render Loader if data isn't "ready"
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading {designer.name}'s Portfolio...</p>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <section className="why-hire-section" style={{ borderTop: `8px solid ${designer.color}` }}>
        <div className="designer-intro-grid">
          <div className="designer-photo-frame">
            <img src={designer.img} alt={designer.name} className="designer-img" />
            <div className="status-badge" style={{ background: designer.color }}>Online Now</div>
          </div>

          <div className="text-block">
            <h2>I am <span>{designer.name}</span> <br /> Professional Designer</h2>
            <p className="description">{designer.bio}</p>
            <div className="value-props">
              <div className="prop"><strong>✓</strong> Verified Identity</div>
              <div className="prop"><strong>✓</strong> Commercial Rights Included</div>
              <div className="prop"><strong>✓</strong> Source Files (AI, PSD, Figma)</div>
            </div>
          </div>
        </div>

        <div className="stats-highlight">
          <div className="stat-box">
            <h3 style={{color: designer.color}}>{designer.rate}</h3>
            <p>Average Rate</p>
          </div>
          <div className="stat-box">
            <h3 style={{color: designer.color}}>{designer.exp}</h3>
            <p>Experience</p>
          </div>
          <div className="stat-box">
            <h3 style={{color: designer.color}}>100%</h3>
            <p>Success Score</p>
          </div>
        </div>

        <div className="action-row">
          <button 
            className="btn-hire-main" 
            style={{ background: designer.color }}
            onClick={handleHireMe}
          >
            Hire {designer.name}
          </button>
          <div className="social-handles">
            <a href="#ig">📸 Instagram</a>
            <a href="#tw">🐦 Twitter</a>
            <a href="#web">🔗 Website</a>
          </div>
        </div>
      </section>

      <section className="portfolio-section">
        <h2 className="grid-title">Work History <span>({portfolioItems.length} Projects)</span></h2>
        <div className="massive-grid">
          {portfolioItems.map((item) => (
            <div key={item.id} className="work-card" onClick={() => setSelectedWork(item)}>
              <img src={item.url} alt={item.title} loading="lazy" />
              <div className="view-overlay">🔍 View Detail</div>
            </div>
          ))}
        </div>
      </section>

      {selectedWork && (
        <div className="lightbox-overlay" onClick={() => setSelectedWork(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedWork.url} alt="Detail" />
            <div className="lightbox-actions-bar">
              <h3>{selectedWork.title}</h3>
              <button onClick={() => setSelectedWork(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerProfile;