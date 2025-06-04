import { Node } from "./Node.jsx";
import {
  Activity,
  BarChart2,
  Settings,
  HelpCircle,
  User,
  FileText,
} from "lucide-react";

// Datos de navegación del dashboard
const dashboardData = {
  Transacciones: [],
  Estadisticas: [],
  Configuración: [
    { "Perfil": "/Dashboard/configuracion/profile" },
    { "Privacidad": "/Dashboard/configuracion/privacy" },
    { "Soporte": "/Dashboard/soporte" }
  ]
};

// Mapeo de iconos
const iconMap = {
  // Iconos principales
  "Transacciones": Activity,
  "Estadisticas": BarChart2,
  "Configuración": Settings,
  "Soporte": HelpCircle,
  
  // Iconos de submenús - Solo Configuración
  "Perfil": User,
  "Privacidad": FileText,
  "Soporte": HelpCircle
};

// Crear el árbol de navegación del dashboard
export const dashboardRoot = new Node({ 
  title: "Dashboard", 
  link: "/Dashboard",
  icon: null
});

// Construir el árbol
for (const [parentKey, children] of Object.entries(dashboardData)) {
  // Crear nodo padre
  const linkKey = parentKey.toLowerCase();
  const parentNode = new Node({ 
    title: parentKey, 
    link: `/Dashboard/${linkKey}`,
    icon: iconMap[parentKey]
  });
  
  dashboardRoot.agregarHijo(parentNode);

  // Agregar nodos hijos
  for (const childObj of children) {
    const childTitle = Object.keys(childObj)[0];
    const childLink = childObj[childTitle];
    
    const childNode = new Node({ 
      title: childTitle, 
      link: childLink,
      icon: iconMap[childTitle]
    });
    
    parentNode.agregarHijo(childNode);
  }
}