import React, { useState } from 'react';

interface ApiKey {
  id: string;
  label: string;
  value: string;
}

function APIs() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: '1', label: 'Enter your api key here', value: '' },
    { id: '2', label: 'Enter your api key here', value: '' }
  ]);

  const handleInputChange = (id: string, value: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, value } : key
    ));
  };

  const handleSave = (id: string) => {
    const apiKey = apiKeys.find(key => key.id === id);
    if (apiKey && apiKey.value.trim()) {
      alert(`API Key saved: ${apiKey.value}`);
      // Here you would typically save to backend
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
        {/* Title */}
        <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Live Score Update Api</h2>
        </div>

        {/* API Key Inputs */}
        <div className="p-4 sm:p-5 md:p-6 space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="text"
                value={apiKey.value}
                onChange={(e) => handleInputChange(apiKey.id, e.target.value)}
                placeholder={apiKey.label}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] transition-all text-sm placeholder-gray-400"
              />
              <button
                onClick={() => handleSave(apiKey.id)}
                className="px-6 py-3 bg-[#005440] text-white rounded-lg font-semibold text-sm hover:bg-[#004435] transition-all whitespace-nowrap"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default APIs;
