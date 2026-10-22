const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const Member = require("../models/Member");
const { app } = require("../server");

test("Public status check PII protection and flexible lookup (F13)", async (t) => {
  let server;
  let baseUrl;
  let originalFindOne;

  t.before(async () => {
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;

    originalFindOne = Member.findOne;
  });

  t.after(async () => {
    Member.findOne = originalFindOne;
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    const mongoose = require("mongoose");
    await mongoose.disconnect();
  });

  await t.test("rejects request missing any search query with 400", async () => {
    const res = await fetch(`${baseUrl}/api/members/status`);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /Please enter your Registration ID or 10-digit Mobile Number/);
  });

  await t.test("rejects invalid mobile number format with 400", async () => {
    const res = await fetch(`${baseUrl}/api/members/status?query=12345`);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /10 digits/);
  });

  await t.test("returns 404 when no member matches the query", async () => {
    Member.findOne = () => ({
      lean: async () => null,
    });

    const res = await fetch(`${baseUrl}/api/members/status?query=9876543210`);
    assert.strictEqual(res.status, 404);
  });

  await t.test("returns ONLY public non-sensitive fields when member matches by mobile", async () => {
    Member.findOne = () => ({
      lean: async () => ({
        _id: "mongo-id-1234",
        registrationId: "MSD-MH-2026-0001",
        fullName: "Rahul Patil",
        fatherName: "Suresh Patil",
        dob: "1990-05-15",
        age: 34,
        gender: "Male",
        mobile: "9876543210",
        whatsapp: "9876543210",
        email: "rahul@secret.com",
        bloodGroup: "O+",
        photoUrl: "https://res.cloudinary.com/msd/photo.jpg",
        state: "Maharashtra",
        district: "Pune",
        taluk: "Haveli",
        address: "123 Private Street, Flat 402",
        pincode: "411001",
        wing: "Youth Wing",
        profession: "Engineer",
        status: "APPROVED",
        idProofType: "Aadhaar Card",
        idProofNumber: "1234-5678-9012",
        createdAt: "2026-01-01T00:00:00.000Z",
        approvedAt: "2026-01-02T00:00:00.000Z",
      }),
    });

    const res = await fetch(`${baseUrl}/api/members/status?query=9876543210`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.member);

    // Public allowed fields
    assert.strictEqual(body.member.registrationId, "MSD-MH-2026-0001");
    assert.strictEqual(body.member.fullName, "Rahul Patil");
    assert.strictEqual(body.member.status, "APPROVED");
    assert.strictEqual(body.member.wing, "Youth Wing");
    assert.strictEqual(body.member.state, "Maharashtra");
    assert.strictEqual(body.member.district, "Pune");

    // Strictly stripped PII fields
    assert.strictEqual(body.member.address, undefined, "Address must not be returned");
    assert.strictEqual(body.member.pincode, undefined, "Pincode must not be returned");
    assert.strictEqual(body.member.mobile, undefined, "Mobile must not be returned in public response");
    assert.strictEqual(body.member.email, undefined, "Email must not be returned in public response");
    assert.strictEqual(body.member.dob, undefined, "DOB must not be returned");
    assert.strictEqual(body.member.fatherName, undefined, "Father name must not be returned");
    assert.strictEqual(body.member.idProofNumber, undefined, "ID proof number must not be returned");
    assert.strictEqual(body.member.idProofType, undefined, "ID proof type must not be returned");
    assert.strictEqual(body.member.whatsapp, undefined, "WhatsApp must not be returned");
  });

  await t.test("returns public verification fields when looked up by registration ID", async () => {
    Member.findOne = () => ({
      lean: async () => ({
        registrationId: "MSD-MH-2026-0001",
        fullName: "Rahul Patil",
        status: "APPROVED",
        wing: "Youth Wing",
        state: "Maharashtra",
        district: "Pune",
      }),
    });

    const res = await fetch(`${baseUrl}/api/members/status?query=MSD-MH-2026-0001`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.member.registrationId, "MSD-MH-2026-0001");
  });
});
