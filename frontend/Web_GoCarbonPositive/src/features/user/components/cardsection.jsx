import React, { useEffect, useState } from "react";
import {
  FaCreditCard,
  FaTrophy,
  FaCarSide,
  FaTree,
  FaSun,
  FaGlobeAsia,
} from "react-icons/fa";
import "@features/user/styles/cardsection.css";

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
    if (weather.clouds < 20) return "Excellent for solar generation";
    if (weather.clouds < 50) return "Moderate solar output";
    return "Low solar output";
  };

  return (
    <div className="cs-page">
      <div className="cs-container">
        <div className="cs-top-grid">
          <div className="cs-card cs-card-top">
            <div className="cs-card-top-bar cs-card-top-bar-1" />
            <div className="cs-card-inner">
              <div className="cs-card-header">
                <div className="cs-icon-pill cs-icon-pill-blue">
                  <FaCreditCard size={22} color="#2563eb" />
                </div>
                <span className="cs-card-label">TOTAL CREDITS</span>
              </div>
              <div className="cs-card-value">
                {totalCredits != null ? totalCredits.toFixed(2) : "0.00"}
              </div>
              <div className="cs-card-footer-pill cs-card-footer-neutral">
                {percentChangeText || "No change in credits"}
              </div>
            </div>
          </div>

          <div className="cs-card cs-card-top">
            <div className="cs-card-top-bar cs-card-top-bar-2" />
            <div className="cs-card-inner">
              <div className="cs-card-header">
                <div className="cs-icon-pill cs-icon-pill-green">
                  <FaGlobeAsia size={22} color="#16a34a" />
                </div>
                <span className="cs-card-label">CO2 OFFSET</span>
              </div>
              <div className="cs-card-value">
                {totalCO2Tons != null ? `${totalCO2Tons} tons` : "0.0 tons"}
              </div>
              <div className="cs-card-footer-pill cs-card-footer-green">
                {co2ChangeText || "+0.0% Higher offset!"}
              </div>
            </div>
          </div>

          <div className="cs-card cs-card-top">
            <div className="cs-card-top-bar cs-card-top-bar-3" />
            <div className="cs-card-inner">
              <div className="cs-card-header">
                <div className="cs-icon-pill cs-icon-pill-gold">
                  <span className="cs-money-dot">{"\u20B9"}</span>
                </div>
                <span className="cs-card-label">VALUE CREATED</span>
              </div>
              <div className="cs-card-value">
                {"\u20B9"}{totalValue != null ? totalValue.toFixed(0) : "0"}
              </div>
              <div className="cs-card-footer-pill cs-card-footer-green">
                {valueChangeText || "+0.0% Impact"}
              </div>
            </div>
          </div>

          <div className="cs-card cs-card-top">
            <div className="cs-card-top-bar cs-card-top-bar-4" />
            <div className="cs-card-inner">
              <div className="cs-card-header">
                <div className="cs-icon-pill cs-icon-pill-purple">
                  <FaTrophy size={22} color="#7c3aed" />
                </div>
                <span className="cs-card-label">RANK</span>
              </div>
              <div className="cs-card-value">#{rankNumber ?? 10000}</div>
              <div className="cs-card-footer-pill cs-card-footer-green">
                {rankText || "Top 100.0% globally"}
              </div>
            </div>
          </div>
        </div>

        <div className="cs-bottom-grid">
          <div className="cs-card cs-card-bottom">
            <div className="cs-card-top-bar cs-card-top-bar-1" />
            <div className="cs-card-inner cs-card-inner-bottom">
              <div className="cs-card-title-row">
                <div className="cs-card-title-left">
                  <span className="cs-card-title-icon cs-ev-bg">
                    <FaCarSide size={22} color="#ef4444" />
                  </span>
                  <span className="cs-card-title">Electric Vehicles</span>
                </div>
                <div className="cs-status-pill cs-status-pill-blue">
                  LIVE EVS: {liveEVs}
                </div>
              </div>

              <div className="cs-detail-row">
                <span className="cs-detail-label">DISTANCE</span>
                <span className="cs-detail-value">
                  {evCO2 ? (evCO2 / 0.12).toFixed(0) : "0"}{" "}
                  <span className="cs-detail-unit">km</span>
                </span>
              </div>
              <div className="cs-detail-row">
                <span className="cs-detail-label">CO2 SAVED</span>
                <span className="cs-detail-value">
                  {evCO2 ? evCO2.toFixed(1) : "0"}{" "}
                  <span className="cs-detail-unit">kg</span>
                </span>
              </div>
              <div className="cs-detail-row">
                <span className="cs-detail-label">CREDITS</span>
                <span className="cs-detail-value">{liveEVs}</span>
              </div>
            </div>
          </div>

          <div className="cs-card cs-card-bottom">
            <div className="cs-card-top-bar cs-card-top-bar-2" />
            <div className="cs-card-inner cs-card-inner-bottom">
              <div className="cs-card-title-row">
                <div className="cs-card-title-left">
                  <span className="cs-card-title-icon cs-tree-bg">
                    <FaTree size={22} color="#16a34a" />
                  </span>
                  <span className="cs-card-title">Tree Plantations</span>
                </div>
                <div className="cs-status-pill cs-status-pill-green">
                  GROWING: {growingTrees}
                </div>
              </div>

              <div className="cs-detail-row">
                <span className="cs-detail-label">TREES</span>
                <span className="cs-detail-value">{growingTrees}</span>
              </div>
              <div className="cs-detail-row">
                <span className="cs-detail-label">CO2 ABSORBED</span>
                <span className="cs-detail-value">
                  {treeCO2 ? treeCO2.toFixed(1) : "0"}{" "}
                  <span className="cs-detail-unit">kg</span>
                </span>
              </div>
              <div className="cs-detail-row">
                <span className="cs-detail-label">CREDITS</span>
                <span className="cs-detail-value">{growingTrees}</span>
              </div>
            </div>
          </div>

          <div className="cs-card cs-card-bottom">
            <div className="cs-card-top-bar cs-card-top-bar-3" />
            <div className="cs-card-inner cs-card-inner-bottom">
              <div className="cs-card-title-row">
                <div className="cs-card-title-left">
                  <span className="cs-card-title-icon cs-solar-bg">
                    <FaSun size={22} color="#f97316" />
                  </span>
                  <span className="cs-card-title">Solar Energy</span>
                </div>
                <div className="cs-status-pill cs-status-pill-orange">
                  GENERATING: {generatingSolar}
                </div>
              </div>

              <div className="cs-detail-row">
                <span className="cs-detail-label">ENERGY</span>
                <span className="cs-detail-value">
                  {solarCO2 ? (solarCO2 / 0.7).toFixed(1) : "0"}{" "}
                  <span className="cs-detail-unit">kWh</span>
                </span>
              </div>
              <div className="cs-detail-row">
                <span className="cs-detail-label">BILL SAVED</span>
                <span className="cs-detail-value">
                  {"\u20B9"}{generatingSolar ? (generatingSolar * 5000).toFixed(0) : "0"}
                </span>
              </div>
              <div className="cs-detail-row cs-detail-row-divider">
                <span className="cs-detail-label">CREDITS</span>
                <span className="cs-detail-value">{generatingSolar}</span>
              </div>

              <div className="cs-conditions-card">
                <div className="cs-conditions-header">CURRENT CONDITIONS</div>
                <div className="cs-conditions-row">
                  <span className="cs-conditions-label">Location</span>
                  <span className="cs-conditions-value">
                    {location || "Unavailable"}
                  </span>
                </div>
                <div className="cs-conditions-row">
                  <span className="cs-conditions-label">Weather</span>
                  <span className="cs-conditions-value">
                    {weather && !weatherError
                      ? `${weather.condition}, ${Math.round(weather.temp)}°C - ${solarMessage()}`
                      : "Unavailable"}
                  </span>
                </div>
                <div className="cs-conditions-row">
                  <span className="cs-conditions-label">Conditions</span>
                  <span className="cs-conditions-dot" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cardsection;


