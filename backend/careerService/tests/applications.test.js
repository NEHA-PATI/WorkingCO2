jest.mock("../models/Application", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  updateStatus: jest.fn(),
}));

const Application = require("../models/Application");
const applicationController = require("../controllers/applicationController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Career Service - Applications Controller Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET APPLICATIONS", () => {
    test("Successful fetch -> 200 with count", async () => {
      const req = {};
      const res = createRes();
      const next = jest.fn();

      const rows = [{ id: 1 }, { id: 2 }];
      Application.findAll.mockResolvedValue(rows);

      await applicationController.getAllApplications(req, res, next);

      expect(Application.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        count: 2,
        data: rows,
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("Database error -> next(err)", async () => {
      const req = {};
      const res = createRes();
      const next = jest.fn();

      const err = new Error("db failure");
      Application.findAll.mockRejectedValue(err);

      await applicationController.getAllApplications(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("APPLY FOR JOB", () => {
    test("Successful application -> 201", async () => {
      const req = {
        body: {
          job_id: 1,
          name: "Ada",
          email: "ada@example.com",
          resume_url: "https://example.com/resume.pdf",
          message: "Hello",
        },
      };
      const res = createRes();
      const next = jest.fn();

      const created = { id: 10, job_id: 1 };
      Application.create.mockResolvedValue(created);

      await applicationController.applyForJob(req, res, next);

      expect(Application.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: created,
      });
    });

    test("Database error -> next(err)", async () => {
      const req = { body: { job_id: 1 } };
      const res = createRes();
      const next = jest.fn();

      const err = new Error("db failure");
      Application.create.mockRejectedValue(err);

      await applicationController.applyForJob(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("UPDATE APPLICATION STATUS", () => {
    test("Missing status -> 400", async () => {
      const req = { params: { id: "1" }, body: {} };
      const res = createRes();
      const next = jest.fn();

      await applicationController.updateApplicationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        message: "Status is required",
      });
    });

    test("Application not found -> 404", async () => {
      const req = { params: { id: "1" }, body: { status: "Reviewed" } };
      const res = createRes();
      const next = jest.fn();

      Application.updateStatus.mockResolvedValue(undefined);

      await applicationController.updateApplicationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        message: "Application not found",
      });
    });

    test("Success -> 200", async () => {
      const req = { params: { id: "1" }, body: { status: "Reviewed" } };
      const res = createRes();
      const next = jest.fn();

      const updated = { id: 1, status: "Reviewed" };
      Application.updateStatus.mockResolvedValue(updated);

      await applicationController.updateApplicationStatus(req, res, next);

      expect(Application.updateStatus).toHaveBeenCalledWith("1", "Reviewed");
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: updated,
      });
    });

    test("Database error -> next(err)", async () => {
      const req = { params: { id: "1" }, body: { status: "Reviewed" } };
      const res = createRes();
      const next = jest.fn();

      const err = new Error("db failure");
      Application.updateStatus.mockRejectedValue(err);

      await applicationController.updateApplicationStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
