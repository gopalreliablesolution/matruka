const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    icon: { type: String, default: 'HeartHandshake' },
    image: { type: String, default: '/images/facilities/default.jpg' },
    features: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

facilitySchema.index({ sortOrder: 1, isPublished: 1 });

module.exports = mongoose.model('Facility', facilitySchema);

