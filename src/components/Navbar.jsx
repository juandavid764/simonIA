import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Inicio', href: '#home' },
  { name: '¿Qué es?', href: '#what-is' },
  { name: 'Ejemplos', href: '#examples' },
  { name: 'Demo', href: '#demo' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-opacity-90 backdrop-blur-md" style={{ backgroundColor: '#1A202C' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        <div className="flex lg:flex-1">
          <a href="#" className="text-2xl font-bold text-simon-green">
            SimonIA
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-simon-light"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menú principal</span>
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
          <a href="#register" className="px-6 py-3 rounded-lg bg-simon-green text-simon-dark">
            Comenzar
          </a>
        </div>
      </nav>
      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'}`}>
        <div className="fixed inset-0 bg-simon-dark/80" onClick={() => setMobileMenuOpen(false)} />
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-simon-light px-6 py-6 sm:ring-1 sm:ring-simon-dark/10">
          <div className="flex items-center justify-between">
            <a href="#" className="text-2xl font-bold text-simon-dark">
              SimonIA
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-simon-dark"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Cerrar menú</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-simon-green/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-simon-dark hover:bg-simon-green hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="#register"
                  className="px-6 py-3 bg-simon-gold text-white rounded-lg hover:bg-simon-green transition-colors duration-200 block text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Comenzar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}