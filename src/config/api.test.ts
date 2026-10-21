import { describe, it, expect } from "vitest";
import { API_BASE_URL, getApiUrl } from "./api";

describe("api configuration", () => {
  it("should have a valid API_BASE_URL", () => {
    expect(API_BASE_URL).toBeDefined();
    expect(typeof API_BASE_URL).toBe("string");
    expect(API_BASE_URL.length).toBeGreaterThan(0);
    expect(API_BASE_URL.endsWith("/")).toBe(false);
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
