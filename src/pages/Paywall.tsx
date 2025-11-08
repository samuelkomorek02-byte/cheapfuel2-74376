import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ArrowLeft } from "lucide-react";
import cheapfuelLogo from "@/assets/cheapfuel-logo.svg";
import { useSubscription } from "@/hooks/useSubscription";
import { useEffect, useState } from "react";
import { isPreviewMode } from "@/lib/utils";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Paywall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const {
    subscribed,
    loading,
    initiateCheckout
  } = useSubscription();
  
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  useEffect(() => {
    const state = location.state as { isNewUser?: boolean } | null;
    if (state?.isNewUser) {
      setShowWelcomeDialog(true);
      // Clear state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (isPreviewMode()) return;
    if (subscribed) {
      navigate("/");
    }
  }, [subscribed, navigate]);
  const features = ["Unbegrenzte Tankstellensuche", "Echtzeit-Preisvergleiche", "Routenintegration", "Deutschlandweites Tankstellennetzwerk", "Integrierte Navigation mit Apple oder Google Maps"];
  return <div className="min-h-screen bg-primary">
      {/* Welcome Dialog for New Users */}
      <AlertDialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("welcome_new_user_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("welcome_new_user_message")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowWelcomeDialog(false)}>
              Schließen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              <div className="bg-white rounded-full p-4 shadow-2xl">
                <img src={cheapfuelLogo} alt="Cheapfuel Logo" className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">Cheapfuel</h1>
            <p className="text-white/90 text-lg">Finde deine günstigste Tankstelle und spare jedes Jahr über 240€ !</p>
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