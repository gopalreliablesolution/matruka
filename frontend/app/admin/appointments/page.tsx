'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Phone,
  Mail,
  Clock,
  User,
  Eye,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Filter,
  Check,
  Building2,
  MessageSquare,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import CustomDropdown from '@/components/admin/CustomDropdown';
import DataTable, { Column } from '@/components/admin/DataTable';
import toast from 'react-hot-toast';

interface AppointmentItem {
  _id: string;
  patientName: string;
  phone: string;
  email?: string;
  city?: string;
  department: string;
  doctor?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  adminNotes?: string;
  createdAt: string;
}

const STATUS_COLOR_MAP: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Completed: 'bg-blue-50 text-blue-700 border border-blue-200',
  Cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
};

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // View / Edit Modal state
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    status: 'Pending',
    doctor: '',
    adminNotes: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    appointment: AppointmentItem | null;
    loading: boolean;
  }>({
    isOpen: false,
    appointment: null,
    loading: false,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'All') params.append('status', statusFilter);
      if (dateFilter) params.append('date', dateFilter);

      const res = await adminApi.get(`/appointments?${params.toString()}`);
      if (res.data?.success) {
        setAppointments(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to load appointments:', err);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const res = await adminApi.put(`/appointments/${appointmentId}`, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Status updated to ${newStatus}`);
        setAppointments((prev) =>
          prev.map((item) => (item._id === appointmentId ? { ...item, status: newStatus as any } : item))
        );
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleOpenEdit = (apt: AppointmentItem) => {
    setSelectedAppointment(apt);
    setEditFormData({
      status: apt.status,
      doctor: apt.doctor || 'Any Available Specialist',
      adminNotes: apt.adminNotes || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      setSavingEdit(true);
      const res = await adminApi.put(`/appointments/${selectedAppointment._id}`, editFormData);
      if (res.data?.success) {
        toast.success('Appointment details updated');
        fetchAppointments();
        setIsEditModalOpen(false);
      }
    } catch (err) {
      toast.error('Failed to save changes');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.appointment) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/appointments/${deleteModal.appointment._id}`);
      if (res.data?.success) {
        toast.success('Appointment deleted');
        setAppointments((prev) => prev.filter((a) => a._id !== deleteModal.appointment!._id));
        setDeleteModal({ isOpen: false, appointment: null, loading: false });
      }
    } catch (err) {
      toast.error('Failed to delete appointment');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Filter in memory for search query
  const filteredAppointments = appointments.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.patientName.toLowerCase().includes(q) ||
      item.phone.includes(q) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      item.department.toLowerCase().includes(q)
    );
  });

  const totalItems = filteredAppointments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedData = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Quick Metrics
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;

  const columns: Column[] = [
    {
      header: 'Patient Details',
      accessor: 'patientName',
      render: (item: AppointmentItem) => (
        <div className="space-y-0.5">
          <p className="font-bold text-gray-900 text-sm">{item.patientName}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1 font-mono">
              <Phone size={12} className="text-primary" />
              {item.phone}
            </span>
            {item.city && <span>• {item.city}</span>}
          </div>
          {item.email && <p className="text-[11px] text-gray-400 truncate max-w-xs">{item.email}</p>}
        </div>
      ),
    },
    {
      header: 'Department / Doctor',
      accessor: 'department',
      render: (item: AppointmentItem) => (
        <div className="space-y-0.5 max-w-xs">
          <p className="font-semibold text-gray-800 text-xs">{item.department}</p>
          <p className="text-[11px] text-primary font-medium flex items-center gap-1">
            <User size={11} />
            <span>{item.doctor || 'Any Specialist'}</span>
          </p>
        </div>
      ),
    },
    {
      header: 'Preferred Schedule',
      accessor: 'preferredDate',
      render: (item: AppointmentItem) => (
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-gray-900 flex items-center gap-1">
            <Calendar size={12} className="text-gray-400" />
            <span>{item.preferredDate || 'Flexible / Urgent'}</span>
          </p>
          <p className="text-[11px] text-gray-500 flex items-center gap-1">
            <Clock size={11} className="text-gray-400" />
            <span>{item.preferredTime}</span>
          </p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item: AppointmentItem) => (
        <CustomDropdown
          options={STATUS_OPTIONS}
          value={item.status}
          onChange={(newVal) => handleQuickStatusChange(item._id, newVal)}
          colorMap={STATUS_COLOR_MAP}
        />
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      align: 'right',
      render: (item: AppointmentItem) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              setSelectedAppointment(item);
              setIsViewModalOpen(true);
            }}
            title="View Details"
            className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-brand-teal-50 transition"
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(item)}
            title="Edit / Notes"
            className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-brand-teal-50 transition"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            onClick={() =>
              setDeleteModal({
                isOpen: true,
                appointment: item,
                loading: false,
              })
            }
            title="Delete"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      <AdminPageHeader
        title="Patient Consultations & Leads"
        description="Manage consultation requests, triage patient leads, assign doctors, and track OPD confirmations."
        icon={Calendar}
        breadcrumb={[{ label: 'Appointments & Leads' }]}
        actions={
          <button
            type="button"
            onClick={fetchAppointments}
            className="admin-btn-secondary"
          >
            <Clock size={15} />
            <span>Refresh leads</span>
          </button>
        }
      />

      {/* Metrics Cards - Jogi Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Loaded Leads</p>
          <p className="text-3xl font-bold text-gray-900 font-heading">{appointments.length}</p>
          <p className="text-[11px] text-gray-500">All recorded patient inquiries</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Pending Review</p>
          <p className="text-3xl font-bold text-amber-700 font-heading">{pendingCount}</p>
          <p className="text-[11px] text-amber-600/80">Requires staff phone confirmation</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Confirmed OPD</p>
          <p className="text-3xl font-bold text-emerald-700 font-heading">{confirmedCount}</p>
          <p className="text-[11px] text-emerald-600/80">Scheduled for clinical OPD</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Completed Care</p>
          <p className="text-3xl font-bold text-blue-700 font-heading">{completedCount}</p>
          <p className="text-[11px] text-blue-600/80">Consultations concluded</p>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        columns={columns}
        data={paginatedData}
        loading={loading}
        emptyMessage="No consultation leads found."
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search by patient name, phone, email, or department...',
        }}
        filters={[
          {
            name: 'status',
            label: 'Filter by Status',
            type: 'select',
            options: [
              { label: 'All Statuses', value: 'All' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Confirmed', value: 'Confirmed' },
              { label: 'Completed', value: 'Completed' },
              { label: 'Cancelled', value: 'Cancelled' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
          {
            name: 'date',
            label: 'Preferred date',
            type: 'date',
            value: dateFilter,
            onChange: setDateFilter,
          },
        ]}
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage,
          onPageChange: setCurrentPage,
          onItemsPerPageChange: (limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          },
        }}
        onRowClick={(item: AppointmentItem) => {
          setSelectedAppointment(item);
          setIsViewModalOpen(true);
        }}
      />

      {/* View Appointment Modal */}
      {isViewModalOpen && selectedAppointment && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-primary-dark to-primary text-white flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/80">Consultation Details</p>
                <h3 className="text-xl font-bold font-heading">{selectedAppointment.patientName}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-white ${
                  selectedAppointment.status === 'Confirmed'
                    ? 'text-emerald-700'
                    : selectedAppointment.status === 'Pending'
                    ? 'text-amber-700'
                    : selectedAppointment.status === 'Completed'
                    ? 'text-blue-700'
                    : 'text-rose-700'
                }`}
              >
                {selectedAppointment.status}
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Contact Phone</p>
                  <a
                    href={`tel:${selectedAppointment.phone}`}
                    className="text-sm font-bold text-primary flex items-center gap-1.5 mt-0.5 hover:underline"
                  >
                    <Phone size={14} />
                    <span>+91 {selectedAppointment.phone}</span>
                  </a>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Email Address</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">
                    {selectedAppointment.email || 'None Provided'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Clinical Speciality</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedAppointment.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Assigned Doctor</p>
                    <p className="text-sm font-bold text-primary mt-0.5">
                      {selectedAppointment.doctor || 'Any Specialist'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200/60 pt-2 flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-gray-400" />
                    <span>Date: {selectedAppointment.preferredDate || 'Flexible'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-gray-400" />
                    <span>Slot: {selectedAppointment.preferredTime}</span>
                  </span>
                </div>
              </div>

              {selectedAppointment.message && (
                <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200/60">
                  <p className="text-[11px] font-bold text-amber-800 uppercase flex items-center gap-1.5">
                    <MessageSquare size={13} />
                    <span>Patient Message / Clinical Note</span>
                  </p>
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed whitespace-pre-wrap">
                    {selectedAppointment.message}
                  </p>
                </div>
              )}

              {selectedAppointment.adminNotes && (
                <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-200/60">
                  <p className="text-[11px] font-bold text-blue-800 uppercase">Internal Staff Notes</p>
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                    {selectedAppointment.adminNotes}
                  </p>
                </div>
              )}

              <p className="text-[11px] text-gray-400 text-center pt-2">
                Created: {new Date(selectedAppointment.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(selectedAppointment);
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                <Edit2 size={14} />
                <span>Update Status / Notes</span>
              </button>

              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {isEditModalOpen && selectedAppointment && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <h3 className="text-base font-bold text-gray-900 font-heading">
                Update Consultation Status
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Consultation Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white font-medium text-gray-800"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Confirmed">Confirmed OPD</option>
                  <option value="Completed">Completed Consultation</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Assigned Consultant Doctor
                </label>
                <select
                  value={editFormData.doctor}
                  onChange={(e) => setEditFormData({ ...editFormData, doctor: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white font-medium text-gray-800"
                >
                  <option value="Any Available Specialist">Any Available Specialist</option>
                  <option value="Dr. Kairavi Yagnik">Dr. Kairavi Yagnik (MS OBGYN)</option>
                  <option value="Dr. Rut Shah">Dr. Rut Shah (MS OBGYN)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Internal Staff Notes
                </label>
                <textarea
                  rows={3}
                  value={editFormData.adminNotes}
                  onChange={(e) => setEditFormData({ ...editFormData, adminNotes: e.target.value })}
                  placeholder="e.g. Called patient, confirmed 11:30 AM arrival for sonography checkup."
                  className="w-full px-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {savingEdit ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, appointment: null, loading: false })}
        onConfirm={handleDelete}
        title="Delete Appointment Lead?"
        message={`Are you sure you want to delete the record for ${deleteModal.appointment?.patientName}? This action cannot be undone.`}
        confirmLabel="Delete Record"
        variant="danger"
        loading={deleteModal.loading}
      />
    </div>
  );
}
