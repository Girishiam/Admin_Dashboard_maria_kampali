import React, { useState } from 'react';
import { 
  CurrencyDollarIcon, 
  UsersIcon, 
  TicketIcon, 
  CreditCardIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import CreatePlanModal from '../components/modals/CreatePlanModal';
import EditPlanModal from '../components/modals/EditPlanModal';
import PlanDetailsModal from '../components/modals/PlanDetailsModal';
import ManageCustomerModal from '../components/modals/ManageCustomerModal';

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  interval: string;
  active_subscribers: number;
  is_active: boolean;
}

interface Subscription {
  id: string;
  customer_email: string;
  plan_name: string;
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'lifetime';
  amount: number;
  next_billing: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  stripe_id: string;
  total_spent: number;
  status: 'active' | 'inactive';
}

function Subscription() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'plans' | 'subscriptions' | 'customers'>('dashboard');
  
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const plans: SubscriptionPlan[] = [
    { id: '1', name: 'Basic Plan', slug: 'basic', price: 29, currency: 'USD', interval: 'month', active_subscribers: 145, is_active: true },
    { id: '2', name: 'Pro Plan', slug: 'pro', price: 79, currency: 'USD', interval: 'month', active_subscribers: 89, is_active: true },
    { id: '3', name: 'Enterprise', slug: 'enterprise', price: 299, currency: 'USD', interval: 'year', active_subscribers: 12, is_active: true },
  ];

  const subscriptions: Subscription[] = [
    { id: 'sub_1', customer_email: 'john@example.com', plan_name: 'Pro Plan', status: 'active', amount: 79, next_billing: '2024-12-25' },
    { id: 'sub_2', customer_email: 'sarah@design.co', plan_name: 'Basic Plan', status: 'trialing', amount: 29, next_billing: '2024-12-15' },
    { id: 'sub_3', customer_email: 'mike@tech.io', plan_name: 'Enterprise', status: 'active', amount: 299, next_billing: '2025-01-01' },
    { id: 'sub_4', customer_email: 'lisa@blog.net', plan_name: 'Basic Plan', status: 'canceled', amount: 29, next_billing: '-' },
  ];

  const customers: Customer[] = [
    { id: 'cus_1', name: 'John Doe', email: 'john@example.com', stripe_id: 'cus_Kj9...', total_spent: 450, status: 'active' },
    { id: 'cus_2', name: 'Sarah Smith', email: 'sarah@design.co', stripe_id: 'cus_Lm2...', total_spent: 0, status: 'active' },
  ];

  const handleCreatePlan = (data: any) => {
    console.log('Creating plan:', data);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsEditPlanOpen(true);
  };

  const handleUpdatePlan = (data: any) => {
    console.log('Updating plan:', data);
    // Here you would typically update the state or make an API call
    setIsEditPlanOpen(false);
    setEditingPlan(null);
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
        <div className="flex flex-col gap-3 mb-4 lg:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Subscription Management</h1>
              <p className="text-gray-500 text-xs lg:text-sm mt-1">Manage plans, subscriptions, and billing</p>
            </div>
            <button 
              onClick={() => setIsCreatePlanOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#005440] text-white rounded-lg hover:bg-[#004433] transition-colors font-medium text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Create Plan
            </button>
          </div>
        </div>

        {/* Tab Buttons - Grid on mobile, no horizontal scroll */}
        <div className="grid grid-cols-4 gap-1 border-b border-gray-100">
          {[
            { id: 'dashboard', label: 'Overview', mobileLabel: 'Overview', icon: CurrencyDollarIcon },
            { id: 'plans', label: 'Plans', mobileLabel: 'Plans', icon: TicketIcon },
            { id: 'subscriptions', label: 'Subscriptions', mobileLabel: 'Subs', icon: CreditCardIcon },
            { id: 'customers', label: 'Customers', mobileLabel: 'Users', icon: UsersIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id 
                  ? 'border-[#005440] text-[#005440]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'}
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span className="sm:hidden text-center">{tab.mobileLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-4 lg:space-y-6">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {[
              { label: 'Total Revenue', value: '$12,450', change: '+12%', color: 'bg-green-50 text-green-700' },
              { label: 'Active Subs', value: '246', change: '+5%', color: 'bg-blue-50 text-blue-700' },
              { label: 'Churn Rate', value: '2.4%', change: '-0.5%', color: 'bg-purple-50 text-purple-700' },
              { label: 'MRR', value: '$4,200', change: '+8%', color: 'bg-orange-50 text-orange-700' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs lg:text-sm text-gray-500 font-medium">{stat.label}</p>
                <div className="mt-2">
                  <h3 className="text-lg lg:text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${stat.color}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PLANS TAB */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 lg:p-6">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base lg:text-lg font-bold text-gray-900 truncate">{plan.name}</h3>
                      <p className="text-xs lg:text-sm text-gray-500 capitalize">{plan.interval}ly</p>
                    </div>
                    <span className={`shrink-0 px-2 py-1 text-xs font-bold rounded-full ${plan.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl lg:text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 text-sm">/{plan.interval}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between text-xs lg:text-sm">
                      <span className="text-gray-500">Subscribers</span>
                      <span className="font-semibold text-gray-900">{plan.active_subscribers}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 lg:px-6 py-3 flex justify-end gap-4">
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
            ))}
          </div>
        )}

        {/* SUBSCRIPTIONS TAB */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-3">
            {/* Subscription Cards */}
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{sub.customer_email}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
                          {sub.plan_name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(sub.status)}`}>
                          {sub.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900 shrink-0">${sub.amount}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Next: <span className="font-medium text-gray-700">{sub.next_billing}</span>
                    </p>
                    <button 
                      onClick={() => setSelectedSubscription(sub)}
                      className="text-sm font-medium text-[#005440] hover:text-[#003322]"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-3">
            {customers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{customer.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{customer.email}</p>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {customer.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-mono truncate">{customer.stripe_id}</p>
                  <p className="text-sm font-bold text-gray-900 shrink-0">${customer.total_spent}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modals */}
      <CreatePlanModal 
        isOpen={isCreatePlanOpen} 
        onClose={() => setIsCreatePlanOpen(false)} 
        onSubmit={handleCreatePlan}
      />
      
      <EditPlanModal 
        isOpen={isEditPlanOpen} 
        onClose={() => setIsEditPlanOpen(false)} 
        onSubmit={handleUpdatePlan}
        plan={editingPlan}
      />

      <PlanDetailsModal 
        isOpen={!!selectedPlan} 
        onClose={() => setSelectedPlan(null)} 
        plan={selectedPlan}
      />

      <ManageCustomerModal 
        isOpen={!!selectedSubscription} 
        onClose={() => setSelectedSubscription(null)} 
        subscription={selectedSubscription}
      />

    </div>
  );
}

export default Subscription;