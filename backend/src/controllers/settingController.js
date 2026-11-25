const Setting = require('../models/Setting');
const ActivityLog = require('../models/ActivityLog');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;

    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(updateData);
    } else {
      settings = await Setting.findByIdAndUpdate(
        settings._id,
        { $set: updateData },
        { new: true, runValidators: false }
      );
    }

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'update',
      module: 'settings',
      description: 'Updated website settings',
    });

    res.json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update settings' });
  }
};

