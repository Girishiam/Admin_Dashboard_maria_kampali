import React from 'react';
import { XMarkIcon, ArrowPathIcon, NoSymbolIcon, ReceiptRefundIcon } from '@heroicons/react/24/outline';

interface ManageCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: any;
}

function ManageCustomerModal({ isOpen, onClose, subscription }: ManageCustomerModalProps) {
  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Manage Subscription</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500">Customer</p>
            <p className="text-lg font-bold text-gray-900">{subscription.customer_email}</p>
            <p className="text-sm text-gray-500 mt-2">Current Plan</p>
            <p className="text-lg font-bold text-[#005440]">{subscription.plan_name}</p>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left group">
              <div className="p-2 bg-white rounded-md shadow-sm group-hover:shadow text-blue-600">
                <ArrowPathIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Change Plan</p>
                <p className="text-xs text-gray-500">Upgrade or downgrade subscription</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left group">
              <div className="p-2 bg-white rounded-md shadow-sm group-hover:shadow text-orange-600">
                <ReceiptRefundIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Refund Payment</p>
                <p className="text-xs text-gray-500">Refund last payment to customer</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left group">
              <div className="p-2 bg-white rounded-md shadow-sm group-hover:shadow text-red-600">
                <NoSymbolIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-red-700 text-sm">Cancel Subscription</p>
                <p className="text-xs text-red-500">Immediately cancel access</p>
              </div>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageCustomerModal;
