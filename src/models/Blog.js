const mongoose = require('mongoose');

const blogCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

const BlogCategory = mongoose.model('BlogCategory', blogCategorySchema);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: { type: String, default: '/images/blogs/default-blog.jpg' },
    imageAlt: { type: String },
    author: { type: String, default: 'Dr. Kairavi Yagnik' },
    category: { type: String, default: 'Pregnancy & Childbirth' },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'published',
    },
    publishedAt: { type: Date, default: Date.now },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    readTime: { type: String, default: '4 min read' },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

blogSchema.index({ status: 1, publishedAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = { Blog, BlogCategory };
