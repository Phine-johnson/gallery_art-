const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET user profile
router.get('/:id', userController.getProfile);

// UPDATE user profile
router.put('/update/:id', userController.updateProfile);

module.exports = router;