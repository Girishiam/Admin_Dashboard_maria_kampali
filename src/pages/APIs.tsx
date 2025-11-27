import React, { useState } from 'react';
import { 
  KeyIcon, 
  PlusIcon, 
  ClipboardDocumentIcon, 
  PencilSquareIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import CreateApiKeyModal from '../components/modals/CreateApiKeyModal';
import EditApiKeyModal from '../components/modals/EditApiKeyModal';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  key: string;
  status: 'active' | 'revoked';
  created: string;
  lastUsed: string;
  scopes: string[];
}

function APIs() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { 
      id: '1', 
      name: 'Production Server', 
      prefix: 'pk_live', 
      key: 'pk_live_51MzT2...', 
      status: 'active',
      created: 'Nov 20, 2024',
      lastUsed: '2 mins ago',
      scopes: ['read', 'write']
    },
    { 
      id: '2', 
      name: 'Development Test', 
      prefix: 'pk_test', 
      key: 'pk_test_89XyQ1...', 
      status: 'active',
      created: 'Nov 15, 2024',
      lastUsed: '1 hour ago',
      scopes: ['read']
    },
    { 
      id: '3', 
      name: 'Legacy App', 
      prefix: 'pk_live', 
      key: 'pk_live_99AzB3...', 
      status: 'revoked',
      created: 'Oct 01, 2024',
      lastUsed: 'Never',
      scopes: ['read']
    }
  ]);

  const handleCreateKey = (data: any) => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: data.name,
      prefix: 'pk_live',
      key: `pk_live_${Math.random().toString(36).substring(2, 15)}...`,
      status: 'active',
      created: 'Just now',
      lastUsed: 'Never',
      scopes: data.scopes || ['read']
    };
    setApiKeys([newKey, ...apiKeys]);
  };

  const handleEditClick = (apiKey: ApiKey) => {
    setEditingKey(apiKey);
    setIsEditModalOpen(true);
  };

  const handleUpdateKey = (id: string, data: any) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, name: data.name, key: data.key } : key
    ));
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Manage your API keys for external access</p>
        </div>
        {/* <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#005440] text-white rounded-lg hover:bg-[#004433] transition-colors font-medium text-sm shadow-lg shadow-teal-900/10"
        >
          <PlusIcon className="w-4 h-4" />
          Generate New Key
        </button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-500">Active Keys</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{apiKeys.filter(k => k.status === 'active').length}</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <KeyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-500">Total Requests</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">1.2M</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-500">Success Rate</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">99.9%</p>
        </div>
      </div>

      {/* API Keys List - Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">API Key</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Last Used</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {apiKeys.map((apiKey) => (
                <tr key={apiKey.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 text-sm">{apiKey.name}</div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">{apiKey.prefix}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-700 border border-gray-200">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : `${apiKey.key.substring(0, 8)}••••••••••••••••`}
                      </code>
                      <button 
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeSlashIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${apiKey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${apiKey.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {apiKey.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{apiKey.created}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{apiKey.lastUsed}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => copyToClipboard(apiKey.id, apiKey.key)}
                        className="p-1.5 text-gray-400 hover:text-[#005440] hover:bg-green-50 rounded-lg transition-all"
                        title="Copy Key"
                      >
                        {copiedId === apiKey.id ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        ) : (
                          <ClipboardDocumentIcon className="w-5 h-5" />
                        )}
                      </button>
                      <button 
                        onClick={() => handleEditClick(apiKey)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Key"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Keys List - Mobile/Tablet Cards */}
      <div className="lg:hidden space-y-3">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-gray-900 text-sm">{apiKey.name}</div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">{apiKey.prefix}</div>
              </div>
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                ${apiKey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
              `}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${apiKey.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {apiKey.status}
              </span>
            </div>

            {/* API Key */}
            <div className="flex items-center gap-2 mb-3">
              <code className="bg-gray-100 px-2 py-1.5 rounded text-xs font-mono text-gray-700 border border-gray-200 flex-1 overflow-hidden text-ellipsis">
                {visibleKeys.has(apiKey.id) ? apiKey.key : `${apiKey.key.substring(0, 8)}••••••••`}
              </code>
              <button 
                onClick={() => toggleKeyVisibility(apiKey.id)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {visibleKeys.has(apiKey.id) ? (
                  <EyeSlashIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
              <span>Created: {apiKey.created}</span>
              <span>Last used: {apiKey.lastUsed}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button 
                onClick={() => copyToClipboard(apiKey.id, apiKey.key)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm text-gray-600 hover:text-[#005440] hover:bg-green-50 rounded-lg transition-all border border-gray-200"
              >
                {copiedId === apiKey.id ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    <span>Copy Key</span>
                  </>
                )}
              </button>
              <button 
                onClick={() => handleEditClick(apiKey)}
                className="flex items-center justify-center gap-2 py-2 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-gray-200"
              >
                <PencilSquareIcon className="w-4 h-4" />
                <span className="sm:inline hidden">Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <CreateApiKeyModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreateKey}
      />

      <EditApiKeyModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        apiKey={editingKey}
        onSubmit={handleUpdateKey}
      />
    </div>
  );
}

export default APIs;