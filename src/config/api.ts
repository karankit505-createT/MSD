/**
 * Central API Configuration for Maha Seva Dal
 * Configured dynamically via VITE_API_URL environment variable.
 */

const rawApiUrl = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");

export const resolveApiBaseUrl = (
  envUrl: string = rawApiUrl,
  isDev: boolean = Boolean(import.meta.env.DEV)
): string => {
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }
  if (isDev) {
    return "http://localhost:5000";
  }
  // In production, missing VITE_API_URL is an explicit configuration error
  const errorMsg =
    "[Configuration Error] VITE_API_URL environment variable is not defined. Please set VITE_API_URL in your hosting environment (DigitalOcean App Platform) build settings.";
  console.error(errorMsg);
  return "";
};

export const API_BASE_URL = resolveApiBaseUrl();

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL && !import.meta.env.DEV) {
    console.error(`Cannot call ${cleanEndpoint}: VITE_API_URL is not configured.`);
  }
  return `${API_BASE_URL}${cleanEndpoint}`;
};

