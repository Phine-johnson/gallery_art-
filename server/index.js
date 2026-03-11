const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// Serves the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MOUNT ROUTES ---
// This was missing! It links your auth.js file to the /api/auth prefix
app.use('/api/auth', require('./routes/auth')); 

// Existing user routes
app.use('/api/users', require('./routes/userRoutes'));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) { fs.mkdirSync(uploadDir); }

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.log("DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));