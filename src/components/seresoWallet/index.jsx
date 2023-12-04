import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import FormWithdraw from "./walletWithdraw";
import SeresoWalletList from "./walletList";
import { useDispatch, useSelector } from "react-redux";
import {
  actionContent,
  getShowContent,
} from "src/redux/constant/seresoWallet.constant";
import { swaptoveWalletShowMainActionCreator as seresoWalletShowMainActionCreator } from "src/redux/actions/seresoWallet.action";
import SeresoWalletDeposit from "./walletDeposite";
import { formatStringNumberCultureUS, getLocalStorage } from "src/util/common";
import { localStorageVariable } from "src/constant";
import i18n, { availableLanguage } from "src/translation/i18n";
import { getCoinTotalValue } from "src/redux/constant/coin.constant";
function SwaptobeWallet() {
  //
  const { t } = useTranslation();
  const showActionContent = useSelector(getShowContent);
  const totalValue = useSelector(getCoinTotalValue);
  const dispatch = useDispatch();
  useEffect(() => {
    //
    const language =
      getLocalStorage(localStorageVariable.lng) || availableLanguage.vi;
    i18n.changeLanguage(language);
    //
    const element = document.querySelector(".swaptobe-wallet");
    element.classList.add("fadeInBottomToTop");
  }, []);
  //
  const renderActionContent = () => {
    switch (showActionContent) {
      case actionContent.main:
        return <SeresoWalletList />;
      case actionContent.withdraw:
        return <FormWithdraw />;
      case actionContent.desposite:
        return <SeresoWalletDeposit />;
    }
  };
  const backToActionContentMainClickHandle = (e) => {
    dispatch(seresoWalletShowMainActionCreator());
  };
  return (
    <>
      <div className="swaptobe-wallet">
        <div className="container">
          <h5 className="title">
            <span
              style={
                showActionContent !== actionContent.main
                  ? { display: "none" }
                  : {}
              }
            >
              {t("walletOverview")}
            </span>

            <span
              style={
                showActionContent !== actionContent.withdraw
                  ? { display: "none" }
                  : {}
              }
              onClick={backToActionContentMainClickHandle}
            >
              <img src="./img/left-arrow.png" alt="" />
              {t("withdraw")}
            </span>

            <span
              style={
                showActionContent !== actionContent.desposite
                  ? { display: "none" }
                  : {}
              }
              onClick={backToActionContentMainClickHandle}
            >
              <img src="./img/left-arrow.png" alt="" />
              {t("deposit")} Cryto
            </span>
          </h5>
          <div className="info">
            <div className="left">
              <div>{t("estimatedAssetsValue")}</div>
              <div>${formatStringNumberCultureUS(totalValue.toString())}</div>
              <div>≈ 0 VND</div>
            </div>
            <div className="right">
              <div className="right-text">
                {t("startBuyingAndSellingCryptoCurrencies")}
              </div>
              <div className="right-actions">
                <button className="buy">{t("buyNow")}</button>
                <button className="sell">{t("sellNow")}</button>
              </div>
            </div>
          </div>
          {renderActionContent()}
        </div>
      </div>
    </>
  );
}
export default SwaptobeWallet;
