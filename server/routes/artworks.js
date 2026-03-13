const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { getArtworks, createArtwork, deleteArtwork, likeArtwork } = require('../controllers/artworkController');
const auth = require('../middleware/auth');

router.get('/', getArtworks);
router.post('/', auth, upload.single('image'), createArtwork);
router.delete('/:id', auth, deleteArtwork);
router.put('/:id/like', auth, likeArtwork);

module.exports = router;