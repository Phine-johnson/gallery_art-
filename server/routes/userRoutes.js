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

router.get("/", getAllUsers);
router.get("/profile", auth, getProfile);
router.put("/update-bio", auth, updateBio);
router.post("/upload-avatar", auth, uploadAvatar);
router.post("/post-art", auth, postArt);
router.delete("/:id", auth, deleteUser);

module.exports = router;