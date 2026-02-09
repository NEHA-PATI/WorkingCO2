jest.mock("../models/Job", () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

const Job = require("../models/Job");
const jobController = require("../controllers/jobController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("Career Service - Jobs Controller Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET JOBS", () => {
    test("Successful fetch -> 200 with count", async () => {
      const req = { query: { status: "Open", department: "Engineering" } };
      const res = createRes();
      const next = jest.fn();

      const rows = [
        { id: 1, type: "Full-time" },
        { id: 2, type: "Contract" },
      ];
      Job.findAll.mockResolvedValue(rows);

      await jobController.getAllJobs(req, res, next);

      expect(Job.findAll).toHaveBeenCalledWith({
        status: "Open",
        department: "Engineering",
      });
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        count: 2,
        data: rows,
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("Type filter applied in controller", async () => {
      const req = { query: { type: "Full-time" } };
      const res = createRes();
      const next = jest.fn();

      const rows = [
        { id: 1, type: "Full-time" },
        { id: 2, type: "Contract" },
      ];
      Job.findAll.mockResolvedValue(rows);

      await jobController.getAllJobs(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        count: 1,
        data: [{ id: 1, type: "Full-time" }],
      });
    });

    test("Database error -> next(err)", async () => {
      const req = { query: {} };
      const res = createRes();
      const next = jest.fn();

      const err = new Error("db failure");
      Job.findAll.mockRejectedValue(err);

      await jobController.getAllJobs(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("GET JOB BY ID", () => {
    test("Job not found -> 404", async () => {
      const req = { params: { id: "123" } };
      const res = createRes();
      const next = jest.fn();

      Job.findById.mockResolvedValue(undefined);

      await jobController.getJobById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        message: "Job not found",
      });
    });

    test("Success -> 200", async () => {
      const req = { params: { id: "123" } };
      const res = createRes();
      const next = jest.fn();

      const job = { id: 123, title: "Engineer" };
      Job.findById.mockResolvedValue(job);

      await jobController.getJobById(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: job,
      });
    });

    test("Database error -> next(err)", async () => {
      const req = { params: { id: "123" } };
      const res = createRes();
      const next = jest.fn();

      const err = new Error("db failure");
      Job.findById.mockRejectedValue(err);

      await jobController.getJobById(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("CREATE JOB", () => {
    test("Successful creation -> 201", async () => {
      const req = {
        body: { title: "Engineer", department: "Engineering" },
      };
      const res = createRes();
      const next = jest.fn();

      const created = { id: 1, title: "Engineer" };
      Job.create.mockResolvedValue(created);

      await jobController.createJob(req, res, next);

      expect(Job.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: created,
      });
    });

    test("Database error -> next(err)", async () => {
      const req = { body: { title: "Engineer" } };
      const res = createRes();
      const next = jest.fn();

      const err = new Error("db failure");
      Job.create.mockRejectedValue(err);

      await jobController.createJob(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("UPDATE JOB", () => {
    test("Job not found -> 404", async () => {
      const req = { params: { id: "123" }, body: { title: "Updated" } };
      const res = createRes();
      const next = jest.fn();

      Job.update.mockResolvedValue(undefined);

      await jobController.updateJob(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        message: "Job not found",
      });
    });

    test("Success -> 200", async () => {
      const req = { params: { id: "123" }, body: { title: "Updated" } };
      const res = createRes();
      const next = jest.fn();

      const updated = { id: 123, title: "Updated" };
      Job.update.mockResolvedValue(updated);

      await jobController.updateJob(req, res, next);

      expect(Job.update).toHaveBeenCalledWith("123", req.body);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: updated,
      });
    });

    test("Database error -> next(err)", async () => {
      const req = { params: { id: "123" }, body: { title: "Updated" } };
      const res = createRes();
      const next = jest.fn();

      const err = new Error("db failure");
      Job.update.mockRejectedValue(err);

      await jobController.updateJob(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("DELETE JOB", () => {
    test("Job not found -> 404", async () => {
      const req = { params: { id: "123" } };
      const res = createRes();
      const next = jest.fn();

      Job.delete.mockResolvedValue(undefined);

      await jobController.deleteJob(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        message: "Job not found",
      });
    });

    test("Success -> 204", async () => {
      const req = { params: { id: "123" } };
      const res = createRes();
      const next = jest.fn();

      Job.delete.mockResolvedValue({ id: 123 });

      await jobController.deleteJob(req, res, next);

      expect(Job.delete).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    test("Database error -> next(err)", async () => {
      const req = { params: { id: "123" } };
      const res = createRes();
      const next = jest.fn();

      const err = new Error("db failure");
      Job.delete.mockRejectedValue(err);

      await jobController.deleteJob(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
