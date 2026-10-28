const { GalleryAlbum, GalleryItem } = require('../models/GalleryAlbum');
const ActivityLog = require('../models/ActivityLog');

exports.getItems = async (req, res) => {
  try {
    const { albumId, category } = req.query;
    const query = {};
    if (albumId) query.albumId = albumId;
    if (category) query.category = category;
    const items = await GalleryItem.find(query).populate('albumId', 'title slug').sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch gallery items' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!title || !imageUrl) return res.status(400).json({ success: false, error: 'Title and image URL are required' });

    const item = await GalleryItem.create(req.body);

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'create',
      module: 'gallery',
      description: `Added gallery item: ${item.title}`,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to add gallery item' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, error: 'Gallery item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update gallery item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete gallery item' });
  }
};

// Albums
exports.getAlbums = async (req, res) => {
  try {
    const albums = await GalleryAlbum.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: albums });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch albums' });
  }
};

exports.createAlbum = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ success: false, error: 'Album title is required' });
    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const album = await GalleryAlbum.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: album });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create album' });
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    await GalleryItem.deleteMany({ albumId: req.params.id });
    await GalleryAlbum.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Album and its items deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete album' });
  }
};

