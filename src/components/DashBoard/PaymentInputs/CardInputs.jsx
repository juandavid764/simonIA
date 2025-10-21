import React from "react";

const CardInputs = ({ cardData, onCardChange, errors = {} }) => {
  // Chapeto carreando el formateo
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">Datos de la tarjeta</h4>

      {/* Número de tarjeta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de tarjeta
        </label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={formatCardNumber(cardData.number)}
          onChange={(e) =>
            onCardChange("number", e.target.value.replace(/\s/g, ""))
          }
          maxLength="19"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
            errors.number
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[#25D366]"
          }`}
        />
        {errors.number && (
          <p className="text-red-500 text-sm mt-1">{errors.number}</p>
        )}
      </div>

      {/* Fecha de expiración y CVC */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mes
          </label>
          <input
            type="text"
            placeholder="06"
            value={cardData.exp_month}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 2) onCardChange("exp_month", value);
            }}
            maxLength="2"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.exp_month
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-[#25D366]"
            }`}
          />
          {errors.exp_month && (
            <p className="text-red-500 text-xs mt-1">{errors.exp_month}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año
          </label>
          <input
            type="text"
            placeholder="29"
            value={cardData.exp_year}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 2) onCardChange("exp_year", value);
            }}
            maxLength="2"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.exp_year
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-[#25D366]"
            }`}
          />
          {errors.exp_year && (
            <p className="text-red-500 text-xs mt-1">{errors.exp_year}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVC
          </label>
          <input
            type="text"
            placeholder="123"
            value={cardData.cvc}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 4) onCardChange("cvc", value);
            }}
            maxLength="4"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              errors.cvc
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-[#25D366]"
            }`}
          />
          {errors.cvc && (
            <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
          )}
        </div>
      </div>

      {/* Nombre del titular */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del titular
        </label>
        <input
          type="text"
          placeholder="Pedro Pérez"
          value={cardData.card_holder}
          onChange={(e) => onCardChange("card_holder", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
            errors.card_holder
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[#25D366]"
          }`}
        />
        {errors.card_holder && (
          <p className="text-red-500 text-sm mt-1">{errors.card_holder}</p>
        )}
      </div>
    </div>
  );
};

export default CardInputs;
