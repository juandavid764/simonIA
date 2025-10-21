// Components, hooks and constants
import {
  CurrentSubscriptionInfo,
  CancelModal,
  PlanCard,
  BillingToggle,
  AvailableFeatures,
  LoadingState,
  usePlansLogic,
  planFeatures,
  pricing,
} from "./Plans";
import PayButton from "./PayButton";
import { Check, Crown } from "lucide-react";

const PlanesPage = () => {
  const {
    // State
    billingCycle,
    setBillingCycle,
    showCancelModal,
    setShowCancelModal,
    cancelReason,
    setCancelReason,
    isProcessing,

    // User and subscription data
    subscription,
    subscriptionLoading,
    isProUser,
    isActive,
    isTrialing,
    hasSubscription,
    planType,
    daysRemaining,
    features,

    // Wompi data
    handleCancelSubscription,
  } = usePlansLogic();

  // Mostrar loading mientras se cargan los datos
  if (subscriptionLoading) {
    return <LoadingState message="Cargando información de suscripción..." />;
  }

  return (
    <div className="min-h-screen bg-[#111B21] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <CancelModal
          showCancelModal={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          cancelReason={cancelReason}
          onCancelReasonChange={setCancelReason}
          onConfirmCancel={handleCancelSubscription}
          isProcessing={isProcessing}
        />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#25D366]">
            {hasSubscription && isProUser
              ? "Gestiona tu Suscripción"
              : "Elige tu Plan Perfecto"}
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            {hasSubscription && isProUser
              ? "Administra tu suscripción Pro y aprovecha todas las funciones"
              : "Desbloquea todo el potencial de Simon AI con nuestro plan Pro"}
          </p>
        </div>

        {/* Información de suscripción actual */}
        <CurrentSubscriptionInfo
          hasSubscription={hasSubscription}
          subscription={subscription}
          daysRemaining={daysRemaining}
          isTrialing={isTrialing}
          isActive={isActive}
          isProcessing={isProcessing}
          onCancelClick={() => setShowCancelModal(true)}
        />

        {/* Billing Toggle */}
        <BillingToggle billingCycle={billingCycle} onToggle={setBillingCycle} />

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <PlanCard
            plan="basic"
            title="Plan Básico"
            price={pricing[billingCycle].basic}
            billingCycle={billingCycle}
            isRecommended={false}
            features={planFeatures.basic}
            buttonText={
              !hasSubscription || planType === "basic"
                ? "Plan Actual"
                : "Cambiar a Básico"
            }
            buttonStyle={
              !hasSubscription || planType === "basic"
                ? "bg-gray-600 text-white cursor-not-allowed"
                : "bg-gray-500 hover:bg-gray-600 text-white"
            }
            disabled={!hasSubscription || planType === "basic"}
            isCurrentPlan={!hasSubscription || planType === "basic"}
            isProcessing={isProcessing}
          />

          <div>
            <div className="relative bg-[#1F2937] rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 border-[#FFD700] shadow-2xl shadow-[#FFD700]/20">
              {/* Badge recomendado */}
              {!isProUser && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-4 py-1 rounded-full text-sm font-bold flex items-center">
                    <Crown size={16} className="mr-1" />
                    Recomendado
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Plan Pro</h3>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-[#25D366]">
                    ${pricing[billingCycle].pro.toLocaleString()} COP
                  </span>
                  <span className="text-gray-400 ml-1">
                    /{billingCycle === "monthly" ? "mes" : "año"}
                  </span>
                </div>
                {billingCycle === "yearly" && (
                  <div className="text-[#25D366] text-sm font-semibold">
                    ¡Ahorra $19.890 COP al año!
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {planFeatures.pro.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check
                      size={20}
                      className="text-[#25D366] mr-3 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* PayButton reemplaza al botón original */}
              {isProUser && isActive ? (
                <div>
                  <button
                    className="w-full py-3 px-6 rounded-lg font-semibold bg-[#25D366] text-white cursor-not-allowed opacity-50"
                    disabled
                  >
                    Plan Activo
                  </button>
                  <div className="mt-3 text-center">
                    <span className="bg-[#25D366] text-black px-3 py-1 rounded-full text-sm font-bold">
                      Plan Actual
                    </span>
                  </div>
                </div>
              ) : (
                <PayButton billingCycle={billingCycle} pricing={pricing} />
              )}
            </div>
          </div>
        </div>

        {/* Funciones disponibles */}
        <AvailableFeatures
          hasSubscription={hasSubscription}
          features={features}
        />
      </div>
    </div>
  );
};

export default PlanesPage;
