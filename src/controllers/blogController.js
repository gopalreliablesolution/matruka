const { Blog, BlogCategory } = require('../models/Blog');
const ActivityLog = require('../models/ActivityLog');

exports.getAll = async (req, res) => {
  try {
    const { search, status, category, page = 1, limit = 15 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [blogs, total] = await Promise.all([
      Blog.find(query).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Blog.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch blogs' });
  }
};

exports.getById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch blog' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    if (!title || !excerpt || !content) {
      return res.status(400).json({ success: false, error: 'Title, excerpt, and content are required' });
    }

    let slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const exists = await Blog.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const blog = await Blog.create({
      ...req.body,
      slug,
      author: req.body.author || req.user?.name || 'Dr. Kairavi Yagnik',
    });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'create',
      module: 'blogs',
      description: `Created blog article: ${blog.title}`,
    });

    res.status(201).json({ success: true, data: blog, message: 'Blog created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create blog' });
  }
};

exports.update = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'update',
      module: 'blogs',
      description: `Updated blog article: ${blog.title}`,
    });

    res.json({ success: true, data: blog, message: 'Blog updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update blog' });
  }
};

exports.remove = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'delete',
      module: 'blogs',
      description: `Deleted blog: ${blog.title}`,
    });

    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete blog' });
  }
};

// Blog categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Name is required' });
    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = await BlogCategory.create({ name, slug });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create category' });
  }
};

