const express = require("express");
const request = require("supertest");

jest.mock("../src/models/solarModel", () => ({
  create: jest.fn(),
  getCountByUser: jest.fn(),
  getByUserId: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  updateStatus: jest.fn(),
}));

const SolarModel = require("../src/models/solarModel");
const SolarController = require("../src/controllers/solarController");
const { validateSolarCreate } = require("../src/middleware/validator");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Asset Service - Solar Panel Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("CREATE SOLAR PANEL", () => {
    test("Missing required fields -> 400", async () => {
      const req = {
        body: {
          U_ID: "user_1",
          Installed_Capacity: null,
          Installation_Date: null,
        },
      };
      const res = createRes();

      await SolarController.createSolar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message:
            "Missing required fields: U_ID, Installed_Capacity, Installation_Date",
        })
      );
      expect(SolarModel.create).not.toHaveBeenCalled();
    });

    test("Missing u_id -> 400", async () => {
      const req = {
        body: {
          Installed_Capacity: 5.5,
          Installation_Date: "2025-01-15",
        },
      };
      const res = createRes();

      await SolarController.createSolar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message:
            "Missing required fields: U_ID, Installed_Capacity, Installation_Date",
        })
      );
      expect(SolarModel.create).not.toHaveBeenCalled();
    });

    test("Invalid payload -> 400 (validation middleware)", async () => {
      const app = express();
      app.use(express.json());
      app.post("/solarpanel", validateSolarCreate, (req, res) =>
        res.status(201).json({ status: "success" })
      );

      const response = await request(app).post("/solarpanel").send({
        U_ID: "user_1",
        Installed_Capacity: -1,
        Installation_Date: "not-a-date",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "Installed_Capacity" }),
          expect.objectContaining({ field: "Installation_Date" }),
        ])
      );
    });

    test("Successful solar panel creation -> 201", async () => {
      const req = {
        body: {
          U_ID: "user_1",
          Installed_Capacity: 5.5,
          Installation_Date: "2025-01-15",
          Energy_Generation_Value: 1200,
          Grid_Emission_Factor: 0.5,
          Inverter_Type: "string",
        },
      };
      const res = createRes();

      const newSolar = { suid: "SUID_123", u_id: "user_1" };
      SolarModel.create.mockResolvedValue(newSolar);
      SolarModel.getCountByUser.mockResolvedValue(3);

      await SolarController.createSolar(req, res);

      expect(SolarModel.create).toHaveBeenCalledWith(req.body);
      expect(SolarModel.getCountByUser).toHaveBeenCalledWith("user_1");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Solar Panel created successfully",
          data: newSolar,
          solarCount: 3,
        })
      );
    });

    test("Database error -> 500", async () => {
      const req = {
        body: {
          U_ID: "user_1",
          Installed_Capacity: 5.5,
          Installation_Date: "2025-01-15",
        },
      };
      const res = createRes();

      SolarModel.create.mockRejectedValue(new Error("db failure"));

      await SolarController.createSolar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to create Solar Panel",
        })
      );
    });
  });

  describe("GET SOLAR PANELS", () => {
    test("Successful fetch -> 200", async () => {
      const req = { params: { userId: "user_1" } };
      const res = createRes();

      const rows = [{ suid: "SUID_1" }, { suid: "SUID_2" }];
      SolarModel.getByUserId.mockResolvedValue(rows);

      await SolarController.getSolarByUser(req, res);

      expect(SolarModel.getByUserId).toHaveBeenCalledWith("user_1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Solar Panels retrieved successfully",
          count: 2,
          data: rows,
        })
      );
    });

    test("Empty result -> 200 with empty array", async () => {
      const req = { params: { userId: "user_2" } };
      const res = createRes();

      SolarModel.getByUserId.mockResolvedValue([]);

      await SolarController.getSolarByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Solar Panels retrieved successfully",
          count: 0,
          data: [],
        })
      );
    });

    test("Database error -> 500", async () => {
      const req = { params: { userId: "user_1" } };
      const res = createRes();

      SolarModel.getByUserId.mockRejectedValue(new Error("db failure"));

      await SolarController.getSolarByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to fetch Solar Panels",
        })
      );
    });
  });

  describe("UPDATE SOLAR PANEL STATUS", () => {
    test("Missing parameters -> 400", async () => {
      const req = { params: { suid: "SUID_1" }, body: {} };
      const res = createRes();

      await SolarController.updateSolarStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Status is required",
        })
      );
      expect(SolarModel.updateStatus).not.toHaveBeenCalled();
    });

    test("Invalid status -> 400", async () => {
      const req = {
        params: { suid: "SUID_1" },
        body: { status: "archived" },
      };
      const res = createRes();

      await SolarController.updateSolarStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message:
            "Invalid status. Must be one of: pending, approved, rejected",
        })
      );
      expect(SolarModel.updateStatus).not.toHaveBeenCalled();
    });

    test("Successful update -> 200", async () => {
      const req = {
        params: { suid: "SUID_1" },
        body: { status: "approved", changed_by: "admin_1", reason: "verified" },
      };
      const res = createRes();

      const updatedSolar = { suid: "SUID_1", status: "approved" };
      SolarModel.updateStatus.mockResolvedValue(updatedSolar);

      await SolarController.updateSolarStatus(req, res);

      expect(SolarModel.updateStatus).toHaveBeenCalledWith(
        "SUID_1",
        "approved",
        "admin_1",
        "verified"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Solar Panel status updated successfully",
          data: updatedSolar,
        })
      );
    });

    test("Record not found -> 404", async () => {
      const req = {
        params: { suid: "SUID_404" },
        body: { status: "approved" },
      };
      const res = createRes();

      SolarModel.updateStatus.mockResolvedValue(undefined);

      await SolarController.updateSolarStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Solar Panel not found",
        })
      );
    });

    test("Database error -> 500", async () => {
      const req = {
        params: { suid: "SUID_1" },
        body: { status: "approved" },
      };
      const res = createRes();

      SolarModel.updateStatus.mockRejectedValue(new Error("db failure"));

      await SolarController.updateSolarStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to update Solar Panel status",
        })
      );
    });
  });
});
