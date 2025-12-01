import React from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { SubscriptionPlan } from '../../services/api_call';

interface PlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
}

function PlanDetailsModal({ isOpen, onClose, plan }: PlanDetailsModalProps) {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Plan Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{plan.slug}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${!plan.is_deleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {!plan.is_deleted ? 'Active' : 'Deleted'}
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-[#005440]">${plan.price}</span>
            <span className="text-gray-500 font-medium">/{plan.currency} {plan.interval ? `per ${plan.interval}` : '(Lifetime)'}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Subscribers</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{plan.subscriber_count}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Trial Period</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{plan.trial_period_days} days</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
            {plan.features && plan.features.length > 0 ? (
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No features listed.</p>
            )}
          </div>

          {plan.description && (
            <div>
               <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
               <p className="text-sm text-gray-600">{plan.description}</p>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanDetailsModal;
