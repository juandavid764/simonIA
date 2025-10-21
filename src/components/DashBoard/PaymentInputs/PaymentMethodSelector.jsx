import React from "react";
import { CreditCard, Smartphone } from "lucide-react";

const PaymentMethodSelector = ({ paymentMethod, onPaymentMethodChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Método de pago
      </label>

      <div className="space-y-3">
        {/* Tarjeta */}
        <label
          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all ${
            paymentMethod === "card"
              ? "border-[#25D366] bg-green-50"
              : "border-gray-200 hover:border-[#25D366]"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="mr-4 w-4 h-4 text-[#25D366] focus:ring-[#25D366]"
          />
          <CreditCard className="w-6 h-6 mr-3 text-gray-600" />
          <span className="flex-1 font-medium">Tarjeta de crédito/débito</span>
          <div className="flex space-x-2">
            <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
              VISA
            </div>
            <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
              MC
            </div>
            <div className="w-8 h-5 bg-blue-400 rounded text-white text-xs flex items-center justify-center font-bold">
              AE
            </div>
          </div>
        </label>

        {/* Nequi */}
        <label
          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all ${
            paymentMethod === "nequi"
              ? "border-[#25D366] bg-green-50"
              : "border-gray-200 hover:border-[#25D366]"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="nequi"
            checked={paymentMethod === "nequi"}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="mr-4 w-4 h-4 text-[#25D366] focus:ring-[#25D366]"
          />
          <Smartphone className="w-6 h-6 mr-3 text-purple-600" />
          <span className="flex-1 font-medium">Nequi</span>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
