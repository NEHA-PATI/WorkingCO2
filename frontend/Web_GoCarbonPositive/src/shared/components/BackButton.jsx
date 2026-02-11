
import { useNavigate } from "react-router-dom";
import { fireToast } from "@shared/utils/toastService";

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
