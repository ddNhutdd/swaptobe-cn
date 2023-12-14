/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslation } from "react-i18next";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../function/showToast";
import { useEffect, useRef } from "react";
import {
  currency,
  defaultLanguage,
  localStorageVariable,
  url,
} from "src/constant";
import {
  formatStringNumberCultureUS,
  getLocalStorage,
  removeLocalStorage,
} from "src/util/common";
import { currencySetCurrent } from "src/redux/actions/currency.action";
import { getCurrent, getExchange } from "src/redux/constant/currency.constant";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import { getUserWallet } from "src/redux/constant/coin.constant";
import i18n from "src/translation/i18n";
export default function Header1({ history }) {
  //
  const { isLogin, username } = useSelector((root) => root.loginReducer);
  const userSelectedCurrency = useSelector(getCurrent);
  const exchange = useSelector(getExchange);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const listOwnedCoins = useSelector(getUserWallet);
  const userMenuElement = useRef();
  const walletMenuElement = useRef();
  const listOnCoinRealtime = useSelector(getListCoinRealTime);
  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    //
    const element = document.querySelector(".header1");
    if (element) element.classList.add("fadeInTopToBottom");
    //
    window.addEventListener("click", closeAllSubMenu);
    //
    return () => {
      window.removeEventListener("click", closeAllSubMenu);
    };
  }, []);
  useEffect(() => {
    if (
      !exchange ||
      exchange.length <= 0 ||
      !userSelectedCurrency ||
      !listOwnedCoins ||
      listOwnedCoins <= 0 ||
      listOnCoinRealtime?.current ||
      listOnCoinRealtime?.current <= 0
    )
      return;
    const filterExchange =
      exchange.filter((item) => item.title === userSelectedCurrency)[0]?.rate ??
      0;
    const price =
      listOnCoinRealtime.filter((item) => item.name === "BTC")[0]?.price || 0;
    const amountCoinBTC = listOwnedCoins["btc_balance"];
    const result = filterExchange * amountCoinBTC * price;
    const showMoneyElement = document.getElementById("money");
    if (showMoneyElement)
      showMoneyElement.innerHTML = `${formatStringNumberCultureUS(
        result.toFixed(3)
      )} ${userSelectedCurrency}`;
  }, [exchange, userSelectedCurrency, listOnCoinRealtime]);
  //
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    removeLocalStorage(localStorageVariable.currency);
    dispatch(currencySetCurrent(currency.usd));
    removeLocalStorage(localStorageVariable.lng);
    removeLocalStorage(localStorageVariable.coin);
    history.push("/");
    dispatch({ type: "USER_LOGOUT" });
    showToast("success", "Logged out");
  };
  const userNameOnClickHandle = function (e) {
    e.stopPropagation();
    userMenuElement.current.classList.toggle("show");
    walletMenuElement.current.classList.remove("show");
  };
  const walletOnClickHandle = function (e) {
    e.stopPropagation();
    walletMenuElement.current.classList.toggle("show");
    userMenuElement.current.classList.remove("show");
  };
  const closeAllSubMenu = function () {
    if (userMenuElement.current && walletMenuElement.current) {
      userMenuElement.current.classList.remove("show");
      walletMenuElement.current.classList.remove("show");
    }
  };

  const amountCoinBTC = function () {
    return listOwnedCoins["btc_balance"];
  };
  return (
    <header className="header1">
      <div className="container">
        {isLogin ? (
          <>
            <div className="header1__item" onClick={walletOnClickHandle}>
              {t("wallets")}
              <div ref={walletMenuElement} className="header1__subMenu wallet">
                <div className="header1__subMenu__user-info">
                  <div>
                    {t("totalValue")} <i className="fa-regular fa-eye"></i>
                  </div>
                  <div>BTC: {amountCoinBTC()} coins</div>
                  <div id="money">00000</div>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    walletMenuElement.current.classList.remove("show");
                    history.push(url.wallet);
                  }}
                  className="header1__subMenu-item"
                >
                  {t("wallets")}
                </div>
                <div className="header1__subMenu-item">{t("p2PHistory")} </div>
                <div className="header1__subMenu-item">
                  {t("instantTradeHistory")}
                </div>
                <div className="header1__subMenu-item">{t("swapHistory")}</div>
                <div className="header1__subMenu-item">
                  {t("waveRidingHistory")}
                </div>
              </div>
            </div>
            <div className="header1__item" onClick={userNameOnClickHandle}>
              {username}
              <div ref={userMenuElement} className="header1__subMenu">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    userMenuElement.current.classList.remove("show");
                    history.push(url.profile);
                  }}
                  className="header1__subMenu-item"
                >
                  <i className="fa-regular fa-user"></i>
                  {t("profile")}
                </div>
                <div onClick={logout} className="header1__subMenu-item">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  {t("logOut")}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="header1__item" onClick={() => history.push("/login")}>
            {t("login")} / {t("register")}
          </div>
        )}
      </div>
    </header>
  );
}
