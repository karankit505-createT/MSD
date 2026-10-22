import { describe, it, expect, vi } from "vitest";
import { API_BASE_URL, getApiUrl, resolveApiBaseUrl } from "./api";

describe("api configuration", () => {
  describe("resolveApiBaseUrl", () => {
    it("should return localhost:5000 in development when no env var is set", () => {
      const url = resolveApiBaseUrl("", true);
      expect(url).toBe("http://localhost:5000");
    });

    it("should return the configured environment URL in production", () => {
      const url = resolveApiBaseUrl("https://api.mahasevadal.org/", false);
      expect(url).toBe("https://api.mahasevadal.org");
    });

    it("should fail loudly and return empty string in production when VITE_API_URL is missing", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const url = resolveApiBaseUrl("", false);
      expect(url).toBe("");
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("VITE_API_URL environment variable is not defined")
      );
      consoleSpy.mockRestore();
    });
  });

  describe("getApiUrl", () => {
    it("should prepend leading slash if not provided", () => {
      const url = getApiUrl("api/members");
      expect(url).toBe(`${API_BASE_URL}/api/members`);
    });

    it("should handle endpoints that already start with slash", () => {
      const url = getApiUrl("/api/upload");
      expect(url).toBe(`${API_BASE_URL}/api/upload`);
    });

    it("should handle nested subpaths correctly", () => {
      const url = getApiUrl("api/members/status/123");
      expect(url).toBe(`${API_BASE_URL}/api/members/status/123`);
    });
  });
});

