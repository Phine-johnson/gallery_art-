const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  title: { type: String, default: "Professional Designer" },
  avatar: { type: String, default: '' },
 bio: { type: String, default: 'Professional Designer from Ghana' }, // Added bio field
  role: {
    type: String,
    enum: ['user', 'designer', 'admin'],
    default: 'user'
  },
  
  projects: [{
    title: String,
    img: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('User', userSchema);