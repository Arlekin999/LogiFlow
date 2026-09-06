import React from 'react';
import { Bell, Truck, MapPin, Clock, X } from 'lucide-react';

interface NotificationsProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  notifications: any[];
  setActiveTab: (tab: string) => void;
  setSelectedOrder: (order: any) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({
  isOpen,
  setIsOpen,
  notifications,
  setActiveTab,
  setSelectedOrder
}) => {
  if (!isOpen) return null;

  const handleNotificationClick = (notification: any) => {
    setActiveTab('routes');
    setSelectedOrder(notification.order);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>
      <div className="relative w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-[80vh] overflow-hidden animate-slide-in">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Уведомления</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg.0 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-64px)] p-3 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <p className="text-sm">Нет уведомлений</p>
            </div>
          ) : (
            notifications.map((notification, idx) => (
              <div
                key={idx}
                onClick={() => handleNotificationClick(notification)}
                className={`border rounded-xl p-3 cursor-pointer transition-all ${
                  notification.isRead
                    ? 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'
                    : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900'
                } hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    notification.type === 'delay' ? 'bg-red-100 dark:bg-red-900' :
                    notification.type === 'delivery' ? 'bg-green-100 dark:bg-green-900' :
                    'bg-blue-100 dark:bg-blue-900'
                  }`}>
                    {notification.type === 'delay' ? <Clock className="w-4 h-4 text-red-600 dark:text-red-400" /> :
                     notification.type === 'delivery' ? <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" /> :
                     <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{notification.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};