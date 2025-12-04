import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CreatePlanData } from '../../services/api_call';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePlanData) => Promise<void>;
}

function CreatePlanModal({ isOpen, onClose, onSubmit }: CreatePlanModalProps) {
  const [formData, setFormData] = useState<CreatePlanData>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    plan_type: 'recurring',
    interval: 'month',
    interval_count: 1,
    trial_period_days: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        slug: '', 
        description: '',
        price: 0,
        plan_type: 'recurring',
        interval: 'month',
        interval_count: 1,
        trial_period_days: 0
      });
    } catch (err: any) {
      console.error('Failed to create plan:', err);
      setError(err.error || 'Failed to create plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90%] sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white flex-shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Create New Plan</h2>
          <button 
            onClick={handleClose} 
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            disabled={isLoading}
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-3.5">
            {/* Error Message */}
            {error && (
              <div className="p-2.5 bg-red-50 border border-red-100 text-red-700 text-xs sm:text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* Plan Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Plan Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm placeholder:text-gray-400"
                placeholder="e.g. Pro Plan"
                disabled={isLoading}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm placeholder:text-gray-400"
                placeholder="e.g. pro-plan"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm placeholder:text-gray-400"
                placeholder="e.g. Monthly Plan without Trial Period"
                disabled={isLoading}
              />
            </div>
            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Price</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full pl-8 pr-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm placeholder:text-gray-400"
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Plan Type and Interval */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Plan Type</label>
                <select
                  value={formData.plan_type}
                  onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm bg-white appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25em 1.25em',
                    paddingRight: '2rem'
                  }}
                  disabled={isLoading}
                >
                  <option value="recurring">Recurring</option>
                  <option value="one_time">One Time</option>
                </select>
              </div>
              
              {formData.plan_type === 'recurring' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Interval</label>
                  <select
                    value={formData.interval}
                    onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm bg-white appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.25em 1.25em',
                      paddingRight: '2rem'
                    }}
                    disabled={isLoading}
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                    <option value="week">Weekly</option>
                    <option value="day">Daily</option>
                  </select>
                </div>
              )}
            </div>

            {/* Interval Count and Trial Days */}
            {formData.plan_type === 'recurring' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Interval Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.interval_count}
                    onChange={(e) => setFormData({ ...formData, interval_count: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Trial Days</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.trial_period_days}
                    onChange={(e) => setFormData({ ...formData, trial_period_days: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer with Buttons */}
          <div className="px-5 py-3.5 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-[#005440] text-white rounded-lg font-semibold hover:bg-[#004435] transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  'Create Plan'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePlanModal;