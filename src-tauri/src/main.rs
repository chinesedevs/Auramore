// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod mod_manager;
mod security;
mod platform;

use mod_manager::ModManager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let mod_manager = ModManager::new();

    tauri::Builder::default()
        .manage(mod_manager)
        .invoke_handler(tauri::generate_handler![
            greet,
            get_installed_mods,
            install_mod,
            uninstall_mod,
            toggle_mod,
            get_mod_info,
            set_zoom_level,
            get_zoom_level,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn get_installed_mods(
    mod_manager: tauri::State<'_, ModManager>,
) -> Result<Vec<serde_json::Value>, String> {
    let mods = mod_manager.list_installed_mods()?;
    let json_mods: Vec<serde_json::Value> = mods
        .into_iter()
        .map(|m| {
            serde_json::json!({
                "id": m.manifest.id,
                "name": m.manifest.name,
                "author": m.manifest.author,
                "version": m.manifest.version,
                "description": m.manifest.description,
                "enabled": m.enabled,
                "installed": m.installed,
            })
        })
        .collect();
    Ok(json_mods)
}

#[tauri::command]
async fn install_mod(
    mod_path: String,
    mod_manager: tauri::State<'_, ModManager>,
) -> Result<String, String> {
    mod_manager.install_mod_from_zip(&mod_path)
}

#[tauri::command]
async fn uninstall_mod(
    mod_id: String,
    mod_manager: tauri::State<'_, ModManager>,
) -> Result<(), String> {
    mod_manager.uninstall_mod(&mod_id)
}

#[tauri::command]
async fn toggle_mod(
    _mod_id: String,
    _enabled: bool,
    _mod_manager: tauri::State<'_, ModManager>,
) -> Result<(), String> {
    // TODO: Реализовать переключение мода
    Ok(())
}

#[tauri::command]
async fn get_mod_info(
    _mod_id: String,
    _mod_manager: tauri::State<'_, ModManager>,
) -> Result<serde_json::Value, String> {
    // TODO: Реализовать получение информации о моде
    Ok(serde_json::json!({}))
}

#[tauri::command]
async fn set_zoom_level(
    app: tauri::AppHandle,
    scale: f64,
) -> Result<(), String> {
    use tauri::Manager;
    
    if let Some(window) = app.get_webview_window("main") {
        // Используем eval для установки масштаба через CSS zoom
        let script = format!("document.body.style.zoom = '{}';", scale);
        window.eval(&script)
            .map_err(|e| format!("Failed to set zoom level: {}", e))?;
    }
    Ok(())
}

#[tauri::command]
async fn get_zoom_level(
    app: tauri::AppHandle,
) -> Result<f64, String> {
    use tauri::Manager;
    
    if let Some(window) = app.get_webview_window("main") {
        // Получаем текущий масштаб через eval
        let script = r#"
            (function() {
                const zoom = parseFloat(getComputedStyle(document.body).zoom || '1');
                return zoom;
            })();
        "#;
        
        let _result = window.eval(script)
            .map_err(|e| format!("Failed to get zoom level: {}", e))?;
        
        // Результат приходит как строка, нужно распарсить
        // Для простоты возвращаем 1.0, так как eval не возвращает значение напрямую
        Ok(1.0)
    } else {
        Ok(1.0)
    }
}
