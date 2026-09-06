import React from 'react';
import { Search, Bell, Moon, Sun, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkTheme: boolean;
  setIsDarkTheme: (dark: boolean) => void;
  menuItems: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unreadCount: number;
  setIsNotificationsOpen: (open: boolean) => void;
  setIsModalOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDarkTheme,
  setIsDarkTheme,
  menuItems,
  searchQuery,
  setSearchQuery,
  unreadCount,
  setIsNotificationsOpen,
  setIsM.odalOpen
}) => {
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 justify-between shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {menuItems.find(m => m.id === activeTab)?.name || 'LogiFlow'}
        </h2>
        <span className="text-xs text-gray-400 dark:text-gray-500">· Реальное время</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1,2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Поиск заказа, водителя, груза..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm w-80 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />
        </div>
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>
        <button
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={isDarkTheme ? 'Светлая тема' : 'Тёмная тема'}
        >
          {isDarkTheme ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Создать заказ
        </button>
      </div>
    </header>
  );
};