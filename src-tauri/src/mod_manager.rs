use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModManifest {
    pub id: String,
    pub name: String,
    pub version: String,
    pub author: String,
    pub description: String,
    pub target_os: Vec<String>,
    pub target_apps: Vec<String>,
    pub permissions: Vec<String>,
    pub entry_point: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModInfo {
    pub manifest: ModManifest,
    pub installed: bool,
    pub enabled: bool,
    pub path: PathBuf,
}

#[derive(Clone)]
pub struct ModManager {
    mods_directory: PathBuf,
}

impl ModManager {
    pub fn new() -> Self {
        let mut mods_dir = dirs::data_dir().unwrap_or_else(|| PathBuf::from("."));
        mods_dir.push("Auramore");
        mods_dir.push("mods");

        std::fs::create_dir_all(&mods_dir).expect("Failed to create mods directory");

        Self {
            mods_directory: mods_dir,
        }
    }

    pub fn get_mods_directory(&self) -> &PathBuf {
        &self.mods_directory
    }

    pub fn load_manifest(&self, mod_id: &str) -> Result<ModManifest, String> {
        let mut mod_path = self.mods_directory.clone();
        mod_path.push(mod_id);
        mod_path.push("manifest.json");

        let content = std::fs::read_to_string(&mod_path)
            .map_err(|e| format!("Failed to read manifest: {}", e))?;

        let manifest: ModManifest = serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse manifest: {}", e))?;

        Ok(manifest)
    }

    pub fn list_installed_mods(&self) -> Result<Vec<ModInfo>, String> {
        let mut mods = Vec::new();

        if !self.mods_directory.exists() {
            return Ok(mods);
        }

        let entries = std::fs::read_dir(&self.mods_directory)
            .map_err(|e| format!("Failed to read mods directory: {}", e))?;

        for entry in entries {
            let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
            let path = entry.path();

            if path.is_dir() {
                if let Some(mod_id) = path.file_name().and_then(|n| n.to_str()) {
                    match self.load_manifest(mod_id) {
                        Ok(manifest) => {
                            let mut mod_path = self.mods_directory.clone();
                            mod_path.push(mod_id);

                            // TODO: Проверить статус мода (enabled/disabled)
                            let mod_info = ModInfo {
                                manifest: manifest.clone(),
                                installed: true,
                                enabled: false, // TODO: Загрузить из конфига
                                path: mod_path,
                            };

                            mods.push(mod_info);
                        }
                        Err(_) => {
                            // Пропускаем моды с невалидным манифестом
                            continue;
                        }
                    }
                }
            }
        }

        Ok(mods)
    }

    pub fn install_mod_from_zip(&self, zip_path: &str) -> Result<String, String> {
        use std::io::Read;
        use zip::ZipArchive;

        let file = std::fs::File::open(zip_path)
            .map_err(|e| format!("Failed to open zip file: {}", e))?;

        let mut archive = ZipArchive::new(file)
            .map_err(|e| format!("Failed to read zip archive: {}", e))?;

        // Читаем manifest.json из архива
        let manifest = {
            let mut manifest_file = archive.by_name("manifest.json")
                .map_err(|_| "manifest.json not found in mod archive".to_string())?;

            let mut manifest_content = String::new();
            manifest_file.read_to_string(&mut manifest_content)
                .map_err(|e| format!("Failed to read manifest: {}", e))?;

            serde_json::from_str::<ModManifest>(&manifest_content)
                .map_err(|e| format!("Failed to parse manifest: {}", e))?
        };

        // Создаем директорию для мода
        let mut mod_dir = self.mods_directory.clone();
        mod_dir.push(&manifest.id);

        std::fs::create_dir_all(&mod_dir)
            .map_err(|e| format!("Failed to create mod directory: {}", e))?;

        // Извлекаем все файлы из архива
        for i in 0..archive.len() {
            let mut file = archive.by_index(i)
                .map_err(|e| format!("Failed to read file from archive: {}", e))?;

            let outpath = match file.enclosed_name() {
                Some(path) => mod_dir.join(path),
                None => continue,
            };

            if file.name().ends_with('/') {
                std::fs::create_dir_all(&outpath)
                    .map_err(|e| format!("Failed to create directory: {}", e))?;
            } else {
                if let Some(p) = outpath.parent() {
                    std::fs::create_dir_all(p)
                        .map_err(|e| format!("Failed to create parent directory: {}", e))?;
                }

                let mut outfile = std::fs::File::create(&outpath)
                    .map_err(|e| format!("Failed to create file: {}", e))?;

                std::io::copy(&mut file, &mut outfile)
                    .map_err(|e| format!("Failed to write file: {}", e))?;
            }
        }

        Ok(manifest.id)
    }

    pub fn uninstall_mod(&self, mod_id: &str) -> Result<(), String> {
        let mut mod_path = self.mods_directory.clone();
        mod_path.push(mod_id);

        if mod_path.exists() {
            std::fs::remove_dir_all(&mod_path)
                .map_err(|e| format!("Failed to remove mod directory: {}", e))?;
        }

        Ok(())
    }
}

