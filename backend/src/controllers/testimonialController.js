const Testimonial = require('../models/Testimonial');
const ActivityLog = require('../models/ActivityLog');

exports.getAll = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { treatmentReceived: { $regex: search, $options: 'i' } },
        { story: { $regex: search, $options: 'i' } },
      ];
    }
    const testimonials = await Testimonial.find(query).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch testimonials' });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Testimonial.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Testimonial not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch testimonial' });
  }
};

exports.create = async (req, res) => {
  try {
    const { patientName, story, treatmentReceived } = req.body;
    if (!patientName || !story || !treatmentReceived) {
      return res.status(400).json({ success: false, error: 'Patient name, story, and treatment received are required' });
    }

    const testimonial = await Testimonial.create(req.body);

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'create',
      module: 'testimonials',
      description: `Created testimonial for ${testimonial.patientName}`,
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create testimonial' });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, error: 'Testimonial not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update testimonial' });
  }
};

exports.remove = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete testimonial' });
  }
};

