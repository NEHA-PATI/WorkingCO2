const { roundToTwo } = require("../src/utils/decimal");
const { calculateDistance } = require("../src/utils/haversine");
const { validateCalculationInput } = require("../src/utils/validators");
const validateCalculation = require("../src/middlewares/validateCalculation");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("CFC Service - Utility and Middleware Tests", () => {
  test("roundToTwo should round floating values to two decimals", () => {
    expect(roundToTwo(12.345)).toBe(12.35);
    expect(roundToTwo(12.344)).toBe(12.34);
  });

  test("calculateDistance should return near-zero for same coordinates", () => {
    const distance = calculateDistance(28.6139, 77.209, 28.6139, 77.209);
    expect(distance).toBeCloseTo(0, 5);
  });

  test("calculateDistance should return expected value for 1 degree longitude at equator", () => {
    const distance = calculateDistance(0, 0, 0, 1);
    expect(distance).toBeCloseTo(111.19, 1);
  });

  test("validateCalculationInput should throw for missing calculation_month", () => {
    expect(() => validateCalculationInput({ housing: {} })).toThrow("calculation_month is required");
  });

  test("validateCalculationInput should throw for missing housing", () => {
    expect(() => validateCalculationInput({ calculation_month: "2026-02" })).toThrow("housing data is required");
  });

  test("validateCalculationInput should return true for valid payload", () => {
    expect(validateCalculationInput({ calculation_month: "2026-02", housing: {} })).toBe(true);
  });

  test("validateCalculation middleware should return 400 for invalid body", () => {
    const req = { body: {} };
    const res = createRes();
    const next = jest.fn();

    validateCalculation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("validateCalculation middleware should call next for valid body", () => {
    const req = {
      body: {
        calculation_month: "2026-02",
        housing: {
          electricity_kwh: 100,
          lpg_cylinders: 1,
        },
        transport: {
          vehicles: [],
        },
      },
    };
    const res = createRes();
    const next = jest.fn();

    validateCalculation(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
