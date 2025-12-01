import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { UsersIcon, DocumentTextIcon, NewspaperIcon } from '@heroicons/react/24/solid';
import { getDashboardOverview, DashboardOverviewResponse, ProfileResponse } from '../services/api_call';

interface DashboardContext {
  profile: ProfileResponse['data'] | null;
  fetchProfile: () => Promise<void>;
}

function Dashboard() {
  const { profile } = useOutletContext<DashboardContext>();
  const [data, setData] = useState<DashboardOverviewResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardOverview();
        setData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const stats = [
    {
      id: 1,
      title: 'Total Users',
      value: data?.stats.total_users.toString() || '0',
      icon: UsersIcon,
      cardBg: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
      iconBg: '#005440',
    },
    {
      id: 2,
      title: 'Total Subscribers',
      value: data?.stats.total_subscribers.toString() || '0',
      icon: NewspaperIcon,
      cardBg: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
      iconBg: '#005440',
    },
    {
      id: 3,
      title: 'New User',
      value: data?.stats.new_users.toString() || '0',
      icon: DocumentTextIcon,
      cardBg: 'linear-gradient(135deg, #CFFAFE 0%, #A5F3FC 100%)',
      iconBg: '#005440',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 w-full">
      {/* Greeting Card */}
      <div className="bg-white rounded-xl md:rounded-2xl px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 shadow-sm">
        <p
          className="text-gray-700"
          style={{
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0px',
          }}
        >
          {data?.greeting}
        </p>
        <h1
          className="text-gray-900"
          style={{
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '28px',
            letterSpacing: '0px',
          }}
        >
          {profile?.name || data?.admin_name}
        </h1>
      </div>

      {/* User's Overview Section */}
      <div className="bg-white rounded-xl md:rounded-2xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 shadow-sm">
        <h2
          className="text-gray-900 mb-4 sm:mb-5 md:mb-6"
          style={{
            fontWeight: 700,
            fontSize: '18px',
            letterSpacing: '0px',
          }}
        >
          User's Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                style={{
                  background: stat.cardBg,
                  minHeight: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="mb-auto">
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: stat.iconBg }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>

                <div className="mt-4 sm:mt-6">
                  <p
                    className="text-gray-900 mb-1"
                    style={{
                      fontWeight: 700,
                      fontSize: 'clamp(28px, 5vw, 36px)',
                      lineHeight: '1',
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-gray-800"
                    style={{
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    {stat.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
