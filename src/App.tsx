import { useState, useEffect } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { 
  Truck, Package, Settings, Search, Bell, Plus, Clock, MapPin, 
  X, CheckCircle2, AlertCircle, FileText, BarChart3, Route, 
  Moon, Sun, Download, Eye, TrendingUp, Activity, Filter, DollarSign
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// --- ДАННЫЕ ---
const initialOrders = [
  { id: 'ЗК-00412', status: 'В пути', statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', truck: 'МАЗ-6430 · А567ВВ78', route: 'Москва → Казань', cargo: 'Стройматериалы · 12 т', progress: 38, driver: 'Иванов С.В.', eta: '22:00', coords: [55.75, 37.57], distance: '820 км', fuel: '145 л', cost: '45 000 ₽' },
  { id: 'ЗК-00411', status: 'Доставлен', statusColor: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', truck: 'КАМАЗ-65116 · В234ГД77', route: 'Самара → Уфа', cargo: 'Продукты питания · 8 т', progress: 100, driver: 'Петров А.Н.', eta: 'Доставлен', coords: [53.20, 50.15], distance: '465 км', fuel: '82 л', cost: '28 000 ₽' },
  { id: 'ЗК-00410', status: 'Ожидает', statusColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300', truck: 'Volvo FH · Е789ЖЗ350', route: 'Санкт-Петербург → Вел. Новгород', cargo: 'Электроника · 3,5 т', progress: 0, driver: 'Сидоров Д.К.', eta: '—', coords: [59.93, 30.33], distance: '185 км', fuel: '35 л', cost: '15 000 ₽' },
  { id: 'ЗК-00408', status: 'Задержка', statusColor: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', truck: 'Scania R450 · Н456ОП31', route: 'Ростов-на-Дону → Краснодар', cargo: 'Оборудование · 15 т', progress: 65, driver: 'Козлов Р.П.', eta: '18:30', coords: [47.23, 39.70], distance: '270 км', fuel: '58 л', cost: '32 000 ₽' },
  { id: 'ЗК-00409', status: 'В пути', statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', truck: 'MAN TGX · К321ЛМ96', route: 'Пермь → Екатеринбург', cargo: 'Химическое сырьё · 18 т', progress: 62, driver: 'Козлов Р.П.', eta: '18:30', coords: [58.01, 56.25], distance: '520 км', fuel: '98 л', cost: '38 000 ₽' }
];

const initialVehicles = [
  { id: 1, model: 'МАЗ-6430', plate: 'А567ВВ78', driver: 'Иванов С.В.', mileage: '45 230 км', fuel: '145 л', status: 'В пути' },
  { id: 2, model: 'КАМАЗ-65116', plate: 'В234ГД77', driver: 'Петров А.Н.', mileage: '38 150 км', fuel: '82 л', status: 'Доставлен' },
  { id: 3, model: 'Volvo FH', plate: 'Е789ЖЗ350', driver: 'Сидоров Д.К.', mileage: '52 890 км', fuel: '35 л', status: 'Ожидает' }
];

const mockNotifications = [
  { id: 1, type: 'delay', title: 'Задержка доставки', message: 'Водитель Козлов Р.П. (Scania R450) задерживается на 45 минут. Причина: пробка на М-4.', time: '5 мин назад', read: false, orderId: 'ЗК-00408' },
  { id: 2, type: 'success', title: 'Доставка завершена', message: 'Петров А.Н. успешно доставил груз в Уфу. Документы подписаны.', time: '15 мин назад', read: false, orderId: 'ЗК-00411' },
  { id: 3, type: 'info', title: 'Новый заказ создан', message: 'Диспетчер создал заказ ЗК-00413. Требуется назначение водителя.', time: '32 мин назад', read: true, orderId: null },
  { id: 4, type: 'warning', title: 'Низкий уровень топлива', message: 'МАЗ-6430 (А567ВВ78): осталось 15% топлива. Ближайшая заправка в 50 км.', time: '1 час назад', read: true, orderId: 'ЗК-00412' }
];

// --- ЭКСПОРТ ---
const exportToExcel = (data: any[]) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Заказы');
  XLSX.writeFile(wb, 'LogiFlow_Orders.xlsx');
};

const exportToPDF = (data: any[]) => {
  const doc = new jsPDF();
  doc.text('LogiFlow - Отчёт по заказам', 14, 15);
  doc.setFontSize(10);
  doc.text(`Дата: ${new Date().toLocaleDateString()}`, 14, 22);
  (doc as any).autoTable({
    head: [['ID', 'Маршрут', 'Водитель', 'Статус', 'Расстояние', 'Стоимость']],
    body: data.map((o: any) => [o.id, o.route, o.driver, o.status, o.distance, o.cost]),
    startY: 28,
  });
  doc.save('LogiFlow_Orders.pdf');
};

const downloadOrderPDF = (order: any) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`ТТН-${order.id}`, 14, 20);
  doc.setFontSize(11);
  doc.text(`Маршрут: ${order.route}`, 14, 35);
  doc.text(`Водитель: ${order.driver}`, 14, 45);
  doc.text(`Груз: ${order.cargo}`, 14, 55);
  doc.text(`Расстояние: ${order.distance}`, 14, 65);
  doc.text(`Статус: ${order.status}`, 14, 75);
  doc.text(`ETA: ${order.eta}`, 14, 85);
  doc.save(`TTN-${order.id}.pdf`);
};

// --- ГЛАВНЫЙ КОМПОНЕНТ ---
export default function App() {
  const [orders, setOrders] = useState(initialOrders);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [activeTab, setActiveTab] = useState('routes');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [cargoFilter, setCargoFilter] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedOrder, setSelectedOrder] = useState(orders[0]);
  const [mapState, setMapState] = useState({ center: orders[0].coords, zoom: 5 });
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocTab, setActiveDocTab] = useState('all');
  const [statsPeriod, setStatsPeriod] = useState('month');
  const [newOrder, setNewOrder] = useState({ truck: '', route: '', cargo: '', driver: '', eta: '' });
  const [newVehicle, setNewVehicle] = useState({ model: '', plate: '', driver: '' });

  // Применение темы
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkTheme);
    document.documentElement.classList.toggle('high-contrast', isHighContrast);
  }, [isDarkTheme, isHighContrast]);

  // Применение шрифта
  useEffect(() => {
    const fonts: Record<string, string> = {
      'Inter': 'Inter, system-ui, sans-serif',
      'Roboto': 'Roboto, sans-serif',
      'Open Sans': 'Open Sans, sans-serif',
      'Montserrat': 'Montserrat, sans-serif',
      'Arial': 'Arial, sans-serif'
    };
    document.body.style.fontFamily = fonts[selectedFont] || fonts['Inter'];
  }, [selectedFont]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif: any) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.orderId) {
      const order = orders.find(o => o.id === notif.orderId);
      if (order) {
        setActiveTab('routes');
        setSelectedOrder(order);
        setMapState({ center: order.coords, zoom: 12 });
      }
    }
    setIsNotificationsOpen(false);
  };

  const handleFilterClick = (filterStatus: string | null) => {
    setActiveFilter(filterStatus);
  };

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setMapState({ center: order.coords, zoom: 12 });
  };

  const handleCreateOrder = () => {
    if (!newOrder.truck || !newOrder.route || !newOrder.driver) {
      alert('Заполните обязательные поля (Транспорт, Маршрут, Водитель)!');
      return;
    }
    const orderId = `ЗК-00${String(orders.length + 1).padStart(3, '0')}`;
    const newOrderData = {
      id: orderId,
      status: 'Ожидает',
      statusColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      truck: newOrder.truck,
      route: newOrder.route,
      cargo: newOrder.cargo || 'Не указан',
      progress: 0,
      driver: newOrder.driver,
      eta: newOrder.eta || '—',
      coords: [55.75, 37.57],
      distance: '0 км',
      fuel: '0 л',
      cost: '0 ₽'
    };
    setOrders([newOrderData, ...orders]);
    setNewOrder({ truck: '', route: '', cargo: '', driver: '', eta: '' });
    setIsCreateModalOpen(false);
    alert(`Заказ ${orderId} успешно создан!`);
  };

  const handleAddVehicle = () => {
    if (!newVehicle.model || !newVehicle.plate || !newVehicle.driver) {
      alert('Заполните все обязательные поля!');
      return;
    }
    const newVehicleData = {
      id: vehicles.length + 1,
      model: newVehicle.model,
      plate: newVehicle.plate,
      driver: newVehicle.driver,
      mileage: '0 км',
      fuel: '0 л',
      status: 'На обслуживании'
    };
    setVehicles([...vehicles, newVehicleData]);
    setNewVehicle({ model: '', plate: '', driver: '' });
    setIsVehicleModalOpen(false);
    alert(`Транспортное средство ${newVehicle.model} добавлено!`);
  };

  const getCargoType = (cargo: string) => {
    if (cargo.includes('Стройматериалы')) return 'Стройматериалы';
    if (cargo.includes('Продукты')) return 'Продукты';
    if (cargo.includes('Электроника')) return 'Электроника';
    if (cargo.includes('Оборудование')) return 'Оборудование';
    if (cargo.includes('Химическое')) return 'Химическое сырьё';
    return 'Другое';
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === null || order.status === activeFilter;
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.driver.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredCargo = orders.filter(order => {
    if (!cargoFilter) return true;
    return getCargoType(order.cargo) === cargoFilter;
  });

  const filteredDocuments = orders.filter(order => {
    if (activeDocTab === 'all') return true;
    if (activeDocTab === 'ttn') return true;
    if (activeDocTab === 'contracts') return order.status === 'Доставлен';
    if (activeDocTab === 'acts') return order.progress === 100;
    return true;
  });

  const cargoTypes = ['Все', ...Array.from(new Set(orders.map(o => getCargoType(o.cargo))))];

  const menuItems = [
    { id: 'routes', name: 'Маршруты', icon: Route, section: 'main' },
    { id: 'orders', name: 'Заказы', icon: Clock, section: 'main' },
    { id: 'fleet', name: 'Автопарк', icon: Truck, section: 'main' },
    { id: 'cargo', name: 'Грузы', icon: Package, section: 'main' },
    { id: 'documents', name: 'Документы', icon: FileText, section: 'secondary' },
    { id: 'stats', name: 'Статистика', icon: BarChart3, section: 'secondary' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'routes':
        return (
          <div className="flex-1 flex relative animate-fade-in">
            <div className="flex-1 relative bg-gray-100 dark:bg-[var(--bg-primary)] transition-colors duration-300">
              <div className="absolute top-4 left-4 z-10 bg-white dark:bg-[var(--bg-secondary)] rounded-xl shadow-lg p-4 border dark:border-[var(--border-color)] animate-slide-in-left">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" /> Сегодня в работе
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-[var(--text-secondary)]">В пути: <strong className="text-gray-900 dark:text-white">{orders.filter(o => o.status === 'В пути').length}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-[var(--text-secondary)]">Доставлено: <strong className="text-gray-900 dark:text-white">{orders.filter(o => o.status === 'Доставлен').length}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-[var(--text-secondary)]">Задержки: <strong className="text-gray-900 dark:text-white">{orders.filter(o => o.status === 'Задержка').length}</strong></span>
                  </div>
                </div>
              </div>

              <YMaps>
                <Map state={mapState} width="100%" height="100%" modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}>
                  {filteredOrders.map(order => (
                    <Placemark 
                      key={order.id} 
                      geometry={order.coords} 
                      properties={{
                        balloonContent: `<div style="font-family: sans-serif; padding: 5px; min-width: 220px;">
                          <strong style="font-size: 14px; color: #2563eb;">${order.id}</strong>
                          <div style="margin-top: 8px; color: #666; font-size: 12px;">${order.truck}</div>
                          <div style="margin-top: 4px; font-size: 13px; font-weight: 500;">${order.route}</div>
                          <div style="margin-top: 4px; font-size: 11px; color: #999;">${order.cargo}</div>
                          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 11px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                              <span> ${order.distance}</span><span> ${order.fuel}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                              <span> ${order.driver}</span><span>🕐 ${order.eta}</span>
                            </div>
                          </div>
                        </div>`,
                        hintContent: `${order.id} — ${order.status}`,
                      }}
                      options={{ 
                        preset: order.status === 'Задержка' ? 'islands#redIcon' : 
                                order.status === 'Доставлен' ? 'islands#greenIcon' : 
                                order.status === 'Ожидает' ? 'islands#orangeIcon' : 'islands#blueIcon'
                      }}
                    />
                  ))}
                </Map>
              </YMaps>
            </div>

            <aside className="w-80 bg-white dark:bg-[var(--bg-secondary)] border-l dark:border-[var(--border-color)] flex flex-col shrink-0 transition-colors duration-300">
              <div className="p-4 border-b dark:border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Активные заказы</h2>
                  <span className="bg-gray-100 dark:bg-[var(--bg-tertiary)] text-gray-600 dark:text-[var(--text-secondary)] text-xs font-bold px-2 py-0.5 rounded-full">{orders.length}</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {[
                    { name: 'Все', status: null },
                    { name: 'В пути', status: 'В пути' },
                    { name: 'Доставлен', status: 'Доставлен' },
                    { name: 'Ожидает', status: 'Ожидает' },
                    { name: 'Задержка', status: 'Задержка' }
                  ].map(filter => (
                    <button
                      key={filter.name}
                      onClick={() => handleFilterClick(filter.status)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                        activeFilter === filter.status 
                          ? 'bg-gray-800 dark:bg-gray-700 text-white' 
                          : 'bg-gray-100 dark:bg-[var(--bg-tertiary)] text-gray-600 dark:text-[var(--text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 dark:text-[var(--text-secondary)]"><p className="text-sm">Заказы не найдены</p></div>
                ) : (
                  filteredOrders.map(order => (
                    <div 
                      key={order.id} 
                      onClick={() => handleOrderClick(order)}
                      className={`border rounded-xl p-3 transition-all cursor-pointer animate-fade-in-up ${
                        selectedOrder.id === order.id 
                          ? 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-md ring-2 ring-blue-100 dark:ring-blue-800' 
                          : 'border-gray-100 dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-secondary)] hover:shadow-md'
                      }`}
                      style={{ opacity: 0, animationDelay: `${orders.indexOf(order) * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-blue-600 dark:text-blue-400">{order.id}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${order.statusColor}`}>{order.status}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-[var(--text-secondary)] mb-1.5">
                        <Truck className="w-3.5 h-3.5 text-gray-400" />
                        <span>{order.truck}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-800 dark:text-white font-medium mb-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{order.route}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-[var(--text-secondary)] mb-3">{order.cargo}</div>
                      <div className="w-full bg-gray-200 dark:bg-[var(--bg-tertiary)] rounded-full h-1.5 mb-3">
                        <div className={`h-1.5 rounded-full transition-all ${order.status === 'Задержка' ? 'bg-red-500' : order.status === 'Доставлен' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${order.progress}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-600 dark:text-[var(--text-secondary)] font-medium">{order.driver}</span>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-[var(--text-secondary)]">
                          <Clock className="w-3 h-3" />
                          <span>{order.eta}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 border-t dark:border-[var(--border-color)] text-center text-xs text-gray-500 dark:text-[var(--text-secondary)]">
                Показано: {filteredOrders.length} из {orders.length} заказов
              </div>
            </aside>
          </div>
        );

      case 'orders':
        return (
          <div className="flex-1 bg-gray-50 dark:bg-[var(--bg-primary)] p-6 overflow-y-auto transition-colors duration-300 animate-fade-in">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white animate-fade-in-down">Все заказы</h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[var(--bg-secondary)] border dark:border-[var(--border-color)] rounded-lg text-sm font-medium text-gray-700 dark:text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] transition-colors">
                    <Filter className="w-4 h-4" /> Фильтры
                  </button>
                  <button onClick={() => exportToExcel(orders)} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[var(--bg-secondary)] border dark:border-[var(--border-color)] rounded-lg text-sm font-medium text-gray-700 dark:text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] transition-colors">
                    <Download className="w-4 h-4" /> Экспорт
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Всего', value: orders.length, sub: 'заказов', icon: Clock, color: 'blue' },
                  { label: 'Активных', value: orders.filter(o => o.status === 'В пути').length, sub: 'в работе', icon: Truck, color: 'blue' },
                  { label: 'Доставлено', value: orders.filter(o => o.status === 'Доставлен').length, sub: 'успешно', icon: CheckCircle2, color: 'green' },
                  { label: 'Выручка', value: '120к ₽', sub: 'за месяц', icon: DollarSign, color: 'amber' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl p-4 border dark:border-[var(--border-color)] animate-zoom-in transition-colors duration-300" style={{ opacity: 0, animationDelay: `${(idx + 1) * 0.05}s` }}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-[var(--text-secondary)]">{stat.label}</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-xs text-gray-400 dark:text-[var(--text-secondary)] mt-1">{stat.sub}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl shadow-sm border dark:border-[var(--border-color)] overflow-hidden animate-fade-in-up transition-colors duration-300">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-[var(--bg-tertiary)] border-b dark:border-[var(--border-color)]">
                    <tr>
                      {['ID', 'Маршрут', 'Водитель', 'Расстояние', 'Статус', 'Стоимость'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-600 dark:text-[var(--text-secondary)] uppercase px-6 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-[var(--border-color)]">
                    {orders.map((order, index) => (
                      <tr 
                        key={order.id} 
                        className="hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors animate-fade-in-up"
                        style={{ opacity: 0, animationDelay: `${(index + 1) * 0.05}s` }}
                        onClick={() => { setActiveTab('routes'); handleOrderClick(order); }}
                      >
                        <td className="px-6 py-4 text-sm font-bold text-blue-600 dark:text-blue-400">{order.id}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-800 dark:text-white font-medium">{order.route}</div>
                          <div className="text-xs text-gray-500 dark:text-[var(--text-secondary)]">{order.cargo}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-[var(--text-secondary)]">{order.driver}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-[var(--text-secondary)]">{order.distance}</td>
                        <td className="px-6 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${order.statusColor}`}>{order.status}</span></td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{order.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'fleet':
        return (
          <div className="flex-1 bg-gray-50 dark:bg-[var(--bg-primary)] p-6 overflow-y-auto transition-colors duration-300 animate-fade-in">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white animate-fade-in-down">Автопарк</h2>
                <button 
                  onClick={() => setIsVehicleModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Добавить ТС
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Всего машин', value: vehicles.length, icon: Truck, color: 'blue' },
                  { label: 'На линии', value: vehicles.filter(v => v.status === 'В пути').length, icon: Activity, color: 'green' },
                  { label: 'На обслуживании', value: vehicles.filter(v => v.status === 'На обслуживании').length, icon: Settings, color: 'amber' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl p-4 border dark:border-[var(--border-color)] animate-zoom-in transition-colors duration-300" style={{ opacity: 0, animationDelay: `${(idx + 1) * 0.05}s` }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.value}</p>
                          <p className="text-xs text-gray-500 dark:text-[var(--text-secondary)]">{stat.label}</p>
                        </div>
                        <Icon className={`w-8 h-8 text-${stat.color}-500`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((vehicle, index) => (
                  <div 
                    key={vehicle.id} 
                    className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl p-5 border dark:border-[var(--border-color)] hover:shadow-md transition-shadow animate-fade-in-up transition-colors duration-300"
                    style={{ opacity: 0, animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                          <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{vehicle.model}</h3>
                          <p className="text-xs text-gray-500 dark:text-[var(--text-secondary)]">{vehicle.plate}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        vehicle.status === 'В пути' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        vehicle.status === 'На обслуживании' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                        'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}>{vehicle.status}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-[var(--text-secondary)]">Водитель</span>
                        <span className="font-medium text-gray-900 dark:text-white">{vehicle.driver}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-[var(--text-secondary)]">Пробег</span>
                        <span className="font-medium text-gray-900 dark:text-white">{vehicle.mileage}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-[var(--text-secondary)]">Расход топлива</span>
                        <span className="font-medium text-gray-900 dark:text-white">{vehicle.fuel}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t dark:border-[var(--border-color)] flex items-center justify-between">
                      <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">История рейсов</button>
                      <button className="text-xs text-gray-500 dark:text-[var(--text-secondary)] hover:text-gray-700 dark:hover:text-white">Настройки →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'cargo':
        return (
          <div className="flex-1 bg-gray-50 dark:bg-[var(--bg-primary)] p-6 overflow-y-auto transition-colors duration-300 animate-fade-in">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white animate-fade-in-down">Грузы</h2>
                <button 
                  onClick={() => setCargoFilter(null)}
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[var(--bg-secondary)] border dark:border-[var(--border-color)] rounded-lg text-sm font-medium text-gray-700 dark:text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <Filter className="w-4 h-4" /> Сбросить фильтр
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Общий вес', value: '38.5 т' },
                  { label: 'Активных грузов', value: filteredCargo.length },
                  { label: 'Типов груза', value: cargoTypes.length - 1 }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl p-4 border dark:border-[var(--border-color)] animate-zoom-in transition-colors duration-300" style={{ opacity: 0, animationDelay: `${(idx + 1) * 0.05}s` }}>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-[var(--text-secondary)]">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Фильтры по типу груза */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {cargoTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setCargoFilter(type === 'Все' ? null : type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      (cargoFilter === type) || (cargoFilter === null && type === 'Все')
                        ? 'bg-gray-800 dark:bg-gray-700 text-white'
                        : 'bg-white dark:bg-[var(--bg-secondary)] border dark:border-[var(--border-color)] text-gray-700 dark:text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCargo.map((order, index) => (
                  <div 
                    key={order.id} 
                    className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl p-5 border dark:border-[var(--border-color)] animate-slide-in-left transition-colors duration-300"
                    style={{ opacity: 0, animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 rounded-xl flex items-center justify-center shrink-0">
                        <Package className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">{order.cargo}</h3>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${order.statusColor}`}>{order.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-[var(--text-secondary)] mb-3">Заказ: {order.id}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-[var(--text-secondary)]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {order.route}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t dark:border-[var(--border-color)] grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-[var(--text-secondary)]">Вес</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.cargo.split('· ')[1] || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-[var(--text-secondary)]">Расстояние</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.distance}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-[var(--text-secondary)]">Водитель</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{order.driver.split(' ')[0]}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="flex-1 bg-gray-50 dark:bg-[var(--bg-primary)] p-6 overflow-y-auto transition-colors duration-300 animate-fade-in">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white animate-fade-in-down">Документы</h2>
                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" /> Загрузить
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { id: 'all', label: 'Все документы' },
                  { id: 'ttn', label: 'ТТН' },
                  { id: 'contracts', label: 'Договоры' },
                  { id: 'acts', label: 'Акты' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveDocTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeDocTab === tab.id 
                        ? 'bg-gray-800 dark:bg-gray-700 text-white' 
                        : 'bg-white dark:bg-[var(--bg-secondary)] border dark:border-[var(--border-color)] text-gray-700 dark:text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl border dark:border-[var(--border-color)] divide-y dark:divide-[var(--border-color)] transition-colors duration-300">
                {filteredDocuments.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-[var(--text-secondary)]">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Документы не найдены</p>
                  </div>
                ) : (
                  filteredDocuments.map((order, index) => (
                    <div 
                      key={order.id} 
                      className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] transition-colors animate-slide-in-right"
                      style={{ opacity: 0, animationDelay: `${index * 0.08}s` }}
                    >
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 dark:text-white">ТТН-{order.id}.pdf</p>
                          <span className="text-xs text-gray-400">2.4 MB</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-[var(--text-secondary)]">{order.route} · {order.driver}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Сегодня, 14:30</span>
                        <button 
                          onClick={() => downloadOrderPDF(order)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                          title="Скачать PDF"
                        >
                          <Download className="w-4 h-4 text-gray-600 dark:text-[var(--text-secondary)]" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 transition-colors duration-300">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Нужна помощь с документами?</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Ознакомьтесь с инструкцией по заполнению ТТН и других транспортных документов</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="flex-1 bg-gray-50 dark:bg-[var(--bg-primary)] p-6 overflow-y-auto transition-colors duration-300 animate-fade-in">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white animate-fade-in-down">Статистика</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setStatsPeriod('week')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statsPeriod === 'week' ? 'bg-gray-800 dark:bg-gray-700 text-white' : 'bg-white dark:bg-[var(--bg-secondary)] border dark:border-[var(--border-color)] text-gray-700 dark:text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    За неделю
                  </button>
                  <button 
                    onClick={() => setStatsPeriod('month')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statsPeriod === 'month' ? 'bg-gray-800 dark:bg-gray-700 text-white' : 'bg-white dark:bg-[var(--bg-secondary)] border dark:border-[var(--border-color)] text-gray-700 dark:text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    За месяц
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Всего заказов', value: orders.length, sub: `+12% за ${statsPeriod === 'week' ? 'неделю' : 'месяц'}`, icon: TrendingUp, color: 'blue' },
                  { label: 'В пути', value: orders.filter(o => o.status === 'В пути').length, sub: 'активных рейсов', icon: Truck, color: 'blue' },
                  { label: 'Доставлено', value: orders.filter(o => o.status === 'Доставлен').length, sub: '+3 сегодня', icon: CheckCircle2, color: 'green' },
                  { label: 'Среднее время', value: '18ч', sub: 'на доставку', icon: Clock, color: 'amber' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl p-6 border dark:border-[var(--border-color)] animate-zoom-in transition-colors duration-300" style={{ opacity: 0, animationDelay: `${(idx + 1) * 0.05}s` }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500 dark:text-[var(--text-secondary)]">{stat.label}</p>
                        <Icon className={`w-5 h-5 text-${stat.color}-500`} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className={`text-xs text-${stat.color}-600 dark:text-${stat.color}-400 mt-1`}>{stat.sub}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl p-6 border dark:border-[var(--border-color)] animate-fade-in-up transition-colors duration-300" style={{ opacity: 0, animationDelay: '0.25s' }}>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Эффективность доставки</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-[var(--text-secondary)]">В срок</span>
                        <span className="font-semibold text-gray-900 dark:text-white">87%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-[var(--bg-tertiary)] rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full animate-pulse-soft" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-[var(--text-secondary)]">С задержкой</span>
                        <span className="font-semibold text-gray-900 dark:text-white">13%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-[var(--bg-tertiary)] rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full animate-pulse-soft" style={{ width: '13%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl p-6 border dark:border-[var(--border-color)] animate-fade-in-up transition-colors duration-300" style={{ opacity: 0, animationDelay: '0.3s' }}>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Распределение по статусам</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'В пути', count: orders.filter(o => o.status === 'В пути').length, color: 'bg-blue-500' },
                      { label: 'Доставлен', count: orders.filter(o => o.status === 'Доставлен').length, color: 'bg-green-500' },
                      { label: 'Ожидает', count: orders.filter(o => o.status === 'Ожидает').length, color: 'bg-orange-500' },
                      { label: 'Задержка', count: orders.filter(o => o.status === 'Задержка').length, color: 'bg-red-500' }
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm text-gray-600 dark:text-[var(--text-secondary)] flex-1">{item.label}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl p-6 border dark:border-[var(--border-color)] animate-fade-in-up transition-colors duration-300" style={{ opacity: 0, animationDelay: '0.35s' }}>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Последняя активность</h3>
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order, idx) => (
                    <div key={order.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-[var(--bg-tertiary)] rounded-lg transition-colors duration-300">
                      <div className={`w-2 h-2 rounded-full ${order.status === 'Доставлен' ? 'bg-green-500' : order.status === 'Задержка' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</p>
                        <p className="text-xs text-gray-500 dark:text-[var(--text-secondary)]">{order.route}</p>
                      </div>
                      <span className="text-xs text-gray-400">{idx === 0 ? '5 мин назад' : idx === 1 ? '15 мин назад' : '32 мин назад'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="flex-1 bg-gray-50 dark:bg-[var(--bg-primary)] p-6 overflow-y-auto transition-colors duration-300 animate-fade-in">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-down">Настройки</h2>
              
              <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl border dark:border-[var(--border-color)] p-6 space-y-4 animate-fade-in-up transition-colors duration-300" style={{ opacity: 0, animationDelay: '0.05s' }}>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" /> Профиль компании
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--text-secondary)] mb-2">Название компании</label>
                    <input type="text" defaultValue="LogiFlow" className="w-full px-3 py-2 text-sm border dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-primary)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--text-secondary)] mb-2">Email для уведомлений</label>
                    <input type="email" defaultValue="admin@logiflow.ru" className="w-full px-3 py-2 text-sm border dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-primary)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--text-secondary)] mb-2">Телефон</label>
                    <input type="tel" defaultValue="+7 (999) 123-45-67" className="w-full px-3 py-2 text-sm border dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-primary)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl border dark:border-[var(--border-color)] p-6 space-y-4 animate-fade-in-up transition-colors duration-300" style={{ opacity: 0, animationDelay: '0.1s' }}>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" /> Интерфейс
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--text-secondary)] mb-2">Шрифт интерфейса</label>
                    <select 
                      value={selectedFont} 
                      onChange={(e) => setSelectedFont(e.target.value)}
                      className="w-full px-3 py-2 text-sm border dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-primary)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      <option value="Inter">Inter (По умолчанию)</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Arial">Arial (Системный)</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isHighContrast} 
                      onChange={(e) => setIsHighContrast(e.target.checked)} 
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" 
                    />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Режим высокой контрастности</span>
                      <p className="text-xs text-gray-500 dark:text-[var(--text-secondary)]">Максимальный контраст для слабовидящих</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-xl border dark:border-[var(--border-color)] p-6 space-y-4 animate-fade-in-up transition-colors duration-300" style={{ opacity: 0, animationDelay: '0.15s' }}>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" /> Экспорт данных
                </h3>
                <p className="text-sm text-gray-500 dark:text-[var(--text-secondary)] mb-3">Скачать текущий список заказов в удобном формате.</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => exportToExcel(orders)} 
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" /> Excel (.xlsx)
                  </button>
                  <button 
                    onClick={() => exportToPDF(orders)} 
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" /> PDF (.pdf)
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                  Сохранить изменения
                </button>
                <button className="px-6 py-2.5 border dark:border-[var(--border-color)] text-gray-700 dark:text-[var(--text-secondary)] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)] transition-colors">
                  Отмена
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-[var(--text-secondary)]">Раздел в разработке</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[var(--bg-primary)] text-gray-800 dark:text-[var(--text-primary)] transition-colors duration-300">
      
      {/* Модальное окно уведомлений */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsNotificationsOpen(false)} />
          <div className="relative w-96 bg-white dark:bg-[var(--bg-secondary)] border-l dark:border-[var(--border-color)] shadow-2xl animate-slide-in flex flex-col h-full transition-colors duration-300">
            <div className="p-4 border-b dark:border-[var(--border-color)] flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Уведомления</h3>
              <button onClick={() => setIsNotificationsOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-[var(--bg-tertiary)] rounded">
                <X className="w-5 h-5 text-gray-600 dark:text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {notifications.map(notif => (
                <div 
                  key={notif.id} 
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    notif.read 
                      ? 'bg-white dark:bg-[var(--bg-secondary)] border-gray-100 dark:border-[var(--border-color)]' 
                      : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{notif.title}</span>
                    {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-[var(--text-secondary)] mb-2">{notif.message}</p>
                  <span className="text-[10px] text-gray-400">{notif.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания заказа */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative bg-white dark:bg-[var(--bg-secondary)] rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-scale-in border dark:border-[var(--border-color)] transition-colors duration-300">
            <div className="p-6 border-b dark:border-[var(--border-color)] flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Новый заказ</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-[var(--bg-tertiary)] rounded">
                <X className="w-5 h-5 text-gray-600 dark:text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-[var(--text-secondary)] mb-1.5">Транспорт *</label>
                <input 
                  type="text" 
                  placeholder="МАЗ-6430 · А567ВВ78" 
                  value={newOrder.truck}
                  onChange={(e) => setNewOrder({...newOrder, truck: e.target.value})}
                  className="w-full px-3 py-2 text-sm border dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-primary)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-[var(--text-secondary)] mb-1.5">Маршрут *</label>
                <input 
                  type="text" 
                  placeholder="Москва → Казань" 
                  value={newOrder.route}
                  onChange={(e) => setNewOrder({...newOrder, route: e.target.value})}
                  className="w-full px-3 py-2 text-sm border dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-primary)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-[var(--text-secondary)] mb-1.5">Груз</label>
                <input 
                  type="text" 
                  placeholder="Стройматериалы · 12 т" 
                  value={newOrder.cargo}
                  onChange={(e) => setNewOrder({...newOrder, cargo: e.target.value})}
                  className="w-full px-3 py-2 text-sm border dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-primary)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-[var(--text-secondary)] mb-1.5">Водитель *</label>
                <input 
                  type="text" 
                  placeholder="Иванов С.В." 
                  value={newOrder.driver}
                  onChange={(e) => setNewOrder({...newOrder, driver: e.target.value})}
                  className="w-full px-3 py-2 text-sm border dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-primary)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-[var(--text-secondary)] mb-1.5">Время доставки</label>
                <input 
                  type="text" 
                  placeholder="22:00" 
                  value={newOrder.eta}
                  onChange={(e) => setNewOrder({...newOrder, eta: e.target.value})}
                  className="w-full px-3 py-2 text-sm border dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-primary)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="p-6 border-t dark:border-[var(--border-color)] flex gap-3">
              <button 
                onClick={() => setIsCreateModalOpen(false)} 
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[var(--text-secondary)] bg-gray-100 dark:bg-[var(--bg-tertiary)] hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={handleCreateOrder}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Создать заказ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления ТС */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsVehicleModalOpen(false)} />
          <div className="relative bg-white dark:bg-[var(--bg-secondary)] rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-scale-in border dark:border-[var(--border-color)] transition-colors duration-300">
            <div className="p-6 border-b dark:border-[var(--border-color)] flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Добавить транспортное средство</h3>
              <button onClick={() => setIsVehicleModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-[var(--bg-tertiary)] rounded">
                <X className="w-5 h-5 text-gray-600 dark:text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-[var(--text-secondary)] mb-1.5">Модель *</label>
                <input 
                  type="text" 
                  placeholder="Volvo FH16" 
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                  className="w-full px-3 py-2 text-sm border dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-primary)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-[var(--text-secondary)] mb-1.5">Гос. номер *</label>
                <input 
                  type="text" 
                  placeholder="А123БВ777" 
                  value={newVehicle.plate}
                  onChange={(e) => setNewVehicle({...newVehicle, plate: e.target.value})}
                  className="w-full px-3 py-2 text-sm border dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-primary)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-[var(--text-secondary)] mb-1.5">Водитель *</label>
                <input 
                  type="text" 
                  placeholder="Иванов И.И." 
                  value={newVehicle.driver}
                  onChange={(e) => setNewVehicle({...newVehicle, driver: e.target.value})}
                  className="w-full px-3 py-2 text-sm border dark:border-[var(--border-color)] bg-white dark:bg-[var(--bg-primary)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="p-6 border-t dark:border-[var(--border-color)] flex gap-3">
              <button 
                onClick={() => setIsVehicleModalOpen(false)} 
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[var(--text-secondary)] bg-gray-100 dark:bg-[var(--bg-tertiary)] hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={handleAddVehicle}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Добавить ТС
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Левая панель */}
      <aside className="w-64 bg-white dark:bg-[var(--bg-secondary)] border-r dark:border-[var(--border-color)] flex flex-col shrink-0 transition-colors duration-300">
        <div className="p-5 border-b dark:border-[var(--border-color)] flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">LogiFlow</h1>
            <p className="text-[10px] text-gray-400 dark:text-[var(--text-secondary)] uppercase tracking-wider">Платформа логистики</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 p-4 border-b dark:border-[var(--border-color)]">
          <div className="bg-blue-50 dark:bg-blue-900/40 p-2 rounded-lg text-center">
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{orders.filter(o => o.status === 'В пути').length}</p>
            <p className="text-[10px] text-gray-500 dark:text-[var(--text-secondary)]">В пути</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/40 p-2 rounded-lg text-center">
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{orders.filter(o => o.status === 'Задержка').length}</p>
            <p className="text-[10px] text-gray-500 dark:text-[var(--text-secondary)]">Задержки</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/40 p-2 rounded-lg text-center">
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{orders.filter(o => o.status === 'Доставлен').length}</p>
            <p className="text-[10px] text-gray-500 dark:text-[var(--text-secondary)]">Готово</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-[10px] font-semibold text-gray-400 dark:text-[var(--text-secondary)] uppercase tracking-wider">Основное</p>
          {menuItems.filter(m => m.section === 'main').map(item => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </button>
            );
          })}

          <p className="px-3 py-2 pt-4 text-[10px] font-semibold text-gray-400 dark:text-[var(--text-secondary)] uppercase tracking-wider">Аналитика</p>
          {menuItems.filter(m => m.section === 'secondary').map(item => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t dark:border-[var(--border-color)]">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'settings' 
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' 
                : 'text-gray-600 dark:text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            <Settings className="w-4 h-4" />
            Настройки
          </button>
        </div>

        <div className="p-4 border-t dark:border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-200 dark:bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center text-gray-600 dark:text-white font-bold text-sm">АК</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">Алексей Кузнецов</p>
              <p className="text-xs text-gray-500 dark:text-[var(--text-secondary)] truncate">Диспетчер</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Центр */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-[var(--bg-secondary)] border-b dark:border-[var(--border-color)] flex items-center px-6 justify-between shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {menuItems.find(m => m.id === activeTab)?.name || 'LogiFlow'}
            </h2>
            <span className="text-xs text-gray-400 dark:text-[var(--text-secondary)]">· Реальное время</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Поиск заказа, водителя, груза..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm w-80 border dark:border-[var(--border-color)] bg-gray-50 dark:bg-[var(--bg-primary)] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-[var(--text-secondary)]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
            <button 
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              title={isDarkTheme ? 'Светлая тема' : 'Тёмная тема'}
            >
              {isDarkTheme ? <Sun className="w-5 h-5 text-gray-600 dark:text-[var(--text-secondary)]" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Создать заказ
            </button>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}