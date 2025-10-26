import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export const FuncionesAvanzadas = () => {
  const { hasActiveSubscription } = useAuth();

  // Si no tiene suscripción activa, redirigir a planes
  if (!hasActiveSubscription) {
    return <Navigate to="/Dashboard/planes" replace />;
  }

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
        <h1 className="text-4xl font-bold mb-4">Funciones Avanzadas</h1>
        <p className="text-2xl text-white">
          Aquí podras encontrar todo lo que ofrece nuestro plan pro en su maxima
          potencia
        </p>
      </div>
    </div>
  );
};
