const { describe, it } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { getCardSettings, updateCardSettings } = require("../controllers/memberController");

describe("Card Settings Controller", () => {
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

  it("should retrieve card settings successfully", async () => {
    const { req, res, getStatusCode, getJsonResponse } = createMockHttp();

    await getCardSettings(req, res);

    assert.strictEqual(getStatusCode(), 200);
    const body = getJsonResponse();
    assert.strictEqual(body.success, true);
    assert.ok(body.settings);
    assert.strictEqual(typeof body.settings.signatoryName, "string");
  });

  it("should update card signatory title without errors", async () => {
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
});
