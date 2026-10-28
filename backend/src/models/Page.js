const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    heroTitle: { type: String, required: true },
    heroSubtitle: { type: String, default: '' },
    content: { type: String, default: '' },
    sections: [
      {
        title: { type: String, required: true },
        subtitle: { type: String, default: '' },
        content: { type: String, required: true },
        imageUrl: { type: String, default: '' },
        sortOrder: { type: Number, default: 0 },
      },
    ],
    isPublished: { type: Boolean, default: true },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

pageSchema.index({ slug: 1 });

module.exports = mongoose.model('Page', pageSchema);

