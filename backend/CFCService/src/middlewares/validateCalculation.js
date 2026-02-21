const Joi = require('joi');

const schema = Joi.object({
  calculation_month: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),

  housing: Joi.object({
    electricity_kwh: Joi.number().min(0).required(),
    lpg_cylinders: Joi.number().min(0).required()
  }).required(),

  food: Joi.array().items(
    Joi.object({
      category: Joi.string().required(),
      avg_quantity_per_day_kg: Joi.number().min(0).required(),
      days_consumed: Joi.number().min(0).required()
    })
  ),

  transport: Joi.object({
    vehicles: Joi.array().items(
      Joi.object({
        vehicle_type: Joi.string().valid('2w', '4w').required(),
        fuel_type: Joi.string().valid('petrol', 'diesel', 'cng').required(),
        distance_km: Joi.number().min(0).required(),
        mileage_kmpl: Joi.number().greater(0).required()
      })
    ),
   flights: Joi.array().items(
  Joi.object({
    trip_type: Joi.string()
      .valid('one_way', 'round_trip', 'multi_city')
      .optional(),

    cabin_class: Joi.string()
      .valid('economy', 'premium_economy', 'business', 'first')
      .required(),

    legs: Joi.array().min(1).items(
      Joi.object({
        departure_airport: Joi.string().length(3).required(),
        arrival_airport: Joi.string().length(3).required()
      })
    ).required()
  })
),
  }).required()
});

module.exports = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};