import React, { useState } from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

interface UserActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
  isDisabled: boolean;
  onDisableUser: (userId: string, disabled: boolean) => void;
  onDeleteUser: (userId: string) => void;
}

function UserActionModal({ 
  isOpen, 
  onClose, 
  userName, 
  userId,
  isDisabled,
  onDisableUser,
  onDeleteUser
}: UserActionModalProps) {
  const [localIsDisabled, setLocalIsDisabled] = useState(isDisabled);

  React.useEffect(() => {
    setLocalIsDisabled(isDisabled);
  }, [isDisabled]);

  if (!isOpen) return null;

  const handleToggleDisable = () => {
    const newState = !localIsDisabled;
    setLocalIsDisabled(newState);
    onDisableUser(userId, newState);
  };

  const handleDelete = () => {
    onDeleteUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Action</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="text-sm text-gray-600 mb-4">
            Managing actions for: <span className="font-semibold text-gray-900">{userName}</span>
          </div>

          {/* Disable User Access Toggle */}
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-semibold text-gray-900">Disable User Access</span>
            <button
              onClick={handleToggleDisable}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localIsDisabled ? 'bg-[#005440]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localIsDisabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Delete User Account Button */}
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-semibold text-gray-900">Delete User Account</span>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-all"
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

export default UserActionModal;
