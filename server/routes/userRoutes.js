const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/userController');

// Route to get a specific designer's profile
router.get('/:id', getProfile);

// Route to update the profile
router.put('/update/:id', updateProfile);

module.exports = router;