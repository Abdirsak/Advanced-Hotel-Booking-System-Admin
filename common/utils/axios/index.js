import axios from "axios";
import { getCookie } from "cookies-next";
import Cookies from "js-cookie";
import Router from "next/router"; // Import Next.js router for redirection

// Create an axios client with default options
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
    const onSuccess = (response) => response;

    const response = await client(options);
    console.log("response: ", response);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // If response status is 401, clear the token cookie and redirect to login
      Cookies.remove("token"); // Clear the token cookie
      Cookies.remove("rs-account"); // Clear the token cookie
      Router.push("/auth/login"); // Redirect to login page
    } else {
      throw error; // Rethrow any other errors
    }
  }
};

export default request;
