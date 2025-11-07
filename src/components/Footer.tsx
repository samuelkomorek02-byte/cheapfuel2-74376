import { Instagram } from "lucide-react";
import cheapfuelLogo from "@/assets/cheapfuel-logo.svg";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-gray-600 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <img src={cheapfuelLogo} alt="Cheapfuel Logo" className="h-6 w-6" />
            <span className="font-semibold text-gray-900">Cheapfuel</span>
            <a 
              href="https://cheapfuel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Cheapfuel App"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>
          <p className="text-gray-600">© 2025 Cheapfuel. All rights reserved.</p>
          <nav className="flex justify-center gap-6">
            <a href="/impressum" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('impressum')}
            </a>
            <a href="/datenschutz" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('datenschutz')}
            </a>
            <a href="/agb" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('agb')}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
