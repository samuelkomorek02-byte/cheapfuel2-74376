import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isPreviewMode = () => {
  // Check if we're running in Lovable Preview or localhost
  const hostname = window.location.hostname;
  return hostname.includes('lovable.app') || 
         hostname.includes('localhost') || 
         hostname === '127.0.0.1';
};
