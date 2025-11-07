import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ArrowLeft } from "lucide-react";
import cheapfuelLogo from "@/assets/cheapfuel-logo.svg";
import { useSubscription } from "@/hooks/useSubscription";
import { useEffect } from "react";
import { isPreviewMode } from "@/lib/utils";
import Footer from "@/components/Footer";
const Paywall = () => {
  const navigate = useNavigate();
  const {
    subscribed,
    loading,
    initiateCheckout
  } = useSubscription();
  useEffect(() => {
    if (isPreviewMode()) return;
    if (subscribed) {
      navigate("/");
    }
  }, [subscribed, navigate]);
  const features = ["Unbegrenzte Tankstellensuche", "Echtzeit-Preisvergleiche", "Routenintegration", "Alle Tankstellen in ganz Deutschland (bald in ganz Europa)", "Integrierte Navigation mit Apple oder Google Maps"];
  return <div className="min-h-screen bg-primary">
      {/* Back Button */}
      <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10 text-white hover:bg-white/20" onClick={() => navigate("/auth")}>
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4 pb-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white rounded-full p-4 shadow-2xl animate-[pulse_3s_ease-in-out_infinite]">
                  <img src={cheapfuelLogo} alt="Cheapfuel Logo" className="h-20 w-20" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">Cheapfuel</h1>
            <p className="text-white/90 text-lg">Finde deine günstigste Tankstelle in Sekunden⚡️und tanke mehr für weniger 🎉! </p>
          </div>

          {/* Features List */}
          <div className="space-y-4 backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
            {features.map((feature, index) => <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-base text-white leading-relaxed">{feature}</span>
              </div>)}
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Check className="h-5 w-5 text-white" />
              <p className="text-center text-base text-white/90 font-medium">
                Jederzeit kündbar
              </p>
            </div>
            <Button size="lg" className="w-full text-lg font-semibold h-14 bg-black text-white hover:bg-black/90 shadow-2xl hover:shadow-black/50 transition-all rounded-xl" onClick={initiateCheckout} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Los geht's
            </Button>
            <p className="text-center text-sm text-white/90">
              nur 27,00€ pro Jahr (2,25€/Monat)
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>;
};
export default Paywall;