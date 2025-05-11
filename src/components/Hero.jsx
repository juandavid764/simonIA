import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div id="home" className="relative isolate pt-14 bg-[#1A202C]" > {/* bg-simon-dark */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        style={{
          background: 'linear-gradient(to top right, #38A169, #D69E2E)', /* from-simon-green to-simon-gold */
          opacity: 0.3,
          clipPath:
            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
      />

      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#38A169', letterSpacing: '-0.025em' }}> {/* text-4xl font-bold tracking-tight text-simon-green */}
                Tu Asistente Financiero en WhatsApp
              </h1>
              <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', color: '#A0AEC0' }}> {/* mt-6 text-lg text-simon-light */}
                SimonIA es tu chatbot financiero personal que te ayuda a gestionar tus finanzas, 
                responder preguntas sobre inversiones y mantener un control tu dinero.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}