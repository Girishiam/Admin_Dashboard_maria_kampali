import React, { useState } from 'react';
import { NoSymbolIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  userEmail: string;
  subscription: string;
  phone: string;
  avatar: string;
  isDisabled?: boolean;
}

interface UserActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
  isDisabled: boolean;
  onDisableUser: (userId: string, disabled: boolean) => void;
  onDeleteClick: () => void;
}

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

// User Action Modal Component
function UserActionModal({ 
  isOpen, 
  onClose, 
  userName, 
  userId,
  isDisabled,
  onDisableUser,
  onDeleteClick
}: UserActionModalProps) {
  const [localDisabled, setLocalDisabled] = useState(isDisabled);

  if (!isOpen) return null;

  const handleToggleDisable = () => {
    const newState = !localDisabled;
    setLocalDisabled(newState);
    onDisableUser(userId, newState);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Action</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-sm text-gray-600">
            Managing actions for: <span className="font-semibold text-gray-900">{userName}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-semibold text-gray-900">Disable User Access</span>
            <button
              onClick={handleToggleDisable}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localDisabled ? 'bg-[#005440]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localDisabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-semibold text-gray-900">Delete User Account</span>
            <button
              onClick={onDeleteClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#005440] hover:bg-[#004435] text-white rounded-lg font-semibold text-sm transition-all"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Delete</span>
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
  const itemsPerPage = 10;

  const [users, setUsers] = useState<User[]>(
    Array.from({ length: 35 }, (_, i) => ({
      id: `#${1233 + i}`,
      name: 'Foysal Rahman',
      email: `user${i}@example.com`,
      userEmail: 'bockely@att.com',
      subscription: i % 3 === 0 ? 'Free' : '1 Month',
      phone: `(${200 + i}) 555-${String(i).padStart(4, '0')}`,
      avatar: `https://ui-avatars.com/api/?name=Foysal+Rahman&background=f59e0b&color=fff&seed=${i}`,
      isDisabled: false
    }))
  );

  const filteredUsers = users.filter(user => {
    if (activeTab === 'free') return user.subscription === 'Free';
    if (activeTab === 'subscribers') return user.subscription !== 'Free';
    return true;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

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

  const handleTabChange = (tab: 'all' | 'free' | 'subscribers') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleUserAction = (user: User) => {
    setSelectedUser(user);
    setShowActionModal(true);
  };

  const handleDisableUser = (userId: string, disabled: boolean) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isDisabled: disabled } : user
    ));
  };

  const handleDeleteClick = () => {
    setUserToDelete(selectedUser);
    setShowActionModal(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setUserToDelete(null);
      setSelectedUser(null);
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
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Subscription</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Phone Number</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={index} className={`hover:bg-gray-50 transition-colors ${user.isDisabled ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          {user.name}
                          {user.isDisabled && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">Disabled</span>}
                        </div>
                        <div className="text-xs text-gray-500">{user.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{user.subscription}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{user.phone}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleUserAction(user)}
                      className="inline-flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <NoSymbolIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {currentUsers.map((user, index) => (
            <div key={index} className={`p-4 hover:bg-gray-50 transition-colors ${user.isDisabled ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500">{user.id}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        user.subscription === 'Free' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {user.subscription}
                      </span>
                      {user.isDisabled && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">Disabled</span>}
                    </div>
                    <div className="text-sm font-bold text-gray-900 mb-0.5">{user.name}</div>
                    <div className="text-xs text-gray-600 mb-0.5 truncate">{user.email}</div>
                    <div className="text-xs text-gray-500">{user.phone}</div>
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
          ))}
        </div>

        {/* Pagination */}
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} results
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
      {selectedUser && (
        <UserActionModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          userName={selectedUser.name}
          userId={selectedUser.id}
          isDisabled={selectedUser.isDisabled || false}
          onDisableUser={handleDisableUser}
          onDeleteClick={handleDeleteClick}
        />
      )}
      
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.name || ''}
      />
    </div>
  );
}

export default UserManagement;
