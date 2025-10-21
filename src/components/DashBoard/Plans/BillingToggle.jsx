const BillingToggle = ({ billingCycle, onToggle }) => (
  <div className="flex items-center justify-center mb-8">
    <span
      className={`mr-3 ${
        billingCycle === "monthly" ? "text-white" : "text-gray-400"
      }`}
    >
      Mensual
    </span>
    <button
      onClick={() =>
        onToggle(billingCycle === "monthly" ? "yearly" : "monthly")
      }
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        billingCycle === "yearly" ? "bg-[#25D366]" : "bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
    <span
      className={`ml-3 ${
        billingCycle === "yearly" ? "text-white" : "text-gray-400"
      }`}
    >
      Anual
    </span>
    {billingCycle === "yearly" && (
      <span className="ml-2 bg-[#25D366] text-black px-2 py-1 rounded-full text-xs font-bold">
        ¡Ahorra 17%!
      </span>
    )}
  </div>
);

export default BillingToggle;

