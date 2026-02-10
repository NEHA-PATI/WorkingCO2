jest.mock("../src/utils/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../src/config/env", () => ({
  auth: {
    jwtSecret: "test-secret",
  },
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

const jwt = require("jsonwebtoken");
const auth = require("../src/middleware/auth");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Notification Service - Auth Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Missing auth header -> 401", () => {
    const req = { headers: {} };
    const res = createRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("Invalid token -> 401", () => {
    const req = { headers: { authorization: "Bearer bad" } };
    const res = createRes();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error("invalid token");
    });

    auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(["Bearer", "bad"], "test-secret");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        message: "Invalid or expired token",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("Valid token -> calls next and sets req.user", () => {
    const req = { headers: { authorization: "Bearer good" } };
    const res = createRes();
    const next = jest.fn();

    jwt.verify.mockReturnValue({
      id: 1,
      role: "ADMIN",
      email: "admin@example.com",
    });

    auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(["Bearer", "good"], "test-secret");
    expect(req.user).toEqual({
      id: 1,
      role: "ADMIN",
      email: "admin@example.com",
    });
    expect(next).toHaveBeenCalled();
  });
});
