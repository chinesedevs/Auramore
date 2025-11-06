use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::path::Path;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum Permission {
    ReadUI,
    ModifyUI,
    InjectCode,
    AccessNetwork,
    AccessFilesystem,
    AccessRegistry, // Windows only
    AccessUserDefaults, // macOS only
}

#[derive(Debug, Clone)]
pub struct ModPermissions {
    pub mod_id: String,
    pub granted: HashSet<Permission>,
    pub requested: Vec<Permission>,
}

pub struct SecurityEngine {
    strict_mode: bool,
    sandbox_enabled: bool,
}

impl SecurityEngine {
    pub fn new() -> Self {
        Self {
            strict_mode: false,
            sandbox_enabled: true,
        }
    }

    pub fn with_strict_mode(mut self, enabled: bool) -> Self {
        self.strict_mode = enabled;
        self
    }

    pub fn with_sandbox(mut self, enabled: bool) -> Self {
        self.sandbox_enabled = enabled;
        self
    }

    pub fn check_permission(&self, permission: &Permission, granted: &HashSet<Permission>) -> bool {
        if !self.sandbox_enabled {
            return true; // Если песочница отключена, разрешаем все
        }

        granted.contains(permission)
    }

    pub fn verify_mod_signature(&self, mod_path: &Path) -> Result<bool, String> {
        if !self.strict_mode {
            return Ok(true); // В нестрогом режиме пропускаем проверку
        }

        // TODO: Реализовать проверку подписи мода
        // Для начала просто проверяем наличие файла
        if !mod_path.exists() {
            return Err("Mod path does not exist".to_string());
        }

        Ok(true)
    }

    pub fn validate_permissions(
        &self,
        requested: &[Permission],
        _mod_id: &str,
    ) -> Result<HashSet<Permission>, String> {
        let mut granted = HashSet::new();

        for permission in requested {
            // Проверяем, разрешено ли это разрешение для данной платформы
            if self.is_permission_allowed_for_platform(permission) {
                granted.insert(permission.clone());
            } else {
                return Err(format!(
                    "Permission {:?} is not allowed for this platform",
                    permission
                ));
            }
        }

        Ok(granted)
    }

    fn is_permission_allowed_for_platform(&self, permission: &Permission) -> bool {
        #[cfg(target_os = "windows")]
        {
            match permission {
                Permission::AccessRegistry => true,
                Permission::AccessUserDefaults => false,
                _ => true,
            }
        }

        #[cfg(target_os = "macos")]
        {
            match permission {
                Permission::AccessRegistry => false,
                Permission::AccessUserDefaults => true,
                _ => true,
            }
        }

        #[cfg(not(any(target_os = "windows", target_os = "macos")))]
        {
            match permission {
                Permission::AccessRegistry | Permission::AccessUserDefaults => false,
                _ => true,
            }
        }
    }

    pub fn is_sandbox_enabled(&self) -> bool {
        self.sandbox_enabled
    }

    pub fn is_strict_mode(&self) -> bool {
        self.strict_mode
    }
}

