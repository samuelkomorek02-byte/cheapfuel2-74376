import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { analytics } from "@/lib/analytics";
type LangCode = "de" | "en" | "es" | "it" | "pl" | "ru" | "fr";
const LANGUAGES: {
  code: LangCode;
  label: string;
  flag: string;
}[] = [{
  code: "de",
  label: "Deutsch",
  flag: "🇩🇪"
}, {
  code: "en",
  label: "English",
  flag: "🇺🇸"
}, {
  code: "es",
  label: "Español",
  flag: "🇪🇸"
}, {
  code: "it",
  label: "Italiano",
  flag: "🇮🇹"
}, {
  code: "pl",
  label: "Polski",
  flag: "🇵🇱"
}, {
  code: "ru",
  label: "Русский",
  flag: "🇷🇺"
}, {
  code: "fr",
  label: "Français",
  flag: "🇫🇷"
}];
interface LanguageMenuProps {
  onLanguageChange?: () => void;
}
export default function LanguageMenu({
  onLanguageChange
}: LanguageMenuProps = {}) {
  const {
    i18n,
    t
  } = useTranslation();
  const [lang, setLang] = useState<LangCode>("de");
  const [open, setOpen] = useState(false);
  const current = useMemo(() => LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[1], [lang]);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
  }, [lang]);
  useEffect(() => {
    // Load saved language from localStorage or default to German
    const savedLang = localStorage.getItem("cheapfuel-language") as LangCode || "de";
    setLang(savedLang);
    i18n.changeLanguage(savedLang);
  }, [i18n]);
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 font-medium bg-muted/50 hover:bg-muted border border-border text-foreground hover:text-foreground">
          <span className="text-lg" aria-hidden>{current.flag}</span>
          <span className="sm:hidden">{current.code.toUpperCase()}</span>
          <span className="hidden sm:inline">{current.label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="z-50 w-56 rounded-xl border bg-popover p-2 text-popover-foreground shadow-lg">
        <div className="mb-2 px-2 py-1.5 text-sm font-semibold">{t('select_language')}</div>
        <div className="h-px bg-border mb-1" />
        {LANGUAGES.map(l => <div key={l.code} onClick={() => {
        if (l.code !== lang) {
          analytics.trackLanguageChange(l.code);
        }
        setLang(l.code);
        i18n.changeLanguage(l.code);
        localStorage.setItem("cheapfuel-language", l.code);
        setOpen(false);
        onLanguageChange?.();
      }} className={`flex items-center justify-between rounded-lg px-2 py-2 cursor-pointer hover:bg-foreground hover:text-background transition-colors ${l.code === lang ? "bg-foreground text-background" : ""}`}>
            <span className="flex items-center gap-2">
              <span aria-hidden className="text-lg">{l.flag}</span>
              {l.label}
            </span>
            {l.code === lang && <span className="text-xs">✓</span>}
          </div>)}
      </PopoverContent>
    </Popover>;
}