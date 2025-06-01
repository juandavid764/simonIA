import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Storage key for user data
const USER_STORAGE_KEY = 'simonIA_user';
const USER_EXPIRY_KEY = 'simonIA_user_expiry';

// Set expiry time (7 days in milliseconds)
const EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if stored user data is expired
  const isUserDataExpired = () => {
    const expiry = localStorage.getItem(USER_EXPIRY_KEY);
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  };

  // Load user from localStorage on app initialization
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      
      if (savedUser && !isUserDataExpired()) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('User loaded from localStorage:', userData.nombre);
      } else {
        // Clear expired data
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(USER_EXPIRY_KEY);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(USER_EXPIRY_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_EXPIRY_KEY);
    console.log('User logged out and localStorage cleared');
  };

  const signIn = (userData) => {
    setUser(userData);
    try {
      const expiry = Date.now() + EXPIRY_TIME;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem(USER_EXPIRY_KEY, expiry.toString());
      console.log('User signed in and saved to localStorage:', userData.nombre);
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  // Function to refresh user session (reset expiry)
  const refreshSession = () => {
    if (user) {
      try {
        const expiry = Date.now() + EXPIRY_TIME;
        localStorage.setItem(USER_EXPIRY_KEY, expiry.toString());
        console.log('User session refreshed');
      } catch (error) {
        console.error('Error refreshing session:', error);
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
        console.log('User data updated in localStorage:', user.nombre);
      } catch (error) {
        console.error('Error updating user data in localStorage:', error);
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      setUser,
      user, 
      logout, 
      signIn, 
      loading, 
      refreshSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);