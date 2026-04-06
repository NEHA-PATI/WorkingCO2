const test = require("node:test");
const assert = require("node:assert/strict");

const app = require("../app");

test("GET / returns the admin service health message", async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/`);
  const text = await response.text();

  assert.equal(response.status, 200);
  assert.match(text, /Admin Service Running/i);
});
