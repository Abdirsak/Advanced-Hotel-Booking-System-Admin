import Cookies from "js-cookie";
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
  LastFiveInvoicesAPI

  
} from "common/utils/axios/api";
import axios from "axios"
const BASE_RUL = "http://localhost:5000/api"
export const getToken = () => {
  const userData = Cookies.get("rs-account")
    ? JSON.parse(Cookies.get("rs-account"))
    : null;
  return userData ? userData.token : null;
};

export const getUserData = () => {
  const userData = Cookies.get("rs-account")
    ? JSON.parse(Cookies.get("rs-account"))
    : null;
  return userData;
};

export const getTotalReceivableAmount = async() => {
  const res = await axios.get(BASE_RUL+TotalReceivableAPI)
  // console.log(res)
  return res;
};
export const getTotalReceivedAmount = async() => {
  const res = await axios.get(BASE_RUL+TotalAmountReceivedAPI)
  // console.log(res)
  return res;
};
export const getTotalProfit = async() => {
  const res = await axios.get(BASE_RUL+TotalProfitAPI)
  // console.log(res)
  return res;
};
export const getTotalExpenses = async() => {
  const res = await axios.get(BASE_RUL+TotalExpensesAPI)
  // console.log(res)
  return res;
};
export const getTotalCustomers = async() => {
  const res = await axios.get(BASE_RUL+TotalCustomersAPI)
  // console.log(res)
  return res;
};
export const getTotalEmployees = async() => {
  const res = await axios.get(BASE_RUL+TotalEmployeesAPI)
  // console.log(res)
  return res;
};
export const getTotalUsers = async() => {
  const res = await axios.get(BASE_RUL+TotalUsersAPI)
  // console.log(res)
  return res;
};
export const getTotalSuppliers = async() => {
  const res = await axios.get(BASE_RUL+TotalSuppliersAPI)
  // console.log(res)
  return res;
};
export const getTotalProducts = async() => {
  const res = await axios.get(BASE_RUL+TotalProductsAPI)
  // console.log(res)
  return res;
};
export const getLastFiveInvoices = async() => {
  const res = await axios.get(BASE_RUL+LastFiveInvoicesAPI)
  // console.log(res)
  return res;
};


