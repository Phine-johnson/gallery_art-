const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  title: { type: String, default: "Professional Designer" },
  avatar: { type: String }, // URL to your profile picture
  bio: { type: String },
  instagram: { type: String },
  behance: { type: String },
  // This is where your portfolio "works" live
  projects: [{
    title: String,
    img: String, // URL to the image
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);