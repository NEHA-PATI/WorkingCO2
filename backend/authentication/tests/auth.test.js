const authController = require("../controllers/authController");
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateUID = require("../utils/generateUID");
const axios = require("axios");
const { sendMail, MAIL_TYPES } = require("../services/mail");

jest.mock("../config/db", () => ({
  query: jest.fn()
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

jest.mock("../utils/generateUID", () => jest.fn(() => "USR000001"));
jest.mock("axios", () => ({ post: jest.fn() }));
jest.mock("../services/mail", () => ({
  sendMail: jest.fn(),
  MAIL_TYPES: {
    OTP: "OTP",
    PASSWORD_RESET: "PASSWORD_RESET",
    CONTACT_ADMIN: "CONTACT_ADMIN"
  }
}));

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const makeReq = (body = {}, extras = {}) => ({
  body,
  ...extras
});

const expectErrorResponse = (res, status, message) => {
  expect(res.status).toHaveBeenCalledWith(status);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      success: false,
      message,
      data: null
    })
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Auth Controller - register", () => {
  test("returns 400 for missing required fields (invalid username)", async () => {
    const req = makeReq({
      username: "a",
      email: "test@example.com",
      password: "Valid1@Pass"
    });
    const res = makeRes();

    await authController.register(req, res);

    expectErrorResponse(res, 400, "Invalid username");
  });

  test("returns 400 when email already exists", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const req = makeReq({
      username: "Test User",
      email: "test@example.com",
      password: "Valid1@Pass"
    });
    const res = makeRes();

    await authController.register(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expectErrorResponse(res, 400, "User already exists");
  });

  test("returns 400 for weak password", async () => {
    const req = makeReq({
      username: "Test User",
      email: "test@example.com",
      password: "weakpass"
    });
    const res = makeRes();

    await authController.register(req, res);

    expectErrorResponse(res, 400, "Weak password");
  });

  test("returns 200 on successful registration and sends OTP", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    bcrypt.hash.mockResolvedValueOnce("hashed_pw");
    jwt.sign.mockReturnValueOnce("temp_token");
    sendMail.mockResolvedValueOnce({ success: true });

    const req = makeReq({
      username: "Test User",
      email: "test@example.com",
      password: "Valid1@Pass"
    });
    const res = makeRes();

    await authController.register(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledWith("Valid1@Pass", 12);
    expect(jwt.sign).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith({
      type: MAIL_TYPES.OTP,
      to: "test@example.com",
      data: { otp: expect.any(String) }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "OTP sent to your email",
      data: { tempToken: "temp_token" }
    });
  });

  test("returns 500 on database error", async () => {
    pool.query.mockRejectedValueOnce(new Error("db error"));
    const req = makeReq({
      username: "Test User",
      email: "test@example.com",
      password: "Valid1@Pass"
    });
    const res = makeRes();

    await authController.register(req, res);

    expectErrorResponse(res, 500, "Registration failed");
  });
});

