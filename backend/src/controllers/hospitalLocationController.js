const HospitalLocation = require('../models/HospitalLocation');

// Get all locations (Admin)
exports.getAll = async (req, res) => {
  try {
    const locations = await HospitalLocation.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: locations.length, data: locations });
  } catch (error) {
    console.error('Error fetching hospital locations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch hospital locations' });
  }
};

// Get active locations (Public)
exports.getPublic = async (req, res) => {
  try {
    const locations = await HospitalLocation.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: locations.length, data: locations });
  } catch (error) {
    console.error('Error fetching public hospital locations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch hospital locations' });
  }
};

// Get single location by ID
exports.getById = async (req, res) => {
  try {
    const location = await HospitalLocation.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }
    res.json({ success: true, data: location });
  } catch (error) {
    console.error('Error fetching hospital location:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch hospital location' });
  }
};

// Create new location (Admin)
exports.create = async (req, res) => {
  try {
    const {
      sectionTitle,
      name,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      days,
      hours,
      mapEmbedUrl,
      isActive,
      order,
    } = req.body;

    if (!name || !address || !phone || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name, address, phone, and email are required',
      });
    }

    const location = await HospitalLocation.create({
      sectionTitle: sectionTitle || 'Visit Our Clinic',
      name: name.trim(),
      address: address.trim(),
      city: (city || 'Surat').trim(),
      state: (state || 'Gujarat').trim(),
      pincode: (pincode || '395007').trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      days: days || 'Monday to Saturday',
      hours: hours || '10:00 AM to 1:00 PM | 5:00 PM to 7:00 PM',
      mapEmbedUrl: mapEmbedUrl || '',
      isActive: isActive !== undefined ? isActive : true,
      order: Number(order) || 1,
    });

    res.status(201).json({ success: true, data: location });
  } catch (error) {
    console.error('Error creating hospital location:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to create hospital location' });
  }
};

// Update location (Admin)
exports.update = async (req, res) => {
  try {
    const location = await HospitalLocation.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }

    res.json({ success: true, data: location });
  } catch (error) {
    console.error('Error updating hospital location:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to update hospital location' });
  }
};

// Delete location (Admin)
exports.remove = async (req, res) => {
  try {
    const location = await HospitalLocation.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }
    res.json({ success: true, message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting hospital location:', error);
    res.status(500).json({ success: false, error: 'Failed to delete hospital location' });
  }
};
