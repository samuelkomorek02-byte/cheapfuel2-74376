import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ArrowLeft } from "lucide-react";
import cheapfuelLogo from "@/assets/cheapfuel-logo.svg";
import { useSubscription } from "@/hooks/useSubscription";
import { useEffect } from "react";
import { isPreviewMode } from "@/lib/utils";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useCountUp } from "@/hooks/useCountUp";

const Paywall = () => {
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
  const savings = useCountUp(240, 2000, 0);
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
  const features = [{
    emoji: '✅',
    text: t('paywall_feature_1')
  }, {
    emoji: '✅',
    text: t('paywall_feature_2')
  }, {
    emoji: '✅',
    text: t('paywall_feature_3')
  }, {
    emoji: '✅',
    text: t('paywall_feature_4')
  }, {
    emoji: '✅',
    text: t('paywall_feature_5')
  }];
  return <div className="min-h-screen bg-primary">
      {/* Back Button */}
      <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10 text-white hover:bg-white/20" onClick={() => navigate("/")}>
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4 pb-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in" style={{
        animationDuration: '0.4s'
      }}>
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-white rounded-full p-4 shadow-2xl">
                <img src={cheapfuelLogo} alt="Cheapfuel Logo" className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight drop-shadow-lg text-black">{t('paywall_title')}</h1>
            <p className="text-lg text-white">
              Finde die günstigsten Tankstellen in Sekunden und spare dadurch jährlich über{' '}
              <span className="font-bold text-2xl inline-block min-w-[4ch] animate-pulse">
                {savings}€
              </span>
              ⚡️💰🎉
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4 backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
            {features.map((feature, index) => <div key={index} className="flex items-start gap-3">
                <span className="text-base text-white leading-relaxed font-medium">{feature.emoji}</span>
                <span className="text-white leading-relaxed text-lg">{feature.text}</span>
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
            <Button size="lg" className="w-full text-lg font-semibold h-14 bg-black text-white hover:bg-black/90 shadow-2xl hover:shadow-black/50 transition-all rounded-xl hover:scale-105" onClick={initiateCheckout} disabled={loading || checkoutLoading}>
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