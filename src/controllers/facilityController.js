const Facility = require('../models/Facility');
const ActivityLog = require('../models/ActivityLog');

exports.getAll = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }
    const facilities = await Facility.find(query).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: facilities });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch facilities' });
  }
};

exports.getById = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ success: false, error: 'Facility not found' });
    res.json({ success: true, data: facility });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch facility' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, shortDescription, fullDescription } = req.body;
    if (!name || !shortDescription || !fullDescription) {
      return res.status(400).json({ success: false, error: 'Name, short and full description are required' });
    }

    let slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const exists = await Facility.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const facility = await Facility.create({ ...req.body, slug });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'create',
      module: 'facilities',
      description: `Created facility: ${facility.name}`,
    });

    res.status(201).json({ success: true, data: facility, message: 'Facility created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create facility' });
  }
};

exports.update = async (req, res) => {
  try {
    const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!facility) return res.status(404).json({ success: false, error: 'Facility not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'update',
      module: 'facilities',
      description: `Updated facility: ${facility.name}`,
    });

    res.json({ success: true, data: facility, message: 'Facility updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update facility' });
  }
};

exports.remove = async (req, res) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);
    if (!facility) return res.status(404).json({ success: false, error: 'Facility not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'delete',
      module: 'facilities',
      description: `Deleted facility: ${facility.name}`,
    });

    res.json({ success: true, message: 'Facility deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete facility' });
  }
};

