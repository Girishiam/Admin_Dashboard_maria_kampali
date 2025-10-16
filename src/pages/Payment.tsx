import React, { useState } from 'react';

interface Payment {
  serialNo: string;
  userName: string;
  userId: string;
  email: string;
  amount: string;
}

function Payment() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [payments] = useState<Payment[]>(
    Array.from({ length: 25 }, (_, i) => ({
      serialNo: '#1233',
      userName: 'Poritosh Barua',
      userId: '125',
      email: 'someone@gmail.com',
      amount: '$560'
    }))
  );

  // Pagination calculations
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = payments.slice(startIndex, endIndex);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
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
              {currentPayments.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{payment.serialNo}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">{payment.userName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{payment.userId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.email}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{payment.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {currentPayments.map((payment, index) => (
            <div key={index} className="bg-white border-b border-gray-100 last:border-b-0">
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-2">
                  {/* Serial No and Amount */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-900">{payment.serialNo}</span>
                    <span className="text-sm font-bold text-[#005440]">{payment.amount}</span>
                  </div>
                  
                  {/* User Name */}
                  <div className="text-sm font-bold text-gray-900">{payment.userName}</div>
                  
                  {/* User ID */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">User ID:</span>
                    <span className="text-xs font-semibold text-gray-900">{payment.userId}</span>
                  </div>
                  
                  {/* Email */}
                  <div className="text-xs text-gray-600 truncate">{payment.email}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
              Showing {startIndex + 1} to {Math.min(endIndex, payments.length)} of {payments.length} results
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-center order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
                disabled={currentPage === 1}
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
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className="px-3 py-1.5 bg-white text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-100 transition-all disabled:opacity-50 border border-gray-200"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
