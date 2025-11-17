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
import { Fuel, Star, Zap, Target, MapPin, Instagram } from "lucide-react";
import Footer from "@/components/Footer";
const Onboarding = () => {
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
  const handleStart = () => {
    navigate("/auth", {
      state: {
        mode: 'signup'
      }
    });
  };
  const features = [{
    title: t('onboarding_feature_schnell'),
    description: t('onboarding_feature_schnell_desc'),
    image: featureSchnell,
    icon: Zap
  }, {
    title: t('onboarding_feature_einfach'),
    description: t('onboarding_feature_einfach_desc'),
    image: featureEinfach,
    icon: MapPin
  }, {
    title: t('onboarding_feature_genau'),
    description: t('onboarding_feature_genau_desc'),
    image: featureGenau,
    icon: Target
  }];
  const testimonials = [{
    name: t('onboarding_testimonial_1_name'),
    rating: 5,
    text: t('onboarding_testimonial_1_text')
  }, {
    name: t('onboarding_testimonial_2_name'),
    rating: 5,
    text: t('onboarding_testimonial_2_text')
  }, {
    name: t('onboarding_testimonial_3_name'),
    rating: 5,
    text: t('onboarding_testimonial_3_text')
  }];
  const faqs = [{
    question: t('onboarding_faq_1_q'),
    answer: t('onboarding_faq_1_a')
  }, {
    question: t('onboarding_faq_2_q'),
    answer: t('onboarding_faq_2_a')
  }, {
    question: t('onboarding_faq_3_q'),
    answer: t('onboarding_faq_3_a')
  }, {
    question: t('onboarding_faq_4_q'),
    answer: t('onboarding_faq_4_a')
  }, {
    question: t('onboarding_faq_5_q'),
    answer: t('onboarding_faq_5_a')
  }];
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 animate-fade-in">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={cheapfuelLogo} alt="Cheapfuel Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">{t('onboarding_header_title')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageMenu />
            <Button variant="default" size="sm" onClick={() => navigate("/auth")} className="bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white">
              {t('onboarding_header_login')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-start md:items-center justify-center opacity-0 animate-fade-in bg-gradient-to-br from-background via-muted/30 to-background pt-12 md:pt-0" style={{
      animationDelay: '0.1s',
      animationDuration: '0.4s'
    }}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-6 md:py-16 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <span className="text-base">💰</span>
                <span>{t('onboarding_hero_badge')}</span>
              </div>
              <h1 className="md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-black text-5xl">{t('onboarding_hero_title')}</h1>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed font-medium">{t('onboarding_hero_subtitle')}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={handleStart} size="lg" className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                {t('onboarding_cta_primary')}
              </Button>
              <Button size="lg" className="text-lg px-8 py-6 bg-black text-white hover:bg-black/90 shadow-lg hover:shadow-xl transition-all hover:scale-105" onClick={() => document.getElementById('features')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                {t('onboarding_cta_secondary')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-12 md:py-20 opacity-0 animate-fade-in scroll-mt-4" style={{
      animationDelay: '0.2s'
    }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 font-bold">{t('onboarding_features_title')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
          const Icon = feature.icon;
          return <Card key={index} className="overflow-hidden border-2">
                <div className="aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] relative bg-gradient-to-br from-muted to-muted/50 min-h-[400px]">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" loading="lazy" onError={e => {
                const img = e.currentTarget;
                // Retry loading the image once
                if (!img.dataset.retried) {
                  img.dataset.retried = 'true';
                  const src = img.src;
                  img.src = '';
                  setTimeout(() => img.src = src, 100);
                }
              }} />
                </div>
                <CardContent className="p-4 md:p-6 text-center space-y-3">
                  
                  <p className="md:text-base text-muted-foreground leading-relaxed text-base font-thin">{feature.description}</p>
                </CardContent>
              </Card>;
        })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/50 py-12 md:py-20 opacity-0 animate-fade-in" style={{
      animationDelay: '0.3s'
    }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('onboarding_testimonials_title')}</h2>
            
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
      <section className="container mx-auto px-4 py-12 md:py-20 opacity-0 animate-fade-in" style={{
      animationDelay: '0.4s'
    }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('onboarding_faq_title')}</h2>
            
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
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary via-accent to-primary/90 overflow-hidden opacity-0 animate-fade-in" style={{
      animationDelay: '0.5s'
    }}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-accent/10 to-transparent" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                {t('onboarding_final_cta_title')}
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                {t('onboarding_final_cta_subtitle')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={handleStart} size="lg" className="text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90">{t('onboarding_final_cta_button')}</Button>
            </div>
            
            <p className="text-sm text-white/70 pt-2">
              {t('onboarding_final_cta_footer')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>;
};
export default Onboarding;