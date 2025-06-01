import { createFeedback } from "../../supabase/feedback.js";
import { useState } from "react"; 
import { useAuth } from "../../context/AuthContext.jsx";

export const Soporte = () => {
  const { user } = useAuth();
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleFeedbackChange = (e) => {
    setFeedbackMessage(e.target.value);
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) {
      alert("Por favor, ingresa un mensaje de retroalimentación.");
      return;
    }

    try {
      await createFeedback({ user_id: user.id, message: feedbackMessage });
      alert("¡Gracias por tu retroalimentación!");
      setFeedbackMessage("");
    } catch (error) {
      console.error("Error al enviar la retroalimentación:", error);
      alert("Hubo un error al enviar tu retroalimentación. Por favor, inténtalo de nuevo más tarde.");
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#25D366]">Soporte</h2>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#111B21] p-4 sm:p-6 rounded-lg border border-[#222E35]">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Contacto</h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
              <span className="text-gray-400">Email:</span>
              <a href="mailto:juandaviderazo2401@gmail.com" className="text-[#25D366] hover:underline break-all">
                juandaviderazo2401@gmail.com
              </a>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
              <span className="text-gray-400">WhatsApp:</span>
              <a href="https://wa.me/573153250375" className="text-[#25D366] hover:underline break-all">
                +57 3153250375
              </a>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Retroalimentación</h3>
            <form>
              <textarea
                className="w-full p-2 rounded border border-[#222E35] bg-[#1A232A] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#25D366] resize-none"
                rows={4}
                placeholder="¿Que te gustaría que mejoráramos?"
                value={feedbackMessage}
                onChange={handleFeedbackChange}
              />
              <button
                onClick={handleFeedbackSubmit}
                disabled={!feedbackMessage.trim()}
                type="submit"
                className="mt-2 px-4 py-2 bg-[#25D366] text-[#111B21] font-semibold rounded hover:bg-[#1DA851] transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};