jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

const pool = require("../config/db");
const bcrypt = require("bcryptjs");
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

describe("organizationController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe("organizationLogin", () => {
    test("Missing credentials -> 400", async () => {
      const req = { body: { org_id: "ORG0001" } };
      const res = createRes();

      await organizationLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "org_id and password are required",
      });
    });

    test("Org not found -> 401", async () => {
      const req = { body: { org_id: "ORG0001", password: "pass" } };
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [] });

      await organizationLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    test("Wrong password -> 401", async () => {
      const req = { body: { org_id: "ORG0001", password: "pass" } };
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [{ password_hash: "hash" }] });
      bcrypt.compare.mockResolvedValue(false);

      await organizationLogin(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith("pass", "hash");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    test("Success -> 200", async () => {
      const req = { body: { org_id: "ORG0001", password: "pass" } };
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [{ password_hash: "hash" }] });
      bcrypt.compare.mockResolvedValue(true);

      await organizationLogin(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        org_id: "ORG0001",
      });
    });

    test("DB error -> 500", async () => {
      const req = { body: { org_id: "ORG0001", password: "pass" } };
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await organizationLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("getAllOrganizations", () => {
    test("Success -> 200", async () => {
      const req = {};
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [{ org_id: "ORG0001" }] });

      await getAllOrganizations(req, res);

      expect(res.json).toHaveBeenCalledWith([{ org_id: "ORG0001" }]);
    });

    test("DB error -> 500", async () => {
      const req = {};
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await getAllOrganizations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("getOrganizationByOrgId", () => {
    test("Success -> 200", async () => {
      const req = { params: { org_id: "ORG0001" } };
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [{ org_id: "ORG0001" }] });

      await getOrganizationByOrgId(req, res);

      expect(res.json).toHaveBeenCalledWith({ org_id: "ORG0001" });
    });

    test("Not found -> 404", async () => {
      const req = { params: { org_id: "ORG0009" } };
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [] });

      await getOrganizationByOrgId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Organization not found",
      });
    });

    test("DB error -> 500", async () => {
      const req = { params: { org_id: "ORG0001" } };
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await getOrganizationByOrgId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});
