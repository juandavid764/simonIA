import { Check, Crown, Loader } from "lucide-react";

const PlanCard = ({
  plan,
  title,
  price,
  billingCycle,
  isRecommended,
  features,
  buttonText,
  buttonStyle,
  onButtonClick,
  disabled = false,
  isCurrentPlan = false,
  isProcessing = false,
}) => (
  <div
    className={`relative bg-[#1F2937] rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 ${
      isRecommended
        ? "border-[#FFD700] shadow-2xl shadow-[#FFD700]/20"
        : "border-[#374151] hover:border-[#25D366]"
    }`}
  >
    {isRecommended && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-4 py-1 rounded-full text-sm font-bold flex items-center">
          <Crown size={16} className="mr-1" />
          Recomendado
        </div>
      </div>
    )}

    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <div className="flex items-center justify-center mb-4">
        <span className="text-4xl font-bold text-[#25D366]">
          {price === 0 ? "Gratis" : `$${price.toLocaleString()} COP`}
        </span>
        {price > 0 && (
          <span className="text-gray-400 ml-1">
            /{billingCycle === "monthly" ? "mes" : "año"}
          </span>
        )}
      </div>
      {billingCycle === "yearly" && plan === "pro" && (
        <div className="text-[#25D366] text-sm font-semibold">
          ¡Ahorra $19.890 COP al año!
        </div>
      )}
    </div>

    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <Check
            size={20}
            className="text-[#25D366] mr-3 mt-0.5 flex-shrink-0"
          />
          <span className="text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>

    <button
      onClick={onButtonClick}
      disabled={disabled}
      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${buttonStyle} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } flex items-center justify-center`}
    >
      {isProcessing && onButtonClick ? (
        <Loader className="animate-spin mr-2" size={16} />
      ) : null}
      {buttonText}
    </button>

    {isCurrentPlan && (
      <div className="mt-3 text-center">
        <span className="bg-[#25D366] text-black px-3 py-1 rounded-full text-sm font-bold">
          Plan Actual
        </span>
      </div>
    )}
  </div>
);

export default PlanCard;

