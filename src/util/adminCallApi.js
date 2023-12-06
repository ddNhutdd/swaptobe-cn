import { axiosService } from "./service";

export const getKycUserPendding = function (data) {
  try {
    return axiosService.post("/api/admin/getKycUserPendding", data);
  } catch (error) {
    console.log(error);
  }
};
