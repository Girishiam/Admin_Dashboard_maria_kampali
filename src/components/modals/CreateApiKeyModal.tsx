import React, { useState } from 'react';
import { XMarkIcon, KeyIcon } from '@heroicons/react/24/outline';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

function CreateApiKeyModal({ isOpen, onClose, onSubmit }: CreateApiKeyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    expiration: 'never',
    scopes: ['read']
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-lg">
              <KeyIcon className="w-6 h-6 text-[#005440]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Create API Key</h2>
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
            <label className="block text-sm font-semibold text-gray-900 mb-2">Expiration</label>
            <select
              value={formData.expiration}
              onChange={(e) => setFormData({ ...formData, expiration: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm bg-white"
            >
              <option value="never">Never</option>
              <option value="30d">30 Days</option>
              <option value="60d">60 Days</option>
              <option value="90d">90 Days</option>
              <option value="1y">1 Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Permissions</label>
            <div className="space-y-2">
              {['read', 'write', 'admin'].map((scope) => (
                <label key={scope} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.scopes.includes(scope)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, scopes: [...formData.scopes, scope] });
                      } else {
                        setFormData({ ...formData, scopes: formData.scopes.filter(s => s !== scope) });
                      }
                    }}
                    className="w-4 h-4 text-[#005440] border-gray-300 rounded focus:ring-[#005440]"
                  />
                  <span className="text-sm text-gray-700 capitalize">{scope} Access</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#005440] text-white rounded-lg font-semibold hover:bg-[#004435] transition-all text-sm shadow-lg shadow-teal-900/10"
            >
              Generate Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateApiKeyModal;
