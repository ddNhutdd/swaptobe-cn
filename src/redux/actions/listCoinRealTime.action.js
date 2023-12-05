import { listCoinRealTimeConstant } from "../constant/listCoinRealTime.constant";

export const setListCoinRealtime = function (payload) {
  return {
    type: listCoinRealTimeConstant.setListCoinRealTime,
    payload,
  };
};
