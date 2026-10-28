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
const ActivityLog = require('../models/ActivityLog');

exports.exportBackup = async (req, res) => {
  try {
    const [
      doctors,
      services,
      serviceCategories,
      facilities,
      blogs,
      blogCategories,
      galleryAlbums,
      galleryItems,
      testimonials,
      faqs,
      banners,
      menus,
      settings,
      homepageSections,
      pages,
    ] = await Promise.all([
      Doctor.find(),
      Service.find(),
      ServiceCategory.find(),
      Facility.find(),
      Blog.find(),
      BlogCategory.find(),
      GalleryAlbum.find(),
      GalleryItem.find(),
      Testimonial.find(),
      FAQ.find(),
      Banner.find(),
      MenuItem.find(),
      Setting.find(),
      HomepageSection.find(),
      Page.find(),
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      clinic: 'Matruka - Complete Care for Her',
      data: {
        doctors,
        services,
        serviceCategories,
        facilities,
        blogs,
        blogCategories,
        galleryAlbums,
        galleryItems,
        testimonials,
        faqs,
        banners,
        menus,
        settings,
        homepageSections,
        pages,
      },
    };

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'system',
      module: 'backup',
      description: 'Exported full database backup',
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=matruka_backup_${Date.now()}.json`);
    res.send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create database backup' });
  }
};

exports.getHealth = async (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
    },
  });
};

