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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Account Setting</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {error && (
          <div className="px-6 pt-4">
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Image</label>
            <div className="flex gap-3 items-center">
              {profileData?.image && (
                <img 
                  src={profileData.image} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
              )}
              <div className="flex-1 flex gap-3">
                <input
                  type="text"
                  placeholder="Choose Image"
                  readOnly
                  value={formData.image?.name || ''}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <label className="px-6 py-3 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors flex items-center gap-2">
                  <CameraIcon className="w-5 h-5" />
                  <span className="text-sm font-semibold">Choose</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Role</label>
            <input
              type="text"
              value={formData.role}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
            />
          </div>

          {/* Buttons */}
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
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#005440] text-white rounded-lg font-semibold hover:bg-[#004435] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountSettingsModal;
