import axios from "axios";
import { BASE_URL } from "./constants";

const apiRequest = async (method, url, data, param) => {
  try {
    const config = {
      method: method,
      url: `${BASE_URL}${url}`,
      data: data,
      params: param,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export default apiRequest;
