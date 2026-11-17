const Newsletter = require('../models/Newsletter');

// Subscribe (Public)
exports.subscribe = async (req, res) => {
  try {
    const { name, email, sourcePath } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required' });
    }

    const subscriber = await Newsletter.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        name: name ? name.trim() : '',
        email: email.toLowerCase().trim(),
        sourcePath: sourcePath || '/hospital-location',
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Thank you for subscribing to our updates!',
      data: subscriber,
    });
  } catch (error) {
    console.error('Error in newsletter subscription:', error);
    res.status(500).json({ success: false, error: error.message || 'Subscription failed' });
  }
};

// Get all subscribers (Admin)
exports.getAll = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch subscribers' });
  }
};

// Delete subscriber (Admin)
exports.remove = async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, error: 'Subscriber not found' });
    }
    res.json({ success: true, message: 'Subscriber removed successfully' });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ success: false, error: 'Failed to delete subscriber' });
  }
};
