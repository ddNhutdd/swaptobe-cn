import { availableLanguage } from "src/translation/i18n";

export const localStorageVariable = {
  lng: "lng",
  token: "token",
  user: "user",
  currency: "currency",
  previousePage: null,
};

// export const deploy_domain = "https://demo.dk-technical.vn/";
export const deploy_domain = "http://192.168.1.15:3000/wallet-2";

export const url = {
  home: "/",
  signup: "/signup",
  profile: "/profile",
  wallet: "/wallet-2",
  swap: "/swap",
  login: "/login",
  p2pTrading: "/p2p-trading",
  admin_kyc: "/admin/kyc",
  admin_exchangeRateDisparity: "/admin/exchange-rate-disparity",
};

export const api_url = {
  login: "api/user/login",
  refreshToken: "api/user/refreshToken",
};

export const showAlertType = {
  success: "success",
  error: "error",
};

export const api_status = {
  pending: "pending",
  fetching: "fetching",
  fulfilled: "fulfilled",
  rejected: "rejected",
};

export const currency = {
  vnd: "VND",
  eur: "EUR",
  usd: "USD",
};

export const defaultLanguage = availableLanguage.en;
