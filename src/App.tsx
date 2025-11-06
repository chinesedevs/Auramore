import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Marketplace from "./pages/Marketplace";
import ModManager from "./pages/ModManager";
import Settings from "./pages/Settings";

function App() {
  useEffect(() => {
    // Блокируем стандартные жесты масштабирования
    const preventZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    const preventTouchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventZoom, { passive: false });
    window.addEventListener("touchmove", preventTouchZoom, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventZoom);
      window.removeEventListener("touchmove", preventTouchZoom);
    };
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/mods" element={<ModManager />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

