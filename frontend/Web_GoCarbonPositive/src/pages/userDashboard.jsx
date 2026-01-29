import React, { useState, useEffect } from "react";
import {
  FaLeaf,
  FaCar,
  FaSun,
  FaIndustry,
  FaCalendarAlt,
  FaBolt,
  FaTachometerAlt,
  FaTree,
  FaMapMarkerAlt,
  FaRuler,
  FaSolarPanel,
  FaMicrochip,
} from "react-icons/fa";
import { GiTreeBranch } from "react-icons/gi";
import { MdCategory, MdScience } from "react-icons/md";
import { BsLightningChargeFill } from "react-icons/bs";
import { IoMdFlash } from "react-icons/io";
import ActivityItem from "../components/user/ActivityItem";
import "../styles/user/userDashboard.css";
import { useNavigate } from "react-router-dom";
import evService from "../services/user/evService";
import solarService from "../services/user/solarService";
import treeService from "../services/user/treeService";
import { toast } from "react-toastify";
import Cardsection from "../components/user/cardsection";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [evList, setEvList] = useState([]);
  const [solarList, setSolarList] = useState([]);
  const [treeList, setTreeList] = useState([]);
  const [percentChange, setPercentChange] = useState(0);
  const [backendCredits, setBackendCredits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [activityList, setActivityList] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // filters + pagination
  const [activityFilter, setActivityFilter] = useState("All");
  const [activityPage, setActivityPage] = useState(1);
  const pageSize = 10;

  const storedUser = JSON.parse(localStorage.getItem("authUser"));
  const userId =
    storedUser?.u_id || localStorage.getItem("userId") || "USR_SAMPLE_001";

  useEffect(() => {
    fetchAssets();
  }, [userId]);

  const fetchAssets = async () => {
    try {
      setLoadingActivity(true);
      console.log("Fetching assets for userId:", userId);

      const [evData, solarData, treeData] = await Promise.all([
        evService.getAllEVs(userId).catch((err) => {
          console.error("EV fetch error:", err);
          return { data: [] };
        }),
        solarService.getAllSolarPanels(userId).catch((err) => {
          console.error("Solar fetch error:", err);
          return { data: [] };
        }),
        treeService.getAllTrees(userId).catch((err) => {
          console.error("Tree fetch error:", err);
          return { data: [] };
        }),
      ]);

      const evs = evData.data || [];
      const solars = solarData.data || [];
      const trees = treeData.data || [];

      setEvList(evs);
      setSolarList(solars);
      setTreeList(trees);

      buildActivityList(evs, solars, trees);
    } catch (error) {
      console.error("❌ Error fetching assets:", error);
      toast.error("Failed to load assets");
    } finally {
      setLoadingActivity(false);
    }
  };

  const buildActivityList = (evs, solars, trees) => {
    const evActivities = evs.map((item) => ({
      type: "EV",
      detail: item.manufacturers || item.Manufacturers || "Unknown",
      model: item.model || item.Model || "N/A",
      category: item.category || item.Category || "N/A",
      year: item.purchase_year || item.Purchase_Year || "N/A",
      range: item.range
        ? `${item.range} km`
        : item.Range
        ? `${item.Range} km`
        : "N/A",
      topSpeed: item.top_speed
        ? `${item.top_speed} km/h`
        : item.Top_Speed
        ? `${item.Top_Speed} km/h`
        : "N/A",
      energy: item.energy_consumed
        ? `${item.energy_consumed} kWh`
        : item.Energy_Consumed
        ? `${item.Energy_Consumed} kWh`
        : "N/A",
      time: new Date(
        item.created_at || item.Created_At || Date.now()
      ).toLocaleString(),
      credits: "+50",
    }));

    const solarActivities = solars.map((item) => {
      const installationDate = item.installation_date || item.Installation_Date;
      const year = installationDate
        ? new Date(installationDate).getFullYear()
        : "N/A";

      return {
        type: "Solar",
        detail: item.inverter_type || item.Inverter_Type || "Unknown Inverter",
        year: year,
        generation: item.energy_generation_value
          ? `${item.energy_generation_value} kWh`
          : item.Energy_Generation_Value
          ? `${item.Energy_Generation_Value} kWh`
          : "N/A",
        capacity: item.installed_capacity
          ? `${item.installed_capacity} kW`
          : item.Installed_Capacity
          ? `${item.Installed_Capacity} kW`
          : "N/A",
        panelType: item.panel_type || item.Panel_Type || "Standard Panel",
        time: new Date(
          item.created_at || item.Created_At || Date.now()
        ).toLocaleString(),
        credits: "+50",
      };
    });

    const treeActivities = trees.map((item) => {
      const treename = item.treename || item.TreeName || "Unknown Tree";
      const scientificname =
        item.botanicalname || item.BotanicalName || "Unknown Species";

      const plantingDate = item.plantingdate || item.PlantingDate;
      const plantingYear = plantingDate
        ? new Date(plantingDate).getFullYear()
        : "N/A";

      const location = item.location || item.Location || "Unknown";

      const heightCm = item.height || item.Height;
      const heightM = heightCm ? (heightCm / 100).toFixed(2) : null;

      const dbh = item.dbh || item.DBH;

      let imageUrl = null;
      if (item.images) {
        if (typeof item.images === "string") {
          try {
            const parsed = JSON.parse(item.images);
            imageUrl =
              Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
          } catch {
            imageUrl = item.images;
          }
        } else if (Array.isArray(item.images) && item.images.length > 0) {
          const firstImage = item.images[0];
          imageUrl =
            typeof firstImage === "string"
              ? firstImage
              : firstImage?.image_url || firstImage?.ImageURL;
        }
      }

      return {
        type: "Tree",
        treename,
        scientificname,
        plantingdate: plantingYear,
        location,
        height: heightM ? `${heightM}m` : "N/A",
        dbh: dbh ? `${dbh}cm` : "N/A",
        treeType: "Deciduous",
        imageUrl,
        time: new Date(
          item.created_at || item.Created_At || Date.now()
        ).toLocaleString(),
        credits: "+50",
      };
    });

    const allActivities = [
      ...evActivities,
      ...solarActivities,
      ...treeActivities,
    ];

    allActivities.sort((a, b) => new Date(b.time) - new Date(a.time));

    setActivityList(allActivities);
    setActivityPage(1);
  };

  const handleQuickAdd = () => {
    navigate("/upload");
  };

  const handleViewAssets = () => {
    navigate("/view-assets");
  };

  // credits total
  useEffect(() => {
    const sum = activityList.reduce((acc, item) => {
      const creditsValue = parseInt(item.credits.replace("+", ""), 10) || 0;
      return acc + creditsValue;
    }, 0);
    setTotalCredits(sum);
  }, [activityList]);

  // credits percent change
  useEffect(() => {
    if (backendCredits === 0) {
      setPercentChange(0);
    } else if (totalCredits !== backendCredits) {
      const change = ((totalCredits - backendCredits) / backendCredits) * 100;
      setPercentChange(change);
    } else {
      setPercentChange(0);
    }
  }, [totalCredits, backendCredits]);

  const getPercentChangeText = () => {
    if (percentChange === 0) return "No change in credits 🤝";
    if (percentChange > 0)
      return `You gained +${percentChange.toFixed(1)}% credits 🎉`;
    return `You spent ${percentChange.toFixed(1)}% credits 💸`;
  };

  // CO2 Calculations (kg)
  const treeCO2 = treeList.length * 21;
  const evCO2 = evList.reduce((total, ev) => {
    const km = parseFloat(ev.range || ev.Range) || 0;
    return total + km * 0.12;
  }, 0);
  const solarCO2 = solarList.reduce((total, solar) => {
    const kwh =
      parseFloat(
        solar.energy_generation_value || solar.Energy_Generation_Value
      ) || 0;
    return total + kwh * 0.7;
  }, 0);

  const totalCO2 = treeCO2 + evCO2 + solarCO2;
  const totalCO2Tons = (totalCO2 / 1000).toFixed(1);

  const [prevCO2, setPrevCO2] = useState(0);
  const [percentCO2Change, setPercentCO2Change] = useState(0);

  useEffect(() => {
    if (prevCO2 === 0) {
      setPrevCO2(totalCO2);
      setPercentCO2Change(0);
    } else if (totalCO2 !== prevCO2) {
      const change = ((totalCO2 - prevCO2) / prevCO2) * 100;
      setPercentCO2Change(change);
      setPrevCO2(totalCO2);
    }
  }, [totalCO2]);

  const co2ChangeText =
    percentCO2Change >= 0
      ? `+${percentCO2Change.toFixed(1)}% 🌿 Higher offset!`
      : `${percentCO2Change.toFixed(1)}% 🌎 Lower offset`;

  // Value Calculations
  const co2FromEVs = evList.length * 1;
  const co2FromSolar = solarList.length * 0.5;
  const co2FromTrees = treeList.length * 0.02;

  const totalCO2Offset = co2FromEVs + co2FromSolar + co2FromTrees;
  const valueFromCO2 = totalCO2Offset * 3000;
  const valueFromSolar = solarList.length * 5000;
  const valueFromTrees = treeList.length * 2500;

  const totalValue = valueFromCO2 + valueFromSolar + valueFromTrees;
  const [prevValue, setPrevValue] = useState(0);
  const [percentValueChange, setPercentValueChange] = useState(0);

  useEffect(() => {
    if (prevValue === 0) {
      setPrevValue(totalValue);
      setPercentValueChange(0);
    } else if (totalValue !== prevValue) {
      const change = ((totalValue - prevValue) / prevValue) * 100;
      setPercentValueChange(change);
      setPrevValue(totalValue);
    }
  }, [totalValue]);

  const valueChangeText =
    percentValueChange >= 0
      ? `+${percentValueChange.toFixed(1)}% 🌿 Impact`
      : `${percentValueChange.toFixed(1)}% 🌿 Impact`;

  // Ranking
  const totalUsers = 10000;
  const maxPossibleCredits = 5000;
  const userRankPercent = 100 - (totalCredits / maxPossibleCredits) * 100;
  const displayRankPercent =
    userRankPercent < 1 ? 1 : userRankPercent.toFixed(1);
  const rankNumber = Math.floor((userRankPercent / 100) * totalUsers);
  const rankText = `Top ${displayRankPercent}% globally`;

  // ---- Recent activity filter + pagination ----
  const filteredActivities =
    activityFilter === "All"
      ? activityList
      : activityList.filter((a) => a.type === activityFilter);

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / pageSize));
  const currentPage = Math.min(activityPage, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedActivities = filteredActivities.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleFilterChange = (e) => {
    setActivityFilter(e.target.value);
    setActivityPage(1);
  };

  const handlePrevPage = () => {
    setActivityPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setActivityPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="ud-dashboard-wrapper">
      <div className="ud-dashboard">
        <div className="ud-top-bar-button">
          <h1></h1>
          <div className="ud-actions">
            <div className="flex items-center gap-4">
              <button
                className="ud-view-asset flex items-center gap-2"
                onClick={handleViewAssets}
              >
                View Assets
              </button>

              <button className="ud-quick-add" onClick={handleQuickAdd}>
                + Quick Add
              </button>
            </div>
          </div>
        </div>

        {/* Main Panels */}
        <Cardsection
          totalCredits={totalCredits}
          percentChangeText={getPercentChangeText()}
          totalCO2Tons={totalCO2Tons}
          co2ChangeText={co2ChangeText}
          totalValue={totalValue}
          valueChangeText={valueChangeText}
          rankNumber={rankNumber}
          rankText={rankText}
          evList={evList}
          solarList={solarList}
          treeList={treeList}
          treeCO2={treeCO2}
          evCO2={evCO2}
          solarCO2={solarCO2}
        />

        {/* Recent Activity */}
        <div className="ud-recent-section">
          <div className="ud-recent-header">
            <h2>Recent Activity</h2>

            <div className="ud-activity-controls">
              <select
                className="ud-activity-filter"
                value={activityFilter}
                onChange={handleFilterChange}
              >
                <option value="All">All</option>
                <option value="EV">EV</option>
                <option value="Solar">Solar</option>
                <option value="Tree">Tree</option>
              </select>

              <div className="ud-activity-pagination">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span>
                  {currentPage}/{totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="ud-activity-list">
            {loadingActivity ? (
              <div className="ud-loading-state">
                <div className="ud-spinner"></div>
                <p>Loading recent activity...</p>
              </div>
            ) : paginatedActivities.length > 0 ? (
              paginatedActivities.map((item, idx) => {
                let detailText = null;
                let titleText = "";
                let titleIcon = null;

                if (item.type === "EV") {
                  titleIcon = (
                    <FaCar
                      className="ud-activity-title-icon"
                      style={{ color: "#2196F3" }}
                    />
                  );
                  titleText = "NEW VEHICLE ADDED!";
                  detailText = (
                    <div className="ud-activity-detail-row">
                      <span className="ud-activity-detail-item">
                        <FaIndustry className="ud-detail-icon" />
                        {item.detail} {item.model}
                      </span>
                      <span className="ud-activity-detail-item">
                        <MdCategory className="ud-detail-icon" />
                        {item.category}
                      </span>
                      <span className="ud-activity-detail-item">
                        <FaCalendarAlt className="ud-detail-icon" />
                        {item.year}
                      </span>
                      <span className="ud-activity-detail-item">
                        <FaBolt className="ud-detail-icon" />
                        {item.range}
                      </span>
                      <span className="ud-activity-detail-item">
                        <FaTachometerAlt className="ud-detail-icon" />
                        {item.topSpeed}
                      </span>
                    </div>
                  );
                } else if (item.type === "Solar") {
                  titleIcon = (
                    <FaSun
                      className="ud-activity-title-icon"
                      style={{ color: "#FF9800" }}
                    />
                  );
                  titleText = "NEW SOLAR ADDED!";
                  detailText = (
                    <div className="ud-activity-detail-row">
                      <span className="ud-activity-detail-item">
                        <FaMicrochip className="ud-detail-icon" />
                        {item.detail}
                      </span>
                      <span className="ud-activity-detail-item">
                        <FaSolarPanel className="ud-detail-icon" />
                        {item.panelType}
                      </span>
                      <span className="ud-activity-detail-item">
                        <FaCalendarAlt className="ud-detail-icon" />
                        {item.year}
                      </span>
                      <span className="ud-activity-detail-item">
                        <BsLightningChargeFill className="ud-detail-icon" />
                        {item.generation}
                      </span>
                      <span className="ud-activity-detail-item">
                        <IoMdFlash className="ud-detail-icon" />
                        {item.capacity}
                      </span>
                    </div>
                  );
                } else if (item.type === "Tree") {
                  titleIcon = (
                    <FaTree
                      className="ud-activity-title-icon"
                      style={{ color: "#4CAF50" }}
                    />
                  );
                  titleText = "NEW TREE PLANTED!";
                  detailText = (
                    <div className="ud-activity-detail-row">
                      <span className="ud-activity-detail-item">
                        <GiTreeBranch className="ud-detail-icon" />
                        {item.treename}
                      </span>
                      <span className="ud-activity-detail-item">
                        <MdScience className="ud-detail-icon" />
                        {item.scientificname}
                      </span>
                      <span className="ud-activity-detail-item">
                        <FaLeaf className="ud-detail-icon" />
                        {item.treeType}
                      </span>
                      <span className="ud-activity-detail-item">
                        <FaCalendarAlt className="ud-detail-icon" />
                        {item.plantingdate}
                      </span>
                      <span className="ud-activity-detail-item">
                        <FaMapMarkerAlt className="ud-detail-icon" />
                        {item.location}
                      </span>
                      <span className="ud-activity-detail-item">
                        <FaRuler className="ud-detail-icon" />
                        {item.height}
                      </span>
                    </div>
                  );
                }

                return (
                  <ActivityItem
                    key={`${item.type}-${idx}-${item.time}`}
                    type={item.type}
                    titleIcon={titleIcon}
                    title={titleText}
                    detail={detailText}
                    time={item.time}
                    credits={item.credits}
                    imageUrl={item.imageUrl}
                  />
                );
              })
            ) : (
              <div className="ud-empty-state">
                <p>No recent activity</p>
                <p>
                  Start adding your eco-friendly assets to track your impact!
                </p>
                <button className="ud-quick-add-small" onClick={handleQuickAdd}>
                  + Add Your First Asset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
