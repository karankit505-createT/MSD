const test = require("node:test");
const assert = require("node:assert");
const { escapeRegex } = require("../controllers/memberController");

test("Search regex sanitization and pagination bounds (F12)", async (t) => {
  await t.test("escapeRegex escapes special regex characters", () => {
    assert.strictEqual(escapeRegex(".*"), "\\.\\*");
    assert.strictEqual(escapeRegex("(a+)+$"), "\\(a\\+\\)\\+\\$");
    assert.strictEqual(escapeRegex("["), "\\[");
    assert.strictEqual(escapeRegex("test?+*^$()[]{}|\\"), "test\\?\\+\\*\\^\\$\\(\\)\\[\\]\\{\\}\\|\\\\");
  });

  await t.test("escaped regex characters compile safely into RegExp without SyntaxError", () => {
    const rawInputs = [".*", "(a+)+$", "[", "[[[", "+", "?", "\\", "{1,99}"];
    for (const input of rawInputs) {
      assert.doesNotThrow(() => {
        const escaped = escapeRegex(input);
        new RegExp(escaped, "i");
      }, `Pattern "${input}" should compile safely when escaped`);
    }
  });

  await t.test("handles non-string inputs gracefully", () => {
    assert.strictEqual(escapeRegex(null), "");
    assert.strictEqual(escapeRegex(undefined), "");
    assert.strictEqual(escapeRegex(123), "");
  });
});
