import React, { useState, useEffect } from 'react';
import { XMarkIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { ApiKeyItem } from '../../services/api_call';

interface EditApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: ApiKeyItem | null;
  onSubmit: (key: string, value: string) => void;
}

function EditApiKeyModal({ isOpen, onClose, apiKey, onSubmit }: EditApiKeyModalProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (apiKey) {
      setValue(apiKey.value);
    }
  }, [apiKey]);

  if (!isOpen || !apiKey) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(apiKey.key, value);
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
            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
              {apiKey.label}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Key ID</label>
            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-500">
              {apiKey.key}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">API Key Value</label>
            <input
              type="text"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm font-mono"
              placeholder="Enter new key value"
            />
            <p className="mt-2 text-xs text-gray-500">
              Updating this key requires a server restart for changes to take full effect.
            </p>
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
