import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './DesignerProfile.css';

const DesignerProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetches the designer data from the route we created in userRoutes.js
    fetch(`/api/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Designer not found");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Loading Designer Profile...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!user) return <div className="error-msg">User not found</div>;

  return (
    <div className="profile-page-wrapper">
      {/* Header Section */}
      <header className="profile-header">
        <img 
          src={user.avatar || 'https://via.placeholder.com/150'} 
          alt={user.fullName} 
          className="profile-avatar"
        />
        <div className="profile-info">
          <h1>{user.fullName}</h1>
          <h3 className="designer-title">{user.title || 'Professional Designer'}</h3>
          <p className="designer-bio">{user.bio || 'No bio provided yet.'}</p>
          
          <div className="social-links">
            {user.instagram && (
              <a href={user.instagram} target="_blank" rel="noreferrer">Instagram</a>
            )}
            {user.behance && (
              <a href={user.behance} target="_blank" rel="noreferrer">Behance</a>
            )}
          </div>

          <Link to={`/hire/${user._id}`} className="hire-button">
            Hire {user.fullName.split(' ')[0]}
          </Link>
        </div>
      </header>

      <hr className="divider" />

      {/* Portfolio Section: Displays the 'projects' array from your User model */}
      <section className="portfolio-section">
        <h2>Portfolio Projects</h2>
        <div className="projects-grid">
          {user.projects && user.projects.length > 0 ? (
            user.projects.map((project, index) => (
              <div key={index} className="project-card">
                <img src={project.img} alt={project.title} className="project-img" />
                <div className="project-details">
                  <h4>{project.title}</h4>
                  <div className="project-stats">
                    <span>👁️ {project.views || 0}</span>
                    <span>❤️ {project.likes || 0}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-projects">This designer hasn't uploaded any projects yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default DesignerProfile;