const Video = require('../models/Video');

// Helper to extract YouTube ID from URL
function extractYouTubeId(url) {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : url.trim();
}

// @desc    Get all videos
// @route   GET /api/v1/admin/videos
exports.getAll = async (req, res) => {
  try {
    const videos = await Video.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, count: videos.length, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single video
// @route   GET /api/v1/admin/videos/:id
exports.getById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }
    res.json({ success: true, data: video });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create video
// @route   POST /api/v1/admin/videos
exports.create = async (req, res) => {
  try {
    const youtubeId = extractYouTubeId(req.body.youtubeUrl);
    const thumbnailUrl =
      req.body.thumbnailUrl || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    const video = await Video.create({
      ...req.body,
      youtubeId,
      thumbnailUrl,
    });
    res.status(201).json({ success: true, data: video });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update video
// @route   PUT /api/v1/admin/videos/:id
exports.update = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.youtubeUrl) {
      updates.youtubeId = extractYouTubeId(updates.youtubeUrl);
      if (!updates.thumbnailUrl) {
        updates.thumbnailUrl = `https://img.youtube.com/vi/${updates.youtubeId}/hqdefault.jpg`;
      }
    }

    const video = await Video.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!video) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }
    res.json({ success: true, data: video });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete video
// @route   DELETE /api/v1/admin/videos/:id
exports.remove = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
