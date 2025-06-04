import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Shield, Users, Settings, AlertTriangle, Mail } from "lucide-react";

export const TermsAndConditions = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState("intro");

  const sections = [
    {
      id: "intro",
      title: "Introducción",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Bienvenido a <strong className="text-[#25D366]">Simón IA</strong>, un asistente financiero inteligente desarrollado por <strong>Juan David Trujillo</strong>.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Al utilizar nuestros servicios, usted acepta cumplir con estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, le solicitamos que no utilice el servicio.
          </p>
          <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-lg p-4">
            <p className="text-[#25D366] font-semibold">
              Fecha de última actualización: 4 de junio de 2025
            </p>
          </div>
        </div>
      )
    },
    {
      id: "service",
      title: "Descripción del Servicio",
      icon: Settings,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Simón es un chatbot financiero que funciona a través de WhatsApp y una plataforma web, diseñado para:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
            <li>Ayudar en la gestión de finanzas personales</li>
            <li>Registrar y categorizar ingresos y gastos</li>
            <li>Generar reportes y análisis automáticos</li>
            <li>Brindar recomendaciones financieras personalizadas</li>
            <li>Facilitar el control y seguimiento del presupuesto personal</li>
          </ul>
        </div>
      )
    },
    {
      id: "data",
      title: "Recopilación y Uso de Datos",
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-[#25D366] font-semibold mb-3">3.1 Información Recopilada</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Nombre y número de teléfono</li>
              <li>Datos financieros enviados por el usuario (ingresos, gastos, categorías, etc.)</li>
              <li>Historial de conversaciones con el asistente</li>
              <li>Información técnica (como tipo de dispositivo, país de conexión, etc.)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#25D366] font-semibold mb-3">3.2 Uso de la Información</h4>
            <p className="text-gray-300 mb-2">La información se utiliza para:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Brindar el servicio de gestión financiera</li>
              <li>Personalizar la experiencia del usuario</li>
              <li>Generar reportes y análisis automáticos</li>
              <li>Mejorar los modelos de inteligencia artificial</li>
              <li>Enviar notificaciones relevantes por WhatsApp</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#25D366] font-semibold mb-3">3.3 Seguridad y Almacenamiento</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Aplicamos medidas de seguridad como cifrado y control de acceso</li>
              <li>La información se almacena en servidores seguros</li>
              <li>No solicitamos ni almacenamos datos bancarios confidenciales</li>
              <li>Se realizan copias de seguridad y mantenimientos regulares</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#25D366] font-semibold mb-3">3.4 Compartir Información</h4>
            <p className="text-gray-300 mb-2">No compartimos, vendemos ni transferimos datos personales a terceros, salvo en los siguientes casos:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Por obligación legal</li>
              <li>Para proteger nuestros derechos o prevenir fraudes</li>
              <li>En caso de una futura fusión o cambio de titularidad (previo aviso al usuario)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#25D366] font-semibold mb-3">3.5 Uso Agregado de Datos</h4>
            <p className="text-gray-300 mb-2">Podemos utilizar datos anónimos y agregados para:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Analizar patrones de uso</li>
              <li>Mejorar el servicio</li>
              <li>Publicar estadísticas generales sin identificar usuarios (ej. "Los usuarios de Simón ahorran en promedio un 20% de sus ingresos mensuales")</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "rights",
      title: "Derechos del Usuario",
      icon: Users,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">Usted tiene derecho a:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
            <li>Acceder a sus datos personales</li>
            <li>Corregir información inexacta</li>
            <li>Solicitar la eliminación de su cuenta y datos</li>
            <li>Exportar sus datos en formato legible</li>
            <li>Retirar su consentimiento para el uso del servicio</li>
          </ul>
        </div>
      )
    },
    {
      id: "limitations",
      title: "Limitaciones del Servicio",
      icon: AlertTriangle,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-[#25D366] font-semibold mb-3">5.1 Versión Beta</h4>
            <p className="text-gray-300 mb-2">Simón puede encontrarse en fase beta, por lo tanto:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Puede presentar errores o limitaciones</li>
              <li>Las funcionalidades pueden modificarse sin previo aviso</li>
              <li>No se garantiza disponibilidad continua</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#25D366] font-semibold mb-3">5.2 Responsabilidad del Usuario</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Simón no reemplaza asesoría financiera profesional</li>
              <li>Usted es responsable de verificar los datos ingresados</li>
              <li>No asumimos responsabilidad por decisiones tomadas con base en las recomendaciones del asistente</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "intellectual",
      title: "Propiedad Intelectual",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Todos los derechos sobre <strong className="text-[#25D366]">Simón IA</strong>, incluyendo su código, diseño, contenido, logotipo y marca, pertenecen exclusivamente a <strong>Juan David Trujillo</strong>.
          </p>
        </div>
      )
    },
    {
      id: "changes",
      title: "Cambios en el Servicio",
      icon: Settings,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">Simón se reserva el derecho de:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
            <li>Actualizar estos términos en cualquier momento</li>
            <li>Modificar o eliminar funcionalidades</li>
            <li>Cambiar condiciones de uso o precios (con previo aviso, si aplica)</li>
          </ul>
        </div>
      )
    },
    {
      id: "termination",
      title: "Terminación del Servicio",
      icon: X,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">Podemos suspender o cancelar el acceso si:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
            <li>Se hace un uso indebido del servicio</li>
            <li>Se incumplen estos términos</li>
            <li>Existen razones legales o técnicas</li>
          </ul>
        </div>
      )
    },
    {
      id: "contact",
      title: "Contacto",
      icon: Mail,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Para cualquier duda sobre estos términos o el uso de sus datos personales, contáctenos en:
          </p>
          <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Mail className="text-[#25D366]" size={20} />
              <a 
                href="mailto:juandaviderazo2401@gmail.com" 
                className="text-[#25D366] hover:underline font-semibold"
              >
                juandaviderazo2401@gmail.com
              </a>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "acceptance",
      title: "Aceptación",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Al usar <strong className="text-[#25D366]">Simón</strong>, usted declara haber leído y aceptado estos términos y condiciones en su totalidad. Si no está de acuerdo, le solicitamos no utilizar el servicio.
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-400 font-semibold">
              ⚠️ Importante: El uso continuado del servicio constituye la aceptación de estos términos.
            </p>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#111B21] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-[#222E35]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#202C33] px-6 py-4 border-b border-[#222E35] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-[#25D366]" size={24} />
              <h2 className="text-xl font-bold text-white">Términos y Condiciones - SimonIA</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-[#25D366]/20 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex h-[calc(90vh-80px)]">
            {/* Sidebar */}
            <div className="w-80 bg-[#0B1426] border-r border-[#222E35] overflow-y-auto">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
                  Secciones
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                          activeSection === section.id
                            ? "bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30"
                            : "text-gray-300 hover:bg-[#222E35] hover:text-white"
                        }`}
                      >
                        <IconComponent size={16} className="flex-shrink-0" />
                        <span className="text-sm font-medium">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {sections
                  .filter((section) => section.id === activeSection)
                  .map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <IconComponent className="text-[#25D366]" size={28} />
                          <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                        </div>
                        {section.content}
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
