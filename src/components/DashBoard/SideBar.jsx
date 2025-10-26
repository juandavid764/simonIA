import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Crown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { dashboardRoot } from "../../models/NavigationTree.jsx";

// Utility function for conditional classes
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Button component
const Button = ({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-[#25D366] text-white hover:bg-[#128C7E]",
    ghost: "hover:bg-[#128C7E]/10",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    icon: "h-9 w-9",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export const Sidebar = () => {
  const { logout, hasActiveSubscription } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showChildren, setShowChildren] = useState({});
  const [activeTitle, setActiveTitle] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Efecto para expandir automáticamente el menú padre cuando estamos en una subruta
  useEffect(() => {
    const currentPath = location.pathname;

    dashboardRoot.hijos.forEach((node) => {
      const hasActiveChild = node.hijos.some(
        (child) => child.link === currentPath
      );
      if (hasActiveChild && !isCollapsed) {
        setShowChildren((prev) => ({
          ...prev,
          [node.title]: true,
        }));
      }
    });
  }, [location.pathname, isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    // Si se colapsa, cerrar todos los submenús
    if (!isCollapsed) {
      setShowChildren({});
    }
  };

  const toggleChildrenVisibility = (title) => {
    if (isCollapsed) return; // No expandir si está colapsado

    setShowChildren((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/AuthPage");
  };

  return (
    <aside
      className={cn(
        "h-screen bg-[#111B21] border-r border-[#222E35] transition-all duration-300 flex flex-col z-30",
        isCollapsed ? "w-16" : "w-64",
        "fixed md:relative top-0 left-0"
      )}
      style={{ minHeight: "100vh" }}
    >
      <div className="flex items-center justify-between p-2 sm:p-4 border-b border-[#222E35]">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg sm:text-xl text-[#25D366]">
              Simon AI
            </h1>
            {hasActiveSubscription && (
              <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent font-bold text-lg sm:text-xl">
                Pro
              </span>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "ml-auto hover:bg-[#128C7E]/10",
            isCollapsed ? "mx-auto" : ""
          )}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>{" "}
      <nav className="flex-1 py-4 sm:py-6 overflow-y-auto">
        <ul className="space-y-1 px-1 sm:px-2">
          {dashboardRoot.hijos.map((node) => {
            const isFuncionesAvanzadas = node.title === "Funciones Avanzadas";

            return (
              <li key={node.title}>
                {" "}
                {/* Nodo principal */}
                <div className="mb-1">
                  <div
                    className={cn(
                      "flex items-center p-2 sm:p-3 rounded-lg transition-colors cursor-pointer",
                      isFuncionesAvanzadas
                        ? hasActiveSubscription
                          ? "hover:bg-gradient-to-r hover:from-[#FFD700]/20 hover:to-[#FFA500]/20 hover:text-[#FFD700]"
                          : "hover:bg-gray-600/20 hover:text-gray-500 cursor-not-allowed opacity-60"
                        : "hover:bg-[#128C7E]/10 hover:text-[#25D366]",
                      // Resaltar si es el nodo activo O si estamos en una de sus subrutas
                      activeTitle === node.title ||
                        node.hijos.some(
                          (child) => location.pathname === child.link
                        ) ||
                        location.pathname === node.link
                        ? isFuncionesAvanzadas
                          ? hasActiveSubscription
                            ? "bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 text-[#FFD700]"
                            : "bg-gray-600/20 text-gray-500"
                          : "bg-[#128C7E]/20 text-[#25D366]"
                        : isFuncionesAvanzadas
                        ? hasActiveSubscription
                          ? "text-[#FFD700]"
                          : "text-gray-500"
                        : "text-gray-300",
                      isCollapsed ? "justify-center" : "justify-between"
                    )}
                    onClick={() => {
                      setActiveTitle(node.title);
                      if (node.hijos.length > 0) {
                        if (isCollapsed) {
                          // Si está colapsado y tiene hijos, expandir el sidebar
                          setIsCollapsed(false);
                          // Después de expandir, mostrar los hijos
                          setTimeout(() => {
                            setShowChildren((prev) => ({
                              ...prev,
                              [node.title]: true,
                            }));
                          }, 100);
                        } else {
                          toggleChildrenVisibility(node.title);
                        }
                      }
                    }}
                  >
                    <NavLink
                      to={node.link}
                      className="flex items-center flex-1"
                      onClick={(e) => {
                        // Si es Funciones Avanzadas y no tiene suscripción, prevenir navegación
                        if (isFuncionesAvanzadas && !hasActiveSubscription) {
                          e.preventDefault();
                          return;
                        }

                        if (node.hijos.length > 0) {
                          if (isCollapsed) {
                            // Si está colapsado y tiene hijos, prevenir navegación para expandir primero
                            e.preventDefault();
                          } else if (!isCollapsed) {
                            // Si no está colapsado y tiene hijos, prevenir navegación para mostrar submenú
                            e.preventDefault();
                          }
                        }
                      }}
                    >
                      {node.icon && (
                        <node.icon size={20} className="flex-shrink-0" />
                      )}
                      {!isCollapsed && (
                        <span className="ml-2 sm:ml-3 font-medium text-xs sm:text-base">
                          {node.title}
                        </span>
                      )}
                    </NavLink>

                    {/* Indicador de expansión */}
                    {!isCollapsed &&
                      node.hijos.length > 0 &&
                      (showChildren[node.title] ? (
                        <ChevronDown size={16} className="text-white" />
                      ) : (
                        <ChevronRight size={16} className="text-white" />
                      ))}
                  </div>

                  {/* Submenús */}
                  {!isCollapsed &&
                    showChildren[node.title] &&
                    node.hijos.length > 0 && (
                      <div className="ml-4 mt-1 bg-[#0F1419] rounded-lg border border-[#222E35]/50">
                        {node.hijos.map((subItem) => (
                          <NavLink
                            key={subItem.title}
                            to={subItem.link}
                            className={({ isActive }) =>
                              cn(
                                "flex items-center p-2 sm:p-3 rounded-lg transition-colors text-sm",
                                "hover:bg-[#128C7E]/10 hover:text-[#25D366]",
                                isActive || activeTitle === subItem.title
                                  ? "bg-[#128C7E]/15 text-[#25D366]"
                                  : "text-gray-400"
                              )
                            }
                            onClick={() => setActiveTitle(subItem.title)}
                          >
                            {subItem.icon && (
                              <subItem.icon
                                size={16}
                                className="flex-shrink-0"
                              />
                            )}
                            <span className="ml-2 font-medium">
                              {subItem.title}
                            </span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-2 sm:p-4 border-t border-[#222E35] md:mt-auto mt-4 mb-2 sm:mb-4">
        {/* Botón Pasar a Pro - Solo se muestra si NO tiene suscripción activa */}
        {!hasActiveSubscription && (
          <button
            onClick={() => navigate("/Dashboard/planes")}
            className={cn(
              "w-full flex items-center p-2 sm:p-3 rounded-lg transition-colors mb-2",
              "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFA500] hover:to-[#FF8C00]",
              "font-semibold shadow-lg hover:shadow-xl transform hover:scale-105",
              isCollapsed ? "justify-center" : ""
            )}
          >
            <Crown size={20} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="ml-2 sm:ml-3 font-bold text-xs sm:text-base">
                Pasar a Pro
              </span>
            )}
          </button>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center p-2 sm:p-3 rounded-lg transition-colors",
            "hover:bg-[#128C7E]/10 text-gray-300 hover:text-[#25D366]",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="ml-2 sm:ml-3 font-medium text-xs sm:text-base">
              Cerrar Sesión
            </span>
          )}
        </button>
        {!isCollapsed && (
          <div className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-4">
            Simon AI v1.0
          </div>
        )}
      </div>
    </aside>
  );
};
