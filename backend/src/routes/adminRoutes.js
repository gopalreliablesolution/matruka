const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Controllers
const authCtrl = require('../controllers/authController');
const dashboardCtrl = require('../controllers/dashboardController');
const doctorCtrl = require('../controllers/doctorController');
const serviceCtrl = require('../controllers/serviceController');
const facilityCtrl = require('../controllers/facilityController');
const blogCtrl = require('../controllers/blogController');
const galleryCtrl = require('../controllers/galleryController');
const testimonialCtrl = require('../controllers/testimonialController');
const faqCtrl = require('../controllers/faqController');
const bannerCtrl = require('../controllers/bannerController');
const menuCtrl = require('../controllers/menuController');
const mediaCtrl = require('../controllers/mediaController');
const settingCtrl = require('../controllers/settingController');
const homepageCtrl = require('../controllers/homepageController');
const pageCtrl = require('../controllers/pageController');
const userCtrl = require('../controllers/userController');
const activityLogCtrl = require('../controllers/activityLogController');
const backupCtrl = require('../controllers/backupController');

// Public Auth routes
router.post('/auth/login', authCtrl.login);
router.post('/auth/logout', authCtrl.logout);

// Protected routes (All below require JWT token)
router.use(protect);
router.get('/auth/me', authCtrl.getMe);
router.get('/dashboard/stats', dashboardCtrl.getStats);
router.get('/dashboard', dashboardCtrl.getStats);

// Local Media upload on server (Multer disk storage)
router.post('/media/upload', upload.single('file'), mediaCtrl.uploadFile);
router.get('/media', mediaCtrl.getAll);
router.delete('/media/:id', mediaCtrl.remove);

// Doctors
router.get('/doctors', doctorCtrl.getAll);
router.get('/doctors/:id', doctorCtrl.getById);
router.post('/doctors', doctorCtrl.create);
router.put('/doctors/:id', doctorCtrl.update);
router.delete('/doctors/:id', doctorCtrl.remove);

// Services & Categories
router.get('/services', serviceCtrl.getAll);
router.get('/services/categories', serviceCtrl.getCategories);
router.post('/services/categories', serviceCtrl.createCategory);
router.delete('/services/categories/:id', serviceCtrl.deleteCategory);
router.get('/services/:id', serviceCtrl.getById);
router.post('/services', serviceCtrl.create);
router.put('/services/:id', serviceCtrl.update);
router.delete('/services/:id', serviceCtrl.remove);

// Facilities
router.get('/facilities', facilityCtrl.getAll);
router.get('/facilities/:id', facilityCtrl.getById);
router.post('/facilities', facilityCtrl.create);
router.put('/facilities/:id', facilityCtrl.update);
router.delete('/facilities/:id', facilityCtrl.remove);

// Blogs & Categories
router.get('/blogs', blogCtrl.getAll);
router.get('/blogs/categories', blogCtrl.getCategories);
router.post('/blogs/categories', blogCtrl.createCategory);
router.get('/blogs/:id', blogCtrl.getById);
router.post('/blogs', blogCtrl.create);
router.put('/blogs/:id', blogCtrl.update);
router.delete('/blogs/:id', blogCtrl.remove);

// Gallery & Albums
router.get('/gallery', galleryCtrl.getItems);
router.post('/gallery', galleryCtrl.createItem);
router.put('/gallery/:id', galleryCtrl.updateItem);
router.delete('/gallery/:id', galleryCtrl.deleteItem);
router.get('/gallery/albums', galleryCtrl.getAlbums);
router.post('/gallery/albums', galleryCtrl.createAlbum);
router.delete('/gallery/albums/:id', galleryCtrl.deleteAlbum);

// Testimonials
router.get('/testimonials', testimonialCtrl.getAll);
router.get('/testimonials/:id', testimonialCtrl.getById);
router.post('/testimonials', testimonialCtrl.create);
router.put('/testimonials/:id', testimonialCtrl.update);
router.delete('/testimonials/:id', testimonialCtrl.remove);

// FAQs
router.get('/faqs', faqCtrl.getAll);
router.get('/faqs/:id', faqCtrl.getById);
router.post('/faqs', faqCtrl.create);
router.put('/faqs/:id', faqCtrl.update);
router.delete('/faqs/:id', faqCtrl.remove);

// Banners
router.get('/banners', bannerCtrl.getAll);
router.get('/banners/:id', bannerCtrl.getById);
router.post('/banners', bannerCtrl.create);
router.put('/banners/:id', bannerCtrl.update);
router.delete('/banners/:id', bannerCtrl.remove);

// Menus
router.get('/menus', menuCtrl.getAll);
router.post('/menus', menuCtrl.create);
router.put('/menus/:id', menuCtrl.update);
router.delete('/menus/:id', menuCtrl.remove);

// Settings
router.get('/settings', settingCtrl.getSettings);
router.put('/settings', settingCtrl.updateSettings);

// Homepage Sections
router.get('/homepage-sections', homepageCtrl.getSections);
router.put('/homepage-sections/reorder', homepageCtrl.bulkUpdateOrder);
router.put('/homepage-sections/:id', homepageCtrl.updateSection);

// Pages
router.get('/pages', pageCtrl.getAll);
router.get('/pages/:slug', pageCtrl.getBySlug);
router.post('/pages', pageCtrl.create);
router.put('/pages/:id', pageCtrl.update);
router.delete('/pages/:id', pageCtrl.remove);

// Activity Logs
router.get('/activity-logs', activityLogCtrl.getLogs);

// System Backup & Health (Super admin only)
router.get('/backup/export', authorize('super_admin', 'admin'), backupCtrl.exportBackup);
router.get('/system/health', backupCtrl.getHealth);

// Admin Users (Super admin only)
router.get('/users', authorize('super_admin'), userCtrl.getAll);
router.post('/users', authorize('super_admin'), userCtrl.create);
router.put('/users/:id', authorize('super_admin'), userCtrl.update);
router.delete('/users/:id', authorize('super_admin'), userCtrl.remove);

module.exports = router;
