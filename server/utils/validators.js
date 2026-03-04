// Centralized error handler (already used in index.js)
// Add more utilities as needed for validation, etc.

exports.validateArtworkInput = (req, res, next) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  next();
};
