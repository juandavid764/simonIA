import { motion } from 'framer-motion';

const examples = [
  {
    user: "Según tu reporte de mayo 2025:",
    bot: "💰 Ingresos: $465,600\n🧾 Gastos: $186,959.97\n✅ Saldo actual: $278,640.03 (¡un superávit excelente! 🎉)\n\n### Detalle clave:\n- Tu mayor gasto fue en 🍔 Comida ($84,380) y 💡 Servicios ($80,140).\n- El resto de categorías están muy controladas.\n\n¿Quieres ayuda para planear qué hacer con ese saldo? 😊 Por ejemplo, ¿ahorrar, invertir o pagar deudas?",
  },
  {
    user: "¿Cómo puedo ahorrar más dinero?",
    bot: "💡 Analizando tus gastos, aquí tienes algunas ideas para ahorrar hasta $500 mensuales: \n1️⃣ Reduce las suscripciones no utilizadas ($150). \n2️⃣ 🛒 Optimiza tus compras de supermercado ($200). \n3️⃣ 🚍 Usa el transporte público 2 días por semana ($150). \n¡Tú puedes lograrlo! 💪😊",
  },
  {
    user: "¿Me puedes dar el reporte de mayo?",
    bot: "📊 Resumen Mayo 2025\n💰 Ingresos: $465,600\n🧾 Gastos: $186,959.97\n✅ Superávit: $278,640.03\n\n### Gastos Principales:\n🍔 Comida: $84,380 (45%)\n💡 Servicios: $80,140 (43%)\n\n### Observaciones:\n⚠ Comida + Servicios = $164,520 (88% de gastos).\n✅ Salud y educación: $0.\n\n¿Analizamos cómo reducir gastos o invertir? 😊",
  },
];

export default function Examples() {
  return (
    <div id="examples" className="md:py-0  bg-[#1A202C]"> {/* bg-simon-dark */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#38A169' }}> {/* text-base font-semibold text-simon-green */}
              Ejemplos de Uso
            </h2>
            <p style={{ marginTop: '0.5rem', fontSize: '1.875rem', fontWeight: 'bold', color: '#A0AEC0' }}> {/* mt-2 text-3xl font-bold text-simon-light */}
              Interacciones Reales con SimonIA
            </p>
            <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', color: '#D69E2E' }}> {/* mt-6 text-lg text-simon-accent */}
              Descubre cómo SimonIA puede ayudarte en tu día a día con ejemplos prácticos
              de interacciones comunes.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <div className="space-y-8">
            {examples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-2xl p-6 shadow-lg ring-1" style={{ backgroundColor: '#2D3748', borderColor: '#4A5568' }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4A5568' }} >
                      <span className="text-white font-semibold">Tú</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium" style={{ color: '#E2E8F0' }}>{example.user}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#718096' }}>
                      <span className="text-white font-semibold">SI</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm" style={{ color: '#CBD5E0' }}>{example.bot}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}