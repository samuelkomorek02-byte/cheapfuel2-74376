import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import NavigationDialog from "@/components/NavigationDialog";

interface StationDetailsProps {
  stationId: string | null;
  onClose: () => void;
}

interface StationDetail {
  id: string;
  name: string;
  brand?: string | null;
  lat: number;
  lng: number;
  isOpen: boolean;
  openingTimes: Array<{
    text: string;
    start: string;
    end: string;
  }>;
  overrides: string[];
  wholeDay: boolean;
  price: {
    e5?: number;
    e10?: number;
    diesel?: number;
  };
}

const StationDetails = ({ stationId, onClose }: StationDetailsProps) => {
  const { t } = useTranslation();
  const [station, setStation] = useState<StationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);

  useEffect(() => {
    if (!stationId) {
      setStation(null);
      return;
    }

    const fetchStationDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("fetch-stations", {
          body: { stationId }
        });
        
        if (error) throw error;
        if (data?.station) {
          setStation(data.station);
        }
      } catch (error) {
        console.error("Failed to fetch station details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStationDetails();
  }, [stationId]);

  const handleNavigate = useCallback(() => {
    setShowNavigationDialog(true);
  }, []);

  const formatTime = (time: string) => {
    return time.slice(0, 5); // Remove seconds
  };

  const formatPrice = (price?: number) => {
    if (typeof price !== "number") return "–";
    return `€${price.toFixed(3)}/L`;
  };

  return (
    <>
      <NavigationDialog
        station={station && showNavigationDialog ? { lat: station.lat, lng: station.lng, name: station.name } : null}
        onClose={() => setShowNavigationDialog(false)}
      />
      <Dialog open={!!stationId} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {station?.name || "Tankstelle"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="p-4 text-center text-muted-foreground">
            Lade Details...
          </div>
        ) : station ? (
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center gap-2">
              <Badge variant={station.isOpen ? "default" : "secondary"}>
                {station.isOpen ? t('open') : t('closed')}
              </Badge>
              {station.brand && <span className="text-sm text-muted-foreground">{station.brand}</span>}
            </div>

            {/* Prices */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Preise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {station.price.diesel && (
                  <div className="flex justify-between">
                    <span>Diesel</span>
                    <span className="font-mono">{formatPrice(station.price.diesel)}</span>
                  </div>
                )}
                {station.price.e5 && (
                  <div className="flex justify-between">
                    <span>Super 95</span>
                    <span className="font-mono">{formatPrice(station.price.e5)}</span>
                  </div>
                )}
                {station.price.e10 && (
                  <div className="flex justify-between">
                    <span>Super E10</span>
                    <span className="font-mono">{formatPrice(station.price.e10)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Öffnungszeiten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {station.wholeDay ? (
                  <p className="text-sm">24 Stunden geöffnet</p>
                ) : station.openingTimes.length > 0 ? (
                  <div className="space-y-1">
                    {station.openingTimes.map((time, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{time.text}</span>
                        <span className="font-mono">
                          {formatTime(time.start)} - {formatTime(time.end)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Keine Öffnungszeiten verfügbar</p>
                )}
                
                {/* Overrides/Exceptions */}
                {station.overrides.length > 0 && (
                  <div className="mt-3 pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Hinweise:</p>
                    {station.overrides.map((override, index) => (
                      <p key={index} className="text-xs text-muted-foreground">{override}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Button */}
            <Button onClick={handleNavigate} className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              Navigation starten
            </Button>
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Station nicht gefunden
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};

export default StationDetails;