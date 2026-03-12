const express = require("express");
const router = express.Router(); // This defines 'router' so the error goes away

const {
  getAllUsers,
  uploadAvatar,
  postArt,
  getProfile,
  updateBio,
  deleteUser
} = require("../controllers/userController");

const auth = require("../middleware/auth");

// routes
router.get("/", getAllUsers);
router.get("/profile", auth, getProfile);

// Ensure these match your frontend fetch calls
router.put("/update-bio", auth, updateBio); 
router.post("/upload-avatar", auth, uploadAvatar);
router.post("/post-art", auth, postArt);

router.delete("/:id", deleteUser);

module.exports = router;