const User = require('../models/User'); // Assuming you have a User model

// GET Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: "User not found" });
    }
};

// UPDATE Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, bio, instagram, behance, avatar } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { 
                fullName: name, // Maps 'name' from frontend to 'fullName' in DB
                bio, 
                instagram, 
                behance, 
                avatar 
            },
            { new: true } // Returns the updated document
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed" });
    }
};