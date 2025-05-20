
import "./index.css";

import { useAuth } from "./context/AuthContext";

import { BrowserRouter as Router } from "react-router-dom";

import { UserRoutes } from "./Routes/UserRoutes";
import { PublicRoutes } from "./Routes/PublicRoutes";

function App() {
  const { user } = useAuth();

  return <Router>
    <div className="min-h-screen bg-gray-900 text-gray-900 dark:text-gray-100">
      {user ? <UserRoutes /> : <PublicRoutes />}
    </div> 
  </Router>;
}

export default App;
