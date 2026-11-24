const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true },
    subtitle: { type: String, default: '', trim: true },
    badgeText: { type: String, default: '', trim: true },
    desktopImage: { type: String, default: '/images/hero/serene-maternity-moment-at-home.png' },
    mobileImage: { type: String, default: '', trim: true },
    primaryBtnText: { type: String, default: '', trim: true },
    primaryBtnLink: { type: String, default: '', trim: true },
    secondaryBtnText: { type: String, default: '', trim: true },
    secondaryBtnLink: { type: String, default: '', trim: true },
    showContent: { type: Boolean, default: true },
    bannerLinkUrl: { type: String, default: '', trim: true },
    openInNewTab: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

bannerSchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('Banner', bannerSchema);
