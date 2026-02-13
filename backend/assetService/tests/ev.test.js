const express = require("express");
const request = require("supertest");

jest.mock("../src/models/evModel", () => ({
  create: jest.fn(),
  getCountByUser: jest.fn(),
  getByUserId: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  updateStatus: jest.fn(),
}));

const EVModel = require("../src/models/evModel");
const EVController = require("../src/controllers/evController");
const { validateEVCreate } = require("../src/middleware/validator");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Asset Service - EV Asset Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("CREATE EV ASSET", () => {
    test("Missing required field u_id -> 400", async () => {
      const req = { body: { Category: "car" } };
      const res = createRes();

      await EVController.createEV(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Missing required field: u_id",
        })
      );
      expect(EVModel.create).not.toHaveBeenCalled();
    });

    test("Invalid payload -> 400 (validation middleware)", async () => {
      const app = express();
      app.use(express.json());
      app.post("/ev", validateEVCreate, (req, res) =>
        res.status(201).json({ status: "success" })
      );

      const response = await request(app).post("/ev").send({
        U_ID: "user_1",
        Manufacturers: "",
        Model: "",
        Purchase_Year: 1999,
        Range: 0,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "Manufacturers" }),
          expect.objectContaining({ field: "Model" }),
          expect.objectContaining({ field: "Purchase_Year" }),
          expect.objectContaining({ field: "Range" }),
        ])
      );
    });

    test("Successful creation -> 201", async () => {
      const req = {
        body: {
          U_ID: "user_1",
          Category: "car",
          Manufacturers: "Tesla",
          Model: "Model 3",
          Purchase_Year: "2024",
          Energy_Consumed: "120",
          Primary_Charging_Type: "level2",
          Range: "400",
          Grid_Emission_Factor: "0.5",
          Top_Speed: "220",
          Charging_Time: "7.5",
          Motor_Power: 150,
        },
      };
      const res = createRes();

      const newEV = { ev_id: 1, u_id: "user_1" };
      EVModel.create.mockResolvedValue(newEV);
      EVModel.getCountByUser.mockResolvedValue(2);

      await EVController.createEV(req, res);

      expect(EVModel.create).toHaveBeenCalledWith({
        u_id: "user_1",
        category: "car",
        manufacturers: "Tesla",
        model: "Model 3",
        purchase_year: 2024,
        energy_consumed: 120,
        primary_charging_type: "level2",
        range: 400,
        grid_emission_factor: 0.5,
        top_speed: 220,
        charging_time: 7.5,
        motor_power: "150",
      });
      expect(EVModel.getCountByUser).toHaveBeenCalledWith("user_1");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "EV created successfully",
          data: newEV,
          evCount: 2,
        })
      );
    });

    test("Database error -> 500", async () => {
      const req = { body: { U_ID: "user_1" } };
      const res = createRes();

      EVModel.create.mockRejectedValue(new Error("db failure"));

      await EVController.createEV(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "db failure",
        })
      );
    });
  });

  describe("GET EV ASSETS", () => {
    test("Success -> 200", async () => {
      const req = { params: { userId: "user_1" } };
      const res = createRes();

      const rows = [{ ev_id: 1 }, { ev_id: 2 }];
      EVModel.getByUserId.mockResolvedValue(rows);

      await EVController.getEVsByUser(req, res);

      expect(EVModel.getByUserId).toHaveBeenCalledWith("user_1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "EVs retrieved successfully",
          count: 2,
          data: rows,
        })
      );
    });

    test("Empty result -> 200", async () => {
      const req = { params: { userId: "user_2" } };
      const res = createRes();

      EVModel.getByUserId.mockResolvedValue([]);

      await EVController.getEVsByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "EVs retrieved successfully",
          count: 0,
          data: [],
        })
      );
    });

    test("Database error -> 500", async () => {
      const req = { params: { userId: "user_1" } };
      const res = createRes();

      EVModel.getByUserId.mockRejectedValue(new Error("db failure"));

      await EVController.getEVsByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to fetch EVs",
        })
      );
    });
  });

  describe("UPDATE EV STATUS", () => {
    test("Missing params -> 400", async () => {
      const req = { params: { ev_id: "EV_1" }, body: {} };
      const res = createRes();

      await EVController.updateEVStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Status is required",
        })
      );
      expect(EVModel.updateStatus).not.toHaveBeenCalled();
    });

    test("Invalid status -> 400", async () => {
      const req = {
        params: { ev_id: "EV_1" },
        body: { status: "archived" },
      };
      const res = createRes();

      await EVController.updateEVStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message:
            "Invalid status. Must be one of: pending, approved, rejected",
        })
      );
      expect(EVModel.updateStatus).not.toHaveBeenCalled();
    });

    test("Success -> 200", async () => {
      const req = {
        params: { ev_id: "EV_1" },
        body: { status: "approved", changed_by: "admin_1", reason: "verified" },
      };
      const res = createRes();

      const updatedEV = { ev_id: "EV_1", status: "approved" };
      EVModel.updateStatus.mockResolvedValue(updatedEV);

      await EVController.updateEVStatus(req, res);

      expect(EVModel.updateStatus).toHaveBeenCalledWith(
        "EV_1",
        "approved",
        "admin_1",
        "verified"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "EV status updated successfully",
          data: updatedEV,
        })
      );
    });

    test("Not found -> 404", async () => {
      const req = {
        params: { ev_id: "EV_404" },
        body: { status: "approved" },
      };
      const res = createRes();

      EVModel.updateStatus.mockResolvedValue(undefined);

      await EVController.updateEVStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "EV not found",
        })
      );
    });

    test("DB error -> 500", async () => {
      const req = {
        params: { ev_id: "EV_1" },
        body: { status: "approved" },
      };
      const res = createRes();

      EVModel.updateStatus.mockRejectedValue(new Error("db failure"));

      await EVController.updateEVStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to update EV status",
        })
      );
    });
  });

  describe("DELETE EV ASSET", () => {
    test("Success -> 200", async () => {
      const req = { params: { ev_id: "EV_1" } };
      const res = createRes();

      const deletedEV = { ev_id: "EV_1" };
      EVModel.delete.mockResolvedValue(deletedEV);

      await EVController.deleteEV(req, res);

      expect(EVModel.delete).toHaveBeenCalledWith("EV_1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "EV deleted successfully",
          data: deletedEV,
        })
      );
    });

    test("Not found -> 404", async () => {
      const req = { params: { ev_id: "EV_404" } };
      const res = createRes();

      EVModel.delete.mockResolvedValue(undefined);

      await EVController.deleteEV(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "EV not found",
        })
      );
    });

    test("Database error -> 500", async () => {
      const req = { params: { ev_id: "EV_1" } };
      const res = createRes();

      EVModel.delete.mockRejectedValue(new Error("db failure"));

      await EVController.deleteEV(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to delete EV",
        })
      );
    });
  });
});
