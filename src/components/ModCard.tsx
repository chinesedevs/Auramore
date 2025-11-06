import { Star, Download, Check, Settings } from "lucide-react";
import { useState } from "react";

interface Mod {
  id: string;
  name: string;
  author: string;
  description: string;
  version: string;
  rating: number;
  downloads: number;
  icon: string;
  screenshots: string[];
  target_os: string[];
  target_apps: string[];
  installed: boolean;
}

interface ModCardProps {
  mod: Mod;
}

export default function ModCard({ mod }: ModCardProps) {
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    // TODO: Вызвать Tauri команду для установки мода
    setTimeout(() => {
      setIsInstalling(false);
    }, 2000);
  };

  return (
    <div className="card hover:scale-[1.02] transition-transform duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{mod.name}</h3>
          <p className="text-sm text-slate-400">от {mod.author}</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-dark 
                       flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">
            {mod.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-300 text-sm mb-4 line-clamp-2">{mod.description}</p>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1 text-yellow-400">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-slate-300">{mod.rating}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Download className="w-4 h-4" />
          <span>{mod.downloads.toLocaleString()}</span>
        </div>
        <div className="text-slate-500 text-xs">v{mod.version}</div>
      </div>

      {/* OS Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mod.target_os.map((os) => (
          <span
            key={os}
            className="px-2 py-1 text-xs rounded bg-slate-700/50 text-slate-300"
          >
            {os === "windows" ? "Windows" : os === "macos" ? "macOS" : os}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {mod.installed ? (
          <>
            <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              Установлено
            </button>
            <button className="btn-secondary px-3">
              <Settings className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isInstalling ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Установка...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Установить
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

