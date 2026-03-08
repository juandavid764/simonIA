import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { checkActiveSubscription } from "../supabase/subscriptions.js";

const AuthContext = createContext();

const USER_STORAGE_KEY = "simonIA_user";
const USER_EXPIRY_KEY = "simonIA_user_expiry";
const EXPIRY_TIME_MS = 7 * 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const isUserDataExpired = useCallback(() => {
    const expiry = localStorage.getItem(USER_EXPIRY_KEY);
    if (!expiry) return true;
    return Date.now() > Number(expiry);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (savedUser && !isUserDataExpired()) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);

          const subscriptionData = await checkActiveSubscription(parsedUser.id);
          setHasActiveSubscription(subscriptionData.hasActiveSubscription);
        } else {
          localStorage.removeItem(USER_STORAGE_KEY);
          localStorage.removeItem(USER_EXPIRY_KEY);
        }
      } catch (error) {
        console.error("Error loading user session:", error);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(USER_EXPIRY_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [isUserDataExpired]);

  const logout = useCallback(() => {
    setUser(null);
    setHasActiveSubscription(false);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_EXPIRY_KEY);
  }, []);

  const signIn = useCallback(async (userData) => {
    if (!userData?.id) return;

    setUser(userData);

    try {
      const expiry = Date.now() + EXPIRY_TIME_MS;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem(USER_EXPIRY_KEY, expiry.toString());

      const subscriptionData = await checkActiveSubscription(userData.id);
      setHasActiveSubscription(subscriptionData.hasActiveSubscription);
    } catch (error) {
      console.error("Error saving user session:", error);
      setHasActiveSubscription(false);
    }
  }, []);

  const refreshSession = useCallback(() => {
    if (!user) return;

    try {
      const expiry = Date.now() + EXPIRY_TIME_MS;
      localStorage.setItem(USER_EXPIRY_KEY, expiry.toString());
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  }, [user]);

  const updateUserInContext = useCallback((nextValue) => {
    setUser((prev) =>
      typeof nextValue === "function" ? nextValue(prev) : nextValue
    );
  }, []);

  useEffect(() => {
    if (!user) return;

    try {
      const expiry = Date.now() + EXPIRY_TIME_MS;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(USER_EXPIRY_KEY, expiry.toString());
    } catch (error) {
      console.error("Error updating stored user:", error);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        setUser: updateUserInContext,
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
