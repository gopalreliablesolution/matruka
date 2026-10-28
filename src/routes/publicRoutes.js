const express = require('express');
const router = express.Router();

const Doctor = require('../models/Doctor');
const { Service, ServiceCategory } = require('../models/Service');
const Facility = require('../models/Facility');
const { Blog, BlogCategory } = require('../models/Blog');
const { GalleryAlbum, GalleryItem } = require('../models/GalleryAlbum');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const Banner = require('../models/Banner');
const MenuItem = require('../models/MenuItem');
const Setting = require('../models/Setting');
const HomepageSection = require('../models/HomepageSection');
const Page = require('../models/Page');

// 1. Aggregated Homepage & Navigation Data
router.get('/home-data', async (req, res) => {
  try {
    const [
      settings,
      sections,
      banners,
      headerMenus,
      footerMenus,
      featuredDoctors,
      featuredServices,
      facilities,
      testimonials,
      recentBlogs,
      faqs,
      galleryPreview,
    ] = await Promise.all([
      Setting.findOne(),
      HomepageSection.find({ isEnabled: true }).sort({ sortOrder: 1 }),
      Banner.find({ isActive: true }).sort({ sortOrder: 1 }),
      MenuItem.find({ isHeader: true, isActive: true }).sort({ sortOrder: 1 }),
      MenuItem.find({ isFooter: true, isActive: true }).sort({ sortOrder: 1 }),
      Doctor.find({ isPublished: true, isFeatured: true }).sort({ sortOrder: 1 }),
      Service.find({ isPublished: true, isFeatured: true }).sort({ sortOrder: 1 }),
      Facility.find({ isPublished: true }).sort({ sortOrder: 1 }).limit(6),
      Testimonial.find({ isPublished: true, isFeatured: true }).sort({ sortOrder: 1 }).limit(6),
      Blog.find({ status: 'published' }).sort({ publishedAt: -1 }).limit(3),
      FAQ.find({ isPublished: true }).sort({ sortOrder: 1 }).limit(6),
      GalleryItem.find({ isPublished: true }).sort({ sortOrder: 1 }).limit(8),
    ]);

    res.json({
      success: true,
      data: {
        settings: settings || {},
        sections: sections || [],
        banners: banners || [],
        navigation: {
          header: headerMenus || [],
          footer: footerMenus || [],
        },
        featuredDoctors,
        featuredServices,
        facilities,
        testimonials,
        recentBlogs,
        faqs,
        galleryPreview,
      },
    });
  } catch (error) {
    console.error('Home data error:', error);
    res.status(500).json({ success: false, error: 'Failed to load home data' });
  }
});

// 2. Settings (Header, Footer, Contact info)
router.get('/settings', async (req, res) => {
  try {
    const settings = await Setting.findOne();
    res.json({ success: true, data: settings || {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
});

// 3. Navigation Menus
router.get('/navigation', async (req, res) => {
  try {
    const [header, footer] = await Promise.all([
      MenuItem.find({ isHeader: true, isActive: true }).sort({ sortOrder: 1 }),
      MenuItem.find({ isFooter: true, isActive: true }).sort({ sortOrder: 1 }),
    ]);
    res.json({ success: true, data: { header, footer } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch navigation' });
  }
});

// 4. Doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch doctors' });
  }
});

router.get('/doctors/:slug', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ slug: req.params.slug, isPublished: true });
    if (!doctor) return res.status(404).json({ success: false, error: 'Doctor profile not found' });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch doctor profile' });
  }
});

// 5. Services
router.get('/services', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;

    const [services, categories] = await Promise.all([
      Service.find(query).sort({ sortOrder: 1, createdAt: -1 }),
      ServiceCategory.find().sort({ sortOrder: 1 }),
    ]);

    res.json({ success: true, data: { services, categories } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch services' });
  }
});

router.get('/services/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isPublished: true });
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });

    // Fetch related services in the same category
    const related = await Service.find({
      category: service.category,
      _id: { $ne: service._id },
      isPublished: true,
    }).limit(3);

    res.json({ success: true, data: { service, related } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch service detail' });
  }
});

// 6. Facilities
router.get('/facilities', async (req, res) => {
  try {
    const facilities = await Facility.find({ isPublished: true }).sort({ sortOrder: 1 });
    res.json({ success: true, data: facilities });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch facilities' });
  }
});

router.get('/facilities/:slug', async (req, res) => {
  try {
    const facility = await Facility.findOne({ slug: req.params.slug, isPublished: true });
    if (!facility) return res.status(404).json({ success: false, error: 'Facility not found' });
    res.json({ success: true, data: facility });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch facility' });
  }
});

// 7. Blogs
router.get('/blogs', async (req, res) => {
  try {
    const { category, page = 1, limit = 9 } = req.query;
    const query = { status: 'published' };
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [blogs, total, categories] = await Promise.all([
      Blog.find(query).sort({ publishedAt: -1 }).skip(skip).limit(parseInt(limit)),
      Blog.countDocuments(query),
      BlogCategory.find().sort({ name: 1 }),
    ]);

    res.json({
      success: true,
      data: {
        blogs,
        categories,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch blogs' });
  }
});

router.get('/blogs/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    if (!blog) return res.status(404).json({ success: false, error: 'Article not found' });

    // Increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    const related = await Blog.find({
      category: blog.category,
      _id: { $ne: blog._id },
      status: 'published',
    }).limit(3);

    res.json({ success: true, data: { blog, related } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch blog article' });
  }
});

// 8. Gallery
router.get('/gallery', async (req, res) => {
  try {
    const { albumId, category } = req.query;
    const query = { isPublished: true };
    if (albumId) query.albumId = albumId;
    if (category) query.category = category;

    const [items, albums] = await Promise.all([
      GalleryItem.find(query).sort({ sortOrder: 1, createdAt: -1 }),
      GalleryAlbum.find({ isPublished: true }).sort({ sortOrder: 1 }),
    ]);

    res.json({ success: true, data: { items, albums } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch gallery' });
  }
});

// 9. Testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch testimonials' });
  }
});

// 10. FAQs
router.get('/faqs', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;

    const faqs = await FAQ.find(query).sort({ sortOrder: 1 });
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch FAQs' });
  }
});

// 11. Pages (About, Contact, Privacy, Terms)
router.get('/pages/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isPublished: true });
    if (!page) return res.status(404).json({ success: false, error: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch page' });
  }
});

module.exports = router;

