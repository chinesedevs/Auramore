import { useState, useEffect } from "react";
import { Monitor, Shield, Bell, Database } from "lucide-react";
import { setZoomLevel, getZoomLevel } from "../lib/tauri";

export default function Settings() {
  const [currentZoom, setCurrentZoom] = useState<number>(1.0);

  useEffect(() => {
    // Загружаем текущий масштаб при монтировании
    getZoomLevel().then(setCurrentZoom).catch(() => {});
  }, []);

  const zoomOptions = [
    { label: "50%", value: 0.5 },
    { label: "100%", value: 1.0 },
    { label: "125%", value: 1.25 },
    { label: "150%", value: 1.5 },
  ];

  const handleZoomChange = async (scale: number) => {
    try {
      await setZoomLevel(scale);
      setCurrentZoom(scale);
    } catch (error) {
      console.error("Failed to set zoom level:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Настройки</h1>
        <p className="text-slate-400">Управление параметрами приложения</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Общие</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Масштаб интерфейса</p>
                <p className="text-sm text-slate-400">Изменение размера элементов интерфейса</p>
              </div>
              <div className="flex gap-2">
                {zoomOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleZoomChange(option.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      Math.abs(currentZoom - option.value) < 0.01
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Автозапуск при загрузке системы</p>
                <p className="text-sm text-slate-400">Запускать Auramore при старте ОС</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 
                              peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full 
                              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                              after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 
                              after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Проверка обновлений</p>
                <p className="text-sm text-slate-400">Автоматически проверять наличие обновлений</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 
                              peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full 
                              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                              after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 
                              after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Безопасность</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Строгий режим безопасности</p>
                <p className="text-sm text-slate-400">Блокировать моды без проверенных подписей</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 
                              peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full 
                              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                              after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 
                              after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Песочница для модов</p>
                <p className="text-sm text-slate-400">Изолировать выполнение модов</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 
                              peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full 
                              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                              after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 
                              after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Уведомления</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Уведомления о обновлениях модов</p>
                <p className="text-sm text-slate-400">Получать уведомления о доступных обновлениях</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 
                              peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full 
                              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                              after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 
                              after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Данные</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Путь к модам</p>
                <p className="text-sm text-slate-400">Директория для хранения установленных модов</p>
              </div>
              <button className="btn-secondary text-sm">
                Изменить
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Очистить кэш</p>
                <p className="text-sm text-slate-400">Удалить все временные файлы и кэш</p>
              </div>
              <button className="btn-secondary text-sm">
                Очистить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

