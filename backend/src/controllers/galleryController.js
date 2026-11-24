const { GalleryAlbum, GalleryItem } = require('../models/GalleryAlbum');
const ActivityLog = require('../models/ActivityLog');

exports.getItems = async (req, res) => {
  try {
    const { albumId, category } = req.query;
    const query = {};
    if (albumId) query.albumId = albumId;
    if (category && category !== 'All') query.category = category;
    const items = await GalleryItem.find(query)
      .populate('albumId', 'title slug')
      .sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch gallery items' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'Image URL is required' });
    }

    const createData = {
      ...req.body,
      title: req.body.title ? req.body.title.trim() : '',
      caption: req.body.caption ? req.body.caption.trim() : '',
      category: req.body.category !== undefined ? req.body.category.trim() : '',
      isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
      sortOrder: req.body.sortOrder ? Number(req.body.sortOrder) : 0,
    };

    if (!createData.albumId || createData.albumId === '' || createData.albumId === 'null' || createData.albumId === 'none') {
      delete createData.albumId;
    }

    const item = await GalleryItem.create(createData);

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'create',
      module: 'gallery',
      description: `Added gallery item: ${item.title || 'Untitled photo'}`,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to add gallery item' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.title !== undefined) updateData.title = updateData.title.trim();
    if (updateData.caption !== undefined) updateData.caption = updateData.caption.trim();
    if (updateData.category !== undefined) updateData.category = updateData.category.trim();
    if (!updateData.albumId || updateData.albumId === '' || updateData.albumId === 'null' || updateData.albumId === 'none') {
      updateData.albumId = null;
    }

    const item = await GalleryItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!item) return res.status(404).json({ success: false, error: 'Gallery item not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'update',
      module: 'gallery',
      description: `Updated gallery item: ${item.title || 'Untitled photo'}`,
    });

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update gallery item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (item) {
      await ActivityLog.create({
        userId: req.user?._id?.toString() || 'admin',
        userName: req.user?.name || 'Admin',
        action: 'delete',
        module: 'gallery',
        description: `Deleted gallery photo: ${item.title || 'Untitled photo'}`,
      });
    }
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
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Album title is required' });
    }

    const baseSlug = (req.body.slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'album';

    let slug = baseSlug;
    let counter = 1;
    while (await GalleryAlbum.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const album = await GalleryAlbum.create({
      ...req.body,
      title: title.trim(),
      slug,
      category: req.body.category || 'Facilities',
      description: req.body.description ? req.body.description.trim() : '',
    });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'create',
      module: 'gallery_album',
      description: `Created gallery album: ${album.title}`,
    });

    res.status(201).json({ success: true, data: album });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: `"${req.body.title || 'This'}" નામનું આલ્બમ પહેલાંથી જ મોજૂદ છે. કૃપા કરીને નવું ટાઇટલ આપો.`,
      });
    }
    res.status(500).json({ success: false, error: error.message || 'Failed to create album' });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.title) updateData.title = updateData.title.trim();
    const album = await GalleryAlbum.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!album) return res.status(404).json({ success: false, error: 'Album not found' });
    res.json({ success: true, data: album });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update album' });
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
