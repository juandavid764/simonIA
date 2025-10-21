import { Loader } from "lucide-react";

const LoadingState = ({
  message = "Cargando información de suscripción...",
}) => (
  <div className="min-h-screen bg-[#111B21] text-white p-6 flex items-center justify-center">
    <div className="text-center">
      <Loader className="animate-spin mx-auto mb-4" size={48} />
      <p className="text-xl">{message}</p>
    </div>
  </div>
);

export default LoadingState;

