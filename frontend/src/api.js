import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || "Analysis failed");
    }
    throw new Error("Network error. Please ensure the backend is running.");
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    return { status: "unhealthy" };
  }
};
