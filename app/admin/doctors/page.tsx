'use client';

import React, { useEffect, useState } from 'react';
import {
  Stethoscope,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Loader2,
  Phone,
  Clock,
  Award,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
import Breadcrumb from '@/components/admin/Breadcrumb';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';

interface DoctorItem {
  _id: string;
  name: string;
  slug: string;
  designation: string;
  qualifications: string;
  specialization: string;
  experienceYears: number;
  bio: string;
  areasOfExpertise: string[];
  fellowshipsAndCertifications: string[];
  opdTimings: string;
  profileImage: string;
  phone?: string;
  email?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorItem | null>(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    doctor: DoctorItem | null;
    loading: boolean;
  }>({
    isOpen: false,
    doctor: null,
    loading: false,
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    designation: 'Consultant Obstetrician & Gynaecologist',
    qualifications: '',
    specialization: 'Obstetrics, Gynaecology & Laparoscopic Surgery',
    experienceYears: 10,
    bio: '',
    areasOfExpertise: '',
    fellowshipsAndCertifications: '',
    opdTimings: '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Mon-Sat)',
    profileImage: '',
    phone: '7984882273',
    email: '',
    isFeatured: true,
    isPublished: true,
    sortOrder: 1,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/doctors');
      if (res.data?.success) {
        setDoctors(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (doc?: DoctorItem) => {
    if (doc) {
      setEditingDoctor(doc);
      setFormData({
        name: doc.name || '',
        designation: doc.designation || '',
        qualifications: doc.qualifications || '',
        specialization: doc.specialization || '',
        experienceYears: doc.experienceYears || 10,
        bio: doc.bio || '',
        areasOfExpertise: (doc.areasOfExpertise || []).join(', '),
        fellowshipsAndCertifications: (doc.fellowshipsAndCertifications || []).join(', '),
        opdTimings: doc.opdTimings || '',
        profileImage: doc.profileImage || '',
        phone: doc.phone || '7984882273',
        email: doc.email || '',
        isFeatured: doc.isFeatured ?? true,
        isPublished: doc.isPublished ?? true,
        sortOrder: doc.sortOrder || 1,
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '',
        designation: 'Consultant Obstetrician & Gynaecologist',
        qualifications: 'MBBS, MS OBGYN',
        specialization: 'Obstetrics, Gynaecology & Laparoscopic Surgery',
        experienceYears: 10,
        bio: '',
        areasOfExpertise: '',
        fellowshipsAndCertifications: 'Fellowship in Advanced Laparoscopic Surgery',
        opdTimings: '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Mon-Sat)',
        profileImage: '',
        phone: '7984882273',
        email: '',
        isFeatured: true,
        isPublished: true,
        sortOrder: doctors.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Doctor name is required');
      return;
    }

    const payload = {
      ...formData,
      areasOfExpertise: formData.areasOfExpertise
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      fellowshipsAndCertifications: formData.fellowshipsAndCertifications
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingDoctor) {
        const res = await adminApi.put(`/doctors/${editingDoctor._id}`, payload);
        if (res.data.success) {
          toast.success('Doctor profile updated');
          fetchDoctors();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/doctors', payload);
        if (res.data.success) {
          toast.success('Doctor profile created');
          fetchDoctors();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save doctor profile');
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.doctor) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/doctors/${deleteModal.doctor._id}`);
      if (res.data.success) {
        toast.success('Doctor profile deleted');
        fetchDoctors();
        setDeleteModal({ isOpen: false, doctor: null, loading: false });
      }
    } catch {
      toast.error('Failed to delete doctor');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleTogglePublish = async (doc: DoctorItem) => {
    try {
      const res = await adminApi.put(`/doctors/${doc._id}`, { isPublished: !doc.isPublished });
      if (res.data.success) {
        toast.success(`Doctor ${doc.isPublished ? 'Unpublished' : 'Published'}`);
        fetchDoctors();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.qualifications.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column[] = [
    {
      header: 'Doctor Profile',
      accessor: 'name',
      render: (doc: DoctorItem) => (
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 overflow-hidden shrink-0 flex items-center justify-center">
            {doc.profileImage ? (
              <img src={doc.profileImage} alt={doc.name} className="w-full h-full object-cover" />
            ) : (
              <Stethoscope className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{doc.name}</p>
            <p className="text-xs text-primary font-medium">{doc.qualifications}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Speciality & Role',
      accessor: 'specialization',
      render: (doc: DoctorItem) => (
        <div>
          <p className="text-xs font-semibold text-gray-800">{doc.designation}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">{doc.specialization}</p>
        </div>
      ),
    },
    {
      header: 'OPD Hours',
      accessor: 'opdTimings',
      render: (doc: DoctorItem) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Clock size={13} className="text-primary shrink-0" />
          <span className="truncate max-w-[12rem]">{doc.opdTimings}</span>
        </div>
      ),
    },
    {
      header: 'Order',
      accessor: 'sortOrder',
      align: 'center',
      render: (doc: DoctorItem) => (
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
          #{doc.sortOrder}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'isPublished',
      render: (doc: DoctorItem) => (
        <button
          onClick={() => handleTogglePublish(doc)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
            doc.isPublished
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-gray-100 text-gray-500 border border-gray-200'
          }`}
        >
          {doc.isPublished ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          <span>{doc.isPublished ? 'Active' : 'Draft'}</span>
        </button>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      align: 'right',
      render: (doc: DoctorItem) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenModal(doc)}
            className="p-1.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition"
            title="Edit Doctor"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, doctor: doc, loading: false })}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete Doctor"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & Page Header */}
      <div>
        <Breadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Doctors & Team' }]} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctor Profiles</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage Dr. Kairavi Yagnik, Dr. Rut Shah, clinical qualifications, OPD timings, and profiles.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 font-semibold text-sm transition shadow-sm"
          >
            <Plus size={18} />
            <span>Add Doctor</span>
          </button>
        </div>
      </div>

      {/* Jogi-Style Data Table */}
      <DataTable
        columns={columns}
        data={filteredDoctors}
        loading={loading}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search doctor by name, qualification, or speciality...',
        }}
        emptyMessage="No doctor profiles found."
      />

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor Profile'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update credentials, clinical experience, and OPD consultation hours.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Doctor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Kairavi Yagnik"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Qualifications *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    placeholder="e.g. MBBS, MS OBGYN"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) =>
                      setFormData({ ...formData, experienceYears: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Specialization Focus
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g. Obstetrics, Gynaecology, Infertility & Laparoscopy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Fellowships & Certifications (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.fellowshipsAndCertifications}
                  onChange={(e) =>
                    setFormData({ ...formData, fellowshipsAndCertifications: e.target.value })
                  }
                  placeholder="Fellowship in Laparoscopic Surgery, FOGSI Ultrasound Certified"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Areas of Expertise (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.areasOfExpertise}
                  onChange={(e) => setFormData({ ...formData, areasOfExpertise: e.target.value })}
                  placeholder="Normal Delivery, High-Risk ANC, Laparoscopic Hysterectomy, Infertility"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  OPD Consultation Timings
                </label>
                <input
                  type="text"
                  value={formData.opdTimings}
                  onChange={(e) => setFormData({ ...formData, opdTimings: e.target.value })}
                  placeholder="10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Doctor Profile Picture (Saved to local server disk)
                </label>
                <ImageUpload
                  value={formData.profileImage}
                  onChange={(url) => setFormData({ ...formData, profileImage: url })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Clinical Bio</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Comprehensive clinical background and patient care philosophy..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-xs font-semibold text-gray-700">Published on Live Site</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-xs font-semibold text-gray-700">Featured on Homepage</span>
                </label>
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
                  {editingDoctor ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jogi-Style Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, doctor: null, loading: false })}
        onConfirm={confirmDelete}
        title="Delete Doctor Profile?"
        message={`Are you sure you want to delete the profile for ${deleteModal.doctor?.name}? This action cannot be undone.`}
        confirmLabel="Delete Doctor"
        variant="danger"
        loading={deleteModal.loading}
      />
    </div>
  );
}
