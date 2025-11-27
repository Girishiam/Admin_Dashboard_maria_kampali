import React, { useState, useEffect } from 'react';
import { XMarkIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

interface EditApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: any;
  onSubmit: (id: string, data: any) => void;
}

function EditApiKeyModal({ isOpen, onClose, apiKey, onSubmit }: EditApiKeyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    key: ''
  });

  useEffect(() => {
    if (apiKey) {
      setFormData({
        name: apiKey.name,
        key: apiKey.key
      });
    }
  }, [apiKey]);

  if (!isOpen || !apiKey) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(apiKey.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <PencilSquareIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Edit API Key</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Key Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm"
              placeholder="e.g. Production Server"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">API Key</label>
            <input
              type="text"
              required
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm font-mono"
              placeholder="pk_live_..."
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#005440] text-white rounded-lg font-semibold hover:bg-[#004435] transition-all text-sm shadow-lg shadow-teal-900/10"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditApiKeyModal;
