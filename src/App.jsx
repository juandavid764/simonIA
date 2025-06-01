
import "./index.css";

import { useAuth } from "./context/AuthContext";
import { useSessionManager } from "./Hooks/useSessionManager";

import { BrowserRouter as Router } from "react-router-dom";

import { UserRoutes } from "./Routes/UserRoutes";
import { PublicRoutes } from "./Routes/PublicRoutes";

function App() {
  const { user, loading } = useAuth();
  
  // Automatically manage user session
  useSessionManager();

  // Show loading spinner while checking localStorage
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#25D366]"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return <Router>
    <div className="min-h-screen bg-gray-900 text-gray-900 dark:text-gray-100">
      {user ? <UserRoutes /> : <PublicRoutes />}
    </div> 
  </Router>;
}

export default App;
