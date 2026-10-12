/**
 * Central API Configuration for Maha Seva Dal
 * Automatically switches between Local Development and Production (Vercel + Render)
 */

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "") ||
  (import.meta.env.DEV ? "http://localhost:5000" : "https://msd-backend.onrender.com");

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
