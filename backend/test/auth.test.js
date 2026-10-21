const { describe, it } = require("node:test");
const assert = require("node:assert");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/auth");

describe("Auth Middleware - verifyToken", () => {
  const TEST_SECRET = "test_jwt_secret_key_123";
  process.env.JWT_SECRET = TEST_SECRET;

  // Helper to construct mock req, res, next
  const createMockHttp = (authHeader) => {
    const req = {
      headers: {
        ...(authHeader ? { authorization: authHeader } : {}),
      },
    };
    let statusCode = null;
    let jsonResponse = null;
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
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    return {
      req,
      res,
      next,
      getStatusCode: () => statusCode,
      getJsonResponse: () => jsonResponse,
      wasNextCalled: () => nextCalled,
    };
  };

  it("should return 401 when Authorization header is missing", () => {
    const { req, res, next, getStatusCode, getJsonResponse, wasNextCalled } = createMockHttp(null);

    verifyToken(req, res, next);

    assert.strictEqual(getStatusCode(), 401);
    assert.strictEqual(getJsonResponse().error, "Access denied. No token provided.");
    assert.strictEqual(wasNextCalled(), false);
  });

  it("should return 401 when Authorization header does not start with Bearer", () => {
    const { req, res, next, getStatusCode, getJsonResponse, wasNextCalled } = createMockHttp("Basic 12345");

    verifyToken(req, res, next);

    assert.strictEqual(getStatusCode(), 401);
    assert.strictEqual(getJsonResponse().error, "Access denied. No token provided.");
    assert.strictEqual(wasNextCalled(), false);
  });

  it("should return 403 when token is invalid", () => {
    const { req, res, next, getStatusCode, getJsonResponse, wasNextCalled } = createMockHttp("Bearer invalid_token_xyz");

    verifyToken(req, res, next);

    assert.strictEqual(getStatusCode(), 403);
    assert.strictEqual(getJsonResponse().error, "Invalid or expired token.");
    assert.strictEqual(wasNextCalled(), false);
  });

  it("should call next() and populate req.admin when token is valid", () => {
    process.env.JWT_SECRET = TEST_SECRET;
    const validToken = jwt.sign({ username: "test_admin", role: "superadmin" }, TEST_SECRET, { expiresIn: "1h" });
    const { req, res, next, getStatusCode, wasNextCalled } = createMockHttp(`Bearer ${validToken}`);

    verifyToken(req, res, next);

    assert.strictEqual(getStatusCode(), null);
    assert.strictEqual(wasNextCalled(), true);
    assert.strictEqual(req.admin.username, "test_admin");
    assert.strictEqual(req.admin.role, "superadmin");
  });
});
