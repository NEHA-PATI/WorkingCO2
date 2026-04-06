const test = require("node:test");
const assert = require("node:assert/strict");

const app = require("../src/app");

test("GET /api/profiles/complete returns 400 when x-user-id is missing", async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());
  await new Promise(resolve => server.once('listening', resolve));
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/profiles/complete`);
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.message, "User id missing");
});

test("POST /api/profiles/complete returns 400 when payload is missing", async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());
  await new Promise(resolve => server.once('listening', resolve));
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/profiles/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": "123",
    },
    body: JSON.stringify({}),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.message, "Profile and address data required");
});
