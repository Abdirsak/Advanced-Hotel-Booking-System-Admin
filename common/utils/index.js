import Cookies from "js-cookie";
import axios from "axios";
import {
  TotalSuppliersAPI,
  TotalEmployeesAPI,
  TotalExpensesAPI,
  TotalCustomersAPI,
  TotalUsersAPI,
  TotalProfitAPI,
  TotalProductsAPI,
  TotalAmountReceivedAPI,
  TotalReceivableAPI,
  LastFiveInvoicesAPI,
} from "common/utils/axios/api";

const BASE_URL = "http://localhost:5000/api";

// Function to get the token from cookies
export const getToken = () => {
  const userData = Cookies.get("rs-account")
    ? JSON.parse(Cookies.get("rs-account"))
    : null;
  return userData ? userData.token : null;
};

// Function to get user data from cookies
export const getUserData = () => {
  const userData = Cookies.get("rs-account")
    ? JSON.parse(Cookies.get("rs-account"))
    : null;
  return userData;
};

// Function to create authorization header
const createAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// API call to get the total receivable amount
export const getTotalReceivableAmount = async (token) => {
  console.log("00000000000000000000",token)
  const res = await axios.get(BASE_URL + TotalReceivableAPI, createAuthHeader(token));
  return res;
};

// API call to get the total received amount
export const getTotalReceivedAmount = async (token) => {
  const res = await axios.get(BASE_URL + TotalAmountReceivedAPI, createAuthHeader(token));
  return res;
};

// API call to get the total profit
export const getTotalProfit = async (token) => {
  const res = await axios.get(BASE_URL + TotalProfitAPI, createAuthHeader(token));
  return res;
};

// API call to get the total expenses
export const getTotalExpenses = async (token) => {
  const res = await axios.get(BASE_URL + TotalExpensesAPI, createAuthHeader(token));
  return res;
};

// API call to get the total customers
export const getTotalCustomers = async (token) => {
  const res = await axios.get(BASE_URL + TotalCustomersAPI, createAuthHeader(token));
  return res;
};

// API call to get the total employees
export const getTotalEmployees = async (token) => {
  const res = await axios.get(BASE_URL + TotalEmployeesAPI, createAuthHeader(token));
  return res;
};

// API call to get the total users
export const getTotalUsers = async (token) => {
  const res = await axios.get(BASE_URL + TotalUsersAPI, createAuthHeader(token));
  return res;
};

// API call to get the total suppliers
export const getTotalSuppliers = async (token) => {
  const res = await axios.get(BASE_URL + TotalSuppliersAPI, createAuthHeader(token));
  return res;
};

// API call to get the total products
export const getTotalProducts = async (token) => {
  const res = await axios.get(BASE_URL + TotalProductsAPI, createAuthHeader(token));
  return res;
};

// API call to get the last five invoices
export const getLastFiveInvoices = async (token) => {
  const res = await axios.get(BASE_URL + LastFiveInvoicesAPI, createAuthHeader(token));
  return res;
};
