const User = require('../models/User');

// FIXED: Added better error logging for Render
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'designer' }).select('-password');
    res.status(200).json(users || []); 
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err); // Look for this in Render Logs
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error("AVATAR UPLOAD ERROR:", err);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};

exports.postArt = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $push: { 
          projects: { 
            title: req.body.title, 
            img: `/uploads/${req.file.filename}` 
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

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

exports.updateBio = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bio: req.body.bio },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};