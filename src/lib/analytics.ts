// Google Analytics utilities for Cheapfuel
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

// Track page views
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-79BVXKW40M', {
      page_path: path,
      anonymize_ip: true,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Cheapfuel-specific event tracking functions
export const analytics = {
  // Track when user clicks "Find" button
  trackStationSearch: (fuelType: string, hasLocation: boolean) => {
    trackEvent('find_stations', 'search', `fuel_${fuelType}`, hasLocation ? 1 : 0);
  },

  // Track fuel type changes
  trackFuelTypeChange: (oldType: string, newType: string) => {
    trackEvent('fuel_type_change', 'interaction', `${oldType}_to_${newType}`);
  },

  // Track location permission results
  trackLocationRequest: (success: boolean, error?: string) => {
    trackEvent('location_request', 'permission', success ? 'granted' : 'denied');
    if (!success && error) {
      trackEvent('location_error', 'error', error);
    }
  },

  // Track when user clicks on a station
  trackStationClick: (stationId: string, price: number, distance: number) => {
    trackEvent('station_click', 'interaction', stationId, Math.round(price * 1000));
  },

  // Track successful station data fetch
  trackStationsLoaded: (count: number, searchRadius: number) => {
    trackEvent('stations_loaded', 'data', `radius_${searchRadius}km`, count);
  },

  // Track language changes
  trackLanguageChange: (newLanguage: string) => {
    trackEvent('language_change', 'interaction', newLanguage);
  },
};