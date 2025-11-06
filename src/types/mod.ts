export interface ModManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  target_os: string[];
  target_apps: string[];
  permissions: string[];
  entry_point: string;
}

export interface ModInfo {
  id: string;
  name: string;
  author: string;
  version: string;
  description: string;
  rating: number;
  downloads: number;
  icon?: string;
  screenshots: string[];
  target_os: string[];
  target_apps: string[];
  installed: boolean;
  enabled?: boolean;
  status?: "active" | "error" | "inactive";
  error?: string;
}

export interface InstalledMod {
  id: string;
  name: string;
  author: string;
  version: string;
  enabled: boolean;
  description: string;
  status: "active" | "error" | "inactive";
  error?: string;
}

