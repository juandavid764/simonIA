import React from "react";
import { AlertCircle } from "lucide-react";

const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Error al cargar los planes
      </h3>
      <p className="text-gray-600 mb-4 max-w-md">
        {message ||
          "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
