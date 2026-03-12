import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/basic-ui";
import {
  Calculator,
  Plane,
  Car,
  Home,
  Factory,
  Lightbulb,
  Target,
  Zap,
  Droplets,
  Trees,
  ShoppingCart,
  BarChart3,
  Info,
} from "lucide-react";

const OffsetCalculator = () => {
  const [results, setResults] = useState(null);

  // Travel Calculator State
  const [travel, setTravel] = useState({
    flights: [{ from: "", to: "", passengers: 1, tripType: "roundtrip" }],
    carMiles: "",
    carType: "average",
    publicTransport: "",
  });

  // Home Calculator State
  const [home, setHome] = useState({
    electricity: "",
    gas: "",
    heating: "gas",
    homeSize: "medium",
    residents: "2",
    period: "monthly",
  });

  // Business Calculator State
  const [business, setBusiness] = useState({
    employees: "",
    officeSpace: "",
    businessTravel: "",
    energy: "",
    industry: "office",
  });

  // Emission factors (kg CO2e per unit)
  const emissionFactors = {
    flights: {
      domestic: 0.255, // per mile
      international: 0.298,
    },
    car: {
      average: 0.404, // per mile
      compact: 0.352,
      suv: 0.494,
      hybrid: 0.195,
      electric: 0.053,
    },
    publicTransport: 0.089, // per mile
    electricity: 0.92, // per kWh
    gas: 5.3, // per therm
    heating: {
      gas: 5.3,
      oil: 10.15,
      electric: 0.92,
    },
  };

  const calculateTravelEmissions = () => {
    let totalEmissions = 0;

    // Flight emissions
    travel.flights.forEach((flight) => {
      if (flight.from && flight.to) {
        // Simplified calculation - in reality you'd use a flight distance API
        const estimatedMiles = 500; // Placeholder
        const factor =
          estimatedMiles > 1500
            ? emissionFactors.flights.international
            : emissionFactors.flights.domestic;
        const emissions = estimatedMiles * factor * flight.passengers;
        totalEmissions +=
          flight.tripType === "roundtrip" ? emissions * 2 : emissions;
      }
    });

    // Car emissions
    if (travel.carMiles) {
      totalEmissions +=
        parseFloat(travel.carMiles) * emissionFactors.car[travel.carType];
    }

    // Public transport
    if (travel.publicTransport) {
      totalEmissions +=
        parseFloat(travel.publicTransport) * emissionFactors.publicTransport;
    }

    return totalEmissions;
  };

  const calculateHomeEmissions = () => {
    let totalEmissions = 0;
    const multiplier = home.period === "monthly" ? 12 : 1;

    // Electricity
    if (home.electricity) {
      totalEmissions +=
        parseFloat(home.electricity) * emissionFactors.electricity * multiplier;
    }

    // Gas
    if (home.gas) {
      totalEmissions += parseFloat(home.gas) * emissionFactors.gas * multiplier;
    }

    // Heating (if not already counted in gas)
    if (home.heating !== "gas" && home.heating) {
      const heatingUsage = 50; // Estimated average usage
      totalEmissions +=
        heatingUsage * emissionFactors.heating[home.heating] * multiplier;
    }

    return totalEmissions;
  };

  const calculateBusinessEmissions = () => {
    let totalEmissions = 0;

    // Basic calculation based on employees
    if (business.employees) {
      const baseEmissionPerEmployee = 2000; // kg CO2e per year
      totalEmissions +=
        parseFloat(business.employees) * baseEmissionPerEmployee;
    }

    // Office space
    if (business.officeSpace) {
      totalEmissions += parseFloat(business.officeSpace) * 15; // kg CO2e per sq ft
    }

    // Business travel
    if (business.businessTravel) {
      totalEmissions += parseFloat(business.businessTravel) * 0.3; // per mile
    }

    // Energy usage
    if (business.energy) {
      totalEmissions +=
        parseFloat(business.energy) * emissionFactors.electricity;
    }

    return totalEmissions;
  };

  const calculateTotal = () => {
    const travelEmissions = calculateTravelEmissions();
    const homeEmissions = calculateHomeEmissions();
    const businessEmissions = calculateBusinessEmissions();

    const totalKg = travelEmissions + homeEmissions + businessEmissions;
    const totalTons = totalKg / 1000;

    // Calculate equivalencies
    const treesNeeded = Math.ceil(totalTons * 40); // 1 ton CO2 = ~40 trees per year
    const carMilesEquivalent = Math.ceil(totalKg / 0.404);

    // Estimate credit cost
    const avgCreditPrice = 23.5;
    const estimatedCost = totalTons * avgCreditPrice;

    setResults({
      totalKg: Math.round(totalKg),
      totalTons: Math.round(totalTons * 100) / 100,
      breakdown: {
        travel: Math.round(travelEmissions),
        home: Math.round(homeEmissions),
        business: Math.round(businessEmissions),
      },
      equivalencies: {
        trees: treesNeeded,
        carMiles: carMilesEquivalent,
      },
      offsetCost: Math.round(estimatedCost * 100) / 100,
      creditsNeeded: Math.ceil(totalTons),
    });
  };

  const TravelCalculator = () => (
    <div className="space-y-6">
      {/* Flights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="h-5 w-5 text-blue-600" />
            <span>Air Travel</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {travel.flights.map((flight, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
            >
              <div>
                <Label>From</Label>
                <Input
                  placeholder="City or airport"
                  value={flight.from}
                  onChange={(e) => {
                    const newFlights = [...travel.flights];
                    newFlights[index].from = e.target.value;
                    setTravel({ ...travel, flights: newFlights });
                  }}
                />
              </div>
              <div>
                <Label>To</Label>
                <Input
                  placeholder="City or airport"
                  value={flight.to}
                  onChange={(e) => {
                    const newFlights = [...travel.flights];
                    newFlights[index].to = e.target.value;
                    setTravel({ ...travel, flights: newFlights });
                  }}
                />
              </div>
              <div>
                <Label>Passengers</Label>
                <Input
                  type="number"
                  min="1"
                  value={flight.passengers}
                  onChange={(e) => {
                    const newFlights = [...travel.flights];
                    newFlights[index].passengers =
                      parseInt(e.target.value) || 1;
                    setTravel({ ...travel, flights: newFlights });
                  }}
                />
              </div>
              <div>
                <Label>Trip Type</Label>
                <Select
                  value={flight.tripType}
                  onValueChange={(value) => {
                    const newFlights = [...travel.flights];
                    newFlights[index].tripType = value;
                    setTravel({ ...travel, flights: newFlights });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oneway">One Way</SelectItem>
                    <SelectItem value="roundtrip">Round Trip</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              setTravel({
                ...travel,
                flights: [
                  ...travel.flights,
                  { from: "", to: "", passengers: 1, tripType: "roundtrip" },
                ],
              });
            }}
          >
            Add Another Flight
          </Button>
        </CardContent>
      </Card>

      {/* Ground Transportation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-green-600" />
            <span>Ground Transportation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Car Travel (miles/year)</Label>
              <Input
                type="number"
                placeholder="12000"
                value={travel.carMiles}
                onChange={(e) =>
                  setTravel({ ...travel, carMiles: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Vehicle Type</Label>
              <Select
                value={travel.carType}
                onValueChange={(value) =>
                  setTravel({ ...travel, carType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact Car</SelectItem>
                  <SelectItem value="average">Average Car</SelectItem>
                  <SelectItem value="suv">SUV/Truck</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Public Transportation (miles/year)</Label>
            <Input
              type="number"
              placeholder="2000"
              value={travel.publicTransport}
              onChange={(e) =>
                setTravel({ ...travel, publicTransport: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const HomeCalculator = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="h-5 w-5 text-orange-600" />
            <span>Home Energy Usage</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Home Size</Label>
              <Select
                value={home.homeSize}
                onValueChange={(value) => setHome({ ...home, homeSize: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (&lt;1500 sq ft)</SelectItem>
                  <SelectItem value="medium">
                    Medium (1500-2500 sq ft)
                  </SelectItem>
                  <SelectItem value="large">Large (&gt;2500 sq ft)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Residents</Label>
              <Select
                value={home.residents}
                onValueChange={(value) =>
                  setHome({ ...home, residents: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 person</SelectItem>
                  <SelectItem value="2">2 people</SelectItem>
                  <SelectItem value="3">3 people</SelectItem>
                  <SelectItem value="4">4 people</SelectItem>
                  <SelectItem value="5+">5+ people</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Period</Label>
              <Select
                value={home.period}
                onValueChange={(value) => setHome({ ...home, period: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Electricity Usage (kWh)</Label>
              <div className="relative">
                <Lightbulb className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="number"
                  placeholder="800"
                  className="pl-10"
                  value={home.electricity}
                  onChange={(e) =>
                    setHome({ ...home, electricity: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Natural Gas (therms)</Label>
              <div className="relative">
                <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="number"
                  placeholder="50"
                  className="pl-10"
                  value={home.gas}
                  onChange={(e) => setHome({ ...home, gas: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Primary Heating Source</Label>
            <Select
              value={home.heating}
              onValueChange={(value) => setHome({ ...home, heating: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gas">Natural Gas</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="oil">Heating Oil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const BusinessCalculator = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Factory className="h-5 w-5 text-purple-600" />
            <span>Business Operations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Number of Employees</Label>
              <Input
                type="number"
                placeholder="50"
                value={business.employees}
                onChange={(e) =>
                  setBusiness({ ...business, employees: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Industry Type</Label>
              <Select
                value={business.industry}
                onValueChange={(value) =>
                  setBusiness({ ...business, industry: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office/Services</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Office Space (sq ft)</Label>
              <Input
                type="number"
                placeholder="5000"
                value={business.officeSpace}
                onChange={(e) =>
                  setBusiness({ ...business, officeSpace: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Annual Energy Usage (kWh)</Label>
              <Input
                type="number"
                placeholder="50000"
                value={business.energy}
                onChange={(e) =>
                  setBusiness({ ...business, energy: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label>Business Travel (miles/year)</Label>
            <Input
              type="number"
              placeholder="25000"
              value={business.businessTravel}
              onChange={(e) =>
                setBusiness({ ...business, businessTravel: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-green-600" />
            <span>Carbon Footprint Calculator</span>
          </CardTitle>
          <p className="text-gray-600">
            Calculate your carbon emissions and discover how many credits you
            need to offset your environmental impact.
          </p>
        </CardHeader>
      </Card>

      {/* Calculator Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="travel" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="travel"
                className="flex items-center space-x-2"
              >
                <Plane className="h-4 w-4" />
                <span>Travel</span>
              </TabsTrigger>
              <TabsTrigger value="home" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </TabsTrigger>
              <TabsTrigger
                value="business"
                className="flex items-center space-x-2"
              >
                <Factory className="h-4 w-4" />
                <span>Business</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="travel">
                <TravelCalculator />
              </TabsContent>

              <TabsContent value="home">
                <HomeCalculator />
              </TabsContent>

              <TabsContent value="business">
                <BusinessCalculator />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <div className="flex justify-center">
        <Button size="lg" onClick={calculateTotal} className="px-8">
          <Calculator className="h-4 w-4 mr-2" />
          Calculate My Carbon Footprint
        </Button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>Your Carbon Footprint</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {results.totalTons} tons CO₂e
                </div>
                <p className="text-gray-600">per year</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Plane className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">
                    {results.breakdown.travel} kg
                  </div>
                  <div className="text-sm text-gray-600">Travel</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Home className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="font-semibold">
                    {results.breakdown.home} kg
                  </div>
                  <div className="text-sm text-gray-600">Home</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Factory className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold">
                    {results.breakdown.business} kg
                  </div>
                  <div className="text-sm text-gray-600">Business</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equivalencies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span>Impact Equivalency</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Trees className="h-12 w-12 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {results.equivalencies.trees}
                    </div>
                    <div className="text-gray-600">trees needed to offset</div>
                    <div className="text-sm text-gray-500">per year</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Car className="h-12 w-12 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {results.equivalencies.carMiles.toLocaleString()}
                    </div>
                    <div className="text-gray-600">miles driven</div>
                    <div className="text-sm text-gray-500">in average car</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offset Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <span>Offset Recommendation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-700 mb-2">
                    {results.creditsNeeded} Credits
                  </div>
                  <p className="text-green-600">
                    needed to offset your footprint
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span>Estimated Cost:</span>
                  <span className="text-2xl font-bold text-green-700">
                    ${results.offsetCost}
                  </span>
                </div>

                <Button className="w-full" size="lg">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Purchase Offset Credits
                </Button>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Calculation Methodology</p>
                      <p className="mt-1">
                        Our calculations are based on EPA emission factors and
                        industry standards. Results are estimates and actual
                        emissions may vary.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OffsetCalculator;
