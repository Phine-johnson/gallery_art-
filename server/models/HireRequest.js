const mongoose = require('mongoose');

const HireRequestSchema = new mongoose.Schema({
    // Links the message to the specific Designer's account
    designerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    clientName: { 
        type: String, 
        required: true 
    },
    clientEmail: { 
        type: String, 
        required: true 
    },
    projectDetails: { 
        type: String, 
        required: true 
    },
    budget: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'declined'], 
        default: 'pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('HireRequest', HireRequestSchema);