import axios, { AxiosError } from "axios";

// Create axios instance with the base URL
const httpClient = axios.create({
  baseURL: "http://localhost:4000/api", // Your API base URL
});

// Request interceptor - Handle requests before sending them
httpClient.interceptors.request.use(
  (config) => {
    // Optionally modify the request config before sending
    return config; // Always return the config or a promise that resolves to it
  },
  (error: AxiosError) => {
    console.error("Request error", error);
    return Promise.reject(error); // Reject request errors so they can be handled downstream
  }
);

// Response interceptor - Handle responses or errors
httpClient.interceptors.response.use(
  (response) => {
    return response; // Always return the response or a promise that resolves to it
  },
  (error: AxiosError) => {
    console.error("Response error", error);
    // Handle global errors here (e.g., redirect to login on 401)
    if (error.response && error.response.status === 401) {
      // Example: Redirect to login page
      window.location.href = "/login"; // Adjust according to your routing mechanism
    }
    return Promise.reject(error); // Reject response errors so they can be handled downstream
  }
);

export default httpClient;
