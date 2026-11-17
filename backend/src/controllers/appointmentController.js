const Appointment = require('../models/Appointment');

// @desc    Get all appointments (with optional status/date/search filter)
// @route   GET /api/v1/admin/appointments
exports.getAll = async (req, res) => {
  try {
    const { status, date, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (date) {
      query.preferredDate = date;
    }
    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/v1/admin/appointments/:id
exports.getById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    res.json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update appointment status / notes
// @route   PUT /api/v1/admin/appointments/:id
exports.update = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    res.json({ success: true, data: appointment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/v1/admin/appointments/:id
exports.remove = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
