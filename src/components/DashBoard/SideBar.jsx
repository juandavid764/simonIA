import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart2,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

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

// Create navigation items
const sidebarItems = [
  { name: "Transacciones", path: "/Dashboard/transacciones", icon: Activity },
  { name: "Estadisticas", path: "/Dashboard/estadisticas", icon: BarChart2 },
  { name: "Configuracion", path: "/Dashboard/configuracion", icon: Settings },
  { name: "Soporte", path: "/Dashboard/soporte", icon: HelpCircle },
];

export const Sidebar = () => {
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
      style={{ minHeight: '100vh' }}
    >
      <div className="flex items-center justify-between p-2 sm:p-4 border-b border-[#222E35]">
        {!isCollapsed && (
          <h1 className="font-bold text-lg sm:text-xl text-[#25D366]">Simon AI</h1>
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
      </div>

      <nav className="flex-1 py-4 sm:py-6 overflow-y-auto">
        <ul className="space-y-2 px-1 sm:px-2">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-2 sm:p-3 rounded-lg transition-colors",
                    "hover:bg-[#128C7E]/10",
                    "hover:text-[#25D366]",
                    isActive
                      ? "bg-[#128C7E]/20 text-[#25D366]"
                      : "text-gray-300",
                    isCollapsed ? "justify-center" : ""
                  )
                }
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-2 sm:ml-3 font-medium text-xs sm:text-base">{item.name}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-2 sm:p-4 border-t border-[#222E35] md:mt-auto mt-4 mb-2 sm:mb-4">
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
            <span className="ml-2 sm:ml-3 font-medium text-xs sm:text-base">Cerrar Sesión</span>
          )}
        </button>
        {!isCollapsed && (
          <div className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-4">Simon AI v1.0</div>
        )}
      </div>
    </aside>
  );
};
