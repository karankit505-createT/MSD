const test = require("node:test");
const assert = require("node:assert");
const { isOriginAllowed } = require("../server");

test("CORS origin validation", async (t) => {
  await t.test("allows non-browser requests with no origin", () => {
    const allowed = isOriginAllowed(undefined, ["https://mahasevadal.org"], false);
    assert.strictEqual(allowed, true);
  });

  await t.test("allows origin explicitly present in allowed list", () => {
    const allowed = isOriginAllowed("https://mahasevadal.org", ["https://mahasevadal.org"], false);
    assert.strictEqual(allowed, true);
  });

  await t.test("allows origin with trailing slash sanitized", () => {
    const allowed = isOriginAllowed("https://mahasevadal.org/", ["https://mahasevadal.org"], false);
    assert.strictEqual(allowed, true);
  });

  await t.test("rejects unknown malicious origins in production", () => {
    const allowed = isOriginAllowed("https://evil-attacker.com", ["https://mahasevadal.org"], false);
    assert.strictEqual(allowed, false);
  });

  await t.test("allows localhost in development mode", () => {
    const allowed = isOriginAllowed("http://localhost:5173", ["https://mahasevadal.org"], true);
    assert.strictEqual(allowed, true);
  });

  await t.test("rejects localhost in production when not in allowed list", () => {
    const allowed = isOriginAllowed("http://localhost:5173", ["https://mahasevadal.org"], false);
    assert.strictEqual(allowed, false);
  });
});
