import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin, TrendingDown, Map, Route } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });

  // Listen to slide changes
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on("select", onSelect);
    onSelect();
    
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const slides = [
    {
      icon: <MapPin className="w-16 h-16" />,
      title: "Günstig tanken in deiner Nähe",
      description: "Finde die günstigsten Tankstellen in deiner Umgebung mit nur einem Klick.",
      gradient: "from-primary to-primary/60",
    },
    {
      icon: <TrendingDown className="w-16 h-16" />,
      title: "Echtzeit-Preisvergleich",
      description: "Vergleiche aktuelle Spritpreise und spare bei jeder Tankfüllung bares Geld.",
      gradient: "from-accent to-accent/60",
    },
    {
      icon: <Map className="w-16 h-16" />,
      title: "Interaktive Karte",
      description: "Entdecke alle Tankstellen auf einer übersichtlichen Karte mit detaillierten Informationen.",
      gradient: "from-primary to-accent",
    },
    {
      icon: <Route className="w-16 h-16" />,
      title: "Routenplanung",
      description: "Plane deine Route und finde günstige Tankstellen auf dem Weg zu deinem Ziel.",
      gradient: "from-accent to-primary",
    },
  ];

  const handleFinish = () => {
    localStorage.setItem("onboarding_completed", "true");
    navigate("/auth");
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding_completed", "true");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CheapFuel
          </h1>
          <p className="text-muted-foreground mt-2">Günstig tanken leicht gemacht</p>
        </div>

        {/* Carousel */}
        <Carousel
          ref={emblaRef}
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col items-center justify-center py-12 animate-scale-in">
                  {/* Icon with gradient background */}
                  <div
                    className={`mb-8 p-8 rounded-full bg-gradient-to-br ${slide.gradient} text-primary-foreground shadow-lg hover-scale`}
                  >
                    {slide.icon}
                  </div>

                  {/* Content */}
                  <h2 className="text-2xl font-bold text-center mb-4 px-4">
                    {slide.title}
                  </h2>
                  <p className="text-muted-foreground text-center px-6 leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-4 mt-6">
            <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0" />
            <CarouselNext className="relative inset-0 translate-x-0 translate-y-0" />
          </div>
        </Carousel>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 animate-fade-in">
          {currentSlide === slides.length - 1 ? (
            <Button
              onClick={handleFinish}
              size="lg"
              className="w-full text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Los geht's
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              onClick={handleSkip}
              variant="outline"
              size="lg"
              className="w-full text-lg"
            >
              Überspringen
            </Button>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Durch die Nutzung stimmst du unseren{" "}
          <a href="/datenschutz" className="text-primary hover:underline">
            Datenschutzbestimmungen
          </a>{" "}
          zu.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
