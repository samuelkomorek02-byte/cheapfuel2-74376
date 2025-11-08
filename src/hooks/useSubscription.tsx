import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SubscriptionStatus {
  subscribed: boolean;
  product_id: string | null;
  subscription_end: string | null;
  loading: boolean;
}

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const subscriptionCache = {
  data: null as { subscribed: boolean; product_id: string | null; subscription_end: string | null } | null,
  timestamp: 0
};

export const useSubscription = (skipInitialCheck = false, initialSubscribed = false) => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    subscribed: initialSubscribed, // Use initial value from navigation state
    product_id: null,
    subscription_end: null,
    loading: skipInitialCheck ? false : true,
  });

  const checkSubscription = async (useCache = true) => {
    // Check cache first
    if (useCache && subscriptionCache.data && Date.now() - subscriptionCache.timestamp < CACHE_TTL) {
      console.log('Using cached subscription status');
      setStatus({
        ...subscriptionCache.data,
        loading: false
      });
      return;
    }
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

      const result = {
        subscribed: data.subscribed || false,
        product_id: data.product_id || null,
        subscription_end: data.subscription_end || null,
      };

      // Update cache
      subscriptionCache.data = result;
      subscriptionCache.timestamp = Date.now();

      setStatus({
        ...result,
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
    // Skip initial check wenn von Auth navigiert
    if (!skipInitialCheck) {
      checkSubscription();
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // Force fresh check on auth changes (bypass cache)
        checkSubscription(false);
      } else if (event === "SIGNED_OUT") {
        // Clear cache on signout
        subscriptionCache.data = null;
        subscriptionCache.timestamp = 0;
        setStatus({
          subscribed: false,
          product_id: null,
          subscription_end: null,
          loading: false,
        });
      }
    });

    // Refresh subscription status periodically (every 2 minutes) only when page is visible
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        checkSubscription(true);
      }
    }, 120000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [skipInitialCheck]);

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

  const manageSubscription = async () => {
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

      const { data, error } = await supabase.functions.invoke("customer-portal", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Portal error:", error);
      toast({
        title: "Fehler",
        description: "Customer Portal konnte nicht geöffnet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  return {
    ...status,
    checkSubscription,
    initiateCheckout,
    manageSubscription,
  };
};
