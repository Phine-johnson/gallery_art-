const User = require('../models/User');
const upload = require('../utils/upload'); // your multer/cloudinary config
const Artwork = require('../models/Artwork'); // you'll need this model

exports.postArt = [
  upload.single('artImage'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No image uploaded" });

      const artwork = await Artwork.create({
        title: req.body.title,
        imageUrl: req.file.path,
        designer: req.user.id
      });

      res.status(201).json({ message: "Art posted successfully", artwork });
    } catch (err) {
      console.error("POST ART ERROR:", err);
      res.status(500).json({ message: "Post art failed", error: err.message });
    }
  }
];

exports.uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No image uploaded" });

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: req.file.path },
        { new: true }
      ).select('-password');

      res.status(200).json({ message: "Avatar uploaded", user });
    } catch (err) {
      console.error("UPLOAD AVATAR ERROR:", err);
      res.status(500).json({ message: "Avatar upload failed" });
    }
  }
];