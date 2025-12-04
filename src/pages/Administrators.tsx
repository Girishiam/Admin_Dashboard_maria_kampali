import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { getAdminUsers, updateAdministrator, deleteAdministrator, createAdministrator, AdminUsersResponse } from '../services/api_call';

interface Administrator {
  id: number;
  name: string;
  email: string;
  phone: string;
  accessLevel: string;
  avatar: string | null;
}

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (admin: any) => Promise<void>;
}

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: Administrator | null;
  onSave: (admin: Administrator) => void;
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  adminName: string;
  error?: string | null;
  isDeleting?: boolean;
}

// Delete Confirmation Modal - Responsive
function DeleteConfirmModal({ isOpen, onClose, onConfirm, adminName, error, isDeleting }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 sm:p-5 lg:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Confirm Deletion</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4 sm:p-5 lg:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 text-xs sm:text-sm rounded-lg flex items-start gap-2">
              <span className="flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{adminName}</span>'s account? This action cannot be undone.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm order-2 sm:order-1 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all text-sm flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <TrashIcon className="w-4 h-4" />
                  <span>Delete Account</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create Administrator Modal - Responsive with Password Toggle
function CreateAdminModal({ isOpen, onClose, onSave }: CreateAdminModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    accessLevel: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        await onSave(formData);
        setFormData({ name: '', email: '', phone: '', accessLevel: '', password: '' });
        onClose();
    } catch (err: any) {
        setError(err.error || 'Failed to create administrator');
    } finally {
        setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '', accessLevel: '', password: '' });
    setError(null);
    setShowPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      {/* Modal Container - Centered on all devices */}
      <div className="bg-white w-full max-w-[90%] sm:max-w-md rounded-2xl shadow-2xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            New Administrator
          </h2>
          <button 
            onClick={handleClose} 
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-3.5">
            {/* Error Message */}
            {error && (
              <div className="p-2.5 bg-red-50 border border-red-100 text-red-700 text-xs rounded-lg flex items-start gap-2">
                <span className="flex-shrink-0">⚠️</span>
                <span className="flex-1">{error}</span>
              </div>
            )}
            
            {/* Name Field */}
            <div>
              <label htmlFor="admin-name" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Name
              </label>
              <input
                id="admin-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm bg-white placeholder:text-gray-400"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm bg-white placeholder:text-gray-400"
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Contact Number Field */}
            <div>
              <label htmlFor="admin-phone" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Contact Number
              </label>
              <input
                id="admin-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm bg-white placeholder:text-gray-400"
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>

            {/* Access Level Field */}
            <div>
              <label htmlFor="admin-access" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Access Level
              </label>
              <select
                id="admin-access"
                value={formData.accessLevel}
                onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all bg-white text-sm appearance-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
                required
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            {/* Password Field with Toggle */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm bg-white placeholder:text-gray-400"
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer with Buttons */}
          <div className="px-5 py-3.5 border-t border-gray-200 bg-white">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 active:bg-gray-100 transition-all text-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-[#005440] text-white rounded-lg font-semibold hover:bg-[#004435] active:bg-[#003428] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Update</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Administrator Modal - Responsive
function EditAdminModal({ isOpen, onClose, admin, onSave }: EditAdminModalProps) {
  const [formData, setFormData] = useState<Administrator | null>(admin);

  React.useEffect(() => {
    setFormData(admin);
  }, [admin]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 sm:p-5 lg:p-6 border-b border-gray-200 rounded-t-xl sm:rounded-t-2xl">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Edit Administrator</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">Contact Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">Access Level</label>
            <select
              value={formData.accessLevel}
              onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
              disabled={true}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all bg-white text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <option>Admin</option>
              <option>Super Admin</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#005440] text-white rounded-lg font-semibold hover:bg-[#004435] transition-all text-sm order-1 sm:order-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Administrators Component - Fully Responsive
function Administrators() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Administrator | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<Administrator | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await getAdminUsers(currentPage);
      const mappedUsers = response.data.users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        accessLevel: user.access_level,
        avatar: user.image
      }));
      setAdministrators(mappedUsers);
      setTotalPages(response.data.pagination.total_pages);
      setTotalUsers(response.data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch admin users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [currentPage]);

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalUsers);
  const currentAdministrators = administrators; // API handles pagination

  // Generate page numbers - Mobile optimized
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const isMobile = window.innerWidth < 640;
    const maxVisible = isMobile ? 3 : 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (isMobile) {
        // Mobile: Show current, prev, next
        if (currentPage > 1) pages.push(currentPage - 1);
        pages.push(currentPage);
        if (currentPage < totalPages) pages.push(currentPage + 1);
      } else {
        // Desktop: Show more pages
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push('...');
          pages.push(currentPage - 1);
          pages.push(currentPage);
          pages.push(currentPage + 1);
          pages.push('...');
          pages.push(totalPages);
        }
      }
    }
    return pages;
  };

  const handleCreateAdmin = async (newAdminData: any) => {
    const payload = {
        name: newAdminData.name,
        email: newAdminData.email,
        contact_number: newAdminData.phone,
        access_level: newAdminData.accessLevel,
        password: newAdminData.password
    };
    
    const response = await createAdministrator(payload);
    if (response.success) {
        fetchAdmins(); // Refresh the list
    } else {
        throw { error: response.message || 'Failed to create administrator' };
    }
  };

  const handleEditAdmin = (admin: Administrator) => {
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedAdmin: Administrator) => {
    try {
        const payload = {
            name: updatedAdmin.name,
            email: updatedAdmin.email,
            contact_number: updatedAdmin.phone,
            access_level: updatedAdmin.accessLevel
        };
        const response = await updateAdministrator(updatedAdmin.id, payload);
        if (response.success) {
            await fetchAdmins();
        }
    } catch (error) {
        console.error('Failed to update administrator:', error);
    }
  };

  const handleDeleteClick = (admin: Administrator) => {
    setAdminToDelete(admin);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (adminToDelete) {
      setIsDeleting(true);
      setDeleteError(null);
      try {
          const response = await deleteAdministrator(adminToDelete.id);
          if (response.success) {
            setAdministrators(administrators.filter(admin => admin.id !== adminToDelete.id));
            setAdminToDelete(null);
            setShowDeleteModal(false);
            if (administrators.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchAdmins();
            }
          }
      } catch (error: any) {
          console.error('Failed to delete administrator:', error);
          setDeleteError(error.error || 'Failed to delete administrator');
      } finally {
          setIsDeleting(false);
      }
    }
  };

  return (
    <div className="w-full min-w-0 px-3 sm:px-4 lg:px-0">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with Create Button - Responsive */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-[#005440] text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-[#004435] transition-all"
          >
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">New Administrator</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005440]"></div>
          </div>
        )}

        {/* Desktop Table View */}
        {!loading && (
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold text-gray-900 whitespace-nowrap">SL no.</th>
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold text-gray-900 whitespace-nowrap">User</th>
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold text-gray-900 whitespace-nowrap">Contact Number</th>
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold text-gray-900 whitespace-nowrap">Has Access to</th>
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-center text-xs xl:text-sm font-bold text-gray-900 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentAdministrators.map((admin, index) => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs xl:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      #{startIndex + index + 1}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={admin.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=f59e0b&color=fff`} 
                          alt={admin.name} 
                          className="w-9 h-9 xl:w-10 xl:h-10 rounded-full flex-shrink-0 object-cover" 
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs xl:text-sm font-bold text-gray-900 truncate">{admin.name}</div>
                          <div className="text-xs text-gray-500 truncate">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs xl:text-sm text-gray-900 whitespace-nowrap">{admin.phone}</td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs xl:text-sm font-semibold text-gray-900 whitespace-nowrap">{admin.accessLevel}</td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditAdmin(admin)}
                          className="inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 bg-[#005440] hover:bg-[#004435] text-white rounded-lg transition-colors"
                          aria-label="Edit administrator"
                        >
                          <PencilIcon className="w-4 h-4 xl:w-5 xl:h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(admin)}
                          className="inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          aria-label="Delete administrator"
                        >
                          <TrashIcon className="w-4 h-4 xl:w-5 xl:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile/Tablet Card View */}
        {!loading && (
          <div className="lg:hidden">
            {currentAdministrators.map((admin, index) => (
              <div key={admin.id} className="bg-white border-b border-gray-100 last:border-b-0">
                <div className="p-3 sm:p-4 flex items-start gap-3">
                  {/* Avatar and Info */}
                  <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
                    <img 
                      src={admin.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=f59e0b&color=fff`} 
                      alt={admin.name} 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-900">#{startIndex + index + 1}</span>
                        <span className="px-1.5 sm:px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                          {admin.accessLevel}
                        </span>
                      </div>
                      <div className="text-sm sm:text-base font-bold text-gray-900 mb-0.5 truncate">{admin.name}</div>
                      <div className="text-xs text-gray-600 mb-0.5 truncate">{admin.email}</div>
                      <div className="text-xs text-gray-500 truncate">{admin.phone}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditAdmin(admin)}
                      className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-[#005440] hover:bg-[#004435] text-white rounded-lg transition-colors"
                      aria-label="Edit administrator"
                    >
                      <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteClick(admin)}
                      className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      aria-label="Delete administrator"
                    >
                      <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && currentAdministrators.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            No administrators found. Create your first administrator to get started.
          </div>
        )}

        {/* Pagination - Fully Responsive */}
        {totalPages > 1 && (
          <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              {/* Results Text */}
              <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                Showing {startIndex + 1}-{endIndex} of {totalUsers}
              </div>
              
              {/* Pagination Buttons */}
              <div className="flex items-center gap-1 flex-wrap justify-center order-1 sm:order-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="px-2.5 sm:px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                    className={`min-w-[28px] sm:min-w-[32px] px-1.5 sm:px-2 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                      page === currentPage 
                        ? 'bg-[#005440] text-white shadow-md border border-[#005440]' 
                        : page === '...' 
                        ? 'bg-transparent text-gray-400 cursor-default' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className="px-2.5 sm:px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateAdminModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateAdmin}
      />
      <EditAdminModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        admin={selectedAdmin}
        onSave={handleSaveEdit}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setAdminToDelete(null);
          setDeleteError(null);
        }}
        onConfirm={handleConfirmDelete}
        adminName={adminToDelete?.name || ''}
        error={deleteError}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default Administrators;