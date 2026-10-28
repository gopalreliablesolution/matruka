const Doctor = require('../models/Doctor');
const ActivityLog = require('../models/ActivityLog');

exports.getAll = async (req, res) => {
  try {
    const { search, isPublished } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }
    if (isPublished !== undefined && isPublished !== '') {
      query.isPublished = isPublished === 'true';
    }
    const doctors = await Doctor.find(query).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch doctors' });
  }
};

exports.getById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, error: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch doctor' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, designation, specialization, bio } = req.body;
    if (!name || !designation || !specialization || !bio) {
      return res.status(400).json({ success: false, error: 'Name, designation, specialization, and bio are required' });
    }

    let slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const exists = await Doctor.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const doctor = await Doctor.create({ ...req.body, slug });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'create',
      module: 'doctors',
      description: `Created doctor profile: ${doctor.name}`,
    });

    res.status(201).json({ success: true, data: doctor, message: 'Doctor profile created' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create doctor' });
  }
};

exports.update = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doctor) return res.status(404).json({ success: false, error: 'Doctor not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'update',
      module: 'doctors',
      description: `Updated doctor profile: ${doctor.name}`,
    });

    res.json({ success: true, data: doctor, message: 'Doctor profile updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update doctor' });
  }
};

exports.remove = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, error: 'Doctor not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'delete',
      module: 'doctors',
      description: `Deleted doctor profile: ${doctor.name}`,
    });

    res.json({ success: true, message: 'Doctor profile deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete doctor' });
  }
};

