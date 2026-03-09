const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all designers for the Hire page
router.get('/', userController.getAllUsers);

// GET single profile for Dashboard/Profile
router.get('/:id', userController.getProfile);

// UPDATE profile for Dashboard
router.put('/update/:id', userController.updateProfile);

module.exports = router;