import React from "react";

const NequiInputs = ({ nequiData, onNequiChange, errors = {} }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">Datos de Nequi</h4>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre completo
        </label>
        <input
          type="text"
          placeholder="Pedro Pérez"
          value={nequiData.name}
          onChange={(e) => onNequiChange("name", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
            errors.name
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[#25D366]"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Número de teléfono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de teléfono
        </label>
        <input
          type="text"
          placeholder="3001234567"
          value={nequiData.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 10) onNequiChange("phone", value);
          }}
          maxLength="10"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
            errors.phone
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[#25D366]"
          }`}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>
      <div>
        <label className="block text-sm  text-gray-600 mb-2">
          <span className="text-green-500">Recordatorio: </span>tendrás que
          aceptar tu suscripción en la app de Nequi
        </label>
      </div>
    </div>
  );
};

export default NequiInputs;
