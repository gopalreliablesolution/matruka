const { Service, ServiceCategory } = require('../models/Service');
const ActivityLog = require('../models/ActivityLog');

exports.getAll = async (req, res) => {
  try {
    const { search, category, isPublished } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (isPublished !== undefined && isPublished !== '') {
      query.isPublished = isPublished === 'true';
    }
    const services = await Service.find(query).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch services' });
  }
};

exports.getById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch service' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, category, shortDescription, fullDescription } = req.body;
    if (!name || !category || !shortDescription || !fullDescription) {
      return res.status(400).json({ success: false, error: 'Name, category, short & full descriptions are required' });
    }

    let slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const exists = await Service.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const service = await Service.create({ ...req.body, slug });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'create',
      module: 'services',
      description: `Created service: ${service.name} (${service.category})`,
    });

    res.status(201).json({ success: true, data: service, message: 'Service created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create service' });
  }
};

exports.update = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'update',
      module: 'services',
      description: `Updated service: ${service.name}`,
    });

    res.json({ success: true, data: service, message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update service' });
  }
};

exports.remove = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'delete',
      module: 'services',
      description: `Deleted service: ${service.name}`,
    });

    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete service' });
  }
};

// Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find().sort({ sortOrder: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Category name is required' });

    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = await ServiceCategory.create({ name, slug, description });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await ServiceCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete category' });
  }
};

