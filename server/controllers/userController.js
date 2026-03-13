const User = require('../models/User');

// --- GET ALL DESIGNERS ---
exports.getAllUsers = async (req, res) => {
  try {
    // Note: If you get a 500 here, check if your MongoDB connection is active
    const users = await User.find({ role: 'designer' }).select('-password');
    res.status(200).json(users || []);
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// --- GET LOGGED-IN USER PROFILE ---
exports.getProfile = async (req, res) => {
  try {
    // Safety check: ensure auth middleware actually provided a user
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found in database" });
    
    res.json(user);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

// --- UPDATE BIO ---
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

// --- DELETE USER ACCOUNT ---
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