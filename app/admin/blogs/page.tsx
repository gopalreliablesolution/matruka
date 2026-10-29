'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, X, Calendar, User, Eye } from 'lucide-react';
import { adminApi, resolveImageUrl } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
import Breadcrumb from '@/components/admin/Breadcrumb';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';

interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  publishedAt: string;
  isFeatured: boolean;
  views: number;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    blog: BlogItem | null;
    loading: boolean;
  }>({
    isOpen: false,
    blog: null,
    loading: false,
  });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: 'Dr. Kairavi Yagnik',
    category: 'Pregnancy & Childbirth',
    tags: '',
    status: 'published' as 'draft' | 'published' | 'scheduled',
    isFeatured: false,
  });

  useEffect(() => {
    fetchBlogs();
  }, [search, statusFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      let query = `?search=${encodeURIComponent(search)}`;
      if (statusFilter) query += `&status=${statusFilter}`;
      const res = await adminApi.get(`/blogs${query}`);
      if (res.data?.success) {
        setBlogs(res.data.data.blogs || res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (blog?: BlogItem) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        featuredImage: blog.featuredImage || '',
        author: blog.author || 'Dr. Kairavi Yagnik',
        category: blog.category || 'Pregnancy & Childbirth',
        tags: (blog.tags || []).join(', '),
        status: blog.status || 'published',
        isFeatured: blog.isFeatured ?? false,
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        author: 'Dr. Kairavi Yagnik',
        category: 'Pregnancy & Childbirth',
        tags: '',
        status: 'published',
        isFeatured: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Article title is required');
      return;
    }

    const payload = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingBlog) {
        const res = await adminApi.put(`/blogs/${editingBlog._id}`, payload);
        if (res.data.success) {
          toast.success('Article updated');
          fetchBlogs();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/blogs', payload);
        if (res.data.success) {
          toast.success('Article published');
          fetchBlogs();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save article');
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.blog) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/blogs/${deleteModal.blog._id}`);
      if (res.data.success) {
        toast.success('Article deleted');
        fetchBlogs();
        setDeleteModal({ isOpen: false, blog: null, loading: false });
      }
    } catch {
      toast.error('Failed to delete article');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const columns: Column[] = [
    {
      header: 'Article Title',
      accessor: 'title',
      render: (blog: BlogItem) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 overflow-hidden">
            {blog.featuredImage ? (
              <img src={resolveImageUrl(blog.featuredImage)} alt={blog.title} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="w-5 h-5 text-purple-600" />
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm line-clamp-1">{blog.title}</p>
            <p className="text-xs text-gray-500 line-clamp-1 max-w-sm">{blog.excerpt}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Author & Category',
      accessor: 'author',
      render: (blog: BlogItem) => (
        <div>
          <p className="text-xs font-semibold text-gray-800">{blog.author}</p>
          <span className="inline-flex mt-1 text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
            {blog.category}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (blog: BlogItem) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${blog.status === 'published'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
        >
          {blog.status}
        </span>
      ),
    },
    {
      header: 'Views',
      accessor: 'views',
      align: 'center',
      render: (blog: BlogItem) => (
        <span className="text-xs text-gray-600 font-medium flex items-center justify-center gap-1">
          <Eye size={12} className="text-gray-400" />
          <span>{blog.views || 0}</span>
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      align: 'right',
      render: (blog: BlogItem) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenModal(blog)}
            className="p-1.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition"
            title="Edit Article"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, blog: blog, loading: false })}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete Article"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & Header */}
      <div>
        <Breadcrumb
          items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Blogs & Articles' }]}
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Healthcare Articles & Guides</h1>
            <p className="text-sm text-gray-500 mt-1">
              Publish educational articles on pregnancy, nutrition, laparoscopy, and reproductive wellness.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 font-semibold text-sm transition shadow-sm"
          >
            <Plus size={18} />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Jogi DataTable */}
      <DataTable
        columns={columns}
        data={blogs}
        loading={loading}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search articles by title or keyword...',
        }}
        filters={[
          {
            name: 'status',
            label: 'All Statuses',
            options: [
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        emptyMessage="No healthcare articles found."
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingBlog ? 'Edit Healthcare Article' : 'Write Healthcare Article'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Informative maternity and gynaecological guidance for patients.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Essential Nutritional Guidelines for the First Trimester"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Author</label>
                  <select
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="Dr. Kairavi Yagnik">Dr. Kairavi Yagnik</option>
                    <option value="Dr. Rut Shah">Dr. Rut Shah</option>
                    <option value="Matruka Clinical Team">Matruka Clinical Team</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="Pregnancy & Childbirth">Pregnancy & Childbirth</option>
                    <option value="Women Health & Wellness">Women Health & Wellness</option>
                    <option value="Laparoscopic Surgery">Laparoscopic Surgery</option>
                    <option value="Infertility Awareness">Infertility Awareness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'draft' | 'published' | 'scheduled',
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Short Excerpt (Cards preview)
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Summary for preview cards..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Article Body (Markdown supported)
                </label>
                <textarea
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Comprehensive clinical guidance, dietary recommendations, symptoms, and when to consult..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Featured Image (Saved to local server disk)
                </label>
                <ImageUpload
                  value={formData.featuredImage}
                  onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-xl hover:opacity-90 font-semibold text-xs transition shadow-sm"
                >
                  {editingBlog ? 'Save Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, blog: null, loading: false })}
        onConfirm={confirmDelete}
        title="Delete Healthcare Article?"
        message={`Are you sure you want to delete "${deleteModal.blog?.title}"?`}
        confirmLabel="Delete Article"
        variant="danger"
        loading={deleteModal.loading}
      />
    </div>
  );
}
