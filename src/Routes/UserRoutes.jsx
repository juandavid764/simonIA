import { Routes, Route } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { Transacciones } from "../components/DashBoard/Transacciones";
import { Estadisticas } from "../components/DashBoard/Estadisticas";
import { Configuracion } from "../components/DashBoard/Configuracion";
import { Soporte } from "../components/DashBoard/Soporte";
import { PrivacyPage } from "../components/DashBoard/PrivacyPage";

export const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/Dashboard" element={<DashboardPage />}>
        {" "}
        {/* Rutas principales */}
        <Route path="/Dashboard/transacciones" element={<Transacciones />} />
        <Route path="/Dashboard/estadisticas" element={<Estadisticas />} />
        <Route path="/Dashboard/configuracion" element={<Configuracion />} />
        <Route path="/Dashboard/soporte" element={<Soporte />} />
        {/* Subrutas de Configuración */}
        <Route
          path="/Dashboard/configuracion/profile"
          element={<Configuracion />}
        />        <Route
          path="/Dashboard/configuracion/privacy"
          element={<PrivacyPage />}
        />
        <Route index element={<Transacciones />} />
      </Route>
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  );
};
