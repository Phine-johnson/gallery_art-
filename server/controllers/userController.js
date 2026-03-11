const User = require('../models/User');

// Get all designers for Hire Page
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'designer' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Upload Profile Picture
exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Avatar upload failed" });
  }
};

// Post Art to the projects array
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
// Update Bio
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