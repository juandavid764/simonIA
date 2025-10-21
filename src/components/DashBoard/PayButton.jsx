import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import PaymentModal from "./PaymentModal";
import { getMerchant } from "../../api/wompiFunctions";

export default function PayButton({ billingCycle = "monthly", pricing }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [merchantData, setMerchantData] = useState(null);
  const [isLoadingMerchant, setIsLoadingMerchant] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      alert("Debes estar autenticado para continuar");
      return;
    }

    try {
      setIsLoadingMerchant(true);

      const merchant = await getMerchant();

      setMerchantData(merchant);
      setShowModal(true);
    } catch (error) {
      console.error("Error al obtener información del merchant:", error);
      alert("Error al cargar información de pago. Por favor intenta de nuevo.");
    } finally {
      setIsLoadingMerchant(false);
    }
  };

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={isLoadingMerchant}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
          isLoadingMerchant
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FF8C00] transform hover:scale-105 shadow-lg"
        } text-black`}
      >
        {isLoadingMerchant ? "Cargando..." : "Actualizar a Pro"}
      </button>

      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        billingCycle={billingCycle}
        pricing={pricing}
        merchantData={merchantData}
      />
    </>
  );
}
