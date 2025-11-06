import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import { openAppleMaps, openGoogleMaps } from "@/lib/navigation";

interface NavigationDialogProps {
  station: {
    lat: number;
    lng: number;
    name: string;
  } | null;
  onClose: () => void;
  routeMode?: boolean;
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
}

const NavigationDialog = ({ station, onClose, routeMode, origin, destination }: NavigationDialogProps) => {
  const { t } = useTranslation();

  const handleAppleMaps = () => {
    if (!station) return;
    // In route mode: only navigate to station (origin → station)
    if (routeMode && origin) {
      openAppleMaps(station.lat, station.lng, origin, undefined);
    } else {
      openAppleMaps(station.lat, station.lng);
    }
    onClose();
  };

  const handleGoogleMaps = () => {
    if (!station) return;
    openGoogleMaps(station.lat, station.lng, origin, destination);
    onClose();
  };

  return (
    <AlertDialog open={!!station} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[320px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">{t('navigation_choose_app')}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            {station?.name}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <AlertDialogAction 
            onClick={handleAppleMaps}
            className="w-full m-0"
          >
            {routeMode 
              ? t('navigation_apple_maps_to_station') 
              : t('navigation_apple_maps')
            }
          </AlertDialogAction>
          <AlertDialogAction 
            onClick={handleGoogleMaps}
            className="w-full m-0"
          >
            {routeMode 
              ? t('navigation_google_maps_full_route') 
              : t('navigation_google_maps')
            }
          </AlertDialogAction>
          <AlertDialogCancel className="w-full m-0">
            {t('navigation_cancel')}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NavigationDialog;
