import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ArrowLeft } from "lucide-react";
import cheapfuelLogo from "@/assets/cheapfuel-logo.svg";
import { useSubscription } from "@/hooks/useSubscription";
import { useEffect } from "react";
import { isPreviewMode } from "@/lib/utils";

const Paywall = () => {
  const navigate = useNavigate();
  const { subscribed, loading, initiateCheckout } = useSubscription();

  useEffect(() => {
    if (isPreviewMode()) return;
    if (subscribed) {
      navigate("/");
    }
  }, [subscribed, navigate]);

  const features = [
    "Unbegrenzte Tankstellensuche",
    "Echtzeit-Preisvergleiche",
    "Routenintegration",
    "Tankstelle in ganz Deutschland (später europaweit)",
    "Integrierte Navigation mit Apple oder Google Maps",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 flex items-center justify-center p-4 relative">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-10"
        onClick={() => navigate("/auth")}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Main Content */}
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={cheapfuelLogo} alt="CheapFuel Logo" className="h-24 w-24" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">CheapFuel</h1>
        </div>

        {/* Features Card */}
        <div className="bg-card rounded-2xl shadow-2xl border border-border/50 p-8 space-y-6">
          {/* Features List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm text-foreground leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="space-y-4 pt-2">
            <p className="text-center text-sm text-muted-foreground font-medium">
              Jederzeit kündbar
            </p>
            <Button 
              size="lg" 
              className="w-full text-lg font-semibold h-14 shadow-lg hover:shadow-xl transition-all rounded-xl"
              onClick={initiateCheckout}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Los geht's
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              nur <span className="font-bold text-foreground">27,00€</span> pro Jahr{" "}
              <span className="text-xs">(2,25€/mo)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
