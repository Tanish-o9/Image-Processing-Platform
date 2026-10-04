export const ML_URL = "http://localhost:3000/api/analysis";

export const BACKEND_URL = "http://localhost:3000";

export const getToken = () => {
  return sessionStorage.getItem("token");
};