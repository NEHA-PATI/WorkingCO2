import React, { useEffect, useState } from "react";
import { FaLeaf, FaCar, FaSun } from "react-icons/fa";
import { GiRank3 } from "react-icons/gi";
import { MdOutlineAttachMoney } from "react-icons/md";
import "../../styles/user/cardsection.css";

// ⚠️ Replace ONLY if your key is active
const API_KEY = "60d7d1192f4e08aaa16e18f6a8551f69";

const Cardsection = ({
  totalCredits,
  percentChangeText,
  totalCO2Tons,
  co2ChangeText,
  totalValue,
  valueChangeText,
  rankNumber,
  rankText,
  evList,
  solarList,
  treeList,
  treeCO2,
  evCO2,
  solarCO2,
}) => {
  const liveEVs = evList.length;
  const growingTrees = treeList.length;
  const generatingSolar = solarList.length;

  // 🌦 Weather state
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const [location, setLocation] = useState("");


  useEffect(() => {
    if (!navigator.geolocation) {
      setWeatherError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          );

          if (!res.ok) {
            console.error("Weather API error:", res.status);
            setWeatherError(true);
            return;
          }

          const data = await res.json();

          if (!data?.main || !data?.weather) {
            setWeatherError(true);
            return;
          }

          setWeather({
            temp: data.main.temp,
            condition: data.weather[0].main,
            clouds: data.clouds?.all ?? 0,
          });
          setLocation(`${data.name}, ${data.sys.country}`);

        } catch (err) {
          console.error("Weather fetch failed", err);
          setWeatherError(true);
        }
      },
      () => setWeatherError(true)
    );
  }, []);

  const solarMessage = () => {
    if (!weather) return "";
    if (weather.clouds < 20) return "Excellent for solar generation ☀️";
    if (weather.clouds < 50) return "Moderate solar output 🌤";
    return "Low solar output ☁️";
  };

  return (
    <div className="dashboard-container">
      {/* TOP SUMMARY CARDS */}
      <div className="summary-cards">
        <div className="card">
          <h4>
            Total Credits <FaLeaf className="icon green" />
          </h4>
          <p className="value">
            {totalCredits != null ? totalCredits.toFixed(2) : "0.00"}
          </p>
          <span className="change red">{percentChangeText}</span>
        </div>

        <div className="card">
          <h4>
            CO₂ Offset <FaLeaf className="icon green" />
          </h4>
          <p className="value green">
            {totalCO2Tons != null ? `${totalCO2Tons} tons` : "0.0 tons"}
          </p>
          <span className="change green">{co2ChangeText}</span>
        </div>

        <div className="card">
          <h4>
            Value Created <MdOutlineAttachMoney className="icon orange" />
          </h4>
          <p className="value orange">
            ₹{totalValue != null ? totalValue.toFixed(0) : "0"}
          </p>
          <span className="change orange">{valueChangeText}</span>
        </div>

        <div className="card">
          <h4>
            Rank <GiRank3 className="icon blue" />
          </h4>
          <p className="value blue">#{rankNumber ?? 10000}</p>
          <span className="change">{rankText || "Top 100.0% globally"}</span>
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="feature-cards">
        {/* EV */}
        <div className="feature-card">
          <h4>
            <FaCar className="icon blue" /> Electric Vehicles
            <span className="tag blue">Live EVs: {liveEVs}</span>
          </h4>
          <p>
            Total Distance{" "}
            <span>{evCO2 ? `${(evCO2 / 0.12).toFixed(0)} km` : "0 km"}</span>
          </p>
          <p>
            CO₂ Saved <span>{evCO2 ? `${evCO2.toFixed(1)} kg` : "0 kg"}</span>
          </p>
          <p>
            Credits Earned <span>{liveEVs}</span>
          </p>
        </div>

        {/* TREES */}
        <div className="feature-card">
          <h4>
            <FaLeaf className="icon green" /> Tree Plantations
            <span className="tag green">Growing: {growingTrees}</span>
          </h4>
          <p>
            Trees Planted <span>{growingTrees}</span>
          </p>
          <p>
            CO₂ Absorbed{" "}
            <span>{treeCO2 ? `${treeCO2.toFixed(1)} kg` : "0 kg"}</span>
          </p>
          <p>
            Credits Earned <span>{growingTrees}</span>
          </p>
        </div>

        {/* ☀️ SOLAR + WEATHER */}
        <div className="feature-card">
          <h4>
            <FaSun className="icon orange" /> Solar Energy
            <span className="tag orange">
              Generating: {generatingSolar}
            </span>
          </h4>

          <p>
            Energy Generated{" "}
            <span>
              {solarCO2 ? `${(solarCO2 / 0.7).toFixed(1)} kWh` : "0 kWh"}
            </span>
          </p>

          <p>
            Bill Saved{" "}
            <span>
              ₹{generatingSolar ? (generatingSolar * 5000).toFixed(0) : "0"}
            </span>
          </p>

          <p>
            Credits Earned <span>{generatingSolar}</span>
          </p>

          {/* 🌤 WEATHER */}
          <div className="weather-box">
            {location && <p>📍 {location}</p>}

            <p>
              🌤 Today’s Weather:{" "}
              <span>
                {weather && !weatherError
                  ? `${weather.condition}, ${Math.round(
                      weather.temp
                    )}°C – ${solarMessage()}`
                  : "Weather unavailable"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cardsection;
