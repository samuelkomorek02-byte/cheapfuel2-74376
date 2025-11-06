import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import LanguageMenu from "@/components/LanguageMenu";
import cheapfuelLogo from "@/assets/cheapfuel-logo.svg";
import heroImage from "@/assets/onboarding-hero.jpg";
import { Fuel } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleStart = () => {
    localStorage.setItem("onboarding_completed", "true");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={cheapfuelLogo} alt="CheapFuel Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">CheapFuel</h1>
          </div>
          <LanguageMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Hero Text */}
          <h2 className="text-3xl font-bold leading-tight">
            {t("onboarding_hero_text")}
          </h2>

          {/* Hero Image */}
          <div className="relative w-full aspect-[3/4] max-w-sm mx-auto">
            <img
              src={heroImage}
              alt="CheapFuel App Preview"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>

          {/* CTA Text */}
          <p className="text-sm text-muted-foreground">
            {t("onboarding_cta_text")}
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleStart}
            size="lg"
            className="w-full bg-foreground text-background hover:bg-foreground/90"
          >
            {t("onboarding_cta_button")}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
