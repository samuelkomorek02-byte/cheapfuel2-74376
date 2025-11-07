import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { analytics } from "@/lib/analytics";

type LangCode = "de" | "en" | "es" | "it" | "pl" | "ru" | "fr";

const LANGUAGES: { code: LangCode; label: string; flag: string }[] = [
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export default function LanguageMenu() {
  const { i18n, t } = useTranslation();
  const [lang, setLang] = useState<LangCode>("de");
  const [open, setOpen] = useState(false);

  const current = useMemo(
    () => LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[1],
    [lang]
  );

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

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={t('select_language')}
          variant="outline"
          size="sm"
          className="rounded-full px-3 active:bg-foreground active:text-background data-[state=open]:bg-foreground data-[state=open]:text-background"
        >
          <span aria-hidden className="text-base">{current.flag}</span>
          <span className="font-medium uppercase">{current.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-50 w-56 rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg"
      >
        <DropdownMenuLabel>{t('select_language')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => {
              if (l.code !== lang) {
                analytics.trackLanguageChange(l.code);
              }
              setLang(l.code);
              i18n.changeLanguage(l.code);
              localStorage.setItem("cheapfuel-language", l.code);
              setOpen(false);
            }}
            className={`flex items-center justify-between rounded-lg data-[highlighted]:bg-foreground data-[highlighted]:text-background focus:bg-foreground focus:text-background ${
              l.code === lang ? "bg-foreground text-background" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden className="text-lg">{l.flag}</span>
              {l.label}
            </span>
            {l.code === lang && <span className="text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
