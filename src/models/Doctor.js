const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    designation: { type: String, required: true, trim: true },
    qualifications: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    experienceYears: { type: Number, default: 10 },
    bio: { type: String, required: true },
    areasOfExpertise: { type: [String], default: [] },
    fellowshipsAndCertifications: { type: [String], default: [] },
    opdTimings: { type: String, default: '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Mon - Sat)' },
    profileImage: { type: String, default: '/images/doctors/default-doctor.jpg' },
    phone: { type: String },
    email: { type: String },
    isFeatured: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

doctorSchema.index({ sortOrder: 1, isPublished: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);
