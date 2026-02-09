import "../styles/user/BackButton.css";
import { useNavigate } from "react-router-dom";
import { fireToast } from "../services/user/toastService.js";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    fireToast("INFO.BACK", "info");

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <button className="page-back-btn" onClick={handleBack}>
      ← Back
    </button>
  );
};

export default BackButton;
