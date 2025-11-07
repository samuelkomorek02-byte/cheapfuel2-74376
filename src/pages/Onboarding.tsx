import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LanguageMenu from "@/components/LanguageMenu";
import cheapfuelLogo from "@/assets/cheapfuel-logo.svg";
import featureSchnell from "@/assets/feature-schnell.jpg";
import featureEinfach from "@/assets/feature-einfach.jpg";
import featureGenau from "@/assets/feature-genau.jpg";
import { Fuel, Star, Zap, Target, MapPin } from "lucide-react";
const Onboarding = () => {
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
  const handleStart = () => {
    localStorage.setItem("onboarding_completed", "true");
    navigate("/auth");
  };
  const features = [{
    title: "Schnell",
    description: "Finde in Sekunden die günstigsten Tankstellen in deiner Nähe",
    image: featureSchnell,
    icon: Zap
  }, {
    title: "Einfach",
    description: "Intuitive Kartenansicht zeigt dir alle Preise auf einen Blick",
    image: featureEinfach,
    icon: MapPin
  }, {
    title: "Genau",
    description: "Aktuelle Preise und detaillierte Informationen zu jeder Tankstelle",
    image: featureGenau,
    icon: Target
  }];
  const testimonials = [{
    name: "Michael S.",
    rating: 5,
    text: "Spare jeden Monat mindestens 30€ beim Tanken. Die App ist super einfach zu bedienen!"
  }, {
    name: "Sarah K.",
    rating: 5,
    text: "Endlich eine App die wirklich funktioniert. Preise sind immer aktuell und die Route-Funktion ist genial."
  }, {
    name: "Thomas B.",
    rating: 5,
    text: "Nutze CheapFuel seit 6 Monaten. Habe schon über 150€ gespart!"
  }];
  const faqs = [{
    question: "Wie aktuell sind die Spritpreise?",
    answer: "Unsere Preisdaten werden in Echtzeit aktualisiert und stammen direkt von den Tankstellen. Du siehst immer die aktuellsten Preise."
  }, {
    question: "Ist CheapFuel kostenlos?",
    answer: "Ja, die Grundfunktionen von CheapFuel sind komplett kostenlos. Du kannst unbegrenzt nach günstigen Tankstellen suchen."
  }, {
    question: "Welche Regionen werden unterstützt?",
    answer: "CheapFuel deckt ganz Deutschland ab mit tausenden Tankstellen in allen Bundesländern."
  }, {
    question: "Brauche ich eine Internetverbindung?",
    answer: "Ja, für die Suche nach aktuellen Preisen benötigst du eine Internetverbindung. Die App funktioniert mit mobilen Daten und WLAN."
  }];
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={cheapfuelLogo} alt="CheapFuel Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">Cheapfuel</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/auth")}
              className="text-sm"
            >
              Anmelden
            </Button>
            <LanguageMenu />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          
          
          <h1 className="md:text-5xl lg:text-6xl font-bold leading-tight text-5xl">Finde die günstigste Tankstelle⛽️ in Sekunden⚡️
und spare jedes Jahr über 240€💰!
        </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Schnell. Einfach. Genau. </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button onClick={handleStart} size="lg" className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90">Jetzt loslegen</Button>
            <Button variant="default" size="lg" className="text-lg px-8 py-6 bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white" onClick={() => document.getElementById('features')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              Mehr erfahren
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 font-bold">Warum Cheapfuel🧐?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
          const Icon = feature.icon;
          return <Card key={index} className="overflow-hidden border-2">
                <div className="aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] relative bg-gradient-to-br from-muted to-muted/50">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4 md:p-6 text-center space-y-3">
                  
                  <p className="md:text-base text-muted-foreground leading-relaxed text-base font-thin">{feature.description}</p>
                </CardContent>
              </Card>;
        })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Was unsere Nutzer sagen💬</h2>
            
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => <Card key={index} className="bg-background">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-5 w-5 fill-primary text-primary" />)}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold">{testimonial.name}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Häufig gestellte Fragen</h2>
            
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary via-accent to-primary/90 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-accent/10 to-transparent" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Bereit, Geld zu sparen?
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Schließe dich tausenden zufriedenen Nutzern an und finde noch heute die günstigsten Tankstellen in deiner Nähe.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={handleStart} size="lg" className="text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90">Jetzt loslegen </Button>
            </div>
            
            <p className="text-sm text-white/70 pt-2">
              ✓ Keine Kreditkarte erforderlich · ✓ In Sekunden einsatzbereit
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground space-y-4">
          <div className="flex items-center justify-center gap-2">
            <img src={cheapfuelLogo} alt="CheapFuel Logo" className="h-6 w-6" />
            <span className="font-semibold">Cheapfuel</span>
          </div>
          <p>© 2024 Cheapfuel. Alle Rechte vorbehalten.</p>
          <nav className="flex justify-center gap-6">
            <a href="/impressum" className="hover:text-foreground transition-colors">
              Impressum
            </a>
            <a href="/datenschutz" className="hover:text-foreground transition-colors">
              Datenschutz
            </a>
          </nav>
        </div>
      </footer>
    </div>;
};
export default Onboarding;