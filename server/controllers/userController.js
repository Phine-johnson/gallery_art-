const User = require('../models/User');

// --- GET ALL DESIGNERS ---
exports.getAllUsers = async (req, res) => {
  try {
    // Finds all users with the role 'designer'
    const users = await User.find({ role: 'designer' }).select('-password');
    res.status(200).json(users || []);
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// --- UPLOAD PROFILE PICTURE (AVATAR) ---
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // FIXED: req.file.path now contains the full Cloudinary HTTPS URL
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.path }, 
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error("AVATAR UPLOAD ERROR:", err);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};

// --- POST NEW ARTWORK TO PORTFOLIO ---
exports.postArt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // FIXED: Instead of a local path, we push the Cloudinary URL to the array
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $push: { 
          projects: { 
            title: req.body.title || "Untitled", 
            img: req.file.path // Permanent URL from Cloudinary
          } 
        } 
      },
      { new: true }
    );

    res.json(user.projects);
  } catch (err) {
    console.error("POST ART ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// --- GET LOGGED-IN USER PROFILE ---
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// --- UPDATE BIO ---
exports.updateBio = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bio: req.body.bio },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Bio update failed" });
  }
};
// --- DELETE USER ACCOUNT ---
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};