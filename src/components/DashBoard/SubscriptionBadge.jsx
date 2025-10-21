import { Crown, Shield, AlertTriangle, Calendar } from "lucide-react";
import { useSubscription } from "../../Hooks/useSubscription";
import { useAuth } from "../../context/AuthContext";

const SubscriptionBadge = ({ variant = "compact", showDetails = false }) => {
  const { user } = useAuth();
  const {
    subscription,
    loading,
    isProUser,
    isActive,
    isTrialing,
    hasSubscription,
    planType,
    daysRemaining,
  } = useSubscription(user?.id);

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-700 rounded-lg p-2 w-20 h-6"></div>
    );
  }

  // Variante compacta para navbar/sidebar
  if (variant === "compact") {
    return (
      <div
        className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
          isProUser && isActive
            ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black"
            : "bg-gray-600 text-gray-300"
        }`}
      >
        {isProUser && isActive ? (
          <>
            <Crown size={14} className="mr-1" />
            Pro
            {isTrialing && <span className="ml-1 text-xs">(Trial)</span>}
          </>
        ) : (
          <>
            <Shield size={14} className="mr-1" />
            Básico
          </>
        )}
      </div>
    );
  }

  // Variante detallada para dashboard
  if (variant === "detailed") {
    const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

    return (
      <div className="bg-[#1F2937] rounded-lg p-4 border border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {isProUser ? (
              <Crown className="text-[#FFD700] mr-2" size={20} />
            ) : (
              <Shield className="text-gray-400 mr-2" size={20} />
            )}
            <span className="font-semibold text-white capitalize">
              Plan {planType}
            </span>
          </div>

          {isTrialing && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
              Prueba
            </span>
          )}
        </div>

        {hasSubscription && subscription.subscription && (
          <div className="text-sm text-gray-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Estado:</span>
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="capitalize">
                  {subscription.subscription.status}
                </span>
              </div>
            </div>

            {subscription.subscription.current_period_end && (
              <div className="flex items-center justify-between">
                <span>Vence:</span>
                <div className="flex items-center">
                  {isExpiringSoon && (
                    <AlertTriangle className="text-yellow-500 mr-1" size={14} />
                  )}
                  <span
                    className={
                      isExpiringSoon ? "text-yellow-500" : "text-gray-300"
                    }
                  >
                    {new Date(
                      subscription.subscription.current_period_end
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span>Facturación:</span>
              <span className="capitalize">
                {subscription.subscription.billing_cycle === "monthly"
                  ? "Mensual"
                  : "Anual"}
              </span>
            </div>
          </div>
        )}

        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="text-xs text-gray-500">
              <p>Funciones disponibles:</p>
              <ul className="mt-1 space-y-1">
                <li
                  className={`flex items-center ${
                    isProUser ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      isProUser ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                  Transacciones{" "}
                  {isProUser ? "Ilimitadas" : "Limitadas (100/mes)"}
                </li>
                <li
                  className={`flex items-center ${
                    isProUser ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      isProUser ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                  Análisis {isProUser ? "Avanzado con IA" : "Básico"}
                </li>
                <li
                  className={`flex items-center ${
                    isProUser ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      isProUser ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                  Soporte {isProUser ? "Prioritario 24/7" : "Por Email"}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Variante banner para alertas
  if (variant === "banner") {
    const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

    if (!isExpiringSoon && isActive) return null;

    return (
      <div
        className={`rounded-lg p-4 mb-4 border ${
          !isActive
            ? "bg-red-500/20 border-red-500 text-red-300"
            : "bg-yellow-500/20 border-yellow-500 text-yellow-300"
        }`}
      >
        <div className="flex items-center">
          <AlertTriangle className="mr-3" size={20} />
          <div>
            <p className="font-semibold">
              {!isActive
                ? "Tu suscripción Pro ha expirado"
                : `Tu suscripción vence en ${daysRemaining} días`}
            </p>
            <p className="text-sm opacity-90">
              {!isActive
                ? "Renueva tu suscripción para seguir disfrutando de las funciones Pro"
                : "Considera renovar tu suscripción para no perder acceso a las funciones Pro"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SubscriptionBadge;
