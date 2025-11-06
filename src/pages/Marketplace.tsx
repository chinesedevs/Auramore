import { useState } from "react";
import { Search, Star, Download, Filter } from "lucide-react";
import ModCard from "../components/ModCard";

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

const mockMods: Mod[] = [
  {
    id: "transparent-taskbar",
    name: "Прозрачная панель задач",
    author: "SystemMods",
    description: "Делает панель задач Windows полностью прозрачной с эффектом размытия",
    version: "1.2.0",
    rating: 4.8,
    downloads: 12500,
    icon: "",
    screenshots: [],
    target_os: ["windows"],
    target_apps: ["explorer"],
    installed: false,
  },
  {
    id: "macos-dock-style",
    name: "Dock в стиле macOS",
    author: "UIEnhancer",
    description: "Преобразует панель задач Windows в стильный Dock как в macOS",
    version: "2.0.1",
    rating: 4.6,
    downloads: 8900,
    icon: "",
    screenshots: [],
    target_os: ["windows"],
    target_apps: ["explorer"],
    installed: true,
  },
  {
    id: "custom-titlebar",
    name: "Кастомные заголовки окон",
    author: "WindowMods",
    description: "Добавляет красивые кастомные заголовки окон с градиентами",
    version: "1.5.3",
    rating: 4.7,
    downloads: 15200,
    icon: "",
    screenshots: [],
    target_os: ["windows", "macos"],
    target_apps: ["all"],
    installed: false,
  },
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOS, setSelectedOS] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");

  const filteredMods = mockMods.filter((mod) => {
    const matchesSearch = mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOS = selectedOS === "all" || mod.target_os.includes(selectedOS);
    return matchesSearch && matchesOS;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Маркетплейс модов</h1>
        <p className="text-slate-400">Найдите и установите моды для кастомизации вашей системы</p>
      </div>

      {/* Search and Filters */}
      <div className="card space-y-4">
        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск модов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* OS Filter */}
          <select
            value={selectedOS}
            onChange={(e) => setSelectedOS(e.target.value)}
            className="input w-48"
          >
            <option value="all">Все ОС</option>
            <option value="windows">Windows</option>
            <option value="macos">macOS</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input w-48"
          >
            <option value="popular">Популярные</option>
            <option value="rating">По рейтингу</option>
            <option value="newest">Новые</option>
            <option value="downloads">По загрузкам</option>
          </select>
        </div>
      </div>

      {/* Mods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMods.map((mod) => (
          <ModCard key={mod.id} mod={mod} />
        ))}
      </div>

      {filteredMods.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-slate-400 text-lg">Моды не найдены</p>
          <p className="text-slate-500 text-sm mt-2">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
}

