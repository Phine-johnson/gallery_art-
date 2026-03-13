const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- 1. CONSOLIDATED CORS CONFIGURATION ---
// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',                // Local Dev
  'https://gallery-art-beige.vercel.app'  // Production
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- 2. OTHER MIDDLEWARE ---
app.use(express.json());

// --- 3. ROUTES ---
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/users', require('./routes/userRoutes'));

// Health Check
app.get('/', (req, res) => {
  res.send('GalleryArt API is live and running!');
});

// --- 4. START SERVER ---

// --- 4. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});