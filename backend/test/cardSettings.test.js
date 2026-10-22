const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const CardSetting = require("../models/CardSetting");
const { getCardSettings, updateCardSettings } = require("../controllers/memberController");

describe("Card Settings Controller", () => {
  let inMemoryDb = null;

  beforeEach(() => {
    inMemoryDb = null;
    // Stub CardSetting.findOne
    CardSetting.findOne = () => ({
      lean: async () => inMemoryDb,
    });
    // Stub CardSetting.findOneAndUpdate
    CardSetting.findOneAndUpdate = (query, update) => ({
      lean: async () => {
        inMemoryDb = {
          key: "default",
          customSealUrl: update.$set.customSealUrl || "",
          customSignatureUrl: update.$set.customSignatureUrl || "",
          signatoryName: update.$set.signatoryName || "Authorized Signatory",
          signatoryTitle: update.$set.signatoryTitle || "Central Executive Committee",
          updatedAt: update.$set.updatedAt || new Date().toISOString(),
        };
        return inMemoryDb;
      },
    });
  });

  const createMockHttp = (body = {}) => {
    let statusCode = 200;
    let jsonResponse = null;
    const req = { body };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonResponse = data;
        return this;
      },
    };
    return {
      req,
      res,
      getStatusCode: () => statusCode,
      getJsonResponse: () => jsonResponse,
    };
  };

  it("should retrieve card settings successfully and include defaults when no doc exists", async () => {
    const { req, res, getStatusCode, getJsonResponse } = createMockHttp();

    await getCardSettings(req, res);

    assert.strictEqual(getStatusCode(), 200);
    const body = getJsonResponse();
    assert.strictEqual(body.success, true);
    assert.ok(body.settings);
    assert.strictEqual(body.settings.signatoryName, "Authorized Signatory");
    assert.strictEqual(body.settings.signatoryTitle, "Central Executive Committee");
  });

  it("should update card signatory title without errors and persist to DB", async () => {
    const updatePayload = {
      signatoryName: "National President",
      signatoryTitle: "Central Executive Committee",
    };
    const { req, res, getStatusCode, getJsonResponse } = createMockHttp(updatePayload);

    await updateCardSettings(req, res);

    assert.strictEqual(getStatusCode(), 200);
    const body = getJsonResponse();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.settings.signatoryName, "National President");
    assert.strictEqual(body.settings.signatoryTitle, "Central Executive Committee");
  });

  it("should reject invalid non-string signatoryName with status 400", async () => {
    const { req, res, getStatusCode, getJsonResponse } = createMockHttp({
      signatoryName: 12345,
    });

    await updateCardSettings(req, res);

    assert.strictEqual(getStatusCode(), 400);
    const body = getJsonResponse();
    assert.ok(body.error.includes("signatoryName"));
  });

  it("should reject invalid non-string signatoryTitle with status 400", async () => {
    const { req, res, getStatusCode, getJsonResponse } = createMockHttp({
      signatoryTitle: { complex: "object" },
    });

    await updateCardSettings(req, res);

    assert.strictEqual(getStatusCode(), 400);
    const body = getJsonResponse();
    assert.ok(body.error.includes("signatoryTitle"));
  });

  it("should not perform fs.writeFileSync when updating settings", async () => {
    let fsWriteCalled = false;
    const origWrite = fs.writeFileSync;
    fs.writeFileSync = () => {
      fsWriteCalled = true;
    };

    try {
      const { req, res, getStatusCode } = createMockHttp({
        signatoryName: "Test Pres",
      });
      await updateCardSettings(req, res);
      assert.strictEqual(getStatusCode(), 200);
      assert.strictEqual(fsWriteCalled, false, "fs.writeFileSync must not be called");
    } finally {
      fs.writeFileSync = origWrite;
    }
  });
});
