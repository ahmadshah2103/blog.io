import axios from "axios";
import config from "@/config";
import { statusToTitle } from "./constants";
import { useNotify } from "@/hooks/useNotify";

const { showError, showSuccess } = useNotify();

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => localStorage.getItem("token");

// Add request interceptor to add the token to the Authorization header
apiClient.interceptors.request.use(
  (requestConfig) => {
    const token = getAuthToken();
    if (token) {
      requestConfig.headers["Authorization"] = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => {
    const { method } = response.config || {};
    const status = response.status;

    // // Show success notification for methods other than GET
    // if (
    //   method &&
    //   method.toLowerCase() !== "get" &&
    //   status >= 200 &&
    //   status < 300
    // ) {
    //   showSuccess({
    //     title: statusToTitle[status] || "Success",
    //     message: response.data?.message || "Operation completed successfully!",
    //   });
    // }

    return response;
  },
  (error) => {
    const config = error.config || {};
    const status = error.response?.status || 500;

    // Handle authentication errors (401 Unauthorized or 403 Forbidden)
    if (status === 401 || status === 403) {
      // Clear authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      showError({
        title: statusToTitle[status] || "Error",
        message: `${"Session expired"} (Status: ${status})`,
      });

      // Redirect to login page
      window.location.href = "/auth/login";

      return Promise.reject({
        message: "Your session has expired. Please log in again.",
        status,
        isAuthError: true,
      });
    }

    // Handle other errors as before
    if (!config.suppressNotifications) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unexpected error occurred";

      showError({
        title: statusToTitle[status] || "Error",
        message: `${message} (Status: ${status})`,
      });

      return Promise.reject({
        message,
        status,
        data: error.response?.data || {},
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
