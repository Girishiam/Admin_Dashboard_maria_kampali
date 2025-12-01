import React, { useState, useEffect } from 'react';
import { NoSymbolIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { 
  getUsers, 
  toggleUserStatus, 
  deleteUser, 
  User, 
  UsersListResponse 
} from '../services/api_call';
import UserActionModal from '../components/modals/UserActionModal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

// Delete Confirmation Modal
function DeleteConfirmModal({ isOpen, onClose, onConfirm, userName }: DeleteConfirmModalProps) {
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
            Are you sure you want to delete <span className="font-semibold text-gray-900">{userName}</span>'s account? This action cannot be undone.
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

// Main User Management Component
function UserManagement() {
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'subscribers'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<UsersListResponse['pagination'] | null>(null);

  const fetchUsers = async (page: number, filter: string) => {
    setLoading(true);
    try {
      const response = await getUsers(page, filter);
      if (response.success) {
        setUsers(response.users);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, activeTab);
  }, [currentPage, activeTab]);

  const getPageNumbers = () => {
    return pagination?.page_numbers || [];
  };

  const startIndex = pagination?.start_index ? pagination.start_index - 1 : (currentPage - 1) * 10;

  const handleTabChange = (tab: 'all' | 'free' | 'subscribers') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleUserAction = (user: User) => {
    setSelectedUser(user);
    setShowActionModal(true);
  };

  const handleDisableUser = async (userId: string, disabled: boolean) => {
    try {
        // The API expects the NEW state. 
        // If the user was disabled (true), we want to enable (false).
        // If the user was enabled (false), we want to disable (true).
        // The 'disabled' param coming from the modal is the NEW state requested.
      const response = await toggleUserStatus(userId, disabled);
      if (response.success) {
        // Optimistically update the UI
        setUsers(users.map(user => 
          user.id === userId ? { ...user, is_disabled: disabled } : user
        ));
        // Also update selected user if it's the one being modified
        if (selectedUser && selectedUser.id === userId) {
            setSelectedUser({ ...selectedUser, is_disabled: disabled });
        }
      } else {
        console.error('Failed to toggle user status:', response.error);
        // Revert local state if needed (though we only updated on success here)
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDeleteClick = () => {
    setUserToDelete(selectedUser);
    setShowActionModal(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        const response = await deleteUser(userToDelete.id);
        if (response.success) {
          setUsers(users.filter(user => user.id !== userToDelete.id));
          setUserToDelete(null);
          setSelectedUser(null);
          // Refresh list if needed, or just remove from local state as done above
          if (users.length === 1 && currentPage > 1) {
             setCurrentPage(currentPage - 1);
          } else {
             fetchUsers(currentPage, activeTab);
          }
        } else {
          console.error('Failed to delete user:', response.error);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
        {/* Header with Tabs */}
        <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => handleTabChange('all')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === 'all' ? 'bg-[#005440] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleTabChange('free')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === 'free' ? 'bg-[#005440] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Free
            </button>
            <button
              onClick={() => handleTabChange('subscribers')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === 'subscribers' ? 'bg-[#005440] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Subscribers
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">SL no.</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">User</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Contact Number</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Subscription</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.is_disabled ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                      #{startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.user.profile_picture || user.user.avatar_url} alt={user.user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                        <div>
                          <div className="text-sm font-bold text-gray-900">{user.user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{user.phone_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.subscription.is_free ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {user.subscription.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleUserAction(user)}
                        className="inline-flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <NoSymbolIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : users.length === 0 ? (
             <div className="p-8 text-center text-gray-500">No users found.</div>
          ) : (
            users.map((user, index) => (
              <div key={user.id} className={`p-4 hover:bg-gray-50 transition-colors ${user.is_disabled ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <img src={user.user.profile_picture || user.user.avatar_url} alt={user.user.name} className="w-12 h-12 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500">#{startIndex + index + 1}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          user.subscription.is_free ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {user.subscription.name}
                        </span>
                        {user.is_disabled && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">Disabled</span>}
                      </div>
                      <div className="text-sm font-bold text-gray-900 mb-0.5">{user.user.name}</div>
                      <div className="text-xs text-gray-600 mb-0.5 truncate">{user.email}</div>
                      <div className="text-xs text-gray-500">{user.phone_number}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleUserAction(user)}
                    className="inline-flex items-center justify-center w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex-shrink-0"
                  >
                    <NoSymbolIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.total_pages > 0 && (
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                Showing {pagination.start_index} to {pagination.end_index} of {pagination.total_count} results
                </div>
                <div className="flex items-center gap-1 flex-wrap justify-center order-1 sm:order-2">
                <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className="px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
                    disabled={!pagination.has_previous}
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
                    onClick={() => setCurrentPage(Math.min(pagination.total_pages, currentPage + 1))}
                    className="px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
                    disabled={!pagination.has_next}
                >
                    Next
                </button>
                </div>
            </div>
            </div>
        )}
      </div>

      {/* Modals */}
      {selectedUser && (
        <UserActionModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          userName={selectedUser.user.name}
          userId={selectedUser.id}
          isDisabled={selectedUser.is_disabled}
          onDisableUser={handleDisableUser}
          onDeleteUser={() => handleDeleteClick()}
        />
      )}
      
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.user.name || ''}
      />
    </div>
  );
}

export default UserManagement;
