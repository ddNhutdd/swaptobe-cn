import { swaptobeWallet } from "../constant/seresoWallet.constant";

export const swaptoveWalletShowMainActionCreator = function () {
  return {
    type: swaptobeWallet.setShowMain,
  };
};

export const swaptoveWalletShowWithdrawActionCreator = function () {
  return {
    type: swaptobeWallet.setShowWithdraw,
  };
};

export const swaptoveWalletShowDepositeActionCreator = function (payload) {
  return {
    type: swaptobeWallet.setShowDeposite,
    payload,
  };
};
