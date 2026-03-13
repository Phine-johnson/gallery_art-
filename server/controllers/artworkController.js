const Artwork = require('../models/Artwork');

exports.getArtworks = async (req, res) => {
  try {
    const { title, category } = req.query;
    let filter = {};
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (category) filter.category = category;
    const artworks = await Artwork.find(filter).populate('createdBy', 'name fullName avatar');
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createArtwork = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image is required.' });
    if (!title) return res.status(400).json({ message: 'Title is required.' });

    const artwork = new Artwork({
      title,
      description: description || '',
      category: category || 'general',
      imageUrl: req.file.path,
      createdBy: req.user.id,
    });
    await artwork.save();
    res.status(201).json(artwork);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found.' });
    if (artwork.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    await artwork.deleteOne();
    res.json({ message: 'Artwork deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likeArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found.' });
    const userId = req.user.id;
    const index = artwork.likes.indexOf(userId);
    if (index === -1) {
      artwork.likes.push(userId);
    } else {
      artwork.likes.splice(index, 1);
    }
    await artwork.save();
    res.json({ likes: artwork.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};