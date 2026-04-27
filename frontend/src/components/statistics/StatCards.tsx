import React from 'react';
import type { Statistics } from '../../types';
import { Banknote, ClipboardList, Users } from 'lucide-react';

interface StatCardsProps {
  stats: Statistics;
}

const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Общая выручка',
      value: `${stats.totalRevenue.toLocaleString()} ₽`,
      icon: Banknote,
      color: 'bg-emerald-50 text-emerald-600',
      description: 'Доход от завершенных заявок',
    },
    {
      title: 'Активные заявки',
      value: (stats.assignedRequests + stats.inProgressRequests).toString(),
      icon: ClipboardList,
      color: 'bg-blue-50 text-blue-600',
      description: 'В работе или назначены',
    },
    {
      title: 'Доступные мастера',
      value: stats.availableMasters.toString(),
      icon: Users,
      color: 'bg-amber-50 text-amber-600',
      description: 'Готовы принять заказ',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">{card.title}</h3>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <p className="text-xs text-gray-400 mt-2">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
