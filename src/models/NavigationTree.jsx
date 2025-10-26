import { Node } from "./Node.jsx";
import {
  Activity,
  BarChart2,
  Settings,
  HelpCircle,
  User,
  FileText,
  Zap,
  CreditCard,
} from "lucide-react";

// Datos de navegación del dashboard
const dashboardData = {
  Transacciones: [],
  Estadisticas: [],
  "Funciones Avanzadas": [],
  Configuración: [
    { Perfil: "/Dashboard/configuracion/profile" },
    { Privacidad: "/Dashboard/configuracion/privacy" },
    { Membresía: "/Dashboard/configuracion/membresia" },
    { Soporte: "/Dashboard/soporte" },
  ],
};

// Mapeo de iconos
const iconMap = {
  // Iconos principales
  Transacciones: Activity,
  Estadisticas: BarChart2,
  "Funciones Avanzadas": Zap,
  Configuración: Settings,
  Soporte: HelpCircle,

  // Iconos de submenús - Solo Configuración
  Perfil: User,
  Privacidad: FileText,
  Membresía: CreditCard,
};

// Crear el árbol de navegación del dashboard
export const dashboardRoot = new Node({
  title: "Dashboard",
  link: "/Dashboard",
  icon: null,
});

// Construir el árbol
for (const [parentKey, children] of Object.entries(dashboardData)) {
  // Crear nodo padre
  const linkKey = parentKey.toLowerCase();
  // Caso especial para "Funciones Avanzadas"
  const finalLink =
    parentKey === "Funciones Avanzadas"
      ? "/Dashboard/avanzadas"
      : `/Dashboard/${linkKey}`;

  const parentNode = new Node({
    title: parentKey,
    link: finalLink,
    icon: iconMap[parentKey],
  });

  dashboardRoot.agregarHijo(parentNode);

  // Agregar nodos hijos
  for (const childObj of children) {
    const childTitle = Object.keys(childObj)[0];
    const childLink = childObj[childTitle];

    const childNode = new Node({
      title: childTitle,
      link: childLink,
      icon: iconMap[childTitle],
    });

    parentNode.agregarHijo(childNode);
  }
}
