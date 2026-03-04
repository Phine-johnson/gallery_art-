const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getArtworks, createArtwork, deleteArtwork, likeArtwork } = require('../controllers/artworkController');
const auth = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get('/', getArtworks);
router.post('/', auth, upload.single('image'), createArtwork);
router.delete('/:id', auth, deleteArtwork);
router.put('/:id/like', auth, likeArtwork);

module.exports = router;
