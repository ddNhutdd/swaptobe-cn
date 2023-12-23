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
import {
  getTotalAssetsBtcRealTime,
  getTotalAssetsRealTime,
} from "src/redux/constant/listCoinRealTime.constant";
import i18n from "src/translation/i18n";
export default function Header1({ history }) {
  //
  const { isLogin, username } = useSelector((root) => root.loginReducer);
  const userSelectedCurrency = useSelector(getCurrent);
  const totalAssetsRealTime = useSelector(getTotalAssetsRealTime);
  const totalAssetsBtcRealTime = useSelector(getTotalAssetsBtcRealTime);
  const exchange = useSelector(getExchange);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userMenuElement = useRef();
  const walletMenuElement = useRef();
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
  //
  const showMoney = function (usd, currency, listExchange) {
    if (!usd || !currency || !listExchange || listExchange.length <= 0)
      return -1;
    const rate = listExchange.find((item) => item.title === currency).rate;
    return usd * rate;
  };
  const logout = () => {
    localStorage.removeItem(localStorageVariable.user);
    localStorage.removeItem(localStorageVariable.token);
    removeLocalStorage(localStorageVariable.currency);
    dispatch(currencySetCurrent(currency.usd));
    removeLocalStorage(localStorageVariable.lng);
    removeLocalStorage(localStorageVariable.coin);
    history.push(url.home);
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
  return (
    <header className="header1">
      <div className="container">
        {isLogin ? (
          <>
            <div className="header1__item" onClick={walletOnClickHandle}>
              {t("wallets")}
              <div ref={walletMenuElement} className="header1__subMenu wallet">
                <div className="header1__subMenu__user-info">
                  <div className="header1__subMenu-item --no-hover">
                    {t("totalValue")} <i className="fa-regular fa-eye"></i>
                  </div>
                  <div className="header1__subMenu-item">
                    <div className="header1_icon-container">
                      <i className="fa-brands fa-bitcoin"></i>
                    </div>
                    {totalAssetsBtcRealTime}
                  </div>
                  <div className="header1__subMenu-item">
                    <div className="header1_icon-container">
                      <i className="fa-solid fa-dollar-sign"></i>
                    </div>
                    <div id="money">
                      {formatStringNumberCultureUS(
                        showMoney(
                          totalAssetsRealTime,
                          userSelectedCurrency,
                          exchange
                        ).toFixed(3)
                      )}{" "}
                      {`${userSelectedCurrency}`}
                    </div>
                  </div>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    walletMenuElement.current.classList.remove("show");
                    history.push(url.wallet);
                  }}
                  className="header1__subMenu-item --mt"
                >
                  <div className="header1_icon-container">
                    <i className="fa-solid fa-wallet"></i>
                  </div>
                  {t("wallet")}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    walletMenuElement.current.classList.remove("show");
                    history.push(url.ads_history);
                  }}
                  className="header1__subMenu-item"
                >
                  <div className="header1_icon-container">
                    <i className="fa-solid fa-rectangle-ad"></i>
                  </div>
                  {t("advertisingHistory")}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    walletMenuElement.current.classList.remove("show");
                    history.push(url.p2p_management);
                  }}
                  className="header1__subMenu-item"
                >
                  <div className="header1_icon-container">
                    <i className="fa-solid fa-comments-dollar"></i>
                  </div>
                  {t("p2pHistory")}
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
                  <div className="header1_icon-container">
                    <i className="fa-regular fa-user"></i>
                  </div>
                  {t("profile")}
                </div>
                <div onClick={logout} className="header1__subMenu-item">
                  <div className="header1_icon-container">
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  </div>
                  {t("logOut")}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            className="header1__item"
            onClick={() => history.push(url.login)}
          >
            {t("login")} / {t("register")}
          </div>
        )}
      </div>
    </header>
  );
}
