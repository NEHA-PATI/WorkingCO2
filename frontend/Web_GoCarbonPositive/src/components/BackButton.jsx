
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    toast.info("Going back...");

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
