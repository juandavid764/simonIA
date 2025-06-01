import { useEffect } from "react";
import { supabase } from "../supabase/client.js";

export const useSubscribeToTransacciones = (reloadData, userId) => {
  useEffect(() => {
    if (!userId) return;
    const requestChannel = supabase
      .channel(`transactions_${userId}`, {
        config: {
          broadcast: { self: true },
          presence: { key: userId }
        }
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("INSERT detected:", payload);
          reloadData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE", 
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("UPDATE detected:", payload);
          reloadData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("DELETE detected:", payload);
          reloadData();
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error("Subscription error:", err);
        } else {
        }
      });

    return () => {
      supabase.removeChannel(requestChannel);
    };
  }, [userId, reloadData]);
};