import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Asistencia Financiera 24/7',
    description: 'Obtén respuestas a tus preguntas financieras en cualquier momento del día, sin necesidad de esperar a horarios de oficina.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Gestión de Gastos',
    description: 'Registra y categoriza tus gastos automáticamente, recibiendo insights sobre tus patrones de consumo.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Reportes mensuales',
    description: 'Recibe reportes mensuales sobre tus finanzas, incluyendo análisis de gastos, ahorros y recomendaciones personalizadas.',
    icon: ChartBarIcon,
  },
];

// Adjusted colors to match the palette used in other components
export default function WhatIs() {
  return (
    <div id="what-is" className="py-16 md:py-24" style={{ backgroundColor: '#1A202C' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#F6E05E' }}>
              ¿Qué es SimonIA?
            </h2>
            <p style={{ marginTop: '0.5rem', fontSize: '1.875rem', fontWeight: 'bold', color: '#F7FAFC' }}>
              Tu Asistente Financiero Inteligente
            </p>
            <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', color: '#A0AEC0' }}>
              SimonIA es un chatbot financiero avanzado que utiliza inteligencia artificial para ayudarte
              a tomar mejores decisiones financieras y mantener el control de tus finanzas personales.
            </p>
          </motion.div>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7" style={{ color: '#F6E05E' }}>
                  <feature.icon className="h-5 w-5 flex-none" style={{ color: '#F6E05E' }} aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7" style={{ color: '#A0AEC0' }}>
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}