/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import FormWithdraw from "./walletWithdraw";
import SeresoWalletList from "./walletList";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import SeresoWalletDeposit from "./walletDeposite";
import {
  formatStringNumberCultureUS,
  getLocalStorage,
  parseURLParameters,
  setLocalStorage,
} from "src/util/common";
import {
  currency,
  defaultLanguage,
  localStorageVariable,
  url,
} from "src/constant";
import i18n from "src/translation/i18n";
import { getCoinTotalValue } from "src/redux/constant/coin.constant";
import { getCurrent, getExchange } from "src/redux/constant/currency.constant";
import { coinSetCoin } from "src/redux/actions/coin.action";
import {
  actionContent,
  getShow,
  setShow,
} from "src/redux/reducers/wallet2Slice";
function SwaptobeWallet() {
  //
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const { search } = useLocation();
  const totalValue = useSelector(getCoinTotalValue);
  const userSelectedCurrentcy = useSelector(getCurrent);
  const exchange = useSelector(getExchange);
  const isLogin = useSelector((root) => root.loginReducer.isLogin);
  const dispatch = useDispatch();
  const showActionContent = useSelector(getShow);
  useEffect(() => {
    // check is login
    if (!isLogin) {
      setLocalStorage(localStorageVariable.previousePage, { ...location });
      const { coin } = useParams;
      dispatch(coinSetCoin(coin ?? "BTC"));
      history.push(url.login);
      return;
    }
    const { username, coin } = parseURLParameters(search); // have params into url
    if (coin) dispatch(coinSetCoin(coin));
    if (username) dispatch(setShow(actionContent.withdraw));
    //
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
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
  const sellBuyNowHandleClick = function () {
    if (isLogin) {
      history.push(url.p2pTrading);
    } else {
      history.push(url.login);
    }
  };
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
    dispatch(setShow(actionContent.main));
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
                {userSelectedCurrentcy === currency.usd && " USD"}
                {userSelectedCurrentcy === currency.eur && " EUR"}
                {userSelectedCurrentcy === currency.vnd && " VND"}
              </div>
            </div>
            <div className="right">
              <div className="right-text">
                {t("startBuyingAndSellingCryptoCurrencies")}
              </div>
              <div className="right-actions">
                <button onClick={sellBuyNowHandleClick} className="buy">
                  {t("buyNow")}
                </button>
                <button onClick={sellBuyNowHandleClick} className="sell">
                  {t("sellNow")}
                </button>
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
