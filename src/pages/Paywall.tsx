import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ArrowLeft } from "lucide-react";
import cheapfuelLogo from "@/assets/cheapfuel-logo.svg";
import { useSubscription } from "@/hooks/useSubscription";
import { useEffect } from "react";
import { isPreviewMode } from "@/lib/utils";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";
const Paywall = () => {
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
  const {
    subscribed,
    loading,
    checkoutLoading,
    initiateCheckout
  } = useSubscription();
  useEffect(() => {
    if (isPreviewMode()) return;
    if (subscribed) {
      navigate("/aboseite");
    }
  }, [subscribed, navigate]);

  const handleCheckout = async () => {
    try {
      await initiateCheckout();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast({
        title: t("paywall_checkout_error_title") || "Checkout Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  const features = [t('paywall_feature_1'), t('paywall_feature_2'), t('paywall_feature_3'), t('paywall_feature_4'), t('paywall_feature_5')];
  return <div className="min-h-screen bg-primary">
      {/* Back Button */}
      <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10 text-white hover:bg-white/20" onClick={() => navigate("/auth")}>
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4 pb-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in" style={{
        animationDuration: '0.4s'
      }}>
          {/* Logo and Title */}
          <div className="text-center space-y-6">
            <div className="flex items-end justify-center gap-3">
              
              
            </div>
            <h1 className="font-bold tracking-tight drop-shadow-lg font-sans text-white text-4xl">{t('paywall_new_subtitle')}</h1>
            <div className="border-2 border-blue-400 bg-white/10 backdrop-blur-sm rounded-lg p-2 mx-auto max-w-fit shadow-[0_0_15px_rgba(96,165,250,0.6)]">
              <p className="text-base font-bold text-white">{t('paywall_savings_text')}</p>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-600 bg-slate-900 shadow-[0_0_20px_rgba(37,99,235,0.8)]">
            {features.map((feature, index) => <div key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-check-circle flex-shrink-0 mt-0.5" />
                <span className="text-white leading-relaxed font-semibold text-lg">{feature}</span>
              </div>)}
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Check className="h-5 w-5 text-white" />
              <p className="text-center text-base text-white/90 font-medium">
                {t('paywall_cancel_anytime')}
              </p>
            </div>
            <Button size="lg" onClick={handleCheckout} disabled={loading || checkoutLoading} className="w-full text-lg font-semibold h-14 text-white shadow-2xl hover:shadow-black/50 transition-all rounded-xl hover:scale-105 bg-black hover:bg-black/90">
              {checkoutLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {t('paywall_cta_button')}
            </Button>
            <p className="text-center text-sm text-white/90">
              {t('paywall_price')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>;
};
export default Paywall;