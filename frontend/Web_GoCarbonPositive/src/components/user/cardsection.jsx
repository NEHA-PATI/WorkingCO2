import React, { useEffect, useState } from "react";
import { FaLeaf, FaCar, FaSun } from "react-icons/fa";
import { GiRank3 } from "react-icons/gi";
import { MdOutlineAttachMoney } from "react-icons/md";
import "../../styles/user/cardsection.css";

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
            setWeatherError(true);
            return;
          }

          const data = await res.json();

          setWeather({
            temp: data.main.temp,
            condition: data.weather[0].main,
            clouds: data.clouds?.all ?? 0,
          });
          setLocation(`${data.name}, ${data.sys.country}`);
        } catch {
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
    <div className="cs-dashboard-container">
      <div className="cs-summary-cards">
        <div className="cs-card">
          <h4>
            Total Credits <FaLeaf className="cs-icon cs-green" />
          </h4>
          <p className="cs-value">
            {totalCredits != null ? totalCredits.toFixed(2) : "0.00"}
          </p>
          <span className="cs-change cs-red">{percentChangeText}</span>
        </div>

        <div className="cs-card">
          <h4>
            CO₂ Offset <FaLeaf className="cs-icon cs-green" />
          </h4>
          <p className="cs-value cs-green">
            {totalCO2Tons != null ? `${totalCO2Tons} tons` : "0.0 tons"}
          </p>
          <span className="cs-change cs-green">{co2ChangeText}</span>
        </div>

        <div className="cs-card">
          <h4>
            Value Created <MdOutlineAttachMoney className="cs-icon cs-orange" />
          </h4>
          <p className="cs-value cs-orange">
            ₹{totalValue != null ? totalValue.toFixed(0) : "0"}
          </p>
          <span className="cs-change cs-orange">{valueChangeText}</span>
        </div>

        <div className="cs-card">
          <h4>
            Rank <GiRank3 className="cs-icon cs-blue" />
          </h4>
          <p className="cs-value cs-blue">#{rankNumber ?? 10000}</p>
          <span className="cs-change">{rankText || "Top 100.0% globally"}</span>
        </div>
      </div>

      <div className="cs-feature-cards">
        <div className="cs-feature-card">
          <h4>
            <FaCar className="cs-icon cs-blue" /> Electric Vehicles
            <span className="cs-tag cs-blue">Live EVs: {liveEVs}</span>
          </h4>
          <p>Distance <span>{evCO2 ? `${(evCO2 / 0.12).toFixed(0)} km` : "0 km"}</span></p>
          <p>CO₂ Saved <span>{evCO2 ? `${evCO2.toFixed(1)} kg` : "0 kg"}</span></p>
          <p>Credits <span>{liveEVs}</span></p>
        </div>

        <div className="cs-feature-card">
          <h4>
            <FaLeaf className="cs-icon cs-green" /> Tree Plantations
            <span className="cs-tag cs-green">Growing: {growingTrees}</span>
          </h4>
          <p>Trees <span>{growingTrees}</span></p>
          <p>CO₂ Absorbed <span>{treeCO2 ? `${treeCO2.toFixed(1)} kg` : "0 kg"}</span></p>
          <p>Credits <span>{growingTrees}</span></p>
        </div>

        <div className="cs-feature-card">
          <h4>
            <FaSun className="cs-icon cs-orange" /> Solar Energy
            <span className="cs-tag cs-orange">Generating: {generatingSolar}</span>
          </h4>

          <p>Energy <span>{solarCO2 ? `${(solarCO2 / 0.7).toFixed(1)} kWh` : "0 kWh"}</span></p>
          <p>Bill Saved <span>₹{generatingSolar ? (generatingSolar * 5000).toFixed(0) : "0"}</span></p>
          <p>Credits <span>{generatingSolar}</span></p>

          <div className="cs-weather-box">
            {location && <p>📍 {location}</p>}
            <p>
              🌤Weather:{" "}
              <span>
                {weather && !weatherError
                  ? `${weather.condition}, ${Math.round(weather.temp)}°C – ${solarMessage()}`
                  : "Unavailable"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cardsection;
