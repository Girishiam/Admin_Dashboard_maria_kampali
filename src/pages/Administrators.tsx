import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
}

// Delete Confirmation Modal
function DeleteConfirmModal({ isOpen, onClose, onConfirm, adminName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{adminName}</span>'s account? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-6 py-3 bg-[#005440] text-white rounded-lg font-semibold hover:bg-[#004435] transition-all text-sm flex items-center justify-center gap-2"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create Administrator Modal
function CreateAdminModal({ isOpen, onClose, onSave }: CreateAdminModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    accessLevel: 'admin',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        await onSave(formData);
        setFormData({ name: '', email: '', phone: '', accessLevel: 'admin', password: '' });
        onClose();
    } catch (err: any) {
        setError(err.error || 'Failed to create administrator');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">New Administrator Profile</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Access Level</label>
            <select
              value={formData.accessLevel}
              onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all bg-white text-sm"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
              required
              minLength={8}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#005440] text-white rounded-lg font-semibold hover:bg-[#004435] transition-all text-sm disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Administrator Modal
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Administrator</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Access Level</label>
            <select
              value={formData.accessLevel}
              onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all bg-white text-sm"
            >
              <option>Admin</option>
              <option>Super Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#005440] text-white rounded-lg font-semibold hover:bg-[#004435] transition-all text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Administrators Component
function Administrators() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Administrator | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<Administrator | null>(null);
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

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
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
            contact_number: updatedAdmin.phone, // Mapping phone to contact_number
            access_level: updatedAdmin.accessLevel
        };
        const response = await updateAdministrator(updatedAdmin.id, payload);
        if (response.success) {
            // Update local state or refetch
            setAdministrators(administrators.map(admin => 
                admin.id === updatedAdmin.id ? updatedAdmin : admin
            ));
            fetchAdmins(); // Refetch to ensure consistency
        }
    } catch (error) {
        console.error('Failed to update administrator:', error);
    }
  };

  const handleDeleteClick = (admin: Administrator) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (adminToDelete) {
      try {
          const response = await deleteAdministrator(adminToDelete.id);
          if (response.success) {
            setAdministrators(administrators.filter(admin => admin.id !== adminToDelete.id));
            setAdminToDelete(null);
            // Check if we need to change page
            if (administrators.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchAdmins();
            }
          }
      } catch (error) {
          console.error('Failed to delete administrator:', error);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
        {/* Header with Create Button */}
        <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#005440] text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-[#004435] transition-all whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>New Administrators Profile Create</span>
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">SL no.</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">User</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Contact Number</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Has Access to</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentAdministrators.map((admin, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    #{startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={admin.avatar || `https://ui-avatars.com/api/?name=${admin.name}&background=f59e0b&color=fff`} 
                        alt={admin.name} 
                        className="w-10 h-10 rounded-full flex-shrink-0 object-cover" 
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">{admin.name}</div>
                        <div className="text-xs text-gray-500">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{admin.phone}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{admin.accessLevel}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditAdmin(admin)}
                        className="inline-flex items-center justify-center w-10 h-10 bg-[#005440] hover:bg-[#004435] text-white rounded-lg transition-colors"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(admin)}
                        className="inline-flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {currentAdministrators.map((admin, index) => (
            <div key={index} className="bg-white border-b border-gray-100 last:border-b-0">
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <img 
                    src={admin.avatar || `https://ui-avatars.com/api/?name=${admin.name}&background=f59e0b&color=fff`} 
                    alt={admin.name} 
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-900">#{startIndex + index + 1}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        Free
                      </span>
                    </div>
                    <div className="text-sm font-bold text-gray-900 mb-0.5">{admin.name}</div>
                    <div className="text-xs text-gray-600 mb-0.5 truncate">{admin.email}</div>
                    <div className="text-xs text-gray-500">{admin.phone}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditAdmin(admin)}
                    className="inline-flex items-center justify-center w-9 h-9 bg-[#005440] hover:bg-[#004435] text-white rounded-lg transition-colors"
                    aria-label="Edit administrator"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteClick(admin)}
                    className="inline-flex items-center justify-center w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    aria-label="Delete administrator"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
              Showing {startIndex + 1} to {endIndex} of {totalUsers} results
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-center order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  disabled={page === '...'}
                  className={`min-w-[32px] px-2 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                    page === currentPage ? 'bg-[#005440] text-white shadow-md border border-[#005440]' 
                    : page === '...' ? 'bg-transparent text-gray-400 cursor-default' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className="px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
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
        }}
        onConfirm={handleConfirmDelete}
        adminName={adminToDelete?.name || ''}
      />
    </div>
  );
}

export default Administrators;
