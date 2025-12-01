import React, { useState, useEffect } from 'react';
import { 
  KeyIcon, 
  PlusIcon, 
  ClipboardDocumentIcon, 
  PencilSquareIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import CreateApiKeyModal from '../components/modals/CreateApiKeyModal';
import EditApiKeyModal from '../components/modals/EditApiKeyModal';
import { getApiKeys, updateApiKey, ApiKeyItem, ApiKeysResponse } from '../services/api_call';

function APIs() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKeyItem | null>(null);
  
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [groupedKeys, setGroupedKeys] = useState<Record<string, ApiKeyItem[]>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    configured: 0
  });

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const response = await getApiKeys();
      if (response.success) {
        // Override should_mask for STRIPE_PUBLISHABLE_KEY
        const processKeys = (keys: ApiKeyItem[]) => {
            return keys.map(k => {
                if (k.key === 'STRIPE_PUBLISHABLE_KEY') {
                    return { ...k, should_mask: true };
                }
                return k;
            });
        };

        const processedGrouped = Object.keys(response.grouped).reduce((acc, category) => {
            acc[category] = processKeys(response.grouped[category]);
            return acc;
        }, {} as Record<string, ApiKeyItem[]>);

        setGroupedKeys(processedGrouped);
        setCategories(response.categories);
        setStats({
          total: response.total_count,
          configured: response.configured_count
        });
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleCreateKey = (data: any) => {
    fetchApiKeys();
  };

  const handleEditClick = (apiKey: ApiKeyItem) => {
    setEditingKey(apiKey);
    setIsEditModalOpen(true);
  };

  const handleUpdateKey = async (key: string, value: string) => {
    try {
        const response = await updateApiKey(key, value);
        if (response.success) {
            fetchApiKeys();
        }
    } catch (error) {
        console.error('Failed to update API key:', error);
        alert('Failed to update API key');
    }
  };

  const toggleKeyVisibility = (key: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(key)) {
      newVisible.delete(key);
    } else {
      newVisible.add(key);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-500">Configured Keys</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.configured}</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <KeyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-500">Total Available</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-500">Completion</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {stats.total > 0 ? Math.round((stats.configured / stats.total) * 100) : 0}%
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <ArrowPathIcon className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 px-1">{category}</h2>
              
              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Value</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {groupedKeys[category]?.map((apiKey) => (
                        <tr key={apiKey.key} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900 text-sm">{apiKey.label}</div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">{apiKey.key}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-700 border border-gray-200 max-w-[300px] truncate">
                                {visibleKeys.has(apiKey.key) ? apiKey.value : (apiKey.should_mask ? '********************' : apiKey.value)}
                              </code>
                              {apiKey.should_mask && (
                                <button 
                                  onClick={() => toggleKeyVisibility(apiKey.key)}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  {visibleKeys.has(apiKey.key) ? (
                                    <EyeSlashIcon className="w-4 h-4" />
                                  ) : (
                                    <EyeIcon className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`
                              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${apiKey.is_set ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                            `}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${apiKey.is_set ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                              {apiKey.is_set ? 'Configured' : 'Not Set'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => copyToClipboard(apiKey.key, apiKey.value)}
                                className="p-1.5 text-gray-400 hover:text-[#005440] hover:bg-green-50 rounded-lg transition-all"
                                title="Copy Value"
                              >
                                {copiedId === apiKey.key ? (
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

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {groupedKeys[category]?.map((apiKey) => (
                  <div key={apiKey.key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{apiKey.label}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{apiKey.key}</div>
                      </div>
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${apiKey.is_set ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${apiKey.is_set ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                        {apiKey.is_set ? 'Set' : 'Empty'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <code className="bg-gray-100 px-2 py-1.5 rounded text-xs font-mono text-gray-700 border border-gray-200 flex-1 overflow-hidden text-ellipsis">
                        {visibleKeys.has(apiKey.key) ? apiKey.value : (apiKey.should_mask ? '********************' : apiKey.value)}
                      </code>
                      {apiKey.should_mask && (
                        <button 
                          onClick={() => toggleKeyVisibility(apiKey.key)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {visibleKeys.has(apiKey.key) ? (
                            <EyeSlashIcon className="w-4 h-4" />
                          ) : (
                            <EyeIcon className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button 
                        onClick={() => copyToClipboard(apiKey.key, apiKey.value)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm text-gray-600 hover:text-[#005440] hover:bg-green-50 rounded-lg transition-all border border-gray-200"
                      >
                        {copiedId === apiKey.key ? (
                          <>
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <ClipboardDocumentIcon className="w-4 h-4" />
                            <span>Copy Value</span>
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
            </div>
          ))}
        </div>
      )}

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