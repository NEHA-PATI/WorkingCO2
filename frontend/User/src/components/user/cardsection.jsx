import React from "react";
import { FaLeaf, FaCar, FaSun } from "react-icons/fa";
import { GiRank3 } from "react-icons/gi";
import { MdOutlineAttachMoney } from "react-icons/md";
import "../../styles/user/cardsection.css";

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

  return (
    <div className="dashboard-container">
      {/* Top Summary Cards */}
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
          <p className="value blue">
            #{rankNumber != null ? rankNumber : 10000}
          </p>
          <span className="change">{rankText || "Top 100.0% globally"}</span>
        </div>
      </div>

      {/* Bottom Feature Cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <h4>
            <FaCar className="icon blue" /> Electric Vehicles{" "}
            <span className="tag blue">Live EVs: {liveEVs}</span>
          </h4>
          <p>
            Total Distance{" "}
            <span>
              {/* approximate from evCO2 (kg) back to km using 0.12 kg/km */}
              {evCO2 ? `${(evCO2 / 0.12).toFixed(0)} km` : "0 km"}
            </span>
          </p>
          <p>
            CO₂ Saved <span>{evCO2 ? `${evCO2.toFixed(1)} kg` : "0 kg"}</span>
          </p>
          <p>
            Credits Earned <span>{liveEVs}</span>
          </p>
        </div>

        <div className="feature-card">
          <h4>
            <FaLeaf className="icon green" /> Tree Plantations{" "}
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

        <div className="feature-card">
          <h4>
            <FaSun className="icon orange" /> Solar Energy{" "}
            <span className="tag orange">Generating: {generatingSolar}</span>
          </h4>
          <p>
            Energy Generated{" "}
            <span>
              {/* approximate from solarCO2 (kg) back to kWh using 0.7 kg/kWh */}
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
          <div className="weather-box">
            <p>
              🌤 Today’s Weather:{" "}
              <span>Sunny, 28°C – Optimal for solar generation</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cardsection;
