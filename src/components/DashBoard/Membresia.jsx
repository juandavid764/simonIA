import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  checkActiveSubscription,
  cancelSubscription,
} from "../../supabase/subscriptions";
import {
  Calendar,
  CreditCard,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
} from "lucide-react";

export const Membresia = () => {
  const { user, hasActiveSubscription } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const data = await checkActiveSubscription(user.id);
        setSubscriptionData(data.subscription);
        setError(null);
      } catch (err) {
        console.error("Error obteniendo datos de suscripción:", err);
        setError("Error al cargar los datos de suscripción");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user?.id]);

  const handleCancelSubscription = async () => {
    if (!user?.id) return;

    try {
      setCanceling(true);
      const result = await cancelSubscription(user.id);

      if (result.success) {
        // Actualizar los datos locales
        const updatedData = await checkActiveSubscription(user.id);
        setSubscriptionData(updatedData.subscription);
        setShowCancelModal(false);
        // Recargar la página para actualizar el estado global
        window.location.reload();
      } else {
        setError(result.error || "Error al cancelar la suscripción");
      }
    } catch (err) {
      console.error("Error cancelando suscripción:", err);
      setError("Error al cancelar la suscripción");
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-400";
      case "canceled":
        return "text-red-400";
      case "inactive":
        return "text-gray-400";
      case "paused":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "canceled":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "inactive":
        return <XCircle className="w-5 h-5 text-gray-400" />;
      case "paused":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-[#222E35] rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-600 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-600 rounded w-1/2"></div>
              <div className="h-4 bg-gray-600 rounded w-1/4"></div>
              <div className="h-4 bg-gray-600 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-[#222E35] rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Membresía</h1>
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasActiveSubscription || !subscriptionData) {
    return (
      <div className="p-6">
        <div className="bg-[#222E35] rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Membresía</h1>
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-300 mb-2">
              Sin Membresía Activa
            </h2>
            <p className="text-gray-400 mb-4">
              No tienes una suscripción activa en este momento.
            </p>
            <button
              onClick={() => (window.location.href = "/Dashboard/planes")}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-6 py-2 rounded-lg font-semibold hover:from-[#FFA500] hover:to-[#FF8C00] transition-all"
            >
              Ver Planes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-[#222E35] rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Membresía</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estado de la Suscripción */}
          <div className="bg-[#111B21] rounded-lg p-4 border border-[#333E45]">
            <div className="flex items-center gap-2 mb-3">
              {getStatusIcon(subscriptionData.status)}
              <h3 className="text-lg font-semibold text-white">Estado</h3>
            </div>
            <p
              className={`text-lg font-medium ${getStatusColor(
                subscriptionData.status
              )}`}
            >
              {subscriptionData.status?.charAt(0).toUpperCase() +
                subscriptionData.status?.slice(1) || "N/A"}
            </p>
          </div>

          {/* Intervalo de Cobro */}
          <div className="bg-[#111B21] rounded-lg p-4 border border-[#333E45]">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-[#25D366]" />
              <h3 className="text-lg font-semibold text-white">
                Intervalo de Cobro
              </h3>
            </div>
            <p className="text-lg font-medium text-gray-300">
              {subscriptionData.billing_interval === "monthly"
                ? "Mensual"
                : subscriptionData.billing_interval === "yearly"
                ? "Anual"
                : subscriptionData.billing_interval || "N/A"}
            </p>
          </div>

          {/* Fecha del Siguiente Cobro */}
          <div className="bg-[#111B21] rounded-lg p-4 border border-[#333E45]">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-[#25D366]" />
              <h3 className="text-lg font-semibold text-white">
                Próximo Cobro
              </h3>
            </div>
            <p className="text-lg font-medium text-gray-300">
              {formatDate(subscriptionData.next_billing_date)}
            </p>
          </div>

          {/* Email del Cliente */}
          <div className="bg-[#111B21] rounded-lg p-4 border border-[#333E45]">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-[#25D366]" />
              <h3 className="text-lg font-semibold text-white">
                Email Asociado
              </h3>
            </div>
            <p className="text-lg font-medium text-gray-300">
              {subscriptionData.customer_email || "N/A"}
            </p>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mt-6 bg-[#111B21] rounded-lg p-4 border border-[#333E45]">
          <h3 className="text-lg font-semibold text-white mb-4">
            Información Adicional
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Fecha de Inicio</p>
              <p className="text-gray-300">
                {formatDate(subscriptionData.start_date)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Último Pago</p>
              <p className="text-gray-300">
                {formatDate(subscriptionData.last_payment_date)}
              </p>
            </div>
          </div>
        </div>

        {/* Botón de Cancelar Suscripción */}
        {subscriptionData.status !== "canceled" &&
          subscriptionData.status !== "inactive" && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Cancelar Membresía
              </button>
            </div>
          )}
      </div>

      {/* Modal de Confirmación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#222E35] rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">
                Cancelar Membresía
              </h3>
            </div>

            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que quieres cancelar tu membresía?n Esta acción
              no se puede deshacer.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={canceling}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {canceling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Cancelando...
                  </>
                ) : (
                  "Sí, Cancelar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
