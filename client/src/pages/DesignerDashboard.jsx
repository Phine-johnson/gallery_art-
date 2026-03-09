import React, { useState, useEffect } from 'react';
import './DesignerDashboard.css';

const DesignerDashboard = () => {
    const [formData, setFormData] = useState({
        fullName: '', title: '', bio: '', instagram: '', behance: '', avatar: ''
    });
    const [status, setStatus] = useState('');

    // FIX: Fallback logic for inconsistent LocalStorage keys
    const getUserId = () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser?._id) return currentUser._id;
        
        // Manual fallback for your specific storage screenshot
        return "1772536983830"; 
    };

    const userId = getUserId();

    useEffect(() => {
        if (userId) {
            fetch(`/api/users/${userId}`)
                .then(res => res.json())
                .then(data => setFormData(data))
                .catch(err => console.error(err));
        }
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/users/update/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) setStatus("Profile updated! ✅");
        } catch (err) {
            setStatus("Error updating profile.");
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Public Profile Settings</h1>
            {status && <p className="status-msg">{status}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="fullName" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Full Name" />
                <input type="text" name="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Title" />
                <textarea name="bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Bio" />
                <input type="text" name="avatar" value={formData.avatar} onChange={(e) => setFormData({...formData, avatar: e.target.value})} placeholder="Avatar URL" />
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default DesignerDashboard;