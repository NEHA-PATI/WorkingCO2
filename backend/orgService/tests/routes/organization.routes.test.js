jest.mock("../../controllers/organizationController", () => ({
  organizationLogin: jest.fn((req, res) => res.status(200).json({ ok: true })),
  getAllOrganizations: jest.fn((req, res) => res.status(200).json({ ok: true })),
  getOrganizationByOrgId: jest.fn((req, res) =>
    res.status(200).json({ ok: true })
  ),
}));

const express = require("express");
const request = require("supertest");
const routes = require("../../routes/organizationRoutes");
const controller = require("../../controllers/organizationController");

const app = express();
app.use(express.json());
app.use("/api/organizations", routes);

describe("organizationRoutes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/organizations/login -> organizationLogin", async () => {
    const res = await request(app).post("/api/organizations/login").send({});
    expect(res.status).toBe(200);
    expect(controller.organizationLogin).toHaveBeenCalled();
  });

  test("GET /api/organizations -> getAllOrganizations", async () => {
    const res = await request(app).get("/api/organizations");
    expect(res.status).toBe(200);
    expect(controller.getAllOrganizations).toHaveBeenCalled();
  });

  test("GET /api/organizations/:org_id -> getOrganizationByOrgId", async () => {
    const res = await request(app).get("/api/organizations/ORG0001");
    expect(res.status).toBe(200);
    expect(controller.getOrganizationByOrgId).toHaveBeenCalled();
  });
});
