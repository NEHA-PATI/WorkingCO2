const authController = require("../controllers/authController");
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOTP = require("../utils/sendOTP");
const generateUID = require("../utils/generateUID");
const axios = require("axios");

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

jest.mock("../utils/sendOTP", () => jest.fn());
jest.mock("../utils/generateUID", () => jest.fn(() => "USR000001"));
jest.mock("axios", () => ({ post: jest.fn() }));

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

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid username" });
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
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
  });

  test("returns 400 for weak password", async () => {
    const req = makeReq({
      username: "Test User",
      email: "test@example.com",
      password: "weakpass"
    });
    const res = makeRes();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Weak password" });
  });

  test("returns 200 on successful registration and sends OTP", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    bcrypt.hash.mockResolvedValueOnce("hashed_pw");
    jwt.sign.mockReturnValueOnce("temp_token");
    sendOTP.mockResolvedValueOnce();

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
    expect(sendOTP).toHaveBeenCalledWith("test@example.com", expect.any(String));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "OTP sent to your email",
      tempToken: "temp_token"
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

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Registration failed" });
  });
});

describe("Auth Controller - verifyOTP", () => {
  test("returns 400 when otp or tempToken is missing", async () => {
    const req = makeReq({ otp: "123456" });
    const res = makeRes();

    await authController.verifyOTP(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "OTP and token required" });
  });

  test("returns 400 when temp token is expired", async () => {
    jwt.verify.mockImplementationOnce(() => {
      throw new Error("expired");
    });

    const req = makeReq({ otp: "123456", tempToken: "temp" });
    const res = makeRes();

    await authController.verifyOTP(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "OTP expired. Please register again."
    });
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

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid OTP" });
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
      message: "Email verified successfully. Account created.",
      user: {
        id: 7,
        u_id: "USR000001",
        email: "test@example.com",
        verified: true,
        status: "pending"
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

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "OTP verification failed" });
  });
});

describe("Auth Controller - login", () => {
  test("returns 400 when credentials are missing", async () => {
    const req = makeReq({ email: "test@example.com" });
    const res = makeRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email and password are required"
    });
  });

  test("returns 400 when user is not found", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const req = makeReq({ email: "test@example.com", password: "Valid1@Pass" });
    const res = makeRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password"
    });
  });

  test("returns 400 for incorrect password", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{
        id: 1,
        email: "test@example.com",
        password: "hashed_pw",
        verified: true,
        status: "active",
        role_name: "user",
        login_attempts: 0
      }]
    });
    bcrypt.compare.mockResolvedValueOnce(false);
    pool.query.mockResolvedValueOnce({});
    axios.post.mockResolvedValue({});

    const req = makeReq({ email: "test@example.com", password: "WrongPass1@" });
    const res = makeRes();

    await authController.login(req, res);

    expect(bcrypt.compare).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password"
    });
  });

  test("returns 200 on successful login", async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [{
          id: 1,
          u_id: "USR000001",
          username: "Test User",
          email: "test@example.com",
          password: "hashed_pw",
          verified: true,
          status: "active",
          role_name: "user",
          login_attempts: 0
        }]
      })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});

    bcrypt.compare.mockResolvedValueOnce(true);
    jwt.sign.mockReturnValueOnce("access_token");
    axios.post.mockResolvedValue({});

    const req = makeReq(
      { email: "test@example.com", password: "Valid1@Pass" },
      { ip: "127.0.0.1", connection: { remoteAddress: "127.0.0.1" }, get: () => "jest" }
    );
    const res = makeRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Welcome back!",
      token: "access_token",
      user: {
        id: 1,
        u_id: "USR000001",
        username: "Test User",
        email: "test@example.com",
        role_name: "user",
        verified: true,
        status: "active"
      }
    });
  });

  test("returns 500 on database error", async () => {
    pool.query.mockRejectedValueOnce(new Error("db error"));
    const req = makeReq({ email: "test@example.com", password: "Valid1@Pass" });
    const res = makeRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Login failed" });
  });
});
