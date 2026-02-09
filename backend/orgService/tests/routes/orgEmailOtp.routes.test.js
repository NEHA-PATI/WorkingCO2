jest.mock("express-rate-limit", () => () => (req, res, next) => next());

jest.mock("../../controllers/orgEmailOtpController", () => ({
  sendOrgEmailOtp: jest.fn((req, res) => res.status(200).json({ ok: true })),
  verifyOrgEmailOtp: jest.fn((req, res) => res.status(200).json({ ok: true })),
}));

const express = require("express");
const request = require("supertest");
const routes = require("../../routes/orgEmailOtpRoutes");
const controller = require("../../controllers/orgEmailOtpController");

const app = express();
app.use(express.json());
app.use("/api/org-email-otp", routes);

describe("orgEmailOtpRoutes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/org-email-otp/send -> sendOrgEmailOtp", async () => {
    const res = await request(app).post("/api/org-email-otp/send").send({});
    expect(res.status).toBe(200);
    expect(controller.sendOrgEmailOtp).toHaveBeenCalled();
  });

  test("POST /api/org-email-otp/verify -> verifyOrgEmailOtp", async () => {
    const res = await request(app).post("/api/org-email-otp/verify").send({});
    expect(res.status).toBe(200);
    expect(controller.verifyOrgEmailOtp).toHaveBeenCalled();
  });
});
