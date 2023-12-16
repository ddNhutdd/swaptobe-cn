import { axiosService } from "./service";
export const getKycUserPendding = function (data) {
  try {
    return axiosService.post("/api/admin/getKycUserPendding", data);
  } catch (error) {
    console.log(error);
  }
};
export const activeUserKyc = function (data) {
  try {
    return axiosService.post("/api/admin/activeUserKyc", data);
  } catch (error) {
    console.log(error);
  }
};
export const cancelUserKyc = function (data) {
  try {
    return axiosService.post("/api/admin/cancelUserKyc", data);
  } catch (error) {
    console.log(error);
  }
};
export const getAllAds = function (data) {
  try {
    return axiosService.post("/api/p2pBank/getAllAds", data);
  } catch (error) {
    console.log(error);
  }
};
export const getAllAdsPending = function (data) {
  try {
    return axiosService.post("/api/p2pBank/getAllAdsPendding", data);
  } catch (error) {
    console.log(error);
  }
};
export const getAdsToWhere = function (data) {
  try {
    return axiosService.post("/api/p2pBank/getAdsToWhere", data);
  } catch (error) {
    console.log(error);
  }
};
export const confirmAds = function (data) {
  try {
    return axiosService.post("/api/p2pBank/confirmAds", data);
  } catch (error) {
    console.log(error);
  }
};
export const refuseAds = function (data) {
  try {
    return axiosService.post("/api/p2pBank/refuseAds", data);
  } catch (error) {
    console.log(error);
  }
};
export const addExchange = function (data) {
  try {
    return axiosService.post("/api/exchange/addExchange", data);
  } catch (error) {
    console.log(error);
  }
};
export const editExchange = function (data) {
  try {
    return axiosService.post("/api/exchange/editExchange", data);
  } catch (error) {
    console.log(error);
  }
};
