const mongoose = require('mongoose');

const galleryAlbumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, default: 'Facilities' },
    coverImage: { type: String, default: '/images/gallery/default-cover.jpg' },
    description: { type: String },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const GalleryAlbum = mongoose.model('GalleryAlbum', galleryAlbumSchema);

const galleryItemSchema = new mongoose.Schema(
  {
    albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'GalleryAlbum' },
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    category: { type: String, default: 'Facilities' },
    caption: { type: String },
    altText: { type: String },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

galleryItemSchema.index({ albumId: 1, sortOrder: 1, isPublished: 1 });

const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);

module.exports = { GalleryAlbum, GalleryItem };

