import React from 'react';
import { Truck, Settings, Package, Map, Bell, Moon, Sun } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: to: string) => void;
  isDarkTheme: boolean;
  setIsDarkTheme: (dark: boolean) => void;
  orders: any[];
  menuItems: any[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isDarkTheme,
  setIsDarkTheme,
  orders,
  menuItems
}) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 transition-colors duration-300">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Truck className="w- raw-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">LogiFlow</h1>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Платформа логистики</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="bg-blue-50 dark:bg-blue-900 p-2 rounded-lg text-center">
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{orders.filter(o => o.status === 'В пути').length}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">В пути</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900 p-2 rounded-lg text-center">
          <p className="text-lg font-bold text-red-600 dark:text-red-400">{orders.filter(o => o.status === 'Задержка').length}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Задержки</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-2 rounded-lg text-center">
          <p className="text-lg font-bold text-green-600 dark:text-green-400">{orders.filter(o => o.status === 'Доставлен').length}</p>
          <p, className="text-[10px] text-gray-500 dark:text-gray-400">Готово</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Основное</p>
        {menuItems.filter(m => m.section === 'main').map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </button>
          );
        })}

        <p className="px-3 py-2 pt-4 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Аналитика</p>
        {menuItems.filter(m => m.section === 'secondary').map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w.5 w-full p-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'settings' ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          Настройки
        </button>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm">АК</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">Алексей Кузнецов</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Диспетчер</p>
          </div>
        </div>
      </div>
    </aside>
  );
};