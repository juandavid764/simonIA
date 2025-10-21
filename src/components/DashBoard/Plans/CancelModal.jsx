import { AlertTriangle, X, Loader } from "lucide-react";

const CancelModal = ({
  showCancelModal,
  onClose,
  cancelReason,
  onCancelReasonChange,
  onConfirmCancel,
  isProcessing,
}) => (
  <div
    className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
      showCancelModal ? "" : "hidden"
    }`}
  >
    <div className="bg-[#1F2937] rounded-2xl p-6 max-w-md w-full mx-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Cancelar Suscripción</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="mb-4">
        <AlertTriangle className="text-yellow-500 mx-auto mb-2" size={48} />
        <p className="text-gray-300 text-center mb-4">
          ¿Estás seguro de que quieres cancelar tu suscripción? Perderás acceso
          a las funciones Pro al final del período actual.
        </p>

        <label className="block text-gray-300 mb-2">
          Motivo de cancelación (opcional):
        </label>
        <textarea
          value={cancelReason}
          onChange={(e) => onCancelReasonChange(e.target.value)}
          className="w-full bg-[#374151] text-white p-3 rounded-lg border border-gray-600 focus:border-[#25D366] focus:outline-none"
          rows={3}
          placeholder="Ayúdanos a mejorar..."
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
          disabled={isProcessing}
        >
          Mantener Suscripción
        </button>
        <button
          onClick={onConfirmCancel}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader className="animate-spin" size={16} />
          ) : (
            "Cancelar"
          )}
        </button>
      </div>
    </div>
  </div>
);

export default CancelModal;

