import { currency } from "../constant/currency.constant";

export const currencySetCurrent = function (payload) {
  return {
    type: currency.current,
    payload,
  };
};
