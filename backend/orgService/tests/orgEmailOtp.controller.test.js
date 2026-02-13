jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockSend = jest.fn();
jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const { Resend } = require("resend");
const {
  sendOrgEmailOtp,
  verifyOrgEmailOtp,
} = require("../controllers/orgEmailOtpController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("orgEmailOtpController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe("sendOrgEmailOtp", () => {
    test("Invalid email -> 400", async () => {
      const req = { body: { email: "bad" } };
      const res = createRes();

      await sendOrgEmailOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please provide a valid email",
      });
      expect(pool.query).not.toHaveBeenCalled();
    });

    test("Resend cooldown -> 429", async () => {
      const req = { body: { email: "org@example.com" } };
      const res = createRes();

      const now = Date.now();
      jest.spyOn(Date, "now").mockReturnValue(now);

      pool.query.mockResolvedValueOnce({
        rows: [{ last_sent_at: new Date(now - 10000).toISOString() }],
      });

      await sendOrgEmailOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Please wait"),
        })
      );

      Date.now.mockRestore();
    });

    test("Success -> 200", async () => {
      const req = { body: { email: "org@example.com" } };
      const res = createRes();

      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      bcrypt.hash.mockResolvedValue("hashed-otp");

      await sendOrgEmailOtp(req, res);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockSend).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "OTP sent successfully",
      });
    });

    test("DB error -> 500", async () => {
      const req = { body: { email: "org@example.com" } };
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await sendOrgEmailOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to send OTP",
      });
    });
  });

  describe("verifyOrgEmailOtp", () => {
    test("Missing otp -> 400", async () => {
      const req = { body: { email: "org@example.com" } };
      const res = createRes();

      await verifyOrgEmailOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please provide a valid OTP",
      });
    });

    test("Invalid email -> 400", async () => {
      const req = { body: { email: "bad", otp: "123456" } };
      const res = createRes();

      await verifyOrgEmailOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please provide a valid email",
      });
    });

    test("OTP not found -> 404", async () => {
      const req = { body: { email: "org@example.com", otp: "123456" } };
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [] });

      await verifyOrgEmailOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "OTP not found. Please request a new one.",
      });
    });

    test("Expired otp -> 400", async () => {
      const req = { body: { email: "org@example.com", otp: "123456" } };
      const res = createRes();

      pool.query.mockResolvedValue({
        rows: [
          {
            id: 1,
            otp_code: "hash",
            verified: false,
            attempts: 0,
            expires_at: new Date(Date.now() - 1000).toISOString(),
          },
        ],
      });

      await verifyOrgEmailOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "OTP expired. Please request a new one.",
      });
    });

    test("Max attempts reached -> 429", async () => {
      const req = { body: { email: "org@example.com", otp: "123456" } };
      const res = createRes();

      pool.query.mockResolvedValue({
        rows: [
          {
            id: 1,
            otp_code: "hash",
            verified: false,
            attempts: 5,
            expires_at: new Date(Date.now() + 1000).toISOString(),
          },
        ],
      });

      await verifyOrgEmailOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith({
        message: "Too many attempts. Please request a new OTP.",
      });
    });

    test("Invalid otp -> 400", async () => {
      const req = { body: { email: "org@example.com", otp: "123456" } };
      const res = createRes();

      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            otp_code: "hash",
            verified: false,
            attempts: 1,
            expires_at: new Date(Date.now() + 1000).toISOString(),
          },
        ],
      });
      bcrypt.compare.mockResolvedValue(false);
      pool.query.mockResolvedValueOnce({ rows: [] });

      await verifyOrgEmailOtp(req, res);

      expect(bcrypt.compare).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid OTP. Please try again.",
      });
    });

    test("Success -> 200", async () => {
      const req = { body: { email: "org@example.com", otp: "123456" } };
      const res = createRes();

      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            otp_code: "hash",
            verified: false,
            attempts: 0,
            expires_at: new Date(Date.now() + 1000).toISOString(),
          },
        ],
      });
      bcrypt.compare.mockResolvedValue(true);
      pool.query.mockResolvedValueOnce({ rows: [] });

      await verifyOrgEmailOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "OTP verified successfully",
      });
    });

    test("DB error -> 500", async () => {
      const req = { body: { email: "org@example.com", otp: "123456" } };
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await verifyOrgEmailOtp(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to verify OTP",
      });
    });
  });
});
