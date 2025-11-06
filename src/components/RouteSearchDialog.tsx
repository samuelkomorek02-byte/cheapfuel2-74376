import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Route, MapPin, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { validateCoordinates, sanitizeSearchString } from "@/lib/validation";
interface RouteSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (destination: string, coords: { lat: number; lng: number }) => void;
  loading?: boolean;
  userLocation?: { lat: number; lng: number } | null;
}
interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}
const RouteSearchDialog = ({
  open,
  onOpenChange,
  onSearch,
  loading,
  userLocation
}: RouteSearchDialogProps) => {
  const {
    t
  } = useTranslation();
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const justSelected = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions from Photon (better POI recognition)
  useEffect(() => {
    if (destination.length < 1 || selectedCoords) {
      setSuggestions([]);
      return;
    }

    // Skip if user just selected a suggestion
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }
    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const sanitizedQuery = sanitizeSearchString(destination);
        
        // Europa Bounding Box: West, South, East, North
        const europeBbox = '-10.0,35.0,40.0,71.0';
        
        // Build API URL with bbox for Europe-only results
        let apiUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(sanitizedQuery)}&lang=de&limit=8&bbox=${europeBbox}`;
        
        // Add user location as bias if available (prioritizes nearby results)
        if (userLocation) {
          apiUrl += `&lat=${userLocation.lat}&lon=${userLocation.lng}`;
        }
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Transform Photon GeoJSON to Suggestion format
        const transformedSuggestions: Suggestion[] = data.features?.map((feature: any) => {
          const props = feature.properties;
          const coords = feature.geometry.coordinates;

          // Build display name with POI priority
          let displayName = props.name || '';
          if (props.street) displayName += (displayName ? ', ' : '') + props.street;
          if (props.housenumber) displayName += ' ' + props.housenumber;
          if (props.city) displayName += (displayName ? ', ' : '') + props.city;
          if (props.country) displayName += (displayName ? ', ' : '') + props.country;
          return {
            display_name: displayName || feature.properties.name || 'Unbekannter Ort',
            lon: coords[0].toString(),
            lat: coords[1].toString()
          };
        }) || [];
        setSuggestions(transformedSuggestions);
      } catch (error) {
        console.error('Autocomplete error:', error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 250); // 250ms debounce for faster autocomplete
    return () => clearTimeout(timer);
  }, [destination, selectedCoords, userLocation]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim() && selectedCoords) {
      onSearch(destination.trim(), selectedCoords);
      setSuggestions([]);
    } else if (!selectedCoords) {
      toast({
        title: t('route_error_geocoding'),
        description: "Bitte wähle ein Ziel aus der Vorschlagsliste"
      });
    }
  };
  const handleSuggestionClick = (suggestion: Suggestion) => {
    justSelected.current = true;
    const coords = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    };
    
    // Validate coordinates before setting
    if (!validateCoordinates(coords.lat, coords.lng)) {
      toast({
        title: "Ungültige Koordinaten",
        description: "Die ausgewählte Position ist ungültig"
      });
      return;
    }
    
    setDestination(suggestion.display_name);
    setSelectedCoords(coords);
    setSuggestions([]);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md top-4 translate-y-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            {t('route_dialog_title')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input ref={inputRef} type="text" placeholder={t('route_destination_placeholder')} value={destination} onChange={e => {
              setDestination(e.target.value);
              setSelectedCoords(null);
            }} disabled={loading} autoFocus autoComplete="off" className="pr-10" />
            
            {/* Clear button */}
            {destination.length > 0 && <button type="button" onMouseDown={(e) => {
            e.preventDefault();
            setDestination("");
            setSelectedCoords(null);
            setSuggestions([]);
            inputRef.current?.focus();
          }} aria-label="Clear input" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors p-1 rounded-sm bg-background z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rounded-none bg-transparent">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>}
            
            {/* Loading indicator */}
            {loadingSuggestions && destination.length > 0 && !suggestions.length && <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  <span>Suche läuft...</span>
                </div>
              </div>}
            
            {/* Suggestions dropdown */}
            {suggestions.length > 0 && <ScrollArea className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60">
                <div className="p-1">
                  {suggestions.map((suggestion, index) => <button key={index} type="button" onClick={() => handleSuggestionClick(suggestion)} className="w-full text-left px-3 py-2 text-sm rounded-sm flex items-start gap-2 transition-colors bg-white/[0.31]">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                      <span className="line-clamp-2 text-black">{suggestion.display_name}</span>
                    </button>)}
                </div>
              </ScrollArea>}
          </div>
          
          <Button type="submit" className="w-full" disabled={loading || !destination.trim()}>
            {loading ? t('route_loading') : t('route_find_button')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>;
};
export default RouteSearchDialog;