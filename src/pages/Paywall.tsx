import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Loader2 } from "lucide-react";
import cheapfuelLogo from "@/assets/cheapfuel-logo.svg";
import { useSubscription } from "@/hooks/useSubscription";
import { useEffect } from "react";

const Paywall = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { subscribed, loading, initiateCheckout } = useSubscription();

  // Check if user already has a subscription and redirect
  useEffect(() => {
    if (subscribed) {
      navigate("/");
    }
  }, [subscribed, navigate]);

  const features = [
    "Unbegrenzte Tankstellensuche",
    "Echtzeit-Preisvergleiche",
    "Persönliche Favoriten",
    "Routenplanung mit günstigen Tankstellen",
    "Push-Benachrichtigungen bei Preisänderungen",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={cheapfuelLogo} alt="CheapFuel Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">CheapFuel</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-lg border-2 border-primary/20 shadow-xl">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-primary/10 rounded-full">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Premium Mitgliedschaft
            </CardTitle>
            <CardDescription className="text-base">
              Erhalte Zugriff auf alle Premium-Features und spare beim Tanken
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Features List */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 p-1 bg-primary/10 rounded-full">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="space-y-4 pt-4">
              <Button 
                size="lg" 
                className="w-full text-lg font-semibold h-14 shadow-lg hover:shadow-xl transition-all"
                onClick={initiateCheckout}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Jetzt starten
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                nur 27,99€ pro Jahr (2,33€/mo)
              </p>
            </div>

            {/* Trust Badge */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-center text-xs text-muted-foreground">
                ✓ Jederzeit kündbar · ✓ 30 Tage Geld-zurück-Garantie
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Paywall;
