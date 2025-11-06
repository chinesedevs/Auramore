import { invoke } from "@tauri-apps/api/core";

export async function getInstalledMods() {
  return await invoke<Array<any>>("get_installed_mods");
}

export async function installMod(modPath: string) {
  return await invoke<void>("install_mod", { modPath });
}

export async function uninstallMod(modId: string) {
  return await invoke<void>("uninstall_mod", { modId });
}

export async function toggleMod(modId: string, enabled: boolean) {
  return await invoke<void>("toggle_mod", { modId, enabled });
}

export async function getModInfo(modId: string) {
  return await invoke<any>("get_mod_info", { modId });
}

export async function setZoomLevel(scale: number) {
  return await invoke<void>("set_zoom_level", { scale });
}

export async function getZoomLevel() {
  return await invoke<number>("get_zoom_level");
}

