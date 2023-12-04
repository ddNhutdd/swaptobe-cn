import { currency } from "../constant/currency.constant";

export const currencySetCurrent = function (payload) {
  return {
    type: currency.current,
    payload,
  };
};

export const currencySetExchange = function (payload) {
  return {
    type: currency.exchange,
    payload,
  };
};

export const currencySetFetchExchangeCount = function () {
  return {
    type: currency.fetchExchangeCount,
  };
};
