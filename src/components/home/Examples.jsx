import { motion } from 'framer-motion';

const examples = [
  {
    user: "Ayer compré unos audífonos Xiaomi por 82.000",
    bot: "🔴 Gasto registrado\n📅 Fecha: 11/05/2025\n🛍️ Producto: Audífonos Xiaomi\n💰 Monto: $82.000\n📂 Categoría: Tecnología\n\n✅ ¡Excelente registro! Sigues mejorando en el control de tus finanzas 💪",
  },
  {
    user: "¿Cómo puedo ahorrar más dinero?",
    bot: "🟢 Ingreso registrado\n📅 2025-05-12\n📄 Pago por explicar matemáticas\n💰 $100.000\n\n¡Sigue así! Cada ingreso suma al control de tus finanzas",
  },
  {
    user: "¿Me puedes dar el reporte de mayo?",
bot: "📊 Reporte de Mayo 2025\nGenerado el 12/05/2025\n\n¡Hola, Juan David! 👋 Aquí tienes tu resumen de mayo:\n\n🟢 Ingresos Totales: $4,200,000\n🔴 Gastos Totales: $3,850,000\n\n📌 Balance Final\n$350,000 (🟢 Ingresos Totales - 🔴 Gastos Totales)\n\n🧾 Gastos por Categoría\n🍔 Comida: $1,200,000 (31%)\n💡 Servicios: $400,000 (10%)\n🛍 Compras: $650,000 (17%)\n🏠 Vivienda: $1,300,000 (34%)\n🚌 Transporte: $200,000 (5%)\n🎭 Ocio: $100,000 (3%)\n\n💡 Recomendaciones\nVerifica los gastos en comida y vivienda.\nEvalúa si puedes reducir compras no esenciales.\n¿Quieres que te ayude a crear un presupuesto optimizado?\n\n¡Estoy aquí para ayudarte! 😊",  },
];

export const Examples = () => {
  return (
    <div id="examples" style={{ minHeight: '100vh', background: '#1A202C', padding: '2rem 0' }}> {/* Fondo oscuro */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#25D366', textAlign: 'center' }}>
            Ejemplos de Uso
          </h2>
          <p style={{ marginTop: '0.5rem', fontSize: '1.875rem', fontWeight: 'bold', color: '#25D366', textAlign: 'center' }}>
            Interacciones Reales con SimonIA
          </p>
          <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', color: '#A0AEC0', textAlign: 'center' }}>
            Descubre cómo SimonIA puede ayudarte en tu día a día con ejemplos prácticos de interacciones comunes.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-2xl">
          <div className="space-y-8">
            {examples.map((example, index) => (
              <div key={index}>
                {/* Usuario (a la derecha) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      background: '#056162', // Verde oscuro WhatsApp modo oscuro
                      color: '#fff',
                      borderRadius: '18px 18px 4px 18px',
                      padding: '0.75rem 1rem',
                      maxWidth: '320px',
                      fontSize: '1rem',
                      boxShadow: '0 1px 1px rgba(0,0,0,0.10)',
                      fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
                    }}>
                      {example.user}
                    </div>
                    <div style={{
                      marginLeft: '0.5rem',
                      width: '36px',
                      height: '36px',
                      background: '#25D366',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: '1rem',
                      border: '2px solid #fff',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                    }}>
                      Tú
                    </div>
                  </div>
                </motion.div>
                {/* Bot (a la izquierda) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.05 }}
                  style={{ display: 'flex', justifyContent: 'flex-start' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      background: '#075e54',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: '1rem',
                      border: '2px solid #fff',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                      marginRight: '0.5rem',
                    }}>
                      SI
                    </div>
                    <div style={{
                      background: '#262d31', // Burbuja bot modo oscuro
                      color: '#fff',
                      borderRadius: '18px 18px 18px 4px',
                      padding: '0.75rem 1rem',
                      maxWidth: '320px',
                      fontSize: '1rem',
                      boxShadow: '0 1px 1px rgba(0,0,0,0.10)',
                      fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {example.bot}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}