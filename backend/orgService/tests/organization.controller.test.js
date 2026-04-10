jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "test-token"),
}));

const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  organizationLogin,
  getAllOrganizations,
  getOrganizationByOrgId,
} = require("../controllers/organizationController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const expectErrorResponse = (res, status, message) => {
  expect(res.status).toHaveBeenCalledWith(status);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      success: false,
      message,
      data: null,
    })
  );
};

describe("organizationController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "7d";
  });

  afterEach(() => {
    console.error.mockRestore();
    delete process.env.JWT_SECRET;
    delete process.env.JWT_EXPIRES_IN;
  });

  describe("organizationLogin", () => {
    test("Missing credentials -> 400", async () => {
      const req = { body: { org_mail: "admin@example.com" } };
      const res = createRes();

      await organizationLogin(req, res);

      expectErrorResponse(res, 400, "org_mail and password are required");
    });

    test("Org not found -> 401", async () => {
      const req = { body: { org_mail: "admin@example.com", password: "pass" } };
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [] });

      await organizationLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Invalid credentials",
          data: null,
        })
      );
    });

    test("Wrong password -> 401", async () => {
      const req = { body: { org_mail: "admin@example.com", password: "pass" } };
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [{ password_hash: "hash" }] });
      bcrypt.compare.mockResolvedValue(false);

      await organizationLogin(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith("pass", "hash");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Invalid credentials",
          data: null,
        })
      );
    });

    test("Success -> 200", async () => {
      const req = { body: { org_mail: "admin@example.com", password: "pass" } };
      const res = createRes();

      pool.query.mockResolvedValue({
        rows: [
          {
            org_id: "ORG0001",
            org_mail: "admin@example.com",
            password_hash: "hash",
          },
        ],
      });
      bcrypt.compare.mockResolvedValue(true);

      await organizationLogin(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "ORG0001",
          u_id: "ORG0001",
          org_mail: "admin@example.com",
          role: "organization",
          status: "active",
        }),
        "test-secret",
        { expiresIn: "7d" }
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Login successful",
          data: {
            token: expect.any(String),
            org: expect.objectContaining({
              org_id: "ORG0001",
              org_mail: "admin@example.com",
            }),
          },
        })
      );
    });

    test("DB error -> 500", async () => {
      const req = { body: { org_mail: "admin@example.com", password: "pass" } };
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await organizationLogin(req, res);

      expectErrorResponse(res, 500, "Internal server error");
    });
  });

  describe("getAllOrganizations", () => {
    test("Success -> 200", async () => {
      const req = {};
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [{ org_id: "ORG0001" }] });

      await getAllOrganizations(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Organizations fetched successfully",
          data: [{ org_id: "ORG0001" }],
        })
      );
    });

    test("DB error -> 500", async () => {
      const req = {};
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await getAllOrganizations(req, res);

      expectErrorResponse(res, 500, "Internal server error");
    });
  });

  describe("getOrganizationByOrgId", () => {
    test("Success -> 200", async () => {
      const req = { params: { org_id: "ORG0001" } };
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [{ org_id: "ORG0001" }] });

      await getOrganizationByOrgId(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Organization fetched successfully",
          data: { org_id: "ORG0001" },
        })
      );
    });

    test("Not found -> 404", async () => {
      const req = { params: { org_id: "ORG0009" } };
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [] });

      await getOrganizationByOrgId(req, res);

      expectErrorResponse(res, 404, "Organization not found");
    });

    test("DB error -> 500", async () => {
      const req = { params: { org_id: "ORG0001" } };
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await getOrganizationByOrgId(req, res);

      expectErrorResponse(res, 500, "Internal server error");
    });
  });
});
