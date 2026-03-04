import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './HireForm.css';

const HireForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const designerName = location.state?.designerName || "the Designer";

  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    projectType: 'Branding',
    budget: '$500 - $1,000',
    description: '',
    deadline: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectMessage = {
      id: Date.now(),
      sender: formData.clientName,
      subject: `🚀 New Brief: ${formData.projectType}`,
      date: new Date().toLocaleDateString(),
      body: `Email: ${formData.email} | Budget: ${formData.budget} | Deadline: ${formData.deadline}\n\nDescription: ${formData.description}`,
      unread: true
    };

    const storageKey = `messages_user_${id}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    localStorage.setItem(storageKey, JSON.stringify([projectMessage, ...existing]));

    alert(`Project Brief sent to ${designerName}!`);
    navigate(`/profile/${id}`);
  };

  return (
    <div className="hire-page-container">
      {/* Background Decorative Elements */}
      <div className="aurora-glow-left"></div>
      <div className="aurora-glow-right"></div>

      <div className="brief-card">
        
        
        <h1 className="form-title">Work with {designerName}</h1>
        <p className="subtitle">Tell us about your project requirements</p>

        <form onSubmit={handleSubmit} className="brief-form">
          <div className="form-grid">
            <div className="input-box">
              <label>Full Name</label>
              <input required type="text" placeholder="John Doe" onChange={(e) => setFormData({...formData, clientName: e.target.value})} />
            </div>
            <div className="input-box">
              <label>Email Address</label>
              <input required type="email" placeholder="john@example.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <div className="form-grid">
            <div className="input-box">
              <label>Project Type</label>
              <select onChange={(e) => setFormData({...formData, projectType: e.target.value})}>
                <option>Branding & Logo</option>
                <option>UI/UX Design</option>
                <option>Illustration</option>
                <option>Motion Graphics</option>
              </select>
            </div>
            <div className="input-box">
              <label>Estimated Budget</label>
              <select onChange={(e) => setFormData({...formData, budget: e.target.value})}>
                <option>$500 - $1,000</option>
                <option>$1,000 - $5,000</option>
                <option>$5,000 - $10,000</option>
              </select>
            </div>
          </div>

          <div className="input-box">
            <label>Project Deadline</label>
            <input type="date" className="date-input" onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
          </div>

          <div className="input-box">
            <label>Detailed Project Brief</label>
            <textarea 
              required
              rows="5" 
              placeholder="Describe your goals and required deliverables..."
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button type="submit" className="send-brief-btn">Send Project Request</button>
        </form>
      </div>
    </div>
  );
};

export default HireForm;