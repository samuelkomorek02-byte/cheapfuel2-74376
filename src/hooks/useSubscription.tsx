import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SubscriptionStatus {
  subscribed: boolean;
  product_id: string | null;
  subscription_end: string | null;
  loading: boolean;
}

export const useSubscription = () => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    product_id: null,
    subscription_end: null,
    loading: true,
  });

  const checkSubscription = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // If there's an error getting the session or no session exists, set to unsubscribed
      if (sessionError || !session) {
        setStatus({
          subscribed: false,
          product_id: null,
          subscription_end: null,
          loading: false,
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      // Silently handle errors by setting to unsubscribed state
      if (error) {
        console.error("Error checking subscription:", error);
        setStatus({
          subscribed: false,
          product_id: null,
          subscription_end: null,
          loading: false,
        });
        return;
      }

      setStatus({
        subscribed: data.subscribed || false,
        product_id: data.product_id || null,
        subscription_end: data.subscription_end || null,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to check subscription:", error);
      setStatus({
        subscribed: false,
        product_id: null,
        subscription_end: null,
        loading: false,
      });
    }
  };

  useEffect(() => {
    checkSubscription();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        checkSubscription();
      } else if (event === "SIGNED_OUT") {
        setStatus({
          subscribed: false,
          product_id: null,
          subscription_end: null,
          loading: false,
        });
      }
    });

    // Refresh subscription status periodically (every minute)
    const interval = setInterval(checkSubscription, 60000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const initiateCheckout = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentifizierung erforderlich",
          description: "Bitte melden Sie sich an, um fortzufahren.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.url) {
        // Direkte Navigation statt window.open um Popup-Blocker zu vermeiden
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Fehler",
        description: "Checkout konnte nicht gestartet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  return {
    ...status,
    checkSubscription,
    initiateCheckout,
  };
};
