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
