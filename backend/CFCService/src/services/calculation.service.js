const emissionFactorService = require('./emissionFactor.service');
const airportService = require('./airport.service');
const calculationRepo = require('../repositories/calculation.repository');
const inputRepo = require('../repositories/input.repository');
const reportService = require('./report.service');
const { v4: uuidv4 } = require('uuid');

exports.calculate = async (data) => {
  const sessionId = data.session_id || uuidv4();
  const uId = data.u_id || null;

  let total = 0;
  let breakdown = {
    housing: {},
    food: {},
    transport: {},
    flights: {}
  };

  const round = (num) => Math.round(num * 100) / 100;

  // =========================
  // HOUSING
  // =========================
  const electricityFactor = emissionFactorService.getFactor('electricity', 'grid');
  const electricityEmission = round(
    (data.housing?.electricity_kwh || 0) * electricityFactor
  );

  const lpgFactor = emissionFactorService.getFactor('lpg', 'domestic');
  const lpgEmission = round(
    (data.housing?.lpg_cylinders || 0) * 14.2 * lpgFactor
  );

  breakdown.housing.electricity = electricityEmission;
  breakdown.housing.lpg = lpgEmission;

  total += electricityEmission + lpgEmission;

  // =========================
  // FOOD
  // =========================
  if (Array.isArray(data.food)) {
    for (const item of data.food) {
      const factor = emissionFactorService.getFactor('food', item.category);

      const emission = round(
        (item.avg_quantity_per_day_kg || 0) *
        (item.days_consumed || 0) *
        factor
      );

      breakdown.food[item.category] = emission;
      total += emission;
    }
  }

  // =========================
  // VEHICLES
  // =========================
  if (Array.isArray(data.transport?.vehicles)) {
    for (const vehicle of data.transport.vehicles) {

      if (!vehicle.mileage_kmpl || vehicle.mileage_kmpl <= 0) {
        throw new Error('Invalid mileage value');
      }

      const fuelFactor = emissionFactorService.getFactor(
        'fuel',
        vehicle.fuel_type
      );

      const fuelUsed =
        (vehicle.distance_km || 0) / vehicle.mileage_kmpl;

      const emission = round(fuelUsed * fuelFactor);

      breakdown.transport[vehicle.vehicle_type] =
        round((breakdown.transport[vehicle.vehicle_type] || 0) + emission);

      total += emission;
    }
  }

  // =========================
  // FLIGHTS
  // =========================
  if (Array.isArray(data.transport?.flights)) {
    const baseFactor = emissionFactorService.getFactor('flight', 'economy');

    for (const flight of data.transport.flights) {
      let flightEmission = 0;
      let routeParts = [];

      for (const leg of flight.legs) {
        const distance = await airportService.getDistance(
          leg.departure_airport,
          leg.arrival_airport
        );

        flightEmission += distance * baseFactor;
        routeParts.push(leg.departure_airport);
      }

      routeParts.push(
        flight.legs[flight.legs.length - 1].arrival_airport
      );

      if (flight.cabin_class !== 'economy') {
        const multiplier = emissionFactorService.getFactor(
          'flight_multiplier',
          flight.cabin_class
        );
        flightEmission *= multiplier;
      }

      flightEmission = round(flightEmission);

      const routeLabel = routeParts.join('-');

      breakdown.flights[routeLabel] = flightEmission;

      total += flightEmission;
    }
  }

  total = round(total);

  // 🔥 Generate Report HERE (inside function)
  const finalReport = reportService.generateReport(total, breakdown);

  // =========================
  // SAVE TO DB
  // =========================
  const calculation = await calculationRepo.insertCalculation({
    u_id: uId,
    session_id: sessionId,
    month: data.calculation_month,
    total,
    breakdown
  });

  await inputRepo.insertInput(calculation.id, data);

  return {
    session_id: sessionId,
    ...finalReport
  };
};