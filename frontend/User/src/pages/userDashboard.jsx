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
// Navbar and Footer are provided by BaseLayout - no need to import here
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
  const [openIndex, setOpenIndex] = useState(null);

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

      console.log("✅ EV Data:", evData);
      console.log("✅ Solar Data:", solarData);
      console.log("✅ Tree Data:", treeData);

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
    if (evs.length > 0) {
      console.log("🔍 EV Fields:", Object.keys(evs[0]));
      console.log("🔍 Sample EV:", evs[0]);
    }
    if (solars.length > 0) {
      console.log("🔍 Solar Fields:", Object.keys(solars[0]));
      console.log("🔍 Sample Solar:", solars[0]);
    }
    if (trees.length > 0) {
      console.log("🔍 Tree Fields:", Object.keys(trees[0]));
      console.log("🔍 Sample Tree:", trees[0]);
    }

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
        treename: treename,
        scientificname: scientificname,
        plantingdate: plantingYear,
        location: location,
        height: heightM ? `${heightM}m` : "N/A",
        dbh: dbh ? `${dbh}cm` : "N/A",
        treeType: "Deciduous",
        imageUrl: imageUrl,
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

    allActivities.sort((a, b) => {
      const timeA = new Date(a.time);
      const timeB = new Date(b.time);
      return timeB - timeA;
    });

    setActivityList(allActivities);
    console.log("📋 Activity List:", allActivities);
  };

  // useEffect(() => {
  //   history.pushState(null, null, window.location.href);
  //   window.onpopstate = function () {
  //     history.go(1);
  //   };
  //   return () => {
  //     window.onpopstate = null;
  //   };
  // }, []);

  const handleQuickAdd = () => {
    navigate("/upload");
  };

  const handleViewAssets = () => {
    navigate("/view-assets");
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const sum = activityList.reduce((acc, item) => {
      const creditsValue = parseInt(item.credits.replace("+", ""), 10) || 0;
      return acc + creditsValue;
    }, 0);
    setTotalCredits(sum);
  }, [activityList]);

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
    if (percentChange === 0) {
      return "No change in credits 🤝";
    } else if (percentChange > 0) {
      return `You gained +${percentChange.toFixed(1)}% credits 🎉`;
    } else {
      return `You spent ${percentChange.toFixed(1)}% credits 💸`;
    }
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
  const co2FromEVs = evList.length * 1; // tons
  const co2FromSolar = solarList.length * 0.5; // tons
  const co2FromTrees = treeList.length * 0.02; // tons

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
  const rankValue = `#${rankNumber}`;

  const faqData = [
    {
      question: "How to earn credits?",
      answer:
        "You can earn credits by logging EV trips, planting trees, and generating solar energy. Each action contributes specific credit points to your account.",
    },
    {
      question: "How to redeem credits?",
      answer:
        "Credits can be redeemed through our partner stores, or used to offset your carbon footprint. Visit the Redeem page to see all options.",
    },
    {
      question: "What are green credits?",
      answer:
        "Green credits are points awarded for eco-friendly actions. They help you track your positive environmental impact and can be exchanged for rewards.",
    },
    {
      question: "How do I track my solar energy?",
      answer:
        "Your solar panel data is updated automatically. You can also manually upload meter readings on the Upload page for more accurate tracking.",
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard">
        <div className="top-bar-button">
          <h1></h1>
          <div className="actions">
            <div className="flex items-center gap-4">
              <button
                className="view-asset flex items-center gap-2"
                onClick={handleViewAssets}
              >
                View Assets
              </button>

              <button className="quick-add" onClick={handleQuickAdd}>
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
        <div className="recent-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {loadingActivity ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading recent activity...</p>
              </div>
            ) : activityList.length > 0 ? (
              activityList.map((item, idx) => {
                let detailText = null;
                let titleText = "";
                let titleIcon = null;

                if (item.type === "EV") {
                  titleIcon = (
                    <FaCar
                      className="activity-title-icon"
                      style={{ color: "#2196F3" }}
                    />
                  );
                  titleText = "NEW VEHICLE ADDED!";
                  detailText = (
                    <div className="activity-detail-row">
                      <span className="activity-detail-item">
                        <FaIndustry className="detail-icon" />
                        {item.detail} {item.model}
                      </span>
                      <span className="activity-detail-item">
                        <MdCategory className="detail-icon" />
                        {item.category}
                      </span>
                      <span className="activity-detail-item">
                        <FaCalendarAlt className="detail-icon" />
                        {item.year}
                      </span>
                      <span className="activity-detail-item">
                        <FaBolt className="detail-icon" />
                        {item.range}
                      </span>
                      <span className="activity-detail-item">
                        <FaTachometerAlt className="detail-icon" />
                        {item.topSpeed}
                      </span>
                    </div>
                  );
                } else if (item.type === "Solar") {
                  titleIcon = (
                    <FaSun
                      className="activity-title-icon"
                      style={{ color: "#FF9800" }}
                    />
                  );
                  titleText = "NEW SOLAR ADDED!";
                  detailText = (
                    <div className="activity-detail-row">
                      <span className="activity-detail-item">
                        <FaMicrochip className="detail-icon" />
                        {item.detail}
                      </span>
                      <span className="activity-detail-item">
                        <FaSolarPanel className="detail-icon" />
                        {item.panelType}
                      </span>
                      <span className="activity-detail-item">
                        <FaCalendarAlt className="detail-icon" />
                        {item.year}
                      </span>
                      <span className="activity-detail-item">
                        <BsLightningChargeFill className="detail-icon" />
                        {item.generation}
                      </span>
                      <span className="activity-detail-item">
                        <IoMdFlash className="detail-icon" />
                        {item.capacity}
                      </span>
                    </div>
                  );
                } else if (item.type === "Tree") {
                  titleIcon = (
                    <FaTree
                      className="activity-title-icon"
                      style={{ color: "#4CAF50" }}
                    />
                  );
                  titleText = "NEW TREE PLANTED!";
                  detailText = (
                    <div className="activity-detail-row">
                      <span className="activity-detail-item">
                        <GiTreeBranch className="detail-icon" />
                        {item.treename}
                      </span>
                      <span className="activity-detail-item">
                        <MdScience className="detail-icon" />
                        {item.scientificname}
                      </span>
                      <span className="activity-detail-item">
                        <FaLeaf className="detail-icon" />
                        {item.treeType}
                      </span>
                      <span className="activity-detail-item">
                        <FaCalendarAlt className="detail-icon" />
                        {item.plantingdate}
                      </span>
                      <span className="activity-detail-item">
                        <FaMapMarkerAlt className="detail-icon" />
                        {item.location}
                      </span>
                      <span className="activity-detail-item">
                        <FaRuler className="detail-icon" />
                        {item.height}
                      </span>
                    </div>
                  );
                }

                return (
                  <ActivityItem
                    key={idx}
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
              <div className="empty-state">
                <p>No recent activity</p>
                <p>
                  Start adding your eco-friendly assets to track your impact!
                </p>
                <button className="quick-add-small" onClick={handleQuickAdd}>
                  + Add Your First Asset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`faq-item ${openIndex === index ? "open" : ""}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  {item.question}
                  <span className="faq-icon">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </div>
                <div
                  className="faq-answer"
                  style={{
                    maxHeight: openIndex === index ? "200px" : "0",
                    opacity: openIndex === index ? 1 : 0,
                  }}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
