export const BACKEND_URL = import.meta.env.VITE_API_URL || "";

export const getToken = () => {
  return sessionStorage.getItem("token");
};
