const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());

// FIXED: CORS setup to allow your Vercel frontend to talk to this Render backend
app.use(cors()); 

// FIXED: This line allows your phone to see the uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MOUNT ROUTES ---
// Links your auth.js file (Login/Signup) to the /api/auth prefix
app.use('/api/auth', require('./routes/auth')); 

// Links your userRoutes.js (Freelancer list/Profile) to the /api/users prefix
app.use('/api/users', require('./routes/userRoutes'));

// --- DIRECTORY SETUP ---
// Ensure uploads folder exists on Render so image uploads don't crash
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) { 
    fs.mkdirSync(uploadDir); 
}

// --- DATABASE CONNECTION ---
// MONGO_URI must be set in Render Environment Variables
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.log("DB Error:", err));

// --- SERVER START ---
// Render automatically provides a PORT, or defaults to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));