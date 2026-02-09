import { toast } from "react-toastify";
import { TOAST_MSG } from "./toastMessages";

const config = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
};

export const fireToast = (key, type = "success", vars = {}) => {
  let message = key
    .split(".")
    .reduce((o, i) => o?.[i], TOAST_MSG);

  if (!message) {
    console.log("Toast key not found:", key);
    return;
  }

  if (vars && typeof message === "string") {
    message = message.replace(/\{(\w+)\}/g, (_, k) =>
      vars[k] !== undefined ? String(vars[k]) : `{${k}}`
    );
  }

  toast[type](message, config);
};
