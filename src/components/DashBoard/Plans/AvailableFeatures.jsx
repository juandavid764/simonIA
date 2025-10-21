import { Star } from "lucide-react";

const AvailableFeatures = ({ hasSubscription, features }) => {
  if (!hasSubscription) return null;

  const featureList = [
    {
      key: "unlimitedTransactions",
      label: "Transacciones Ilimitadas",
      enabled: features.unlimitedTransactions,
    },
    {
      key: "advancedAnalytics",
      label: "Análisis Avanzado con IA",
      enabled: features.advancedAnalytics,
    },
    {
      key: "predictions",
      label: "Predicciones Financieras",
      enabled: features.predictions,
    },
    {
      key: "prioritySupport",
      label: "Soporte Prioritario 24/7",
      enabled: features.prioritySupport,
    },
  ];

  return (
    <div className="bg-[#1F2937] rounded-2xl p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Star className="text-[#FFD700] mr-2" />
        Funciones Disponibles
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {featureList.map((feature) => (
          <div key={feature.key} className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-3 ${
                feature.enabled ? "bg-green-500" : "bg-gray-500"
              }`}
            />
            <span className={feature.enabled ? "text-white" : "text-gray-400"}>
              {feature.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableFeatures;

