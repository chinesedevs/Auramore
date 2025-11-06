import { useState } from "react";
import { Power, Settings, Trash2, Info, AlertCircle } from "lucide-react";
import { toggleMod, uninstallMod } from "../lib/tauri";

interface InstalledMod {
  id: string;
  name: string;
  author: string;
  version: string;
  enabled: boolean;
  description: string;
  status: "active" | "error" | "inactive";
  error?: string;
}

const mockInstalledMods: InstalledMod[] = [
  {
    id: "macos-dock-style",
    name: "Dock в стиле macOS",
    author: "UIEnhancer",
    version: "2.0.1",
    enabled: true,
    description: "Преобразует панель задач Windows в стильный Dock как в macOS",
    status: "active",
  },
  {
    id: "custom-titlebar",
    name: "Кастомные заголовки окон",
    author: "WindowMods",
    version: "1.5.3",
    enabled: false,
    description: "Добавляет красивые кастомные заголовки окон с градиентами",
    status: "inactive",
  },
  {
    id: "broken-mod",
    name: "Сломанный мод",
    author: "TestAuthor",
    version: "1.0.0",
    enabled: false,
    description: "Мод с ошибкой для тестирования",
    status: "error",
    error: "Не удалось загрузить нативный модуль",
  },
];

export default function ModManager() {
  const [mods, setMods] = useState<InstalledMod[]>(mockInstalledMods);

  const handleToggle = async (modId: string, currentState: boolean) => {
    try {
      await toggleMod(modId, !currentState);
      setMods(mods.map(mod => 
        mod.id === modId ? { ...mod, enabled: !currentState } : mod
      ));
    } catch (error) {
      console.error("Failed to toggle mod:", error);
    }
  };

  const handleUninstall = async (modId: string) => {
    if (!confirm(`Вы уверены, что хотите удалить мод "${mods.find(m => m.id === modId)?.name}"?`)) {
      return;
    }

    try {
      await uninstallMod(modId);
      setMods(mods.filter(mod => mod.id !== modId));
    } catch (error) {
      console.error("Failed to uninstall mod:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Мои моды</h1>
        <p className="text-slate-400">Управляйте установленными модами</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <div className="text-2xl font-bold text-white">{mods.length}</div>
          <div className="text-sm text-slate-400">Всего модов</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-accent-success">
            {mods.filter(m => m.enabled).length}
          </div>
          <div className="text-sm text-slate-400">Активных</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-accent-warning">
            {mods.filter(m => m.status === "error").length}
          </div>
          <div className="text-sm text-slate-400">С ошибками</div>
        </div>
      </div>

      {/* Mods List */}
      <div className="space-y-4">
        {mods.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-400 text-lg">У вас пока нет установленных модов</p>
            <p className="text-slate-500 text-sm mt-2">
              Перейдите в маркетплейс, чтобы найти и установить моды
            </p>
          </div>
        ) : (
          mods.map((mod) => (
            <div key={mod.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{mod.name}</h3>
                    <span className="text-xs text-slate-500">v{mod.version}</span>
                    {mod.status === "error" && (
                      <span className="px-2 py-1 text-xs rounded bg-accent-warning/20 
                                     text-accent-warning flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Ошибка
                      </span>
                    )}
                    {mod.status === "active" && mod.enabled && (
                      <span className="px-2 py-1 text-xs rounded bg-accent-success/20 
                                     text-accent-success">
                        Активен
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-1">от {mod.author}</p>
                  <p className="text-slate-300 text-sm">{mod.description}</p>
                  {mod.error && (
                    <div className="mt-3 p-3 rounded-lg bg-accent-warning/10 
                                  border border-accent-warning/20">
                      <p className="text-sm text-accent-warning">{mod.error}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(mod.id, mod.enabled)}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      mod.enabled
                        ? "bg-accent-success/20 text-accent-success hover:bg-accent-success/30"
                        : "glass-hover text-slate-400"
                    }`}
                    title={mod.enabled ? "Отключить" : "Включить"}
                  >
                    <Power className={`w-5 h-5 ${mod.enabled ? "fill-current" : ""}`} />
                  </button>

                  {/* Settings */}
                  <button
                    className="p-3 glass-hover rounded-lg text-slate-400 hover:text-white"
                    title="Настройки"
                  >
                    <Settings className="w-5 h-5" />
                  </button>

                  {/* Info */}
                  <button
                    className="p-3 glass-hover rounded-lg text-slate-400 hover:text-white"
                    title="Информация"
                  >
                    <Info className="w-5 h-5" />
                  </button>

                  {/* Uninstall */}
                  <button
                    onClick={() => handleUninstall(mod.id)}
                    className="p-3 glass-hover rounded-lg text-slate-400 hover:text-accent-warning"
                    title="Удалить"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

