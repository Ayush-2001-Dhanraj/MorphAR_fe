import axios from "axios";
import { BASE_URL } from "./constants";

const apiRequest = async (method, url, data, param) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      data,
      params: param,
    };

    if (data instanceof FormData) {
      config.headers = { "Content-Type": "multipart/form-data" };
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return error.response?.data || { message: "Unknown error" };
  }
};

export default apiRequest;
