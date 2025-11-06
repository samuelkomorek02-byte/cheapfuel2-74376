import { z } from "zod";

// Coordinate validation schema
export const coordinateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

// Validate coordinates before API calls
export const validateCoordinates = (lat: number, lng: number): boolean => {
  const result = coordinateSchema.safeParse({ lat, lng });
  return result.success;
};

// Sanitize search string
export const sanitizeSearchString = (input: string, maxLength: number = 200): string => {
  return input.trim().slice(0, maxLength);
};

// Color sanitization for CSS values
export const sanitizeColor = (color: string): string => {
  // Only allow hex colors, rgb(), rgba(), hsl(), hsla()
  const colorRegex = /^(#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))$/;
  return colorRegex.test(color.trim()) ? color.trim() : "#000000";
};
