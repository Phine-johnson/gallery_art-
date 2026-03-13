const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  uploadAvatar,
  postArt,
  getProfile,
  updateBio,
  deleteUser
} = require("../controllers/userController");

const auth = require("../middleware/auth");

// Public routes
router.get("/", getAllUsers);

// Protected routes (require 'auth' middleware)
router.get("/profile", auth, getProfile);
router.put("/update-bio", auth, updateBio); 
router.post("/upload-avatar", auth, uploadAvatar);
router.post("/post-art", auth, postArt);

// Admin/System routes
router.delete("/:id", auth, deleteUser); // Added auth for security

module.exports = router;