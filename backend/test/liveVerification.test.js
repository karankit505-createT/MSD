const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const jwt = require("jsonwebtoken");
process.env.JWT_SECRET = "production-ready-jwt-secret-with-at-least-32-chars!!";
process.env.ADMIN_USERNAME = "admin";
process.env.ADMIN_PASSWORD = "password123";
process.env.FRONTEND_URL = "https://mahasevadal.org";
const { app } = require("../server");

test("Final Check Item 5 - Live endpoint & CORS verification", async (t) => {
  let server;
  let baseUrl;

  t.before(async () => {
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

  await t.test("1. GET /health returns 200 and status ok", async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, "ok");
    assert.ok(body.timestamp);
  });

  await t.test("2. Public route GET / returns 200 with service message", async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.match(body.message, /Maha Seva Dal/);
  });

  await t.test("3. Admin route without token returns 401 Unauthorized", async () => {
    const res = await fetch(`${baseUrl}/api/members/admin/all`);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.match(body.error, /Access denied/);
  });

  await t.test("4. Admin route with valid token returns 200 OK", async () => {
    const token = jwt.sign({ username: "admin", role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const res = await fetch(`${baseUrl}/api/members/admin/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.admin.username, "admin");
  });

  await t.test("5a. CORS preflight from allowed origin succeeds with Access-Control-Allow-Origin header", async () => {
    const res = await fetch(`${baseUrl}/api/members/admin/verify`, {
      method: "OPTIONS",
      headers: {
        Origin: "https://mahasevadal.org",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Authorization",
      },
    });
    assert.strictEqual(res.headers.get("access-control-allow-origin"), "https://mahasevadal.org");
  });

  await t.test("5b. CORS preflight from disallowed origin does not return Access-Control-Allow-Origin header", async () => {
    const res = await fetch(`${baseUrl}/api/members/admin/verify`, {
      method: "OPTIONS",
      headers: {
        Origin: "https://evil-hacker.com",
        "Access-Control-Request-Method": "GET",
      },
    });
    assert.strictEqual(res.headers.get("access-control-allow-origin"), null);
  });
});
