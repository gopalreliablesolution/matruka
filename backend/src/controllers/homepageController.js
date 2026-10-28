const HomepageSection = require('../models/HomepageSection');
const ActivityLog = require('../models/ActivityLog');

exports.getSections = async (req, res) => {
  try {
    const sections = await HomepageSection.find().sort({ sortOrder: 1 });
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch homepage sections' });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const section = await HomepageSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!section) return res.status(404).json({ success: false, error: 'Section not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'update',
      module: 'homepage',
      description: `Updated homepage section: ${section.name}`,
    });

    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update section' });
  }
};

exports.bulkUpdateOrder = async (req, res) => {
  try {
    const { sections } = req.body; // Array of { id, sortOrder, isEnabled }
    if (!Array.isArray(sections)) {
      return res.status(400).json({ success: false, error: 'Sections array is required' });
    }

    const updates = sections.map((sec) =>
      HomepageSection.findByIdAndUpdate(sec.id, {
        sortOrder: sec.sortOrder,
        isEnabled: sec.isEnabled !== undefined ? sec.isEnabled : true,
      })
    );
    await Promise.all(updates);

    res.json({ success: true, message: 'Homepage sections reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to reorder sections' });
  }
};

