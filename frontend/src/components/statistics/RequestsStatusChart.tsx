import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Statistics } from '../../types';

interface RequestsStatusChartProps {
  stats: Statistics;
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];

const RequestsStatusChart: React.FC<RequestsStatusChartProps> = ({ stats }) => {
  const data = [
    { name: 'Новые', value: stats.newRequests },
    { name: 'Назначены', value: stats.assignedRequests },
    { name: 'В работе', value: stats.inProgressRequests },
    { name: 'Завершены', value: stats.completedRequests },
    { name: 'Отменены', value: stats.cancelledRequests },
  ].filter(item => item.value > 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Статусы заявок</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RequestsStatusChart;
