import { currency } from "../constant/currency.constant";
import { defaultState } from "../constant/currency.constant";

export const currencyReducer = (state = defaultState, action) => {
  switch (action.type) {
    case currency.current: {
      console.log(action.payload);
      return {
        ...state,
        current: action.payload,
      };
    }

    default:
      return state;
  }
};
