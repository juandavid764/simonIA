import { Routes, Route } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { Transacciones } from "../components/DashBoard/Transacciones";
import { Estadisticas } from "../components/DashBoard/Estadisticas";
import { FuncionesAvanzadas } from "../components/DashBoard/FuncionesAvanzadas";
import { Configuracion } from "../components/DashBoard/Configuracion";
import { Soporte } from "../components/DashBoard/Soporte";
import { PrivacyPage } from "../components/DashBoard/PrivacyPage";
import { Membresia } from "../components/DashBoard/Membresia";
import PlanesPage from "../components/DashBoard/PlanesPage";
import BancolombiaCallbackPage from "../pages/BancolombiaCallbackPage";

export const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/Dashboard" element={<DashboardPage />}>
        {" "}
        {/* Rutas principales */}
        <Route path="/Dashboard/transacciones" element={<Transacciones />} />
        <Route path="/Dashboard/estadisticas" element={<Estadisticas />} />
        <Route path="/Dashboard/avanzadas" element={<FuncionesAvanzadas />} />
        <Route path="/Dashboard/configuracion" element={<Configuracion />} />
        <Route path="/Dashboard/soporte" element={<Soporte />} />
        <Route path="/Dashboard/planes" element={<PlanesPage />} />
        {/* Subrutas de Configuración */}
        <Route
          path="/Dashboard/configuracion/profile"
          element={<Configuracion />}
        />{" "}
        <Route
          path="/Dashboard/configuracion/privacy"
          element={<PrivacyPage />}
        />
        <Route
          path="/Dashboard/configuracion/membresia"
          element={<Membresia />}
        />
        <Route index element={<Transacciones />} />
      </Route>
      <Route
        path="/bancolombia-callback"
        element={<BancolombiaCallbackPage />}
      />
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  );
};
