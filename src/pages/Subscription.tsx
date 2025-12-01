import React, { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon, 
  UsersIcon, 
  TicketIcon, 
  CreditCardIcon,
  PlusIcon,
  ArrowPathIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import CreatePlanModal from '../components/modals/CreatePlanModal';
import EditPlanModal from '../components/modals/EditPlanModal';
import PlanDetailsModal from '../components/modals/PlanDetailsModal';

import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import SubscriptionGrowthChart from '../components/charts/SubscriptionGrowthChart';
import { 
  getSubscriptionDashboard, 
  SubscriptionDashboardResponse,
  getSubscriptionPlans,
  deleteSubscriptionPlan,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  bulkSyncPlans,
  bulkDeletePlans,
  SubscriptionPlan,
  getSubscriptionChartData,
  ChartDataPoint,
  CreatePlanData,
  UpdatePlanData,
  getSubscriptions,
  SubscriptionItem,
  getCustomers,
  CustomerItem
} from '../services/api_call';

function Subscription() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'plans' | 'subscriptions' | 'customers'>('dashboard');
  
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);


  const [dashboardData, setDashboardData] = useState<SubscriptionDashboardResponse | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingDashboard(true);
      try {
        const response = await getSubscriptionDashboard();
        if (response.success) {
          setDashboardData(response);
        }
      } catch (error) {
        console.error('Failed to fetch subscription dashboard:', error);
      } finally {
        setLoadingDashboard(false);
      }
    };

    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        const response = await getSubscriptionChartData();
        if (response.success) {
          setChartData(response.chart_data);
        }
      } catch (error) {
        console.error('Failed to fetch subscription chart data:', error);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchDashboardData();
    fetchChartData();
  }, []);

  const fetchPlans = async () => {
    setLoadingPlans(true);
    try {
      const response = await getSubscriptionPlans();
      if (response.success) {
        setPlans(response.plans.filter(plan => !plan.is_deleted));
        setSelectedPlanIds([]);
      }
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchSubscriptions = async (page: number = 1) => {
    setLoadingSubscriptions(true);
    try {
      const response = await getSubscriptions(page, limit);
      if (response.success) {
        setSubscriptions(response.subscriptions);
        setTotalPages(response.pages);
        setTotalSubscriptions(response.total);
        setCurrentPage(response.page);
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const response = await getCustomers();
      if (response.success) {
        setCustomers(response.customers);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'plans' && plans.length === 0) {
      fetchPlans();
    }
    if (activeTab === 'subscriptions') {
      fetchSubscriptions(currentPage);
    }
    if (activeTab === 'customers' && customers.length === 0) {
      fetchCustomers();
    }
  }, [activeTab, plans.length, customers.length]);

  const handleCreatePlan = async (data: CreatePlanData) => {
    await createSubscriptionPlan(data);
    await fetchPlans();
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsEditPlanOpen(true);
  };

  const handleUpdatePlan = async (id: string, data: UpdatePlanData) => {
    await updateSubscriptionPlan(id, data);
    await fetchPlans();
    setIsEditPlanOpen(false);
    setEditingPlan(null);
  };

  const handleDeleteClick = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteSubscriptionPlan(planToDelete.id);
      await fetchPlans();
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error('Failed to delete plan:', error);
      alert('Failed to delete plan. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSyncPlans = async () => {
    setIsSyncing(true);
    try {
      await bulkSyncPlans();
      await fetchPlans();
      alert('Plans synced with Stripe successfully!');
    } catch (error) {
      console.error('Failed to sync plans:', error);
      alert('Failed to sync plans. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const togglePlanSelection = (planId: string) => {
    setSelectedPlanIds(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedPlanIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedPlanIds.length} plans?`)) return;

    setIsBulkDeleting(true);
    try {
      await bulkDeletePlans({ plan_ids: selectedPlanIds });
      await fetchPlans();
      setSelectedPlanIds([]);
      alert('Selected plans deleted successfully!');
    } catch (error) {
      console.error('Failed to delete plans:', error);
      alert('Failed to delete selected plans. Please try again.');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
            <p className="text-gray-500 mt-1">Manage plans, subscriptions, and billing</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleSyncPlans}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Stripe</span>
            </button>
            <button 
              onClick={() => setIsCreatePlanOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#005440] text-white rounded-lg hover:bg-[#004433] transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Create Plan</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 -mb-px border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'dashboard', name: 'Overview', icon: CurrencyDollarIcon },
              { id: 'plans', name: 'Plans', icon: TicketIcon },
              { id: 'subscriptions', name: 'Subscriptions', icon: UsersIcon },
              { id: 'customers', name: 'Customers', icon: UsersIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'dashboard' | 'plans' | 'subscriptions' | 'customers')}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-[#005440] text-[#005440]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className={`
                  -ml-0.5 mr-2 h-5 w-5
                  ${activeTab === tab.id ? 'text-[#005440]' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats.total_revenue.value || '$0'}</p>
                  <p className={`text-xs ${dashboardData?.stats.total_revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardData?.stats.total_revenue.change}
                  </p>
                </div>
              </div>
            </div>

            {/* MRR */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <CreditCardIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">MRR</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats.mrr.value || '$0'}</p>
                  <p className={`text-xs ${dashboardData?.stats.mrr.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardData?.stats.mrr.change}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Subscriptions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Subs</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats.active_subs.value || '0'}</p>
                  <p className={`text-xs ${dashboardData?.stats.active_subs.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardData?.stats.active_subs.change}
                  </p>
                </div>
              </div>
            </div>

            {/* Churn Rate */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <ArrowPathIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Churn Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats.churn_rate.value || '0%'}</p>
                  <p className={`text-xs ${dashboardData?.stats.churn_rate.is_positive ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardData?.stats.churn_rate.change}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Growth</h3>
            {loadingChart ? (
              <div className="h-64 flex items-center justify-center">
                <ArrowPathIcon className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <SubscriptionGrowthChart data={chartData} isLoading={loadingChart} />
            )}
          </div>
        </div>
      )}

      {/* PLANS TAB */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          {/* Bulk Actions */}
          {selectedPlanIds.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedPlanIds.length} plan(s) selected
              </span>
              <button
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <TrashIcon className="w-4 h-4" />
                Delete Selected
              </button>
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadingPlans ? (
              <div className="col-span-full flex justify-center py-12">
                <ArrowPathIcon className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : plans.length > 0 ? (
              plans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 lg:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <input
                        type="checkbox"
                        checked={selectedPlanIds.includes(plan.id)}
                        onChange={() => togglePlanSelection(plan.id)}
                        className="mt-1 h-4 w-4 text-[#005440] border-gray-300 rounded focus:ring-[#005440]"
                      />
                      <div className="flex-1 ml-3">
                        <h3 className="text-base lg:text-lg font-bold text-gray-900 truncate">{plan.name}</h3>
                        <p className="text-xs lg:text-sm text-gray-500 capitalize">{plan.interval || 'Lifetime'}</p>
                      </div>
                      <span className="shrink-0 px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-2xl lg:text-3xl font-bold text-gray-900">${plan.price}</span>
                      {plan.interval && <span className="text-gray-500 text-sm">/{plan.interval}</span>}
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex justify-between text-xs lg:text-sm">
                        <span className="text-gray-500">Subscribers</span>
                        <span className="font-semibold text-gray-900">{plan.subscriber_count}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 lg:px-6 py-3 flex justify-end gap-4">
                    <button 
                      onClick={() => handleDeleteClick(plan)}
                      className="text-xs lg:text-sm font-medium text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => handleEditPlan(plan)}
                      className="text-xs lg:text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => setSelectedPlan(plan)}
                      className="text-xs lg:text-sm font-medium text-[#005440] hover:text-[#004433]"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-gray-500">
                No plans found. Create your first plan to get started.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBSCRIPTIONS TAB */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          {loadingSubscriptions ? (
            <div className="flex justify-center py-12">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : subscriptions.length > 0 ? (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Period</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">{sub.customer_name || 'N/A'}</span>
                              <span className="text-xs text-gray-500">{sub.customer_email}</span>
                              <span className="text-xs text-gray-400 font-mono mt-0.5">{sub.stripe_subscription_id || '-'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {sub.plan.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(sub.status)}`}>
                              {sub.status}
                            </span>
                            {sub.is_trial && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Trial
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col text-sm text-gray-500">
                              <span>{new Date(sub.current_period_start).toLocaleDateString()} - {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'Lifetime'}</span>
                              {sub.cancel_at_period_end && (
                                <span className="text-xs text-red-600 mt-0.5">Cancels at end</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(sub.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => fetchSubscriptions(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchSubscriptions(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(currentPage * limit, totalSubscriptions)}</span> of{' '}
                      <span className="font-medium">{totalSubscriptions}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => fetchSubscriptions(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => fetchSubscriptions(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            page === currentPage
                              ? 'z-10 bg-[#005440] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005440]'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => fetchSubscriptions(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">No subscriptions found.</div>
          )}
        </div>
      )}

      {/* CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="space-y-3">
          {loadingCustomers ? (
            <div className="flex justify-center py-12">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : customers.length > 0 ? (
            customers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{customer.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{customer.email}</p>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(customer.subscription_status)}`}>
                    {customer.subscription_status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-mono truncate">{customer.stripe_customer_id}</p>
                  <p className="text-xs text-gray-400">
                    Joined: {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">No customers found.</div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreatePlanModal 
        isOpen={isCreatePlanOpen}
        onClose={() => setIsCreatePlanOpen(false)}
        onSubmit={handleCreatePlan}
      />

      <EditPlanModal
        isOpen={isEditPlanOpen}
        onClose={() => {
          setIsEditPlanOpen(false);
          setEditingPlan(null);
        }}
        onSubmit={handleUpdatePlan}
        plan={editingPlan}
      />

      <PlanDetailsModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPlanToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Plan"
        message={`Are you sure you want to delete ${planToDelete?.name}? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default Subscription;