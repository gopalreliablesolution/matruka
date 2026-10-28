const path = require('path');
const fs = require('fs');
const Media = require('../models/Media');
const ActivityLog = require('../models/ActivityLog');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { altText } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    const media = await Media.create({
      originalName: req.file.originalname,
      filename: req.file.filename,
      url: fileUrl,
      path: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      altText: altText || req.file.originalname,
      uploadedBy: req.user?.name || 'Admin',
    });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'create',
      module: 'media',
      description: `Uploaded file to server: ${req.file.filename} (${Math.round(req.file.size / 1024)} KB)`,
    });

    res.status(201).json({
      success: true,
      data: media,
      message: 'File saved directly to server disk successfully',
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ success: false, error: 'Failed to save uploaded file on server' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { altText: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Media.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch media' });
  }
};

exports.remove = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ success: false, error: 'Media not found' });

    // Remove from local server filesystem
    if (media.path && fs.existsSync(media.path)) {
      try {
        fs.unlinkSync(media.path);
      } catch (err) {
        console.warn('Could not delete file from disk:', err);
      }
    }

    await Media.findByIdAndDelete(req.params.id);

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'delete',
      module: 'media',
      description: `Deleted file from server: ${media.filename}`,
    });

    res.json({ success: true, message: 'Media deleted from server' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete media' });
  }
};

