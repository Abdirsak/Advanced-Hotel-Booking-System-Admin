import Cookies from "js-cookie";
import {
  TotalSuppliersAPI,
  TotalEmployeesAPI,
  TotalExpensesAPI,
  TotalCustomersAPI,
  TotalUsersAPI,
  TotalProfitAPI,
  
  TotalAmountReceivedAPI,
  TotalReceivableAPI

  
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
  return res;
};


