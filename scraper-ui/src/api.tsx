// src/api.ts
import axios from "axios";

// Set the base URL for the API requests
const api = axios.create({
  baseURL: "https://backend-f7q7.onrender.com/", // Replace with your FastAPI backend URL
  headers: {
    "Content-Type": "application/json", // Ensure content type is set
  },
});

export default api;
