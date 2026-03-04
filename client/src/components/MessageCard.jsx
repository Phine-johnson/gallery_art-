/* src/components/MessageCard.jsx */
import React from 'react';

const MessageCard = ({ req, onAccept, onDecline }) => {
  return (
    <div className="message-card">
      <div className="client-info">
        <span className={`status-pill ${req.status.toLowerCase()}`}>{req.status}</span>
        <h3>{req.client}</h3>
        <p>Project: <strong>{req.service}</strong></p>
      </div>
      <div className="message-actions">
        <span className="budget-tag">{req.budget}</span>
        {/* These buttons trigger the logic to update your Dashboard stats */}
        <button className="btn-accept" onClick={() => onAccept(req.id, req.budget)}>
          Accept & Earn
        </button>
        <button className="btn-decline" onClick={() => onDecline(req.id)}>
          Decline
        </button>
      </div>
    </div>
  );
};

export default MessageCard;