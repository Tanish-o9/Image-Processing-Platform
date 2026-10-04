export const BACKEND_URL =
  "https://image-processing-platform-iylj.onrender.com";

export const getToken = () => {
  return sessionStorage.getItem("token");
};