export const actionContent = {
  main: "main",
  desposite: "desposite",
  withdraw: "withdraw",
};

export const defaultState = {
  selectedCurrency: "",
  showContent: actionContent.main,
};
export const swaptobeWallet = {
  setShowMain: "swaptobeWallet/setShowMain",
  setShowWithdraw: "swaptobeWallet/setShowWithdraw",
  setShowDeposite: "swaptobeWallet/setShowDeposite",
};

export const getShowContent = (state) => state.seresoWalletReducer.showContent;
