import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Inicio", href: "#home" },
  { name: "¿Qué es?", href: "#what-is" },
  { name: "Ejemplos", href: "#examples" },
  { name: "Demo", href: "#demo" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
      <div className="flex lg:flex-1">
          <a href="#" className="text-2xl font-bold text-gree">
          SimonIA
        </a>
      </div>
      <div className="flex lg:hidden">
        <button
          type="button"
          className="text-simon-light p-2 rounded-md"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="hidden lg:flex lg:gap-x-12">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-sm font-semibold text-simon-light hover:text-simon-green"
          >
            {item.name}
          </a>
        ))}
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <a
          href="#register"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold shadow-md hover:bg-[#128C7E] transition-colors duration-200 text-base"
          style={{ boxShadow: '0 2px 8px 0 rgba(37,211,102,0.15)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a9.38 9.38 0 0 0-4.862-1.337C7.114 3.15 3.15 7.114 3.15 12c0 1.61.405 3.13 1.12 4.45L3 21l4.66-1.22A8.96 8.96 0 0 0 12 20.85c4.886 0 8.85-3.964 8.85-8.85 0-2.13-.747-4.09-2.001-5.613" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 11.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0Z" />
          </svg>
          Iniciar sesión
        </a>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div
            className={`fixed top-0 right-0 w-72 max-w-full h-full bg-white/10 backdrop-blur-xl border-l-4 border-simon-green text-white z-50 p-6 shadow-2xl rounded-l-2xl transition-transform duration-300 ease-in-out flex flex-col ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-simon-green drop-shadow">
                SimonIA
              </span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-simon-green hover:text-simon-gold transition" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col items-center space-y-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-lg font-semibold px-3 py-2 rounded-lg hover:bg-simon-green/80 hover:text-white transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#register"
                className="flex items-center justify-center gap-2 w-full text-center bg-[#25D366] text-white py-2 rounded-full font-bold shadow-md hover:bg-[#128C7E] transition-colors duration-200 text-base mt-4"
                style={{ boxShadow: '0 2px 8px 0 rgba(37,211,102,0.15)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a9.38 9.38 0 0 0-4.862-1.337C7.114 3.15 3.15 7.114 3.15 12c0 1.61.405 3.13 1.12 4.45L3 21l4.66-1.22A8.96 8.96 0 0 0 12 20.85c4.886 0 8.85-3.964 8.85-8.85 0-2.13-.747-4.09-2.001-5.613" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 11.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0Z" />
                </svg>
                Iniciar sesión
              </a>
            </nav>
          </div>
        </>
      )}
    </nav>
  );
}
