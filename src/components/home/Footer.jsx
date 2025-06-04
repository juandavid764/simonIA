import { useState } from "react";
import { FileText, Shield, Mail, Github, Heart } from "lucide-react";
import { TermsAndConditions } from "./TermsAndConditions";

export const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);

  const footerLinks = [
    {
      title: "Legal",
      links: [
        { 
          name: "Términos y Condiciones", 
          action: () => setShowTerms(true),
          icon: FileText 
        },
        { 
          name: "Política de Privacidad", 
          action: () => setShowTerms(true),
          icon: Shield 
        }
      ]
    },
    {
      title: "Contacto",
      links: [
        { 
          name: "juandaviderazo2401@gmail.com", 
          href: "mailto:juandaviderazo2401@gmail.com",
          icon: Mail 
        }
      ]
    },
    {
      title: "Recursos",
      links: [
        { 
          name: "Soporte", 
          href: "#contact",
          icon: Heart 
        }
      ]
    }
  ];

  return (
    <>
      <footer className="bg-[#0F1419] border-t border-[#222E35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-[#25D366] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <span className="text-xl font-bold text-white">SimonIA</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Tu asistente financiero inteligente que te ayuda a tomar mejores decisiones financieras 
                  y mantener el control de tus finanzas personales.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Heart size={14} className="text-red-400" />
                  <span>Desarrollado por Juan David Trujillo</span>
                </div>
              </div>

              {/* Footer Links */}
              {footerLinks.map((section, index) => (
                <div key={index} className="md:col-span-1">
                  <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => {
                      const IconComponent = link.icon;
                      return (
                        <li key={linkIndex}>
                          {link.href ? (
                            <a
                              href={link.href}
                              className="flex items-center gap-2 text-gray-400 hover:text-[#25D366] transition-colors duration-200 text-sm"
                            >
                              <IconComponent size={14} />
                              {link.name}
                            </a>
                          ) : (
                            <button
                              onClick={link.action}
                              className="flex items-center gap-2 text-gray-400 hover:text-[#25D366] transition-colors duration-200 text-sm text-left"
                            >
                              <IconComponent size={14} />
                              {link.name}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[#222E35] py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-500 text-sm">
                  © 2025 SimonIA. Todos los derechos reservados.
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  Versión 1.0 - Asistente Financiero Inteligente
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Servicio Activo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-[#0B1426] border-t border-[#222E35]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#25D366]" />
                <span className="text-gray-400 text-xs">
                  Tus datos están protegidos con cifrado de extremo a extremo
                </span>
              </div>
              <button
                onClick={() => setShowTerms(true)}
                className="text-[#25D366] hover:text-[#20B55E] text-xs underline transition-colors"
              >
                Ver Términos y Condiciones
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Terms and Conditions Modal */}
      <TermsAndConditions 
        isOpen={showTerms} 
        onClose={() => setShowTerms(false)} 
      />
    </>
  );
};
