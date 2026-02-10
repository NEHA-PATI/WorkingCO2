jest.mock("../../controllers/orgRequestController", () => ({
  createOrgRequest: jest.fn((req, res) => res.status(201).json({ ok: true })),
  getAllOrgRequests: jest.fn((req, res) => res.status(200).json({ ok: true })),
  getOrgRequestById: jest.fn((req, res) => res.status(200).json({ ok: true })),
  approveOrgRequest: jest.fn((req, res) => res.status(200).json({ ok: true })),
  rejectOrgRequest: jest.fn((req, res) => res.status(200).json({ ok: true })),
  deleteOrgRequest: jest.fn((req, res) => res.status(200).json({ ok: true })),
}));

const express = require("express");
const request = require("supertest");
const routes = require("../../routes/orgRequestRoutes");
const controller = require("../../controllers/orgRequestController");

const app = express();
app.use(express.json());
app.use("/api/org-requests", routes);

describe("orgRequestRoutes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/org-requests -> createOrgRequest", async () => {
    const res = await request(app).post("/api/org-requests").send({});
    expect(res.status).toBe(201);
    expect(controller.createOrgRequest).toHaveBeenCalled();
  });

  test("GET /api/org-requests -> getAllOrgRequests", async () => {
    const res = await request(app).get("/api/org-requests");
    expect(res.status).toBe(200);
    expect(controller.getAllOrgRequests).toHaveBeenCalled();
  });

  test("GET /api/org-requests/:id -> getOrgRequestById", async () => {
    const res = await request(app).get("/api/org-requests/OREQ0001");
    expect(res.status).toBe(200);
    expect(controller.getOrgRequestById).toHaveBeenCalled();
  });

  test("PUT /api/org-requests/:id/approve -> approveOrgRequest", async () => {
    const res = await request(app).put("/api/org-requests/OREQ0001/approve");
    expect(res.status).toBe(200);
    expect(controller.approveOrgRequest).toHaveBeenCalled();
  });

  test("PUT /api/org-requests/:id/reject -> rejectOrgRequest", async () => {
    const res = await request(app).put("/api/org-requests/OREQ0001/reject");
    expect(res.status).toBe(200);
    expect(controller.rejectOrgRequest).toHaveBeenCalled();
  });

  test("DELETE /api/org-requests/:id -> deleteOrgRequest", async () => {
    const res = await request(app).delete("/api/org-requests/OREQ0001");
    expect(res.status).toBe(200);
    expect(controller.deleteOrgRequest).toHaveBeenCalled();
  });
});
