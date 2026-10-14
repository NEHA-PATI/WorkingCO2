import { ENV } from "@config/env";

const BASE_URL = ENV.REWARD_SERVICE_URL;

const apiClient = async ({
  url,
  method = "GET",
  data = null,
  isFormData = false,
}) => {
  const token = localStorage.getItem("authToken");

  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers,
      body: data
        ? isFormData
          ? data
          : JSON.stringify(data)
        : null,
    });
  } catch (err) {
    throw new Error("Network error: Unable to reach server");
  }

  let result;

  try {
    result = await response.json();
  } catch (err) {
    throw new Error("Server did not return valid JSON");
  }

  if (!response.ok) {
    throw new Error(result?.message || "API error");
  }

  return result;
};

export default apiClient;
