import { useState, useEffect } from "react";
import { DoubleLinkedList } from "../../models/DoubleLinkedList";
import { 
  TrendingUp, 
  PiggyBank, 
  Target, 
  AlertTriangle, 
  DollarSign, 
  Calculator,
  ChevronLeft,
  ChevronRight,
  Lightbulb
} from "lucide-react";

export const Tips = () => {
  const [tipsList] = useState(new DoubleLinkedList());
  const [currentTip, setCurrentTip] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);

  // Financial tips data
  const financialTips = [
    {
      id: 1,
      title: "Regla del 50/30/20",
      description: "Destina 50% de tus ingresos a necesidades básicas, 30% a deseos y 20% a ahorros e inversiones.",
      icon: Calculator,
      category: "Presupuesto",
      color: "bg-blue-900/20 border-blue-700/30",
      iconColor: "text-blue-400"
    },
    {
      id: 2,
      title: "Fondo de Emergencia",
      description: "Mantén un fondo equivalente a 3-6 meses de gastos para situaciones imprevistas.",
      icon: AlertTriangle,
      category: "Seguridad",
      color: "bg-yellow-900/20 border-yellow-700/30",
      iconColor: "text-yellow-400"
    },
    {
      id: 3,
      title: "Elimina Deudas de Alto Interés",
      description: "Prioriza pagar tarjetas de crédito y préstamos con tasas altas antes de invertir.",
      icon: TrendingUp,
      category: "Deudas",
      color: "bg-red-900/20 border-red-700/30",
      iconColor: "text-red-400"
    },
    {
      id: 4,
      title: "Ahorra Automáticamente",
      description: "Programa transferencias automáticas a tu cuenta de ahorros cada mes.",
      icon: PiggyBank,
      category: "Ahorros",
      color: "bg-green-900/20 border-green-700/30",
      iconColor: "text-green-400"
    },
    {
      id: 5,
      title: "Diversifica tus Inversiones",
      description: "No pongas todo tu dinero en una sola inversión. Diversifica para reducir riesgos.",
      icon: Target,
      category: "Inversiones",
      color: "bg-purple-900/20 border-purple-700/30",
      iconColor: "text-purple-400"
    },
    {
      id: 6,
      title: "Revisa tus Gastos Mensualmente",
      description: "Analiza tus gastos cada mes para identificar áreas donde puedes ahorrar.",
      icon: DollarSign,
      category: "Control",
      color: "bg-indigo-900/20 border-indigo-700/30",
      iconColor: "text-indigo-400"
    }
  ];

  // Initialize the doubly linked list with tips
  useEffect(() => {
    financialTips.forEach(tip => {
      tipsList.append(tip);
    });

    // Set the first tip as current
    if (tipsList.head) {
      setCurrentTip(tipsList.head.value);
      setCurrentNode(tipsList.head);
    }
  }, []);

  // Navigate to next tip
  const goToNext = () => {
    if (currentNode && currentNode.next) {
      setCurrentNode(currentNode.next);
      setCurrentTip(currentNode.next.value);

    } else if (tipsList.head) {
      // Go back to first tip (circular navigation)
      setCurrentNode(tipsList.head);
      setCurrentTip(tipsList.head.value);
    }
  };

  // Navigate to previous tip
  const goToPrevious = () => {
    if (currentNode && currentNode.prev) {
      setCurrentNode(currentNode.prev);
      setCurrentTip(currentNode.prev.value);
    } else if (tipsList.tail) {
      // Go to last tip (circular navigation)
      setCurrentNode(tipsList.tail);
      setCurrentTip(tipsList.tail.value);
    }
  };

  // Jump to specific tip
  const goToTip = (tipId) => {
    let node = tipsList.head;
    while (node) {
      if (node.value.id === tipId) {
        setCurrentNode(node);
        setCurrentTip(node.value);
        break;
      }
      node = node.next;
    }
  };

  if (!currentTip) {
    return null;
  }

  const IconComponent = currentTip.icon;

  return (
    <section className="py-16 bg-[#111B21]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lightbulb className="text-[#25D366]" size={32} />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Consejos Financieros
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Descubre estrategias probadas para mejorar tu salud financiera y alcanzar tus metas económicas.
          </p>
        </div>

        {/* Main Tip Card */}
        <div className="mb-8">
          <div className={`${currentTip.color} p-8 rounded-2xl border transition-all duration-500 hover:scale-105`}>
            <div className="flex items-start gap-6">
              <div className={`p-4 rounded-xl bg-[#222E35] ${currentTip.iconColor}`}>
                <IconComponent size={32} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentTip.iconColor} bg-[#222E35]`}>
                    {currentTip.category}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {currentTip.title}
                </h3>
                
                <p className="text-gray-300 text-lg leading-relaxed">
                  {currentTip.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button
            onClick={goToPrevious}
            className="flex items-center justify-center w-12 h-12 bg-[#222E35] text-gray-400 rounded-full hover:bg-[#25D366] hover:text-[#111B21] transition-all duration-300 hover:scale-110"
            aria-label="Consejo anterior"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {currentTip.id} de {financialTips.length}
            </p>
          </div>

          <button
            onClick={goToNext}
            className="flex items-center justify-center w-12 h-12 bg-[#222E35] text-gray-400 rounded-full hover:bg-[#25D366] hover:text-[#111B21] transition-all duration-300 hover:scale-110"
            aria-label="Siguiente consejo"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Tip Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {financialTips.map((tip) => (
            <button
              key={tip.id}
              onClick={() => goToTip(tip.id)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentTip.id === tip.id
                  ? 'bg-[#25D366] scale-125'
                  : 'bg-[#222E35] hover:bg-[#25D366]/50'
              }`}
              aria-label={`Ir al consejo ${tip.id}`}
            />
          ))}
        </div>

        {/* All Tips Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financialTips.map((tip) => {
            const TipIcon = tip.icon;
            const isActive = currentTip.id === tip.id;
            
            return (
              <button
                key={tip.id}
                onClick={() => goToTip(tip.id)}
                className={`${tip.color} p-6 rounded-xl border text-left transition-all duration-300 hover:scale-105 ${
                  isActive ? 'ring-2 ring-[#25D366] scale-105' : ''
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`p-3 rounded-lg bg-[#222E35] ${tip.iconColor}`}>
                    <TipIcon size={24} />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tip.iconColor} bg-[#222E35]`}>
                    {tip.category}
                  </span>
                </div>
                
                <h4 className="text-lg font-semibold text-white mb-2">
                  {tip.title}
                </h4>
                
                <p className="text-gray-400 text-sm line-clamp-3">
                  {tip.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};