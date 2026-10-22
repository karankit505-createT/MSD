const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const { safeCompare } = require("../controllers/memberController");
const { validateJwtSecret, app } = require("../server");

test("Admin login hardening and JWT secret validation (F11)", async (t) => {
  let server;
  let baseUrl;

  t.before(async () => {
    process.env.ADMIN_USERNAME = "testadmin";
    process.env.ADMIN_PASSWORD = "testpassword123!";
    process.env.JWT_SECRET = "super-secret-jwt-key-with-at-least-32-characters!!";

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  t.after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    const mongoose = require("mongoose");
    await mongoose.disconnect();
  });

  await t.test("safeCompare correctly matches identical strings and rejects differences", () => {
    assert.strictEqual(safeCompare("admin", "admin"), true);
    assert.strictEqual(safeCompare("password123", "password123"), true);
    assert.strictEqual(safeCompare("admin", "admin1"), false);
    assert.strictEqual(safeCompare("short", "longer-string"), false);
    assert.strictEqual(safeCompare(null, "admin"), false);
    assert.strictEqual(safeCompare(undefined, undefined), false);
  });

  await t.test("validateJwtSecret enforces minimum 32 chars in production", () => {
    // In production mode
    const shortCheck = validateJwtSecret("short-secret-123", true);
    assert.strictEqual(shortCheck.valid, false);
    assert.match(shortCheck.error, /at least 32 characters/);

    const emptyCheck = validateJwtSecret("", true);
    assert.strictEqual(emptyCheck.valid, false);

    const validCheck = validateJwtSecret("a-very-long-and-secure-jwt-secret-key-32-chars+", true);
    assert.strictEqual(validCheck.valid, true);

    // In dev mode, relaxed check
    const devCheck = validateJwtSecret("dev-secret", false);
    assert.strictEqual(devCheck.valid, true);
  });

  await t.test("POST /api/members/admin/login rejects wrong password with 401", async () => {
    const res = await fetch(`${baseUrl}/api/members/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "testadmin", password: "wrongpassword" }),
    });
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.error, "Invalid username or password.");
  });

  await t.test("POST /api/members/admin/login succeeds with valid credentials", async () => {
    const res = await fetch(`${baseUrl}/api/members/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "testadmin", password: "testpassword123!" }),
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.token);
    assert.strictEqual(body.admin.username, "testadmin");
  });
});
