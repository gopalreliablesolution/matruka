const mongoose = require('mongoose');

const homepageSectionSchema = new mongoose.Schema(
  {
    sectionKey: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    badgeText: { type: String, default: '' },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    isEnabled: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

homepageSectionSchema.index({ sortOrder: 1, isEnabled: 1 });

module.exports = mongoose.model('HomepageSection', homepageSectionSchema);