describe("Auth Controller - verifyOTP", () => {
  test("returns 400 when otp or tempToken is missing", async () => {
    const req = makeReq({ otp: "123456" });
    const res = makeRes();

    await authController.verifyOTP(req, res);

    expectErrorResponse(res, 400, "OTP and token required");
  });

  test("returns 400 when temp token is expired", async () => {
    jwt.verify.mockImplementationOnce(() => {
      throw new Error("expired");
    });

    const req = makeReq({ otp: "123456", tempToken: "temp" });
    const res = makeRes();

    await authController.verifyOTP(req, res);

    expectErrorResponse(res, 400, "OTP expired. Please register again.");
  });

  test("returns 400 for invalid OTP", async () => {
    jwt.verify.mockReturnValueOnce({
      otp: "111111",
      username: "Test User",
      email: "test@example.com",
      passwordHash: "hashed_pw",
      roleId: 1
    });

    const req = makeReq({ otp: "222222", tempToken: "temp" });
    const res = makeRes();

    await authController.verifyOTP(req, res);

    expectErrorResponse(res, 400, "Invalid OTP");
  });

  test("returns 201 on successful OTP verification and account creation", async () => {
    jwt.verify.mockReturnValueOnce({
      otp: "123456",
      username: "Test User",
      email: "test@example.com",
      passwordHash: "hashed_pw",
      roleId: 1
    });

    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 7 }] })
      .mockResolvedValueOnce({});

    const req = makeReq({ otp: "123456", tempToken: "temp" });
    const res = makeRes();

    await authController.verifyOTP(req, res);

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(generateUID).toHaveBeenCalledWith("USR", 7);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Email verified successfully. Account created.",
      data: {
        user: {
          id: 7,
          u_id: "USR000001",
          email: "test@example.com",
          verified: true,
          is_email_verified: true,
          status: "pending"
        }
      }
    });
  });

  test("returns 500 on database error", async () => {
    jwt.verify.mockReturnValueOnce({
      otp: "123456",
      username: "Test User",
      email: "test@example.com",
      passwordHash: "hashed_pw",
      roleId: 1
    });
    pool.query.mockRejectedValueOnce(new Error("db error"));

    const req = makeReq({ otp: "123456", tempToken: "temp" });
    const res = makeRes();

    await authController.verifyOTP(req, res);

    expectErrorResponse(res, 500, "OTP verification failed");
  });
});

describe("Auth Controller - login", () => {
  test("returns 400 when credentials are missing", async () => {
    const req = makeReq({ email: "test@example.com" });
    const res = makeRes();

    await authController.login(req, res);

    expectErrorResponse(res, 400, "Email and password are required");
  });

  test("returns 400 when user is not found", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const req = makeReq({ email: "test@example.com", password: "Valid1@Pass" });
    const res = makeRes();

    await authController.login(req, res);

    expectErrorResponse(res, 400, "Invalid email or password");
  });

  test("returns 400 for incorrect password", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{
        id: 1,
        u_id: "USR000001",
        username: "Test User",
        email: "test@example.com",
        password_hash: "hashed_pw",
        is_email_verified: true,
        status: "active",
        login_attempts: 0
      }]
    });
    bcrypt.compare.mockResolvedValueOnce(false);

    const req = makeReq({ email: "test@example.com", password: "WrongPass1@" });
    const res = makeRes();

    await authController.login(req, res);

    expect(bcrypt.compare).toHaveBeenCalled();
    expectErrorResponse(res, 400, "Invalid email or password");
  });

  test("returns 200 on successful login", async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [{
          id: 1,
          u_id: "USR000001",
          username: "Test User",
          email: "test@example.com",
          password_hash: "hashed_pw",
          is_email_verified: true,
          status: "active",
          login_attempts: 0
        }]
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    bcrypt.compare.mockResolvedValueOnce(true);
    jwt.sign.mockReturnValueOnce("access_token");

    const req = makeReq(
      { email: "test@example.com", password: "Valid1@Pass" },
      { ip: "127.0.0.1", connection: { remoteAddress: "127.0.0.1" }, get: () => "jest" }
    );
    const res = makeRes();

    await authController.login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: "access_token",
      user: {
        id: 1,
        u_id: "USR000001",
        username: "Test User",
        email: "test@example.com",
        role: "user",
        role_name: "user",
        app_role: "user",
        global_role: null,
        org_role: null,
        context: "user",
        org_id: null,
        verified: true,
        is_email_verified: true,
        status: "active"
      },
      data: {
        token: "access_token",
        user: {
          id: 1,
          u_id: "USR000001",
          username: "Test User",
          email: "test@example.com",
          role: "user",
          role_name: "user",
          app_role: "user",
          global_role: null,
          org_role: null,
          context: "user",
          org_id: null,
          verified: true,
          is_email_verified: true,
          status: "active"
        }
      }
    });
  });

  test("returns 500 on database error", async () => {
    pool.query.mockRejectedValueOnce(new Error("db error"));
    const req = makeReq({ email: "test@example.com", password: "Valid1@Pass" });
    const res = makeRes();

    await authController.login(req, res);

    expectErrorResponse(res, 500, "Login failed");
  });
});
