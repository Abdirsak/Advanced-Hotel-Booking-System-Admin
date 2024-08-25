import axios from "axios";
import { getCookie } from "cookies-next";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT,
  headers: {
    Accept: "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = getCookie("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const request = async (options) => {
  try {
    const response = await client(options);
    console.log("response: ", response);
    return response;
  } catch (error) {
    console.error("API request failed: ", error);
    throw error;
  }
};

export default request;
