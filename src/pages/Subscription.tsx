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
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
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

    fetchDashboardData();
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
    <div className="w-full min-w-0 space-y-4 lg:space-y-6 px-3 sm:px-4 lg:px-0">
      {/* Header & Tabs */}
      <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Subscription Management</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">Manage plans, subscriptions, and billing</p>
          </div>
          <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
            <button 
              onClick={handleSyncPlans}
              disabled={isSyncing}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-xs sm:text-sm"
            >
              <ArrowPathIcon className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
            <button 
              onClick={() => setIsCreatePlanOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#005440] text-white rounded-lg hover:bg-[#004433] transition-colors text-xs sm:text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* Tabs - Fully responsive with horizontal scroll */}
        <div className="w-full overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
          <div className="border-b border-gray-200 min-w-max">
            <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8" aria-label="Tabs">
              {[
                { id: 'dashboard', name: 'Overview', icon: CurrencyDollarIcon },
                { id: 'plans', name: 'Plans', icon: TicketIcon },
                { id: 'subscriptions', name: 'Subs', icon: UsersIcon },
                { id: 'customers', name: 'Customers', icon: UsersIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'dashboard' | 'plans' | 'subscriptions' | 'customers')}
                  className={`
                    group inline-flex items-center py-3 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors
                    ${activeTab === tab.id
                      ? 'border-[#005440] text-[#005440]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon className={`
                    -ml-0.5 mr-1.5 h-4 w-4 flex-shrink-0
                    ${activeTab === tab.id ? 'text-[#005440]' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Revenue */}
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
                  <CurrencyDollarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 truncate">Total Revenue</p>
                  <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 truncate">{dashboardData?.stats.total_revenue.value || '$0'}</p>
                  <p className={`text-xs ${dashboardData?.stats.total_revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'} truncate`}>
                    {dashboardData?.stats.total_revenue.change}
                  </p>
                </div>
              </div>
            </div>

            {/* MRR */}
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                  <CreditCardIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 truncate">MRR</p>
                  <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 truncate">{dashboardData?.stats.mrr.value || '$0'}</p>
                  <p className={`text-xs ${dashboardData?.stats.mrr.trend === 'up' ? 'text-green-600' : 'text-red-600'} truncate`}>
                    {dashboardData?.stats.mrr.change}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Subscriptions */}
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-purple-50 rounded-lg flex-shrink-0">
                  <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 truncate">Active Subs</p>
                  <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 truncate">{dashboardData?.stats.active_subs.value || '0'}</p>
                  <p className={`text-xs ${dashboardData?.stats.active_subs.trend === 'up' ? 'text-green-600' : 'text-red-600'} truncate`}>
                    {dashboardData?.stats.active_subs.change}
                  </p>
                </div>
              </div>
            </div>

            {/* Churn Rate */}
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                  <ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 truncate">Churn Rate</p>
                  <p className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 truncate">{dashboardData?.stats.churn_rate.value || '0%'}</p>
                  <p className={`text-xs ${dashboardData?.stats.churn_rate.is_positive ? 'text-green-600' : 'text-red-600'} truncate`}>
                    {dashboardData?.stats.churn_rate.change}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 min-w-0">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 truncate">Subscription Growth</h3>
            <div className="w-full overflow-hidden">
              <SubscriptionGrowthChart />
            </div>
          </div>
        </div>
      )}

      {/* PLANS TAB */}
      {activeTab === 'plans' && (
        <div className="space-y-3 sm:space-y-4">
          {/* Bulk Actions */}
          {selectedPlanIds.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-gray-600">
                {selectedPlanIds.length} plan(s) selected
              </span>
              <button
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-xs sm:text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 w-full sm:w-auto justify-center"
              >
                <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                Delete Selected
              </button>
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {loadingPlans ? (
              <div className="col-span-full flex justify-center py-12">
                <ArrowPathIcon className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-gray-400" />
              </div>
            ) : plans.length > 0 ? (
              plans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-0">
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPlanIds.includes(plan.id)}
                        onChange={() => togglePlanSelection(plan.id)}
                        className="mt-1 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#005440] border-gray-300 rounded focus:ring-[#005440] flex-shrink-0"
                      />
                      <div className="flex-1 ml-2 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">{plan.name}</h3>
                        <p className="text-xs text-gray-500 capitalize truncate">{plan.interval || 'Lifetime'}</p>
                      </div>
                      <span className="shrink-0 px-1.5 sm:px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2 sm:mb-3">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">${plan.price}</span>
                      {plan.interval && <span className="text-gray-500 text-xs">/{plan.interval}</span>}
                    </div>
                    <div className="border-t border-gray-100 pt-2 sm:pt-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-500">Subscribers</span>
                        <span className="font-semibold text-gray-900">{plan.subscriber_count}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 flex justify-end gap-2 sm:gap-3">
                    <button 
                      onClick={() => handleDeleteClick(plan)}
                      className="text-xs font-medium text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => handleEditPlan(plan)}
                      className="text-xs font-medium text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => setSelectedPlan(plan)}
                      className="text-xs font-medium text-[#005440] hover:text-[#004433]"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-gray-500 text-xs sm:text-sm">
                No plans found. Create your first plan to get started.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBSCRIPTIONS TAB */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-3 sm:space-y-4">
          {loadingSubscriptions ? (
            <div className="flex justify-center py-12">
              <ArrowPathIcon className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-gray-400" />
            </div>
          ) : subscriptions.length > 0 ? (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-3">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{sub.customer_name || 'N/A'}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{sub.customer_email}</p>
                      </div>
                      <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(sub.status)}`}>
                        {sub.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2 text-xs">
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-500 flex-shrink-0">Plan:</span>
                        <span className="font-medium text-gray-900 truncate text-right">{sub.plan.name}</span>
                      </div>
                      
                      {sub.is_trial && (
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-500 flex-shrink-0">Trial:</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Active
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-500 flex-shrink-0">Period:</span>
                        <span className="font-medium text-gray-900 text-right truncate">
                          {new Date(sub.current_period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Lifetime'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-500 flex-shrink-0">Created:</span>
                        <span className="font-medium text-gray-900 truncate">{new Date(sub.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      {sub.cancel_at_period_end && (
                        <div className="pt-1.5 sm:pt-2 border-t border-gray-100">
                          <span className="text-xs text-red-600 font-medium">⚠️ Cancels at period end</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 truncate max-w-xs">{sub.customer_name || 'N/A'}</span>
                              <span className="text-xs text-gray-500 truncate max-w-xs">{sub.customer_email}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {sub.plan.name}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1.5">
                              <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(sub.status)} w-fit`}>
                                {sub.status}
                              </span>
                              {sub.is_trial && (
                                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 w-fit">
                                  Trial
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col text-sm text-gray-500">
                              <span className="whitespace-nowrap">{new Date(sub.current_period_start).toLocaleDateString()} - {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'Lifetime'}</span>
                              {sub.cancel_at_period_end && (
                                <span className="text-xs text-red-600 mt-0.5">Cancels at end</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(sub.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination - Fully Responsive */}
              {totalPages > 1 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
                  {/* Mobile Pagination */}
                  <div className="flex sm:hidden items-center justify-between gap-2">
                    <button
                      onClick={() => fetchSubscriptions(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      <span>Prev</span>
                    </button>
                    <span className="text-xs text-gray-700 whitespace-nowrap px-2">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => fetchSubscriptions(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Next</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Desktop Pagination */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(currentPage * limit, totalSubscriptions)}</span> of{' '}
                        <span className="font-medium">{totalSubscriptions}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => fetchSubscriptions(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-lg px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        
                        {/* Page Numbers */}
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => fetchSubscriptions(pageNum)}
                              className={`relative inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold ${
                                pageNum === currentPage
                                  ? 'z-10 bg-[#005440] text-white'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => fetchSubscriptions(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-lg px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRightIcon className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-gray-500 text-xs sm:text-sm">No subscriptions found.</div>
          )}
        </div>
      )}

      {/* CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="space-y-3">
          {loadingCustomers ? (
            <div className="flex justify-center py-12">
              <ArrowPathIcon className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-gray-400" />
            </div>
          ) : customers.length > 0 ? (
            customers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{customer.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{customer.email}</p>
                  </div>
                  <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(customer.subscription_status)}`}>
                    {customer.subscription_status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs gap-2">
                  <p className="text-gray-500 font-mono truncate flex-1 min-w-0">{customer.stripe_customer_id}</p>
                  <p className="text-gray-400 whitespace-nowrap flex-shrink-0">
                    {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 text-xs sm:text-sm">No customers found.</div>
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