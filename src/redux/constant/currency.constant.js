import { localStorageVariable } from "src/constant";
import { getLocalStorage } from "src/util/common";

export const currency = {
  current: "currency/setCurrent",
};

export const defaultState = {
  current: getLocalStorage(localStorageVariable.currency) || "USD",
};

export const getCurrent = (state) => state.currencyReducer.current;
