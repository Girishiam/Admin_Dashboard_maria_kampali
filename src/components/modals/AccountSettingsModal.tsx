import React, { useState, useEffect } from 'react';
import { XMarkIcon, CameraIcon } from '@heroicons/react/24/outline';
import { ProfileResponse, updateProfile, LoginError } from '../../services/api_call';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPasswordModal: () => void;
  profileData: ProfileResponse['data'] | null;
  onProfileUpdate: () => Promise<void> | void;
}

function AccountSettingsModal({ isOpen, onClose, onOpenPasswordModal, profileData, onProfileUpdate }: AccountSettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    image: null as File | null
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        role: profileData.role_display, // Use display role
        image: null
      });
    }
  }, [profileData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      if (formData.image) {
        data.append('image', formData.image);
      }

      await updateProfile(data);
      await onProfileUpdate();
      onClose();
    } catch (err) {
      const errorData = err as LoginError;
      setError(errorData.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 sm:p-5 lg:p-6 border-b border-gray-200 rounded-t-xl sm:rounded-t-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Account Setting</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        {error && (
          <div className="px-4 sm:px-5 lg:px-6 pt-3 sm:pt-4">
            <div className="bg-red-50 text-red-500 text-xs sm:text-sm p-2.5 sm:p-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Image - Responsive Layout */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
              Profile Image
            </label>
            
            {/* Mobile Layout (Stacked) */}
            <div className="block sm:hidden space-y-3">
              {/* Current Image Preview */}
              {profileData?.image && (
                <div className="flex justify-center">
                  <img 
                    src={profileData.image} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              )}
              
              {/* File Input */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="No file chosen"
                  readOnly
                  value={formData.image?.name || ''}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-xs truncate"
                />
                <label className="w-full px-4 py-2.5 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                  <CameraIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Choose Image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>

            {/* Desktop Layout (Horizontal) */}
            <div className="hidden sm:flex gap-3 items-center">
              {profileData?.image && (
                <img 
                  src={profileData.image} 
                  alt="Profile" 
                  className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border border-gray-200 flex-shrink-0"
                />
              )}
              <div className="flex-1 flex gap-2 lg:gap-3 min-w-0">
                <input
                  type="text"
                  placeholder="Choose Image"
                  readOnly
                  value={formData.image?.name || ''}
                  className="flex-1 px-3 lg:px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm truncate min-w-0"
                />
                <label className="px-4 lg:px-6 py-2.5 lg:py-3 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors flex items-center gap-2 flex-shrink-0">
                  <CameraIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="text-xs lg:text-sm font-semibold hidden md:inline">Choose</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
              Role
            </label>
            <input
              type="text"
              value={formData.role}
              readOnly
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
            />
          </div>

          {/* Buttons - Responsive */}
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
              disabled={loading}
              className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#005440] text-white rounded-lg font-semibold hover:bg-[#004435] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountSettingsModal;