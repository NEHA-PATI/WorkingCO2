jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

const pool = require("../config/db");
const {
  createContactMessage,
  getAllContactMessages,
  getContactById,
} = require("../controllers/contactController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Contact Service - Controller Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe("CREATE CONTACT MESSAGE", () => {
    test("Missing required fields -> 400", async () => {
      const req = { body: { name: "Ada" } };
      const res = createRes();

      await createContactMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Name, email and message are required",
      });
      expect(pool.query).not.toHaveBeenCalled();
    });

    test("Successful submission -> 201", async () => {
      const req = {
        body: {
          name: "Ada",
          email: "ada@example.com",
          phone: "1234567890",
          subject: "Hello",
          message: "Test message",
        },
      };
      const res = createRes();

      pool.query
        .mockResolvedValueOnce({ rows: [{ contact_id: "CNT000005" }] }) // generateContactId
        .mockResolvedValueOnce({ rows: [] }); // insert

      await createContactMessage(req, res);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Message sent successfully",
        contact_id: "CNT000006",
      });
    });

    test("Database error -> 500", async () => {
      const req = {
        body: {
          name: "Ada",
          email: "ada@example.com",
          message: "Test message",
        },
      };
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await createContactMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("GET ALL CONTACT MESSAGES", () => {
    test("Successful fetch -> 200 with array", async () => {
      const req = {};
      const res = createRes();

      const rows = [{ contact_id: "CNT000001" }, { contact_id: "CNT000002" }];
      pool.query.mockResolvedValue({ rows });

      await getAllContactMessages(req, res);

      expect(pool.query).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(rows);
    });

    test("Empty result -> 200 with empty array", async () => {
      const req = {};
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [] });

      await getAllContactMessages(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    test("Database error -> 500", async () => {
      const req = {};
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await getAllContactMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("GET CONTACT BY ID", () => {
    test("Message not found -> 404", async () => {
      const req = { params: { contact_id: "CNT000404" } };
      const res = createRes();

      pool.query.mockResolvedValue({ rows: [] });

      await getContactById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Message not found",
      });
    });

    test("Successful fetch -> 200", async () => {
      const req = { params: { contact_id: "CNT000001" } };
      const res = createRes();

      const row = { contact_id: "CNT000001", message: "Hello" };
      pool.query.mockResolvedValue({ rows: [row] });

      await getContactById(req, res);

      expect(res.json).toHaveBeenCalledWith(row);
    });

    test("Database error -> 500", async () => {
      const req = { params: { contact_id: "CNT000001" } };
      const res = createRes();

      pool.query.mockRejectedValue(new Error("db failure"));

      await getContactById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});
