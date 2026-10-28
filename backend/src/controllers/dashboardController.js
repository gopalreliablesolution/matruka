const Doctor = require('../models/Doctor');
const { Service } = require('../models/Service');
const Facility = require('../models/Facility');
const { Blog } = require('../models/Blog');
const { GalleryAlbum, GalleryItem } = require('../models/GalleryAlbum');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const Media = require('../models/Media');
const ActivityLog = require('../models/ActivityLog');

exports.getStats = async (req, res) => {
  try {
    const [
      doctorsTotal,
      doctorsPublished,
      servicesTotal,
      servicesPublished,
      facilitiesTotal,
      blogsTotal,
      blogsPublished,
      blogsDraft,
      albumsTotal,
      galleryItemsTotal,
      testimonialsTotal,
      faqsTotal,
      mediaTotal,
      recentActivity,
    ] = await Promise.all([
      Doctor.countDocuments(),
      Doctor.countDocuments({ isPublished: true }),
      Service.countDocuments(),
      Service.countDocuments({ isPublished: true }),
      Facility.countDocuments(),
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'draft' }),
      GalleryAlbum.countDocuments(),
      GalleryItem.countDocuments(),
      Testimonial.countDocuments(),
      FAQ.countDocuments(),
      Media.countDocuments(),
      ActivityLog.find().sort({ timestamp: -1 }).limit(10),
    ]);

    res.json({
      success: true,
      data: {
        counts: {
          doctors: { total: doctorsTotal, published: doctorsPublished },
          services: { total: servicesTotal, published: servicesPublished },
          facilities: { total: facilitiesTotal },
          blogs: { total: blogsTotal, published: blogsPublished, draft: blogsDraft },
          gallery: { albums: albumsTotal, items: galleryItemsTotal },
          testimonials: { total: testimonialsTotal },
          faqs: { total: faqsTotal },
          media: { total: mediaTotal },
        },
        recentActivity,
        system: {
          status: 'online',
          db: 'MongoDB Connected',
          uptime: Math.round(process.uptime()),
          nodeVersion: process.version,
          memoryUsage: process.memoryUsage(),
        },
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve dashboard stats' });
  }
};

