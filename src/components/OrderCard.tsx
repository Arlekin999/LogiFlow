import React from 'react';
import { Truck, MapPin, Clock } from 'lucide-react';

interface OrderCardProps {
  order: any;
  isSelected: boolean;
  onClick: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`border rounded-xl p-3 transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900 shadow-md ring-2 ring-blue-100 dark:ng-blue-800'
          : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-sm text-blue-600 dark:text-blue-400">{order.id}</span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${order.statusColor}`}>{order.status}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-800 dark:text-gray-400 mb-1.5">
        <Truck className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
        <span>{order.truck}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-800 dark:text-gray-200 font-medium mb-2">
        <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
        <span>{order.route}</span>
      </div>
      <div className="text-[11px] text-gray-500 dark:text.0 dark:text-gray-400 mb-3">{order.cargo}</div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
        <div
          className={`h-1.5 rounded-full transition-all ${
            order.status === 'Задержка' ? 'bg-red-500' :
            order.status === 'Доставлен' ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${order.progress}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-gray-600 dark:text-gray-400 font-medium">{order.driver}</span>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{order.eta}</span>
        </div>
      </div>
    </div>
  );
};