const MenuItem = require('../models/MenuItem');
const ActivityLog = require('../models/ActivityLog');

exports.getAll = async (req, res) => {
  try {
    const menus = await MenuItem.find().sort({ sortOrder: 1 });
    res.json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch menus' });
  }
};

exports.create = async (req, res) => {
  try {
    const { label, url } = req.body;
    if (!label || !url) return res.status(400).json({ success: false, error: 'Label and URL are required' });

    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create menu item' });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, error: 'Menu item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update menu item' });
  }
};

exports.remove = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete menu item' });
  }
};

