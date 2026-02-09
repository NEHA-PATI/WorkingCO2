import { toast } from "react-toastify";
import { TOAST_MSG } from "./toastMessages";

const config = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
};

export const fireToast = (key, type = "success") => {

  const message = key
    .split(".")
    .reduce((o, i) => o?.[i], TOAST_MSG);

  if (!message) {
    console.log("Toast key not found:", key);
    return;
  }

  toast[type](message, config);
};
