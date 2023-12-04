import { localStorageVariable } from "src/constant";
import { getLocalStorage } from "src/util/common";

export const currency = {
  current: "currency/setCurrent",
  exchange: "currency/setExchange",
  fetchExchangeCount: "fetchExchangeCount/setFetchExchangeCount",
};

export const defaultState = {
  current: getLocalStorage(localStorageVariable.currency) || "USD",
  exchange: [],
  fetchExchangeCount: 0,
};

export const getCurrent = (state) => state.currencyReducer.current;
export const getExchange = (state) => state.currencyReducer.exchange;

export const getFetchExchangeCount = (state) =>
  state.currencyReducer.fetchExchangeCount;
