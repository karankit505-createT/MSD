const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const { validatePhotoUrl } = require("../controllers/memberController");
const { app } = require("../server");

test("SSRF protection in photo proxy", async (t) => {
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

  await t.test("allows legitimate https://res.cloudinary.com URLs", () => {
    const res = validatePhotoUrl("https://res.cloudinary.com/msd/image/upload/v1234/test.jpg");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.parsed.hostname, "res.cloudinary.com");
  });

  await t.test("rejects DigitalOcean / AWS metadata link-local address (169.254.169.254)", () => {
    const res = validatePhotoUrl("http://169.254.169.254/metadata/v1.json");
    assert.strictEqual(res.valid, false);
  });

  await t.test("rejects localhost and loopback interfaces", () => {
    const res1 = validatePhotoUrl("http://localhost:5000/api/members");
    assert.strictEqual(res1.valid, false);

    const res2 = validatePhotoUrl("https://127.0.0.1:5000/api/members");
    assert.strictEqual(res2.valid, false);
  });

  await t.test("rejects private IP address ranges", () => {
    assert.strictEqual(validatePhotoUrl("https://10.0.0.1/admin").valid, false);
    assert.strictEqual(validatePhotoUrl("https://172.16.0.1/admin").valid, false);
    assert.strictEqual(validatePhotoUrl("https://192.168.1.100/admin").valid, false);
  });

  await t.test("rejects URLs with embedded credentials", () => {
    const res = validatePhotoUrl("https://admin:secret@res.cloudinary.com/test.jpg");
    assert.strictEqual(res.valid, false);
    assert.match(res.reason, /credentials/i);
  });

  await t.test("rejects non-HTTPS protocols (http, ftp, file)", () => {
    assert.strictEqual(validatePhotoUrl("http://res.cloudinary.com/test.jpg").valid, false);
    assert.strictEqual(validatePhotoUrl("file:///etc/passwd").valid, false);
  });

  await t.test("rejects arbitrary external domains not on allow-list", () => {
    const res = validatePhotoUrl("https://attacker-c2.com/payload.png");
    assert.strictEqual(res.valid, false);
    assert.match(res.reason, /not permitted/i);
  });

  await t.test("GET /api/members/proxy-photo returns 400 for blocked SSRF target", async () => {
    const target = encodeURIComponent("http://169.254.169.254/metadata");
    const res = await fetch(`${baseUrl}/api/members/proxy-photo?url=${target}`);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.error);
  });

  await t.test("GET /api/members/proxy-photo returns 400 when url param is missing", async () => {
    const res = await fetch(`${baseUrl}/api/members/proxy-photo`);
    assert.strictEqual(res.status, 400);
  });
});
