jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

const pool = require("../config/db");
const {
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require("../controllers/adminTicketController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Ticket Service - Controller Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("createTicket should return 400 when required fields are missing", async () => {
    const req = { body: { subject: "" }, user: { u_id: "USR_1" } };
    const res = createRes();

    await createTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test("createTicket should create ticket and return generated id", async () => {
    const req = {
      body: { subject: "Need help", message: "Issue details" },
      user: { u_id: "USR_1" },
    };
    const res = createRes();

    pool.query
      .mockResolvedValueOnce({ rows: [{ ticket_id: "TCKT000009" }] })
      .mockResolvedValueOnce({ rows: [] });

    await createTicket(req, res);

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Ticket submitted successfully",
      data: { ticket_id: "TCKT000010" },
    });
  });

  test("getTicketById should return 404 when ticket does not exist", async () => {
    const req = { params: { ticket_id: "TCKT000999" } };
    const res = createRes();

    pool.query.mockResolvedValue({ rows: [] });

    await getTicketById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updateTicket should return 400 for invalid status", async () => {
    const req = { params: { ticket_id: "TCKT000001" }, body: { status: "closed" } };
    const res = createRes();

    await updateTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test("deleteTicket should return 404 when row does not exist", async () => {
    const req = { params: { ticket_id: "TCKT000404" } };
    const res = createRes();
    pool.query.mockResolvedValue({ rowCount: 0 });

    await deleteTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
