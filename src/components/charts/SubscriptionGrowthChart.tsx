import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line
} from 'recharts';
import { 
  getSubscriptionChartData, 
  ChartDataPoint, 
  ChartSummary, 
  ChartPeriod 
} from '../../services/api_call';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <p className="text-sm font-bold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-500 capitalize">{entry.name.replace('_', ' ')}:</span>
            <span className="font-semibold text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const SubscriptionGrowthChart: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [summary, setSummary] = useState<ChartSummary | null>(null);
  const [period, setPeriod] = useState<ChartPeriod | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSubscriptionChartData();
      if (response.success) {
        setData(response.chart_data);
        setSummary(response.summary);
        setPeriod(response.period);
      } else {
        setError('Failed to load chart data');
      }
    } catch (err) {
      console.error('Error fetching subscription chart data:', err);
      setError('An error occurred while loading data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 animate-pulse">
        <div className="text-gray-400 text-sm">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
        <div className="text-red-500 text-sm mb-2">{error}</div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs"
        >
          <ArrowPathIcon className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
        <div className="text-gray-400 text-sm">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Growth Analytics</h3>
          <p className="text-sm text-gray-500">
            {period ? `New subscriptions vs cancellations (${new Date(period.start).toLocaleDateString()} - ${new Date(period.end).toLocaleDateString()})` : 'New subscriptions vs cancellations over time'}
          </p>
        </div>
        
        {summary && (
          <div className="flex flex-wrap gap-4">
            <div className="bg-green-50 px-3 py-2 rounded-lg">
              <p className="text-xs text-green-600 font-medium">New Subs</p>
              <p className="text-lg font-bold text-green-700">{summary.total_new_subscriptions}</p>
            </div>
            <div className="bg-red-50 px-3 py-2 rounded-lg">
              <p className="text-xs text-red-600 font-medium">Canceled</p>
              <p className="text-lg font-bold text-red-700">{summary.total_canceled}</p>
            </div>
            <div className="bg-blue-50 px-3 py-2 rounded-lg">
              <p className="text-xs text-blue-600 font-medium">Net Growth</p>
              <p className="text-lg font-bold text-blue-700">{summary.net_growth}</p>
            </div>
            <div className="bg-gray-50 px-3 py-2 rounded-lg">
              <p className="text-xs text-gray-600 font-medium">Rate</p>
              <p className="text-lg font-bold text-gray-700">{summary.churn_rate}%</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 0,
            }}
          >
            <defs>
              <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#005440" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#005440" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorCanceled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#374151' }}
            />
            
            <Bar 
              name="New Subscriptions"
              dataKey="new_subscriptions" 
              fill="url(#colorNew)" 
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar 
              name="Canceled"
              dataKey="canceled" 
              fill="url(#colorCanceled)" 
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Line
              name="Net Growth"
              type="monotone"
              dataKey="net_growth"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SubscriptionGrowthChart;
