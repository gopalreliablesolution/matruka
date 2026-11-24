const Banner = require('../models/Banner');
const ActivityLog = require('../models/ActivityLog');

exports.getAll = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch banners' });
  }
};

exports.getById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, error: 'Banner not found' });
    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch banner' });
  }
};

exports.create = async (req, res) => {
  try {
    const { desktopImage, showContent } = req.body;
    if (!desktopImage || !desktopImage.trim()) {
      return res.status(400).json({ success: false, error: 'Banner image is required' });
    }

    const bannerData = {
      ...req.body,
      title: req.body.title ? req.body.title.trim() : '',
      subtitle: req.body.subtitle ? req.body.subtitle.trim() : '',
      badgeText: req.body.badgeText ? req.body.badgeText.trim() : '',
      desktopImage: req.body.desktopImage.trim(),
      mobileImage: req.body.mobileImage ? req.body.mobileImage.trim() : '',
      primaryBtnText: req.body.primaryBtnText ? req.body.primaryBtnText.trim() : '',
      primaryBtnLink: req.body.primaryBtnLink ? req.body.primaryBtnLink.trim() : '',
      secondaryBtnText: req.body.secondaryBtnText ? req.body.secondaryBtnText.trim() : '',
      secondaryBtnLink: req.body.secondaryBtnLink ? req.body.secondaryBtnLink.trim() : '',
      showContent: showContent !== undefined ? Boolean(showContent) : true,
      bannerLinkUrl: req.body.bannerLinkUrl ? req.body.bannerLinkUrl.trim() : '',
      openInNewTab: Boolean(req.body.openInNewTab),
      sortOrder: req.body.sortOrder ? Number(req.body.sortOrder) : 0,
      isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
    };

    const banner = await Banner.create(bannerData);

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'create',
      module: 'banners',
      description: `Created banner: ${banner.title || 'Image-Only Banner'}`,
    });

    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create banner' });
  }
};

exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.title !== undefined) updateData.title = updateData.title.trim();
    if (updateData.subtitle !== undefined) updateData.subtitle = updateData.subtitle.trim();
    if (updateData.badgeText !== undefined) updateData.badgeText = updateData.badgeText.trim();
    if (updateData.bannerLinkUrl !== undefined) updateData.bannerLinkUrl = updateData.bannerLinkUrl.trim();
    if (updateData.openInNewTab !== undefined) updateData.openInNewTab = Boolean(updateData.openInNewTab);
    if (updateData.showContent !== undefined) updateData.showContent = Boolean(updateData.showContent);

    const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!banner) return res.status(404).json({ success: false, error: 'Banner not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'update',
      module: 'banners',
      description: `Updated banner: ${banner.title || 'Image-Only Banner'}`,
    });

    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update banner' });
  }
};

exports.remove = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete banner' });
  }
};
