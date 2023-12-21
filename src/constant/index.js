import { availableLanguage } from "src/translation/i18n";

export const localStorageVariable = {
  lng: "lng",
  token: "token",
  user: "user",
  currency: "currency",
  previousePage: null,
  coin: "coin",
  adsItem: "adsItem",
  createAds: "createAds",
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
  create_ads_sell: "/create-ads/sell",
  create_ads_buy: "/create-ads/buy",
  admin_ads: "/admin/ads",
  admin_exchange: "/admin/exchange",
  ads_history: "/ads-history",
  transaction: "/transaction",
  confirm: "/confirm/:id",
  p2p_management: "/p2p-management",
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
export const regularExpress = {
  checkNumber: /^[+-]?([0-9]*[.])?[0-9]*$/,
};
