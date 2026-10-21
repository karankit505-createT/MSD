import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("should merge simple class names", () => {
    const result = cn("class-a", "class-b");
    expect(result).toBe("class-a class-b");
  });

  it("should handle conditional and falsy class names", () => {
    const result = cn("always", false && "never", null, undefined, "sometimes");
    expect(result).toBe("always sometimes");
  });

  it("should resolve conflicting Tailwind classes via tailwind-merge", () => {
    // px-4 should be overridden by px-8
    const result = cn("px-4 py-2", "px-8");
    expect(result).toBe("py-2 px-8");
  });

  it("should handle complex objects and arrays", () => {
    const result = cn(["bg-red-500", "text-white"], { "opacity-50": true, "hidden": false });
    expect(result).toBe("bg-red-500 text-white opacity-50");
  });

  it("should return empty string when no arguments provided", () => {
    expect(cn()).toBe("");
  });
});
