const User = require('../models/User');
const upload = require('../middleware/upload');
const Artwork = require('../models/Artwork');

// --- GET ALL DESIGNERS ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'designer' }).select('-password');
    res.status(200).json(users || []);
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// --- GET PROFILE ---
exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

// --- UPDATE BIO ---
exports.updateBio = async (req, res) => {
  try {
    if (!req.body.bio) return res.status(400).json({ message: "Bio is required" });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bio: req.body.bio },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error("UPDATE BIO ERROR:", err);
    res.status(500).json({ message: "Bio update failed" });
  }
};

// --- DELETE USER ---
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

// --- UPLOAD AVATAR ---
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

// --- POST ART ---
exports.postArt = [
  upload.single('artImage'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No image uploaded" });
      const artwork = await Artwork.create({
        title: req.body.title,
        imageUrl: req.file.path,
        createdBy: req.user.id
      });
      res.status(201).json({ message: "Art posted successfully", artwork });
    } catch (err) {
      console.error("POST ART ERROR:", err);
      res.status(500).json({ message: "Post art failed", error: err.message });
    }
  }
];