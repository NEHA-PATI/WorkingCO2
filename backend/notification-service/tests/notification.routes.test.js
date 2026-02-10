jest.mock("../src/utils/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../src/models/Notification", () => ({
  getAll: jest.fn(),
  getUnread: jest.fn(),
  getByUserId: jest.fn(),
  getStats: jest.fn(),
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("../src/services/eventService", () => ({
  processEvent: jest.fn(),
}));

jest.mock("../src/middleware/auth", () => {
  return (req, res, next) => {
    if (req.headers["x-auth"] === "fail") {
      return res.status(401).json({ status: "error", message: "Invalid or expired token" });
    }
    const role = req.headers["x-role"] || "USER";
    const id = parseInt(req.headers["x-user-id"] || "1", 10);
    req.user = { id, role, email: "test@example.com" };
    next();
  };
});

const express = require("express");
const request = require("supertest");
const router = require("../src/routes/notificationRoutes");
const Notification = require("../src/models/Notification");
const EventService = require("../src/services/eventService");
const { MESSAGES, ROLES } = require("../src/config/constants");

const app = express();
app.use(express.json());
app.use("/api/notifications", router);

describe("Notification Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/notifications/event", () => {
    test("Valid request -> 200", async () => {
      EventService.processEvent.mockResolvedValue();

      const res = await request(app)
        .post("/api/notifications/event")
        .send({ event_type: "user.signup" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Event processed successfully",
      });
    });

    test("Service failure -> 500", async () => {
      EventService.processEvent.mockRejectedValue(new Error("event failed"));

      const res = await request(app)
        .post("/api/notifications/event")
        .send({ event_type: "user.signup" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "error",
          message: MESSAGES.ERROR,
        })
      );
    });
  });

  describe("GET /api/notifications", () => {
    test("Unauthorized role -> 403", async () => {
      const res = await request(app)
        .get("/api/notifications")
        .set("x-role", ROLES.USER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        status: "error",
        message: MESSAGES.UNAUTHORIZED,
      });
    });

    test("Valid request -> 200", async () => {
      Notification.getAll.mockResolvedValue({
        data: [{ id: 1 }],
        total: 1,
        page: 1,
        limit: 20,
        pages: 1,
      });

      const res = await request(app)
        .get("/api/notifications")
        .set("x-role", ROLES.ADMIN);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: MESSAGES.NOTIFICATIONS_FETCHED,
        data: [{ id: 1 }],
        pagination: {
          total: 1,
          page: 1,
          limit: 20,
          pages: 1,
        },
      });
    });

    test("Service failure -> 500", async () => {
      Notification.getAll.mockRejectedValue(new Error("db failure"));

      const res = await request(app)
        .get("/api/notifications")
        .set("x-role", ROLES.ADMIN);

      expect(res.status).toBe(500);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "error",
          message: MESSAGES.ERROR,
        })
      );
    });
  });

  describe("GET /api/notifications/unread", () => {
    test("Valid request -> 200", async () => {
      Notification.getUnread.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const res = await request(app)
        .get("/api/notifications/unread")
        .set("x-role", ROLES.USER);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        unread_count: 2,
        data: [{ id: 1 }, { id: 2 }],
      });
    });

    test("Service failure -> 500", async () => {
      Notification.getUnread.mockRejectedValue(new Error("db failure"));

      const res = await request(app)
        .get("/api/notifications/unread")
        .set("x-role", ROLES.USER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "error",
          message: MESSAGES.ERROR,
        })
      );
    });
  });

  describe("GET /api/notifications/user/:userId", () => {
    test("Unauthorized user -> 403", async () => {
      const res = await request(app)
        .get("/api/notifications/user/2")
        .set("x-role", ROLES.USER)
        .set("x-user-id", "1");

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        status: "error",
        message: MESSAGES.UNAUTHORIZED,
      });
    });

    test("Valid request -> 200", async () => {
      Notification.getByUserId.mockResolvedValue({
        data: [{ id: 1 }],
        total: 1,
        page: 1,
        limit: 20,
        pages: 1,
      });

      const res = await request(app)
        .get("/api/notifications/user/1")
        .set("x-role", ROLES.USER)
        .set("x-user-id", "1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: MESSAGES.NOTIFICATIONS_FETCHED,
        data: [{ id: 1 }],
        pagination: {
          total: 1,
          page: 1,
          limit: 20,
          pages: 1,
        },
      });
    });

    test("Service failure -> 500", async () => {
      Notification.getByUserId.mockRejectedValue(new Error("db failure"));

      const res = await request(app)
        .get("/api/notifications/user/1")
        .set("x-role", ROLES.USER)
        .set("x-user-id", "1");

      expect(res.status).toBe(500);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "error",
          message: MESSAGES.ERROR,
        })
      );
    });
  });

  describe("GET /api/notifications/stats", () => {
    test("Unauthorized role -> 403", async () => {
      const res = await request(app)
        .get("/api/notifications/stats")
        .set("x-role", ROLES.USER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        status: "error",
        message: MESSAGES.UNAUTHORIZED,
      });
    });

    test("Valid request -> 200", async () => {
      Notification.getStats.mockResolvedValue([{ total: 10 }]);

      const res = await request(app)
        .get("/api/notifications/stats")
        .set("x-role", ROLES.ADMIN);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        data: [{ total: 10 }],
      });
    });
  });

  describe("PATCH /api/notifications/:id/read", () => {
    test("Not found -> 404", async () => {
      Notification.markAsRead.mockResolvedValue(undefined);

      const res = await request(app)
        .patch("/api/notifications/999/read")
        .set("x-role", ROLES.USER);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: "error",
        message: MESSAGES.NOT_FOUND,
      });
    });

    test("Valid request -> 200", async () => {
      Notification.markAsRead.mockResolvedValue([{ id: 1 }]);

      const res = await request(app)
        .patch("/api/notifications/1/read")
        .set("x-role", ROLES.USER);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: MESSAGES.NOTIFICATION_MARKED_READ,
        data: [{ id: 1 }],
      });
    });

    test("Service failure -> 500", async () => {
      Notification.markAsRead.mockRejectedValue(new Error("db failure"));

      const res = await request(app)
        .patch("/api/notifications/1/read")
        .set("x-role", ROLES.USER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "error",
          message: MESSAGES.ERROR,
        })
      );
    });
  });

  describe("PATCH /api/notifications/read/all", () => {
    test("Valid request -> 200", async () => {
      Notification.markAllAsRead.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const res = await request(app)
        .patch("/api/notifications/read/all")
        .set("x-role", ROLES.USER);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: MESSAGES.ALL_MARKED_READ,
        count: 2,
        data: [{ id: 1 }, { id: 2 }],
      });
    });

    test("Service failure -> 500", async () => {
      Notification.markAllAsRead.mockRejectedValue(new Error("db failure"));

      const res = await request(app)
        .patch("/api/notifications/read/all")
        .set("x-role", ROLES.USER);

      expect(res.status).toBe(500);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "error",
          message: MESSAGES.ERROR,
        })
      );
    });
  });

  describe("DELETE /api/notifications/:id", () => {
    test("Unauthorized role -> 403", async () => {
      const res = await request(app)
        .delete("/api/notifications/1")
        .set("x-role", ROLES.USER);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        status: "error",
        message: MESSAGES.UNAUTHORIZED,
      });
    });

    test("Not found -> 404", async () => {
      Notification.delete.mockResolvedValue(undefined);

      const res = await request(app)
        .delete("/api/notifications/1")
        .set("x-role", ROLES.ADMIN);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: "error",
        message: MESSAGES.NOT_FOUND,
      });
    });

    test("Valid request -> 200", async () => {
      Notification.delete.mockResolvedValue([{ id: 1 }]);

      const res = await request(app)
        .delete("/api/notifications/1")
        .set("x-role", ROLES.ADMIN);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Notification deleted successfully",
        data: [{ id: 1 }],
      });
    });

    test("Service failure -> 500", async () => {
      Notification.delete.mockRejectedValue(new Error("db failure"));

      const res = await request(app)
        .delete("/api/notifications/1")
        .set("x-role", ROLES.ADMIN);

      expect(res.status).toBe(500);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "error",
          message: MESSAGES.ERROR,
        })
      );
    });
  });

  describe("Auth middleware passthrough for routes", () => {
    test("Auth failure -> 401", async () => {
      const res = await request(app)
        .get("/api/notifications")
        .set("x-auth", "fail");

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        status: "error",
        message: "Invalid or expired token",
      });
    });
  });
});
