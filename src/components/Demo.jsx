import { useState } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import ReactPlayer from 'react-player';

const demoResponses = {
  "hola": "¡Hola! Soy SimonIA, tu asistente financiero. ¿En qué puedo ayudarte hoy?",
  "presupuesto": "Para crear un presupuesto, necesito saber tus ingresos mensuales y gastos fijos. ¿Te gustaría que te guíe en el proceso?",
  "inversiones": "Basado en tu perfil, te recomiendo comenzar con inversiones de bajo riesgo como fondos indexados. ¿Te gustaría conocer más detalles?",
  "gastos": "Puedo ayudarte a analizar tus gastos. ¿Quieres que revisemos tus categorías de gasto o prefieres establecer un límite mensual?",
  "default": "Lo siento, no entiendo tu pregunta. ¿Podrías reformularla? Puedo ayudarte con presupuestos, inversiones, gastos y más.",
};

export default function Demo() {
  return (
    <div id="demo" className="py-16 md:py-24" style={{ backgroundColor: '#1A202C' }}> {/* bg-simon-light */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#D69E2E' }}> {/* text-base font-semibold leading-7 text-simon-gold */}
              Demo
            </h2>
            <p style={{ marginTop: '0.5rem', fontSize: '1.875rem', fontWeight: 'bold', color: '#1A202C' }}> {/* mt-2 text-3xl font-bold tracking-tight text-simon-dark */}
              Prueba SimonIA Ahora
            </p>
            <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', color: '#38A169' }}> {/* mt-6 text-lg leading-8 text-simon-green */}
              Experimenta cómo funciona SimonIA en tiempo real. Mira el siguiente video para aprender más.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <div className="relative rounded-2xl bg-simon-light p-6 shadow-lg ring-1 ring-simon-green/20">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> {/* Increased height to 100vh for full viewport height */}
              <ReactPlayer
                url="https://youtube.com/shorts/GThwl8XdtoE?si=TCVNHoBiWVhesfrj"
                controls
                width="100%" // Responsive width for all devices
                height="100%" // Adjusted height for better visibility on both mobile and desktop
                style={{ maxWidth: '360px', maxHeight: '640px', borderRadius: '1rem', overflow: 'hidden' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}