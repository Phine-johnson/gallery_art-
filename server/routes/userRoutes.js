const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// IMPORT THE NEW CLOUDINARY CONFIG
const upload = require('../config/cloudinary'); 

// Apply the 'upload.single' middleware to your routes
router.put('/upload-avatar', auth, upload.single('avatar'), userController.uploadAvatar);
router.post('/post-art', auth, upload.single('image'), userController.postArt);

module.exports = router;