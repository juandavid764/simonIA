import React from "react";
import { X } from "lucide-react";

const NequiVerification = ({ onVerify, onCancel, onClose }) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Verifica tu cuenta</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col items-center">
        {/* Icon/Image */}
        <div className="mb-6">
          <img
            src="/nequi_verification.jpg"
            alt="Verificación de Nequi"
            className="w-64 h-64 object-contain rounded-lg"
          />
        </div>

        {/* Text */}
        <div className="text-center mb-8">
          <p className="text-gray-700 text-lg mb-2">
            Por favor, abre tu aplicación de Nequi y acepta la solicitud de
            suscripción que te hemos enviado.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar suscripción
          </button>
          <button
            onClick={onVerify}
            className="flex-1 py-3 px-6 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#128C7E] transition-colors shadow-lg"
          >
            Verificar
          </button>
        </div>

        {/* Additional info */}
        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-[#25D366] hover:underline text-sm font-medium"
          >
            MÁS INFORMACIÓN
          </a>
        </div>
      </div>
    </div>
  );
};

export default NequiVerification;
