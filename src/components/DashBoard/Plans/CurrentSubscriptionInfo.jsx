import { Crown } from "lucide-react";

const CurrentSubscriptionInfo = ({
  hasSubscription,
  subscription,
  daysRemaining,
  isTrialing,
  isActive,
  isProcessing,
  onCancelClick,
}) => {
  if (!hasSubscription || !subscription.subscription) return null;

  const sub = subscription.subscription;
  const endDate = new Date(sub.current_period_end);
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

  return (
    <div className="bg-[#1F2937] rounded-2xl p-6 mb-8 border-2 border-[#25D366]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Crown className="text-[#FFD700] mr-3" size={24} />
          <h3 className="text-xl font-bold text-white">
            Tu Suscripción Actual
          </h3>
        </div>
        {isTrialing && (
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            Período de Prueba
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-sm">Plan</p>
          <p className="text-white font-semibold capitalize">{sub.plan_type}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Facturación</p>
          <p className="text-white font-semibold">
            {sub.billing_cycle === "monthly" ? "Mensual" : "Anual"}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Estado</p>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <p className="text-white font-semibold capitalize">{sub.status}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">
            {isExpiringSoon ? "⚠️ Vence pronto" : "Válida hasta"}
          </p>
          <p
            className={`font-semibold ${
              isExpiringSoon ? "text-yellow-500" : "text-white"
            }`}
          >
            {endDate.toLocaleDateString()} ({daysRemaining} días restantes)
          </p>
        </div>

        {isActive && (
          <button
            onClick={onCancelClick}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            disabled={isProcessing}
          >
            Cancelar Suscripción
          </button>
        )}
      </div>
    </div>
  );
};

export default CurrentSubscriptionInfo;

