import { Instagram } from "lucide-react";
import cheapfuelLogo from "@/assets/cheapfuel-logo.svg";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-muted-foreground space-y-4">
          <div className="flex items-center justify-center gap-3">
            <img src={cheapfuelLogo} alt="Cheapfuel Logo" className="h-6 w-6" />
            <span className="font-semibold">Cheapfuel</span>
            <a 
              href="https://cheapfuel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cheapfuel App"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>
          <p>© 2025 Cheapfuel. Alle Rechte vorbehalten.</p>
          <nav className="flex justify-center gap-6">
            <a href="/impressum" className="hover:text-foreground transition-colors">
              Impressum
            </a>
            <a href="/datenschutz" className="hover:text-foreground transition-colors">
              Datenschutz
            </a>
            <a href="/agb" className="hover:text-foreground transition-colors">
              AGB
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
