const Page = require('../models/Page');
const ActivityLog = require('../models/ActivityLog');

exports.getAll = async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch pages' });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ success: false, error: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch page' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, heroTitle } = req.body;
    if (!title || !heroTitle) return res.status(400).json({ success: false, error: 'Title and hero title are required' });

    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const page = await Page.create({ ...req.body, slug });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'create',
      module: 'pages',
      description: `Created page: ${page.title} (${page.slug})`,
    });

    res.status(201).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create page' });
  }
};

exports.update = async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!page) return res.status(404).json({ success: false, error: 'Page not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'update',
      module: 'pages',
      description: `Updated page: ${page.title}`,
    });

    res.json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update page' });
  }
};

exports.remove = async (req, res) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Page deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete page' });
  }
};

