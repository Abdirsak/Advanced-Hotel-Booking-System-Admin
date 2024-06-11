import Cookies from "js-cookie";

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
