import React, { useEffect, useState } from 'react';
import './Inbox.css';

const Inbox = () => {
    const [requests, setRequests] = useState([]);
    const BACKEND_URL = "http://localhost:5000";

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/users/my-requests`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => setRequests(data));
    }, []);

    return (
        <div className="inbox-container">
            <h2>Your Inquiries</h2>
            {requests.map(req => (
                <div key={req._id} className="inbox-card">
                    <h3>From: {req.clientName}</h3>
                    <p>Email: {req.clientEmail}</p>
                    <p>Project: {req.projectDetails}</p>
                    <p>Budget: {req.budget || "Not specified"}</p>
                </div>
            ))}
        </div>
    );
};

export default Inbox;