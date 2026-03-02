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
  const pucInsights = {
    totalVehicles: 0,
    noPucCount: 0,
    expiredCount: 0,
    compliantLowEmissionCount: 0
  };

  const round = (num) => Math.round(num * 100) / 100;

  // Normalize vehicle payload so DB raw_input_json always stores complete schema.
  if (Array.isArray(data.transport?.vehicles)) {
    data.transport.vehicles = data.transport.vehicles.map((vehicle) => ({
      ...vehicle,
      make: vehicle.make || '',
      manufacturing_year:
        vehicle.manufacturing_year === undefined ? null : vehicle.manufacturing_year,
      fuel_efficiency_certificate:
        vehicle.fuel_efficiency_certificate === undefined
          ? null
          : vehicle.fuel_efficiency_certificate,
      vehicle_class: vehicle.vehicle_class || '',
      puc: {
        available: Boolean(vehicle.puc?.available),
        last_test_date: vehicle.puc?.last_test_date || '',
        expiry_date: vehicle.puc?.expiry_date || '',
        emission_co_percent:
          vehicle.puc?.emission_co_percent === undefined
            ? null
            : vehicle.puc.emission_co_percent,
        emission_hc_ppm:
          vehicle.puc?.emission_hc_ppm === undefined
            ? null
            : vehicle.puc.emission_hc_ppm
      }
    }));
  }

  // Normalize housing profile payload for report and raw_input_json persistence.
  data.housing = {
    electricity_kwh: Number(data.housing?.electricity_kwh || 0),
    lpg_cylinders: Number(data.housing?.lpg_cylinders || 0),
    bedrooms: Number(data.housing?.bedrooms || 0),
    members: {
      male: Number(data.housing?.members?.male || 0),
      female: Number(data.housing?.members?.female || 0),
      child: Number(data.housing?.members?.child || 0)
    },
    fridge_count: Number(data.housing?.fridge_count || 0),
    tv_count: Number(data.housing?.tv_count || 0)
  };

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
      pucInsights.totalVehicles += 1;

      if (!vehicle.mileage_kmpl || vehicle.mileage_kmpl <= 0) {
        throw new Error('Invalid mileage value');
      }

      const fuelFactor = emissionFactorService.getFactor(
        'fuel',
        vehicle.fuel_type
      );

      const fuelUsed =
        (vehicle.distance_km || 0) / vehicle.mileage_kmpl;

      const baseEmission = round(fuelUsed * fuelFactor);
      const puc = vehicle.puc || {};
      let multiplier = 1;

      if (!puc.available) {
        multiplier += 0.2;
        pucInsights.noPucCount += 1;
      }

      let isExpired = false;
      if (puc.expiry_date) {
        const expiryDate = new Date(puc.expiry_date);
        if (!Number.isNaN(expiryDate.getTime())) {
          expiryDate.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (expiryDate < today) {
            isExpired = true;
            multiplier += 0.1;
            pucInsights.expiredCount += 1;
          }
        }
      }

      const coValue = Number(puc.emission_co_percent);
      const hasCoReading = Number.isFinite(coValue);
      const coLimitByFuel = {
        petrol: 3,
        diesel: 2
      };
      const coLimit = coLimitByFuel[vehicle.fuel_type];

      if (hasCoReading && typeof coLimit === 'number' && coValue > coLimit) {
        multiplier += 0.05;
      }

      const isValidPuc = Boolean(puc.available) && !isExpired;
      if (isValidPuc && hasCoReading && typeof coLimit === 'number' && coValue <= coLimit) {
        pucInsights.compliantLowEmissionCount += 1;
      }

      const emission = round(baseEmission * multiplier);

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
  const finalReport = reportService.generateReport(total, breakdown, pucInsights, {
    bedrooms: data.housing.bedrooms,
    members: data.housing.members,
    fridge_count: data.housing.fridge_count,
    tv_count: data.housing.tv_count
  });

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
