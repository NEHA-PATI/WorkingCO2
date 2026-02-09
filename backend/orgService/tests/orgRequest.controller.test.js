jest.mock("../config/db", () => ({
  query: jest.fn(),
  connect: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const {
  createOrgRequest,
  getAllOrgRequests,
  approveOrgRequest,
  rejectOrgRequest,
} = require("../controllers/orgRequestController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("orgRequestController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  describe("createOrgRequest", () => {
    test("Missing required fields -> 400", async () => {
      const req = { body: { org_name: "Org" } };
      const res = createRes();

      await createOrgRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Missing required fields"),
        })
      );
      expect(pool.query).not.toHaveBeenCalled();
    });

    test("Valid request -> 201", async () => {
      const req = {
        body: {
          org_name: "Org",
          org_type: "NGO",
          org_mail: "org@example.com",
          org_contact_number: "1234567890",
          org_contact_person: "Ada",
          org_designation: "Lead",
          org_country: "IN",
          org_state: "KA",
          org_city: "BLR",
        },
      };
      const res = createRes();

      pool.query
        .mockResolvedValueOnce({ rows: [{ org_request_id: "OREQ000009" }] })
        .mockResolvedValueOnce({ rows: [] });

      await createOrgRequest(req, res);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Organization request submitted successfully",
        org_request_id: "OREQ000010",
      });
    });

    test("DB failure -> 500", async () => {
      const req = {
        body: {
          org_name: "Org",
          org_type: "NGO",
          org_mail: "org@example.com",
          org_contact_number: "123",
          org_contact_person: "Ada",
          org_designation: "Lead",
          org_country: "IN",
          org_state: "KA",
          org_city: "BLR",
        },
      };
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await createOrgRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("getAllOrgRequests", () => {
    test("Success -> 200", async () => {
      const req = {};
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [{ id: 1 }] });

      await getAllOrgRequests(req, res);

      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    test("DB error -> 500", async () => {
      const req = {};
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await getAllOrgRequests(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("approveOrgRequest", () => {
    test("Missing password -> 400", async () => {
      const req = { params: { id: "OREQ000001" }, body: {} };
      const res = createRes();

      await approveOrgRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Password is required to approve organization",
      });
    });

    test("Request not found -> 404", async () => {
      const req = { params: { id: "OREQ000404" }, body: { password: "pass" } };
      const res = createRes();

      const client = {
        query: jest.fn()
          .mockResolvedValueOnce()
          .mockResolvedValueOnce({ rows: [] })
          .mockResolvedValueOnce(),
        release: jest.fn(),
      };
      pool.connect.mockResolvedValue(client);

      await approveOrgRequest(req, res);

      expect(client.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Request not found" });
      expect(client.release).toHaveBeenCalled();
    });

    test("Already processed -> 400", async () => {
      const req = { params: { id: "OREQ000002" }, body: { password: "pass" } };
      const res = createRes();

      const client = {
        query: jest.fn()
          .mockResolvedValueOnce()
          .mockResolvedValueOnce({ rows: [{ request_status: "approved" }] })
          .mockResolvedValueOnce(),
        release: jest.fn(),
      };
      pool.connect.mockResolvedValue(client);

      await approveOrgRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Request already processed",
      });
      expect(client.release).toHaveBeenCalled();
    });

    test("Success -> 200", async () => {
      const req = { params: { id: "OREQ000003" }, body: { password: "pass" } };
      const res = createRes();

      const client = {
        query: jest.fn()
          .mockResolvedValueOnce()
          .mockResolvedValueOnce({ rows: [{ request_status: "pending" }] })
          .mockResolvedValueOnce()
          .mockResolvedValueOnce({ rows: [{ org_id: "ORG0003" }] })
          .mockResolvedValueOnce()
          .mockResolvedValueOnce(),
        release: jest.fn(),
      };
      pool.connect.mockResolvedValue(client);
      bcrypt.hash.mockResolvedValue("hashed");

      await approveOrgRequest(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("pass", 10);
      expect(res.json).toHaveBeenCalledWith({
        message: "Organization approved and created successfully",
        org_id: "ORG0004",
      });
    });

    test("Transaction failure -> 500", async () => {
      const req = { params: { id: "OREQ000004" }, body: { password: "pass" } };
      const res = createRes();

      const client = {
        query: jest.fn()
          .mockResolvedValueOnce()
          .mockResolvedValueOnce({ rows: [{ request_status: "pending" }] })
          .mockRejectedValueOnce(new Error("tx error")),
        release: jest.fn(),
      };
      pool.connect.mockResolvedValue(client);

      await approveOrgRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
      expect(client.release).toHaveBeenCalled();
    });
  });

  describe("rejectOrgRequest", () => {
    test("Success -> 200", async () => {
      const req = { params: { id: "OREQ000005" } };
      const res = createRes();

      pool.query.mockResolvedValue({ rowCount: 1 });

      await rejectOrgRequest(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Organization request rejected",
      });
    });

    test("Invalid state -> 400", async () => {
      const req = { params: { id: "OREQ000006" } };
      const res = createRes();

      pool.query.mockResolvedValue({ rowCount: 0 });

      await rejectOrgRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Request not found or already processed",
      });
    });

    test("DB error -> 500", async () => {
      const req = { params: { id: "OREQ000007" } };
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await rejectOrgRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });
});
