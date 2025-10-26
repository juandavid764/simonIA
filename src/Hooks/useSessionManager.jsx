import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Hook to manage user session and automatically refresh it based on user activity
 */
export const useSessionManager = () => {
  const { user, refreshSession, logout } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Events that indicate user activity
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    let activityTimer;

    // Function to handle user activity
    const handleActivity = () => {
      // Clear existing timer
      if (activityTimer) {
        clearTimeout(activityTimer);
      }

      // Set new timer to refresh session after 30 minutes of activity
      activityTimer = setTimeout(() => {
        refreshSession();
      }, 30 * 60 * 1000); // 30 minutes
    };

    // Add event listeners for user activity
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, true);
    });

    // Initial activity trigger
    handleActivity();

    // Cleanup function
    return () => {
      if (activityTimer) {
        clearTimeout(activityTimer);
      }

      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user, refreshSession]);

  // Check session validity every hour
  useEffect(() => {
    if (!user) return;

    const sessionCheckInterval = setInterval(() => {
      const expiry = localStorage.getItem("simonIA_user_expiry");

      if (!expiry || Date.now() > parseInt(expiry)) {
        console.log("Session expired, logging out user");
        logout();
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => {
      clearInterval(sessionCheckInterval);
    };
  }, [user, logout]);
};
