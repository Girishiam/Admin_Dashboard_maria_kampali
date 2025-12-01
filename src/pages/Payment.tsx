import React, { useState, useEffect } from 'react';
import { getPayments, Payment as PaymentType, PaymentsResponse } from '../services/api_call';

function Payment() {
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaymentsResponse['pagination'] | null>(null);

  const fetchPayments = async (page: number) => {
    setLoading(true);
    try {
      const response = await getPayments(page);
      if (response.success) {
        setPayments(response.payments);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage);
  }, [currentPage]);

  const getPageNumbers = () => {
    return pagination?.page_numbers || [];
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Payment Serial no</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">User Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">User ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{payment.payment_serial_no}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">{payment.user_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{payment.user_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.email}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{payment.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Loading payments...</div>
          ) : payments.length === 0 ? (
             <div className="p-8 text-center text-gray-500">No payments found.</div>
          ) : (
            payments.map((payment, index) => (
              <div key={index} className="bg-white border-b border-gray-100 last:border-b-0">
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-2">
                    {/* Serial No and Amount */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-900">{payment.payment_serial_no}</span>
                      <span className="text-sm font-bold text-[#005440]">{payment.amount}</span>
                    </div>
                    
                    {/* User Name */}
                    <div className="text-sm font-bold text-gray-900">{payment.user_name}</div>
                    
                    {/* User ID */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">User ID:</span>
                      <span className="text-xs font-semibold text-gray-900">{payment.user_id}</span>
                    </div>
                    
                    {/* Email */}
                    <div className="text-xs text-gray-600 truncate">{payment.email}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.total_pages > 0 && (
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                Showing {pagination.start_index} to {pagination.end_index} of {pagination.total_count} results
                </div>
                <div className="flex items-center gap-1 flex-wrap justify-center order-1 sm:order-2">
                <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className="px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
                    disabled={!pagination.has_previous}
                >
                    Prev
                </button>
                {getPageNumbers().map((page, index) => (
                    <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                    className={`min-w-[32px] px-2 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                        page === currentPage ? 'bg-[#005440] text-white shadow-md border border-[#005440]' 
                        : page === '...' ? 'bg-transparent text-gray-400 cursor-default' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                    >
                    {page}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage(Math.min(pagination.total_pages, currentPage + 1))}
                    className="px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
                    disabled={!pagination.has_next}
                >
                    Next
                </button>
                </div>
            </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
