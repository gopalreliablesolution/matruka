const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ServiceCategory = mongoose.model('ServiceCategory', serviceCategorySchema);

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, default: 'Maternity Care' },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    featuredImage: { type: String, default: '/images/services/default-service.jpg' },
    additionalImages: { type: [String], default: [] },
    treatments: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, isPublished: 1, sortOrder: 1 });

const Service = mongoose.model('Service', serviceSchema);

module.exports = { Service, ServiceCategory };
