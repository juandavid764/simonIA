import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Refreshes local session expiry based on user activity.
 */
export const useSessionManager = () => {
  const { user, refreshSession, logout } = useAuth();

  useEffect(() => {
    if (!user) return;

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    let activityTimer;

    const handleActivity = () => {
      if (activityTimer) {
        clearTimeout(activityTimer);
      }

      activityTimer = setTimeout(() => {
        refreshSession();
      }, 30 * 60 * 1000);
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, true);
    });

    handleActivity();

    return () => {
      if (activityTimer) {
        clearTimeout(activityTimer);
      }

      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user, refreshSession]);

  useEffect(() => {
    if (!user) return;

    const sessionCheckInterval = setInterval(() => {
      const expiry = localStorage.getItem("simonIA_user_expiry");

      if (!expiry || Date.now() > Number(expiry)) {
        logout();
      }
    }, 15 * 60 * 1000);

    return () => {
      clearInterval(sessionCheckInterval);
    };
  }, [user, logout]);
};
