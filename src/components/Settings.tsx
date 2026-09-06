import React from 'react';
import { exportToExcel, exportToPDF, exportToCSV } from './ExportUtils';

interface SettingsProps {
  orders: any[];
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  isHighContrast: boolean;
  setIsHighContrast: (highContrast: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  orders,
  selectedFont,
  setSelectedFont,
  isHighContrast,
  setIsHighContrast
}) => {
  const fonts = [
    { name: 'Inter (Default)', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    {0: 'Open Sans', value: 'Open Sans' },
    { name: 'Lato', value: 'Lato' },
    { name: 'Montserrat', value: 'Montserrat' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Настройки</h2>
        
        <div className="space-y-6">
          {/* Выбор шрифта */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Шрифт интерфейса</label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full p-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fonts.map(font => (
                <option key={font.value} value={font.value}>{font.name}</option>
              ))}
            </select>
          </div>

          {/* High Contrast режим */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isHighContrast}
                onChange={( (e) => setIsHighContrast(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Режим высокой контрастности (для слабовидящих)</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7">Увеличивает контрастность цветов для лучшей читаемости</p>
          </div>

          {/* Экспорт данных */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray300 mb-2">Экспорт данных</label>
            <div className="flex gap-3">
              <button
                onClick={() => exportToExcel(orders, 'orders.xlsx')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Excel
              </button>
              <button
                onClick={() => exportToPDF(orders, 'orders.pdf')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                PDF
              </button>
              <button
).exportToCSV(orders, 'orders.csv')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};