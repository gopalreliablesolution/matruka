const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true },
    badgeText: { type: String, default: 'Complete Care For Her' },
    desktopImage: { type: String, required: true },
    mobileImage: { type: String, default: '' },
    primaryBtnText: { type: String, default: 'View Specialities' },
    primaryBtnLink: { type: String, default: '/services' },
    secondaryBtnText: { type: String, default: 'Meet Our Doctors' },
    secondaryBtnLink: { type: String, default: '/doctors' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

bannerSchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('Banner', bannerSchema);

