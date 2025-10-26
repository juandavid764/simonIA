import { createContext, useContext, useState, useEffect } from "react";
import { checkActiveSubscription } from "../supabase/subscriptions.js";

const AuthContext = createContext();

// Storage key for user data
const USER_STORAGE_KEY = "simonIA_user";
const USER_EXPIRY_KEY = "simonIA_user_expiry";

// Set expiry time (7 days in milliseconds)
const EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  // Check if stored user data is expired
  const isUserDataExpired = () => {
    const expiry = localStorage.getItem(USER_EXPIRY_KEY);
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  };

  // Load user from localStorage on app initialization
  useEffect(() => {
    const loadUserAndSubscription = async () => {
      try {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (savedUser && !isUserDataExpired()) {
          const userData = JSON.parse(savedUser);
          setUser(userData);

          // Consultar suscripción activa
          const subscriptionData = await checkActiveSubscription(userData.id);
          setHasActiveSubscription(subscriptionData.hasActiveSubscription);
        } else {
          // Clear expired data
          localStorage.removeItem(USER_STORAGE_KEY);
          localStorage.removeItem(USER_EXPIRY_KEY);
        }
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
        // Clear corrupted data
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(USER_EXPIRY_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndSubscription();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_EXPIRY_KEY);
  };

  const signIn = async (userData) => {
    setUser(userData);
    try {
      const expiry = Date.now() + EXPIRY_TIME;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem(USER_EXPIRY_KEY, expiry.toString());

      // Consultar suscripción activa al iniciar sesión
      const subscriptionData = await checkActiveSubscription(userData.id);
      setHasActiveSubscription(subscriptionData.hasActiveSubscription);
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
    }
  };

  // Function to refresh user session (reset expiry)
  const refreshSession = () => {
    if (user) {
      try {
        const expiry = Date.now() + EXPIRY_TIME;
        localStorage.setItem(USER_EXPIRY_KEY, expiry.toString());
      } catch (error) {
        console.error("Error refreshing session:", error);
      }
    }
  };

  // update user data in localStorage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        const expiry = Date.now() + EXPIRY_TIME;
        localStorage.setItem(USER_EXPIRY_KEY, expiry.toString());
      } catch (error) {
        console.error("Error updating user data in localStorage:", error);
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        setUser,
        user,
        logout,
        signIn,
        loading,
        refreshSession,
        hasActiveSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
