const MenuItem = require('../models/MenuItem');
const ActivityLog = require('../models/ActivityLog');

exports.getAll = async (req, res) => {
  try {
    const menus = await MenuItem.find()
      .populate('parentId', 'label url')
      .sort({ sortOrder: 1, createdAt: 1 });
    res.json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch menus' });
  }
};

exports.create = async (req, res) => {
  try {
    const { label, url } = req.body;
    if (!label || !url) {
      return res.status(400).json({ success: false, error: 'Label and URL are required' });
    }

    const payload = { ...req.body };
    if (!payload.parentId || payload.parentId === 'none' || payload.parentId === '') {
      payload.parentId = null;
    }

    if (payload.sortOrder === undefined || payload.sortOrder === null || payload.sortOrder === 0) {
      const highest = await MenuItem.findOne({ parentId: payload.parentId }).sort({ sortOrder: -1 });
      payload.sortOrder = highest ? (highest.sortOrder || 0) + 1 : 1;
    }

    const item = await MenuItem.create(payload);
    const populated = await MenuItem.findById(item._id).populate('parentId', 'label url');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create menu item' });
  }
};

exports.update = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.parentId || payload.parentId === 'none' || payload.parentId === '' || payload.parentId === req.params.id) {
      payload.parentId = null;
    }

    const item = await MenuItem.findByIdAndUpdate(req.params.id, payload, { new: true })
      .populate('parentId', 'label url');
    if (!item) return res.status(404).json({ success: false, error: 'Menu item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update menu item' });
  }
};

exports.reorder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array is required' });
    }

    const bulkOps = items.map((item) => {
      const updateFields = { sortOrder: Number(item.sortOrder) };
      if (item.parentId !== undefined) {
        updateFields.parentId = (!item.parentId || item.parentId === 'none') ? null : item.parentId;
      }

      return {
        updateOne: {
          filter: { _id: item.id || item._id },
          update: { $set: updateFields },
        },
      };
    });

    await MenuItem.bulkWrite(bulkOps);
    const updatedMenus = await MenuItem.find()
      .populate('parentId', 'label url')
      .sort({ sortOrder: 1, createdAt: 1 });

    res.json({ success: true, message: 'Menus reordered successfully', data: updatedMenus });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to reorder menu items' });
  }
};

exports.remove = async (req, res) => {
  try {
    const target = await MenuItem.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, error: 'Menu item not found' });

    // Set children's parentId to null so they don't have broken dangling parent references
    await MenuItem.updateMany({ parentId: req.params.id }, { $set: { parentId: null } });
    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete menu item' });
  }
};
