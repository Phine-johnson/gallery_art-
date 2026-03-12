const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. MUST BE AT THE TOP: Specific CORS config
app.use(cors({
  origin: 'https://gallery-art-beige.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// 2. Routes
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/users', require('./routes/userRoutes'));

// 3. Health Check
app.get('/', (req, res) => {
  res.send('GalleryArt API is live and running!');
});

// 4. Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const allowedOrigins = [
  'http://localhost:5173',                 // Your local development
  'https://gallery-art-beige.vercel.app'   // Your production site
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));