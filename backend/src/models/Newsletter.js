const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    sourcePath: {
      type: String,
      default: '/hospital-location',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);
