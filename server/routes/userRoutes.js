const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', userController.getAllUsers);
router.get('/profile', auth, userController.getProfile);
router.post('/upload-avatar', auth, upload.single('image'), userController.uploadAvatar);
router.post('/post-art', auth, upload.single('image'), userController.postArt);

// ADD THIS LINE
router.put('/update-bio', auth, userController.updateBio); 

module.exports = router;