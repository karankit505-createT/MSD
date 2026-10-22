const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const jwt = require("jsonwebtoken");
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-min-32-chars-length!!";
const { app } = require("../server");

test("Upload routes authentication", async (t) => {
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

  await t.test("POST /api/upload returns 401 when no token is supplied", async () => {
    const res = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
    });
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.match(body.error, /Access denied/);
  });

  await t.test("POST /api/upload returns 403 when invalid token is supplied", async () => {
    const res = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: "Bearer invalid.token.value",
      },
    });
    assert.strictEqual(res.status, 403);
    const body = await res.json();
    assert.match(body.error, /Invalid or expired/);
  });

  await t.test("DELETE /api/upload returns 401 when no token is supplied", async () => {
    const res = await fetch(`${baseUrl}/api/upload`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id: "test" }),
    });
    assert.strictEqual(res.status, 401);
  });

  await t.test("POST /api/upload returns 400 when authenticated but no file provided", async () => {
    const validToken = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const res = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /No file provided/);
  });
});
