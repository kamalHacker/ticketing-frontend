import axios from "axios";
import { toastStore } from "@/lib/toastStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data;
    const status = err.response?.status;

    if (status === 400 && typeof msg === "string" && msg.includes("Cannot delete user")) {
      toastStore.show("❌ Cannot delete user — they still have assigned or created tickets.");
    }

    if (status === 401) {
      toastStore.show("❌ Invalid email or password.");
    }

    if (status === 403 && msg === "ROLE_CHANGED") {
      toastStore.show("⚠️ Your role has changed. Please log in again.");
    }

    if (status === 403 && msg === "ACCOUNT_DELETED") {
      toastStore.show("⚠️ Your account has been deleted by admin.");
    }

    return Promise.reject(err);
  }
);

export default api;

