import { axiosService } from "./service";

export const createWalletApi = function (coinName) {
  try {
    return axiosService.post("/api/user/createWallet", {
      symbol: coinName,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getWalletApi = function () {
  try {
    return axiosService.post("/api/user/getWallet");
  } catch (error) {
    console.log(error);
  }
};

export const getHistorySwapApi = function (data) {
  try {
    return axiosService.post("/api/swap/historyswap", data);
  } catch (error) {
    console.log(error);
  }
};

export const getDepositHistoryApi = function (data) {
  try {
    return axiosService.post("/api/blockico/getblocks", data);
  } catch (error) {
    console.log(error);
  }
};

export const swapCoinApi = function (data) {
  try {
    return axiosService.post("/api/swap/swap", data);
  } catch (error) {
    console.log(error);
  }
};

export const transferToAddress = function (data) {
  try {
    return axiosService.post("/api/user/transferToAddress", data);
  } catch (error) {
    console.log(error);
  }
};
export const getHistoryWidthdraw = function (data) {
  try {
    return axiosService.post("/api/user/gethistorywidthdraw", data);
  } catch (error) {
    console.log(error);
  }
};
export const transferToUsername = function (data) {
  try {
    return axiosService.post("/api/user/transferToUsername", data);
  } catch (error) {
    console.log(error);
  }
};

export const historytransfer = function (data) {
  try {
    return axiosService.post("/api/user/historytransfer", data);
  } catch (error) {
    console.log(error);
  }
};

export const getExchange = function () {
  try {
    return axiosService.post("/api/exchange/getExchange");
  } catch (error) {
    console.log(error);
  }
};

export const uploadKyc = function (data) {
  try {
    return axiosService.post("/api/uploadKyc", data);
  } catch (error) {
    console.log(error);
  }
};
