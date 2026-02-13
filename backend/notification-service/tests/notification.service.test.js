jest.mock("../src/models/Notification", () => ({
  create: jest.fn(),
  getStats: jest.fn(),
}));

jest.mock("../src/utils/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

const Notification = require("../src/models/Notification");
const NotificationService = require("../src/services/notificationService");
const { NOTIFICATION_TYPES } = require("../src/config/constants");

describe("Notification Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleSignup", () => {
    test("Successful notification creation", async () => {
      const user = {
        id: 1,
        username: "ada",
        email: "ada@example.com",
        role_name: "USER",
      };
      const req = {
        ip: "127.0.0.1",
        connection: { remoteAddress: "127.0.0.1" },
        get: () => "UA",
      };

      Notification.create.mockResolvedValue({ id: 10 });

      const result = await NotificationService.handleSignup(user, req);

      expect(Notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: NOTIFICATION_TYPES.USER_SIGNUP,
          user_id: 1,
          username: "ada",
          email: "ada@example.com",
          user_role: "USER",
          ip_address: "127.0.0.1",
          device_info: "UA",
          metadata: expect.objectContaining({
            action: "New user registration",
            source: "signup",
          }),
        })
      );
      expect(result).toEqual({ id: 10 });
    });

    test("Model failure -> throws error", async () => {
      Notification.create.mockRejectedValue(new Error("db failure"));

      await expect(
        NotificationService.handleSignup(
          { id: 1, username: "a", email: "a@b.com", role_name: "USER" },
          { ip: "x", connection: {}, get: () => "ua" }
        )
      ).rejects.toThrow("db failure");
    });
  });

  describe("handleLogin", () => {
    test("Successful notification creation", async () => {
      const user = {
        id: 2,
        username: "bob",
        email: "bob@example.com",
        role_name: "USER",
      };
      const req = {
        ip: "127.0.0.2",
        connection: { remoteAddress: "127.0.0.2" },
        get: () => "UA",
      };

      Notification.create.mockResolvedValue({ id: 20 });

      const result = await NotificationService.handleLogin(user, req);

      expect(Notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: NOTIFICATION_TYPES.USER_LOGIN,
          user_id: 2,
        })
      );
      expect(result).toEqual({ id: 20 });
    });
  });

  describe("handleFailedLogin", () => {
    test("Severity is high at attempt >= 3", async () => {
      const req = {
        ip: "127.0.0.3",
        connection: { remoteAddress: "127.0.0.3" },
        get: () => "UA",
      };

      Notification.create.mockResolvedValue({ id: 30 });

      await NotificationService.handleFailedLogin("fail@example.com", req, 3);

      expect(Notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: NOTIFICATION_TYPES.FAILED_LOGIN,
          metadata: expect.objectContaining({
            severity: "high",
            attempt_number: 3,
          }),
        })
      );
    });
  });

  describe("handleAccountLocked", () => {
    test("Successful notification creation", async () => {
      const req = {
        ip: "127.0.0.4",
        connection: { remoteAddress: "127.0.0.4" },
        get: () => "UA",
      };

      Notification.create.mockResolvedValue({ id: 40 });

      const result = await NotificationService.handleAccountLocked(
        "lock@example.com",
        req
      );

      expect(Notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: NOTIFICATION_TYPES.ACCOUNT_LOCKED,
          email: "lock@example.com",
        })
      );
      expect(result).toEqual({ id: 40 });
    });
  });

  describe("handleEmailVerified", () => {
    test("Successful notification creation", async () => {
      const user = {
        id: 3,
        username: "cam",
        email: "cam@example.com",
        role_name: "USER",
      };

      Notification.create.mockResolvedValue({ id: 50 });

      const result = await NotificationService.handleEmailVerified(user);

      expect(Notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: NOTIFICATION_TYPES.EMAIL_VERIFIED,
          user_id: 3,
          email: "cam@example.com",
        })
      );
      expect(result).toEqual({ id: 50 });
    });
  });

  describe("getStats", () => {
    test("Successful stats fetch", async () => {
      Notification.getStats.mockResolvedValue([{ total: 1 }]);

      const result = await NotificationService.getStats(12);

      expect(Notification.getStats).toHaveBeenCalledWith(12);
      expect(result).toEqual([{ total: 1 }]);
    });

    test("Model failure -> throws error", async () => {
      Notification.getStats.mockRejectedValue(new Error("db failure"));

      await expect(NotificationService.getStats(24)).rejects.toThrow("db failure");
    });
  });
});
