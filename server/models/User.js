const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String },
  bio: { type: String },
  socials: {
    instagram: { type: String },
    behance: { type: String },
    snapchat: { type: String },
    twitter: { type: String },
    facebook: { type: String }
  },
  portfolio: [
    {
      title: String,
      image: String,
      description: String,
      comments: [
        {
          user: String,
          text: String,
          rating: Number
        }
      ],
      recommendations: [String]
    }
  ],
  reviews: [
    {
      reviewer: String,
      rating: Number,
      comment: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
