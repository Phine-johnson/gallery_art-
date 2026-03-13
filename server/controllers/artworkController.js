const Artwork = require('../models/Artwork');
const User = require('../models/User');

exports.getArtworks = async (req, res, next) => {
  try {
    const { title, category } = req.query;
    let filter = {};
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (category) filter.category = category;
    const artworks = await Artwork.find(filter).populate('createdBy', 'name');
    res.json(artworks);
  } catch (err) {
    next(err);
  }
};

exports.createArtwork = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image is required.' });
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Use Cloudinary URL instead of local path
    const imageUrl = req.file.path;

    const artwork = new Artwork({
      title,
      description,
      category,
      imageUrl,
      createdBy: req.user.id,
    });
    await artwork.save();
    res.status(201).json(artwork);
  } catch (err) {
    next(err);
  }
};

exports.deleteArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found.' });
    if (artwork.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    await artwork.deleteOne();
    res.json({ message: 'Artwork deleted.' });
  } catch (err) {
    next(err);
  }
};

exports.likeArtwork = async (req, res, next) => {
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
    next(err);
  }
};