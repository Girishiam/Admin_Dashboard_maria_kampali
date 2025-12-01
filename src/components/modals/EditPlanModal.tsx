import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { UpdatePlanData, SubscriptionPlan } from '../../services/api_call';

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdatePlanData) => Promise<void>;
  plan: SubscriptionPlan | null;
}

function EditPlanModal({ isOpen, onClose, onSubmit, plan }: EditPlanModalProps) {
  const [formData, setFormData] = useState<UpdatePlanData>({
    name: '',
    slug: '',
    price: 0,
    plan_type: 'recurring',
    interval: 'month',
    interval_count: 1,
    trial_period_days: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || '',
        slug: plan.slug || '',
        price: parseFloat(plan.price) || 0,
        plan_type: plan.plan_type || 'recurring',
        interval: plan.interval || 'month',
        interval_count: plan.interval_count || 1,
        trial_period_days: plan.trial_period_days || 0
      });
    }
    setError(null);
  }, [plan, isOpen]);

  if (!isOpen || !plan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onSubmit(plan.id, formData);
      onClose();
    } catch (err: any) {
      console.error('Failed to update plan:', err);
      setError(err.error || 'Failed to update plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Plan</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Plan Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm"
              placeholder="e.g. Pro Plan"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Slug</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm"
              placeholder="e.g. pro-plan"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Plan Type</label>
              <select
                value={formData.plan_type}
                onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm bg-white"
                disabled={isLoading}
              >
                <option value="recurring">Recurring</option>
                <option value="one_time">One Time</option>
              </select>
            </div>
            
            {formData.plan_type === 'recurring' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Interval</label>
                <select
                  value={formData.interval}
                  onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm bg-white"
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

          {formData.plan_type === 'recurring' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Interval Count</label>
                <input
                  type="number"
                  min="1"
                  value={formData.interval_count}
                  onChange={(e) => setFormData({ ...formData, interval_count: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Trial Days</label>
                <input
                  type="number"
                  min="0"
                  value={formData.trial_period_days}
                  onChange={(e) => setFormData({ ...formData, trial_period_days: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005440] focus:border-[#005440] text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#005440] text-white rounded-lg font-semibold hover:bg-[#004435] transition-all text-sm flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPlanModal;
