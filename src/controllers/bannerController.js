const Banner = require('../models/Banner');
const ActivityLog = require('../models/ActivityLog');

exports.getAll = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch banners' });
  }
};

exports.getById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, error: 'Banner not found' });
    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch banner' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, subtitle, desktopImage } = req.body;
    if (!title || !subtitle || !desktopImage) {
      return res.status(400).json({ success: false, error: 'Title, subtitle, and desktop image are required' });
    }

    const banner = await Banner.create(req.body);

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'create',
      module: 'banners',
      description: `Created banner: ${banner.title}`,
    });

    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create banner' });
  }
};

exports.update = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ success: false, error: 'Banner not found' });
    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update banner' });
  }
};

exports.remove = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete banner' });
  }
};

