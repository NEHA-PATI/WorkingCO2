const express = require("express");
const request = require("supertest");

jest.mock("../src/models/treeModel", () => ({
  create: jest.fn(),
  getCountByUser: jest.fn(),
  getByUserId: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  addImage: jest.fn(),
  deleteImage: jest.fn(),
  updateStatus: jest.fn(),
}));

const TreeModel = require("../src/models/treeModel");
const TreeController = require("../src/controllers/treeController");
const { validateTreeCreate } = require("../src/middleware/validator");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Asset Service - Tree Asset Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("CREATE TREE ASSET", () => {
    test("Missing required fields -> 400", async () => {
      const req = {
        body: {
          UID: "user_1",
          TreeName: null,
          PlantingDate: null,
          Height: null,
        },
      };
      const res = createRes();

      await TreeController.createTree(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Missing required fields: UID, TreeName, PlantingDate, Height",
        })
      );
      expect(TreeModel.create).not.toHaveBeenCalled();
    });

    test("Invalid payload -> 400 (validation middleware)", async () => {
      const app = express();
      app.use(express.json());
      app.post("/tree", validateTreeCreate, (req, res) =>
        res.status(201).json({ status: "success" })
      );

      const response = await request(app).post("/tree").send({
        UID: "user_1",
        TreeName: "",
        PlantingDate: "not-a-date",
        Height: -1,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "TreeName" }),
          expect.objectContaining({ field: "PlantingDate" }),
          expect.objectContaining({ field: "Height" }),
        ])
      );
    });

    test("Successful creation -> 201", async () => {
      const req = {
        body: {
          UID: "user_1",
          TreeName: "Neem",
          BotanicalName: "Azadirachta indica",
          PlantingDate: "2025-01-10",
          Height: 2.5,
          DBH: 10,
          Location: "Pune",
          CreatedBy: "user",
          imageIds: [],
        },
      };
      const res = createRes();

      const newTree = { tid: 1, u_id: "user_1" };
      TreeModel.create.mockResolvedValue(newTree);
      TreeModel.getCountByUser.mockResolvedValue(4);

      await TreeController.createTree(req, res);

      expect(TreeModel.create).toHaveBeenCalledWith(req.body);
      expect(TreeModel.getCountByUser).toHaveBeenCalledWith("user_1");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Tree created successfully",
          data: newTree,
          treeCount: 4,
        })
      );
    });

    test("Database error -> 500", async () => {
      const req = {
        body: {
          UID: "user_1",
          TreeName: "Neem",
          PlantingDate: "2025-01-10",
          Height: 2.5,
        },
      };
      const res = createRes();

      TreeModel.create.mockRejectedValue(new Error("db failure"));

      await TreeController.createTree(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to create Tree",
        })
      );
    });
  });

  describe("GET TREE ASSETS", () => {
    test("Success -> 200", async () => {
      const req = { params: { userId: "user_1" } };
      const res = createRes();

      const rows = [{ tid: 1 }, { tid: 2 }];
      TreeModel.getByUserId.mockResolvedValue(rows);

      await TreeController.getTreesByUser(req, res);

      expect(TreeModel.getByUserId).toHaveBeenCalledWith("user_1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Trees retrieved successfully",
          count: 2,
          data: rows,
        })
      );
    });

    test("Empty result -> 200", async () => {
      const req = { params: { userId: "user_2" } };
      const res = createRes();

      TreeModel.getByUserId.mockResolvedValue([]);

      await TreeController.getTreesByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Trees retrieved successfully",
          count: 0,
          data: [],
        })
      );
    });

    test("Database error -> 500", async () => {
      const req = { params: { userId: "user_1" } };
      const res = createRes();

      TreeModel.getByUserId.mockRejectedValue(new Error("db failure"));

      await TreeController.getTreesByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to fetch Trees",
        })
      );
    });
  });

  describe("UPDATE TREE STATUS", () => {
    test("Missing params -> 400", async () => {
      const req = { params: { tid: "TUID_1" }, body: {} };
      const res = createRes();

      await TreeController.updateTreeStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Status is required",
        })
      );
      expect(TreeModel.updateStatus).not.toHaveBeenCalled();
    });

    test("Invalid status -> 400", async () => {
      const req = {
        params: { tid: "TUID_1" },
        body: { status: "archived" },
      };
      const res = createRes();

      await TreeController.updateTreeStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message:
            "Invalid status. Must be one of: pending, approved, rejected",
        })
      );
      expect(TreeModel.updateStatus).not.toHaveBeenCalled();
    });

    test("Success -> 200", async () => {
      const req = {
        params: { tid: "TUID_1" },
        body: { status: "approved", changed_by: "admin_1", reason: "verified" },
      };
      const res = createRes();

      const updatedTree = { tid: "TUID_1", status: "approved" };
      TreeModel.updateStatus.mockResolvedValue(updatedTree);

      await TreeController.updateTreeStatus(req, res);

      expect(TreeModel.updateStatus).toHaveBeenCalledWith(
        "TUID_1",
        "approved",
        "admin_1",
        "verified"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Tree status updated successfully",
          data: updatedTree,
        })
      );
    });

    test("Not found -> 404", async () => {
      const req = {
        params: { tid: "TUID_404" },
        body: { status: "approved" },
      };
      const res = createRes();

      TreeModel.updateStatus.mockResolvedValue(undefined);

      await TreeController.updateTreeStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Tree not found",
        })
      );
    });

    test("DB error -> 500", async () => {
      const req = {
        params: { tid: "TUID_1" },
        body: { status: "approved" },
      };
      const res = createRes();

      TreeModel.updateStatus.mockRejectedValue(new Error("db failure"));

      await TreeController.updateTreeStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to update Tree status",
        })
      );
    });
  });
});
