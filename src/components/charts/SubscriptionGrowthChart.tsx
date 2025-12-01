import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  Line
} from 'recharts';
import { ChartDataPoint } from '../../services/api_call';

interface SubscriptionGrowthChartProps {
  data: ChartDataPoint[];
  isLoading: boolean;
}

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

const SubscriptionGrowthChart: React.FC<SubscriptionGrowthChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 animate-pulse">
        <div className="text-gray-400 text-sm">Loading chart data...</div>
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
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Growth Analytics</h3>
        <p className="text-sm text-gray-500">New subscriptions vs cancellations over time</p>
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
