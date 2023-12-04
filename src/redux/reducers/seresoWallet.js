import {
  swaptobeWallet,
  defaultState,
  actionContent,
} from "../constant/seresoWallet.constant";

export const seresoWalletReducer = (state = defaultState, action) => {
  switch (action.type) {
    case swaptobeWallet.setShowMain:
      return {
        ...state,
        selectedCurrency: "",
        showContent: actionContent.main,
      };

    case swaptobeWallet.setShowWithdraw:
      return {
        ...state,
        showContent: actionContent.withdraw,
      };
    case swaptobeWallet.setShowDeposite:
      return {
        ...state,
        selectedCurrency: action.payload,
        showContent: actionContent.desposite,
      };

    default:
      return state;
  }
};
