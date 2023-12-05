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
import { currency, localStorageVariable } from "src/constant";
import i18n, { availableLanguage } from "src/translation/i18n";
import { getCoinTotalValue } from "src/redux/constant/coin.constant";
import { getCurrent, getExchange } from "src/redux/constant/currency.constant";
function SwaptobeWallet() {
  //
  const { t } = useTranslation();
  const showActionContent = useSelector(getShowContent);
  const totalValue = useSelector(getCoinTotalValue);
  const userSelectedCurrentcy = useSelector(getCurrent);
  const exchange = useSelector(getExchange);
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
  useEffect(() => {
    if (!exchange || exchange.length <= 0 || !userSelectedCurrentcy) return;
    const rate =
      exchange.filter((item) => item.title === userSelectedCurrentcy)[0]
        ?.rate || 0;
    const result = formatStringNumberCultureUS((totalValue * rate).toFixed(3));
    const ele = document.getElementById("showTotalValue");
    if (ele) ele.innerHTML = result;
  }, [userSelectedCurrentcy, exchange, totalValue]);
  //
  const renderActionContent = () => {
    switch (showActionContent) {
      case actionContent.main:
        return <SeresoWalletList />;
      case actionContent.withdraw:
        return <FormWithdraw />;
      case actionContent.desposite:
        return <SeresoWalletDeposit />;
      default:
        return;
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
              <img src="./img/left-arrow.png" alt="left-arrow" />
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
              <img src="./img/left-arrow.png" alt="left-arrow" />
              {t("deposit")} Cryto
            </span>
          </h5>
          <div className="info">
            <div className="left">
              <div>{t("estimatedAssetsValue")}</div>
              <div>
                <span id="showTotalValue"></span>
                {userSelectedCurrentcy === currency.usd && "$"}
                {userSelectedCurrentcy === currency.eur && "€"}
                {userSelectedCurrentcy === currency.vnd && "đ"}
              </div>
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
