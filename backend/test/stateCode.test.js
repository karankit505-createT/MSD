const { describe, it } = require("node:test");
const assert = require("node:assert");
const { getStateCode } = require("../controllers/memberController");

describe("State Code Mapping Helper - getStateCode", () => {
  it("should return IN for falsy input", () => {
    assert.strictEqual(getStateCode(""), "IN");
    assert.strictEqual(getStateCode(null), "IN");
    assert.strictEqual(getStateCode(undefined), "IN");
  });

  it("should return correct 2-letter codes for standard states", () => {
    assert.strictEqual(getStateCode("Karnataka"), "KA");
    assert.strictEqual(getStateCode("Maharashtra"), "MH");
    assert.strictEqual(getStateCode("Tamil Nadu"), "TN");
    assert.strictEqual(getStateCode("Uttar Pradesh"), "UP");
    assert.strictEqual(getStateCode("West Bengal"), "WB");
    assert.strictEqual(getStateCode("Gujarat"), "GJ");
    assert.strictEqual(getStateCode("Rajasthan"), "RJ");
  });

  it("should return correct 2-letter codes for union territories", () => {
    assert.strictEqual(getStateCode("Delhi"), "DL");
    assert.strictEqual(getStateCode("Chandigarh"), "CH");
    assert.strictEqual(getStateCode("Ladakh"), "LA");
    assert.strictEqual(getStateCode("Puducherry"), "PY");
  });

  it("should fallback to the first two letters capitalized for unknown states", () => {
    assert.strictEqual(getStateCode("Atlantis"), "AT");
    assert.strictEqual(getStateCode("unknown"), "UN");
  });
});
