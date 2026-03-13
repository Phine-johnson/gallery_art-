const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'designer' }).select('-password');
    res.status(200).json(users || []);
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

exports.updateBio = async (req, res) => {
  try {
    if (!req.body.bio) return res.status(400).json({ message: "Bio content is required" });
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

// ADD these two missing functions that userRoutes.js imports
exports.uploadAvatar = async (req, res) => {
  try {
    // your avatar upload logic here
    res.status(200).json({ message: "Avatar uploaded" });
  } catch (err) {
    console.error("UPLOAD AVATAR ERROR:", err);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};

exports.postArt = async (req, res) => {
  try {
    // your post art logic here
    res.status(200).json({ message: "Art posted" });
  } catch (err) {
    console.error("POST ART ERROR:", err);
    res.status(500).json({ message: "Post art failed" });
  }
};